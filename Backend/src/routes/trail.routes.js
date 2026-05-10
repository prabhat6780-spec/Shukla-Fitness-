const express  = require("express");
const router   = express.Router();
const User     = require("../models/user.models");
const { verifyToken } = require("../middleware/auth.middleware");
const isAdmin = require("../middleware/isAdmin.middleware");

const VALID_PLANS = ["Basic", "Pro", "Elite", "Unlimited", "Home Workout"];
const TRIAL_DAYS  = 7;

router.get("/status", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("trial");

    if (!user || !user.trial || !user.trial.plan) {
      return res.json({ hasTrial: false });
    }

    return res.json({
      hasTrial:  true,
      plan:      user.trial.plan,
      expiresAt: user.trial.expiresAt,
      active:    new Date() < new Date(user.trial.expiresAt)
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/start", verifyToken, async (req, res) => {
  try {
    const { plan, goal } = req.body;

    if (!VALID_PLANS.includes(plan)) {
      return res.status(400).json({ message: "Invalid plan selected." });
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.trial && user.trial.plan) {
      return res.status(400).json({
        message: `You already used your free trial for ${user.trial.plan}. Only one trial per account is allowed.`
      });
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + TRIAL_DAYS);

    user.trial = {
      plan,
      goal:      goal || "",
      startedAt: new Date(),
      expiresAt,
      grantedBy: "self"
    };

    await user.save();

    res.json({
      success:  true,
      plan,
      expiresAt,
      message:  `Your ${TRIAL_DAYS}-day free trial for ${plan} is now active!`
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/admin/grant", verifyToken, isAdmin, async (req, res) => {
  try {
    const { userId, plan, days = 7, overwrite = false } = req.body;

    if (!userId || !plan) {
      return res.status(400).json({ message: "userId and plan are required." });
    }

    if (!VALID_PLANS.includes(plan)) {
      return res.status(400).json({ message: "Invalid plan." });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    if (user.trial && user.trial.plan && !overwrite) {
      return res.status(400).json({
        message:      `User already has a trial for ${user.trial.plan}.`,
        currentTrial: user.trial,
        hint:         "Send overwrite: true to replace it."
      });
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + Number(days));

    user.trial = {
      plan,
      startedAt:      new Date(),
      expiresAt,
      grantedBy:      "admin",
      grantedByAdmin: req.user.userId
    };

    await user.save();

    res.json({
      success:  true,
      userId,
      plan,
      days,
      expiresAt,
      message:  `Free trial for ${plan} granted for ${days} days.`
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/admin/revoke/:userId", verifyToken, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    user.trial = undefined;
    await user.save();

    res.json({ success: true, message: "Trial revoked successfully." });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/admin/all", verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find({ "trial.plan": { $exists: true, $ne: null } })
      .select("name email phone trial createdAt")
      .sort({ "trial.startedAt": -1 });

    res.json({ success: true, count: users.length, users });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/admin/user-by-email", verifyToken, isAdmin, async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        message: "Search query required"
      });
    }

    let user;

    // ✅ Detect email vs name
    if (query.includes("@")) {
      // 🔹 EMAIL SEARCH
      user = await User.findOne({
        email: query.toLowerCase().trim()
      }).select("name email phone trial membership");

    } else {
      // 🔹 NAME SEARCH
      user = await User.findOne({
        name: { $regex: query.trim(), $options: "i" }
      }).select("name email phone trial membership");
    }

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json({ success: true, user });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;