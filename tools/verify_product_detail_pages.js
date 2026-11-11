const puppeteer = require('../node_modules/puppeteer-core');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  const failedRequests = [];
  const consoleErrors = [];
  page.on('requestfailed', req => failedRequests.push(req.url() + ' (' + req.failure().errorText + ')'));
  page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });

  const artifactDir = 'C:/Users/Admin/.gemini/antigravity/brain/cfab6cee-0d29-42b2-9b09-bea16f5d5c63';
  const products = JSON.parse(fs.readFileSync('giao-dien/website_download/data/wanders_products.json', 'utf8'));

  // 1. Audit ALL 24 product detail pages under file:///
  await page.setViewport({ width: 1440, height: 900 });
  let totalBrokenImgs = 0;
  let strayMyHour = 0;

  for (const p of products) {
    const fileUrl = 'file:///c:/Users/Admin/Documents/s%C6%A1n%20myhouse/giao-dien/website_download/' + p.link;
    await page.goto(fileUrl, { waitUntil: 'networkidle0' });
    await page.evaluate(async () => {
      const imgs = Array.from(document.querySelectorAll('img'));
      imgs.forEach(i => i.setAttribute('loading', 'eager'));
      await Promise.all(imgs.map(i => i.complete ? Promise.resolve() : new Promise(res => { i.onload = res; i.onerror = res; })));
    });
    const res = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      const broken = imgs.filter(i => i.naturalWidth === 0).map(i => i.getAttribute('src'));
      const hasMyHour = /MY\s*HOUR|0986\.217\.444|Ảnh sản phẩm đang cập nhật/i.test(document.body.innerText);
      const nav = Array.from(document.querySelectorAll('header nav a')).map(a => a.innerText.trim());
      return { broken, hasMyHour, nav, h1: document.querySelector('h1')?.innerText.trim() };
    });
    if (res.broken.length > 0) {
      totalBrokenImgs += res.broken.length;
      console.log('BROKEN IMGS in', p.code, res.broken);
    }
    if (res.hasMyHour) {
      strayMyHour++;
      console.log('STRAY MY HOUR in', p.code);
    }
  }
  console.log(`Audited all ${products.length} product detail pages via file:///: brokenImgs=${totalBrokenImgs}, strayMyHour=${strayMyHour}`);

  // 2. Capture full screenshots of IN525 (user's exact screenshot page) via file:///
  const in525Url = 'file:///c:/Users/Admin/Documents/s%C6%A1n%20myhouse/giao-dien/website_download/san-pham/silver-for-interior-in5000/index.html';
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(in525Url, { waitUntil: 'networkidle0' });
  await page.evaluate(async () => {
    const imgs = Array.from(document.querySelectorAll('img'));
    imgs.forEach(i => i.setAttribute('loading', 'eager'));
    await Promise.all(imgs.map(i => i.complete ? Promise.resolve() : new Promise(res => { i.onload = res; i.onerror = res; })));
  });
  await page.screenshot({ path: `${artifactDir}/product_detail_in525_desktop_full.png`, fullPage: true });
  await page.screenshot({ path: `${artifactDir}/product_detail_in525_desktop_fold.png` });

  // Mobile 390px
  await page.setViewport({ width: 390, height: 844 });
  await page.goto(in525Url, { waitUntil: 'networkidle0' });
  await page.evaluate(async () => {
    const imgs = Array.from(document.querySelectorAll('img'));
    imgs.forEach(i => i.setAttribute('loading', 'eager'));
    await Promise.all(imgs.map(i => i.complete ? Promise.resolve() : new Promise(res => { i.onload = res; i.onerror = res; })));
  });
  const mobOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  console.log('Mobile 390px horizontal overflow:', mobOverflow);
  await page.screenshot({ path: `${artifactDir}/product_detail_in525_mobile.png`, fullPage: true });

  // Also test HTTP route /san-pham/silver-for-interior-in5000/
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/san-pham/silver-for-interior-in5000/', { waitUntil: 'networkidle0' });

  console.log('Total Failed Requests:', failedRequests.length, failedRequests);
  console.log('Total Console Errors:', consoleErrors.length, consoleErrors);

  await browser.close();
})();

