const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Register new admin
router.post("/register", async (req, res) => {
  const { username, password, isSuperAdmin } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "Username and password required" });
  try {
    const existing = await Admin.findByUsername(username);
    if (existing)
      return res.status(409).json({ message: "Username already exists" });
    const admin = await Admin.create({ username, password, isSuperAdmin });
    res.status(201).json({ id: admin.id, username: admin.username, isSuperAdmin: admin.isSuperAdmin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login admin
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "Username and password required" });
  try {
    const admin = await Admin.findByUsername(username);
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });
    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });
    const token = jwt.sign(
      { id: admin.id, username: admin.username, isSuperAdmin: admin.isSuperAdmin },
      JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({ token, isSuperAdmin: admin.isSuperAdmin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
