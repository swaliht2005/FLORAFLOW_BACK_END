const express = require('express');
const Cart = require('../model/Cart')
const router = express.Router();

// 📌 Add Item to Cart
router.post('/add', async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        // Check if item exists in cart
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ productId, quantity });
        }

        await cart.save();
        res.json({ status: 'ok', message: 'Item added to cart', cart });
    } catch (err) {
        res.status(500).json({ status: 'error', error: 'Server error' });
    }
});

// 📌 Get Cart Items
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const cart = await Cart.findOne({ userId }).populate('items.productId');

        if (!cart) {
            return res.json({ status: 'ok', cart: [] });
        }

        res.json({ status: 'ok', cart });
    } catch (err) {
        res.status(500).json({ status: 'error', error: 'Server error' });
    }
});

// 📌 Remove Item from Cart
router.post('/remove', async (req, res) => {
    try {
        const { userId, productId } = req.body;
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ status: 'error', error: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        await cart.save();

        res.json({ status: 'ok', message: 'Item removed', cart });
    } catch (err) {
        res.status(500).json({ status: 'error', error: 'Server error' });
    }
});

module.exports = router;
