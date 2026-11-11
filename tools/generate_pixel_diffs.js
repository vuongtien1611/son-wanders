const puppeteer = require('../node_modules/puppeteer-core');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\cfab6cee-0d29-42b2-9b09-bea16f5d5c63';
const BASE44_URL = 'https://wanders-color-lab.base44.app/';
const LOCAL_URL = 'http://localhost:3000/';

const VIEWPORTS = [
  { name: '1440x900', width: 1440, height: 900, label: 'Desktop-1440' },
  { name: '1280x800', width: 1280, height: 800, label: 'Desktop-1280' },
  { name: '1024x768', width: 1024, height: 768, label: 'Tablet-Landscape-1024' },
  { name: '768x1024', width: 768, height: 1024, label: 'Tablet-Portrait-768' },
  { name: '390x844', width: 390, height: 844, label: 'Mobile-390' },
  { name: '375x812', width: 375, height: 812, label: 'Mobile-375' }
];

async function main() {
  console.log('=== STARTING VISUAL PIXEL-MATCHING VERIFICATION ===');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });

  const b44Page = await browser.newPage();
  const localPage = await browser.newPage();
  const canvasPage = await browser.newPage();
  await canvasPage.goto('about:blank');

  const results = [];

  for (const vp of VIEWPORTS) {
    console.log(`\n--------------------------------------------------`);
    console.log(`Processing Viewport: ${vp.name} (${vp.label})...`);
    
    await b44Page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 });
    await localPage.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 });

    // Load Base44
    console.log(`  Loading Base44: ${BASE44_URL}...`);
    try {
      await b44Page.goto(BASE44_URL, { waitUntil: 'domcontentloaded', timeout: 25000 });
      await new Promise(r => setTimeout(r, 1200));
    } catch (e) {
      console.warn(`  Base44 load warning: ${e.message}`);
    }

    // Load Localhost
    console.log(`  Loading Localhost: ${LOCAL_URL}...`);
    try {
      await localPage.goto(LOCAL_URL, { waitUntil: 'domcontentloaded', timeout: 25000 });
      await new Promise(r => setTimeout(r, 1200));
    } catch (e) {
      console.warn(`  Localhost load warning: ${e.message}`);
    }

    const b44FoldPath = path.join(ARTIFACT_DIR, `b44_${vp.label}_fold.png`);
    const localFoldPath = path.join(ARTIFACT_DIR, `local_${vp.label}_fold.png`);

    await b44Page.screenshot({ path: b44FoldPath, fullPage: false });
    await localPage.screenshot({ path: localFoldPath, fullPage: false });

    // For desktop viewports, also capture full page
    if (vp.width >= 1024) {
      const b44FullPath = path.join(ARTIFACT_DIR, `b44_${vp.label}_full.png`);
      const localFullPath = path.join(ARTIFACT_DIR, `local_${vp.label}_full.png`);
      try {
        await b44Page.screenshot({ path: b44FullPath, fullPage: true });
        await localPage.screenshot({ path: localFullPath, fullPage: true });
      } catch (e) {
        console.warn('Full page capture note:', e.message);
      }
    }

    console.log(`  Captured Base44 fold: ${b44FoldPath}`);
    console.log(`  Captured Local fold:  ${localFoldPath}`);

    // Generate Visual Comparison using Canvas in Puppeteer
    const b44FoldBase64 = fs.readFileSync(b44FoldPath).toString('base64');
    const localFoldBase64 = fs.readFileSync(localFoldPath).toString('base64');

    console.log(`  Generating side-by-side, 50% overlay, and diff image...`);
    const diffResult = await canvasPage.evaluate(async (imgA_b64, imgB_b64, width, height) => {
      function loadImage(b64) {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = 'data:image/png;base64,' + b64;
        });
      }

      const imgA = await loadImage(imgA_b64);
      const imgB = await loadImage(imgB_b64);

      const w = Math.min(imgA.width, imgB.width, width);
      const h = Math.min(imgA.height, imgB.height, height);

      // 1. Overlay (50% Opacity)
      const overlayCanvas = document.createElement('canvas');
      overlayCanvas.width = w;
      overlayCanvas.height = h;
      const ctxO = overlayCanvas.getContext('2d');
      ctxO.drawImage(imgA, 0, 0, w, h);
      ctxO.globalAlpha = 0.5;
      ctxO.drawImage(imgB, 0, 0, w, h);
      const overlayData = overlayCanvas.toDataURL('image/png').split(',')[1];

      // 2. Diff Canvas & Pixel calculation
      const canvasA = document.createElement('canvas');
      canvasA.width = w;
      canvasA.height = h;
      const ctxA = canvasA.getContext('2d');
      ctxA.drawImage(imgA, 0, 0, w, h);
      const dataA = ctxA.getImageData(0, 0, w, h).data;

      const canvasB = document.createElement('canvas');
      canvasB.width = w;
      canvasB.height = h;
      const ctxB = canvasB.getContext('2d');
      ctxB.drawImage(imgB, 0, 0, w, h);
      const dataB = ctxB.getImageData(0, 0, w, h).data;

      const diffCanvas = document.createElement('canvas');
      diffCanvas.width = w;
      diffCanvas.height = h;
      const ctxD = diffCanvas.getContext('2d');
      const diffImageData = ctxD.createImageData(w, h);
      const dataD = diffImageData.data;

      let diffPixels = 0;
      const totalPixels = w * h;

      for (let i = 0; i < totalPixels * 4; i += 4) {
        const rDiff = Math.abs(dataA[i] - dataB[i]);
        const gDiff = Math.abs(dataA[i+1] - dataB[i+1]);
        const bDiff = Math.abs(dataA[i+2] - dataB[i+2]);
        const totalDelta = rDiff + gDiff + bDiff;

        if (totalDelta > 45) { // threshold
          diffPixels++;
          dataD[i] = 255;   // Red
          dataD[i+1] = 0;   // Green
          dataD[i+2] = 120; // Magenta
          dataD[i+3] = 255;
        } else {
          // dimmed grayscale background
          const gray = (dataA[i] * 0.299 + dataA[i+1] * 0.587 + dataA[i+2] * 0.114) * 0.3;
          dataD[i] = gray;
          dataD[i+1] = gray;
          dataD[i+2] = gray;
          dataD[i+3] = 255;
        }
      }
      ctxD.putImageData(diffImageData, 0, 0);
      const diffData = diffCanvas.toDataURL('image/png').split(',')[1];

      // 3. Side-by-side Comparison
      const sideCanvas = document.createElement('canvas');
      sideCanvas.width = w * 2 + 10;
      sideCanvas.height = h + 40;
      const ctxS = sideCanvas.getContext('2d');
      ctxS.fillStyle = '#1e293b';
      ctxS.fillRect(0, 0, sideCanvas.width, sideCanvas.height);
      
      ctxS.fillStyle = '#ffffff';
      ctxS.font = 'bold 16px sans-serif';
      ctxS.fillText('BASE44 ORIGINAL (LIVE)', 20, 26);
      ctxS.fillText('LOCAL CLONE (HTTP://LOCALHOST:3000)', w + 30, 26);

      ctxS.drawImage(imgA, 0, 35, w, h);
      ctxS.drawImage(imgB, w + 10, 35, w, h);
      const sideData = sideCanvas.toDataURL('image/png').split(',')[1];

      const matchRate = (((totalPixels - diffPixels) / totalPixels) * 100).toFixed(2);

      return {
        overlayData,
        diffData,
        sideData,
        totalPixels,
        diffPixels,
        matchRate
      };
    }, b44FoldBase64, localFoldBase64, vp.width, vp.height);

    const overlayPath = path.join(ARTIFACT_DIR, `overlay_${vp.label}.png`);
    const diffPath = path.join(ARTIFACT_DIR, `diff_${vp.label}.png`);
    const sidePath = path.join(ARTIFACT_DIR, `sidebyside_${vp.label}.png`);

    fs.writeFileSync(overlayPath, Buffer.from(diffResult.overlayData, 'base64'));
    fs.writeFileSync(diffPath, Buffer.from(diffResult.diffData, 'base64'));
    fs.writeFileSync(sidePath, Buffer.from(diffResult.sideData, 'base64'));

    console.log(`  Match rate: ${diffResult.matchRate}% (Diff pixels: ${diffResult.diffPixels} / ${diffResult.totalPixels})`);
    console.log(`  Saved overlay:    ${overlayPath}`);
    console.log(`  Saved diff:       ${diffPath}`);
    console.log(`  Saved sidebyside: ${sidePath}`);

    results.push({
      viewport: vp.name,
      label: vp.label,
      matchRate: diffResult.matchRate,
      diffPixels: diffResult.diffPixels,
      totalPixels: diffResult.totalPixels,
      files: {
        b44Fold: `b44_${vp.label}_fold.png`,
        localFold: `local_${vp.label}_fold.png`,
        overlay: `overlay_${vp.label}.png`,
        diff: `diff_${vp.label}.png`,
        sidebyside: `sidebyside_${vp.label}.png`
      }
    });
  }

  // Audit 24 authentic WANDERS products
  console.log('\n--- VERIFYING PRODUCT INTEGRITY & REAL EXCEL CODES ---');
  await localPage.setViewport({ width: 1440, height: 900 });
  await localPage.goto(LOCAL_URL + 'san-pham.html', { waitUntil: 'domcontentloaded' });

  const productData = await localPage.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.b44-product-card, [data-category]'));
    const names = [];
    const codes = [];
    cards.forEach(card => {
      const title = card.querySelector('h3, h4, .font-serif')?.innerText?.trim();
      const code = card.querySelector('.font-mono, .text-xs.tracking-widest, span.uppercase')?.innerText?.trim();
      if (title) names.push(title);
      if (code) codes.push(code);
    });
    return { count: cards.length, sampleNames: names.slice(0, 10), sampleCodes: codes.slice(0, 10) };
  });

  console.log(`Total Products on san-pham.html: ${productData.count}`);
  console.log(`Sample Names:`, productData.sampleNames);
  console.log(`Sample Codes:`, productData.sampleCodes);

  // Check section details on Homepage
  console.log('\n--- CHECKING HOMEPAGE SECTIONS ON LOCALHOST ---');
  await localPage.goto(LOCAL_URL, { waitUntil: 'domcontentloaded' });
  const sectionSummary = await localPage.evaluate(() => {
    const whyItems = Array.from(document.querySelectorAll('section')).find(s => s.innerText.includes('Why WANDERS') || s.innerText.includes('VÌ SAO CHỌN WANDERS'))?.querySelectorAll('.divide-y > div, .grid > div');
    const trustMedia = Array.from(document.querySelectorAll('section')).find(s => s.innerText.includes('Tin cậy & Truyền thông') || s.innerText.includes('NHÀ MÁY'));
    const playBtn = trustMedia?.querySelector('button svg, .rounded-full');
    
    return {
      title: document.title,
      hasWhyWanders: Boolean(whyItems),
      whyItemsCount: whyItems ? whyItems.length : 0,
      hasTrustMedia: Boolean(trustMedia),
      hasPlayBtn: Boolean(playBtn)
    };
  });
  console.log('Homepage Sections Audit:', sectionSummary);

  await browser.close();

  // Save report JSON
  const reportPath = path.join(ARTIFACT_DIR, 'pixel_diff_report.json');
  fs.writeFileSync(reportPath, JSON.stringify({ results, productData, sectionSummary }, null, 2));
  console.log(`\nReport saved to: ${reportPath}`);
  console.log('=== VERIFICATION COMPLETED SUCCESSFULLY ===');
}

main().catch(err => {
  console.error('Fatal error in pixel diff generator:', err);
  process.exit(1);
});
