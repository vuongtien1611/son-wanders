const fs = require('fs');

const adminRoutes = fs.readFileSync('C:/Users/Admin/Documents/sơn myhouse/vmaxcore/routes/admin.php', 'utf8');
console.log('--- ADMIN ROUTES ---');
console.log(adminRoutes.substring(0, 2000));

const adminPagesDir = 'C:/Users/Admin/Documents/sơn myhouse/vmaxcore/resources/js/Pages/Admin';
if (fs.existsSync(adminPagesDir)) {
  console.log('--- ADMIN VUE/REACT PAGES ---');
  console.log(fs.readdirSync(adminPagesDir));
}

