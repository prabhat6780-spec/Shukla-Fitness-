const jwt = require('jsonwebtoken');
const User = require('../models/user.models');

// auth.middleware.js
exports.verifyToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded; // ✅ now req.user.userId works everywhere

        next();

    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};