const express = require('express')
const StudioUser = require('../models/studioUser')
const Album = require('../models/album')
const auth = require('../middleware/auth')
const speakeasy = require('speakeasy');
const twilio = require('twilio');
const OtpSchema = require('../models/otpschema'); // Assuming you've imported the OTP schema

const router = new express.Router()

router.post('/sendotp', async (req, res) => {
    console.log("sendotp = " + req.body.mobile);

    const parsedBody = req.body;

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
        to: parsedBody.mobile,
    })
    .then((message) => {
        console.log('Message SID:', message.sid); // Unique identifier for the sent message
        console.log('Message Status:', message.status); // Status of the message (e.g., "sent", "delivered", "failed")
        const newOTP = new OtpSchema({
            otp: token, // Replace with the generated OTP
            to: parsedBody.mobile,
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
        console.log("Verify Otp = " + req.body.toString());
        const parsedBody = JSON.parse(req.body.toString());

        // Find the OTP document for the user with the provided user ID
        const otpDocument = await OtpSchema.findOne({
            otp: parsedBody.otp
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
    const user = new StudioUser(req.body)
    try {
        await user.save()
        console.log('user details: ', user)
        const token = await user.generateAuthToken()
        console.log('token: ', token)
        res.status(201).send({ user, token })
    } catch (e) {
        console.log(e)
        res.status(400).send(e.message)
    }
})

router.post('/signin', async (req, res) => {
    try {
        console.log('req.body.mobile: ', req.body.mobile)
        console.log('req.body.mobile: ', req.body.password)
        const user = await StudioUser.findByCredentials(req.body.mobile, req.body.password)
    
        user.profileimage = `https://fastly.picsum.photos/id/102/4320/3240.jpg?hmac=ico2KysoswVG8E8r550V_afIWN963F6ygTVrqHeHeRc`;
        user.coverimage = `https://fastly.picsum.photos/id/102/4320/3240.jpg?hmac=ico2KysoswVG8E8r550V_afIWN963F6ygTVrqHeHeRc`;

        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        console.log(e)
        res.status(400).send(e.message)
    }
})

router.post('/signout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/createAlbum', auth, async (req, res) => {
    console.log('creating album!!')
    const album = new Album({
        ...req.body,
        studio: req.user._id
    })

    try {
        await album.save()
        res.status(201).send(album)
    } catch (e) {
        res.status(400).send(e.message)
    }
})


router.get('/albums', auth, async (req, res) => {
    const match = {}
    if (req.body.eventType) {
        match.eventType = req.body.eventType
    }
    if (req.body.status) {
        match.status = req.body.status
    }
    try {
        await req.user.populate('albums')
        await req.user.populate({
            path: 'albums',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip)
            }
        })
        res.send(req.user.albums)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router