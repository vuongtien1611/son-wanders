const puppeteer = require('../node_modules/puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/cfab6cee-0d29-42b2-9b09-bea16f5d5c63';

async function verifyBreakpoint(browser, width, height) {
  console.log(`\n======================================================`);
  console.log(`Verifying Container Alignment at: ${width}x${height}`);
  console.log(`======================================================`);

  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  await page.goto('http://localhost:3000/bang-mau/', { waitUntil: 'networkidle2' });

  // Measure bounding client rects of all 5 container targets
  const measurements = await page.evaluate(() => {
    const targets = [
      { name: 'Header Inner', el: document.querySelector('header > .wanders-container') },
      { name: 'Hero Content', el: document.querySelector('.color-hero-section > .wanders-container') },
      { name: 'Color Studio', el: document.querySelector('#color-studio-app > .wanders-container') },
      { name: 'Gợi ý phối màu', el: document.querySelector('section.bg-cream > .wanders-container') },
      { name: 'Footer Inner', el: document.querySelector('footer > .wanders-container') }
    ];

    return targets.map(t => {
      if (!t.el) return { name: t.name, missing: true };
      const r = t.el.getBoundingClientRect();
      const style = window.getComputedStyle(t.el);
      const padL = parseFloat(style.paddingLeft);
      const padR = parseFloat(style.paddingRight);
      return {
        name: t.name,
        missing: false,
        containerLeft: Math.round(r.left * 100) / 100,
        containerRight: Math.round(r.right * 100) / 100,
        containerWidth: Math.round(r.width * 100) / 100,
        paddingLeft: padL,
        paddingRight: padR,
        contentLeft: Math.round((r.left + padL) * 100) / 100,
        contentRight: Math.round((r.right - padR) * 100) / 100,
        contentWidth: Math.round((r.width - padL - padR) * 100) / 100
      };
    });
  });

  console.log('Measurements:');
  measurements.forEach(m => {
    if (m.missing) {
      console.log(`  - ${m.name}: MISSING!`);
    } else {
      console.log(`  - ${m.name}: Container[${m.containerLeft} to ${m.containerRight}, w=${m.containerWidth}], Content[${m.contentLeft} to ${m.contentRight}, w=${m.contentWidth}]`);
    }
  });

  // Calculate maximum variance
  const valid = measurements.filter(m => !m.missing);
  const containerLefts = valid.map(m => m.containerLeft);
  const containerRights = valid.map(m => m.containerRight);
  const contentLefts = valid.map(m => m.contentLeft);
  const contentRights = valid.map(m => m.contentRight);

  const maxContainerLeftDiff = Math.max(...containerLefts) - Math.min(...containerLefts);
  const maxContainerRightDiff = Math.max(...containerRights) - Math.min(...containerRights);
  const maxContentLeftDiff = Math.max(...contentLefts) - Math.min(...contentLefts);
  const maxContentRightDiff = Math.max(...contentRights) - Math.min(...contentRights);

  console.log(`Alignment Variance:
  - Container Left Delta: ${maxContainerLeftDiff.toFixed(2)}px (Threshold <= 2px)
  - Container Right Delta: ${maxContainerRightDiff.toFixed(2)}px (Threshold <= 2px)
  - Content Left Delta: ${maxContentLeftDiff.toFixed(2)}px (Threshold <= 2px)
  - Content Right Delta: ${maxContentRightDiff.toFixed(2)}px (Threshold <= 2px)`);

  const passed = maxContainerLeftDiff <= 2 && maxContainerRightDiff <= 2 && maxContentLeftDiff <= 2 && maxContentRightDiff <= 2;
  console.log(`STATUS: [${passed ? 'PASS' : 'FAIL'}]`);

  // Draw 2 vertical guidelines across the entire page height
  const leftGuideX = valid[0].contentLeft;
  const rightGuideX = valid[0].contentRight;

  await page.evaluate((lx, rx) => {
    const guideStyle = 'position: absolute; top: 0; bottom: 0; width: 2px; z-index: 999999; pointer-events: none;';
    
    // Left Guideline
    const leftLine = document.createElement('div');
    leftLine.style.cssText = guideStyle + `left: ${lx}px; background-color: #E11D48; box-shadow: 0 0 4px rgba(225, 29, 72, 0.8);`;
    
    const leftTag = document.createElement('div');
    leftTag.textContent = `Align Left (${lx}px)`;
    leftTag.style.cssText = 'position: sticky; top: 10px; background: #E11D48; color: white; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px; display: inline-block; white-space: nowrap; font-family: monospace;';
    leftLine.appendChild(leftTag);
    document.body.appendChild(leftLine);

    // Right Guideline
    const rightLine = document.createElement('div');
    rightLine.style.cssText = guideStyle + `left: ${rx}px; background-color: #E11D48; box-shadow: 0 0 4px rgba(225, 29, 72, 0.8);`;
    
    const rightTag = document.createElement('div');
    rightTag.textContent = `Align Right (${rx}px)`;
    rightTag.style.cssText = 'position: sticky; top: 10px; background: #E11D48; color: white; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px; display: inline-block; white-space: nowrap; font-family: monospace; transform: translateX(-100%);';
    rightLine.appendChild(rightTag);
    document.body.appendChild(rightLine);
  }, leftGuideX, rightGuideX);

  // Take full-page screenshot with guidelines
  const screenshotName = `container_guide_${width}px.png`;
  const screenshotPath = path.join(ARTIFACT_DIR, screenshotName);
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`  -> Screenshot saved with guidelines: ${screenshotName}`);

  await page.close();

  return {
    width,
    height,
    passed,
    maxContainerLeftDiff,
    maxContainerRightDiff,
    maxContentLeftDiff,
    maxContentRightDiff,
    leftGuideX,
    rightGuideX,
    screenshotName,
    measurements
  };
}

async function run() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--force-device-scale-factor=1']
  });

  const viewports = [
    { width: 1440, height: 900 },
    { width: 1280, height: 900 },
    { width: 1024, height: 900 },
    { width: 768, height: 1024 },
    { width: 390, height: 844 }
  ];

  const results = [];
  for (let vp of viewports) {
    results.push(await verifyBreakpoint(browser, vp.width, vp.height));
  }

  await browser.close();

  console.log(`\n======================================================`);
  console.log(`FINAL ALIGNMENT AUDIT SUMMARY:`);
  console.log(`======================================================`);
  results.forEach(r => {
    console.log(`Breakpoint ${r.width}px: [${r.passed ? 'PERFECT PASS' : 'FAIL'}] (Left Delta: ${r.maxContentLeftDiff}px, Right Delta: ${r.maxContentRightDiff}px)`);
  });

  fs.writeFileSync('giao-dien/tools/alignment_results.json', JSON.stringify(results, null, 2), 'utf8');
}

run().catch(err => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});

