
const express = require('express');
const authRouter = require('./authRoutes');
const sellerRouter = require('./sellerRoutes');
const profileRoutes = require('./profileRoutes');
const favoriteRoutes = require('./favoriteRoutes');
const cartRoutes = require('./cartRoutes');
const chatRoutes = require('./chatRoutes');

const router = express.Router();

router.use('/user', authRouter); // Changed from /auth to /user to match index.js
router.use('/seller', sellerRouter);
router.use('/profile', profileRoutes);
router.use('/favorite', favoriteRoutes);
router.use('/cart', cartRoutes);
router.use('/chat',chatRoutes)

console.log('apiRoutes mounted: /user, /seller, /profile, /favorite, /cart ,/chat');

module.exports = router;