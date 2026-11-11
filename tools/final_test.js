const fs = require('fs');

const testPages = [
  'c:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/index.html',
  'c:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/cam-hung-mau-sac.html',
  'c:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/cam-hung-mau-sac/index.html',
  'c:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/gioi-thieu.html',
  'c:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/gioi-thieu/index.html'
];

let allOk = true;

for (const p of testPages) {
  const content = fs.readFileSync(p, 'utf8');
  const hasCleaner = content.includes('id="offline-nav-and-cleaner"');
  const hasBase44Badge = content.includes('id="base44-edit-badge"');
  console.log(`Checking ${p.split('website_download/')[1] || p}:`);
  console.log(`  - offline-nav-and-cleaner present: ${hasCleaner}`);
  console.log(`  - base44-edit-badge markup: ${hasBase44Badge}`);
  if (!hasCleaner) allOk = false;
}

console.log('Overall Navigation & Cleaner Status:', allOk ? 'ALL PASS ✅' : 'FAIL ❌');

