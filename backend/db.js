const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "news.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error(err.message);
  else console.log("SQLite connected");
});


// Create news table if not exists (now includes 'approved' column)
db.run(
  `CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    content TEXT NOT NULL,
    category TEXT,
    date TEXT,
    region TEXT,
    imageUrl TEXT,
    videoUrl TEXT,
    approved INTEGER DEFAULT 0
  )`,
);

// Create admins table if not exists (now includes isSuperAdmin)
db.run(
  `CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    isSuperAdmin INTEGER DEFAULT 0
  )`,
);

module.exports = db;
