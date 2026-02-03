const db = require("../db");
const bcrypt = require("bcryptjs");

const Admin = {
  create: async ({ username, password, isSuperAdmin = 0 }) => {
    const hash = await bcrypt.hash(password, 10);
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO admins (username, password, isSuperAdmin) VALUES (?, ?, ?)`,
        [username, hash, isSuperAdmin ? 1 : 0],
        function (err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, username, isSuperAdmin });
        }
      );
    });
  },
  findByUsername: (username) =>
    new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM admins WHERE username = ?`,
        [username],
        (err, row) => {
          if (err) reject(err);
          else resolve(row ? { ...row, isSuperAdmin: !!row.isSuperAdmin } : null);
        }
      );
    }),
};

module.exports = Admin;
