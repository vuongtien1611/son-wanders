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
  page.on('requestfailed', req => failedRequests.push(req.url() + ' (' + req.failure().errorText + ')'));
  page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });

  const artifactDir = 'C:/Users/Admin/.gemini/antigravity/brain/cfab6cee-0d29-42b2-9b09-bea16f5d5c63';

  // 1. Desktop 1440px
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/san-pham.html', { waitUntil: 'networkidle0' });

  // Scroll to #allProductsGrid and wait for lazy images to load
  await page.evaluate(async () => {
    const imgs = Array.from(document.querySelectorAll('#allProductsGrid img'));
    imgs.forEach(img => img.setAttribute('loading', 'eager'));
    await Promise.all(imgs.map(img => img.complete ? Promise.resolve() : new Promise(res => { img.onload = res; img.onerror = res; })));
  });

  // Check metrics on row 1 (cards 0..3)
  const metrics = await page.evaluate(() => {
    const grid = document.getElementById('allProductsGrid');
    const cards = Array.from(document.querySelectorAll('.sp-product-card'));
    const row1 = cards.slice(0, 4).map(c => {
      const r = c.getBoundingClientRect();
      const cta = c.querySelector('.wpc-cta').getBoundingClientRect();
      return { height: r.height, top: r.top, bottom: r.bottom, ctaBottomOffset: r.bottom - cta.bottom };
    });
    const brokenImgs = cards.filter(c => c.querySelector('img').naturalWidth === 0).length;
    return {
      totalCards: cards.length,
      gridCols: window.getComputedStyle(grid).gridTemplateColumns,
      row1,
      brokenImgs,
      horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth
    };
  });
  console.log('Desktop 1440px Metrics:', JSON.stringify(metrics, null, 2));

  // Hover on Card 2 (IN525) to visually capture hover state
  await page.evaluate(() => {
    const card2 = document.querySelectorAll('.sp-product-card')[1];
    card2.scrollIntoView({ block: 'center' });
  });
  await new Promise(r => setTimeout(r, 200));
  const card2Handle = (await page.$$('.sp-product-card'))[1];
  const box = await card2Handle.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await new Promise(r => setTimeout(r, 400));

  // Capture viewport showing the 4-card row with Card 2 hovered
  await page.screenshot({ path: `${artifactDir}/san_pham_cards_desktop_hover.png` });

  // Move mouse away and capture full grid
  await page.mouse.move(0, 0);
  await new Promise(r => setTimeout(r, 350));
  const gridEl = await page.$('#allProductsGrid');
  await gridEl.screenshot({ path: `${artifactDir}/san_pham_cards_desktop_grid.png` });

  // Test filter click ("Sơn nội thất")
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.trim().toLowerCase() === 'sơn nội thất');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 200));
  const filteredVisible = await page.evaluate(() => {
    const visible = Array.from(document.querySelectorAll('.sp-product-card')).filter(c => window.getComputedStyle(c).display !== 'none');
    return { count: visible.length, displays: visible.map(c => window.getComputedStyle(c).display) };
  });
  console.log('Filtered "Sơn nội thất":', JSON.stringify(filteredVisible));

  // Reset filter
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.trim().toLowerCase() === 'tất cả sản phẩm');
    if (btn) btn.click();
  });

  // 2. Tablet & Mobile Viewports
  const viewports = [
    { name: 'tablet_1024', width: 1024, height: 768 },
    { name: 'tablet_768', width: 768, height: 1024 },
    { name: 'mobile_390', width: 390, height: 844 },
    { name: 'mobile_340', width: 340, height: 800 }
  ];

  for (const vp of viewports) {
    await page.setViewport({ width: vp.width, height: vp.height });
    await page.goto('http://localhost:3000/san-pham.html', { waitUntil: 'networkidle0' });
    await page.evaluate(async () => {
      const imgs = Array.from(document.querySelectorAll('#allProductsGrid img'));
      imgs.forEach(img => img.setAttribute('loading', 'eager'));
      await Promise.all(imgs.map(img => img.complete ? Promise.resolve() : new Promise(res => { img.onload = res; img.onerror = res; })));
    });
    const vpInfo = await page.evaluate(() => {
      const grid = document.getElementById('allProductsGrid');
      return {
        cols: window.getComputedStyle(grid).gridTemplateColumns.split(' ').length,
        overflow: document.documentElement.scrollWidth > window.innerWidth
      };
    });
    console.log(`Viewport ${vp.name}:`, JSON.stringify(vpInfo));
    const g = await page.$('#allProductsGrid');
    await g.screenshot({ path: `${artifactDir}/san_pham_cards_${vp.name}.png` });
  }

  // 3. Also verify /san-pham/ subdirectory route AND file:/// protocol on BOTH san-pham.html and san-pham/index.html
  const fileUrls = [
    { name: 'http_subdir', url: 'http://localhost:3000/san-pham/', vp: { width: 1440, height: 900 } },
    { name: 'file_root', url: 'file:///c:/Users/Admin/Documents/s%C6%A1n%20myhouse/giao-dien/website_download/san-pham.html', vp: { width: 1440, height: 900 } },
    { name: 'file_subdir_1044', url: 'file:///c:/Users/Admin/Documents/s%C6%A1n%20myhouse/giao-dien/website_download/san-pham/index.html', vp: { width: 1044, height: 857 } }
  ];

  for (const item of fileUrls) {
    await page.setViewport(item.vp);
    await page.goto(item.url, { waitUntil: 'networkidle0' });
    await page.evaluate(async () => {
      const imgs = Array.from(document.querySelectorAll('img'));
      imgs.forEach(img => img.setAttribute('loading', 'eager'));
      await Promise.all(imgs.map(img => img.complete ? Promise.resolve() : new Promise(res => { img.onload = res; img.onerror = res; })));
    });
    const imgAudit = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      const broken = imgs.filter(i => i.naturalWidth === 0).map(i => i.getAttribute('src') || i.getAttribute('srcset'));
      return { totalImgs: imgs.length, brokenCount: broken.length, broken, cardCount: document.querySelectorAll('.sp-product-card').length };
    });
    console.log(`Audit ${item.name}:`, JSON.stringify(imgAudit));
    if (item.name === 'file_subdir_1044') {
      await page.screenshot({ path: `${artifactDir}/san_pham_file_subdir_fixed.png` });
    }
  }

  console.log('Total Failed Requests:', failedRequests.length, failedRequests);
  console.log('Total Console Errors:', consoleErrors.length, consoleErrors);

  await browser.close();
})();
