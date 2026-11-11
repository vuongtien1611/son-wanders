const fs = require('fs');
const html = fs.readFileSync('giao-dien/website_download/index.html', 'utf8');

const matches = [
  '08867f386_generated_9bb6eef6.png',
  '7266e0bc1_generated_27f36fa1.png',
  '699adaa7a_generated_49cef920.png',
  'd46ca89f2_generated_e7f1be47.png'
];

matches.forEach(m => {
  const idx = html.indexOf(m);
  if (idx !== -1) {
    const surrounding = html.substring(Math.max(0, idx - 150), Math.min(html.length, idx + 250));
    console.log(m, 'surrounding:\n', surrounding.replace(/\s+/g, ' '));
  } else {
    console.log(m, 'not in index.html');
  }
});

