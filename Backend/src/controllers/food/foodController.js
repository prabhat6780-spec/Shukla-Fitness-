const { analyzeImageWithClaude } = require("../../utils/claudeAI");
const fs = require("fs");

const analyzeFood = async (req, res) => {
  try {
    const file = req.file
    if (!file) return res.status(400).json({ message: "No image uploaded" })

    const grams = parseFloat(req.body.grams) || 100 // ⭐ get grams from request

    const imagePath = file.path
    const mimeType = file.mimetype
    const aiData = await analyzeImageWithClaude(imagePath, mimeType)

    fs.unlink(imagePath, () => {})

    // ⭐ All nutrition values in DB are per 100g — scale to actual grams
    const factor = grams / 100
console.log("AI DATA:", aiData);
    res.json({
  food: aiData.food_name || "Unknown",
  grams: grams,

  calories: Math.round((aiData.estimated_calories || 150) * factor),

  protein: Math.round(((aiData.protein || 3) * factor) * 10) / 10,
  carbs:   Math.round(((aiData.carbs   || 20) * factor) * 10) / 10,
  fat:     Math.round(((aiData.fat     || 5) * factor) * 10) / 10,
});

  } catch (error) {
    console.error("Food analysis error:", error.message)
    res.status(500).json({ message: "Food analysis failed", error: error.message })
  }
}
module.exports = { analyzeFood };