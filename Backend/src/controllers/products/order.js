const { Order, Cart, Product } = require('../../models/shop.models');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const getRazorpay = () => new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// ── Create Order ─────────────────────────────
exports.createOrder = async (req, res) => {
  try {
    const user_id = req.user.userId;
    const { deliveryAddress, payment_method } = req.body;

    if (!deliveryAddress) {
      return res.status(400).json({ message: "Delivery address is required" });
    }

    // ✅ FIRST GET CART
    const cart = await Cart.findOne({ user_id }).populate('items.product_id');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // ✅ CALCULATE AMOUNT AFTER CART
    const platformFee = 19;
    const finalAmount = cart.totalAmount + platformFee;

    // ✅ CHECK STOCK
    for (const item of cart.items) {
      if (!item.product_id.isAvailable) {
        return res.status(400).json({ message: `${item.product_id.name} not available` });
      }
      if (item.product_id.stock < item.quantity) {
        return res.status(400).json({ message: `Stock issue: ${item.product_id.name}` });
      }
    }

    let razorpayOrder = null;

    // ✅ ONLINE PAYMENT
    if (payment_method !== "cod") {
      razorpayOrder = await getRazorpay().orders.create({
        amount: finalAmount * 100, // ✅ CORRECT
        currency: "INR",
        receipt: `order_${Date.now()}`
      });
    }

    // ✅ CREATE ORDER
    const order = await Order.create({
      user_id,
      razorpay_order_id: razorpayOrder ? razorpayOrder.id : null,

      items: cart.items.map(item => ({
        product_id: item.product_id._id,
        name: item.product_id.name,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        price: item.product_id.discountPrice || item.product_id.price
      })),

      totalAmount: finalAmount, // ✅ FIXED

      status: payment_method === "cod" ? "processing" : "pending",

      payment: {
        razorpay_order_id: razorpayOrder ? razorpayOrder.id : null,
        status: "pending"
      },

      deliveryAddress
    });

    // ✅ COD FLOW
    if (payment_method === "cod") {

      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product_id, {
          $inc: { stock: -item.quantity }
        });
      }

      await Cart.findOneAndDelete({ user_id });
    const populatedOrder = await Order.findById(order._id)
  .populate({
    path: "items.product_id",
    select: "name images"
  });


      return res.status(200).json({
        message: "Order placed (COD) ✅",
        order: populatedOrder,
        order_id: order._id,      // ✅ ADD THIS
        amount: finalAmount       // ✅ ADD THIS
      });
    }
const populatedOrder = await Order.findById(order._id)
  .populate("items.product_id", "name images");
    // ✅ ONLINE RESPONSE
    res.status(201).json({
      message: "Order created",
      order: populatedOrder,
      order_id: order._id,
      amount: finalAmount,       // ✅ FIXED
      razorpay: {
        key: process.env.RAZORPAY_KEY_ID,
        order_id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Verify Payment ───────────────────────────
exports.verifyPayment = async (req, res) => {
    try {
        const user_id = req.user.userId;
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ message: "Payment verification failed" });
        }

        const order = await Order.findOne({ 'payment.razorpay_order_id': razorpay_order_id });
        if (!order) return res.status(404).json({ message: "Order not found" });

        order.status = 'processing';
        order.payment.razorpay_payment_id = razorpay_payment_id;
        order.payment.razorpay_signature = razorpay_signature;
        order.payment.status = 'paid';
        await order.save();

        // Reduce stock
        for (const item of order.items) {
            await Product.findByIdAndUpdate(item.product_id, {
                $inc: { stock: -item.quantity }
            });
        }

        // Clear cart
        await Cart.findOneAndDelete({ user_id });

        res.status(200).json({
            message: "Payment verified! Order placed 🎉",
            user_id,
            order_id: order._id,
            payment_id: razorpay_payment_id
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ── Get My Orders ────────────────────────────
exports.getMyOrders = async (req, res) => {
    try {
        const user_id = req.user.userId;

        const orders = await Order.find({ user_id })
            .populate('items.product_id', 'name images price')
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Orders fetched successfully",
            user_id,
            total: orders.length,
            orders
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ── Get Single Order ─────────────────────────
exports.getSingleOrder = async (req, res) => {
    try {
        const user_id = req.user.userId;
        const { orderId } = req.params;

        const order = await Order.findOne({ _id: orderId, user_id })
            .populate('items.product_id', 'name images price');

        if (!order) return res.status(404).json({ message: "Order not found" });

        res.status(200).json({
            message: "Order fetched successfully",
            user_id,
            order
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};