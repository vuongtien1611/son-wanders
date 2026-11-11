const fs = require('fs');

const html = fs.readFileSync('giao-dien/website_download/index.html', 'utf8');
const sections = html.match(/<section[\s\S]*?<\/section>/g) || [];

console.log('--- SECTION DETAILS ---');
sections.forEach((s, idx) => {
  console.log(`\n=== SECTION ${idx} (Length: ${s.length}) ===`);
  console.log(s.slice(0, 500) + '...');
});

