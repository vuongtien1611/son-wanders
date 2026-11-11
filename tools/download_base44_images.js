const puppeteer = require('../node_modules/puppeteer-core');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const BASE_URL = 'https://wanders-color-lab.base44.app';
const OUT_DIR = path.join(__dirname, '../website_download/images/base44');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http;
    const req = proto.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed with status ${res.statusCode} for ${url}`));
      }
      const stream = fs.createWriteStream(dest);
      res.pipe(stream);
      stream.on('finish', () => {
        stream.close(() => resolve(dest));
      });
    });
    req.on('error', reject);
    req.setTimeout(20000, () => {
      req.destroy();
      reject(new Error(`Timeout downloading ${url}`));
    });
  });
}

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage();
  
  const allRoutes = [
    '/',
    '/san-pham',
    '/bang-mau',
    '/du-an',
    '/gioi-thieu',
    '/lien-he',
    '/san-pham/son-ngoai-that-ben-mau',
    '/du-an/biet-thu-mai-bang'
  ];

  const imageUrls = new Set();

  for (const r of allRoutes) {
    try {
      await page.goto(BASE_URL + r, { waitUntil: 'networkidle2' });
      const urls = await page.evaluate(() => {
        const list = [];
        document.querySelectorAll('img').forEach(img => {
          if (img.src && img.src.startsWith('http')) list.push(img.src);
        });
        document.querySelectorAll('*').forEach(el => {
          const bg = window.getComputedStyle(el).backgroundImage;
          if (bg && bg.startsWith('url(')) {
            const u = bg.slice(4, -1).replace(/["']/g, '');
            if (u.startsWith('http')) list.push(u);
          }
        });
        return list;
      });
      urls.forEach(u => imageUrls.add(u));
    } catch (e) {
      console.error('Error on route', r, e.message);
    }
  }

  await browser.close();
  console.log(`Discovered ${imageUrls.size} unique image URLs across routes.`);

  const manifest = {};
  let count = 0;

  for (const url of imageUrls) {
    try {
      // Create clean filename
      const urlObj = new URL(url);
      let filename = path.basename(urlObj.pathname);
      if (!filename || filename.length > 50 || !filename.includes('.')) {
        filename = `img_${count}.png`;
      }
      // sanitize filename
      filename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
      if (!path.extname(filename)) filename += '.png';

      const dest = path.join(OUT_DIR, filename);
      await downloadFile(url, dest);
      manifest[url] = `images/base44/${filename}`;
      count++;
      console.log(`[${count}/${imageUrls.size}] Downloaded: ${filename} (${fs.statSync(dest).size} bytes)`);
    } catch (err) {
      console.error(`Failed ${url}:`, err.message);
    }
  }

  fs.writeFileSync(path.join(__dirname, '../website_download/images/base44/manifest.json'), JSON.stringify(manifest, null, 2));
  console.log('Finished downloading all Base44 images!');
})();

