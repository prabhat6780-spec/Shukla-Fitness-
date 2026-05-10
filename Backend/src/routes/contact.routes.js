const express = require("express");
const router = express.Router();
const { sendMessage, getMessages, deleteMessage, replyMessage, markAsRead } = require("../controllers/contact/contact.controller");

// public
router.post("/", sendMessage);

// admin
router.get("/", getMessages);
router.put("/:id/reply", replyMessage);
router.delete("/:id", deleteMessage);
router.put("/:id/read", markAsRead);

module.exports = router;