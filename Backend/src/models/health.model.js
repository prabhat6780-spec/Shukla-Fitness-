const mongoose = require("mongoose")

const healthSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  age: Number,
  weight: Number,
  height: Number,
  gender: String,

  abdomen: Number,
  chest: Number,

bmi:Number,
bmiCategory:String,

maintenanceCalories: Number,
targetCalories: Number,
bodyFat:Number,

workoutSuggestion:String,
dietSuggestion:String,
diet_type: String,      // ← add
target_weight: Number,  // ← add this too, also missing
goal: String,           // ← add
plan:String

},{
timestamps:true
})

module.exports = mongoose.model("Health", healthSchema)