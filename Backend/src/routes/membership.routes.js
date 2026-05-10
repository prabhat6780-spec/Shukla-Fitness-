const express  = require("express");
const router   = express.Router();
const { verifyToken } = require("../middleware/auth.middleware");  // same as your auth routes
const isAdmin         = require("../middleware/isAdmin.middleware"); // same as your auth routes

const {
    createMembershipOrder,
    verifyMembershipPayment,
    getMyMembershipOrders,
    getSingleMembershipOrder,
    adminGetAllMembershipOrders,
    adminGetUserMembershipOrders,
     getMembershipStatus,
     adminGrantMembership,
     adminRevokeMembership,
     adminGetAllMemberships,
      adminUpdateMembership,
      adminGetSingleMembershipOrder,
        adminUserTotalSpending,
         adminTransactionsByDate
} = require("../controllers/membership/membership.controller");

// ── User routes ───────────────────────────────
router.post("/create-order",   verifyToken, createMembershipOrder);
router.post("/verify",         verifyToken, verifyMembershipPayment);
router.get("/orders",          verifyToken, getMyMembershipOrders);
router.get("/orders/:id",      verifyToken, getSingleMembershipOrder);
router.get("/status", verifyToken, getMembershipStatus);
// ── Admin routes ──────────────────────────────
router.get("/admin/orders",              verifyToken, isAdmin, adminGetAllMembershipOrders);
router.get("/admin/user/:userId/orders", verifyToken, isAdmin, adminGetUserMembershipOrders);

// 🔥 ADMIN MEMBERSHIP CONTROL
router.post(
  "/admin/grant",
  verifyToken,
  isAdmin,
  adminGrantMembership
);

router.post(
  "/admin/revoke",
  verifyToken,
  isAdmin,
  adminRevokeMembership
);

router.get(
  "/admin/all",
  verifyToken,
  isAdmin,
  adminGetAllMemberships
);

router.post(
  "/admin/update",
  verifyToken,
  isAdmin,
  adminUpdateMembership
);
router.get(
  "/admin/orders/:id",
  verifyToken,
  isAdmin,
  adminGetSingleMembershipOrder
);
router.get(
  "/admin/user/:userId/spending",
  verifyToken,
  isAdmin,
  adminUserTotalSpending
);

router.get(
  "/admin/transactions",
  verifyToken,
  isAdmin,
  adminTransactionsByDate
);
module.exports = router;