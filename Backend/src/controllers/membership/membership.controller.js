const Razorpay = require("razorpay");
const crypto   = require("crypto");
const User     = require("../../models/user.models");
const MembershipOrder = require("../../models/membershipOrder.model");
const {Order} = require('../../models/shop.models')

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,    // same keys as shop
  key_secret: process.env.RAZORPAY_KEY_SECRET  // same keys as shop
});


// ── POST /api/membership/create-order ────────
// Step 1 — frontend calls this first to get a Razorpay order id
exports.createMembershipOrder = async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid amount" });
        }

        const order = await razorpay.orders.create({
            amount:   amount * 100,   // ₹ to paise
            currency: "INR",
            receipt:  `membership_${Date.now()}`
        });

        res.json({
            orderId: order.id,
            amount:  order.amount,             // in paise — Razorpay reads this directly
            key:     process.env.RAZORPAY_KEY_ID  // sent to frontend — no .env needed on frontend
        });

    } catch (err) {
        console.error("CREATE MEMBERSHIP ORDER ERROR:", err);
        res.status(500).json({ message: "Failed to create payment order." });
    }
};

// ── POST /api/membership/verify ──────────────
// Step 2 — verify Razorpay signature, activate membership, save order
exports.verifyMembershipPayment = async (req, res) => {
    try {
        const userId = req.user.userId;   // your middleware sets req.user.userId

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            planType,
            planName,
            duration,
            amount,
            startDate,
            image
        } = req.body;

        // verify signature — same logic as your shop verifyPayment
        const body     = razorpay_order_id + "|" + razorpay_payment_id;
        const expected = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        if (expected !== razorpay_signature) {
            return res.status(400).json({ message: "Invalid payment signature." });
        }

        // calculate start and end date
        const start = startDate ? new Date(startDate) : new Date();
        const end   = new Date(start);
        end.setMonth(end.getMonth() + Number(duration));

        // update user membership — same fields as your existing buyMembership
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.membership = {
            plan:      planType.toLowerCase(),
            planName,
            duration:  Number(duration),
            orderId:   razorpay_order_id,
            startDate: start,
            endDate:   end,
            status:    "active",        // active immediately after payment verified
            amount:    Number(amount)
        };

        await user.save();

        // save to MembershipOrder collection
        const order = await MembershipOrder.create({
            userId,
            planType,
            planName,
            duration:          Number(duration),
            amount:            Number(amount),
            startDate:         start,
            endDate:           end,
            razorpayOrderId:   razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            status:            "paid",
            image:             image || null
        });

        res.json({
            success: true,
            orderId: order._id,    // frontend navigates to /membership-orders/:orderId
            order
        });

    } catch (err) {
        console.error("VERIFY MEMBERSHIP PAYMENT ERROR:", err);
        res.status(500).json({ message: "Payment verification failed." });
    }
};

// ── GET /api/membership/orders ───────────────
// Get all membership orders for logged-in user
exports.getMyMembershipOrders = async (req, res) => {
    try {
        const userId = req.user.userId;

        const orders = await MembershipOrder.find({ userId })
            .sort({ createdAt: -1 });

        res.json({ orders });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// ── GET /api/membership/orders/:id ──────────
// Get single membership order
exports.getSingleMembershipOrder = async (req, res) => {
    try {
        const userId = req.user.userId;

        const order = await MembershipOrder.findOne({
            _id:    req.params.id,
            userId  // user can only see their own orders
        });

        if (!order) return res.status(404).json({ message: "Order not found." });

        res.json({ order });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// ── GET /api/membership/admin/orders ─────────
// Admin sees all membership orders across all users
exports.adminGetAllMembershipOrders = async (req, res) => {
    try {
        const orders = await MembershipOrder.find({})
            .populate("userId", "name email phone")
            .sort({ createdAt: -1 });

        res.json({ total: orders.length, orders });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// ── GET /api/membership/admin/user/:userId ───
// Admin sees all membership orders for a specific user
exports.adminGetUserMembershipOrders = async (req, res) => {
    try {
        const orders = await MembershipOrder.find({ userId: req.params.userId })
            .sort({ createdAt: -1 });

        res.json({ total: orders.length, orders });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

exports.getMembershipStatus = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).select("membership");

    if (!user || !user.membership || !user.membership.plan) {
      return res.json({ hasMembership: false });
    }

    const membership = user.membership;

    const isActive =
      membership.endDate &&
      new Date(membership.endDate) > new Date();

    return res.json({
      hasMembership: isActive,
      membership,
      active: isActive
    });

  } catch (err) {
    console.error("MEMBERSHIP STATUS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.adminGrantMembership = async (req, res) => {
  try {
    const { userId, planName, duration = 1, amount = 0 } = req.body;

    if (!userId || !planName) {
      return res.status(400).json({ message: "userId and planName required." });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    const start = new Date();
    const end   = new Date(start);
    end.setMonth(end.getMonth() + Number(duration));

    // ✅ Update user membership
    user.membership = {
      plan: planName.toLowerCase(),
      planName,
      duration: Number(duration),
      orderId: "ADMIN",
      startDate: start,
      endDate: end,
      status: "active",
      amount: Number(amount)
    };

    await user.save();

    // ✅ Save in MembershipOrder
    const order = await MembershipOrder.create({
      userId,
      planType: planName,
      planName,
      duration: Number(duration),
      amount: Number(amount),
      startDate: start,
      endDate: end,
      razorpayOrderId: "ADMIN",
      razorpayPaymentId: "ADMIN",
      status: "paid"
    });

    res.json({
      success: true,
      message: `${planName} membership granted successfully.`,
      order
    });

  } catch (err) {
    console.error("ADMIN GRANT MEMBERSHIP ERROR:", err);
    res.status(500).json({ message: "Server error." });
  }
};
exports.adminRevokeMembership = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId required." });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    user.membership = null;
    await user.save();

    res.json({
      success: true,
      message: "Membership revoked successfully."
    });

  } catch (err) {
    console.error("ADMIN REVOKE MEMBERSHIP ERROR:", err);
    res.status(500).json({ message: "Server error." });
  }
};

exports.adminGetAllMemberships = async (req, res) => {
  try {
    const users = await User.find({
      "membership.planName": { $exists: true, $ne: null }
    })
      .select("name email phone membership")
      .sort({ "membership.startDate": -1 });

    res.json({
      success: true,
      count: users.length,
      users
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

exports.adminUpdateMembership = async (req, res) => {
  try {
    const { userId, planName, duration } = req.body;

    if (!userId || !planName) {
      return res.status(400).json({ message: "userId & planName required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const start = new Date();
    const end = new Date(start);
    end.setMonth(end.getMonth() + Number(duration || 1));

    // ✅ UPDATE MEMBERSHIP
    user.membership = {
      plan: planName.toLowerCase(),
      planName,
      duration: Number(duration || 1),
      startDate: start,
      endDate: end,
      status: "active",
      amount: user.membership?.amount || 0,
      orderId: "ADMIN-UPDATE",
    };

    await user.save();

    // ✅ SAVE HISTORY
    await MembershipOrder.create({
      userId,
      planType: planName,
      planName,
      duration: Number(duration || 1),
      amount: user.membership.amount || 0,
      startDate: start,
      endDate: end,
      status: "paid",
      razorpayOrderId: "ADMIN",
      razorpayPaymentId: "ADMIN"
    });

    res.json({
      success: true,
      message: `Membership updated to ${planName}`
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.adminGetSingleMembershipOrder = async (req, res) => {
  try {
    const order = await MembershipOrder.findById(req.params.id)
      .populate("userId", "name email phone");

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.json({ order });

  } catch (err) {
    console.error("ADMIN GET ORDER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
// 🔥 correct import

exports.adminUserTotalSpending = async (req, res) => {
  try {
    const { userId } = req.params;

    /* 🔥 MEMBERSHIP */
    const membershipOrders = await MembershipOrder.find({
      userId,
      status: "paid"
    });

    const membershipTotal = membershipOrders.reduce(
      (sum, o) => sum + (o.amount || 0),
      0
    );

    /* 🔥 PRODUCT ORDERS (FIXED FIELD) */
    const orders = await Order.find({
      user_id: userId,   // ✅ FIXED
      status: { $ne: "cancelled" }
    });

    const ordersTotal = orders.reduce(
      (sum, o) => sum + (o.totalAmount || 0),
      0
    );

    const total = membershipTotal + ordersTotal;

    res.json({
      membershipTotal,
      ordersTotal,
      total
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


exports.adminTransactionsByDate = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const filter = {};

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    /* 🔥 MEMBERSHIP */
    const membership = await MembershipOrder.find({
      ...filter,
      status: "paid"
    }).populate("userId", "name email");

    /* 🔥 PRODUCTS */
    const products = await Order.find(filter);

    /* 🔥 MERGE */
    const transactions = [
      ...membership.map(m => ({
        type: "Membership",
        amount: m.amount,
        date: m.createdAt,
        user: m.userId?.name || "User",
        plan: m.planName
      })),
      ...products.map(o => ({
        type: "Product",
        amount: o.totalAmount,
        date: o.createdAt,
        user: o.deliveryAddress?.name || "User",
        plan: "Store Order"
      }))
    ];

    /* 🔥 SORT BY DATE */
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({
      count: transactions.length,
      transactions
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};