# 🏋️ Shukla Fitness – AI Powered Gym Management Platform

An AI-powered gym management and fitness planning platform built using the MERN Stack, Machine Learning, and Generative AI technologies.

---

# 🚀 Features

## 👤 User Features

- JWT Authentication
- Google OAuth Login
- OTP Email Verification
- AI Generated Fitness Plans
- Personalized Diet Plans
- Membership Management
- Razorpay Payment Integration
- Exercise Library
- Food Scanner & Nutrition Analysis
- User Profile Management
- Shop & Product Ordering

---

## 🛠️ Admin Features

- Admin Dashboard
- User Management
- Membership Approval
- Product Management
- Order Tracking
- Real-time Analytics using Socket.io
- Revenue Tracking

---

# 🤖 AI & Machine Learning

- Groq API (LLaMA 3.3-70B)
- Claude API
- Google Gemini API
- BMI Calculation
- Body Fat Prediction
- Maintenance Calorie Prediction

---

# 🧰 Tech Stack

## Frontend
- React.js
- Vite
- React Router DOM
- Axios
- Socket.io-client

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Bcrypt
- Nodemailer

## AI & APIs
- Groq API
- Google Gemini
- Anthropic Claude
- Razorpay
- Cloudinary

---

# ⚙️ Installation & Setup

## 🔧 Backend Setup

Navigate to the Backend directory and install dependencies:

```bash
cd Backend
npm install
npx nodemon server.js
```

The backend server will run on:

```bash
http://localhost:3000
```

---

## 💻 Frontend Setup

Navigate to the frontend directory and install dependencies:

```bash
cd frontend
npm install
npm run dev
```

The frontend application will run on:

```bash
http://localhost:5173
```




# 📂 Project Structure

```bash
Major Project/
│
├── Backend/
│   ├── src/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
└── README.md
```



# 🔐 Environment Variables

Create a `.env` file inside the `Backend` folder and add the following variables:

```env
# ── DATABASE ─────────────────────
MONGO_URI=

# ── GOOGLE AUTH ─────────────────
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# ── JWT AUTH ────────────────────
JWT_SECRET=

# ── EMAIL CONFIG ────────────────
EMAIL=
EMAIL_PASSWORD=your_app_password

# ── ADMIN ───────────────────────
ADMIN_EMAIL=admin@gmail.com
ADMIN_SECRET_PASSWORD=123456

# ── COMPANY ─────────────────────
COMPANY_NAME=Shukla Fitness

# ── GROQ AI ─────────────────────
GROQ_API_KEY=

# ── RAZORPAY ────────────────────
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# ── CLOUDINARY ──────────────────
CLOUD_NAME=
API_KEY=
API_SECRET=

# ── ANTHROPIC AI ────────────────
ANTHROPIC_API_KEY=

# ── CLIENT URL ──────────────────
CLIENT_URL=http://localhost:5173

# ── GOOGLE VISION API ───────────
GOOGLE_VISION_API_KEY=
```

---

# 🌐 API & Service Setup Guide

| Service | Purpose | Get From |
|----------|----------|----------|
| MongoDB Atlas | Database | https://www.mongodb.com/cloud/atlas |
| Google OAuth | Google Login Authentication | https://console.cloud.google.com |
| Gmail App Password | Email OTP Service | https://myaccount.google.com/apppasswords |
| Groq API | AI Fitness Plan Generation | https://console.groq.com |
| Razorpay | Payment Gateway | https://dashboard.razorpay.com |
| Cloudinary | Image Upload & Storage | https://cloudinary.com |
| Anthropic Claude API | AI Analysis | https://console.anthropic.com |
| Google Vision API | Image Detection | https://console.cloud.google.com |

---

# 📌 Important Notes

## JWT Secret

Generate any random secure string:

```env
JWT_SECRET=mySuperSecretKey123
```

---

## Gmail App Password

Use Gmail App Password — NOT your Gmail login password.

Enable:
- 2-Step Verification
- Generate App Password

---

## Google OAuth Redirect URL

Add this in Google Cloud Console:

```txt
http://localhost:3000/api/auth/google/callback
```

---

## Razorpay

Use Test Mode API keys during development.

---

## Cloudinary Credentials

Get credentials from:

```txt
Cloudinary Dashboard → Account Details
```




