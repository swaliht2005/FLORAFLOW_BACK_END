const mongoose = require('mongoose');
const Cart = require('../model/Cart');
const Seller = require('../model/sellerModel');

// Add a product to cart
const addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ success: false, error: 'Invalid product ID' });
        }

        if (!quantity || quantity < 1) {
            return res.status(400).json({ success: false, error: 'Quantity must be at least 1' });
        }

        // Check if product exists
        const product = await Seller.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }

        // Check if product is already in cart
        let cartItem = await Cart.findOne({ userId, productId });
        if (cartItem) {
            cartItem.quantity += quantity;
            await cartItem.save();
        } else {
            cartItem = new Cart({
                userId: new mongoose.Types.ObjectId(userId),
                productId: new mongoose.Types.ObjectId(productId),
                quantity,
            });
            await cartItem.save();
        }

        res.json({ success: true, message: 'Product added to cart' });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

// Remove a product from cart
const removeFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const productId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ success: false, error: 'Invalid product ID' });
        }

        const cartItem = await Cart.findOneAndDelete({ userId, productId });
        if (!cartItem) {
            return res.status(404).json({ success: false, error: 'Cart item not found' });
        }

        res.json({ success: true, message: 'Product removed from cart' });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

// Get all cart items
const getCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const cartItems = await Cart.find({ userId }).populate({
            path: 'productId',
            select: 'PlantName PlantingDay PlantingHeight price PlantAbout PlantImage createdAt',
        });

        // Filter out cart items where productId is null (product no longer exists)
        const cartWithUrls = cartItems
            .filter((item) => item.productId) // Only include items with a valid product
            .map((item) => ({
                ...item.productId.toObject(),
                quantity: item.quantity,
                cartId: item._id,
                imageUrl: `http://localhost:5000/api/seller/${item.productId._id}/image`,
            }));

        // Optional: Clean up orphaned cart items (items with invalid productId)
        await Cart.deleteMany({ userId, productId: { $exists: true, $eq: null } });

        res.json(cartWithUrls);
    } catch (error) {
        console.error('Error retrieving cart:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

// Update cart item quantity
const updateCartQuantity = async (req, res) => {
    try {
        const userId = req.user.id;
        const productId = req.params.id;
        const { quantity } = req.body;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ success: false, error: 'Invalid product ID' });
        }

        if (!quantity || quantity < 1) {
            return res.status(400).json({ success: false, error: 'Quantity must be at least 1' });
        }

        const cartItem = await Cart.findOne({ userId, productId });
        if (!cartItem) {
            return res.status(404).json({ success: false, error: 'Cart item not found' });
        }

        cartItem.quantity = quantity;
        await cartItem.save();

        res.json({ success: true, message: 'Cart quantity updated' });
    } catch (error) {
        console.error('Error updating cart quantity:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

module.exports = {
    addToCart,
    removeFromCart,
    getCart,
    updateCartQuantity,
};