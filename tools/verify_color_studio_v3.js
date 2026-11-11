const puppeteer = require('../node_modules/puppeteer-core');
const path = require('path');

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

  console.log('Failed Requests:', failedRequests.length, failedRequests);
  console.log('Console Errors:', consoleErrors.length, consoleErrors);

  // Measure sections & containers
  const metrics = await page.evaluate(() => {
    const header = document.querySelector('header .wanders-container');
    const hero = document.querySelector('.color-hero-section');
    const studio = document.querySelector('#color-studio-app .wanders-container');
    const bottomSect = document.querySelector('.suggested-palettes-grid');
    const cta = document.querySelector('section.bg-\\[\\#F5F2EB\\] .wanders-container');
    const footer = document.querySelector('footer .wanders-container');

    const searchInput = document.getElementById('color-search-input');
    const colPills = document.querySelectorAll('#collection-pills .col-pill-btn');
    const swatches = document.querySelectorAll('.swatch-card');
    const activeBanner = document.getElementById('active-color-banner');
    const activeBannerCode = document.getElementById('active-banner-code');
    const roomImg = document.getElementById('room-base-img');
    const paletteSlots = document.querySelectorAll('.palette-slot-item');

    return {
      headerRect: header ? { left: header.getBoundingClientRect().left, width: header.getBoundingClientRect().width } : null,
      heroHeight: hero ? hero.getBoundingClientRect().height : null,
      studioRect: studio ? { left: studio.getBoundingClientRect().left, width: studio.getBoundingClientRect().width } : null,
      ctaRect: cta ? { left: cta.getBoundingClientRect().left, width: cta.getBoundingClientRect().width } : null,
      footerRect: footer ? { left: footer.getBoundingClientRect().left, width: footer.getBoundingClientRect().width } : null,
      searchInputPaddingLeft: searchInput ? window.getComputedStyle(searchInput).paddingLeft : null,
      searchInputHeight: searchInput ? window.getComputedStyle(searchInput).height : null,
      colPillsCount: colPills.length,
      colPillsFirstText: colPills[0] ? colPills[0].innerText.trim() : null,
      colPillsHeight: colPills[0] ? window.getComputedStyle(colPills[0]).height : null,
      swatchesCount: swatches.length,
      activeBannerCode: activeBannerCode ? activeBannerCode.innerText.trim() : null,
      activeBannerBg: activeBanner ? window.getComputedStyle(activeBanner).backgroundColor : null,
      roomImgSrc: roomImg ? roomImg.getAttribute('src') : null,
      paletteSlotsFilled: paletteSlots.length
    };
  });

  console.log('Metrics:', JSON.stringify(metrics, null, 2));

  const artifactDir = 'C:/Users/Admin/.gemini/antigravity/brain/cfab6cee-0d29-42b2-9b09-bea16f5d5c63';

  // Save screenshot of full page and studio section
  await page.screenshot({ path: `${artifactDir}/color_studio_v3_desktop_full.png`, fullPage: true });

  const studioEl = await page.$('#color-studio-app');
  if (studioEl) {
    await studioEl.screenshot({ path: `${artifactDir}/color_studio_v3_studio_panel.png` });
  }

  // Also screenshot bottom suggested palettes and CTA
  const suggestedEl = await page.$('.suggested-palettes-grid');
  if (suggestedEl) {
    await suggestedEl.screenshot({ path: `${artifactDir}/color_studio_v3_suggested_palettes.png` });
  }

  // Interactive verification: Click another color swatch
  await page.evaluate(() => {
    const card = document.querySelector('.swatch-card[data-color-code="WN0820"]');
    if (card) card.click();
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: `${artifactDir}/color_studio_v3_interaction_swatch_click.png` });

  // Test apply preset
  await page.evaluate(() => {
    window.applyPresetPalette(['#CFD3BE', '#83906F', '#EFE6D8'], 'Xanh cỏ thơm thanh lịch');
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: `${artifactDir}/color_studio_v3_interaction_preset_click.png` });

  // Responsive tests
  const breakpoints = [
    { name: '1280px', width: 1280, height: 850 },
    { name: '1024px', width: 1024, height: 768 },
    { name: '768px', width: 768, height: 1024 },
    { name: '390px', width: 390, height: 844 }
  ];

  for (const bp of breakpoints) {
    await page.setViewport({ width: bp.width, height: bp.height });
    await page.goto('http://localhost:3000/bang-mau/', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: `${artifactDir}/color_studio_v3_${bp.name}.png` });
    console.log(`Captured ${bp.name}`);
  }

  await browser.close();
  console.log('Verification completed successfully!');
})();

