const User = require('../models/User');
const generateOTP = require('../utils/otpGenerator');
const sendEmail = require('../utils/sendEmail');
const asyncHandler = require('../utils/asyncHandler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.generateAndSendOTP = asyncHandler(async (req, res) => {
    const { email, phonenumber } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
        user = await User.create({ email, phonenumber });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 300000; // 5 minutes
    await user.save();

    const message = `Your OTP is: ${otp}`;
    const html = `<p>Your OTP is: <b>${otp}</b></p>`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Your OTP',
            message: message,
            html: html,
        });

        res.status(200).json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
        user.otp = undefined;
        await user.save();
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to send OTP. Please try again.' });
    }
});

exports.verifyOTP = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
        return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'OTP verified successfully' });
});

exports.register = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, phonenumber, password, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
        return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    user.firstName = firstName;
    user.lastName = lastName;
    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ success: true, message: 'User registered successfully', token });
});

exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json({ success: false, message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Invalid password' });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ success: true, token });
});