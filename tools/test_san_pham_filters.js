const puppeteer = require('../node_modules/puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/san-pham.html', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 600));

  const allCards = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.sp-product-card')).filter(c => c.style.display !== 'none').length;
  });
  console.log('All visible cards initially:', allCards);

  // Click 'Nội thất'
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.innerText.toLowerCase().includes('nội thất'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 400));
  const intCards = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.sp-product-card')).filter(c => c.style.display !== 'none');
    return cards.map(c => c.querySelector('.font-mono')?.innerText);
  });
  console.log('Cards visible after clicking "Nội thất":', intCards);

  // Click 'Ngoại thất'
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.innerText.toLowerCase().includes('ngoại thất'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 400));
  const extCards = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.sp-product-card')).filter(c => c.style.display !== 'none');
    return cards.map(c => c.querySelector('.font-mono')?.innerText);
  });
  console.log('Cards visible after clicking "Ngoại thất":', extCards);

  await browser.close();
})();
