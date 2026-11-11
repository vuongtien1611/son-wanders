const fs = require('fs');
const html = fs.readFileSync('giao-dien/audit_base44/raw_bang-mau.html', 'utf8');
const sects = html.split('<section');
console.log(sects[2].substring(0, 1500));

