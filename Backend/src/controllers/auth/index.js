// controllers/auth/index.js
const { register, claimAccount,}= require('./register');
const { loginWithPassword }             = require('./login');
const { sendOTP, resendOTP, verifyOTP } = require('./otp');
const { forgotPassword, resetPassword } = require('./password');
const { logout }                        = require('./logout');
const { googleLogin, googleCallback }   = require('./google');
const { getProfile, updateProfile, getBMIInfo,  buyMembership, getMembership, activateMembership  }     = require('./profile');
const { adminDashboard,
    adminAnalytics,
    adminAdvancedAnalytics,
    getAllUsers,
    getSingleUser,
    adminCheckUser,
    adminSendOTP,
    adminCreateUser,
    adminUpdateUser,
    makeAdmin,
    removeAdmin,
    deleteUser,
    updateMembership, adminAssignMembership, 
    getPendingMemberships, adminApproveMembership, adminRejectMembership, adminResetPassword, sendMessageToUser} = require('./admin');

module.exports = {
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
    adminDashboard,
    getAllUsers,
    getSingleUser,
    adminCheckUser,
    adminSendOTP,
    adminCreateUser,
    adminUpdateUser,
    adminAssignMembership,
    makeAdmin,
    removeAdmin,
    updateMembership,
    buyMembership,    
    getMembership,
    deleteUser,
    activateMembership,
    getPendingMemberships,
    adminApproveMembership,
    adminRejectMembership,
    adminResetPassword,
    sendMessageToUser,
    adminAnalytics,
    adminAdvancedAnalytics
};