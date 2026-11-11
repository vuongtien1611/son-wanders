const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://my-hour-home.base44.app';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function scanAssets() {
  const routes = JSON.parse(fs.readFileSync('routes.json', 'utf8'));

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const allUrls = new Set();
  const domains = new Set();

  page.on('response', (response) => {
    try {
      const u = response.url();
      const status = response.status();
      allUrls.add(u);
      const parsed = new URL(u);
      domains.add(parsed.hostname);
    } catch (e) {}
  });

  // Visit a few representative pages
  const sampleRoutes = ['/', '/gioi-thieu', '/san-pham', '/san-pham/diamond-for-interior-in9000', '/tin-tuc', '/tin-tuc/gia-son-nha', '/cam-hung-mau-sac', '/lien-he'];
  for (const r of sampleRoutes) {
    console.log('Visiting sample:', r);
    await page.goto(BASE_URL + r, { waitUntil: 'networkidle2' });
    await new Promise(res => setTimeout(res, 500));
  }

  await browser.close();

  console.log('Domains involved:');
  console.log([...domains]);

  const assetList = [...allUrls].filter(u => !u.includes('analytics') && !u.includes('log-user-in-app') && !u.includes('api/orders'));
  console.log(`Total relevant asset URLs detected in sample: ${assetList.length}`);
  fs.writeFileSync('sample_assets.json', JSON.stringify(assetList, null, 2));
}

scanAssets().catch(console.error);
