// ⭐ NEW FILE — create this at models/MembershipOrder.model.js
const mongoose = require("mongoose");

const membershipOrderSchema = new mongoose.Schema({
  userId:            { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  planType:          { type: String },
  planName:          { type: String },
  duration:          { type: Number },
  amount:            { type: Number },
  startDate:         { type: Date },
  endDate:           { type: Date },
  razorpayOrderId:   { type: String, default: null },
  razorpayPaymentId: { type: String, default: null },
  status:            { type: String, enum: ["paid", "failed", "pending"], default: "pending" },
  image:             { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model("MembershipOrder", membershipOrderSchema);