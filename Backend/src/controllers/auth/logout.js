const User = require('../../models/user.models');

exports.logout = async (req, res) => {
    try {
        const userId = req.user.userId;
        await User.findByIdAndUpdate(userId, { token: null });
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};