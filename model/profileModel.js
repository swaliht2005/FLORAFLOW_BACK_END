// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true }, // For registration
  lastName: { type: String, required: true }, // For registration
  name: { type: String }, // Maps to frontend 'name'
  bio: { type: String }, // Maps to frontend 'about'
  email: { type: String, required: true, unique: true },
  phonenumber: { type: String, required: true }, // Maps to frontend 'number'
  address: { type: String }, // Maps to frontend 'address'
  gender: { type: String }, // Maps to frontend 'yourGender'
  profileImage: { type: String }, // Maps to frontend 'image'
  password: { type: String, required: true },
  otp: { type: String },
  otpExpires: { type: Date }
}, {
  collection: 'user-data',
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);