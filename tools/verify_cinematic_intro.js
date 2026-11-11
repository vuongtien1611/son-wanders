const fs = require('fs');
const puppeteer = require('../node_modules/puppeteer-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS = 'C:/Users/Admin/.gemini/antigravity/brain/cfab6cee-0d29-42b2-9b09-bea16f5d5c63';

async function runStagesAndMetrics(browser, label) {
  const page = await browser.newPage();
  const consoleErrors = [];
  const reqFails = [];
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('requestfailed', (r) => reqFails.push(r.url()));
  page.on('response', (r) => {
    if (r.status() >= 400 && !r.url().includes('fonts.')) reqFails.push(`${r.url()} (${r.status()})`);
  });

  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/?intro=1', { waitUntil: 'domcontentloaded' });

  // Instrument FPS & completion time inside page
  await page.evaluate(() => {
    window.__wiFrames = 0;
    window.__wiStart = performance.now();
    window.__wiEnd = 0;
    function loop() {
      if (document.documentElement.classList.contains('wi-active')) {
        window.__wiFrames++;
        requestAnimationFrame(loop);
      } else if (!window.__wiEnd) {
        window.__wiEnd = performance.now();
      }
    }
    requestAnimationFrame(loop);
  });

  // Capture stages across 3.55s using exact in-page timeline checkpoints (no screenshot drift)
  await new Promise((r) => setTimeout(r, 380));
  if (label === 'Chrome') await page.screenshot({ path: `${ARTIFACTS}/intro_stage1_impact.png` });

  await new Promise((r) => setTimeout(r, 420));
  if (label === 'Chrome') await page.screenshot({ path: `${ARTIFACTS}/intro_stage2_explosion.png` });

  await new Promise((r) => setTimeout(r, 650));
  if (label === 'Chrome') await page.screenshot({ path: `${ARTIFACTS}/intro_stage3_letters_forming.png` });

  await page.waitForFunction(
    () => document.getElementById('wanders-intro')?.classList.contains('wi-intro--reveal'),
    { timeout: 3000 }
  );
  await new Promise((r) => setTimeout(r, 220));
  const revealMetrics = await page.evaluate(() => {
    const slots = Array.from(document.querySelectorAll('.wi-letter-slot'));
    const rects = slots.map((s) => {
      const r = s.getBoundingClientRect();
      const im = s.querySelector('img');
      return {
        ch: s.getAttribute('data-glyph'),
        top: Math.round(r.top),
        bottom: Math.round(r.bottom),
        left: Math.round(r.left),
        width: Math.round(r.width),
        imgLoaded: !!(im && im.complete && im.naturalWidth > 0),
      };
    });
    const row = document.querySelector('.wi-logo-row')?.getBoundingClientRect();
    const skipRect = document.getElementById('wiSkipBtn')?.getBoundingClientRect();
    return {
      slotsCount: slots.length,
      allImagesLoaded: rects.every((x) => x.imgLoaded),
      rowWidth: row ? Math.round(row.width) : 0,
      rects,
      tagline: document.querySelector('.wi-tagline')?.textContent?.trim(),
      skipVisible: !!(skipRect && skipRect.width > 40),
    };
  });
  if (label === 'Chrome') await page.screenshot({ path: `${ARTIFACTS}/intro_stage4_brand_reveal_desktop.png` });

  await page.waitForFunction(
    () => document.getElementById('wanders-intro')?.classList.contains('wi-intro--wipe'),
    { timeout: 2500 }
  );
  await new Promise((r) => setTimeout(r, 340));
  if (label === 'Chrome') await page.screenshot({ path: `${ARTIFACTS}/intro_stage5_transition.png` });

  // Wait for full teardown & Hero reveal
  await page.waitForFunction(() => !document.documentElement.classList.contains('wi-active'), { timeout: 2500 });
  if (label === 'Chrome') {
    await page.screenshot({ path: `${ARTIFACTS}/intro_stage6_hero_unveiled.png` });
  }

  const endStats = await page.evaluate(() => ({
    wiActiveAfter: document.documentElement.classList.contains('wi-active'),
    mountDisplay: document.getElementById('wanders-intro')?.style.display || 'none',
    heroClickable: !!document.querySelector('header nav a'),
    frames: window.__wiFrames,
    durationMs: Math.round((window.__wiEnd || performance.now()) - window.__wiStart),
    bodyOverflow: getComputedStyle(document.body).overflow,
  }));

  const fps = endStats.durationMs > 0 ? Math.round((endStats.frames / endStats.durationMs) * 1000) : 0;
  console.log(`[${label} 1440px] duration=${endStats.durationMs}ms (~${fps} FPS) | activeAfter=${endStats.wiActiveAfter} | slots=${revealMetrics?.slotsCount} allImgs=${revealMetrics?.allImagesLoaded} | err=${consoleErrors.length} fail=${reqFails.length}`);
  if (revealMetrics) {
    console.log(`  Letter spacing rects:`, revealMetrics.rects.map(r => `${r.ch}:x=${r.left},w=${r.width}`).join(' | '));
  }

  const ok =
    consoleErrors.length === 0 &&
    reqFails.length === 0 &&
    !endStats.wiActiveAfter &&
    endStats.mountDisplay === 'none' &&
    revealMetrics &&
    revealMetrics.slotsCount === 7 &&
    revealMetrics.allImagesLoaded &&
    revealMetrics.skipVisible;

  await page.close();
  return ok;
}

async function runResponsiveAndEdgeTests(browser) {
  let ok = true;
  const page = await browser.newPage();

  // 1. Check 1280px, 768px, 390px alignment in Scene 04 (2450ms)
  for (const vp of [
    { width: 1280, height: 800, name: 'Laptop 1280' },
    { width: 768, height: 1024, name: 'Tablet 768' },
    { width: 390, height: 844, name: 'Mobile 390' },
  ]) {
    await page.setViewport({ width: vp.width, height: vp.height });
    await page.goto('http://localhost:3000/?intro=1', { waitUntil: 'domcontentloaded' });
    await new Promise((r) => setTimeout(r, 2400));
    const m = await page.evaluate(() => {
      const slots = Array.from(document.querySelectorAll('.wi-letter-slot'));
      const rects = slots.map((s) => s.getBoundingClientRect());
      const row = document.querySelector('.wi-logo-row')?.getBoundingClientRect();
      const tops = rects.map((r) => Math.round(r.top + r.height / 2));
      const sameLine = Math.max(...tops) - Math.min(...tops) <= 4;
      const fitsWidth = row ? row.left >= 0 && row.right <= window.innerWidth : false;
      return { sameLine, fitsWidth, rowW: row ? Math.round(row.width) : 0, vw: window.innerWidth };
    });
    if (vp.width === 390) {
      await page.screenshot({ path: `${ARTIFACTS}/intro_stage4_brand_reveal_mobile.png` });
    }
    const vpOk = m.sameLine && m.fitsWidth;
    console.log(`[${vpOk ? 'PASS' : 'FAIL'}] Responsive ${vp.name}: sameLine=${m.sameLine}, fitsWidth=${m.fitsWidth} (row=${m.rowW}/${m.vw})`);
    ok = vpOk && ok;
  }

  // 2. Skip Button test
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/?intro=1', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 650));
  await page.click('#wiSkipBtn');
  await new Promise((r) => setTimeout(r, 120));
  const afterSkip = await page.evaluate(() => ({
    wiActive: document.documentElement.classList.contains('wi-active'),
    seenFlag: sessionStorage.getItem('wanders_intro_seen'),
  }));
  const skipOk = !afterSkip.wiActive && afterSkip.seenFlag === '1';
  console.log(`[${skipOk ? 'PASS' : 'FAIL'}] Skip Button immediate exit:`, afterSkip);
  ok = skipOk && ok;

  // 3. Reload / refresh test in same session (should ALWAYS play intro on homepage!)
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  const refreshActiveStart = await page.evaluate(() => ({
    wiActive: document.documentElement.classList.contains('wi-active'),
    hasCanvas: !!document.querySelector('#wanders-intro canvas'),
  }));
  await page.waitForFunction(() => !document.documentElement.classList.contains('wi-active'), { timeout: 6500 });
  const refreshActiveEnd = await page.evaluate(() => document.documentElement.classList.contains('wi-active'));
  const reloadOk = refreshActiveStart.wiActive && refreshActiveStart.hasCanvas && !refreshActiveEnd;
  console.log(`[${reloadOk ? 'PASS' : 'FAIL'}] Reload homepage runs intro cleanly: start=${JSON.stringify(refreshActiveStart)}, endActive=${refreshActiveEnd}`);
  ok = reloadOk && ok;

  // 3b. Console replay test: WandersIntrol.replay() & WandersIntro.replay()
  const replayStart = await page.evaluate(() => {
    var okAlias = typeof window.WandersIntrol === 'object' && window.WandersIntrol === window.WandersIntro;
    if (!okAlias) return { okAlias: false, wiActive: false };
    window.WandersIntrol.replay();
    return {
      okAlias: okAlias,
      wiActive: document.documentElement.classList.contains('wi-active'),
      hasCanvas: !!document.querySelector('#wanders-intro canvas'),
    };
  });
  await page.waitForFunction(() => !document.documentElement.classList.contains('wi-active'), { timeout: 6500 });
  const replayOk = replayStart.okAlias && replayStart.wiActive && replayStart.hasCanvas;
  console.log(`[${replayOk ? 'PASS' : 'FAIL'}] Console WandersIntrol.replay() works: ${JSON.stringify(replayStart)}`);
  ok = replayOk && ok;

  // 4. Subpage navigation test (should NEVER run intro)
  await page.goto('http://localhost:3000/gioi-thieu.html', { waitUntil: 'networkidle0' });
  const subActive = await page.evaluate(() => !!document.getElementById('wanders-intro'));
  console.log(`[${!subActive ? 'PASS' : 'FAIL'}] Subpage navigation does not run intro: hasMount=${subActive}`);
  ok = !subActive && ok;

  // 5. prefers-reduced-motion test (fresh context)
  const rmCtx = await browser.createBrowserContext();
  const rmPage = await rmCtx.newPage();
  await rmPage.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await rmPage.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
  const rmActive = await rmPage.evaluate(() => document.documentElement.classList.contains('wi-active'));
  console.log(`[${!rmActive ? 'PASS' : 'FAIL'}] prefers-reduced-motion bypasses intro: wiActive=${rmActive}`);
  ok = !rmActive && ok;
  await rmCtx.close();

  // 6. Slow network + broken letter image resilience test
  const errCtx = await browser.createBrowserContext();
  const errPage = await errCtx.newPage();
  await errPage.setRequestInterception(true);
  errPage.on('request', (req) => {
    if (req.url().includes('04_D.png')) req.abort();
    else req.continue();
  });
  await errPage.goto('http://localhost:3000/?intro=1', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 4300));
  const errEndActive = await errPage.evaluate(() => document.documentElement.classList.contains('wi-active'));
  console.log(`[${!errEndActive ? 'PASS' : 'FAIL'}] Broken letter image resilience (never locks page): activeAfter=${errEndActive}`);
  ok = !errEndActive && ok;
  await errCtx.close();

  await page.close();
  return ok;
}

async function runPowerPaintWipeVerification(browser) {
  const path = require('path');
  let ok = true;
  const videoDir = path.join(ARTIFACTS, 'scratch', 'intro_video_frames');
  fs.mkdirSync(videoDir, { recursive: true });

  // 1. Uninterrupted Full Video Screencast + Exit Frame Timing Profiler at 1440x900
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  const cdp = await page.createCDPSession();
  const recordedFrames = [];
  let castT0 = 0;

  cdp.on('Page.screencastFrame', async (ev) => {
    const tsMs = (ev.metadata && ev.metadata.timestamp ? ev.metadata.timestamp : Date.now() / 1000) * 1000;
    if (!castT0) castT0 = tsMs;
    recordedFrames.push({
      idx: recordedFrames.length,
      epochMs: tsMs,
      relMs: Math.round(tsMs - castT0),
      data: ev.data,
    });
    try {
      await cdp.send('Page.screencastFrameAck', { sessionId: ev.sessionId });
    } catch (e) {}
  });

  await cdp.send('Page.startScreencast', {
    format: 'png',
    everyNthFrame: 1,
  });

  await page.goto('http://localhost:3000/?intro=1', { waitUntil: 'domcontentloaded' });

  // Track exact in-page RAF frame deltas during Exit (2700ms -> teardown) + exact wipe epoch anchor + Hero layout shift
  await page.evaluate(() => {
    window.__exitDts = [];
    window.__exitStartPerf = performance.now();
    window.__wiWipeEpochMs = 0;
    window.__heroRectDuring = null;
    window.__heroRectAfter = null;
    window.__curtainBottomSamples = [];
    const navEl = document.querySelector('header nav');
    if (navEl) {
      const r = navEl.getBoundingClientRect();
      window.__heroRectDuring = { left: Math.round(r.left), top: Math.round(r.top) };
    }
    let last = performance.now();
    function measure() {
      const now = performance.now();
      const elapsed = now - window.__exitStartPerf;
      const dt = now - last;
      last = now;
      const rootEl = document.getElementById('wanders-intro');
      if (rootEl && rootEl.classList.contains('wi-intro--wipe') && !window.__wiWipeEpochMs) {
        window.__wiWipeEpochMs = Date.now();
      }
      if (elapsed >= 2700 && document.documentElement.classList.contains('wi-active')) {
        window.__exitDts.push(dt);
        const curtain = document.getElementById('wiCurtain');
        if (curtain) {
          window.__curtainBottomSamples.push({
            t: Math.round(elapsed),
            bottom: Math.round(curtain.getBoundingClientRect().bottom),
          });
        }
      }
      if (document.documentElement.classList.contains('wi-active')) {
        requestAnimationFrame(measure);
      } else {
        const navAfter = document.querySelector('header nav');
        if (navAfter) {
          const r2 = navAfter.getBoundingClientRect();
          window.__heroRectAfter = { left: Math.round(r2.left), top: Math.round(r2.top) };
        }
      }
    }
    requestAnimationFrame(measure);
  });

  await page.waitForFunction(() => !document.documentElement.classList.contains('wi-active'), { timeout: 6000 });
  await new Promise((r) => setTimeout(r, 250));
  await cdp.send('Page.stopScreencast');

  const perfMetrics = await page.evaluate(() => {
    const dts = (window.__exitDts || []).slice(1); // drop initial threshold crossing dt
    const avgDt = dts.length ? dts.reduce((a, b) => a + b, 0) / dts.length : 0;
    const sorted = [...dts].sort((a, b) => a - b);
    const p95Dt = sorted.length ? sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.95))] : 0;
    const maxDt = sorted.length ? sorted[sorted.length - 1] : 0;
    const slowFrames = dts.filter((d) => d > 34).length;
    const samples = window.__curtainBottomSamples || [];
    const movedUpward = samples.length >= 2 && samples[samples.length - 1].bottom < samples[0].bottom - 400;
    const shiftX = window.__heroRectDuring && window.__heroRectAfter
      ? Math.abs(window.__heroRectAfter.left - window.__heroRectDuring.left)
      : -1;
    const shiftY = window.__heroRectDuring && window.__heroRectAfter
      ? Math.abs(window.__heroRectAfter.top - window.__heroRectDuring.top)
      : -1;
    return {
      wipeEpochMs: window.__wiWipeEpochMs,
      exitSamples: dts.length,
      exitFps: avgDt > 0 ? +(1000 / avgDt).toFixed(1) : 0,
      avgDtMs: +avgDt.toFixed(2),
      p95DtMs: +p95Dt.toFixed(2),
      maxDtMs: +maxDt.toFixed(2),
      slowFrames,
      movedUpward,
      firstBottom: samples[0]?.bottom,
      lastBottom: samples[samples.length - 1]?.bottom,
      shiftX,
      shiftY,
    };
  });

  // Align every screencast frame strictly onto the Intro's internal timeline (wipe starts at 2860ms)
  const wipeEpoch = perfMetrics.wipeEpochMs || (castT0 + 2860);
  for (const fr of recordedFrames) {
    fr.introMs = Math.round((fr.epochMs - wipeEpoch) + 2860);
    const fname = `frame_${String(fr.idx).padStart(4, '0')}_${String(fr.introMs).padStart(4, '0')}ms.png`;
    fs.writeFileSync(path.join(videoDir, fname), Buffer.from(fr.data, 'base64'));
  }

  // Extract nearest real compositor frames across the slower 950ms wipe arc
  const checkpoints = [
    { targetMs: 2600, file: 'intro_ckpt_2600_logo.png' },
    { targetMs: 2850, file: 'intro_ckpt_2850_charge.png' },
    { targetMs: 3150, file: 'intro_ckpt_3050_wipe_low.png' },
    { targetMs: 3450, file: 'intro_ckpt_3250_wipe_high.png' },
    { targetMs: 3860, file: 'intro_ckpt_3550_hero.png' },
  ];
  const ckptPicked = [];
  for (const ck of checkpoints) {
    let best = recordedFrames[0];
    let bestDiff = Infinity;
    for (const fr of recordedFrames) {
      const diff = Math.abs(fr.introMs - ck.targetMs);
      if (diff < bestDiff) {
        bestDiff = diff;
        best = fr;
      }
    }
    if (best) {
      fs.writeFileSync(path.join(ARTIFACTS, ck.file), Buffer.from(best.data, 'base64'));
      ckptPicked.push(`${ck.targetMs}ms->intro:${best.introMs}ms`);
    }
  }

  // Also capture responsive upward wipe checks at 768px & 390px
  const respWipe = [];
  for (const vp of [{ width: 768, height: 1024 }, { width: 390, height: 844 }]) {
    await page.setViewport(vp);
    await page.goto('http://localhost:3000/?intro=1', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(
      () => document.getElementById('wanders-intro')?.classList.contains('wi-intro--wipe'),
      { timeout: 4500 }
    );
    await new Promise((r) => setTimeout(r, 240));
    const m = await page.evaluate(() => {
      const curtain = document.getElementById('wiCurtain');
      const r = curtain ? curtain.getBoundingClientRect() : null;
      return {
        vw: window.innerWidth,
        vh: window.innerHeight,
        curtainBottom: r ? Math.round(r.bottom) : null,
        curtainLeft: r ? Math.round(r.left) : null,
        curtainRight: r ? Math.round(r.right) : null,
        overflowX: document.documentElement.scrollWidth > window.innerWidth,
      };
    });
    if (vp.width === 390) {
      await page.screenshot({ path: `${ARTIFACTS}/intro_ckpt_mobile_390_wipe.png` });
    }
    const upwardOk = m.curtainBottom !== null && m.curtainBottom < m.vh && !m.overflowX && m.curtainLeft === 0 && m.curtainRight >= m.vw;
    respWipe.push({ width: vp.width, upwardOk, ...m });
    ok = upwardOk && ok;
  }

  const exitOk = perfMetrics.movedUpward && perfMetrics.exitFps >= 45 && perfMetrics.slowFrames <= 2;
  console.log(`[${exitOk ? 'PASS' : 'FAIL'}] Power Paint Wipe Exit Metrics (1440px):`, JSON.stringify(perfMetrics));
  console.log(`  Recorded ${recordedFrames.length} screencast frames -> ${videoDir}`);
  console.log(`  Checkpoints extracted:`, ckptPicked.join(' | '));
  console.log(`  Responsive Wipe (768px & 390px):`, JSON.stringify(respWipe));

  ok = exitOk && ok;
  await page.close();
  return ok;
}

(async () => {
  let allPassed = true;

  // Run on Chrome
  const chrome = await puppeteer.launch({ executablePath: CHROME_PATH, headless: true, args: ['--no-sandbox'] });
  allPassed = (await runStagesAndMetrics(chrome, 'Chrome')) && allPassed;
  allPassed = (await runPowerPaintWipeVerification(chrome)) && allPassed;
  allPassed = (await runResponsiveAndEdgeTests(chrome)) && allPassed;
  await chrome.close();

  // Run on Edge if installed
  if (fs.existsSync(EDGE_PATH)) {
    const edge = await puppeteer.launch({ executablePath: EDGE_PATH, headless: true, args: ['--no-sandbox'] });
    allPassed = (await runStagesAndMetrics(edge, 'Edge')) && allPassed;
    await edge.close();
  } else {
    console.log('Edge executable not found at default path — Chrome verified.');
  }

  if (!allPassed) {
    process.exitCode = 1;
    console.error('CINEMATIC INTRO VERIFICATION FAILED');
  } else {
    console.log('ALL CINEMATIC INTRO CHECKS PASSED!');
  }
})();

