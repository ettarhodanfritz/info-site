const express = require("express");
const router = express.Router();
// ...existing code...
// Simple test route for connectivity
router.get("/test", (req, res) => {
  console.log("GET /api/news/test hit at", new Date().toISOString());
  res.json({ message: "Backend test route working!" });
});
const News = require("../models/News");
const multer = require("multer");
const path = require("path");
const { authenticateAdmin, requireSuperAdmin } = require("./authMiddleware");

// ------------------- LOCAL STORAGE SETUP -------------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.mimetype.startsWith("video/")) cb(null, "uploads/videos");
    else cb(null, "uploads/images");
  },
  filename: function (req, file, cb) {
    // unique filename
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const parser = multer({ storage });

// ------------------- GET ROUTES -------------------
// Get news by zone (case-insensitive, dashes/spaces tolerant)
router.get("/zone/:zone", async (req, res) => {
  try {
    const zoneParam = req.params.zone.toLowerCase().replace(/-/g, " ").trim();
    const news = await News.getAll(true);
    const filtered = news.filter(n =>
      n.zone && n.zone.toLowerCase().replace(/-/g, " ").trim() === zoneParam
    );
    res.json(filtered);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get news by zone and subzone (case-insensitive, dashes/spaces tolerant)
router.get("/zone/:zone/:subzone", async (req, res) => {
  try {
    const zoneParam = req.params.zone.toLowerCase().replace(/-/g, " ").trim();
    const subzoneParam = req.params.subzone.toLowerCase().replace(/-/g, " ").trim();
    const news = await News.getAll(true);
    const filtered = news.filter(n =>
      n.zone && n.zone.toLowerCase().replace(/-/g, " ").trim() === zoneParam &&
      n.subzone && n.subzone.toLowerCase().replace(/-/g, " ").trim() === subzoneParam
    );
    res.json(filtered);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Only show approved news to public
router.get("/", async (req, res) => {
  try {
    const news = await News.getAll(true);
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ...existing code...

// ------------------- GET ROUTES -------------------
// Only show approved news to public
router.get("/", async (req, res) => {
  try {
    const news = await News.getAll(true);
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/africa", async (req, res) => {
  try {
    const news = await News.getByRegion("Africa", true);
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/world", async (req, res) => {
  try {
    const news = await News.getByRegion("World", true);
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Super Admin: Get all pending news (approval required)
router.get("/pending", authenticateAdmin, requireSuperAdmin, async (req, res) => {
  try {
    const news = await News.getPending();
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Super Admin: Approve news
router.post("/:id/approve", authenticateAdmin, requireSuperAdmin, async (req, res) => {
  try {
    await News.approve(req.params.id);
    res.json({ message: "News approved" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Super Admin: Decline (delete) news
router.post("/:id/decline", authenticateAdmin, requireSuperAdmin, async (req, res) => {
  try {
    await News.decline(req.params.id);
    res.json({ message: "News declined and deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const news = await News.getById(req.params.id);
    if (!news) return res.status(404).json({ message: "News not found" });
    res.json(news);
  } catch (err) {
    console.error("GET news by ID error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ------------------- POST ROUTE -------------------
// Require admin authentication for news submission
router.post(
  "/",
  authenticateAdmin,
  parser.fields([{ name: "image" }, { name: "video" }]),
  async (req, res) => {
    console.log("=== Incoming POST /api/news ===");
    console.log("Time:", new Date().toISOString());
    console.log("Headers:", req.headers);
    console.log("Files received:", req.files);
    console.log("Body received:", req.body);
    try {

      const requiredFields = [
        "title",
        "description",
        "content",
        "category",
        "region",
        "zone"
      ];
      const missing = requiredFields.filter(f => !req.body[f] || req.body[f].trim() === "");
      if (missing.length > 0) {
        return res.status(400).json({ message: `Missing required fields: ${missing.join(", ")}` });
      }

      // Only require subzone for zones that have subzones
      const zonesWithSubzones = [
        "africa", "europe", "middleeast", "asiapacific", "americas"
      ];
      // Normalize zone for comparison (lowercase, no spaces/dashes)
      const zoneKey = (req.body.zone || "").toLowerCase().replace(/ |-/g, "");
      if (zonesWithSubzones.includes(zoneKey)) {
        if (!req.body.subzone || req.body.subzone.trim() === "") {
          // Special case: if zone is 'opinions', set subzone to 'opinions' for peace
          if (zoneKey === "opinions") {
            req.body.subzone = "opinions";
          } else {
            return res.status(400).json({ message: "Missing required field: subzone" });
          }
        }
      } else {
        // For zones without subzones, ensure subzone is undefined or empty string
        req.body.subzone = "";
      }

      const imageUrl = req.files?.image?.[0]?.path.replace(/\\/g, "/") || "";
      const videoUrl = req.files?.video?.[0]?.path.replace(/\\/g, "/") || "";

      console.log("Image URL:", imageUrl);
      console.log("Video URL:", videoUrl);

      const saved = await News.create({ ...req.body, imageUrl, videoUrl });
      console.log("News saved locally:", saved);

      res.status(201).json(saved);
    } catch (err) {
      console.error("POST upload error:", err);
      if (err.stack) console.error(err.stack);
      res.status(500).json({ message: err.message });
    }
  },
);

// ------------------- PUT ROUTE -------------------
router.put(
  "/:id",
  parser.fields([{ name: "image" }, { name: "video" }]),
  async (req, res) => {
    try {
      console.log("Files received for update:", req.files);
      console.log("Body received for update:", req.body);

      const oldNews = await News.getById(req.params.id);
      if (!oldNews) return res.status(404).json({ message: "News not found" });

      const imageUrl =
        req.files?.image?.[0]?.path.replace(/\\/g, "/") || oldNews.imageUrl;
      const videoUrl =
        req.files?.video?.[0]?.path.replace(/\\/g, "/") || oldNews.videoUrl;

      await News.update(req.params.id, { ...req.body, imageUrl, videoUrl });
      console.log("News updated locally:", req.params.id);

      res.json({ message: "News updated!" });
    } catch (err) {
      console.error("PUT update error:", err);
      res.status(500).json({ message: err.message });
    }
  },
);

// ------------------- DELETE ROUTE -------------------
router.delete("/:id", async (req, res) => {
  try {
    await News.delete(req.params.id);
    console.log("News deleted locally:", req.params.id);
    res.json({ message: "News deleted!" });
  } catch (err) {
    console.error("DELETE error:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
