const express = require("express");
const { body } = require("express-validator");
const {
  createLead,
  getLeads,
  updateLead,
  getStats,
  getLeadById,
} = require("../controllers/leadsController");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.post(
  "/",
  [
    body("name")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Name must be at least 3 characters"),
    body("email")
      .isEmail()
      .withMessage("Please provide a valid email")
      .normalizeEmail(),
    body("budget")
      .isIn([
        "Under ₹10,000",
        "₹10,000 - ₹50,000",
        "₹50,000 - ₹1,00,000",
        "Above ₹1,00,000",
      ])
      .withMessage("Please select a valid budget range"),
    body("message")
      .trim()
      .isLength({ min: 10 })
      .withMessage("Message must be at least 10 characters"),
  ],
  createLead,
);

router.get("/stats/overview", verifyToken, getStats);
router.get("/", verifyToken, getLeads);
router.get("/:id", verifyToken, getLeadById);
router.patch("/:id", verifyToken, updateLead);

module.exports = router;
