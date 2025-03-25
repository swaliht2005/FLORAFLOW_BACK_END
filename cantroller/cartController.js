const Cart = require("../models/Cart");

// Add Cart
const addCart = async (req, res) => {
  try {
    const { userId, items, totalPrice } = req.body;

    const newCart = new Cart({ userId, items, totalPrice });
    await newCart.save();

    res.status(201).json({ message: "Cart saved successfully", cart: newCart });
  } catch (error) {
    res.status(500).json({ message: "Error saving cart", error: error.message });
  }
};

// Get Cart by User ID
const getCartByUser = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId }).populate("items.productId");
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart", error: error.message });
  }
};

module.exports = { addCart, getCartByUser };
