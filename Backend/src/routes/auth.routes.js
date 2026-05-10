const express = require('express');
const router = express.Router();
const User= require("../models/user.models")
const isAdmin = require('../middleware/isAdmin.middleware');
const {verifyToken} = require("../middleware/auth.middleware")
const {
   register,
    claimAccount,
    loginWithPassword,
    sendOTP,
    resendOTP,
    verifyOTP,
    forgotPassword,
    resetPassword,
    logout,
    googleLogin,
    googleCallback,
    getProfile,
    updateProfile,
    getBMIInfo,
    buyMembership,   
    getMembership,
    adminDashboard,
    getAllUsers,
    getSingleUser,
    adminCheckUser,
    adminSendOTP,
    adminCreateUser,
    adminUpdateUser,
    makeAdmin,
    removeAdmin,
    updateMembership,
    deleteUser,
    adminAssignMembership,
    activateMembership,
    getPendingMemberships,
    adminApproveMembership,
    adminRejectMembership,
    adminResetPassword,
    sendMessageToUser,
    adminAnalytics,
    adminAdvancedAnalytics
} = require('../controllers/auth');   // ← points to index.js

// Public Routes 
router.post('/register',          register);
router.post('/login-password',    loginWithPassword);
router.post('/send-otp',          sendOTP);
router.post('/resend-otp',        resendOTP);
router.post('/verify-otp',        verifyOTP);
router.post('/forgot-password',   forgotPassword);
router.post('/reset-password',    resetPassword);
router.post('/claim-account',     claimAccount);
router.get('/google',             googleLogin);
router.get('/google/callback',    googleCallback);

// User Protected Routes
router.post('/logout',            verifyToken, logout);
router.get('/profile',            verifyToken, getProfile);
router.put('/profile/update',     verifyToken, updateProfile);
router.get('/profile/bmi',        verifyToken, getBMIInfo);
router.post('/membership/buy',      verifyToken, buyMembership); 
router.get('/membership/status',    verifyToken, getMembership); 
router.put('/membership/activate', verifyToken, activateMembership);

// Admin Routes 
router.get('/admin/dashboard',    verifyToken, isAdmin, adminDashboard);
router.get('/admin/all-users',    verifyToken, isAdmin, getAllUsers);
router.get('/admin/user/:userId', verifyToken, isAdmin, getSingleUser);
router.post('/admin/check-user',  verifyToken, isAdmin, adminCheckUser);
router.post('/admin/send-otp',    verifyToken, isAdmin, adminSendOTP);
router.post('/admin/create-user', verifyToken, isAdmin, adminCreateUser);
router.put('/admin/update-user',  verifyToken, isAdmin, adminUpdateUser);
router.put('/admin/make-admin',   verifyToken, isAdmin, makeAdmin);
router.put('/admin/remove-admin', verifyToken, isAdmin, removeAdmin);
router.put('/admin/membership',   verifyToken, isAdmin, updateMembership);
router.delete('/admin/delete-user/:userId', verifyToken, isAdmin, deleteUser);
router.post("/admin/reset-password", verifyToken, isAdmin, adminResetPassword);
router.post("/admin/send-message", verifyToken, isAdmin, sendMessageToUser);
router.put('/admin/assign-membership',   verifyToken, isAdmin, adminAssignMembership);
// 🔥 Pending Memberships
router.get('/admin/memberships/pending', verifyToken, isAdmin, getPendingMemberships );

// 🔥 Approve Membership
router.put( '/admin/membership/approve', verifyToken, isAdmin, adminApproveMembership );

// 🔥 Reject Membership
router.put( '/admin/membership/reject', verifyToken, isAdmin, adminRejectMembership );
// GET SINGLE USER MEMBERSHIP
router.get('/admin/users/:userId/membership', verifyToken, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('name email membership');

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      message: "User membership fetched",
      user
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/admin/analytics", verifyToken, isAdmin, adminAnalytics);
router.get("/admin/advanced-analytics", verifyToken, isAdmin, adminAdvancedAnalytics);
module.exports = router; 