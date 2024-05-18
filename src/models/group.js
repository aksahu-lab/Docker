const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
    {
        groupName: {
            type: String,
            required: true,
            trim: true,
        },
        photos: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Photo'
        }],
        album: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Album",
        },
        client: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
);

const Group = mongoose.model("Group", groupSchema);

module.exports = Group;
