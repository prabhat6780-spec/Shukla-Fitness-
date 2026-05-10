const User = require('../../models/user.models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.loginWithPassword = async (req, res) => {
    try {
        const { email, phone, password } = req.body;

        if (!email && !phone) {
            return res.status(400).json({ message: "Email is required" });
        }

        let user = null;
        if (email) user = await User.findOne({ email });
        if (phone && !user) user = await User.findOne({ phone });

        if (!user) {
            return res.status(400).json({ message: "User not registered. Please register first." });
        }

        if (user.googleId && !user.password) {
            return res.status(400).json({ message: "This account was created using Google. Please login with Google." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        // 🔥 FIX: FORCE ADMIN ROLE IF MATCHES ENV
        if (
            user.email === process.env.ADMIN_EMAIL &&
            user.role !== "admin"
        ) {
            console.log("UPGRADING USER TO ADMIN 🔥");
            user.role = "admin";
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        const isFirstLogin = !user.lastLogin;

        user.lastLogin = Date.now();
        user.token = token;

        await user.save();

        console.log("LOGIN ROLE:", user.role); // ✅ DEBUG

        res.status(200).json({
            message: "Login successful",
            token,
            role: user.role,
            name: user.name,
            isNewLogin: isFirstLogin
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};