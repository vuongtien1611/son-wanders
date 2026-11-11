const puppeteer = require('../node_modules/puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/cfab6cee-0d29-42b2-9b09-bea16f5d5c63';

async function testUrl(browser, url, label, viewport = { width: 1440, height: 900 }) {
  console.log(`\n======================================================`);
  console.log(`Testing: ${label}`);
  console.log(`URL: ${url}`);
  console.log(`Viewport: ${viewport.width}x${viewport.height}`);
  console.log(`======================================================`);

  const page = await browser.newPage();
  await page.setViewport(viewport);

  const failedRequests = [];
  const consoleErrors = [];

  page.on('requestfailed', req => {
    failedRequests.push({ url: req.url(), error: req.failure().errorText });
  });

  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => {
    consoleErrors.push(err.toString());
  });

  const response = await page.goto(url, { waitUntil: 'networkidle2' });
  const status = response ? response.status() : 'FILE_PROTOCOL';

  console.log(`Response Status: ${status}`);
  console.log(`Failed Requests: ${failedRequests.length}`);
  if (failedRequests.length > 0) {
    failedRequests.forEach(f => console.error(`  - FAILED: ${f.url} (${f.error})`));
  }

  console.log(`Console Errors: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    consoleErrors.forEach(e => console.error(`  - ERROR: ${e}`));
  }

  // Check DOM Elements
  const headerLogo = await page.$eval('header img', img => ({
    src: img.src,
    complete: img.complete,
    naturalWidth: img.naturalWidth
  })).catch(() => null);

  const heroImg = await page.$eval('section.bg-charcoal img', img => ({
    src: img.src,
    complete: img.complete,
    naturalWidth: img.naturalWidth
  })).catch(() => null);

  const roomImg = await page.$eval('#room-base-img', img => ({
    src: img.src,
    complete: img.complete,
    naturalWidth: img.naturalWidth
  })).catch(() => null);

  const activeBanner = await page.$eval('#active-color-banner', el => ({
    bg: el.style.backgroundColor,
    code: el.querySelector('#active-banner-code').textContent.trim(),
    name: el.querySelector('#active-banner-name').textContent.trim()
  })).catch(() => null);

  const swatchCount = await page.$$eval('#swatch-grid .swatch-card', els => els.length);

  // Check 3-column Layout computed styles
  const layout = await page.$eval('.studio-layout-grid', el => {
    const style = window.getComputedStyle(el);
    return {
      display: style.display,
      gridTemplateColumns: style.gridTemplateColumns,
      width: el.offsetWidth
    };
  }).catch(() => null);

  console.log('DOM & Style Verification:');
  console.log('  - Header Logo loaded:', headerLogo ? `${headerLogo.complete} (w=${headerLogo.naturalWidth})` : 'MISSING');
  console.log('  - Hero Image loaded:', heroImg ? `${heroImg.complete} (w=${heroImg.naturalWidth})` : 'MISSING');
  console.log('  - Room Image loaded:', roomImg ? `${roomImg.complete} (w=${roomImg.naturalWidth})` : 'MISSING');
  console.log('  - Active Banner:', activeBanner);
  console.log('  - Swatch Count:', swatchCount);
  console.log('  - Layout Grid:', layout);

  // Capture screenshot
  const screenshotName = `verified_${label.toLowerCase().replace(/[^a-z0-9]/g, '_')}.png`;
  const screenshotPath = path.join(ARTIFACT_DIR, screenshotName);
  await page.screenshot({ path: screenshotPath, fullPage: viewport.height > 900 });
  console.log(`  -> Screenshot saved: ${screenshotName}`);

  await page.close();

  return {
    label,
    url,
    status,
    failedRequests: failedRequests.length,
    consoleErrors: consoleErrors.length,
    headerLogoOk: headerLogo && headerLogo.complete && headerLogo.naturalWidth > 0,
    heroImgOk: heroImg && heroImg.complete && heroImg.naturalWidth > 0,
    roomImgOk: roomImg && roomImg.complete && roomImg.naturalWidth > 0,
    activeBanner,
    swatchCount,
    layout,
    screenshotName
  };
}

async function runAll() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--force-device-scale-factor=1']
  });

  const results = [];

  const fileUrl = 'file:///' + path.resolve('giao-dien/website_download/bang-mau.html').replace(/\\/g, '/');

  // 1. Direct file:/// protocol
  results.push(await testUrl(browser, fileUrl, 'File_bang_mau_html_Desktop', { width: 1440, height: 900 }));

  // 2. http://localhost:3000/bang-mau/ (Desktop)
  results.push(await testUrl(browser, 'http://localhost:3000/bang-mau/', 'HTTP_bang_mau_folder_Desktop', { width: 1440, height: 900 }));

  // 3. http://localhost:3000/bang-mau.html (Desktop)
  results.push(await testUrl(browser, 'http://localhost:3000/bang-mau.html', 'HTTP_bang_mau_html_Desktop', { width: 1440, height: 900 }));

  // 4. http://localhost:3000/cam-hung-mau-sac/ (Desktop)
  results.push(await testUrl(browser, 'http://localhost:3000/cam-hung-mau-sac/', 'HTTP_cam_hung_folder_Desktop', { width: 1440, height: 900 }));

  // 5. Tablet Responsive (768x1024)
  results.push(await testUrl(browser, 'http://localhost:3000/bang-mau/', 'HTTP_bang_mau_Tablet', { width: 768, height: 1024 }));

  // 6. Mobile Responsive (390x844)
  results.push(await testUrl(browser, 'http://localhost:3000/bang-mau/', 'HTTP_bang_mau_Mobile', { width: 390, height: 844 }));

  await browser.close();

  console.log(`\n======================================================`);
  console.log(`SUMMARY OF ALL TEST RESULTS:`);
  console.log(`======================================================`);
  results.forEach(r => {
    const ok = r.failedRequests === 0 && r.consoleErrors === 0 && r.headerLogoOk && r.heroImgOk && r.roomImgOk && r.swatchCount === 24;
    console.log(`[${ok ? 'PASS' : 'FAIL'}] ${r.label}: status=${r.status}, failedReqs=${r.failedRequests}, errors=${r.consoleErrors}, swatches=${r.swatchCount}`);
  });

  fs.writeFileSync('giao-dien/tools/exhaustive_results.json', JSON.stringify(results, null, 2), 'utf8');
}

runAll().catch(err => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});

