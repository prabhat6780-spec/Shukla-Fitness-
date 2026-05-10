const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  food: String,
  calories: Number,
  protein: Number,
  carbs: Number,
  fat: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});
module.exports = mongoose.model("Food", foodSchema);