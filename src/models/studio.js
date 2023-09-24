const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

const studioSchema = mongoose.Schema({
    studioName: {
        type: String,
        required: true,
        trim: true
    },
    studioMobile: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    studioLandline: {
        type: String,
        required: false,
        trim: true
    },
    email: {
        type: String,
        required: false,
        unique: false,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    pixelemail: {
        type: String,
        required: false,
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
        trim: true,
        lowercase: true
    },
    contactPersonMobile: {
        type: String,
        required: false,
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
    pincode: {
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
    about: {
        type: String,
        required: false,
        trim: true
    },
    vision: {
        type: String,
        required: false,
        unique: false,
        trim: false
    },
    mision: {
        type: String,
        required: false,
        unique: false,
        trim: false
    },
    testimonial: [{
        type: String,
        required: false,
        unique: false,
        trim: false
    }],
    pricing: {
        type: String,
        required: false,
        unique: false,
        trim: false
    },
    socialLink: [{
        type: String,
        required: false,
        unique: false,
        trim: false
    }],
    workingSince: {
        type: String,
        required: false,
        trim: true
    },
    photos: [{
        type: String,
        required: false,
        unique: false,
        trim: false
    }],
    videos:[{
        type: String,
        required: false,
        unique: false,
        trim: false
    }],
    logo: {
        type: String,
        required: false,
        unique: false,
        trim: false
    },
    portfolio: {
        type: String,
        required: false,
        unique: false,
        trim: false
    },
    profileimage: {
        data: Buffer,
        contentType: String
    },
    coverimage: {
        data: Buffer,
        contentType: String
    },
    otp: {
        type: String,
        required: false,
        unique: false,
        trim: false
    },
    addedBy: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    clients: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
}, {
    timestamps: true
})

studioSchema.post('save', function(error, doc, next) {
    console.log(error)
    if ( error.code === 11000) {
        if(error.keyPattern.studioMobile) {
            next(new Error('mobile already registered'));
        } else {
            next(new Error('email already registered'));
        }
    } else {
        next(error);
    }
});

studioSchema.virtual('albums', {
    ref: 'Album',
    localField: '_id',
    foreignField: 'studio'
})

const Studio = mongoose.model('Studio', studioSchema)

module.exports = Studio