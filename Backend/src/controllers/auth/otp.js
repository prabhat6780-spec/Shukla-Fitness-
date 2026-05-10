const User = require('../../models/user.models');
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const { sendEmail, otpTemplate } = require('../../utils/email.util');

// Generate OTP
const generateOTP = () => otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false
});

// Send OTP
exports.sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email is required" });

        let user = await User.findOne({ email });

        const otp = generateOTP();

        if (!user) {
            user = await User.create({ email });
        
        }

        user.otp = otp;
        user.otpExpiry = Date.now() + 10 * 60 * 1000;
        user.otpSentAt = Date.now();
        await user.save();

        await sendEmail(email, "Shukla's Fitness - Your OTP", otpTemplate(otp));

        res.json({ message: "OTP sent successfully",
            isAdminCreated: user.isAdminCreated && !user.isClaimed ? true : false
         });


    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Resend OTP
exports.resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // 60 second cooldown
        if (user.otpSentAt && Date.now() - user.otpSentAt < 60 * 1000) {
            const secondsLeft = Math.ceil((60 * 1000 - (Date.now() - user.otpSentAt)) / 1000);
            return res.status(400).json({
                message: `Please wait ${secondsLeft} seconds before resending OTP`
            });
        }

        const otp = generateOTP();
        user.otp = otp;
        user.otpExpiry = Date.now() + 10 * 60 * 1000;
        user.otpSentAt = Date.now();
        await user.save();

        await sendEmail(email, "Shukla's Fitness - Resend OTP", otpTemplate(otp));

        res.status(200).json({ message: "OTP resent successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email) return res.status(400).json({ message: "Email is required" });

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        if (user.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        if (user.otpExpiry < Date.now()) {
            return res.status(400).json({ message: "OTP expired" });
        }

           // Admin created but not claimed → ask to set password
        if (user.isAdminCreated && !user.isClaimed) {
            return res.status(200).json({
                message: "OTP verified. Please set your password.",
                needsPassword: true,
                email: user.email,
                otp: otp
            });
        }

        // Clear OTP
        user.otp = null;
        user.otpExpiry = null;
        user.otpSentAt = null;

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        user.token = token;
        await user.save();

        res.json({
            message: "Login successful",
            token,
            role: user.role,
            name: user.name
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};