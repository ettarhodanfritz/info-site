// Contact route is now handled by EmailJS on the frontend. No backend logic required.
const express = require("express");
const router = express.Router();

// Placeholder route (optional)
router.post("/", (req, res) => {
  res.status(501).json({ error: "Contact form is now handled by EmailJS on the frontend." });
});

module.exports = router;
