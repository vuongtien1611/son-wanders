const fs = require('fs');

const c = fs.readFileSync('c:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/assets/index-BG3fZPr5.js', 'utf8');
const targets = ['/gioi-thieu', '/cam-hung-mau-sac', '/san-pham', 'Edit with', 'base44'];

for (const t of targets) {
  let idx = 0;
  let count = 0;
  while ((idx = c.indexOf(t, idx)) !== -1) {
    if (count < 3) {
      console.log(`Found "${t}" at ${idx}:`, c.substring(Math.max(0, idx - 50), Math.min(c.length, idx + 50)));
    }
    count++;
    idx += t.length;
  }
  console.log(`Total "${t}":`, count);
}

