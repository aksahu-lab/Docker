const mongoose = require('mongoose')

const albumSchema = new mongoose.Schema({
    albumName: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['draft', 'inprogress', 'in-review', 'completed'],
        default: 'draft'
    },
    eventType: {
        type: String,
        required: true,
        enum: ['birthday', 'engagement', 'marriage', 'pre-wedding','post-wedding']
    },
    studio: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'StudioUser'
    },
    // client: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true,
    //     ref: 'User'
    // }
}, {
    timestamps: true
})

const Album = mongoose.model('Album', albumSchema)

module.exports = Album