const puppeteer = require('../node_modules/puppeteer-core');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\cfab6cee-0d29-42b2-9b09-bea16f5d5c63';
const BASE_URL = 'http://localhost:3000';

const pagesToTest = [
  { name: 'home', url: '/' },
  { name: 'san-pham', url: '/san-pham.html' },
  { name: 'bang-mau', url: '/bang-mau.html' },
  { name: 'du-an', url: '/du-an.html' },
  { name: 'gioi-thieu', url: '/gioi-thieu.html' },
  { name: 'lien-he', url: '/lien-he.html' }
];

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 }
];

(async () => {
  console.log('--- STARTING COMPREHENSIVE VISUAL VERIFICATION ---');
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });

  const page = await browser.newPage();
  
  const allErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') allErrors.push({ url: page.url(), text: msg.text() });
  });
  page.on('pageerror', err => allErrors.push({ url: page.url(), text: err.toString() }));

  for (const p of pagesToTest) {
    console.log(`\nTesting page: ${p.name} (${p.url})...`);

    for (const vp of viewports) {
      await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 });
      const fullUrl = BASE_URL + p.url;
      try {
        await page.goto(fullUrl, { waitUntil: 'networkidle0', timeout: 25000 });
        await new Promise(r => setTimeout(r, 600));

        const screenshotPath = path.join(ARTIFACT_DIR, `b44_clone_${p.name}_${vp.name}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`  Saved: b44_clone_${p.name}_${vp.name}.png (${fs.statSync(screenshotPath).size} bytes)`);
      } catch (err) {
        console.error(`  Error capturing ${p.name} at ${vp.name}:`, err.message);
      }
    }
  }

  // Test interactive features on Desktop
  console.log('\nTesting Interactive Features on Homepage...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(BASE_URL + '/', { waitUntil: 'networkidle0' });

  // 1. Click Color Explorer Group 2
  await page.evaluate(() => {
    const grp2 = document.querySelector('[data-group="1"]');
    if (grp2) grp2.click();
  });
  await new Promise(r => setTimeout(r, 400));
  const expColor = await page.evaluate(() => document.getElementById('explorerColorHex')?.innerText);
  console.log('Color Explorer switched to Earth Tone, hex:', expColor);

  // 2. Click Living with Colour Tab 2 (Nature Inspired)
  await page.evaluate(() => {
    const tab2 = document.querySelector('[data-idx="2"]');
    if (tab2) tab2.click();
  });
  await new Promise(r => setTimeout(r, 400));
  const livingTitle = await page.evaluate(() => document.getElementById('livingTitle')?.innerText);
  console.log('Living with Colour switched to:', livingTitle);

  // 3. Click Catalogue Filter "Sơn nội thất"
  await page.evaluate(() => {
    const tabInt = document.querySelector('[data-cat="son-noi-that"]');
    if (tabInt) tabInt.click();
  });
  await new Promise(r => setTimeout(r, 400));
  const visibleCards = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('#catalogueGrid .b44-product-card')).filter(c => c.style.display !== 'none').length;
  });
  console.log('Visible cards for "Sơn nội thất":', visibleCards);

  // 4. Test Color Studio on Bang-Mau
  console.log('\nTesting Color Studio on Bang-Mau...');
  await page.goto(BASE_URL + '/bang-mau.html', { waitUntil: 'networkidle0' });
  
  // Click a swatch
  await page.evaluate(() => {
    const swatch = document.querySelectorAll('.swatch-item')[3];
    if (swatch) swatch.click();
  });
  await new Promise(r => setTimeout(r, 300));
  
  // Click Add to Palette
  await page.evaluate(() => {
    document.getElementById('addToPaletteBtn')?.click();
  });
  await new Promise(r => setTimeout(r, 300));
  
  const slot0Text = await page.evaluate(() => document.getElementById('slot0')?.innerText);
  console.log('Color Studio 3-color palette slot 0:', slot0Text.replace(/\n/g, ' '));

  console.log('\nTotal console errors across all tests:', allErrors.length);
  if (allErrors.length > 0) {
    console.log('Errors:', allErrors);
  }

  await browser.close();
  console.log('--- VERIFICATION COMPLETED SUCCESSFULLY ---');
})();

