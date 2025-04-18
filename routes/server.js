

const express = require('express');
const { authRouter } = require('./authRoutes');
const { sellerRouter } = require('./sellerRoutes');

const router = express.Router();

router.use('/user', authRouter);
router.use('/seller', sellerRouter); // Use sellerRouter instead of authRouter

module.exports = { apiRouter: router };