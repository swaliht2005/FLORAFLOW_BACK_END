
const express = require('express');
const authRouter = require('./authRoutes');
const sellerRouter = require('./sellerRoutes');
const profileRoutes = require('./profileRoutes');

const router = express.Router();


router.use('/auth', authRouter);
router.use('/seller', sellerRouter);
router.use('/profile', profileRoutes);

console.log('apiRoutes mounted: /auth, /seller, /profile');

module.exports = router;