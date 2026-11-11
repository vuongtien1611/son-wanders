const puppeteer = require('../node_modules/puppeteer-core');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });
  
  const files = [
    '019_2dae2fe94_generated_image.png',
    '038_2dae2fe94_generated_image.png',
    '040_46a08f9f8_generated_image.png',
    '043_6f3c1edac_generated_image.png',
    '046_7c6a54e1f_generated_image.png',
    '047_80052f6df_generated_image.png',
    '026_7c168f278_myhour-cover2.jpg',
    '004_5d6cbf088_generated_image.png',
    '005_7c6a54e1f_generated_image.png',
    '037_5d6cbf088_generated_image.png'
  ];

  const html = `<!DOCTYPE html><html><body style="background:#222;color:#fff;font-family:sans-serif;padding:20px;display:flex;flex-wrap:wrap;gap:15px;">
    ${files.map(f => `
      <div style="background:#333;padding:10px;border-radius:8px;text-align:center;">
        <img src="file:///C:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/images/${f}" style="width:220px;height:160px;object-fit:cover;border-radius:4px;">
        <div style="font-size:11px;margin-top:6px;word-break:break-all;width:220px;">${f}</div>
      </div>
    `).join('')}
  </body></html>`;

  await page.setContent(html);
  await page.screenshot({ path: 'C:/Users/Admin/.gemini/antigravity/brain/cfab6cee-0d29-42b2-9b09-bea16f5d5c63/check_project_images.png' });
  await browser.close();
  console.log('Saved check_project_images.png');
})();

