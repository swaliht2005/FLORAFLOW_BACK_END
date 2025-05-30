// routes/favoriteRoutes.js
const express = require('express');
const { addFavorite, removeFavorite, getFavorites } = require('../controllers/favoriteController');
const profileMiddleware = require('../middlewares/profileMiddleware');

const router = express.Router();

router.post('/:productId', profileMiddleware, addFavorite);
router.delete('/:productId', profileMiddleware, removeFavorite);
router.get('/', profileMiddleware, getFavorites);

module.exports = router;