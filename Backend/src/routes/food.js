const express = require("express");
const router = express.Router();
const multer = require("multer");

const { analyzeFood } = require("../controllers/food/foodController");

const upload = multer({ dest: "uploads/" });

router.post("/analyze", upload.single("image"), analyzeFood);

module.exports = router;