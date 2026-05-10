const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, default: null,  required: true, unique: true },
    password: {
        type: String,
        default: null,
        required: function () {
            return !this.googleId && !this.isAdminCreated;
        }
    },
    googleId: { type: String, default: null },
    isNewUser: { type: Boolean, default: false },
    lastLogin: { type: Date, default: null },
    isAdminCreated: { type: Boolean, default: false },
    isClaimed: { type: Boolean, default: false },
    role: { type: String, enum: ["user", "admin"], default: 'user' },
    otp: { type: String, default: null },
    otpExpiry: { type: Date, default: null },
    otpSentAt: { type: Date, default: null },
    resetToken: { type: String, default: null },
    resetTokenExpiry: { type: Date, default: null },
    resetOTP: { type: String, default: null },
    resetOTPExpiry: { type: Date, default: null },
    token: { type: String, default: null },

    // ── Profile ──────────────────────────────
    phone: { type: String, default: null },      // ← only once here
    age: { type: Number, default: null },
    gender: {
        type: String,
        enum: ['male', 'female', 'other', null],
        default: null
    },
    birthdate: { type: Date, default: null },
    address: { type: String, default: null },
    photo: { type: String, default: null },

    // ── Body Measurements ────────────────────
    height: { type: Number, default: null },
    weight: { type: Number, default: null },
    chest: { type: Number, default: null },
    abdomen: { type: Number, default: null },
    bmi: { type: Number, default: null },

    // ── Fitness ──────────────────────────────
    fitnessGoal: {
        type: String,
        enum: ['weight_loss', 'muscle_gain', 'maintain_fitness', 'improve_stamina', 'flexibility', 'weight_gain', null],
        default: null
    },
    fitnessLevel: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', null],
        default: null
    },
    isActive: {
  type: Boolean,
  default: true
},

    // ── Membership ───────────────────────────
  membership: {
  plan: { type: String, default: null },        // basic / pro / elite / unlimited
  planName: { type: String, default: null },    // Basic Plus etc
  duration: { type: Number, default: null },    // months
  orderId: { type: String, default: null },

  startDate: { type: Date, default: null },
  endDate: { type: Date, default: null },

  status: {
    type: String,
    enum: ['active', 'expired', 'pending', null],
    default: null
  },

  amount: { type: Number, default: null }
},
   // ── Free Trial ───────────────────────────
    trial: {
        plan: {
            type: String,
            enum: ['Basic', 'Pro', 'Elite', 'Unlimited', 'Home Workout', null],
            default: null
        },
        goal:           { type: String, default: null },
        startedAt:      { type: Date,   default: null },
        expiresAt:      { type: Date,   default: null },
        grantedBy:      { type: String, enum: ['self', 'admin'], default: 'self' },
        grantedByAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
    }

}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;