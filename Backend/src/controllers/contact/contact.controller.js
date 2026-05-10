const Contact = require("../../models/contact.model");
const { sendEmail, contactAdminTemplate, replyTemplate, contactUserTemplate } = require("../../utils/email.util");

exports.sendMessage = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // ✅ 1. Save in DB
    await Contact.create({ name, email, phone, message });

    // ✅ 2. Send email to ADMIN
    await sendEmail(
      process.env.EMAIL,   // your email
      "New Contact Message",
      contactAdminTemplate(name, email, phone, message)
    );
    await sendEmail(
  email,
  "We received your message",
  contactUserTemplate(name)
);

    res.json({ message: "Message sent successfully ✅" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed ❌" });
  }
};

exports.getMessages = async (req, res) => {
  const msgs = await Contact.find().sort({ createdAt: -1 });
  res.json(msgs);
};

exports.deleteMessage = async (req, res) => {
  await Contact.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};

// ✅ ADMIN REPLY
exports.replyMessage = async (req, res) => {
  try {
    const { reply } = req.body;

    const msg = await Contact.findById(req.params.id);
    if (!msg) return res.status(404).json({ message: "Not found" });

    // save reply
    msg.reply = reply;
    msg.replied = true;
    await msg.save();

    // send email to user
    await sendEmail(
      msg.email,
      "Reply from Shukla Fitness",
      replyTemplate(msg.name, reply)
    );

    res.json({ message: "Reply sent ✅" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed ❌" });
  }
};

// ✅ MARK AS READ
exports.markAsRead = async (req, res) => {
  try {
    const msg = await Contact.findById(req.params.id);

    if (!msg) return res.status(404).json({ message: "Not found" });

    msg.isRead = true;
    await msg.save();

    res.json({ message: "Marked as read" });

  } catch (err) {
    res.status(500).json({ message: "Failed" });
  }
};

