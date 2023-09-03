const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Firstname is required'],
        trim: true
    },
    lastName: {
        type: String,
        required: false,
        trim: true
    },
    mobile: {
        type: String,
        required: [true, 'Mobile number is required'],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
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
    role: {
        type: String,
        required: true,
        enum: {
            values: ['admin', 'assistant', 'client'],
            message: '{VALUE} role is not valid'
          },
        default: 'client'
    },
    studio: { //Only for admin and assistant
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Studio'
    },
    addedBy: { //keep the admin user detail for reference if added by admin
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    albums: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Album'
    }],
    isVerified: {
        type: Boolean,
        default: false
    },
    tokens: [{
        token: {
            type: String
        }
    }]
}, {
    timestamps: true
})

/**
 * When Studio gets logged in the console or in the response, it will not display password and all the user tokens
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
        } else if(error.keyPattern.email) {
            next(new Error('email already registered'));
        } else {
            next(new Error('User already registered'));
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
    const token = jwt.sign({ _id: user._id.toString(), role: user.role }, process.env.SECRET_KEY)

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
    const user = await User.findOne({ mobile })
    if (!user) {
        throw new Error('User does not exist')
    }
    const isMatch = await bcryptjs.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

const User = mongoose.model('User', userSchema)

module.exports = User