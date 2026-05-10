const axios = require("axios");
const fs = require("fs");

// ⭐ Nutrition database for common foods
const NUTRITION_DB = {
  "tomato":       { calories: 18,  protein: 0.9, carbs: 3.9, fat: 0.2 },
  "watermelon":   { calories: 30,  protein: 0.6, carbs: 7.6, fat: 0.2 },
  "banana":       { calories: 89,  protein: 1.1, carbs: 23,  fat: 0.3 },
  "apple":        { calories: 52,  protein: 0.3, carbs: 14,  fat: 0.2 },
  "mango":        { calories: 60,  protein: 0.8, carbs: 15,  fat: 0.4 },
  "potato":       { calories: 77,  protein: 2.0, carbs: 17,  fat: 0.1 },
  "onion":        { calories: 40,  protein: 1.1, carbs: 9.3, fat: 0.1 },
  "spinach":      { calories: 23,  protein: 2.9, carbs: 3.6, fat: 0.4 },
  "carrot":       { calories: 41,  protein: 0.9, carbs: 10,  fat: 0.2 },
  "rice":         { calories: 130, protein: 2.7, carbs: 28,  fat: 0.3 },
  "wheat":        { calories: 340, protein: 13,  carbs: 72,  fat: 2.5 },
  "milk":         { calories: 42,  protein: 3.4, carbs: 5.0, fat: 1.0 },
  "orange":       { calories: 47,  protein: 0.9, carbs: 12,  fat: 0.1 },
  "grapes":       { calories: 69,  protein: 0.7, carbs: 18,  fat: 0.2 },
  "grape":        { calories: 69,  protein: 0.7, carbs: 18,  fat: 0.2 },
  "cauliflower":  { calories: 25,  protein: 1.9, carbs: 5.0, fat: 0.3 },
  "cabbage":      { calories: 25,  protein: 1.3, carbs: 6.0, fat: 0.1 },
  "peas":         { calories: 81,  protein: 5.4, carbs: 14,  fat: 0.4 },
  "cucumber":     { calories: 15,  protein: 0.7, carbs: 3.6, fat: 0.1 },
  "corn":         { calories: 86,  protein: 3.2, carbs: 19,  fat: 1.2 },
  "lemon":        { calories: 29,  protein: 1.1, carbs: 9.3, fat: 0.3 },
  "chilli":       { calories: 40,  protein: 1.9, carbs: 8.8, fat: 0.4 },
  "chili":        { calories: 40,  protein: 1.9, carbs: 8.8, fat: 0.4 },
  "garlic":       { calories: 149, protein: 6.4, carbs: 33,  fat: 0.5 },
  "papaya":       { calories: 43,  protein: 0.5, carbs: 11,  fat: 0.3 },
  "pumpkin":      { calories: 26,  protein: 1.0, carbs: 6.5, fat: 0.1 },
  "brinjal":      { calories: 25,  protein: 1.0, carbs: 6.0, fat: 0.2 },
  "eggplant":     { calories: 25,  protein: 1.0, carbs: 6.0, fat: 0.2 },
  "pizza":        { calories: 266, protein: 11,  carbs: 33,  fat: 10  },
  "burger":       { calories: 295, protein: 17,  carbs: 24,  fat: 14  },
  "sandwich":     { calories: 250, protein: 12,  carbs: 30,  fat: 9   },
  "pasta":        { calories: 220, protein: 8,   carbs: 43,  fat: 1.3 },
  "bread":        { calories: 265, protein: 9,   carbs: 49,  fat: 3.2 },
  "egg":          { calories: 155, protein: 13,  carbs: 1.1, fat: 11  },
  "eggs":         { calories: 155, protein: 13,  carbs: 1.1, fat: 11  },
  "chicken":      { calories: 239, protein: 27,  carbs: 0,   fat: 14  },
  "fish":         { calories: 206, protein: 22,  carbs: 0,   fat: 12  },
  "salad":        { calories: 15,  protein: 1.3, carbs: 2.9, fat: 0.2 },
  "soup":         { calories: 62,  protein: 3.2, carbs: 7.8, fat: 2.0 },
  "curry":        { calories: 150, protein: 8,   carbs: 12,  fat: 8   },
  "dal":          { calories: 116, protein: 9,   carbs: 20,  fat: 0.4 },
  "roti":         { calories: 297, protein: 10,  carbs: 63,  fat: 1.7 },
  "chapati":      { calories: 297, protein: 10,  carbs: 63,  fat: 1.7 },
  "idli":         { calories: 39,  protein: 2,   carbs: 8,   fat: 0.2 },
  "dosa":         { calories: 168, protein: 3.9, carbs: 27,  fat: 5   },
  "samosa":       { calories: 308, protein: 6,   carbs: 32,  fat: 18  },
  "biryani":      { calories: 163, protein: 7,   carbs: 29,  fat: 3   },
  "paneer":       { calories: 265, protein: 18,  carbs: 3.4, fat: 20  },
  "yogurt":       { calories: 59,  protein: 10,  carbs: 3.6, fat: 0.4 },
  "curd":         { calories: 98,  protein: 11,  carbs: 3.4, fat: 4.3 },
  "strawberry":   { calories: 32,  protein: 0.7, carbs: 7.7, fat: 0.3 },
  "strawberries": { calories: 32,  protein: 0.7, carbs: 7.7, fat: 0.3 },
  "pineapple":    { calories: 50,  protein: 0.5, carbs: 13,  fat: 0.1 },
  "pomegranate":  { calories: 83,  protein: 1.7, carbs: 19,  fat: 1.2 },
  "coconut":      { calories: 354, protein: 3.3, carbs: 15,  fat: 33  },
  "almond":       { calories: 579, protein: 21,  carbs: 22,  fat: 50  },
  "almonds":      { calories: 579, protein: 21,  carbs: 22,  fat: 50  },
  "default":      { calories: 150, protein: 3.0, carbs: 20,  fat: 5.0 },
}

// ⭐ Skip these generic labels to find specific food name
const SKIP_LABELS = [
  "food", "dish", "cuisine", "ingredient", "recipe", "produce",
  "natural foods", "whole food", "superfood", "vegetable", "fruit",
  "plant", "local food", "vegan nutrition", "leaf vegetable",
  "staple food", "frutti di bosco", "accessory fruit", "melon",
  "citrus", "berry", "legume", "nut", "seed", "spice", "herb",
  "cooking", "meal", "snack", "drink", "beverage", "juice",
  "organic", "fresh", "raw", "cooked", "fried", "boiled",
  "red", "green", "yellow", "orange", "white", "purple",
  "round", "sweet", "sour", "bitter", "salty"
]

const getNutrition = (labels) => {
  console.log("🔍 Vision detected labels:", labels)

  // ⭐ Step 1: Exact match in DB (skip generic labels)
  for (const label of labels) {
    const key = label.toLowerCase().trim()
    if (SKIP_LABELS.includes(key)) continue
    if (NUTRITION_DB[key]) {
      console.log("✅ Exact match found:", label)
      return { name: label, ...NUTRITION_DB[key] }
    }
  }

  // ⭐ Step 2: Partial match in DB
  for (const label of labels) {
    const key = label.toLowerCase().trim()
    if (SKIP_LABELS.includes(key)) continue
    for (const dbKey of Object.keys(NUTRITION_DB)) {
      if (dbKey === "default") continue
      if (key.includes(dbKey) || dbKey.includes(key)) {
        console.log("✅ Partial match found:", label, "->", dbKey)
        return { name: label, ...NUTRITION_DB[dbKey] }
      }
    }
  }

  // ⭐ Step 3: Use first non-generic label as name with default nutrition
  const specificLabel = labels.find(l => !SKIP_LABELS.includes(l.toLowerCase().trim()))
  const name = specificLabel || labels[0] || "Unknown food"
  console.log("⚠️ No DB match, using label:", name)

  return { name, ...NUTRITION_DB["default"] }
}

const analyzeImageWithClaude = async (imagePath, mimeType) => {
  const imageData = fs.readFileSync(imagePath)
  const base64Image = imageData.toString("base64")

  const apiKey = process.env.GOOGLE_VISION_API_KEY
  const url = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`
  const requestBody = {
    requests: [{
      image: { content: base64Image },
      features: [
        { type: "LABEL_DETECTION",  maxResults: 15 },
        { type: "WEB_DETECTION",    maxResults: 5  },
        { type: "OBJECT_LOCALIZATION", maxResults: 5 },
      ]
    }]
  }

  const response = await axios.post(url, requestBody)
  const result = response.data.responses[0]

  // ⭐ Collect all detected labels (web first = more specific)
  const webLabels    = result.webDetection?.bestGuessLabels?.map(l => l.label) || []
  const objectLabels = result.localizedObjectAnnotations?.map(o => o.name) || []
  const visionLabels = result.labelAnnotations?.map(l => l.description) || []

  console.log("🌐 Web labels:",    webLabels)
  console.log("📦 Object labels:", objectLabels)
  console.log("🏷️  Vision labels:", visionLabels)

  // ⭐ Priority: web > object > vision (most specific first)
  const allLabels = [...webLabels, ...objectLabels, ...visionLabels]

  const nutrition = getNutrition(allLabels)

  return {
    food_name:          nutrition.name,
    estimated_calories: nutrition.calories,
    protein:            nutrition.protein,
    carbs:              nutrition.carbs,
    fat:                nutrition.fat,
  }
}

module.exports = { analyzeImageWithClaude }