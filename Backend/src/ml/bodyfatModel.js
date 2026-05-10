const MLR = require("ml-regression-multivariate-linear")

const X = [
[25,70,1.7,85,95],
[30,80,1.75,90,100],
[35,85,1.8,95,105],
[40,95,1.85,100,110]
]

const y = [
[18],
[22],
[25],
[30]
]

const model = new MLR(X,y)

function predictBodyFat(age,weight,height,abdomen,chest){

const result = model.predict([age,weight,height,abdomen,chest])

return Number(result[0].toFixed(2))

}

module.exports = predictBodyFat