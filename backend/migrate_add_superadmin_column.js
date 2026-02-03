// Run this script with: node migrate_add_superadmin_column.js
const db = require('./db');

db.run('ALTER TABLE admins ADD COLUMN isSuperAdmin INTEGER DEFAULT 0', (err) => {
  if (err) {
    if (err.message.includes('duplicate column name')) {
      console.log('Column isSuperAdmin already exists.');
    } else {
      console.error('Migration error:', err.message);
    }
  } else {
    console.log('Column isSuperAdmin added to admins table.');
  }
  process.exit();
});
