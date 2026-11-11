const fs = require('fs');

const rootFile = 'c:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/cam-hung-mau-sac.html';
const subFile = 'c:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/cam-hung-mau-sac/index.html';

[rootFile, subFile].forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  console.log('Testing file:', f);
  console.log('  File size:', content.length, 'bytes');
  console.log('  Has MH0824:', content.includes('MH0824'));
  console.log('  Has PRAIRIE GENTIAN:', content.includes('PRAIRIE GENTIAN'));
  console.log('  Has #C5A880 (Gold):', content.includes('#C5A880') || content.includes('#c5a880'));
  console.log('  Has active-swatch-box:', content.includes('active-swatch-box'));
  console.log('  Has palette-grid:', content.includes('palette-grid'));
  console.log('  Has room-purple-clean.jpg:', content.includes('room-purple-clean.jpg'));
  console.log('  Has admin modal:', content.includes('admin-palette-modal'));
  console.log('  Has base44-edit-badge in markup:', content.includes('id="base44-edit-badge"'));
  console.log('  Has offline-nav-and-cleaner:', content.includes('offline-nav-and-cleaner'));
});

