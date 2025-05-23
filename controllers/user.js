// controllers/user.js
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const { firstName, lastName, email, phonenumber, password } = req.body;

        console.log('register: Received data:', { firstName, lastName, email, phonenumber });

        if (!firstName || !lastName || !email || !phonenumber || !password) {
            return res.status(400).json({ status: 'error', error: 'All fields are required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ status: 'error', error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ firstName, lastName, email, phonenumber, password: hashedPassword });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '1d' });

        res.status(201).json({
            status: 'ok',
            success: true,
            message: 'User registered successfully',
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phonenumber: user.phonenumber,
            },
            token,
        });
    } catch (err) {
        console.error('Error in register:', err);
        res.status(500).json({ status: 'error', error: 'Server error' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('login: Received:', email);

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '1d' });

        res.json({ token });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { register, login };

