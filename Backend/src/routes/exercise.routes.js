// routes/exercise.routes.js
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth.middleware");
const isAdmin = require("../middleware/isAdmin.middleware");
const { uploadMedia } = require("../config/multer");
const {
  addExercise,
  updateExercise,
  deleteExercise,
  getAllExercises,
  getSingleExercise,
  searchExercise
} = require("../controllers/exercise/exercise.controller");

// Admin Routes
router.post("/",        verifyToken, isAdmin, uploadMedia.array("media", 10), addExercise);
router.put("/:id",      verifyToken, isAdmin, uploadMedia.array("media", 10), updateExercise);
router.delete("/:id",   verifyToken, isAdmin,                          deleteExercise);

// Public Routes
router.get("/search",   searchExercise);
router.get("/",         getAllExercises);
router.get("/:id",      getSingleExercise);

module.exports = router;