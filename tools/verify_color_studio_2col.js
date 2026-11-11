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
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/bang-mau/', { waitUntil: 'networkidle0' });

  // 1. Structural & Layout Checks
  const layoutCheck = await page.evaluate(() => {
    const previewPanel = document.querySelector('aside.color-preview-panel');
    const studioLayout = document.querySelector('.color-studio-layout');
    const container = document.querySelector('#color-studio-app .wanders-container');
    const headerContainer = document.querySelector('header .wanders-container');
    const mainPanel = document.querySelector('.color-main-panel');
    const leftPanel = document.querySelector('.color-filter-panel');
    const bannerHex = document.getElementById('active-banner-hex');

    const containerRect = container.getBoundingClientRect();
    const headerRect = headerContainer.getBoundingClientRect();
    const mainRect = mainPanel.getBoundingClientRect();
    const leftRect = leftPanel.getBoundingClientRect();

    return {
      hasPreviewPanelInDom: previewPanel !== null,
      gridTemplateColumns: window.getComputedStyle(studioLayout).gridTemplateColumns,
      headerRight: headerRect.right,
      containerRight: containerRect.right,
      mainPanelRight: mainRect.right,
      mainPanelWidth: mainRect.width,
      leftPanelWidth: leftRect.width,
      rightGapDiff: Math.abs((containerRect.right - 40) - mainRect.right), // 40px is container padding-right
      bannerHexText: bannerHex ? bannerHex.innerText.trim() : null,
      swatchCount: document.querySelectorAll('.swatch-card').length,
      horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth
    };
  });

  console.log('Layout Check (1440px):', JSON.stringify(layoutCheck, null, 2));

  const artifactDir = 'C:/Users/Admin/.gemini/antigravity/brain/cfab6cee-0d29-42b2-9b09-bea16f5d5c63';

  // Screenshot Desktop Full Page (1440px)
  await page.screenshot({ path: `${artifactDir}/color_studio_2col_desktop_1440.png`, fullPage: true });

  // Screenshot Studio Panel focused
  const studioEl = await page.$('#color-studio-app');
  if (studioEl) {
    await studioEl.screenshot({ path: `${artifactDir}/color_studio_2col_studio_panel.png` });
  }

  // 2. Functional Tests
  // a) Click Swatch WN0815
  await page.click('.swatch-card[data-color-code="WN0815"]');
  await new Promise(r => setTimeout(r, 200));
  const afterClick = await page.evaluate(() => ({
    code: document.getElementById('active-banner-code').innerText.trim(),
    name: document.getElementById('active-banner-name').innerText.trim(),
    hex: document.getElementById('active-banner-hex').innerText.trim(),
    bg: document.getElementById('active-color-banner').style.backgroundColor,
    activeCardCode: document.querySelector('.swatch-card.active')?.getAttribute('data-color-code')
  }));
  console.log('After clicking WN0815:', JSON.stringify(afterClick));

  // b) Favorite toggle
  await page.click('#btn-fav-color');
  await new Promise(r => setTimeout(r, 150));
  const favFill = await page.evaluate(() => document.getElementById('icon-heart').getAttribute('fill'));
  console.log('Favorite icon fill after click:', favFill);

  // c) Search test
  await page.type('#color-search-input', 'Sage');
  await new Promise(r => setTimeout(r, 350));
  const searchCount = await page.evaluate(() => document.querySelectorAll('.swatch-card').length);
  console.log('Search "Sage" result count:', searchCount);

  // Clear search
  await page.click('#color-search-clear');
  await new Promise(r => setTimeout(r, 200));

  // d) Collection switch
  await page.click('.col-pill-btn[data-collection-id="earth-tone"]');
  await new Promise(r => setTimeout(r, 200));
  const firstEarthCode = await page.evaluate(() => document.querySelector('.swatch-card')?.getAttribute('data-color-code'));
  console.log('First swatch after switching to earth-tone:', firstEarthCode);

  // e) Compact view toggle
  await page.click('#btn-view-compact');
  await new Promise(r => setTimeout(r, 200));
  const isCompact = await page.evaluate(() => document.getElementById('swatch-grid').classList.contains('compact-mode'));
  console.log('Compact view active:', isCompact);
  await page.click('#btn-view-grid');

  // f) Preset click from bottom cards
  await page.evaluate(() => window.applyPresetPalette(['#CFD3BE', '#83906F', '#EFE6D8'], 'Xanh cỏ thơm thanh lịch'));
  await new Promise(r => setTimeout(r, 400));
  const afterPreset = await page.evaluate(() => ({
    code: document.getElementById('active-banner-code').innerText.trim(),
    hex: document.getElementById('active-banner-hex').innerText.trim()
  }));
  console.log('After applying preset:', JSON.stringify(afterPreset));

  // 3. Responsive Breakpoints & Screenshots
  const bps = [
    { name: 'desktop_1280', width: 1280, height: 850 },
    { name: 'tablet_1024', width: 1024, height: 768 },
    { name: 'tablet_768', width: 768, height: 1024 },
    { name: 'mobile_390', width: 390, height: 844 }
  ];

  for (const bp of bps) {
    await page.setViewport({ width: bp.width, height: bp.height });
    await page.goto('http://localhost:3000/bang-mau/', { waitUntil: 'networkidle0' });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    console.log(`Viewport ${bp.name} horizontal overflow:`, overflow);
    await page.screenshot({ path: `${artifactDir}/color_studio_2col_${bp.name}.png`, fullPage: true });
  }

  // Also test bang-mau.html & cam-hung-mau-sac.html
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/bang-mau.html', { waitUntil: 'networkidle0' });
  const hasPanelRoot = await page.evaluate(() => document.querySelector('aside.color-preview-panel') !== null);
  console.log('/bang-mau.html has preview panel:', hasPanelRoot);

  await page.goto('http://localhost:3000/cam-hung-mau-sac.html', { waitUntil: 'networkidle0' });
  const hasPanelCamHung = await page.evaluate(() => document.querySelector('aside.color-preview-panel') !== null);
  console.log('/cam-hung-mau-sac.html has preview panel:', hasPanelCamHung);

  console.log('Total Failed Requests:', failedRequests.length, failedRequests);
  console.log('Total Console Errors:', consoleErrors.length, consoleErrors);

  await browser.close();
})();

