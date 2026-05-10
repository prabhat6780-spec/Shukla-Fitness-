const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema({
  url: { type: String },
  publicId: { type: String },
  type: { type: String }
}, { _id: false });

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: String,
  muscleGroup: String,

  // ✅ FIXED PROPERLY
  media: [mediaSchema],

  defaultSets: { type: Number, default: 3 },
  defaultReps: { type: Number, default: 12 },
  defaultDurationSeconds: { type: Number, default: 30 },
  restSeconds: { type: Number, default: 60 },

  difficulty: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    default: "beginner"
  },

  instructions: String

}, { timestamps: true });

const Exercise =
  mongoose.models.Exercise ||
  mongoose.model("Exercise", exerciseSchema);

module.exports = Exercise;