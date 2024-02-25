const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema(
  {
    fileName: {
        type: String,
        required: true,
        trim: true
    },
    path: {
        type: String,
        required: true,
        trim: true
    },
    isSelected: {
        type: Boolean,
        default: false
    },
    comments: {
        type: [ { 
            message: {
                type: String,
                required: true,
                trim: true
            },
            userType: {
                type: String,
                enum: ["client", "admin"]
            },
            date: {
                type: Date
            }
        } ],
    },
    album: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Album",
    },
  },
  {
    timestamps: true,
  }
);

const Photo = mongoose.model("Photo", photoSchema);

module.exports = Photo;