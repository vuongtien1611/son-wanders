const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const BASE_URL = 'https://my-hour-home.base44.app';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.join(__dirname, 'website_download');

// Ensure directory exists
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Download file via fetch
async function downloadFile(url, destPath) {
  try {
    ensureDir(path.dirname(destPath));
    if (fs.existsSync(destPath)) return;
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`Failed to download ${url}: ${res.statusText}`);
      return;
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(destPath, buffer);
  } catch (err) {
    console.error(`Error downloading ${url}:`, err.message);
  }
}

async function scrapeAll() {
  const routes = JSON.parse(fs.readFileSync('routes.json', 'utf8'));
  console.log(`Starting scrape of ${routes.length} pages...`);

  ensureDir(OUTPUT_DIR);
  ensureDir(path.join(OUTPUT_DIR, 'assets'));
  ensureDir(path.join(OUTPUT_DIR, 'static', 'js'));
  ensureDir(path.join(OUTPUT_DIR, 'images'));

  // Download core assets first
  console.log('Downloading core assets...');
  await downloadFile(`${BASE_URL}/assets/index-BDqGYMxC.css`, path.join(OUTPUT_DIR, 'assets', 'index-BDqGYMxC.css'));
  await downloadFile(`${BASE_URL}/assets/index-BG3fZPr5.js`, path.join(OUTPUT_DIR, 'assets', 'index-BG3fZPr5.js'));
  await downloadFile(`${BASE_URL}/static/js/badge.js`, path.join(OUTPUT_DIR, 'static', 'js', 'badge.js'));
  await downloadFile(`${BASE_URL}/manifest.json`, path.join(OUTPUT_DIR, 'manifest.json'));
  await downloadFile('https://myhour.com.vn/wp-content/uploads/2021/03/cropped-fav-01-300x300.png', path.join(OUTPUT_DIR, 'favicon.png'));

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const collectedImages = new Set();
  const pageSummaries = [];

  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    const fullUrl = new URL(route, BASE_URL).href;
    console.log(`[${i + 1}/${routes.length}] Rendering: ${route}`);

    try {
      await page.goto(fullUrl, { waitUntil: 'networkidle2', timeout: 30000 });
      await page.waitForSelector('#root > div', { timeout: 10000 }).catch(() => {});
      // Small pause to allow animations or lazy loads
      await new Promise(r => setTimeout(r, 600));

      const title = await page.title();
      const html = await page.content();

      // Collect images on this page
      const pageImages = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('img')).map(img => img.src);
        const bgImages = Array.from(document.querySelectorAll('*'))
          .map(el => window.getComputedStyle(el).backgroundImage)
          .filter(bg => bg && bg.startsWith('url('))
          .map(bg => bg.replace(/url\(['"]?([^'"]+)['"]?\)/, '$1'));
        return [...imgs, ...bgImages].filter(s => s && s.startsWith('http'));
      });

      pageImages.forEach(img => collectedImages.add(img));

      // Determine file saving locations:
      // 1) Folder structure: /gioi-thieu/index.html (standard for web servers)
      let targetFile;
      let flatFile;
      if (route === '/') {
        targetFile = path.join(OUTPUT_DIR, 'index.html');
      } else {
        const cleanRoute = route.startsWith('/') ? route.slice(1) : route;
        targetFile = path.join(OUTPUT_DIR, cleanRoute, 'index.html');
        flatFile = path.join(OUTPUT_DIR, `${cleanRoute.replace(/\//g, '_')}.html`);
      }

      ensureDir(path.dirname(targetFile));
      fs.writeFileSync(targetFile, html, 'utf8');

      if (flatFile) {
        ensureDir(path.dirname(flatFile));
        fs.writeFileSync(flatFile, html, 'utf8');
      }

      pageSummaries.push({
        index: i + 1,
        route,
        title,
        htmlBytes: html.length,
        savedTo: route === '/' ? 'index.html' : `${route.slice(1)}/index.html`
      });

    } catch (err) {
      console.error(`Failed to process ${route}:`, err.message);
    }
  }

  await browser.close();

  // Save index of pages
  fs.writeFileSync(path.join(OUTPUT_DIR, 'pages_index.json'), JSON.stringify(pageSummaries, null, 2), 'utf8');
  console.log(`\nSuccessfully saved ${pageSummaries.length} HTML pages!`);

  // Download all collected images
  console.log(`\nDownloading ${collectedImages.size} unique image assets...`);
  let imgCount = 0;
  for (const imgUrl of collectedImages) {
    imgCount++;
    try {
      const parsed = new URL(imgUrl);
      const filename = path.basename(parsed.pathname) || `image_${imgCount}.png`;
      const safeFilename = `${imgCount.toString().padStart(3, '0')}_${filename.replace(/[^a-zA-Z0-9_\-\.]/g, '_')}`;
      const dest = path.join(OUTPUT_DIR, 'images', safeFilename);
      process.stdout.write(`Downloading image [${imgCount}/${collectedImages.size}]: ${safeFilename}\r`);
      await downloadFile(imgUrl, dest);
    } catch (e) {}
  }
  console.log(`\nAll images downloaded!`);
}

scrapeAll().catch(console.error);
