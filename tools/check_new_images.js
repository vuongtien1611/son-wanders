const puppeteer = require('../node_modules/puppeteer-core');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 900 });
  
  const files = [
    'Golden Tropical Villa Retreat.png',
    '002_c1c8fa6d8_generated_image.png',
    '027_3e3b1c190_myhour-facility.png',
    '019_2dae2fe94_generated_image.png',
    '040_46a08f9f8_generated_image.png',
    '043_6f3c1edac_generated_image.png',
    '047_80052f6df_generated_image.png',
    '048_3b7f96a6a_generated_image.png'
  ];

  const html = `<!DOCTYPE html><html><body style="background:#111;color:#fff;font-family:sans-serif;padding:20px;display:flex;flex-wrap:wrap;gap:15px;">
    ${files.map(f => `
      <div style="background:#222;padding:10px;border-radius:8px;text-align:center;">
        <img src="file:///C:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/images/${f}" style="width:240px;height:160px;object-fit:cover;border-radius:4px;">
        <div style="font-size:12px;margin-top:6px;word-break:break-all;width:240px;">${f}</div>
      </div>
    `).join('')}
  </body></html>`;

  await page.setContent(html);
  await page.screenshot({ path: 'C:/Users/Admin/.gemini/antigravity/brain/cfab6cee-0d29-42b2-9b09-bea16f5d5c63/check_new_images.png' });
  await browser.close();
  console.log('Saved check_new_images.png');
})();

