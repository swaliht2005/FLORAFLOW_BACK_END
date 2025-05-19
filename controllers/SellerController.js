

const Seller = require('../model/sellerModel');
const path = require('path');
const fs = require('fs');

const addSellerProduct = async (req, res) => {
  console.log('Request body:', req.body);
  console.log('Request file:', req.file);
  try {
    const { PlantName, PlantingDay, PlantingHeight, price, PlantAbout } = req.body || {};

    // Validation
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

    // Verify and process image
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
      price: parseFloat(price), // Ensure price is a number
      PlantAbout,
      PlantImage: {
        data: imageData,
        contentType,
      },
    });
    await plant.save();

    // Clean up temporary file
    fs.unlinkSync(filePath);

    // Return the product with an image URL
    res.json({
      success: true,
      message: 'Product added successfully!',
      data: {
        ...plant.toObject(),
        url: `/api/seller/image/${plant._id}`, // Add image URL
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

    // Validation
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

    const updatedPlant = await Seller.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!updatedPlant) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.json({
      success: true,
      data: {
        ...updatedPlant.toObject(),
        url: `/api/seller/image/${updatedPlant._id}`, // Add image URL
      },
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteSellerProduct = async (req, res) => {
  try {
    const deleted = await Seller.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

const getAllSellerProducts = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query.PlantName = { $regex: search, $options: 'i' }; // Case-insensitive search
    }

    const products = await Seller.find(query).sort({ createdAt: -1 });

    // Add image URLs to each product
    const productsWithUrls = products.map((product) => ({
      ...product.toObject(),
      url: `/api/seller/image/${product._id}`,
    }));

    res.json(productsWithUrls); // Return array directly
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
      success: true,
      data: {
        ...product.toObject(),
        url: `/api/seller/image/${product._id}`, // Add image URL
      },
    });
  } catch (error) {
    console.error('Error retrieving product:', error);
    res.status(404).json({ success: false, error: 'Product not found' });
  }
};

const getSellerProductImage = async (req, res) => {
  try {
    const product = await Seller.findById(req.params.id);
    if (!product || !product.PlantImage?.data) {
      return res.status(404).json({ success: false, error: 'Image not found' });
    }

    res.set('Content-Type', product.PlantImage.contentType);
    res.send(product.PlantImage.data);
  } catch (error) {
    console.error('Error retrieving image:', error);
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
};