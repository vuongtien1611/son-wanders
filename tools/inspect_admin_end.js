const fs = require('fs');

const adminRoutes = fs.readFileSync('C:/Users/Admin/Documents/sơn myhouse/vmaxcore/routes/admin.php', 'utf8');
const lastLines = adminRoutes.substring(adminRoutes.length - 1200);
console.log('Admin routes ending:');
console.log(lastLines);

