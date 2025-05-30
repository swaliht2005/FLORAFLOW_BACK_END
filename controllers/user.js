const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const { firstName, lastName, email, phonenumber, password } = req.body;

        console.log('register: Received data:', { firstName, lastName, email, phonenumber });

        if (!firstName || !lastName || !email || !phonenumber || !password) {
            console.log('register: Missing fields', { firstName, lastName, email, phonenumber, password });
            return res.status(400).json({ status: 'error', error: 'All fields are required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('register: User already exists', { email });
            return res.status(400).json({ status: 'error', error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ firstName, lastName, email, phonenumber, password: hashedPassword });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '1d' });

        console.log('register: User registered successfully', { userId: user._id, email });
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
        console.error('Error in register:', { message: err.message, stack: err.stack });
        res.status(500).json({ status: 'error', error: 'Server error' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('login: Received:', { email });

        if (!email || !password) {
            console.log('login: Missing fields', { email, hasPassword: !!password });
            return res.status(400).json({ status: 'error', success: false, error: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            console.log('login: User not found', { email });
            return res.status(401).json({ status: 'error', success: false, error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('login: Password mismatch', { email });
            return res.status(401).json({ status: 'error', success: false, error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '1d' });

        console.log('login: Login successful', { userId: user._id, email });
        res.json({
            status: 'ok',
            success: true,
            message: 'Login successful',
            token,
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                bio: user.bio,
                email: user.email,
                phonenumber: user.phonenumber,
                address: user.address,
                gender: user.gender,
                profileImage: user.profileImage,
            },
        });
    } catch (error) {
        console.error('Login Error:', { message: error.message, stack: error.stack });
        res.status(500).json({ status: 'error', success: false, error: 'Server error' });
    }
};

module.exports = { register, login };