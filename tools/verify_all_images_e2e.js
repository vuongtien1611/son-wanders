const puppeteer = require('../node_modules/puppeteer-core');
const fs = require('fs');
const path = require('path');
const http = require('http');

const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\cfab6cee-0d29-42b2-9b09-bea16f5d5c63';
const BASE_URL = 'http://localhost:3000';
const JSON_PATH = path.join(__dirname, '../website_download/data/wanders_products.json');
const products = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));

function checkHttp(urlPath) {
  return new Promise((resolve) => {
    http.get(BASE_URL + urlPath, (res) => {
      resolve({ status: res.statusCode, ok: res.statusCode === 200 });
    }).on('error', (err) => {
      resolve({ status: 500, ok: false, error: err.message });
    });
  });
}

async function main() {
  console.log('=== STARTING END-TO-END VERIFICATION OF PRODUCT IMAGES ===');
  
  // 1. Verify HTTP 200 for all 24 product images
  console.log('\n--- 1. Testing HTTP Status of All 24 Product Images ---');
  const imageReport = [];
  for (const p of products) {
    const urlPath = '/' + p.image;
    const res = await checkHttp(urlPath);
    const localPath = path.join(__dirname, '../website_download', p.image);
    const exists = fs.existsSync(localPath);
    const stat = exists ? fs.statSync(localPath) : null;

    imageReport.push({
      code: p.code,
      name: p.name,
      file: path.basename(p.image),
      urlPath,
      exists,
      fileSize: stat ? stat.size : 0,
      httpStatus: res.status
    });
  }

  console.table(imageReport.map(r => ({
    'Mã SP': r.code,
    'Tên file ảnh': r.file,
    'Đường dẫn URL': r.urlPath,
    'Kích thước (B)': r.fileSize,
    'HTTP': r.httpStatus,
    'Trạng thái': r.httpStatus === 200 && r.fileSize > 0 ? 'HỢP LỆ (PASS)' : 'LỖI'
  })));

  // 2. Headless Chrome UI Inspection
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });

  const page = await browser.newPage();
  
  // A. Check San-Pham listing on Desktop
  console.log('\n--- 2. Inspecting San-Pham Listing (Desktop 1440x900) ---');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(BASE_URL + '/san-pham.html', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 800));

  const listData = await page.evaluate(() => {
    const cards = document.querySelectorAll('.sp-product-card');
    const items = [];
    cards.forEach(c => {
      const code = c.querySelector('.font-mono')?.innerText?.trim();
      const name = c.querySelector('h3')?.innerText?.trim();
      const img = c.querySelector('img');
      items.push({
        code,
        name,
        src: img?.getAttribute('src'),
        currentSrc: img?.currentSrc,
        naturalWidth: img?.naturalWidth,
        naturalHeight: img?.naturalHeight,
        complete: img?.complete
      });
    });
    return { count: cards.length, items };
  });

  console.log(`Found ${listData.count} product cards on /san-pham.html`);
  const allLoaded = listData.items.every(i => i.complete && i.naturalWidth > 0);
  console.log('All product images loaded with natural dimensions > 0:', allLoaded);

  const desktopScreenshot = path.join(ARTIFACT_DIR, 'wanders_san_pham_real_images_desktop.png');
  await page.screenshot({ path: desktopScreenshot, fullPage: false });
  console.log(`Saved screenshot: ${desktopScreenshot}`);

  // B. Check Mobile Viewport (390x844)
  console.log('\n--- 3. Inspecting San-Pham Listing (Mobile 390x844) ---');
  await page.setViewport({ width: 390, height: 844 });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 800));

  const mobileScreenshot = path.join(ARTIFACT_DIR, 'wanders_san_pham_real_images_mobile.png');
  await page.screenshot({ path: mobileScreenshot, fullPage: false });
  console.log(`Saved screenshot: ${mobileScreenshot}`);

  // C. Check Homepage Featured Products (Desktop 1440x900)
  console.log('\n--- 4. Inspecting Homepage Featured Catalogue ---');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(BASE_URL + '/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 800));

  const homeCards = await page.evaluate(() => {
    const cards = document.querySelectorAll('#homeCatalogueGrid a');
    return Array.from(cards).map(c => {
      const img = c.querySelector('img');
      return {
        code: c.querySelector('.font-mono')?.innerText?.trim(),
        name: c.querySelector('h3')?.innerText?.trim(),
        src: img?.getAttribute('src'),
        naturalWidth: img?.naturalWidth,
        naturalHeight: img?.naturalHeight
      };
    });
  });
  console.log('Homepage Catalogue Cards:');
  console.table(homeCards);

  // D. Check 5 Sample Product Detail Pages
  console.log('\n--- 5. Inspecting Sample Product Detail Pages ---');
  const sampleLinks = [
    '/san-pham/bronze-for-interior-in3000/index.html',
    '/san-pham/satin-for-exterior-ex5000/index.html',
    '/san-pham/waterproof-nano-wnano/index.html',
    '/san-pham/sealer-super-sp5000/index.html',
    '/san-pham/son-chong-nong-cn08/index.html'
  ];

  for (const link of sampleLinks) {
    await page.goto(BASE_URL + link, { waitUntil: 'domcontentloaded' });
    const detailData = await page.evaluate(() => {
      const img = document.querySelector('.product-image, main img, section img');
      return {
        title: document.querySelector('h1')?.innerText?.trim(),
        imgSrc: img?.getAttribute('src'),
        naturalWidth: img?.naturalWidth,
        naturalHeight: img?.naturalHeight,
        objectFit: img ? window.getComputedStyle(img).objectFit : null
      };
    });
    console.log(`Detail: ${link}`);
    console.log(`  Title: ${detailData.title} | Image: ${detailData.imgSrc} (${detailData.naturalWidth}x${detailData.naturalHeight}) | object-fit: ${detailData.objectFit}`);
  }

  await browser.close();

  // Save full JSON report
  const jsonReportPath = path.join(ARTIFACT_DIR, 'wanders_product_images_report.json');
  fs.writeFileSync(jsonReportPath, JSON.stringify({ imageReport, listData, homeCards }, null, 2));
  console.log(`\nFull report saved to: ${jsonReportPath}`);
  console.log('=== END-TO-END VERIFICATION COMPLETE ===');
}

main().catch(console.error);

