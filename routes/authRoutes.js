
const express = require('express');
const path = require('path');
const router = express.Router();

console.log('Loading userController from:', path.join(__dirname, '..', 'controllers', 'user'));

let userController;
try {
    userController = require('../controllers/user');
    console.log('userController loaded successfully');
} catch (err) {
    console.error('Failed to load userController:', err.message);
    process.exit(1);
}

router.post('/register', userController.register); 
router.post('/login', userController.login); 

console.log('authRoutes mounted: /register, /login');

module.exports = router;