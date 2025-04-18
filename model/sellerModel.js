
const mongoose = require('mongoose');

const SellerSchema = new mongoose.Schema(
  {
    PlantImage: { type: String },
    PlantName: { type: String, required: true },
    PlantingDay: { type: String, required: true },
    PlantingHeight: { type: String, required: true },
    price: { type: String, required: true },
    PlantAbout: { type: String, required: true },
  },
  {
    collection: 'Product-seller',
    timestamps: true,
  }
);

module.exports = mongoose.model('Seller', SellerSchema);