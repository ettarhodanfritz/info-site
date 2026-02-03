const db = require("../db");

const News = {
  getAll: (approvedOnly = true) =>
    new Promise((resolve, reject) => {
      const sql = approvedOnly
        ? "SELECT * FROM news WHERE approved = 1 ORDER BY date DESC"
        : "SELECT * FROM news ORDER BY date DESC";
      db.all(sql, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    }),

  getByRegion: (region, approvedOnly = true) =>
    new Promise((resolve, reject) => {
      const sql = approvedOnly
        ? "SELECT * FROM news WHERE region = ? AND approved = 1 ORDER BY date DESC"
        : "SELECT * FROM news WHERE region = ? ORDER BY date DESC";
      db.all(sql, [region], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    }),
  getPending: () =>
    new Promise((resolve, reject) => {
      db.all("SELECT * FROM news WHERE approved = 0 ORDER BY date DESC", [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    }),

  approve: (id) =>
    new Promise((resolve, reject) => {
      db.run("UPDATE news SET approved = 1 WHERE id = ?", [id], function (err) {
        if (err) reject(err);
        else resolve();
      });
    }),

  decline: (id) =>
    new Promise((resolve, reject) => {
      db.run("DELETE FROM news WHERE id = ? AND approved = 0", [id], function (err) {
        if (err) reject(err);
        else resolve();
      });
    }),

  getById: (id) =>
    new Promise((resolve, reject) => {
      db.get("SELECT * FROM news WHERE id = ?", [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    }),

  create: (data) =>
    new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO news
        (title, description, content, category, date, region, imageUrl, videoUrl)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const params = [
        data.title,
        data.description,
        data.content,
        data.category,
        data.date || new Date().toISOString(),
        data.region,
        data.imageUrl,
        data.videoUrl,
      ];

      db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, ...data });
      });
    }),

  update: (id, data) =>
    new Promise((resolve, reject) => {
      const sql = `
        UPDATE news SET
        title = ?, description = ?, content = ?, category = ?, region = ?, imageUrl = ?, videoUrl = ?
        WHERE id = ?
      `;
      const params = [
        data.title,
        data.description,
        data.content,
        data.category,
        data.region,
        data.imageUrl,
        data.videoUrl,
        id,
      ];

      db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve();
      });
    }),

  delete: (id) =>
    new Promise((resolve, reject) => {
      db.run("DELETE FROM news WHERE id = ?", [id], (err) => {
        if (err) reject(err);
        else resolve();
      });
    }),
};

module.exports = News;
