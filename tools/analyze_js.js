const fs = require('fs');

async function test() {
  const res = await fetch('https://my-hour-home.base44.app/assets/index-BG3fZPr5.js');
  const code = await res.text();
  fs.writeFileSync('index-BG3fZPr5.js', code);
  console.log('Saved index-BG3fZPr5.js');

  // Let's check for router or page definitions
  // In React apps, maybe react-router, wouter, tanstack router, or custom router
  // Check for keywords
  const keywords = ['BrowserRouter', 'createBrowserRouter', 'Routes', 'Route', 'wouter', 'Router', 'path:'];
  for (const k of keywords) {
    let count = 0;
    let idx = -1;
    while ((idx = code.indexOf(k, idx + 1)) !== -1) {
      count++;
    }
    console.log(`${k}: ${count} occurrences`);
  }

  // Find occurrences of "path"
  const regex = /["']path["']\s*:\s*["']([^"']+)["']/g;
  let m;
  const paths = [];
  while ((m = regex.exec(code)) !== null) {
    paths.push(m[1]);
  }
  console.log('paths found:', paths);

  // Search for navigation items, menus, headers, or pages
  // E.g., menu links like href="#" or href="/..."
  const hrefs = [...code.matchAll(/href\s*[:=]\s*["']([^"']+)["']/g)].map(x => x[1]);
  console.log('hrefs found (first 50):', [...new Set(hrefs)].slice(0, 50));
}

test();
