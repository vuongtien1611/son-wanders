const fs = require('fs');

const html = fs.readFileSync('C:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/cam-hung-mau-sac/index.html', 'utf8');

const checks = [
  'id="collectionSelect"',
  'id="colorSearchInput"',
  'id="collectionRoomImg"',
  'id="prevCollectionBtn"',
  'id="nextCollectionBtn"',
  'id="collectionTitle"',
  'id="collectionDesc"',
  'id="selectedColorBox"',
  'id="selectedColorCode"',
  'id="selectedColorNameEn"',
  'id="copyHexBtn"',
  'id="copyCodeBtn"',
  'id="swatchesGrid"',
  'id="adminModal"',
  'PRAIRIE GENTIAN',
  'MH0824',
  '#DDB3D8',
  'room-purple-clean.jpg'
];

console.log('--- Verification of Elements in cam-hung-mau-sac/index.html ---');
checks.forEach(c => {
  console.log(c, '->', html.includes(c) ? 'PASS' : 'FAIL');
});

