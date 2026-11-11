const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://my-hour-home.base44.app';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function getAllRoutes() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const visited = new Set();
  const queue = ['/'];
  const allLinks = new Set(['/']);

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  while (queue.length > 0) {
    const currentPath = queue.shift();
    if (visited.has(currentPath)) continue;
    visited.add(currentPath);

    const targetUrl = new URL(currentPath, BASE_URL).href;
    console.log(`Scanning [${visited.size}/${allLinks.size}]: ${currentPath}`);

    try {
      await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 30000 });
      // Wait a moment for dynamic rendering
      await new Promise(r => setTimeout(r, 800));

      const links = await page.evaluate((baseUrl) => {
        const anchors = Array.from(document.querySelectorAll('a[href]'));
        return anchors
          .map(a => a.getAttribute('href'))
          .filter(h => h && (h.startsWith('/') || h.startsWith(baseUrl)) && !h.startsWith('//') && !h.startsWith('mailto:') && !h.startsWith('tel:'))
          .map(h => {
            try {
              const u = new URL(h, baseUrl);
              if (u.origin === baseUrl) {
                return u.pathname;
              }
            } catch (e) {}
            return null;
          })
          .filter(Boolean);
      }, BASE_URL);

      for (const link of links) {
        // Normalize trailing slash (except root)
        const normalized = link.length > 1 && link.endsWith('/') ? link.slice(0, -1) : link;
        if (!allLinks.has(normalized)) {
          allLinks.add(normalized);
          queue.push(normalized);
        }
      }
    } catch (err) {
      console.error(`Error loading ${currentPath}:`, err.message);
    }
  }

  await browser.close();

  const sortedRoutes = Array.from(allLinks).sort();
  console.log(`\nFound ${sortedRoutes.length} total routes:`);
  sortedRoutes.forEach(r => console.log(' - ' + r));
  fs.writeFileSync('routes.json', JSON.stringify(sortedRoutes, null, 2));
}

getAllRoutes().catch(console.error);
