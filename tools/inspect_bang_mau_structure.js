const fs = require('fs');
const html = fs.readFileSync('giao-dien/audit_base44/raw_bang-mau.html', 'utf8');

const sects = html.split('<section');
console.log('Sections in bang-mau:', sects.length - 1);
sects.slice(1).forEach((s, i) => {
  const h = s.match(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/i);
  console.log('Bang-mau sect ' + (i+1) + ':', h ? h[1].replace(/<[^>]+>/g, '').trim() : 'no heading', 'Length:', s.length);
});

