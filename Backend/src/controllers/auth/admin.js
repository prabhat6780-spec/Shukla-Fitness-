const User = require('../../models/user.models');
const {Order} =require('../../models/shop.models');
const MembershipOrder= require('../../models/membershipOrder.model')
const otpGenerator = require('otp-generator');
const crypto = require("crypto");
const { resetLinkTemplate } = require("../../utils/email.util");
const {
    sendEmail,
    welcomeTemplate,
    adminCreatedTemplate,
    adminUpdatedTemplate,
    adminRoleTemplate
} = require('../../utils/email.util');

const generateOTP = () => otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false
});

// ── Helper ───────────────────────────────────
const findUser = async (user_id, email) => {
    if (user_id) return await User.findById(user_id);
    if (email) return await User.findOne({ email });
    return null;
};

const formatUser = (u) => ({
    user_id: u._id,
    name: u.name,
    email: u.email,
    role: u.role,
    isAdminCreated: u.isAdminCreated,
    isClaimed: u.isClaimed,
    lastLogin: u.lastLogin,
    createdAt: u.createdAt,
    phone: u.phone,
    age: u.age,
    gender: u.gender,
    birthdate: u.birthdate,
    address: u.address,
    photo: u.photo,
    height: u.height,
    weight: u.weight,
    chest: u.chest,
    abdomen: u.abdomen,
    bmi: u.bmi,
    fitnessGoal: u.fitnessGoal,
    fitnessLevel: u.fitnessLevel,
    membership: u.membership,
       status: u.membership?.status || "inactive"
});

// ── Dashboard ────────────────────────────────
exports.adminDashboard = async (req, res) => {
  try {

    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });

    const activeMembers = await User.countDocuments({ 'membership.status': 'active' });
    const expiredMembers = await User.countDocuments({ 'membership.status': 'expired' });
    const pendingMembers = await User.countDocuments({ 'membership.status': 'pending' });

    const unclaimedUsers = await User.countDocuments({
      isAdminCreated: true,
      isClaimed: false
    });

    /* 🔥 REVENUE */
    const membershipOrders = await MembershipOrder.find({ status: "paid" });
    const membershipRevenue = membershipOrders.reduce((sum, o) => sum + (o.amount || 0), 0);

    const productOrders = await Order.find({
      status: { $in: ["paid", "processing", "shipped", "delivered"] }
    });

    const productRevenue = productOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    const totalRevenue = membershipRevenue + productRevenue;

    res.json({
      stats: {
        totalUsers,
        totalAdmins,
        activeMembers,
        expiredMembers,
        pendingMembers,
        unclaimedUsers,
        membershipRevenue,
        productRevenue,
        totalRevenue
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Get All Users ────────────────────────────
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({})
            .select('-password -token -otp -otpExpiry -otpSentAt -resetOTP -resetOTPExpiry -resetToken -resetTokenExpiry')
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "All users fetched successfully",
            total: users.length,
            users: users.map(formatUser)
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ── Get Single User ──────────────────────────
exports.getSingleUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { email } = req.query;

        const user = await findUser(userId, email);
        if (!user) return res.status(404).json({ message: "User not found" });

        const userDetails = await User.findById(user._id)
            .select('-password -token -otp -otpExpiry -otpSentAt -resetOTP -resetOTPExpiry -resetToken -resetTokenExpiry');

        res.status(200).json({
            message: "User fetched successfully",
            user: formatUser(userDetails)
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ── Check User ───────────────────────────────
exports.adminCheckUser = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email is required" });

        const user = await User.findOne({ email });

        if (user) {
            return res.status(200).json({
                exists: true,
                message: "User already exists",
                user: formatUser(user)
            });
        }

        return res.status(200).json({
            exists: false,
            message: "User not found. You can create a new account."
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ── Send OTP ─────────────────────────────────
exports.adminSendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const existingUser = await User.findOne({ email });

        // ❌ BLOCK IF USER ALREADY EXISTS (admin OR user)
        if (existingUser) {
            return res.status(400).json({
                message: "User/Admin already exists. Cannot send OTP."
            });
        }

        const otp = generateOTP();

        await sendEmail(
            email,
            "Your Shukla's Fitness Account OTP 💪",
            adminCreatedTemplate(otp)
        );

        await User.create({
            email,
            otp,
            otpExpiry: Date.now() + 10 * 60 * 1000,
            isAdminCreated: true,
            isClaimed: false
        });

        res.status(200).json({
            message: "OTP sent successfully"
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ── Create User ──────────────────────────────
exports.adminCreateUser = async (req, res) => {
    try {
        const { name, email, phone, otp } = req.body;

        if (!email) return res.status(400).json({ message: "Email is required" });
        if (!otp) return res.status(400).json({ message: "OTP is required" });
        if (!name) return res.status(400).json({ message: "Name is required" });

        const user = await User.findOne({ email });

// ❌ No record → OTP not sent
if (!user) {
    return res.status(400).json({
        message: "Please send OTP first"
    });
}

// ❌ Already created (claimed user/admin)
if (user.isClaimed === true) {
    return res.status(400).json({
        message: "User/Admin already exists. Cannot create again."
    });
}
// ❌ IMPORTANT: block if already claimed
if (user.isClaimed) {
    return res.status(400).json({
        message: "User already exists. Cannot create again."
    });
}
        if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
        if (user.otpExpiry < Date.now()) return res.status(400).json({ message: "OTP expired" });

        user.name = name;
        if (phone) user.phone = phone;
        user.otp = null;
        user.otpExpiry = null;
        user.isAdminCreated = true;
        user.isClaimed = false;
        user.role = "user";
        await user.save();

        await sendEmail(email, "Welcome to Shukla's Fitness 💪", welcomeTemplate(name));

        res.status(201).json({
            message: `Account created successfully for ${name}`,
            user_id: user._id
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ── Update User ──────────────────────────────
exports.adminUpdateUser = async (req, res) => {
    try {
        const {
            email,
            name,
            phone,
            role,
            gender,
            address,
            birthdate,
            height,
            weight,
            chest,
            abdomen,
            fitnessGoal,
            fitnessLevel
        } = req.body;

        if (!email) return res.status(400).json({ message: "Email is required" });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // BASIC
        if (name !== undefined) user.name = name;
        if (phone !== undefined) user.phone = phone;
        if (role !== undefined) user.role = role;

        // PROFILE
        if (gender !== undefined) user.gender = gender;
        if (address !== undefined) user.address = address;
        if (birthdate !== undefined) user.birthdate = birthdate;
// ADD THIS
if (req.body.photo !== undefined) {
  user.photo = req.body.photo;
}
        // BODY
        if (height !== undefined) user.height = height;
        if (weight !== undefined) user.weight = weight;
        if (chest !== undefined) user.chest = chest;
        if (abdomen !== undefined) user.abdomen = abdomen;

        // FITNESS
        if (fitnessGoal !== undefined) user.fitnessGoal = fitnessGoal;
        if (fitnessLevel !== undefined) user.fitnessLevel = fitnessLevel;

        // OPTIONAL: BMI auto calculate
        if (user.height && user.weight) {
            const h = user.height / 100;
            user.bmi = (user.weight / (h * h)).toFixed(2);
        }

        await user.save();

        await sendEmail(
            email,
            "Your Shukla's Fitness Account Updated 💪",
            adminUpdatedTemplate(user.name)
        );

        res.status(200).json({
            message: "User updated successfully",
            user: formatUser(user)
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ── Make Admin ───────────────────────────────
exports.makeAdmin = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email is required" });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });
        if (user.role === 'admin') return res.status(400).json({ message: "User is already an admin" });

        user.role = 'admin';
        await user.save();

        await sendEmail(email, "You are now an Admin - Shukla's Fitness 💪", adminRoleTemplate(user.name, 'admin'));

        res.status(200).json({
            message: `${user.name} is now an admin`,
            user: formatUser(user)
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ── Remove Admin ─────────────────────────────
exports.removeAdmin = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email is required" });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });
        if (user.role !== 'admin') return res.status(400).json({ message: "User is not an admin" });
        if (user._id.toString() === req.user.userId.toString()) {
            return res.status(400).json({ message: "You cannot remove your own admin role" });
        }

        user.role = 'user';
        await user.save();

        await sendEmail(email, "Admin Role Removed - Shukla's Fitness", adminRoleTemplate(user.name, 'user'));

        res.status(200).json({
            message: `${user.name} admin role removed`,
            user: formatUser(user)
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ── Update Membership ────────────────────────
exports.updateMembership = async (req, res) => {
    try {
        const { userId, user_id, email, plan, startDate, endDate, status, amount } = req.body;
        const id = userId || user_id;

        const user = await findUser(id, email);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (plan !== undefined)      user.membership.plan = plan;
        if (startDate !== undefined) user.membership.startDate = startDate;
        if (endDate !== undefined)   user.membership.endDate = endDate;
        if (status !== undefined)    user.membership.status = status;
        if (amount !== undefined)    user.membership.amount = amount;

        await user.save();

        res.status(200).json({
            message: "Membership updated successfully",
            user_id: user._id,
            name: user.name,
            email: user.email,
            membership: user.membership
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ── Delete User ─────────────────────────────
exports.deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // ❌ prevent admin deleting himself
        if (user._id.toString() === req.user.userId.toString()) {
            return res.status(400).json({ message: "You cannot delete yourself" });
        }

        await User.findByIdAndDelete(userId);

        res.status(200).json({
            message: "User deleted successfully"
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.adminAssignMembership = async (req, res) => {
    try {
        const {
            userId,
            planType,
            planName,
            duration,
            amount
        } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const start = new Date();
        const end = new Date();
        end.setMonth(end.getMonth() + duration);

        user.membership = {
            plan: planType.toLowerCase(),
            planName,
            duration,
            startDate: start,
            endDate: end,
            status: "active",
            amount,
            orderId: `ADMIN-${Date.now()}`
        };

        await user.save();

        res.json({
            message: "Membership assigned by admin",
            membership: user.membership
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getPendingMemberships = async (req, res) => {
    try {
        const users = await User.find({ 'membership.status': 'pending' })
            .select('name email membership');

        res.json({
            message: "Pending memberships",
            users
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.adminApproveMembership = async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.membership.status !== "pending") {
            return res.status(400).json({
                message: "No pending membership"
            });
        }

        user.membership.status = "active";

        await user.save();

        res.json({
            message: "Membership approved ✅",
            membership: user.membership
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.adminRejectMembership = async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await User.findById(userId);

        user.membership.status = "rejected";

        await user.save();

        res.json({
            message: "Membership rejected ❌"
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.adminResetPassword = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔐 generate token + OTP
    const resetToken = crypto.randomBytes(32).toString("hex");
    const otp = Math.floor(100000 + Math.random() * 900000); // 6 digit

    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 60 * 60 * 1000; // 1 hour
    user.resetOTP = otp;
    user.resetOTPExpiry = Date.now() + 10 * 60 * 1000; // 10 min

    await user.save();

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // ✅ USE YOUR TEMPLATE
    const html = resetLinkTemplate(user.name, resetLink);

    await sendEmail(
      user.email,
      "Reset Your Password 🔐",
      html
    );

    res.status(200).json({
      message: "Reset email sent successfully ✅",
    });

  } catch (err) {
    console.log("RESET ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
exports.sendMessageToUser = async (req, res) => {
  try {
    const { userId, message } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ message: "Missing data" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Sending message to:", user.email);

    await sendEmail(
      user.email,
      "Message from Shukla's Fitness 💪",
      `<p>${message}</p>`
    );

    res.status(200).json({ message: "Message sent successfully ✅" });

  } catch (err) {
    console.log("BACKEND ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};


exports.adminAnalytics = async (req, res) => {
  try {
    /* 🔥 MONTHLY REVENUE (LAST 6 MONTHS) */
    const months = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);

      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);

      const membership = await MembershipOrder.find({
        createdAt: { $gte: start, $lte: end },
        status: "paid"
      });

      const orders = await Order.find({
        createdAt: { $gte: start, $lte: end }
      });

      const total =
        membership.reduce((s, o) => s + o.amount, 0) +
        orders.reduce((s, o) => s + o.totalAmount, 0);

      months.push({
        month: d.toLocaleString("default", { month: "short" }),
        revenue: total
      });
    }

    /* 🔥 TOP USERS */
    const topUsers = await MembershipOrder.aggregate([
      { $match: { status: "paid" } },
      {
        $group: {
          _id: "$userId",
          total: { $sum: "$amount" }
        }
      },
      { $sort: { total: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      months,
      topUsers
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.adminAdvancedAnalytics = async (req, res) => {
  try {

    const today = new Date();
    const startOfDay = new Date(today.setHours(0,0,0,0));

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    /* 🔥 DAILY REVENUE */
    const dailyMembership = await MembershipOrder.find({
      createdAt: { $gte: startOfDay },
      status: "paid"
    });

    const dailyOrders = await Order.find({
      createdAt: { $gte: startOfDay }
    });

    const dailyRevenue =
      dailyMembership.reduce((s,o)=>s+o.amount,0) +
      dailyOrders.reduce((s,o)=>s+o.totalAmount,0);

    /* 🔥 MONTHLY REVENUE */
    const monthlyMembership = await MembershipOrder.find({
      createdAt: { $gte: startOfMonth },
      status: "paid"
    });

    const monthlyOrders = await Order.find({
      createdAt: { $gte: startOfMonth }
    });

    const monthlyRevenue =
      monthlyMembership.reduce((s,o)=>s+o.amount,0) +
      monthlyOrders.reduce((s,o)=>s+o.totalAmount,0);

    /* 🎯 RETENTION RATE */
    const totalUsers = await User.countDocuments({ role: "user" });
    const activeUsers = await User.countDocuments({
      "membership.status": "active"
    });

    const retentionRate =
      totalUsers === 0 ? 0 : ((activeUsers / totalUsers) * 100).toFixed(1);

    /* 🧍 ACTIVE USERS TODAY */
    const activeToday = await User.countDocuments({
      lastLogin: { $gte: startOfDay }
    });

    res.json({
      dailyRevenue,
      monthlyRevenue,
      retentionRate,
      activeToday
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};