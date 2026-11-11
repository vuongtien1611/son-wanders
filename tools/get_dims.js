const puppeteer = require('puppeteer-core');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage();
  const imgPath = 'C:/Users/Admin/.gemini/antigravity/brain/cfab6cee-0d29-42b2-9b09-bea16f5d5c63/.user_uploaded/media_1794044487195_7754c64b.jpg';
  await page.goto('file:///' + imgPath.replace(/\\/g, '/'));
  const dims = await page.evaluate(() => {
    const img = document.querySelector('img');
    return { naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight };
  });
  console.log('Mockup natural dims:', dims);
  await browser.close();
})();

