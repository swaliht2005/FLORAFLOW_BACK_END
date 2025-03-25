exports.generateAndSendOTP = asyncHandler(async (req, res) => {
    const { email } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
        user = await User.create({ email });
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
        console.error('Failed to send OTP:', error); // Enhanced error logging
        res.status(500).json({ success: false, message: 'Failed to send OTP. Please try again.' });
    }
});