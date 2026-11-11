const fs = require('fs');
const html = fs.readFileSync('giao-dien/audit_base44/raw_bang-mau.html', 'utf8');
const sects = html.split('<section');
const s2 = sects[2];
const sidebarIdx = s2.indexOf('340px');
console.log(s2.substring(sidebarIdx - 50, sidebarIdx + 2000));

