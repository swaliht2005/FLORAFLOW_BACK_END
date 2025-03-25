const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  plantingDay: { type: String, required: true },
  height: { type: String, required: true },
  price: { type: Number, required: true },
  about: { type: String },
  image: { type: String },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
