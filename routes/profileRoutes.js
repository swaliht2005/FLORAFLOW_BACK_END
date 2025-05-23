
const express = require('express');
const router = express.Router();
const { addProfile, updateProfile, getProfile, getProfileImage } = require('../controllers/profileController');
const profileMiddleware = require('../middlewares/profileMiddleware');
const upload = require('../middlewares/fileUploadMiddleware');

// Debug imports
console.log('Imported profileController:', require('../controllers/profileController'));
console.log('addProfile:', typeof addProfile, addProfile);
console.log('updateProfile:', typeof updateProfile, updateProfile);
console.log('getProfile:', typeof getProfile, getProfile);
console.log('getProfileImage:', typeof getProfileImage, getProfileImage);
console.log('profileMiddleware:', typeof profileMiddleware, profileMiddleware);
console.log('upload.single:', typeof upload.single('profileImage'), upload.single('profileImage'));

// Routes
router.post('/add', profileMiddleware, upload.single('profileImage'), addProfile);
router.put('/update', profileMiddleware, upload.single('profileImage'), updateProfile); // Handles PUT /api/profile/update
router.get('/', profileMiddleware, getProfile);
router.get('/:filename/image', getProfileImage);

// Error handling middleware
router.use((err, req, res, next) => {
    console.error('Route error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

module.exports = router;