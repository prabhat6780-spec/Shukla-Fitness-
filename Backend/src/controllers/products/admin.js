const { Product, Cart, Order } = require("../../models/shop.models");
const User = require("../../models/user.models");
const cloudinary = require("cloudinary").v2;

// ── Add Product ──────────────────────────────
exports.addProduct = async (req, res) => {
  try {
    let {
      name,
      description,
      price,
      discountPrice,
      category,
      subCategory,
      productType,
      weight,
      brand,
      tags,
    } = req.body;
    let { variants } = req.body;

// 🔥 parse if string
if (typeof variants === "string") {
  variants = JSON.parse(variants);
}

// fallback
if (!variants) variants = [];
    if (!subCategory || subCategory === "" || subCategory === "null") {
      subCategory = null;
    }

    if (!productType || productType === "" || productType === "null") {
      productType = null;
    }

    if (!name) return res.status(400).json({ message: "Name is required" });
    if (!price) return res.status(400).json({ message: "Price is required" });
    if (!category)
      return res.status(400).json({ message: "Category is required" });

    const product = await Product.create({
      name,
      description,
      price,
      discountPrice,
      category,
      subCategory,
      productType,
      images: req.files
        ? req.files.map((file) => ({
            url: file.path,
            public_id: file.filename,
          }))
        : [],
      variants,
      weight,
      brand,
      tags,
    });

    res.status(201).json({
      message: "Product added successfully",
      product,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: err.message || "Error adding product",
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let removeImages = [];

    if (req.body.removeImages) {
      removeImages = JSON.parse(req.body.removeImages);
    }
if (req.body.variants) {
  let variants = req.body.variants;

  if (typeof variants === "string") {
    variants = JSON.parse(variants);
  }

  product.variants = variants;
}
    // 🔥 DELETE IMAGES
    if (removeImages.length > 0) {
      for (const public_id of removeImages) {
        await cloudinary.uploader.destroy(public_id);
      }

      product.images = product.images.filter(
        (img) => !removeImages.includes(img.public_id)
      );
    }

    // 🔥 ADD NEW IMAGES
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => ({
        url: file.path,
        public_id: file.filename,
      }));

      product.images.push(...newImages);
    }

    // 🔥 UPDATE FIELDS
    const fields = [
      "name",
      "description",
      "price",
      "discountPrice",
      "category",
      "subCategory",
      "productType",
      "isAvailable",
      "weight",
      "brand",
      "tags",
    ];

    fields.forEach((field) => {
      let value = req.body[field];

      if (value === "" || value === "null") {
        value = null;
      }

      if (value !== undefined) {
        product[field] = value;
      }
    });

    // 🔥 EXTRA SAFETY
    if (!product.subCategory) product.subCategory = null;
    if (!product.productType) product.productType = null;

    await product.save();

    res.status(200).json({
      message: "Product updated successfully",
      product,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Delete Product ───────────────────────────
exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // 🔥 Delete images from Cloudinary
    for (const img of product.images) {
      if (img.public_id) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    }

    await Product.findByIdAndDelete(productId);

    res.status(200).json({
      message: "Product and images deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// ── Get All Orders ─────────────────────────────
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate({
        path: "user_id",
        select: "name email phone membership",
      })
      .populate("items.product_id", "name images price category")
      .sort({ createdAt: -1 });

    const formattedOrders = orders.map((o) => ({
      order_id: o._id,

      // ✅ FIXED FIELD
      razorpay_order_id: o.razorpay_order_id,

      status: o.status,
      totalAmount: o.totalAmount,
      payment: o.payment,
      deliveryAddress: o.deliveryAddress,
      items: o.items,
      createdAt: o.createdAt,

      user: {
        user_id: o.user_id?._id,
        name: o.user_id?.name,
        email: o.user_id?.email,
        phone: o.user_id?.phone,
        membership: o.user_id?.membership,
      },
    }));

    res.status(200).json({
      message: "All orders fetched successfully",
      total: orders.length,
      orders: formattedOrders,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Get Single Order ───────────────────────────
exports.getAdminSingleOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate({
        path: "user_id",
        select:
          "-password -token -otp -otpExpiry -otpSentAt -resetOTP -resetOTPExpiry -resetToken -resetTokenExpiry",
      })
      .populate("items.product_id");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order fetched successfully",
      order: {
        order_id: order._id,
        razorpay_order_id: order.razorpay_order_id, // ✅ FIXED
        status: order.status,
        totalAmount: order.totalAmount,
        payment: order.payment,
        deliveryAddress: order.deliveryAddress,
        items: order.items,
        createdAt: order.createdAt,

        user: {
          user_id: order.user_id?._id,
          name: order.user_id?.name,
          email: order.user_id?.email,
          phone: order.user_id?.phone,
          membership: order.user_id?.membership,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Update Order Status ────────────────────────
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "pending",
      "paid",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(orderId).populate(
      "user_id",
      "name email"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ✅ UPDATE STATUS
    order.status = status;

    // ✅ COD PAYMENT AUTO COMPLETE
    if (
      status === "delivered" &&
      order.payment?.status === "pending"
    ) {
      order.payment.status = "paid";
    }

    await order.save();

    res.status(200).json({
      message: "Order status updated successfully ✅",
      order_id: order._id,
      status: order.status,
      payment_status: order.payment?.status,

      user: {
        user_id: order.user_id?._id,
        name: order.user_id?.name,
        email: order.user_id?.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Get All Products (Admin) ───────────────────
exports.adminGetAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      message: "All products fetched",
      total: products.length,
      products,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /admin/users/:userId/orders
exports.getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ user_id: userId })
      .populate("items.product_id", "name images")
      .sort({ createdAt: -1 });

    res.json({
      message: "User orders fetched",
      total: orders.length,
      orders
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};