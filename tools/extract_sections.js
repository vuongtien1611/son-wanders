const puppeteer = require('../node_modules/puppeteer-core');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://wanders-color-lab.base44.app/', { waitUntil: 'networkidle2' });

  // 1. Header
  const headerHtml = await page.evaluate(() => document.querySelector('header')?.outerHTML || '');
  fs.writeFileSync(path.join(__dirname, '../audit_base44/header.html'), headerHtml);

  // 2. Footer
  const footerHtml = await page.evaluate(() => document.querySelector('footer')?.outerHTML || '');
  fs.writeFileSync(path.join(__dirname, '../audit_base44/footer.html'), footerHtml);

  // 3. Sections breakdown
  const sections = await page.evaluate(() => {
    const main = document.querySelector('main') || document.body;
    const sects = Array.from(main.querySelectorAll(':scope > section, :scope > div > section, main > div'));
    return sects.map((s, idx) => ({
      idx,
      className: s.className,
      id: s.id,
      html: s.outerHTML
    }));
  });

  sections.forEach(s => {
    fs.writeFileSync(path.join(__dirname, `../audit_base44/section_${s.idx}.html`), s.html);
  });
  console.log(`Saved header, footer, and ${sections.length} sections!`);

  // 4. Extract all image URLs across the entire site
  const allImgUrls = await page.evaluate(() => {
    const urls = new Set();
    document.querySelectorAll('img').forEach(img => {
      if (img.src && img.src.startsWith('http')) urls.add(img.src);
    });
    // Check background images
    document.querySelectorAll('*').forEach(el => {
      const bg = window.getComputedStyle(el).backgroundImage;
      if (bg && bg.startsWith('url(')) {
        const u = bg.slice(4, -1).replace(/["']/g, '');
        if (u.startsWith('http')) urls.add(u);
      }
    });
    return Array.from(urls);
  });

  fs.writeFileSync(path.join(__dirname, '../audit_base44/homepage_images.json'), JSON.stringify(allImgUrls, null, 2));
  console.log('Homepage image URLs found:', allImgUrls.length);

  await browser.close();
})();

