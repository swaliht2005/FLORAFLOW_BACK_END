

const express = require("express");
const {
  addSellerProduct,
  updateSellerProduct,
  deleteSellerProduct,
  getAllSellerProducts,
  getSellerProductById,
} = require("../controllers/SellerController");
const { upload } = require("../middlewares/fileUploadMiddleware");

const router = express.Router();

router.post("/add", upload, addSellerProduct); // Use upload directly since it's pre-configured with .single
router.get("/", getAllSellerProducts);
router.get("/:id", getSellerProductById);
router.put("/:id", upload, updateSellerProduct); // Use upload directly
router.delete("/:id", deleteSellerProduct);

module.exports = { sellerRouter: router };