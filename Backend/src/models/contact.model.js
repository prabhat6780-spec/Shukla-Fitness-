const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  message: String,
    // ✅ NEW
  reply: { type: String, default: "" },
  replied: { type: Boolean, default: false },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Contact", contactSchema);