const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function testPages() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--allow-file-access-from-files', '--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('requestfailed', req => {
    errors.push(`Failed request: ${req.url()}`);
  });

  const baseDir = 'C:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download';
  const outDir = 'C:/Users/Admin/Documents/sơn myhouse/giao-dien/test_screenshots';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const urls = [
    { name: 'detail_xika_bitum', url: `file://${baseDir}/san-pham/xika-bitum-chong-tham-san/index.html` },
    { name: 'detail_cn08', url: `file://${baseDir}/san-pham/son-chong-nong-cn08/index.html` },
    { name: 'detail_xika_lastic', url: `file://${baseDir}/san-pham/xika-lastic/index.html` },
    { name: 'cat_son_chong_tham', url: `file://${baseDir}/san-pham/son-chong-tham/index.html` },
    { name: 'all_san_pham', url: `file://${baseDir}/san-pham/index.html` }
  ];

  for (const item of urls) {
    console.log(`Loading ${item.name}: ${item.url}...`);
    await page.goto(item.url, { waitUntil: 'networkidle0', timeout: 15000 }).catch(e => console.log('goto err:', e.message));
    // Wait a brief moment
    await new Promise(r => setTimeout(r, 1000));
    const shotPath = path.join(outDir, `${item.name}.png`);
    await page.screenshot({ path: shotPath, fullPage: false });
    console.log(`Saved screenshot: ${shotPath}`);
  }

  await browser.close();
  console.log('Errors encountered:', errors.filter(e => !e.includes('favicon')));
}

testPages().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

