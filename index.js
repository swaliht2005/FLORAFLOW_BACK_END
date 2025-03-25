
const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require('./config/db.js');
const User = require('./model/user.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const appRoute = require('./routes/appRoute');


app.use(cors());
app.use(express.json());
connectDB();

const otpStore = {}; 
app.post('/api/send-otp', async (req, res) => {
    const { phone } = req.body;

    if (!phone) {
        return res.status(400).json({ status: 'error', error: 'Phone number is required' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
    otpStore[phone] = otp; // Store OTP (temporary)

    console.log(`OTP for ${phone}: ${otp}`); // Log OTP (remove in production)
    res.json({ status: 'ok', message: 'OTP sent successfully' });
});

// ✅ **Register Endpoint**
app.post('/api/register', async (req, res) => {
    try {
        const { firstName, lastName, email, phonenumber, password, otp } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ status: 'error', error: 'User already exists' });
        }

      
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = await User.create({
            firstName,
            lastName,
            email,
            phonenumber,
            password: hashedPassword,
        });

        delete otpStore[phonenumber]; // Remove OTP after successful registration
        res.json({ status: 'ok', success: true, message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', error: 'Server error' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ status: 'error', error: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ status: 'error', error: 'Invalid password' });
        }

        const token = jwt.sign(
            { email: user.email },
            'secret123',
            { expiresIn: '1h' }
        );

        return res.json({ status: 'ok', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', error: 'Server error' });
    }
});

// ✅ **Start the Server**
app.listen(5000, () => {
    console.log('Server started on port 5000');
});



// app.post('/api/login',async(req,res) =>{
//     try{
//         const {email,password } =req.body;
//     }
// })

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 🔍 Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ status: 'error', error: 'User not found' });
        }

        // 🔐 Compare the entered password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ status: 'error', error: 'Invalid password' });
        }

        // 🎫 Generate JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email }, // Include user ID in the token
            process.env.JWT_SECRET || 'secret123', // Use environment variables for better security
            { expiresIn: '1h' }
        );

        res.json({ 
            status: 'ok', 
            token, 
            user: { 
                id: user._id, 
                email: user.email, 
                firstName: user.firstName, 
                lastName: user.lastName 
            } 
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', error: 'Server error' });
    }
});
