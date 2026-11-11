const fs = require('fs');
const html = fs.readFileSync('giao-dien/audit_base44/raw_san-pham.html', 'utf8');

const regex = /<a[^>]+href="\/san-pham\/[^"]+"[\s\S]*?<\/a>/g;
const matches = html.match(regex) || [];
console.log('Matches count:', matches.length);
if (matches.length > 0) {
  console.log('Card 0:', matches[0]);
}

