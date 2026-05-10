const fs = require("fs");
const path = require("path");

let nutritionData = null;

// 🔥 LOAD CSV
const loadCSV = () => {
  if (nutritionData) return nutritionData;

  const filePath = path.join(__dirname, "nutrition101.csv");
  const file = fs.readFileSync(filePath, "utf-8");

  const lines = file.split("\n").filter(line => line.trim() !== "");

  // remove header
  lines.shift();

  nutritionData = {};

  lines.forEach(line => {
    const cols = line.split(",");

    // ⚠️ YOUR FORMAT
    // cols[1] = food name
    const name = cols[1]?.trim().toLowerCase();

    if (!name) return;

    nutritionData[name] = {
      protein: parseFloat(cols[2]) || 0,
      calcium: parseFloat(cols[3]) || 0,
      fat: parseFloat(cols[4]) || 0,
      carbs: parseFloat(cols[5]) || 0,
      vitamins: parseFloat(cols[6]) || 0,
    };
  });

  console.log("✅ Nutrition CSV Loaded:", Object.keys(nutritionData).length);

  return nutritionData;
};

// 🔥 GET NUTRITION
const getNutritionForFood = (foodName) => {
  const data = loadCSV();

  if (!foodName) return null;

  // normalize input
  const key = foodName.toLowerCase().trim();

  return data[key] || null;
};

module.exports = { getNutritionForFood };