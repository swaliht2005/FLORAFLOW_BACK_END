
const express = require('express');
const authRouter = require('./authRoutes');
const sellerRouter = require('./sellerRoutes');
const profileRoutes = require('./profileRoutes');
const favoriteRoutes = require('./favoriteRoutes');
const cartRoutes = require('./cartRoutes');

const router = express.Router();

router.use('/user', authRouter); // Changed from /auth to /user to match index.js
router.use('/seller', sellerRouter);
router.use('/profile', profileRoutes);
router.use('/favorite', favoriteRoutes);
router.use('/cart', cartRoutes);

console.log('apiRoutes mounted: /user, /seller, /profile, /favorite, /cart');

module.exports = router;