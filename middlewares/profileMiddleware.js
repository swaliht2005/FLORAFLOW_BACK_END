const jwt = require('jsonwebtoken');
const User = require('../model/User'); // Fixed typo in path

const profileMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, 'secret_key'); // Consider using env variable for secret
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user; // Attach full user object
    next();
  } catch (error) {
    console.error('Error in profileMiddleware:', error);
    return res.status(400).json({ message: 'Invalid or expired token' });
  }
};

module.exports = profileMiddleware;