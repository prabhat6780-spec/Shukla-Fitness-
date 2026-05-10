const Health = require("../../models/health.model")

const predictCalories = require("../../ml/calorieModel")
const predictBodyFat = require("../../ml/bodyfatModel")

const {
calculateBMI,
bmiCategory,
calorieCalculator
} = require("../../services/fitness.service")

exports.calculateHealth = async (req,res)=>{

try{

const {
age,
weight,
height,
gender,
abdomen,
chest
} = req.body


// BMI
const bmi = calculateBMI(weight,height)

const category = bmiCategory(bmi)


// calories formula
const calories = calorieCalculator(weight,height,age,gender)


// ML calories
const mlCalories = predictCalories(age,weight)


// ML body fat
const bodyFat = predictBodyFat(age,weight,height,abdomen,chest)



// save in database
const record = await Health.create({

userId:req.user.userId,

age,
weight,
height,
gender,

abdomen,
chest,

bmi,
bmiCategory:category,

calories,
mlCalories,

bodyFat

})



res.json({

bmi,
category,
calories,
mlCalories,
bodyFat,
record

})

}catch(error){

res.status(500).json({
error:error.message
})

}

}