const puppeteer = require('../node_modules/puppeteer-core');
const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, '../website_download/images/products');

async function main() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage();
  const files = fs.readdirSync(imgDir);

  const results = [];
  for (const f of files) {
    const full = path.join(imgDir, f);
    const b64 = fs.readFileSync(full).toString('base64');
    const mime = f.endsWith('.png') ? 'image/png' : 'image/jpeg';
    await page.setContent(`<html><body><img id="img" src="data:${mime};base64,${b64}"></body></html>`);
    const dim = await page.evaluate(() => {
      const img = document.getElementById('img');
      return { w: img.naturalWidth, h: img.naturalHeight };
    });
    results.push({
      file: f,
      valid: dim.w > 0,
      width: dim.w,
      height: dim.h,
      size: fs.statSync(full).size
    });
  }

  await browser.close();

  console.log(`\n--- VERIFIED ${results.length} PRODUCT IMAGES ---`);
  console.table(results);
}

main().catch(console.error);

