// routes/cartRoutes.js
const express = require('express');
const { addToCart, removeFromCart, getCart, updateCartQuantity } = require('../controllers/CartController');
const profileMiddleware = require('../middlewares/profileMiddleware');

const router = express.Router();

router.post('/add', profileMiddleware, addToCart); // Add product to cart
router.delete('/:id', profileMiddleware, removeFromCart); // Remove product from cart
router.get('/', profileMiddleware, getCart); // Get all cart items
router.put('/:id', profileMiddleware, updateCartQuantity); // Update cart item quantity

module.exports = router;