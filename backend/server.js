require("dotenv").config();
const express = require("express");
const cors = require("cors");
require("./db");



const newsRoutes = require("./routes/news");
const adminRoutes = require("./routes/admin");
const contactRoutes = require("./routes/contact");
const { update } = require("./models/News");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use("/api/news", newsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);

app.use("/uploads", express.static("uploads"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
