
const jwt = require('jsonwebtoken');

const profileMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        console.error('No token provided');
        return res.status(401).json({ success: false, error: 'Authentication required: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
        console.log('Middleware decoded user:', decoded);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Middleware error:', error.message);
        res.status(401).json({ success: false, error: 'Invalid token' });
    }
};

module.exports = profileMiddleware;