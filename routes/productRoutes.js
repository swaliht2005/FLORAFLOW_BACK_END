const express = require("express");
const multer = require("multer");
const { addProduct, getProducts, getProductById, deleteProduct } = require("../controllers/productController");

const router = express.Router();

// Configure Multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

// Routes
router.post("/add", upload.single("image"), addProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.delete("/:id", deleteProduct);

module.exports = router;
