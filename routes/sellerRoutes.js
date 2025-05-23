
const express = require('express');
const {
  addSellerProduct,
  updateSellerProduct,
  deleteSellerProduct,
  getAllSellerProducts,
  getSellerProductById,
  getSellerProductImage,
} = require('../controllers/SellerController');
const upload = require('../middlewares/fileUploadMiddleware');

const router = express.Router();

// Multer error handling middleware
const handleMulterErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ success: false, error: err.message });
  }
  if (err.message === 'Only image files are allowed') {
    return res.status(400).json({ success: false, error: err.message });
  }
  next(err);
};

router.post('/add', upload.single('PlantImage'), handleMulterErrors, addSellerProduct);
router.put('/:id', upload.single('PlantImage'), handleMulterErrors, updateSellerProduct);
router.get('/', getAllSellerProducts);
router.get('/:id', getSellerProductById);
router.get('/:id/image', getSellerProductImage);
router.delete('/:id', deleteSellerProduct);

module.exports = router; // Export router directly