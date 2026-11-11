const puppeteer = require('../node_modules/puppeteer-core');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/cfab6cee-0d29-42b2-9b09-bea16f5d5c63';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function runTests() {
  console.log('Launching browser for Color Studio V2 verification with Chrome...');
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--force-device-scale-factor=1']
  });

  const page = await browser.newPage();
  
  // Collect console logs and errors
  const pageErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') console.log('PAGE ERROR:', msg.text());
  });
  page.on('pageerror', err => {
    console.error('PAGE CRASH/ERROR:', err.message);
    pageErrors.push(err.message);
  });

  // 1. Desktop Test (1440x900)
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  console.log('Navigating to http://localhost:3000/bang-mau/ ...');
  await page.goto('http://localhost:3000/bang-mau/', { waitUntil: 'networkidle2' });

  // Wait for the studio app element
  await page.waitForSelector('#color-studio-app');
  await page.waitForSelector('#swatch-grid .swatch-card');

  // Verify initial state
  const initialCode = await page.$eval('#active-banner-code', el => el.textContent.trim());
  const initialName = await page.$eval('#active-banner-name', el => el.textContent.trim());
  const initialBannerBg = await page.$eval('#active-color-banner', el => el.style.backgroundColor);
  const swatchCount = await page.$$eval('#swatch-grid .swatch-card', els => els.length);

  console.log(`Initial Desktop State:
  - Active Banner Code: ${initialCode}
  - Active Banner Name: ${initialName}
  - Banner Bg Color: ${initialBannerBg}
  - Visible Swatches: ${swatchCount}`);

  // Screenshot 1: Desktop Initial View (Fold)
  const desktopFoldPath = path.join(ARTIFACT_DIR, 'color_studio_v2_desktop_fold.png');
  await page.screenshot({ path: desktopFoldPath });
  console.log('Captured:', desktopFoldPath);

  // Interaction 1: Click swatch WN0812 (Sand Dune)
  console.log('Interacting: clicking swatch WN0812 Sand Dune...');
  const swatch12 = await page.$('[data-color-code="WN0812"]');
  if (swatch12) {
    await swatch12.click();
    await new Promise(r => setTimeout(r, 400));
    const newCode = await page.$eval('#active-banner-code', el => el.textContent.trim());
    console.log('Updated active code after click:', newCode);
  }

  // Interaction 2: Search for "almond"
  console.log('Interacting: searching for "almond"...');
  await page.type('#color-search-input', 'almond');
  await new Promise(r => setTimeout(r, 400));
  const searchSwatches = await page.$$eval('#swatch-grid .swatch-card', els => els.length);
  console.log(`Swatches after searching "almond": ${searchSwatches}`);

  // Clear search
  await page.click('#color-search-clear');
  await new Promise(r => setTimeout(r, 400));

  // Interaction 3: Switch collection to "Tông đất"
  console.log('Interacting: switching to collection "Tông đất"...');
  await page.click('[data-collection-id="earth-tone"]');
  await new Promise(r => setTimeout(r, 400));
  const earthSwatches = await page.$$eval('#swatch-grid .swatch-card', els => els.length);
  console.log(`Earth tone swatches count: ${earthSwatches}`);

  // Switch back to "Trung tính ấm"
  await page.click('[data-collection-id="warm-neutral"]');
  await new Promise(r => setTimeout(r, 400));

  // Interaction 4: Compact View toggle
  console.log('Interacting: toggling Compact View...');
  await page.click('#btn-view-compact');
  await new Promise(r => setTimeout(r, 300));

  // Toggle back to Grid View
  await page.click('#btn-view-grid');
  await new Promise(r => setTimeout(r, 300));

  // Select WN0824 again to match reference screenshot perfectly
  const swatch24 = await page.$('[data-color-code="WN0824"]');
  if (swatch24) {
    await swatch24.click();
    await new Promise(r => setTimeout(r, 400));
  }

  // Scroll to make sure Color Studio is beautifully framed
  await page.evaluate(() => {
    const el = document.getElementById('color-studio-app');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await new Promise(r => setTimeout(r, 400));

  const desktopStudioPath = path.join(ARTIFACT_DIR, 'color_studio_v2_desktop_studio.png');
  await page.screenshot({ path: desktopStudioPath });
  console.log('Captured desktop studio focus:', desktopStudioPath);

  // Screenshot 2: Full Desktop Page
  const desktopFullPath = path.join(ARTIFACT_DIR, 'color_studio_v2_desktop_full.png');
  await page.screenshot({ path: desktopFullPath, fullPage: true });
  console.log('Captured full desktop page:', desktopFullPath);

  // 2. Tablet Test (768x1024)
  console.log('Setting viewport to Tablet (768x1024)...');
  await page.setViewport({ width: 768, height: 1024, deviceScaleFactor: 1 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 500));
  const tabletPath = path.join(ARTIFACT_DIR, 'color_studio_v2_tablet.png');
  await page.screenshot({ path: tabletPath, fullPage: true });
  console.log('Captured tablet screenshot:', tabletPath);

  // 3. Mobile Test (390x844)
  console.log('Setting viewport to Mobile (390x844)...');
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 500));
  const mobilePath = path.join(ARTIFACT_DIR, 'color_studio_v2_mobile.png');
  await page.screenshot({ path: mobilePath, fullPage: true });
  console.log('Captured mobile screenshot:', mobilePath);

  await browser.close();

  const report = {
    initialCode,
    initialName,
    initialBannerBg,
    swatchCount,
    earthSwatches,
    pageErrors,
    screenshots: {
      desktopFold: desktopFoldPath,
      desktopStudio: desktopStudioPath,
      desktopFull: desktopFullPath,
      tablet: tabletPath,
      mobile: mobilePath
    }
  };

  fs.writeFileSync('giao-dien/tools/test_result.json', JSON.stringify(report, null, 2), 'utf8');
  console.log('Color Studio V2 verification complete! Report saved.');
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
