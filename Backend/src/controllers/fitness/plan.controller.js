const Health = require("../../models/health.model")

const groq = require("../../ai/groqClient")
const { buildPlanPrompt } = require("../../ai/planPrompt")

const predictBodyFat = require("../../ml/bodyfatModel")

const {
  calculateBMI,
  bmiCategory,
  calorieCalculator,
  workoutRecommendation,
  dietRecommendation
} = require("../../services/fitness.service")


const generatePlan = async (req,res)=>{

try{

const {
age,
weight,
height,
gender,
abdomen,
chest,
workout_type,
diet_type,
target_weight,
number_of_weeks,
comments
} = req.body


// BMI
const bmi = calculateBMI(weight,height)
const category = bmiCategory(bmi)


// Maintenance Calories
let maintenanceCalories = calorieCalculator(weight,height,age,gender)


// Target Calories
let targetCalories = maintenanceCalories

if(workout_type.toLowerCase().includes("loss")){
targetCalories = maintenanceCalories - 500
}

if(workout_type.toLowerCase().includes("gain")){
targetCalories = maintenanceCalories + 300
}


// Meal Distribution
const breakfastCalories = Math.round(targetCalories * 0.25)
const lunchCalories = Math.round(targetCalories * 0.35)
const snackCalories = Math.round(targetCalories * 0.10)
const dinnerCalories = Math.round(targetCalories * 0.30)


// Protein
const protein =
workout_type.toLowerCase().includes("muscle")
? Math.round(weight * 1.6)
: Math.round(weight * 1)


// Body Fat
const bodyFat = predictBodyFat(age,weight,height,abdomen,chest)


// Suggestions
const workoutAI = workoutRecommendation(workout_type)
const dietAI = dietRecommendation(workout_type,diet_type)

 const goal =
      Number(target_weight) > Number(weight) ? "Weight Gain" :
      Number(target_weight) < Number(weight) ? "Fat Loss"    :
      "Maintenance"

// Prompt
const prompt = buildPlanPrompt({

workout_type,
goal,
diet_type,
current_weight: weight,
target_weight,
age,
gender,
bmi,

dailyCalories: targetCalories,
breakfastCalories,
lunchCalories,
snackCalories,
dinnerCalories,

protein,

number_of_weeks,
comments

})


// Groq AI
const completion = await groq.chat.completions.create({

  model: "llama-3.3-70b-versatile",

  max_tokens: 8000,        // ⭐ VERY IMPORTANT (for long plans)

  temperature: 0.7,

  messages: [
    {
      role: "user",
      content: prompt
    }
  ]

})
const plan = completion.choices[0].message.content


// Save
  const record = await Health.create({
      userId: req.user.userId,
      age, weight, height, gender,
      abdomen, chest,
      bmi,
      bmiCategory:        category,
      maintenanceCalories,
      targetCalories,
      bodyFat,
      workoutSuggestion:  workoutAI,
      dietSuggestion:     dietAI,
      diet_type,                   // ✅ added
      target_weight,               // ✅ added
      goal,                        // ✅ added
      plan
    })

// Response
res.json({

bmi,
category,
maintenanceCalories,
targetCalories,
bodyFat,

workoutSuggestion: workoutAI,
dietSuggestion: dietAI,
goal,
diet_type,

plan,
record

})

}catch(error){

res.status(500).json({
error:error.message
})

}

}


const getMyPlans = async (req,res)=>{

try{

const plans = await Health.find({ userId:req.user.userId })
.sort({ createdAt:-1 })

res.json({
count:plans.length,
plans
})

}catch(error){

res.status(500).json({
error:error.message
})

}

}


const deletePlan = async (req,res)=>{

try{

const { id } = req.params

const plan = await Health.findOneAndDelete({
_id:id,
userId:req.user.userId
})

if(!plan){
return res.status(404).json({
message:"Plan not found"
})
}

res.json({
message:"Plan deleted successfully"
})

}catch(error){

res.status(500).json({
error:error.message
})

}

}

module.exports = { generatePlan, getMyPlans, deletePlan }