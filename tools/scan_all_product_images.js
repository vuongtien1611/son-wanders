const puppeteer = require('../node_modules/puppeteer-core');
const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, '../website_download/images');

async function main() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage();

  const allFiles = fs.readdirSync(imgDir);
  console.log('Total files in images directory:', allFiles.length);

  const candidates = allFiles.filter(f => {
    return f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.webp');
  });

  const results = [];

  for (const f of candidates) {
    if (f === 'base44') continue;
    const full = path.join(imgDir, f);
    const stat = fs.statSync(full);
    const b64 = fs.readFileSync(full).toString('base64');
    const mime = f.endsWith('.jpg') || f.endsWith('.jpeg') ? 'image/jpeg' : (f.endsWith('.webp') ? 'image/webp' : 'image/png');
    
    await page.setContent(`<html><body style="margin:0"><img id="target" src="data:${mime};base64,${b64}"></body></html>`);
    const info = await page.evaluate(() => {
      const img = document.getElementById('target');
      return {
        w: img.naturalWidth,
        h: img.naturalHeight
      };
    });

    results.push({
      file: f,
      size: stat.size,
      width: info.w,
      height: info.h
    });
  }

  await browser.close();

  // Sort by name
  results.sort((a, b) => a.file.localeCompare(b.file));
  console.log('\n--- SCAN OF ALL NON-BASE44 IMAGES ---');
  results.forEach(r => {
    console.log(`${r.file.padEnd(50)} | ${String(r.size).padStart(8)}B | ${r.width}x${r.height}`);
  });

  fs.writeFileSync(path.join(__dirname, 'image_scan_results.json'), JSON.stringify(results, null, 2));
}

main().catch(console.error);

