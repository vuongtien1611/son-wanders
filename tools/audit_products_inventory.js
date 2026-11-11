const fs = require('fs');
const path = require('path');

const WEB = path.resolve(__dirname, '../website_download');
const products = JSON.parse(fs.readFileSync(path.join(WEB, 'data/wanders_products.json'), 'utf8'));

console.log('Total products in wanders_products.json:', products.length);
const cats = {};
const missingImgs = [];
const emptyFields = [];

for (const p of products) {
  cats[p.category] = (cats[p.category] || 0) + 1;
  const imgFull = path.join(WEB, p.image || '');
  if (!p.image || !fs.existsSync(imgFull)) {
    missingImgs.push({ code: p.code, name: p.name, image: p.image });
  }
  const missingSpecs = [];
  if (!p.desc || p.desc.trim().length < 5) missingSpecs.push('desc');
  if (!p.packaging) missingSpecs.push('packaging');
  if (!p.surface) missingSpecs.push('surface');
  if (!p.coverage) missingSpecs.push('coverage');
  if (!p.coats) missingSpecs.push('coats');
  if (!p.dryTime) missingSpecs.push('dryTime');
  if (!p.thinner) missingSpecs.push('thinner');
  if (missingSpecs.length) emptyFields.push({ code: p.code, name: p.name, missingSpecs });
}

console.log('Categories distribution:', cats);
console.log('Missing images:', missingImgs);
console.log('Products missing any spec field:', emptyFields.length, emptyFields.slice(0, 5));

console.log('\nTools scripts list:');
console.log(fs.readdirSync(__dirname).join('\n'));

