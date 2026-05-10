const nodemailer =require("nodemailer");
const emailWrapper = require("./email.wrapper");
const s =require("./email.styles")

// email and sms
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth:{
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
})

const sendEmail = async (to, subject, html) => {
    try {
        await transporter.sendMail({
            from: `"Shukla's Fitness" <${process.env.EMAIL}>`,
            to,
            subject,
            html
        });
    } catch (error) {
        console.error('Email Error:', error.message);
    }
};

// Welcome Email
const welcomeTemplate = (name) => emailWrapper(`
     <h2 style="${s.heading}">Welcome, ${name}! 💪</h2>
    <p style="${s.paragraph}">Your account has been created successfully.</p>
    <p style="${s.paragraph}">We're excited to have you on board. Start your fitness journey today!</p>
    <br>
    <p style="${s.paragraph}"><b>— Shukla's Fitness Team</b></p>
    `)

// Admin Created OTP Template
const adminCreatedTemplate = (otp) => emailWrapper(`
    <h2 style="${s.heading}">Your Activation OTP 💪</h2>
    <p style="${s.paragraph}">Your account is being created at <b>Shukla's Fitness</b>.</p>
    <p style="${s.paragraph}">Please share this OTP with our staff to complete registration.</p>

    <div style="${s.otpBox}">
        <p style="${s.otpLabel}">Your OTP</p>
        <p style="${s.otpCode}">${otp}</p>
    </div>

    <div style="${s.warning}">
        <p style="${s.warningText}">⚠️ Valid for 10 minutes. Only share with Shukla's Fitness staff.</p>
    </div>
`);    

// Admin Role Change Template
const adminRoleTemplate = (name, newRole) => emailWrapper(`
    <h2 style="${s.heading}">Role Updated 💪</h2>
    <p style="${s.paragraph}">Hi ${name}, your role has been updated to <b>${newRole}</b> at Shukla's Fitness.</p>
    <p style="${s.paragraph}">If you did not expect this change, please contact us immediately.</p>
    <br>
    <p style="${s.paragraph}"><b>— Shukla's Fitness Team</b></p>
`);


// Account Updated Template
const adminUpdatedTemplate = (name) => emailWrapper(`
    <h2 style="${s.heading}">Account Updated 💪</h2>
    <p style="${s.paragraph}">Hi ${name}, your account details have been updated by Shukla's Fitness admin.</p>
    <p style="${s.paragraph}">If you did not expect this change, please contact us immediately.</p>
    <br>
    <p style="${s.paragraph}"><b>— Shukla's Fitness Team</b></p>
`);

// OTP Email
const otpTemplate = (otp, heading = "Your Login OTP") => emailWrapper(`
    <h2 style="${s.heading}">${heading}</h2>
    <p style="${s.paragraph}">Use the OTP below to continue. It is valid for <b>10 minutes</b>.</p>

    <div style="${s.otpBox}">
        <p style="${s.otpLabel}">One Time Password</p>
        <p style="${s.otpCode}">${otp}</p>
    </div>

    <div style="${s.warning}">
        <p style="${s.warningText}">🔒 Do not share this OTP with anyone. Shukla's Fitness will never ask for your OTP.</p>
    </div>
`);

// Forgot Password
const forgotPasswordTemplate = (otp, resetLink) => emailWrapper(`
    <h2 style="${s.heading}">Password Reset Request</h2>
    <p style="${s.paragraph}">We received a request to reset your password. Use the OTP below or click the button.</p>

    <div style="${s.otpBox}">
        <p style="${s.otpLabel}">Reset OTP</p>
        <p style="${s.otpCode}">${otp}</p>
    </div>

    <p style="text-align:center;">
        <a href="${resetLink}" style="${s.button}">Reset Password</a>
    </p>

    <div style="${s.warning}">
        <p style="${s.warningText}">⚠️ OTP valid for 10 minutes. Link valid for 60 minutes. If you didn't request this, ignore this email.</p>
    </div>
`);
const membershipTemplate = (name, plan, startDate, endDate, amount) => emailWrapper(`
    <h2 style="${s.heading}">Membership Confirmed! 💪</h2>
    <p style="${s.paragraph}">Hi ${name}, your membership has been activated successfully.</p>

    <div style="${s.otpBox}">
        <p style="${s.otpLabel}">Your Plan</p>
        <p style="${s.otpCode}">${plan.toUpperCase()}</p>
    </div>

    <p style="${s.paragraph}">📅 <b>Start Date:</b> ${new Date(startDate).toDateString()}</p>
    <p style="${s.paragraph}">📅 <b>End Date:</b> ${new Date(endDate).toDateString()}</p>
    <p style="${s.paragraph}">💰 <b>Amount Paid:</b> ₹${amount}</p>

    <div style="${s.warning}">
        <p style="${s.warningText}">🏋️ Train hard and achieve your fitness goals!</p>
    </div>
`);

// Contact Message Template (ADMIN)
const contactAdminTemplate = (name, email, phone, message) => emailWrapper(`
  <h2 style="${s.heading}">New Contact Message 📩</h2>

  <p style="${s.paragraph}"><b>Name:</b> ${name}</p>
  <p style="${s.paragraph}"><b>Email:</b> ${email}</p>
  <p style="${s.paragraph}"><b>Phone:</b> ${phone}</p>

  <div style="${s.otpBox}">
    <p style="${s.otpLabel}">Message</p>
    <p style="${s.paragraph}">${message}</p>
  </div>
`);

const contactUserTemplate = (name) => emailWrapper(`
  <h2 style="${s.heading}">Thanks for contacting us 💪</h2>
  <p style="${s.paragraph}">Hi ${name}, we received your message.</p>
  <p style="${s.paragraph}">Our team will contact you soon.</p>
`);
const replyTemplate = (name, reply) => emailWrapper(`
  <h2 style="${s.heading}">Reply from Shukla's Fitness 💪</h2>

  <p style="${s.paragraph}">Hi ${name},</p>

  <div style="${s.otpBox}">
    <p style="${s.paragraph}">${reply}</p>
  </div>

  <p style="${s.paragraph}">Thanks for contacting us!</p>
`);

// Reset Link Template (ADMIN RESET)
const resetLinkTemplate = (name, resetLink) => emailWrapper(`
    <h2 style="${s.heading}">Reset Your Password 🔐</h2>

    <p style="${s.paragraph}">Hi ${name},</p>

    <p style="${s.paragraph}">
        Your password reset request has been initiated by the admin of 
        <b>Shukla's Fitness</b>.
    </p>

    <p style="${s.paragraph}">
        Click the button below to reset your password:
    </p>

    <p style="text-align:center;">
        <a href="${resetLink}" style="${s.button}">
            Reset Password
        </a>
    </p>

    <div style="${s.warning}">
        <p style="${s.warningText}">
            ⚠️ This link is valid for a limited time. If you did not request this, please ignore this email.
        </p>
    </div>

    <br>
    <p style="${s.paragraph}">
        — Shukla's Fitness Team 💪
    </p>
`);
module.exports = { sendEmail, welcomeTemplate, otpTemplate, forgotPasswordTemplate,resetLinkTemplate, adminUpdatedTemplate, adminCreatedTemplate, adminRoleTemplate,membershipTemplate, contactAdminTemplate, contactUserTemplate, replyTemplate       };