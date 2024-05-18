const mongoose = require("mongoose");

const albumSchema = new mongoose.Schema(
  {
    albumName: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["draft", "inprogress", "in-review", "completed"],
      default: "draft",
    },
    eventType: {
      type: String,
      required: true,
      enum: [
        "Half Saree",
        "Engagement",
        "Pre-Wedding",
        "Wedding",
        "Post-Wedding",
        "Maternity and Newborn",
        "Birthday",
        "Corporate Function",
        "Portraits",
        "Fashion",
        "Food Photography",
        "Lifestyle",
        "Sports",
        "Other",
      ],
    },
    eventDate: {
      type: String,
      required: true,
      trim: true,
    },
    photos: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Photo'
    }],
    groups: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group'
    }],
    studio: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Studio",
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

const Album = mongoose.model("Album", albumSchema);

module.exports = Album;
