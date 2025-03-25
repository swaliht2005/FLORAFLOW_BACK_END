// routes/authRoutes.js
const express = require('express');
const { generateAndSendOTP, verifyOTP } = require('../controllers/authController');

const router = express.Router();

router.post('/generateOTP', generateAndSendOTP);
router.post('/verifyOTP', verifyOTP);

module.exports = router;