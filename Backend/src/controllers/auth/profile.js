const User = require('../../models/user.models');
const { sendEmail, membershipTemplate } = require('../../utils/email.util');

// ── Get Profile ──────────────────────────────
exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        const user = await User.findById(userId)
            .select('-password -token -otp -otpExpiry -otpSentAt -resetOTP -resetOTPExpiry -resetToken -resetTokenExpiry');

        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({
            message: "Profile fetched successfully",
            user_id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            age: user.age,
            gender: user.gender,
            birthdate: user.birthdate,
            address: user.address,
            photo: user.photo,
            height: user.height,
            weight: user.weight,
            chest: user.chest,
            abdomen: user.abdomen,
            bmi: user.bmi,
            fitnessGoal: user.fitnessGoal,
            fitnessLevel: user.fitnessLevel,
            membership: user.membership,
            role: user.role,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ── Update Profile ───────────────────────────
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const {
            name, phone, age, gender, birthdate,
            address, photo, height, weight,
            chest, abdomen, fitnessGoal, fitnessLevel
        } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (name !== undefined)         user.name = name;
        if (phone !== undefined)        user.phone = phone;
        if (age !== undefined)          user.age = age;
        if (gender !== undefined)       user.gender = gender;
        if (birthdate !== undefined)    user.birthdate = birthdate;
        if (address !== undefined)      user.address = address;
        if (photo !== undefined)        user.photo = photo;
        if (height !== undefined)       user.height = height;
        if (weight !== undefined)       user.weight = weight;
        if (chest !== undefined)        user.chest = chest;
        if (abdomen !== undefined)      user.abdomen = abdomen;
        if (fitnessGoal !== undefined)  user.fitnessGoal = fitnessGoal;
        if (fitnessLevel !== undefined) user.fitnessLevel = fitnessLevel;

          if (user.height && user.weight) {
            const heightInMeters = user.height / 100;
            user.bmi = parseFloat((user.weight / (heightInMeters * heightInMeters)).toFixed(2));
        }
        await user.save();  // BMI auto calculated here

        res.status(200).json({
            message: "Profile updated successfully",
            user_id: user._id,
            name: user.name,
            phone: user.phone,
            age: user.age,
            gender: user.gender,
            birthdate: user.birthdate,
            address: user.address,
            photo: user.photo,
            height: user.height,
            weight: user.weight,
            chest: user.chest,
            abdomen: user.abdomen,
            bmi: user.bmi,
            fitnessGoal: user.fitnessGoal,
            fitnessLevel: user.fitnessLevel
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ── Get BMI Info ─────────────────────────────
exports.getBMIInfo = async (req, res) => {
    try {
        const userId = req.user.userId;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        if (!user.height || !user.weight) return res.status(400).json({ message: "Please update height and weight first" });

        // Recalculate BMI if null
        if (!user.bmi) {
            const heightInMeters = user.height / 100;
            user.bmi = parseFloat((user.weight / (heightInMeters * heightInMeters)).toFixed(2));
            await user.save();
        }

        let category = '';
        let advice = '';

        if (user.bmi < 18.5) {
            category = 'Underweight';
            advice = 'You need to gain weight. Focus on nutrition and strength training.';
        } else if (user.bmi < 24.9) {
            category = 'Normal weight';
            advice = 'Great! Maintain your current fitness routine.';
        } else if (user.bmi < 29.9) {
            category = 'Overweight';
            advice = 'Focus on cardio and a balanced diet.';
        } else {
            category = 'Obese';
            advice = 'Consult a fitness trainer and nutritionist immediately.';
        }

        res.status(200).json({
            user_id: user._id,
            bmi: user.bmi,
            category,
            advice,
            height: user.height,
            weight: user.weight
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ── Buy Membership (user) ────────────────────
exports.buyMembership = async (req, res) => {
    try {
        const userId = req.user.userId;

        const {
            planType,     // Basic / Pro / Elite / Unlimited
            planName,     // Basic / Basic Plus / Elite Plus etc
            duration,     // 1,3,6,12,24
            amount,
            startDate
        } = req.body;

        if (!planType || !planName || !duration || !amount) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // prevent active membership overwrite
        if (
            user.membership.status === 'active' &&
            user.membership.endDate > Date.now()
        ) {
            return res.status(400).json({
                message: "Active membership already exists",
                membership: user.membership
            });
        }

        const start = startDate ? new Date(startDate) : new Date();
        const end = new Date(start);

        end.setMonth(end.getMonth() + duration);

        const orderId = `ORD-${Date.now()}`;

        user.membership = {
            plan: planType.toLowerCase(),
            planName,
            duration,
            startDate: start,
            endDate: end,
            status: amount === 0 ? 'active' : 'pending',
            amount,
            orderId
        };

        await user.save();

        res.status(200).json({
            message: "Membership activated successfully 💪",
            orderId,
            membership: user.membership
        });

    } catch (err) {
          console.error("BUY MEMBERSHIP ERROR:", err); // 👈 ADD THIS
        res.status(500).json({ message: err.message });
    }
};
// ── Get Membership Status ────────────────────
exports.getMembership = async (req, res) => {
    try {
        const userId = req.user.userId;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Auto expire if end date passed
        if (
            user.membership.status === 'active' &&
            user.membership.endDate < Date.now()
        ) {
            user.membership.status = 'expired';
            await user.save();
        }

        const isActive = user.membership.status === 'active';
        let daysLeft = null;

        if (isActive && user.membership.endDate) {
            const diff = new Date(user.membership.endDate) - new Date();
            daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
        }

        res.status(200).json({
            message: "Membership fetched successfully",
            user_id: user._id,
            membership: user.membership,
            isActive,
            daysLeft
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.activateMembership = async (req, res) => {
    try {
        const userId = req.user.userId;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.membership.status !== "pending") {
            return res.status(400).json({
                message: "No pending membership found"
            });
        }

        user.membership.status = "active";

        await user.save();

        res.status(200).json({
            message: "Membership activated after payment 💪",
            membership: user.membership
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

