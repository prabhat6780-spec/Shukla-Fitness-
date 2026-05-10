const User = require("../../models/user.models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendEmail, welcomeTemplate } = require('../../utils/email.util');

// ── Normal Register ──────────────────────────
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!email) return res.status(400).json({ message: "Email is required" });
        if (!password) return res.status(400).json({ message: "Password is required" });
        if (!name) return res.status(400).json({ message: "Name is required" });

        const existingUser = await User.findOne({ email });

        if (existingUser && existingUser.isAdminCreated && !existingUser.isClaimed) {
            return res.status(400).json({
                message: "This email was registered by gym admin. Please login with OTP to claim your account.",
                isAdminCreated: true
            });
        }

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Check admin credentials
        let role = "user";
        if (
            email === process.env.ADMIN_EMAIL &&
            password === process.env.ADMIN_SECRET_PASSWORD
        ) {
            const adminExists = await User.findOne({ role: 'admin' });
            if (adminExists) {
                return res.status(400).json({ message: "Admin already exists" });
            }
            role = "admin";
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        });

        await sendEmail(
            email,
            "Welcome to Shukla's Fitness 💪",
            welcomeTemplate(name)
        );

        res.status(201).json({
            message: `${role} registered successfully`,
            user
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ── User: Claim Account ──────────────────────
exports.claimAccount = async (req, res) => {
    try {
        const { email, otp, password } = req.body;

        if (!email) return res.status(400).json({ message: "Email is required" });
        if (!otp) return res.status(400).json({ message: "OTP is required" });
        if (!password) return res.status(400).json({ message: "Password is required" });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });
        if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
        if (user.otpExpiry < Date.now()) return res.status(400).json({ message: "OTP expired" });

        user.password = await bcrypt.hash(password, 10);
        user.isClaimed = true;
        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );
        user.token = token;
        await user.save();

        await sendEmail(
            email,
            "Welcome to Shukla's Fitness 💪",
            welcomeTemplate(user.name)
        );

        res.status(200).json({
            message: "Account activated! Welcome to Shukla's Fitness 💪",
            token,
            role: user.role,
            name: user.name
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};