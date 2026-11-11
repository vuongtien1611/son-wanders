const path = require('path');
const { pathToFileURL } = require('url');
const puppeteer = require('../node_modules/puppeteer-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ROOT = path.resolve(__dirname, '../website_download');
const ARTIFACTS = 'C:/Users/Admin/.gemini/antigravity/brain/cfab6cee-0d29-42b2-9b09-bea16f5d5c63';

const SLUGS = [
  'biet-thu-mai-bang',
  'can-ho-trung-tam',
  'quan-ca-phe-studio',
  'sanh-lam-viec',
  'nha-vuon-mot-tang',
];

async function auditUrl(page, url, label, viewport = { width: 1440, height: 900 }) {
  await page.setViewport(viewport);
  const consoleErrors = [];
  const failedRequests = [];

  const onConsole = (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  };
  const onReqFailed = (req) => {
    failedRequests.push(`${req.url()} (${req.failure()?.errorText || 'failed'})`);
  };
  const onResponse = (res) => {
    if (res.status() >= 400 && !res.url().includes('fonts.')) {
      failedRequests.push(`${res.url()} (HTTP ${res.status()})`);
    }
  };

  page.on('console', onConsole);
  page.on('requestfailed', onReqFailed);
  page.on('response', onResponse);

  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
  // Scroll gently so lazy images trigger
  await page.evaluate(async () => {
    for (let y = 0; y <= document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 80));
    }
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise((r) => setTimeout(r, 250));
    window.scrollTo(0, 0);
  });
  await new Promise((r) => setTimeout(r, 350));

  const metrics = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img'));
    const brokenImgs = imgs
      .filter((img) => !img.complete || img.naturalWidth === 0)
      .map((img) => img.getAttribute('src') || img.alt);
    const navLinks = Array.from(
      document.querySelectorAll('header nav > a, header nav > .wanders-nav-dropdown-wrap > a')
    ).map((a) => a.textContent.trim().replace(/\s+/g, ' '));
    const h1 = document.querySelector('h1')?.textContent.trim() || '';
    const overflow =
      document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;
    const headerCssLoaded = Array.from(document.styleSheets).some((s) =>
      (s.href || '').includes('base44.css')
    );
    const text = document.body.innerText;
    const hasStray =
      text.includes('MY HOUR') || text.includes('[Cập nhật hotline]') || text.includes('[Cập nhật email]');
    return {
      imgCount: imgs.length,
      brokenImgs,
      navLinks,
      h1,
      overflow,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      headerCssLoaded,
      hasStray,
    };
  });

  page.off('console', onConsole);
  page.off('requestfailed', onReqFailed);
  page.off('response', onResponse);

  const ok =
    consoleErrors.length === 0 &&
    failedRequests.length === 0 &&
    metrics.brokenImgs.length === 0 &&
    !metrics.overflow &&
    metrics.headerCssLoaded &&
    !metrics.hasStray &&
    metrics.navLinks.join('|') === 'Giới thiệu|Sản phẩm|Bảng màu|Dự án|Liên hệ';

  console.log(
    `[${ok ? 'PASS' : 'FAIL'}] ${label} | h1="${metrics.h1}" | imgs=${metrics.imgCount} broken=${metrics.brokenImgs.length} | overflow=${metrics.overflow} (${metrics.scrollWidth}/${metrics.clientWidth}) | err=${consoleErrors.length} reqFail=${failedRequests.length}`
  );
  if (!ok) {
    console.log({ consoleErrors, failedRequests, metrics });
  }
  return ok;
}

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--allow-file-access-from-files'],
  });

  const page = await browser.newPage();
  let allPassed = true;

  // 1. Test HTTP /du-an/ listing + interactive filter + click through to detail
  allPassed = (await auditUrl(page, 'http://localhost:3000/du-an/', 'HTTP /du-an/ (Desktop)')) && allPassed;

  // Test filter buttons
  const filterResult = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('main section .no-scrollbar button'));
    const nhaOBtn = btns.find((b) => b.textContent.trim() === 'Nhà ở');
    nhaOBtn.click();
    const countAfterNhaO = Array.from(document.querySelectorAll('main section p')).find((p) =>
      p.textContent.includes('dự án') && p.className.includes('tracking-[0.18em]')
    )?.textContent.trim();
    const visibleAfterNhaO = Array.from(
      document.querySelectorAll('main section a[href*="index.html"]')
    ).filter((a) => getComputedStyle(a).display !== 'none').length;

    const allBtn = btns.find((b) => b.textContent.trim() === 'Tất cả');
    allBtn.click();
    const countAfterAll = Array.from(document.querySelectorAll('main section p')).find((p) =>
      p.textContent.includes('dự án') && p.className.includes('tracking-[0.18em]')
    )?.textContent.trim();
    return { countAfterNhaO, visibleAfterNhaO, countAfterAll };
  });
  console.log('Filter check:', filterResult);
  if (filterResult.visibleAfterNhaO !== 2 || !filterResult.countAfterNhaO.startsWith('2')) {
    console.error('[FAIL] Category filter did not filter to 2 Nhà ở projects');
    allPassed = false;
  }

  // Click Biệt thự mái bằng card from HTTP /du-an/
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
    page.click('a[href*="biet-thu-mai-bang/index.html"]'),
  ]);
  const clickedUrl = page.url();
  const clickedH1 = await page.$eval('h1', (el) => el.textContent.trim());
  console.log(`Clicked card navigated to: ${clickedUrl} (H1="${clickedH1}")`);
  if (!clickedUrl.includes('biet-thu-mai-bang/index.html') || clickedH1 !== 'Biệt thự mái bằng') {
    allPassed = false;
  }

  // Test Gallery Lightbox open/close
  await page.click('button[data-gallery-src]');
  await new Promise((r) => setTimeout(r, 150));
  const modalVisible = await page.$eval(
    '#projectGalleryModal',
    (el) => !el.classList.contains('hidden') && !!el.querySelector('#projectGalleryModalImg').src
  );
  await page.click('#projectGalleryClose');
  await new Promise((r) => setTimeout(r, 100));
  const modalClosed = await page.$eval('#projectGalleryModal', (el) =>
    el.classList.contains('hidden')
  );
  console.log(`Gallery Lightbox check: open=${modalVisible}, closed=${modalClosed}`);
  if (!modalVisible || !modalClosed) allPassed = false;

  // Capture Desktop screenshot of detail page
  await page.setViewport({ width: 1440, height: 900 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 200));
  await page.screenshot({
    path: `${ARTIFACTS}/project_detail_biet_thu_desktop_fold.png`,
  });
  await page.screenshot({
    path: `${ARTIFACTS}/project_detail_biet_thu_desktop_full.png`,
    fullPage: true,
  });

  // 2. Test Homepage click-through to /du-an/quan-ca-phe-studio/index.html
  await page.goto('http://localhost:3000/index.html', { waitUntil: 'networkidle0' });
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
    page.click('a[href*="quan-ca-phe-studio/index.html"]'),
  ]);
  const homeClickedH1 = await page.$eval('h1', (el) => el.textContent.trim());
  console.log(`Homepage -> Project click H1: "${homeClickedH1}"`);
  if (homeClickedH1 !== 'Quán cà phê studio') allPassed = false;

  // 3. Audit file:/// du-an.html and du-an/index.html
  const fileDuAn = pathToFileURL(path.join(ROOT, 'du-an.html')).href;
  const fileDuAnSub = pathToFileURL(path.join(ROOT, 'du-an', 'index.html')).href;
  allPassed = (await auditUrl(page, fileDuAn, 'FILE du-an.html (Desktop)')) && allPassed;
  allPassed = (await auditUrl(page, fileDuAnSub, 'FILE du-an/index.html (Desktop)')) && allPassed;

  // 4. Audit all 5 project detail pages under file:/// on Desktop 1440px and Mobile 390px
  for (const slug of SLUGS) {
    const fileUrl = pathToFileURL(path.join(ROOT, 'du-an', slug, 'index.html')).href;
    allPassed =
      (await auditUrl(page, fileUrl, `FILE du-an/${slug}/index.html (Desktop 1440)`, {
        width: 1440,
        height: 900,
      })) && allPassed;
    allPassed =
      (await auditUrl(page, fileUrl, `FILE du-an/${slug}/index.html (Mobile 390)`, {
        width: 390,
        height: 844,
      })) && allPassed;

    if (slug === 'biet-thu-mai-bang') {
      await page.screenshot({
        path: `${ARTIFACTS}/project_detail_biet_thu_mobile.png`,
      });
    }
    if (slug === 'sanh-lam-viec') {
      await page.setViewport({ width: 1440, height: 900 });
      await page.screenshot({
        path: `${ARTIFACTS}/project_detail_sanh_lam_viec_desktop.png`,
        fullPage: true,
      });
    }
  }

  await browser.close();
  if (!allPassed) {
    process.exitCode = 1;
    console.error('SOME PROJECT PAGE CHECKS FAILED');
  } else {
    console.log('ALL PROJECT PAGE CHECKS PASSED!');
  }
}

run().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

