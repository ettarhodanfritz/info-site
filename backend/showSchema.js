const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('news.db');

db.serialize(() => {
  db.each("SELECT name, sql FROM sqlite_master WHERE type='table'", (err, row) => {
    if (err) {
      console.error('Error:', err.message);
    } else {
      console.log(`Table: ${row.name}\nSchema: ${row.sql}\n`);
    }
  });
});

db.close();
