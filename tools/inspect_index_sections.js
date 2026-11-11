const fs = require('fs');
const html = fs.readFileSync('giao-dien/website_download/index.html', 'utf8');
console.log('index.html total length:', html.length);
const hasRoot = html.includes('id="root"');
console.log('has id="root":', hasRoot);
// Check if there is <main> tag
const mainMatch = html.match(/<main[\s\S]*?<\/main>/);
if (mainMatch) {
  console.log('has <main> tag, length:', mainMatch[0].length);
} else {
  console.log('No <main> tag');
}

// Check what sections exist
const sections = html.match(/<section[\s\S]*?<\/section>/g) || [];
console.log(`Found ${sections.length} sections in index.html`);
sections.forEach((s, i) => {
  const h2 = s.match(/<h[123][^>]*>([\s\S]*?)<\/h[123]>/i);
  console.log(`Section ${i}:`, h2 ? h2[1].replace(/<[^>]+>/g, '').trim() : 'No heading');
});

