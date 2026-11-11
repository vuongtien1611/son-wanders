const fs = require('fs');

const js = fs.readFileSync('c:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/assets/index-BG3fZPr5.js', 'utf8');

['BrowserRouter', 'createBrowserRouter', 'HashRouter', 'MemoryRouter', 'Router'].forEach(r => {
  let idx = 0;
  let count = 0;
  while ((idx = js.indexOf(r, idx)) !== -1) {
    if (count < 2) {
      console.log(`Router ${r} at ${idx}:`, js.substring(Math.max(0, idx - 40), Math.min(js.length, idx + 60)));
    }
    count++;
    idx += r.length;
  }
  console.log(`Total "${r}":`, count);
});

