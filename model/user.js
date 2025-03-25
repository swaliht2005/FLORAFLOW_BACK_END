const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phonenumber: { type: String, required: true },
    password: { type: String, required: true },
    otp: { type: String },
    otpExpires: { type: Date }
}, {
    collection: 'user-data',
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);