
const express = require('express');
const { authRouter } = require('./authRoutes');
const { sellerRouter } = require('./sellerRoutes');
const profileRoutes = require('./profileRoutes');

const router = express.Router();

router.use('/user', authRouter);
router.use('/seller', sellerRouter);
router.use('/profile', profileRoutes);

module.exports = { apiRouter: router };