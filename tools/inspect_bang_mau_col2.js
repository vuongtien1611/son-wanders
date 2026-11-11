const fs = require('fs');
const html = fs.readFileSync('giao-dien/audit_base44/raw_bang-mau.html', 'utf8');
const sects = html.split('<section');
const s2 = sects[2];
const parts = s2.split('lg:grid-cols-[1fr_340px] lg:gap-14">');
if (parts.length > 1) {
  // Let's find where the second column starts
  console.log('End of s2:', s2.substring(s2.length - 2000));
}

