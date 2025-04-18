

const Seller = require('../model/sellerModel');
const path = require('path'); 
const fs = require('fs'); 

const addSellerProduct = async (req, res) => {
  console.log('Request body:', req.body);
  console.log('Request file:', req.file);
  try {
    const { PlantName, PlantingDay, PlantingHeight, price, PlantAbout } = req.body || {};
    const PlantImage = req.file ? `/api/seller/uploads/${req.file.filename}` : null;

    const errors = [];
    if (!PlantName) errors.push("Plant name is required");
    if (!PlantingDay) errors.push("Planting day is required");
    if (!PlantingHeight) errors.push("Planting height is required");
    if (!price) errors.push("Price is required");
    if (!PlantAbout) errors.push("Plant description is required");
    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, error: "No image file uploaded" });
    }

    // Verify file exists on disk
    const filePath = path.join(__dirname, '..', 'Uploads', req.file.filename);
    if (!fs.existsSync(filePath)) {
      console.error(`File not found at: ${filePath}`);
      return res.status(500).json({ success: false, error: "Uploaded file not saved" });
    }

    const plant = new Seller({
      PlantImage,
      PlantName,
      PlantingDay,
      PlantingHeight,
      price,
      PlantAbout,
    });
    await plant.save();
    res.json({ success: true, message: "Product added successfully!", data: plant });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateSellerProduct = async (req, res) => {
  try {
    const { PlantName, PlantingDay, PlantingHeight, price, PlantAbout } = req.body || {};
    const PlantImage = req.file ? `/api/seller/uploads/${req.file.filename}` : undefined;

    const errors = [];
    if (!PlantName) errors.push("Plant name is required");
    if (!PlantingDay) errors.push("Planting day is required");
    if (!PlantingHeight) errors.push("Planting height is required");
    if (!price) errors.push("Price is required");
    if (!PlantAbout) errors.push("Plant description is required");
    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const updateData = { PlantName, PlantingDay, PlantingHeight, price, PlantAbout };
    if (PlantImage) updateData.PlantImage = PlantImage;

    const updatedPlant = await Seller.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedPlant) {
      return res.status(404).json({ success: false, error: "Product not found" });
    }

    res.json({ success: true, data: updatedPlant });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteSellerProduct = async (req, res) => {
  try {
    const deleted = await Seller.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: "Product not found" });
    }
    res.json({ success: true, data: deleted });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

const getAllSellerProducts = async (req, res) => {
  try {
    const products = await Seller.find().sort({ createdAt: -1 });
    res.json({ success: true, data: products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

const getSellerProductById = async (req, res) => {
  try {
    const product = await Seller.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: "Product not found" });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    console.error(error);
    res.status(404).json({ success: false, error: "Product not found" });
  }
};

module.exports = {
  addSellerProduct,
  updateSellerProduct,
  deleteSellerProduct,
  getAllSellerProducts,
  getSellerProductById,
};