const express = require('express')
const Studio = require('../models/studio')
const User = require('../models/user')
const Album = require('../models/album')
const auth = require('../middleware/auth')
const speakeasy = require('speakeasy');
const twilio = require('twilio');
const OtpSchema = require('../models/otpschema'); // Assuming you've imported the OTP schema
const sharp = require('sharp')
const multer = require('multer');

const router = new express.Router()

router.post('/sendotp', async (req, res) => {
    console.log("sendotp = ");

    let data;

    // Attempt to parse req.body as JSON
    try {
        const rawBody = req.body.toString('utf8');
        data = JSON.parse(rawBody);
    } catch (error) {
        // If parsing fails, use req.body as a string
        data = req.body;
    }


    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    const secret = speakeasy.generateSecret();
    const token = speakeasy.totp({
      secret: secret.base32,
      encoding: 'base32',
    });
    client.messages
    .create({
        body: `Hello, Your OTP code is: ${token}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: data.mobile,
    })
    .then((message) => {
        console.log('Message SID:', message.sid); // Unique identifier for the sent message
        console.log('Message Status:', message.status); // Status of the message (e.g., "sent", "delivered", "failed")
        const newOTP = new OtpSchema({
            otp: token, // Replace with the generated OTP
            to: data.mobile,
            expired_at: new Date(new Date().getTime() + 1 * 60 * 1000), // OTP expires in 10 minutes
        });
        newOTP.save().then((otpDoc) => {
            console.log('OTP created successfully:', otpDoc);
            // Proceed with sending OTP to the user or other actions
            res.status(201).send( otpDoc )
          })
          .catch((error) => {
            console.error('Error creating OTP:', error);
            // Handle error
          });
        // You can handle the status here, e.g., update your database with the delivery status
    })
    .catch((error) => {
        console.error('Error sending message:', error);
        // Handle errors, such as invalid phone numbers, here
        res.status(400).send(error)
    });
})

router.post('/verifyotp', async (req, res) => {
    try {
        let data;
        // Attempt to parse req.body as JSON
        try {
            const rawBody = req.body.toString('utf8');
            data = JSON.parse(rawBody);
        } catch (error) {
            // If parsing fails, use req.body as a string
            data = req.body;
        }

        const otpDocument = await OtpSchema.findOne({
            otp: data.otp,
            to: data.mobile
          });

          
        if (otpDocument) {
          // OTP is valid
          // Proceed with user authentication or any other action
          console.error('OTP validated');
          res.status(201).send({message: 'OTP validated Successfully!!!', status: true})

          return true;
        } else {
            console.error('OTP Not validated');
            // OTP is invalid or expired
            res.status(400).send({message: 'Please enter a valid OTP.', status: false})
          return false;
        }
      } catch (error) {
        console.error('Error validating OTP:', error);
        // Handle error
        res.status(400).send(error)
      }
})

router.post('/signup', async (req, res) => {
    const user = new User({
        ...req.body,
        isVerified: true //TODO: mark it as verified only when OTP validation is completed
    })
    try {
        await user.save();
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send({message: 'error in signout'});
      }    
})

router.post('/signin', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.mobile, req.body.password)

        const token = await user.generateAuthToken()
        await user.populate('studio')
        res.send({ role: user.role, user, token })
    } catch (e) {
        res.status(400).send({message: 'error in signin'})
    }
})

router.post('/signout', auth(), async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send({message: 'error in signout'})
    }
})

//TODO: Remove this, use put('/profile')
router.post('/updateprofile', async (req, res) => {
    console.log(req.body);

    try {
        // Find the user by their unique identifier (userId)
        const updateUser = await StudioUser.findByCredentials(req.body.studioMobile, req.body.password);

        if (!updateUser) {
            // Handle the case where the user doesn't exist
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Define an array of fields that can be updated
        const updatableFields = [
            'studioName',
            'studioEmail',
            'studioAltEmail',
            'businessWhatsApp',
            'contactPersonName',
            'contactPersonNumber',
            'address',
            'AddressLandMark',
            'PinCode',
            'latitude',
            'longnitude',
            'areaCanServe',
            'workingSince',
            'aboutStudio',
            'studioRequest',
        ];

        // Create an update object with the $set operator for each field that has a value in the request
        const updateObject = {};
        updatableFields.forEach((field) => {
            if (req.body[field] !== undefined && req.body[field] !== '') {
                updateObject[field] = req.body[field];
            }
        });

        // Update the user's fields using the $set operator
        await StudioUser.updateOne({ _id: updateUser._id }, { $set: updateObject });

        return res.status(200).json({ success: true, message: 'User updated successfully', updatedUser: updateUser });
    } catch (e) {
        console.error(e);
        return res.status(400).json({ success: false, message: 'Failed to update user' });
    }
});

router.post('/profile', auth('admin'), async (req, res) => {
    const studio = new Studio({
        ...req.body,
        addedBy: req.user._id
    })
    try {
        if(req.user.studio) {
            res.status(400).send({ success: false, message: 'Studio information already present for this user' })
        }
        await studio.save()
        req.user.studio = studio._id
        await req.user.save()
        res.status(201).send({ studio })
    } catch (e) {
        res.status(400).send(e.message)
    }
})

const upload = multer({
    limits: {
        fileSize: 25 * 1024 * 1024
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }

        cb(undefined, true)
    }
})

router.post('/profile/photo', auth('admin'), upload.single('file'), async (req, res) => {
    try {
        const studio = await Studio.findById(req.user.studio);
        
        if (!studio) {
            return res.status(404).json({ success: false, message: 'Studio not found' });
        }
        const file = req.file;
        const compressedImageBuffer = await sharp(req.file.buffer)
            .resize({ width: 250, height: 250 }) 
            .png({ quality: 80 }) 
            .toBuffer();
        studio.profileimage.data = compressedImageBuffer;
        studio.profileimage.contentType = file.mimetype;

        await studio.save();

        res.status(200).send({ success: true })
    } catch (e) {
        res.status(400).send({ success: false, message: 'Error saving profile photo' })
    }
})

router.get('/profile/photo', auth('admin'), async (req, res) => {
    try {
        const studio = await Studio.findById(req.user.studio);
        
        if (!studio) {
            return res.status(404).json({ success: false, message: 'Studio not found' });
        }
        const user = await User.findById(req.params.id)

        if (!studio.profileimage.data) {
            return res.status(404).json({ success: false, message: 'No profile image for the studio' });
        }

        res.set('Content-Type', 'image/png')
        res.send(studio.profileimage.data)
    } catch (e) {
        res.status(404).send({ success: false, message: 'Error in getting profile image' })
    }
})

router.post('/profile/coverPhoto', auth('admin'), upload.single('file'), async (req, res) => {
    try {
        const studio = await Studio.findById(req.user.studio);
        if (!studio) {
            return res.status(404).json({ success: false, message: 'Studio not found' });
        }
        const file = req.file;
        const compressedImageBuffer = await sharp(file.buffer)
            .resize({ width: 800, height: 350 }) 
            .jpeg({ quality: 80 }) 
            .toBuffer();

        studio.coverimage.data = compressedImageBuffer;
        studio.coverimage.contentType = file.mimetype;

        const updatedStudio = await studio.save();

        res.status(200).send({ success: true })
    } catch (e) {
        res.status(400).send({ success: false, message: 'Error saving cover photo' })
    }
})

router.get('/profile/coverPhoto', auth('admin'), async (req, res) => {
    try {
        const studio = await Studio.findById(req.user.studio);
        
        if (!studio) {
            return res.status(404).json({ success: false, message: 'Studio not found' });
        }
        const user = await User.findById(req.params.id)

        if (!studio.coverimage.data) {
            return res.status(404).json({ success: false, message: 'No cover image for the studio' });
        }

        res.set('Content-Type', 'image/png')
        res.send(studio.coverimage.data)
    } catch (e) {
        res.status(404).send({ success: false, message: 'Error in getting cover image' })
    }
})

router.put('/profile', auth('admin'), async (req, res) => {
    try {

        const updatedData = req.body;
        const studio = await Studio.findById(req.user.studio);

        if (!studio) {
            return res.status(404).json({ message: 'Studio not found' });
        }

        // Define an array of fields that can be updated
        const updatableFields = [
            'studioName',
            'studioMobile',
            'email',
            'studioLandline',
            'alternativeEmail',
            'address',
            'aboutStudio'
        ];
        updatableFields.forEach((field) => {
            if (updatedData[field] !== undefined && updatedData[field] !== '') {
                studio[field] = updatedData[field];
            }
        });
        const updatedStudio = await studio.save();
        return res.status(200).json({ success: true, message: 'Studio updated successfully', studio: updatedStudio });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ success: false, message: 'Failed to update Studio' });
    }
});

router.get('/profile', auth('admin'), async (req, res) => {
    try {
        const studio = await Studio.findById(req.user.studio);
        res.status(201).send({ studio })
    } catch (e) {
        res.status(400).send(e.message)
    }
})

router.post('/album', auth('admin'), async (req, res) => {
    //When admin creates album and studio info is not mapeed to admin
    const studio = await Studio.findById(req.user.studio)
    if(!studio) {
        return res.status(400).send('Please update your studio info before creating album')
    }
    if(!await Studio.findOne({ _id: req.user.studio, clients: req.body.client })) {
        return res.status(400).send('Please add client before creating album for the client')
    }
    const album = new Album({
        ...req.body,
        studio: req.user.studio
    })
    
    try {
        await album.save()
        const user = await User.findByIdAndUpdate({_id: req.body.client},{ $push: { albums: album._id } } )
        if(user === null) {
            res.status(500).send('Updating user album failed')
        }
        res.status(201).send(album)
    } catch (e) {
        res.status(400).send(e.message)
    }
})


router.get('/albums', auth('admin'), async (req, res) => {
    const match = {}
    if (req.body.eventType) {
        match.eventType = req.body.eventType
    }
    if (req.body.status) {
        match.status = req.body.status
    }
    try {
        const studio = await Studio.findById(req.user.studio).populate({
            path: 'albums',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip)
            },
            select: '_id albumName status eventType client'
        })
        res.send(studio.albums)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/clientAlbums', auth('admin'), async (req, res) => {
    const match = {studio:  req.user.studio}
    if (req.body.eventType) {
        match.eventType = req.body.eventType
    }
    if (req.body.status) {
        match.status = req.body.status
    }
    try {
        const user = await User.findById(req.body.client).populate({
            path: 'albums',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip)
            },
            select: '_id albumName status eventType'
        })
        res.send(user.albums)
    } catch (e) {
        res.status(500).send()
    }
})

//TODO: generate confirmation link and send that to email. User has to verify it and reset password
//
router.post('/client', auth('admin'), async (req, res) => {
    if(!await Studio.findById(req.user.studio)) {
        return res.status(400).send('Please add studio before adding client')
    }
    
    try {
        const user = await User.findOne({ mobile: req.body.mobile})
        //If user already present in the system (added by other studio or signup using our portal)
        if(user) {
            const studio = await Studio.findOneAndUpdate(
                { _id: req.user.studio, clients: { $ne: user._id } },
                { $push: { clients: user._id } },
                { new: true } )
            if(studio === null) {
                return res.status(400).send('The current user is already a client')
            }
            console.log('user already exists: ', user)
            res.status(200).send({ user })
        } else {
            const user = new User({
                ...req.body,
                addedBy: req.user._id,
                password: process.env.TEMP_PASSWORD
            })
            await user.save()
            await Studio.findByIdAndUpdate({_id: req.user.studio},{ $push: { clients: user._id } } )
            res.status(201).send({ user })
        }
        
    } catch (e) {
        console.log(e)
        res.status(400).send(e.message)
    }
})

router.get('/clients', auth('admin'), async (req, res) => {
    try {
        const studio = await Studio.findById(req.user.studio).populate({
            path: 'clients',
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip)
            },
            select: '_id firstName lastName mobile email'
        })
        res.send(studio.clients)
    } catch (e) {
        res.status(500).send({message: 'error in getting client details'})
    }
})

router.get('/client', auth('admin'), async (req, res) => {
    try {
        console.log(req.query.mobile)
        const user = await User.findOne({ mobile: req.query.mobile })
        if (!user) {
            return res.status(400).send({status: false, message: 'User does not exist'})
        }
        res.send(user)
    } catch (e) {
        res.status(500).send({message: 'error whhile getting client details'})
    }
})
module.exports = router