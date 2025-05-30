
const express = require('express');
const router = express.Router();
const profileMiddleware = require('../middlewares/profileMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'Uploads/' });

const {
    addProfile,
    updateProfile,
    getProfile,
    getProfileImage,
} = require('../controllers/ProfileController');

router.post('/', profileMiddleware, upload.single('profileImage'), addProfile);
router.put('/', profileMiddleware, upload.single('profileImage'), updateProfile);
router.get('/', profileMiddleware, getProfile);
router.get('/image', profileMiddleware, getProfileImage);

module.exports = router;