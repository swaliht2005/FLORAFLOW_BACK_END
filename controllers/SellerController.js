// controllers/SellerController.js
const mongoose = require('mongoose');
const Seller = require('../model/sellerModel');
const path = require('path');
const fs = require('fs');

const deleteSellerProduct = async (req, res) => {
    try {
        const userId = req.user.id; // Use req.user.id from JWT
        const productId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            console.error(`Invalid product ID format: ${productId}`);
            return res.status(400).json({ success: false, error: 'Invalid product ID' });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            console.error(`Invalid user ID format: ${userId}`);
            return res.status(400).json({ success: false, error: 'Invalid user ID' });
        }

        const plant = await Seller.findOneAndDelete({
            _id: new mongoose.Types.ObjectId(productId),
            userId: new mongoose.Types.ObjectId(userId),
        });

        if (!plant) {
            console.error(`Product not found or unauthorized: _id=${productId}, userId=${userId}`);
            return res.status(404).json({ success: false, error: 'Product not found or unauthorized' });
        }

        console.log(`Product deleted: _id=${productId}, userId=${userId}`);
        res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', {
            message: error.message,
            stack: error.stack,
            productId: req.params.id,
            userId: req.user.id,
        });
        res.status(500).json({ success: false, error: `Failed to delete product: ${error.message}` });
    }
};

// Other functions (unchanged)
const getMyPlants = async (req, res) => {
    try {
        console.log('getMyPlants called:', {
            headers: req.headers.authorization?.slice(0, 20) + '...',
            user: req.user,
            timestamp: new Date().toISOString(),
        });

        if (!req.user) {
            console.error('req.user is undefined');
            return res.status(401).json({ success: false, error: 'Authentication failed: No user data provided' });
        }
        const userId = req.user.id; // Use req.user.id
        if (!userId) {
            console.error('User ID missing in req.user:', req.user);
            return res.status(400).json({ success: false, error: 'User ID is missing from authentication' });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            console.error(`Invalid user ID format: ${userId}`);
            return res.status(400).json({ success: false, error: `Invalid user ID format: ${userId}` });
        }

        if (mongoose.connection.readyState !== 1) {
            console.error('Database not connected:', mongoose.connection.readyState);
            return res.status(503).json({ success: false, error: 'Database connection is not available' });
        }

        const collections = await mongoose.connection.db.listCollections().toArray();
        const sellerCollectionExists = collections.some((col) => col.name === 'sellers');
        if (!sellerCollectionExists) {
            console.log('Seller collection not found, returning empty array');
            return res.status(200).json([]);
        }

        console.log(`Querying Seller collection for userId: ${userId}`);
        const products = await Seller.find({ userId: new mongoose.Types.ObjectId(userId) })
            .sort({ createdAt: -1 })
            .catch((err) => {
                console.error('Database query error:', err.message);
                throw new Error(`Database query failed: ${err.message}`);
            });

        const productsWithUrls = products.map((product) => ({
            ...product.toObject(),
            imageUrl: `http://localhost:5000/api/seller/${product._id}/image`,
        }));

        console.log(`Found ${products.length} products for userId: ${userId}`);
        res.status(200).json(productsWithUrls);
    } catch (error) {
        console.error('Error in getMyPlants:', {
            message: error.message,
            stack: error.stack,
            user: req.user || 'undefined',
            userId: req.user?.id || 'undefined',
            dbState: mongoose.connection.readyState,
            dbName: mongoose.connection.name || 'unknown',
            collections: (await mongoose.connection.db.listCollections().toArray().catch(() => [])).map((c) => c.name),
            token: req.headers.authorization?.replace('Bearer ', '***') || 'none',
            timestamp: new Date().toISOString(),
        });
        res.status(500).json({ success: false, error: `Failed to retrieve user products: ${error.message}` });
    }
};

const addSellerProduct = async (req, res) => {
    try {
        const { PlantName, PlantingDay, PlantingHeight, price, PlantAbout } = req.body || {};
        const userId = req.user.id;

        const errors = [];
        if (!PlantName) errors.push('Plant name is required');
        if (!PlantingDay) errors.push('Planting day is required');
        if (!PlantingHeight) errors.push('Planting height is required');
        if (!price || isNaN(price)) errors.push('Valid price is required');
        if (!PlantAbout) errors.push('Plant description is required');
        if (errors.length > 0) {
            return res.status(400).json({ success: false, errors });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, error: 'No image file uploaded' });
        }

        const filePath = path.join(__dirname, '..', 'Uploads', req.file.filename);
        if (!fs.existsSync(filePath)) {
            console.error(`File not found at: ${filePath}`);
            return res.status(500).json({ success: false, error: 'Uploaded file not saved' });
        }

        const imageData = fs.readFileSync(filePath);
        const contentType = req.file.mimetype;

        const plant = new Seller({
            PlantName,
            PlantingDay,
            PlantingHeight,
            price: parseFloat(price),
            PlantAbout,
            userId: new mongoose.Types.ObjectId(userId),
            PlantImage: {
                data: imageData,
                contentType,
            },
        });
        await plant.save();

        fs.unlinkSync(filePath);

        res.json({
            success: true,
            message: 'Product added successfully!',
            data: {
                ...plant.toObject(),
                imageUrl: `http://localhost:5000/api/seller/${plant._id}/image`,
            },
        });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

const updateSellerProduct = async (req, res) => {
    try {
        const { PlantName, PlantingDay, PlantingHeight, price, PlantAbout } = req.body || {};
        const userId = req.user.id;

        const errors = [];
        if (!PlantName) errors.push('Plant name is required');
        if (!PlantingDay) errors.push('Planting day is required');
        if (!PlantingHeight) errors.push('Planting height is required');
        if (!price || isNaN(price)) errors.push('Valid price is required');
        if (!PlantAbout) errors.push('Plant description is required');
        if (errors.length > 0) {
            return res.status(400).json({ success: false, errors });
        }

        const updateData = {
            PlantName,
            PlantingDay,
            PlantingHeight,
            price: parseFloat(price),
            PlantAbout,
        };

        if (req.file) {
            const filePath = path.join(__dirname, '..', 'Uploads', req.file.filename);
            if (!fs.existsSync(filePath)) {
                console.error(`File not found at: ${filePath}`);
                return res.status(500).json({ success: false, error: 'Uploaded file not saved' });
            }

            const imageData = fs.readFileSync(filePath);
            updateData.PlantImage = {
                data: imageData,
                contentType: req.file.mimetype,
            };
            fs.unlinkSync(filePath);
        }

        const updatedPlant = await Seller.findOneAndUpdate(
            { _id: req.params.id, userId: new mongoose.Types.ObjectId(userId) },
            updateData,
            { new: true }
        );

        if (!updatedPlant) {
            return res.status(404).json({ success: false, error: 'Product not found or unauthorized' });
        }

        res.json({
            success: true,
            data: {
                ...updatedPlant.toObject(),
                imageUrl: `http://localhost:5000/api/seller/${updatedPlant._id}/image`,
            },
        });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

const getAllSellerProducts = async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};

        if (search) {
            query = {
                $or: [
                    { PlantName: { $regex: search, $options: 'i' } },
                    { PlantAbout: { $regex: search, $options: 'i' } },
                ],
            };
        }

        const products = await Seller.find(query).sort({ createdAt: -1 });
        const productsWithUrls = products.map((product) => ({
            ...product.toObject(),
            imageUrl: `http://localhost:5000/api/seller/${product._id}/image`,
        }));

        res.json(productsWithUrls);
    } catch (error) {
        console.error('Error retrieving products:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

const getSellerProductById = async (req, res) => {
    try {
        const product = await Seller.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }

        res.json({
            ...product.toObject(),
            imageUrl: `http://localhost:5000/api/seller/${product._id}/image`,
        });
    } catch (error) {
        console.error('Error retrieving product:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

const getSellerProductImage = async (req, res) => {
    try {
        const product = await Seller.findById(req.params.id);

        if (!product || !product.PlantImage || !product.PlantImage.data) {
            return res.status(404).json({ success: false, error: 'Image not found' });
        }

        res.set('Content-Type', product.PlantImage.contentType);
        res.send(product.PlantImage.data);
    } catch (error) {
        console.error('Error retrieving product image:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

module.exports = {
    addSellerProduct,
    updateSellerProduct,
    deleteSellerProduct,
    getAllSellerProducts,
    getSellerProductById,
    getSellerProductImage,
    getMyPlants,
};