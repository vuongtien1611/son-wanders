const puppeteer = require('../node_modules/puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  const failedRequests = [];
  const consoleErrors = [];
  page.on('requestfailed', req => failedRequests.push(req.url()));
  page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });

  const artifactDir = 'C:/Users/Admin/.gemini/antigravity/brain/cfab6cee-0d29-42b2-9b09-bea16f5d5c63';

  // 1. Test on index.html
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/index.html', { waitUntil: 'networkidle0' });

  const prodWrap = await page.$('.wanders-nav-dropdown-wrap');
  const box = await prodWrap.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await new Promise(r => setTimeout(r, 350));

  // Wait for dropdown images to load
  await page.evaluate(async () => {
    const imgs = Array.from(document.querySelectorAll('#wandersProductsDropdown img'));
    imgs.forEach(i => i.setAttribute('loading', 'eager'));
    await Promise.all(imgs.map(i => i.complete ? Promise.resolve() : new Promise(res => { i.onload = res; i.onerror = res; })));
  });

  const openState = await page.evaluate(() => {
    const dd = document.getElementById('wandersProductsDropdown');
    const st = window.getComputedStyle(dd);
    const cards = Array.from(dd.querySelectorAll('.wanders-mega-card'));
    return {
      isOpen: dd.classList.contains('is-open'),
      opacity: st.opacity,
      visibility: st.visibility,
      cardCount: cards.length,
      titles: cards.map(c => c.querySelector('.wanders-mega-card-title').innerText.trim()),
      brokenImgs: cards.filter(c => c.querySelector('img').naturalWidth === 0).length
    };
  });
  console.log('Index Dropdown Open State:', JSON.stringify(openState, null, 2));

  // Move mouse onto Card 2 (SƠN NGOẠI THẤT) inside dropdown to confirm zero flicker and hover card effect
  const card2 = (await page.$$('#wandersProductsDropdown .wanders-mega-card'))[1];
  const card2Box = await card2.boundingBox();
  await page.mouse.move(card2Box.x + card2Box.width / 2, card2Box.y + card2Box.height / 2);
  await new Promise(r => setTimeout(r, 300));

  const stillOpen = await page.evaluate(() => document.getElementById('wandersProductsDropdown').classList.contains('is-open'));
  console.log('Still open after moving onto dropdown card:', stillOpen);

  // Screenshot top 480px showing Header + Open Dropdown
  await page.screenshot({
    path: `${artifactDir}/header_products_dropdown_open.png`,
    clip: { x: 0, y: 0, width: 1440, height: 480 }
  });

  // 2. Test clicking "SẢN PHẨM KHÁC" (?nhom=khac) navigates & filters properly
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
    page.click('#wandersProductsDropdown .wanders-mega-card[href*="nhom=khac"]')
  ]);
  await new Promise(r => setTimeout(r, 300));
  const khacCount = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.sp-product-card')).filter(c => window.getComputedStyle(c).display !== 'none').length;
  });
  console.log('Filtered ?nhom=khac visible cards:', khacCount);

  // 3. Test on bang-mau.html & file:///.../san-pham/index.html
  await page.goto('http://localhost:3000/bang-mau.html', { waitUntil: 'networkidle0' });
  const bmWrap = await page.$('.wanders-nav-dropdown-wrap');
  const bmBox = await bmWrap.boundingBox();
  await page.mouse.move(bmBox.x + bmBox.width / 2, bmBox.y + bmBox.height / 2);
  await new Promise(r => setTimeout(r, 350));
  await page.screenshot({
    path: `${artifactDir}/header_products_dropdown_bangmau.png`,
    clip: { x: 0, y: 0, width: 1440, height: 480 }
  });

  await page.goto('file:///c:/Users/Admin/Documents/s%C6%A1n%20myhouse/giao-dien/website_download/san-pham/index.html', { waitUntil: 'networkidle0' });
  const fWrap = await page.$('.wanders-nav-dropdown-wrap');
  const fBox = await fWrap.boundingBox();
  await page.mouse.move(fBox.x + fBox.width / 2, fBox.y + fBox.height / 2);
  await new Promise(r => setTimeout(r, 350));
  const fileBroken = await page.evaluate(async () => {
    const imgs = Array.from(document.querySelectorAll('#wandersProductsDropdown img'));
    imgs.forEach(i => i.setAttribute('loading', 'eager'));
    await Promise.all(imgs.map(i => i.complete ? Promise.resolve() : new Promise(res => { i.onload = res; i.onerror = res; })));
    return imgs.filter(i => i.naturalWidth === 0).length;
  });
  console.log('file:/// san-pham/index.html dropdown broken images:', fileBroken);

  console.log('Total Failed Requests:', failedRequests.length, failedRequests);
  console.log('Total Console Errors:', consoleErrors.length, consoleErrors);

  await browser.close();
})();

