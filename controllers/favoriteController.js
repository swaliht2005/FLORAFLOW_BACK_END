// controllers/favoriteController.js
const mongoose = require('mongoose');
const Favorite = require('../model/favoriteModel');
const Seller = require('../model/sellerModel');



// Add a product to favorites
const addFavorite = async (req, res) => {
    try {
        const userId = req.user.id;
        const productId = req.params.productId;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ success: false, error: 'Invalid product ID' });
        }

        // Check if product exists
        const product = await Seller.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }

        // Check if already favorited
        const existingFavorite = await Favorite.findOne({ userId, productId });
        if (existingFavorite) {
            return res.status(400).json({ success: false, error: 'Product already in favorites' });
        }

        const favorite = new Favorite({
            userId: new mongoose.Types.ObjectId(userId),
            productId: new mongoose.Types.ObjectId(productId),
        });

        await favorite.save();

        res.json({ success: true, message: 'Product added to favorites' });
    } catch (error) {
        console.error('Error adding favorite:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

// Remove a product from favorites
const removeFavorite = async (req, res) => {
    try {
        const userId = req.user.id;
        const productId = req.params.productId;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ success: false, error: 'Invalid product ID' });
        }

        const favorite = await Favorite.findOneAndDelete({
            userId: new mongoose.Types.ObjectId(userId),
            productId: new mongoose.Types.ObjectId(productId),
        });

        if (!favorite) {
            return res.status(404).json({ success: false, error: 'Favorite not found' });
        }

        res.json({ success: true, message: 'Product removed from favorites' });
    } catch (error) {
        console.error('Error removing favorite:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

// Get all favorite products for a user
const getFavorites = async (req, res) => {
    try {
        const userId = req.user.id;

        const favorites = await Favorite.find({ userId: new mongoose.Types.ObjectId(userId) })
            .populate('productId')
            .sort({ createdAt: -1 });

        const favoriteProducts = favorites.map((fav) => ({
            ...fav.productId.toObject(),
            imageUrl: `http://localhost:5000/api/seller/${fav.productId._id}/image`,
        }));

        res.json(favoriteProducts);
    } catch (error) {
        console.error('Error retrieving favorites:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};


module.exports = {
    addFavorite,
    removeFavorite,
    getFavorites,
};