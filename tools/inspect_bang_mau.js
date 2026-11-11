const fs = require('fs');
const html = fs.readFileSync('giao-dien/website_download/bang-mau.html', 'utf8');

// Find all section headers or headings
const h1s = html.match(/<h[1-4][^>]*>[\s\S]*?<\/h[1-4]>/g) || [];
console.log('Headings count:', h1s.length);
h1s.forEach(h => console.log(' - ' + h.replace(/<[^>]+>/g, '').trim().substring(0, 80)));

// Find major sections
const sections = html.match(/<section[\s\S]*?<\/section>/g) || [];
console.log('Sections count:', sections.length);
sections.forEach((s, i) => {
  const preview = s.substring(0, 150).replace(/\s+/g, ' ');
  console.log('Section ' + i + ':', preview);
});

