// Run this script with: node migrate_add_zone_subzone_columns.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./news.db');

db.serialize(() => {
  db.run('ALTER TABLE news ADD COLUMN zone TEXT;', err => {
    if (err && !/duplicate/i.test(err.message)) {
      console.error('Error adding zone column:', err.message);
    } else {
      console.log('zone column added or already exists.');
    }
  });
  db.run('ALTER TABLE news ADD COLUMN subzone TEXT;', err => {
    if (err && !/duplicate/i.test(err.message)) {
      console.error('Error adding subzone column:', err.message);
    } else {
      console.log('subzone column added or already exists.');
    }
  });
});

db.close();
