// Run this script with: node create_super_admin.js
const Admin = require('./models/Admin');

(async () => {
  const username = 'superadmin'; // Change as needed
  const password = 'SuperSecret123!'; // Change as needed
  try {
    const admin = await Admin.create({ username, password, isSuperAdmin: true });
    console.log('Super admin created:', admin);
  } catch (err) {
    console.error('Error creating super admin:', err.message);
  }
  process.exit();
})();
