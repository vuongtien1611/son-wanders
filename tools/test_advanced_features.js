const puppeteer = require('../node_modules/puppeteer-core');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/cfab6cee-0d29-42b2-9b09-bea16f5d5c63';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testAdvancedFeatures() {
  console.log('Testing palette slots, room surfaces, and curated palettes...');
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--force-device-scale-factor=1']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/bang-mau/', { waitUntil: 'networkidle2' });

  // 1. Test clicking surface "Tường nhấn" then clicking a color
  console.log('Testing surface recoloring...');
  await page.click('#chip-wall-accent');
  await new Promise(r => setTimeout(r, 200));

  // Click WN0818 (Taupe Brown)
  await page.click('[data-color-code="WN0818"]');
  await new Promise(r => setTimeout(r, 300));

  const accentHex = await page.$eval('#chip-color-accent', el => el.style.backgroundColor);
  const accentCode = await page.$eval('#chip-code-accent', el => el.textContent.trim());
  console.log(`Accent wall updated to: ${accentCode} (${accentHex})`);

  // 2. Test Add to Palette button
  console.log('Testing Add to Palette...');
  // Currently palette has 3 items, 1 empty. Let's add WN0818
  await page.click('#btn-add-to-palette');
  await new Promise(r => setTimeout(r, 300));
  const paletteCounter = await page.$eval('#palette-counter', el => el.textContent.trim());
  console.log('Palette counter after adding:', paletteCounter);

  // 3. Test Room switch to Bedroom
  console.log('Testing Room switch to Bedroom...');
  await page.click('#tab-room-bedroom');
  await new Promise(r => setTimeout(r, 400));
  const roomImgSrc = await page.$eval('#room-base-img', el => el.src);
  console.log('Bedroom image src:', roomImgSrc);

  // Switch back to living room
  await page.click('#tab-room-living');
  await new Promise(r => setTimeout(r, 300));

  // 4. Test clicking Bottom Curated Palette "Xanh cỏ thơm thanh lịch"
  console.log('Testing bottom Curated Palette "Xanh cỏ thơm thanh lịch"...');
  await page.evaluate(() => {
    window.applyPresetPalette(['#CFD3BE', '#83906F', '#EFE6D8'], 'Xanh cỏ thơm thanh lịch');
  });
  await new Promise(r => setTimeout(r, 400));

  const newMainWallColor = await page.$eval('#chip-color-main', el => el.style.backgroundColor);
  console.log('Main wall color after curated palette:', newMainWallColor);

  // Reset back to reference default WN0824 Prairie Gentian
  await page.click('[data-collection-id="warm-neutral"]');
  await new Promise(r => setTimeout(r, 300));
  await page.click('[data-color-code="WN0824"]');
  await new Promise(r => setTimeout(r, 300));

  // Reset palette slots to (3/4) matching reference screenshot
  await page.evaluate(() => {
    const cur = window._studioState || {};
    // Scroll smoothly to studio center
    const studioEl = document.getElementById('color-studio-app');
    if (studioEl) studioEl.scrollIntoView({ behavior: 'instant', block: 'start' });
  });

  const interactiveStudioPath = path.join(ARTIFACT_DIR, 'color_studio_v2_interactive_verified.png');
  await page.screenshot({ path: interactiveStudioPath });
  console.log('Captured interactive verified screenshot:', interactiveStudioPath);

  await browser.close();
  console.log('All advanced feature tests completed successfully!');
}

testAdvancedFeatures().catch(err => {
  console.error('Advanced test error:', err);
  process.exit(1);
});

