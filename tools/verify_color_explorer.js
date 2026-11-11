const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const puppeteer = require('../node_modules/puppeteer-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACTS = 'C:/Users/Admin/.gemini/antigravity/brain/cfab6cee-0d29-42b2-9b09-bea16f5d5c63';

const EXPECTED = [
  {
    idx: 0,
    label: 'Trung tính ấm',
    subtitle: 'Warm Neutral — Trung tính ấm',
    file: '10_50_14 AM-1.png',
    swatchHex: '#DFD0B8',
    shot: 'color_exp_1_warm_neutral.png',
  },
  {
    idx: 1,
    label: 'Tông đất',
    subtitle: 'Earth Tone — Tông đất',
    file: '10_50_16 AM-2.png',
    swatchHex: '#C58A63',
    shot: 'color_exp_2_earth_tone.png',
  },
  {
    idx: 2,
    label: 'Xanh xô thơm',
    subtitle: 'Sage Green — Xanh xô thơm',
    file: '10_50_17 AM-3.png',
    swatchHex: '#B7BEA3',
    shot: 'color_exp_3_sage_green.png',
  },
  {
    idx: 3,
    label: 'Xanh hiện đại',
    subtitle: 'Modern Blue — Xanh hiện đại',
    file: '10_50_19 AM-4.png',
    swatchHex: '#A2B4BB',
    shot: 'color_exp_4_modern_blue.png',
  },
  {
    idx: 4,
    label: 'Trắng mềm',
    subtitle: 'Soft White — Trắng mềm',
    file: '10_50_21 AM-5.png',
    swatchHex: '#F1ECE0',
    shot: 'color_exp_5_soft_white.png',
  },
];

(async () => {
  let ok = true;
  const browser = await puppeteer.launch({ executablePath: CHROME_PATH, headless: true, args: ['--no-sandbox'] });

  const page = await browser.newPage();
  const consoleErrors = [];
  const reqFails = [];
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('requestfailed', (r) => reqFails.push(r.url()));
  page.on('response', (r) => {
    if (r.status() >= 400 && !r.url().includes('fonts.')) reqFails.push(`${r.url()} (${r.status()})`);
  });

  // 1. Desktop 1440px verification across all 5 color groups
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/?intro=0', { waitUntil: 'networkidle0' });

  const initialHeight = await page.evaluate(() => {
    const sec = document.querySelector('section:nth-of-type(2)');
    sec.scrollIntoView({ behavior: 'instant', block: 'center' });
    return Math.round(sec.getBoundingClientRect().height);
  });

  for (const exp of EXPECTED) {
    if (exp.idx > 0) {
      await page.evaluate((i) => {
        const btns = document.querySelectorAll('section:nth-of-type(2) .border-y.border-line button');
        btns[i].click();
      }, exp.idx);
    }
    // Wait for fade + scale transition (440ms) to finish cleanly
    await new Promise((r) => setTimeout(r, 520));

    const state = await page.evaluate(() => {
      const sec = document.querySelector('section:nth-of-type(2)');
      const container = sec.querySelector('.relative.overflow-hidden.bg-sand');
      const imgs = container.querySelectorAll('img');
      const im = imgs[0];
      const cs = im ? getComputedStyle(im) : null;
      return {
        imgCount: imgs.length,
        src: decodeURIComponent(im ? im.getAttribute('src') || '' : ''),
        currentSrc: decodeURIComponent(im ? im.currentSrc || '' : ''),
        complete: !!(im && im.complete && im.naturalWidth > 0),
        naturalW: im ? im.naturalWidth : 0,
        naturalH: im ? im.naturalHeight : 0,
        objectFit: cs ? cs.objectFit : '',
        opacity: cs ? cs.opacity : '',
        secHeight: Math.round(sec.getBoundingClientRect().height),
        subtitle: sec.querySelector('.bg-gradient-to-t p:first-child')?.textContent?.trim(),
        hex: sec.querySelector('.bg-gradient-to-t span.font-mono')?.textContent?.trim(),
      };
    });

    await page.screenshot({ path: path.join(ARTIFACTS, exp.shot) });

    const pass =
      state.imgCount === 1 &&
      state.src.includes(exp.file) &&
      state.complete &&
      state.objectFit === 'cover' &&
      state.opacity === '1' &&
      state.secHeight === initialHeight &&
      state.subtitle === exp.subtitle &&
      state.hex === exp.swatchHex;

    console.log(
      `[${pass ? 'PASS' : 'FAIL'}] Group ${exp.idx + 1} (${exp.label}): imgCount=${state.imgCount} size=${state.naturalW}x${state.naturalH} hex=${state.hex} h=${state.secHeight} file=${exp.file}`
    );
    ok = pass && ok;
  }

  // 2. Test prefers-reduced-motion compatibility
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.evaluate(() => {
    document.querySelectorAll('section:nth-of-type(2) .border-y.border-line button')[1].click();
  });
  await new Promise((r) => setTimeout(r, 80));
  const rmState = await page.evaluate(() => {
    const im = document.querySelector('section:nth-of-type(2) .relative.overflow-hidden.bg-sand img');
    return {
      src: decodeURIComponent(im.getAttribute('src') || ''),
      opacity: getComputedStyle(im).opacity,
      complete: im.complete && im.naturalWidth > 0,
    };
  });
  const rmOk = rmState.src.includes('10_50_16 AM-2.png') && rmState.opacity === '1' && rmState.complete;
  console.log(`[${rmOk ? 'PASS' : 'FAIL'}] prefers-reduced-motion switch:`, rmState);
  ok = rmOk && ok;

  // 3. Mobile 390px verification
  const mPage = await browser.newPage();
  await mPage.setViewport({ width: 390, height: 844 });
  await mPage.goto('http://localhost:3000/?intro=0', { waitUntil: 'networkidle0' });
  await mPage.evaluate(() => {
    const sec = document.querySelector('section:nth-of-type(2)');
    sec.scrollIntoView({ behavior: 'instant', block: 'start' });
    sec.querySelectorAll('.border-y.border-line button')[2].click(); // Sage Green
  });
  await new Promise((r) => setTimeout(r, 520));
  const mState = await mPage.evaluate(() => {
    const sec = document.querySelector('section:nth-of-type(2)');
    const im = sec.querySelector('.relative.overflow-hidden.bg-sand img');
    return {
      overflowX: document.documentElement.scrollWidth > window.innerWidth,
      src: decodeURIComponent(im.getAttribute('src') || ''),
      complete: im.complete && im.naturalWidth > 0,
      rectW: Math.round(im.getBoundingClientRect().width),
      rectH: Math.round(im.getBoundingClientRect().height),
    };
  });
  await mPage.screenshot({ path: path.join(ARTIFACTS, 'color_exp_mobile_390_sage.png') });
  const mOk = !mState.overflowX && mState.src.includes('10_50_17 AM-3.png') && mState.complete;
  console.log(`[${mOk ? 'PASS' : 'FAIL'}] Mobile 390px Sage Green:`, mState);
  ok = mOk && ok;
  await mPage.close();

  // 4. Rebuild persistence test: re-run apply_production_readiness.js and verify images persist
  execSync('node giao-dien/tools/apply_production_readiness.js', { stdio: 'inherit' });
  await page.emulateMediaFeatures([]);
  await page.reload({ waitUntil: 'networkidle0' });
  const afterRebuild = await page.evaluate(() => {
    const im = document.querySelector('section:nth-of-type(2) .relative.overflow-hidden.bg-sand img');
    return {
      src: decodeURIComponent(im.getAttribute('src') || ''),
      complete: im.complete && im.naturalWidth > 0,
    };
  });
  const rebuildOk = afterRebuild.src.includes('10_50_14 AM-1.png') && afterRebuild.complete;
  console.log(`[${rebuildOk ? 'PASS' : 'FAIL'}] Post-rebuild image persistence:`, afterRebuild);
  ok = rebuildOk && ok;

  console.log(`Console errors=${consoleErrors.length}, Request failures=${reqFails.length}`);
  if (consoleErrors.length || reqFails.length) {
    console.error({ consoleErrors, reqFails });
    ok = false;
  }

  await page.close();
  await browser.close();
  if (!ok) {
    process.exitCode = 1;
    console.error('COLOR EXPLORER VERIFICATION FAILED');
  } else {
    console.log('ALL COLOR EXPLORER CHECKS PASSED!');
  }
})();

