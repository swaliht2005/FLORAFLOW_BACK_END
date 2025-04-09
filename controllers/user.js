
const User = require('../model/user');
const register = async (req, res) => {
    try {
        const {  firstName, lastName, email, phonenumber, password} = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ status: 'error', error: 'User already exists' });
        }
        const user = await User.create({  firstName, lastName, email, phonenumber, password });

        res.json({ status: 'ok', success: true, message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', error: 'Server error' });
    }
};

module.exports = { register }; // ✅ Ensure this is correctly exported

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { register, login }; 