const fs = require('fs');
let raw = fs.readFileSync('giao-dien/audit_base44/raw_san-pham.html', 'utf8');
const matched = /<div class="mt-10 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">[\s\S]*?<\/section>/.test(raw);
console.log('New regex matches raw_san-pham.html:', matched);
