const fs = require('fs');

const f1 = 'c:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/cam-hung-mau-sac.html';
const f2 = 'c:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/cam-hung-mau-sac/index.html';
const f3 = 'c:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/index.html';

[f1, f2, f3].forEach(file => {
  const c = fs.readFileSync(file, 'utf8');
  console.log(file.split('website_download/')[1] || file);
  console.log('  - Has nav-mega-menu:', c.includes('nav-mega-menu'));
  console.log('  - Has nav-mega-grid:', c.includes('nav-mega-grid'));
  console.log('  - Has Sơn nội thất cao cấp:', c.includes('Sơn nội thất cao cấp'));
  console.log('  - Has nav-mega-desc:', c.includes('nav-mega-desc'));
  console.log('  - Has nav-mega-icon:', c.includes('nav-mega-icon'));
});

