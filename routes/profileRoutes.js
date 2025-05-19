
const express = require('express');
const router = express.Router();
const { addProfile, updateProfile, getProfile, getProfileImage } = require('../controllers/profileController');
const profileMiddleware = require('../middlewares/profileMiddleware');
const upload = require('../middlewares/fileUploadMiddleware');

// Routes
router.post('/profile/add', profileMiddleware, upload.single('profileImage'), addProfile);
router.put('/profile/update', profileMiddleware, upload.single('profileImage'), updateProfile); // Ensure PUT method
router.get('/profile', profileMiddleware, getProfile);
router.get('/profile/image/:filename', getProfileImage);

// Error handling middleware
router.use((err, req, res, next) => {
  console.error('Route error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = router;