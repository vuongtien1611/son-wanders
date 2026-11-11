const fs = require('fs');
const path = require('path');
const http = require('http');
const puppeteer = require('../node_modules/puppeteer-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SUBMISSIONS_PATH = path.resolve(__dirname, '../submissions/contact_submissions.json');
const ARTIFACTS = 'C:/Users/Admin/.gemini/antigravity/brain/cfab6cee-0d29-42b2-9b09-bea16f5d5c63';

const FORBIDDEN_VISIBLE = [
  /đang\s+cập\s+nhật/i,
  /chờ\s+cập\s+nhật/i,
  /đang\s+hoàn\s+thiện/i,
  /sắp\s+ra\s+mắt/i,
  /coming\s+soon/i,
  /lorem\s+ipsum/i,
  /chưa\s+công\s+bố/i,
  /đang\s+(?:được\s+)?xác\s+minh/i,
  /đang\s+(?:được\s+)?tổng\s+hợp/i,
  /kênh\s+đang\s+cập\s+nhật/i,
  /my\s*hour/i,
  /myhouse/i,
  /0986\.?217\.?444/i,
  /024\.?6688\.?7444/i,
  /tam\s+trinh|ngọc\s+hồi|gelexia/i,
];

function httpGet(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    }).on('error', reject);
  });
}

async function auditPage(page, url, label, { shotDesktop, shotMobile } = {}) {
  let consoleErrors = [];
  let reqFails = [];

  const onErr = (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); };
  const onFail = (r) => reqFails.push(`${r.url()} (${r.failure()?.errorText || 'fail'})`);
  const onResp = (r) => {
    if (r.status() >= 400 && !r.url().includes('fonts.')) reqFails.push(`${r.url()} (HTTP ${r.status()})`);
  };

  page.on('console', onErr);
  page.on('requestfailed', onFail);
  page.on('response', onResp);

  // Desktop 1440px
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
  await page.evaluate(async () => {
    for (let y = 0; y <= document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 70));
    }
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise((r) => setTimeout(r, 200));
    window.scrollTo(0, 0);
  });
  await new Promise((r) => setTimeout(r, 250));

  const dMetrics = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img'));
    const broken = imgs.filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.getAttribute('src') || i.alt);
    const overflow = document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;
    const text = document.body.innerText;
    const title = document.title;
    const hasMetaDesc = !!document.querySelector('meta[name="description"]')?.getAttribute('content');
    const hasFavicon = !!document.querySelector('link[rel="icon"]')?.getAttribute('href');
    const hasVideoId = !!document.getElementById('video');
    return {
      imgCount: imgs.length,
      broken,
      overflow,
      text,
      title,
      hasMetaDesc,
      hasFavicon,
      hasVideoId,
    };
  });

  if (shotDesktop) {
    await page.screenshot({ path: `${ARTIFACTS}/${shotDesktop}`, fullPage: true });
  }

  // Mobile 390px
  await page.setViewport({ width: 390, height: 844 });
  await new Promise((r) => setTimeout(r, 200));
  const mMetrics = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    scrollW: document.documentElement.scrollWidth,
    clientW: document.documentElement.clientWidth,
  }));

  if (shotMobile) {
    await page.screenshot({ path: `${ARTIFACTS}/${shotMobile}`, fullPage: false });
  }

  page.off('console', onErr);
  page.off('requestfailed', onFail);
  page.off('response', onResp);

  const visibleBad = [];
  for (const rx of FORBIDDEN_VISIBLE) {
    const m = dMetrics.text.match(rx);
    if (m) visibleBad.push(m[0]);
  }

  const ok =
    consoleErrors.length === 0 &&
    reqFails.length === 0 &&
    dMetrics.broken.length === 0 &&
    !dMetrics.overflow &&
    !mMetrics.overflow &&
    visibleBad.length === 0 &&
    dMetrics.hasMetaDesc &&
    dMetrics.hasFavicon &&
    !(label.includes('gioi-thieu') && dMetrics.hasVideoId);

  console.log(
    `[${ok ? 'PASS' : 'FAIL'}] ${label} | title="${dMetrics.title}" | imgs=${dMetrics.imgCount} broken=${dMetrics.broken.length} | dOverflow=${dMetrics.overflow} mOverflow=${mMetrics.overflow} (${mMetrics.scrollW}/${mMetrics.clientW}) | badText=${visibleBad.length} err=${consoleErrors.length} fail=${reqFails.length}`
  );
  if (!ok) console.log({ consoleErrors, reqFails, broken: dMetrics.broken, visibleBad, dMetricsOverflow: dMetrics.overflow, mMetrics });
  return ok;
}

async function run() {
  let allPassed = true;

  // 1. Technical endpoints & security headers
  console.log('=== 1. TECHNICAL & SECURITY CHECKS ===');
  const robots = await httpGet('http://localhost:3000/robots.txt');
  const sitemap = await httpGet('http://localhost:3000/sitemap.xml');
  const manifest = await httpGet('http://localhost:3000/manifest.json');
  const notFound = await httpGet('http://localhost:3000/non-existent-production-check-xyz');
  const dataLeak = await httpGet('http://localhost:3000/submissions/contact_submissions.json');

  const secOk =
    robots.status === 200 &&
    robots.headers['x-content-type-options'] === 'nosniff' &&
    robots.headers['x-frame-options'] === 'SAMEORIGIN' &&
    sitemap.status === 200 &&
    sitemap.body.includes('<urlset') &&
    manifest.status === 200 &&
    manifest.body.includes('WANDERS') &&
    !manifest.body.includes('MY HOUR') &&
    notFound.status === 404 &&
    dataLeak.status === 404;

  console.log(`[${secOk ? 'PASS' : 'FAIL'}] HTTP endpoints & Security Headers: robots=${robots.status} sitemap=${sitemap.status} manifest=${manifest.status} 404=${notFound.status} submissionsBlocked=${dataLeak.status}`);
  if (!secOk) allPassed = false;

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage();

  // 2. All key pages full audit
  console.log('\n=== 2. PAGE VISUAL, CONTENT & RESPONSIVE AUDIT ===');
  const targetPages = [
    ['http://localhost:3000/?intro=0', 'Homepage /', { shotDesktop: 'prod_home_desktop.png', shotMobile: 'prod_home_mobile.png' }],
    ['http://localhost:3000/gioi-thieu.html', 'gioi-thieu.html', { shotDesktop: 'prod_gioi_thieu_desktop.png', shotMobile: 'prod_gioi_thieu_mobile.png' }],
    ['http://localhost:3000/san-pham.html', 'san-pham.html', { shotDesktop: 'prod_san_pham_desktop.png' }],
    ['http://localhost:3000/san-pham/son-noi-that/index.html', 'Category son-noi-that', {}],
    ['http://localhost:3000/san-pham/silver-for-interior-in5000/index.html', 'Product IN525', {}],
    ['http://localhost:3000/san-pham/xika-lastic/index.html', 'Product Xika Lastic (no false ISO)', {}],
    ['http://localhost:3000/bang-mau.html', 'bang-mau.html', { shotDesktop: 'prod_bang_mau_desktop.png' }],
    ['http://localhost:3000/cam-hung-mau-sac.html', 'cam-hung-mau-sac.html', {}],
    ['http://localhost:3000/du-an.html', 'du-an.html', {}],
    ['http://localhost:3000/du-an/biet-thu-mai-bang/index.html', 'Project Detail Biet thu', {}],
    ['http://localhost:3000/lien-he.html', 'lien-he.html', { shotDesktop: 'prod_lien_he_desktop.png' }],
  ];
  for (const [url, lbl, opts] of targetPages) {
    allPassed = (await auditPage(page, url, lbl, opts)) && allPassed;
  }

  // 3. Functional Interaction Tests
  console.log('\n=== 3. INTERACTIVE FEATURE E2E TESTS ===');
  await page.setViewport({ width: 1440, height: 900 });

  // 3a. Homepage interactions
  await page.goto('http://localhost:3000/?intro=0', { waitUntil: 'networkidle0' });
  const homeResult = await page.evaluate(() => {
    const expSec = document.querySelector('section:nth-of-type(2)');
    const gBtns = expSec.querySelectorAll('.border-y.border-line button');
    gBtns[1].click(); // Earth Tone
    const subtitleAfterGroup = expSec.querySelector('.bg-gradient-to-t p:first-child').textContent.trim();
    const sBtns = expSec.querySelectorAll('.mt-7.grid.grid-cols-4 button');
    sBtns[4].click();
    const hexAfterSwatch = expSec.querySelector('.bg-gradient-to-t span.font-mono').textContent.trim();

    const livingSec = document.querySelector('section:nth-of-type(5)');
    const lBtns = livingSec.querySelectorAll('button');
    lBtns[2].click(); // Cảm hứng thiên nhiên
    const livingTitle = livingSec.querySelector('.bg-gradient-to-t p:last-child').textContent.trim();
    const livingHex = livingSec.querySelector('.mt-4.flex > div p').textContent.trim();
    return { subtitleAfterGroup, hexAfterSwatch, livingTitle, livingHex };
  });
  const homeInterOk =
    homeResult.subtitleAfterGroup.includes('Earth Tone') &&
    homeResult.hexAfterSwatch === '#95583A' &&
    homeResult.livingTitle === 'Cảm hứng thiên nhiên' &&
    homeResult.livingHex === '#F1ECE0';
  console.log(`[${homeInterOk ? 'PASS' : 'FAIL'}] Homepage Explorer & Living Tabs:`, homeResult);
  if (!homeInterOk) allPassed = false;

  // 3b. San Pham filter + Search
  await page.goto('http://localhost:3000/san-pham.html', { waitUntil: 'networkidle0' });
  const spInitial = await page.$eval('#productsCountLabel', (el) => el.textContent.trim());
  await page.type('#productSearchInput', 'EX9000');
  const spSearch = await page.$eval('#productsCountLabel', (el) => el.textContent.trim());
  await page.evaluate(() => {
    const inp = document.getElementById('productSearchInput');
    inp.value = '';
    inp.dispatchEvent(new Event('input'));
    const noiThatBtn = Array.from(document.querySelectorAll('main .grid button')).find((b) =>
      b.innerText.toLowerCase().includes('nội thất')
    );
    noiThatBtn.click();
  });
  const spNoiThat = await page.$eval('#productsCountLabel', (el) => el.textContent.trim());
  const spOk = spInitial === '24 sản phẩm' && spSearch === '1 sản phẩm' && spNoiThat === '5 sản phẩm';
  console.log(`[${spOk ? 'PASS' : 'FAIL'}] San Pham Filter & Search:`, { spInitial, spSearch, spNoiThat });
  if (!spOk) allPassed = false;

  // 3c. Contact Form validation + REAL POST /api/contact persistence
  await page.goto('http://localhost:3000/lien-he.html', { waitUntil: 'networkidle0' });
  await page.click('form button[type="submit"]');
  await new Promise((r) => setTimeout(r, 100));
  const emptyErr = await page.$eval('#contactFormStatus', (el) => ({
    visible: !el.classList.contains('hidden'),
    text: el.textContent.trim(),
  }));

  await page.type('#full_name', 'Kiểm thử Production');
  await page.type('#phone', '0937760688');
  await page.type('#email', 'test@wanders.vn');
  await page.select('#need', 'Sơn nội thất');
  await page.type('#message', 'Cần tư vấn báo giá sơn nội thất WANDERS cho căn hộ.');
  await page.click('form button[type="submit"]');
  await page.waitForFunction(() => {
    const box = document.getElementById('contactFormStatus');
    return box && box.textContent.includes('Mã #WD-');
  }, { timeout: 5000 });
  const submitSuccessText = await page.$eval('#contactFormStatus', (el) => el.textContent.trim());

  // Verify JSON persisted outside web root, then clean test record
  let persistedOk = false;
  if (fs.existsSync(SUBMISSIONS_PATH)) {
    const list = JSON.parse(fs.readFileSync(SUBMISSIONS_PATH, 'utf8'));
    const idx = list.findIndex((r) => r.full_name === 'Kiểm thử Production');
    if (idx !== -1) {
      persistedOk = true;
      list.splice(idx, 1);
      if (list.length === 0) fs.unlinkSync(SUBMISSIONS_PATH);
      else fs.writeFileSync(SUBMISSIONS_PATH, JSON.stringify(list, null, 2), 'utf8');
    }
  }
  const formOk = emptyErr.visible && submitSuccessText.includes('Mã #WD-') && persistedOk;
  console.log(`[${formOk ? 'PASS' : 'FAIL'}] Contact Form Validation & /api/contact DB Persistence:`, { emptyErr: emptyErr.visible, persistedOk });
  if (!formOk) allPassed = false;

  // 3d. Legacy redirects
  await page.goto('http://localhost:3000/tin-tuc.html', { waitUntil: 'networkidle0' });
  const tinTucDest = page.url();
  await page.goto('http://localhost:3000/dang-ky-dai-ly.html', { waitUntil: 'networkidle0' });
  const daiLyDest = page.url();
  const redirectOk = tinTucDest.includes('du-an.html') && daiLyDest.includes('lien-he.html');
  console.log(`[${redirectOk ? 'PASS' : 'FAIL'}] Legacy Redirects:`, { tinTucDest, daiLyDest });
  if (!redirectOk) allPassed = false;

  await browser.close();
  if (!allPassed) {
    process.exitCode = 1;
    console.error('\nPRODUCTION ACCEPTANCE TESTS FAILED');
  } else {
    console.log('\nALL PRODUCTION ACCEPTANCE TESTS PASSED!');
  }
}

run().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

