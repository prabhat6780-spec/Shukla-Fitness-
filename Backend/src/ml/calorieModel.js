const MLR = require("ml-regression-multivariate-linear")

const X = [
[20,60],
[25,70],
[30,80],
[35,90],
[40,100]
]

const y = [
[2000],
[2200],
[2500],
[2800],
[3000]
]

const model = new MLR(X,y)

function predictCalories(age,weight){

const result = model.predict([age,weight])

return Math.round(result[0])

}

module.exports = predictCalories