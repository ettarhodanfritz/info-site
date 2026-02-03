// backend/routes/news.js
const express = require("express");
const router = express.Router();
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
    try {
      console.log("--- POST /api/news ---");
      console.log("Headers:", req.headers);
      console.log("Files received:", req.files);
      console.log("Body received:", req.body);

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
