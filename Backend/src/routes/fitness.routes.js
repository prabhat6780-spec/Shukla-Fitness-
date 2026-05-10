const express = require("express")
const router = express.Router()


const { generatePlan, getMyPlans, deletePlan } = require("../controllers/fitness/plan.controller")
const {calculateHealth} = require("../controllers/fitness/health.controller")

const authMiddleware = require("../middleware/auth.middleware")


router.post("/health", authMiddleware.verifyToken,calculateHealth)
router.post("/generate-plan", authMiddleware.verifyToken, generatePlan)
router.get("/my-plans", authMiddleware.verifyToken, getMyPlans)
router.delete("/:id", authMiddleware.verifyToken, deletePlan)

module.exports = router