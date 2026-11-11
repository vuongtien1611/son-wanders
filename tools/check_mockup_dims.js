const puppeteer = require('../node_modules/puppeteer-core');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage();
  const mockPath = 'C:/Users/Admin/.gemini/antigravity/brain/cfab6cee-0d29-42b2-9b09-bea16f5d5c63/.user_uploaded/media_1794051882318_a0336436.jpg';
  await page.setViewport({ width: 800, height: 1200 });
  await page.goto('file:///' + mockPath.replace(/\\/g, '/'));
  
  const dims = await page.evaluate(() => {
    const img = document.querySelector('img');
    return { w: img ? img.naturalWidth : 0, h: img ? img.naturalHeight : 0 };
  });
  console.log('Mockup natural dims:', dims);
  await browser.close();
})();

