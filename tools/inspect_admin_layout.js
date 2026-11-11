const fs = require('fs');

const adminPagesDir = 'C:/Users/Admin/Documents/sơn myhouse/vmaxcore/resources/js/Pages/Admin';
console.log(fs.readdirSync(adminPagesDir));

const sidebarPath = 'C:/Users/Admin/Documents/sơn myhouse/vmaxcore/resources/js/Layouts/AdminLayout.vue';
if (fs.existsSync(sidebarPath)) {
  console.log('Found AdminLayout.vue');
} else {
  console.log('Layouts:', fs.readdirSync('C:/Users/Admin/Documents/sơn myhouse/vmaxcore/resources/js/Layouts'));
}

