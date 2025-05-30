// model/sellerModel.js
const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
    PlantName: { type: String, required: true },
    PlantingDay: { type: String, required: true },
    PlantingHeight: { type: String, required: true },
    price: { type: Number, required: true },
    PlantAbout: { type: String, required: true },
    PlantImage: {
        data: { type: Buffer },
        contentType: { type: String },
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Add userId
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Seller', sellerSchema);