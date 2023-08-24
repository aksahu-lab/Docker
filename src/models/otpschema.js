const mongoose = require('mongoose');
const validator = require('validator')

const otpschemamodel = new mongoose.Schema({
  to: {
    type: String,
    required: true,
    },
  otp: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
    required: true,
  },
  expired_at: {
    type: Date,
    required: true,
  },
});

// Create an index on the `expired_at` field for automatic expiration
otpschemamodel.index({ expired_at: 1 }, { expireAfterSeconds: 0 });

const OtpSchema = mongoose.model('OTP', otpschemamodel);

module.exports = OtpSchema;
