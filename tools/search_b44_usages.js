const fs = require('fs');

const files = fs.readdirSync('giao-dien/website_download').filter(f => f.endsWith('.html'));
files.forEach(f => {
  const content = fs.readFileSync('giao-dien/website_download/' + f, 'utf8');
  if (content.includes('699adaa7a')) console.log('699adaa7a in', f);
  if (content.includes('d46ca89f2')) console.log('d46ca89f2 in', f);
  if (content.includes('08867f386')) console.log('08867f386 in', f);
  if (content.includes('7266e0bc1')) console.log('7266e0bc1 in', f);
});

