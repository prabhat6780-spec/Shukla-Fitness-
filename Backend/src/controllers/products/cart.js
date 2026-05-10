const { Cart, Product } = require('../../models/shop.models');

// ── Get Cart ─────────────────────────────────
exports.getCart = async (req, res) => {
    try {
        const user_id = req.user.userId;

        const cart = await Cart.findOne({ user_id })
            .populate('items.product_id', 'name images price discountPrice isAvailable');

        if (!cart || cart.items.length === 0) {
            return res.status(200).json({
                message: "Cart is empty",
                user_id,
                items: [],
                totalAmount: 0
            });
        }

        res.status(200).json({
            message: "Cart fetched successfully",
            user_id,
            items: cart.items,
            totalAmount: cart.totalAmount
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ── Add to Cart ──────────────────────────────
exports.addToCart = async (req, res, next) => {
  try {
    const user_id = req.user.userId;
    const { product_id, quantity = 1, size, color } = req.body;

    if (!product_id) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const price = product.discountPrice || product.price;

    // ✅ GET CART FIRST
    let cart = await Cart.findOne({ user_id });
    if (!cart) {
      cart = new Cart({ user_id, items: [] });
    }

    // ✅ CHECK EXISTING ITEM (IMPORTANT)
    const existingItem = cart.items.find(
      item =>
        item.product_id.toString() === product_id &&
        item.size === size &&
        item.color === color
    );

    if (existingItem) {
      // ✅ UPDATE QUANTITY
      existingItem.quantity += quantity;
    } else {
      // ✅ ADD NEW ITEM
      cart.items.push({
        product_id,
        quantity,
        size,
        color,
        price
      });
    }

    await cart.save();

    res.status(200).json({
      message: "Product added to cart",
      items: cart.items
    });

  } catch (err) {
    console.error(err);
    next(err);
  }
};

// ── Update Cart Item ─────────────────────────
exports.updateCartItem = async (req, res) => {
    try {
        const user_id = req.user.userId;
        const { product_id, quantity, size } = req.body;

        if (!product_id) return res.status(400).json({ message: "Product ID is required" });
        if (quantity === undefined) return res.status(400).json({ message: "Quantity is required" });

        const cart = await Cart.findOne({ user_id });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const itemIndex = cart.items.findIndex(
            item => item.product_id.toString() === product_id &&
            item.size === size
        );

        if (itemIndex === -1) return res.status(404).json({ message: "Item not found in cart" });

        if (quantity <= 0) {
            cart.items.splice(itemIndex, 1);
        } else {
            cart.items[itemIndex].quantity = quantity;
        }

        await cart.save();

        res.status(200).json({
            message: "Cart updated successfully",
            user_id,
            items: cart.items,
            totalAmount: cart.totalAmount
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ── Remove from Cart ─────────────────────────
exports.removeFromCart = async (req, res) => {
    try {
        const user_id = req.user.userId;
        const { product_id, size } = req.body;

        if (!product_id) return res.status(400).json({ message: "Product ID is required" });

        const cart = await Cart.findOne({ user_id });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.items = cart.items.filter(
            item => !(item.product_id.toString() === product_id && item.size === size)
        );

        await cart.save();

        res.status(200).json({
            message: "Item removed from cart",
            user_id,
            items: cart.items,
            totalAmount: cart.totalAmount
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ── Clear Cart ───────────────────────────────
exports.clearCart = async (req, res) => {
    try {
        const user_id = req.user.userId;
        await Cart.findOneAndDelete({ user_id });

        res.status(200).json({
            message: "Cart cleared",
            user_id
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};