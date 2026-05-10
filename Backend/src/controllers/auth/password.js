const crypto = require('crypto');
const User = require('../../models/user.models');
const bcrypt = require('bcrypt');
const otpGenerator = require('otp-generator');
const { sendEmail, forgotPasswordTemplate } = require('../../utils/email.util');

// Forgot Password
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetOTP = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            specialChars: false,
            lowerCaseAlphabets: false
        });

        user.resetToken = resetToken;
        user.resetTokenExpiry = Date.now() + 60 * 60 * 1000;
        user.resetOTP = resetOTP;
        user.resetOTPExpiry = Date.now() + 10 * 60 * 1000;
        await user.save();

        const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;

        // Only email — no SMS
        await sendEmail(
            email,
            "Shukla's Fitness - Password Reset",
            forgotPasswordTemplate(resetOTP, resetLink)
        );

        res.json({ message: "Reset OTP sent to email successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Reset Password
exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        if (user.resetOTP !== otp.toString() || user.resetOTPExpiry < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetOTP = undefined;
        user.resetOTPExpiry = undefined;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        res.json({ message: "Password reset successful" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};