const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    studioName: {
        type: String,
        required: false,
        trim: true
    },
    studioMobile: {
        type: String,
        required: false,
        unique: true,
        trim: true
    },
    studioLandline: {
        type: String,
        required: false,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: false,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    alternativeEmail: {
        type: String,
        required: false,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    contactPersonName: {
        type: String,
        required: false,
        unique: true,
        trim: true,
        lowercase: true
    },
    contactPersonMobile: {
        type: String,
        required: false,
        unique: true,
        trim: true
    },
    studioLocation: {
        type: String,
        required: false,
        trim: true
    },
    studioPinCode: {
        type: String,
        required: false,
        trim: true
    },
    areaCanServe: {
        type: String,
        required: false,
        trim: true
    },
    address: {
        type: String,
        required: false,
        trim: true
    },
    landMark: {
        type: String,
        required: false,
        trim: true
    },
    latitude: {
        type: String,
        required: false,
        trim: true
    },
    longnitude: {
        type: String,
        required: false,
        trim: true
    },
    businessWhatsAppMobile: {
        type: String,
        required: false,
        trim: true
    },
    aboutStudio: {
        type: String,
        required: false,
        trim: true
    },
    workingSince: {
        type: String,
        required: false,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    profileimage: {
        type: String,
        required: false,
        unique: false,
        trim: false
    },
    coverimage: {
        type: String,
        required: false,
        unique: false,
        trim: false
    },
    otp: {
        type: String,
        required: false,
        unique: false,
        trim: false
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

/**
 * When StudioUser gets logged in the console or in the response, it will not display password and all the user tokens
 * @returns 
 */
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    // delete userObject._id
    return userObject
}

/**
 * Hash the password before saving into mongodb
 */
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcryptjs.hash(user.password, 8)
    }

    next()
})


userSchema.post('save', function(error, doc, next) {
    console.log(error)
    if ( error.code === 11000) {
        if(error.keyPattern.mobile) {
            next(new Error('mobile already registered'));
        } else {
            next(new Error('email already registered'));
        }
    } else {
        next(error);
    }
});

/**
 * Generates user token with _id field
 * Having mongo _id field in the jwt may have security issues. In future we should have different collection for Session
 * Session collection will have user _id, session _id and the token. For each login create session id and add the session id in the jwt
 * @returns 
 */
userSchema.methods.generateAuthToken = async function () {
    const user = this
    console.log('process.env.SECRET_KEY: ', process.env.SECRET_KEY)
    const token = jwt.sign({ _id: user._id.toString() }, process.env.SECRET_KEY)

    console.log('created token', token)
    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

/**
 * Check and return user if exists
 * @param {*} mobile 
 * @param {*} password 
 * @returns 
 */
userSchema.statics.findByCredentials = async (mobile, password) => {
    const user = await StudioUser.findOne({ mobile })
    if (!user) {
        throw new Error('User does not exist')
    }
    const isMatch = await bcryptjs.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

userSchema.virtual('albums', {
    ref: 'Album',
    localField: '_id',
    foreignField: 'studio'
})

const StudioUser = mongoose.model('StudioUser', userSchema)

module.exports = StudioUser