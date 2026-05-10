function calculateBMI(weight, height) {
  // ⭐ height comes in cm, convert to meters
  const heightInMeters = height / 100
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(2))
}

function bmiCategory(bmi) {
  if (bmi < 18.5) return "Underweight"
  if (bmi < 25) return "Normal"
  if (bmi < 30) return "Overweight"
  return "Obese"
}

function calorieCalculator(weight, height, age, gender) {
  // ⭐ height is already in cm — do NOT multiply by 100
  let bmr
  if (gender === "Male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161
  }
  return Math.round(bmr * 1.55)
}

function workoutRecommendation(goal) {
  goal = goal.toLowerCase()
  if (goal.includes("weight")) return "Cardio + HIIT workouts 5 days per week"
  if (goal.includes("muscle")) return "Strength training and progressive overload workouts"
  return "Balanced workout routine"
}

function dietRecommendation(goal, dietType) {
  goal = goal.toLowerCase()
  if (goal.includes("weight")) return `${dietType} diet with calorie deficit`
  if (goal.includes("muscle")) return `${dietType} diet with high protein`
  return `Balanced ${dietType} diet`
}

module.exports = {
  calculateBMI,
  bmiCategory,
  calorieCalculator,
  workoutRecommendation,
  dietRecommendation
}