

// import nodemailer from 'nodemailer';
// import dotenv from 'dotenv';

// dotenv.config();

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASSWORD
//     }
// });

// const sendOtp = async (email, otp) => {
//     const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: email,
//         subject: 'Your OTP Code',
//         text: `Your OTP is: ${otp}`
//     };

//     try {
//         const info = await transporter.sendMail(mailOptions);
//         console.log('✅ OTP email sent successfully:', info.response);
//         return { success: true, message: 'OTP sent successfully' };
//     } catch (err) {
//         console.error('❌ Error sending OTP email:', err.message);
//         return { success: false, error: err.message };
//     }
// };

// export default sendOtp;
