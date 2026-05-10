// controllers/exercise/exercise.controller.js
const Exercise = require("../../models/exercise.model");
const { cloudinary } = require("../../config/multer");

// ✅ Add Exercise
exports.addExercise = async (req, res) => {
  try {
    const {
      name, category, muscleGroup,
      defaultSets, defaultReps,
      defaultDurationSeconds, restSeconds,
      difficulty, instructions
    } = req.body;

    const media = req.files.map(file => ({
      url: file.path,
      publicId: file.filename,
      type: file.mimetype.startsWith("video")
        ? "video"
        : file.mimetype.includes("gif")
        ? "gif"
        : "image"
    }));

    console.log("FINAL MEDIA:", media); // ✅ check

    const exercise = await Exercise.create({
      name,
      category,
      muscleGroup,
      media,  // ✅ ONLY this
      defaultSets,
      defaultReps,
      defaultDurationSeconds,
      restSeconds,
      difficulty,
      instructions
    });

    res.status(201).json({ message: "Exercise created", exercise });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update Exercise
exports.updateExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) {
      return res.status(404).json({ message: "Exercise not found" });
    }

    // ✅ parse existing media sent from frontend
    const existingMedia = JSON.parse(req.body.existingMedia || "[]");

    // 🔥 1. DELETE ONLY REMOVED MEDIA
    const removedMedia = (exercise.media || []).filter(
      old => !existingMedia.find(m => m.publicId === old.publicId)
    );

    for (const m of removedMedia) {
      await cloudinary.uploader.destroy(m.publicId, {
        resource_type: m.type === "video" ? "video" : "image"
      });
    }

    // 🔥 2. ADD NEW MEDIA
    const newMedia = (req.files || []).map(file => ({
      url: file.path,
      publicId: file.filename,
      type: file.mimetype.startsWith("video")
        ? "video"
        : file.mimetype.includes("gif")
        ? "gif"
        : "image"
    }));

    // 🔥 3. COMBINE BOTH
    exercise.media = [...existingMedia, ...newMedia];

    // 🔥 4. UPDATE OTHER FIELDS
    const fields = [
      "name",
      "category",
      "muscleGroup",
      "defaultSets",
      "defaultReps",
      "defaultDurationSeconds",
      "restSeconds",
      "difficulty",
      "instructions"
    ];

    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        exercise[field] = req.body[field];
      }
    });

    await exercise.save();

    res.json({ message: "Exercise updated", exercise });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete Exercise
exports.deleteExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) return res.status(404).json({ message: "Exercise not found" });

    // Delete GIF from Cloudinary
    if (exercise.gifPublicId) {
      await cloudinary.uploader.destroy(exercise.gifPublicId, {
        resource_type: "image"
      });
    }

    await Exercise.findByIdAndDelete(req.params.id);
    res.json({ message: "Exercise deleted" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get All Exercises
exports.getAllExercises = async (req, res) => {
  try {
    const exercises = await Exercise.find().sort({ createdAt: -1 });
    res.json(exercises);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get Single Exercise
exports.getSingleExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) return res.status(404).json({ message: "Exercise not found" });
    res.json(exercise);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Search by name (for AI plan matching)
exports.searchExercise = async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) return res.status(400).json({ message: "Name is required" });

    const exercises = await Exercise.find({
      name: { $regex: name, $options: "i" }
    });

    res.json(exercises);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};