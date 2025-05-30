const express = require('express');
const {
    addSellerProduct,
    updateSellerProduct,
    deleteSellerProduct,
    getAllSellerProducts,
    getSellerProductById,
    getSellerProductImage,
    getMyPlants,
} = require('../controllers/SellerController');
const upload = require('../middlewares/fileUploadMiddleware');
const profileMiddleware = require('../middlewares/profileMiddleware');
const multer = require('multer'); // Add this import

const router = express.Router();

const handleMulterErrors = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ success: false, error: err.message });
    }
    if (err.message === 'Only image files are allowed') {
        return res.status(400).json({ success: false, error: err.message });
    }
    next(err);
};

// Routes in correct order
router.get('/myplants', profileMiddleware, getMyPlants);
router.post('/add', profileMiddleware, upload.single('PlantImage'), handleMulterErrors, addSellerProduct);
router.put('/:id', profileMiddleware, upload.single('PlantImage'), handleMulterErrors, updateSellerProduct);
router.delete('/:id', profileMiddleware, deleteSellerProduct);
router.get('/', getAllSellerProducts);
router.get('/:id', getSellerProductById);
router.get('/:id/image', getSellerProductImage);

module.exports = router;