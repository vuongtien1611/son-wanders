const path = require('path');
const { pathToFileURL } = require('url');
const puppeteer = require('../node_modules/puppeteer-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ROOT = path.resolve(__dirname, '../website_download');
const ARTIFACTS = 'C:/Users/Admin/.gemini/antigravity/brain/cfab6cee-0d29-42b2-9b09-bea16f5d5c63';

const PAGES = [
  { url: 'http://localhost:3000/gioi-thieu.html', name: 'HTTP gioi-thieu.html', expectedActive: 'Giới thiệu', shot: 'header_sync_gioi_thieu.png' },
  { url: 'http://localhost:3000/index.html', name: 'HTTP index.html', expectedActive: null },
  { url: 'http://localhost:3000/san-pham.html', name: 'HTTP san-pham.html', expectedActive: 'Sản phẩm' },
  { url: 'http://localhost:3000/bang-mau.html', name: 'HTTP bang-mau.html', expectedActive: 'Bảng màu', shot: 'header_sync_bang_mau.png' },
  { url: 'http://localhost:3000/bang-mau/', name: 'HTTP bang-mau/', expectedActive: 'Bảng màu' },
  { url: 'http://localhost:3000/cam-hung-mau-sac.html', name: 'HTTP cam-hung-mau-sac.html', expectedActive: 'Bảng màu' },
  { url: 'http://localhost:3000/du-an.html', name: 'HTTP du-an.html', expectedActive: 'Dự án' },
  { url: 'http://localhost:3000/lien-he.html', name: 'HTTP lien-he.html', expectedActive: 'Liên hệ' },
  { url: pathToFileURL(path.join(ROOT, 'gioi-thieu/index.html')).href, name: 'FILE gioi-thieu/index.html', expectedActive: 'Giới thiệu' },
  { url: pathToFileURL(path.join(ROOT, 'bang-mau.html')).href, name: 'FILE bang-mau.html', expectedActive: 'Bảng màu' },
  { url: pathToFileURL(path.join(ROOT, 'bang-mau/index.html')).href, name: 'FILE bang-mau/index.html', expectedActive: 'Bảng màu' },
  { url: pathToFileURL(path.join(ROOT, 'cam-hung-mau-sac.html')).href, name: 'FILE cam-hung-mau-sac.html', expectedActive: 'Bảng màu' },
  { url: pathToFileURL(path.join(ROOT, 'lien-he/index.html')).href, name: 'FILE lien-he/index.html', expectedActive: 'Liên hệ' },
  { url: pathToFileURL(path.join(ROOT, 'du-an/biet-thu-mai-bang/index.html')).href, name: 'FILE du-an/biet-thu-mai-bang/index.html', expectedActive: 'Dự án' },
  { url: pathToFileURL(path.join(ROOT, 'san-pham/silver-for-interior-in5000/index.html')).href, name: 'FILE san-pham/silver-for-interior-in5000/index.html', expectedActive: 'Sản phẩm' },
];

async function inspectHeader(page, info, refHeader) {
  await page.setViewport({ width: 1440, height: 900 });
  const errors = [];
  const fails = [];
  const onErr = (m) => { if (m.type() === 'error') errors.push(m.text()); };
  const onFail = (r) => fails.push(r.url());
  page.on('console', onErr);
  page.on('requestfailed', onFail);

  await page.goto(info.url, { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 250));

  const data = await page.evaluate(() => {
    const hdr = document.querySelector('header');
    const inner = hdr.firstElementChild;
    const hdrCs = getComputedStyle(hdr);
    const innerRect = inner.getBoundingClientRect();
    const cta = hdr.querySelector('a[href*="lien-he"]');
    const ctaCs = cta ? getComputedStyle(cta) : null;
    const links = Array.from(
      hdr.querySelectorAll('nav > a, nav > .wanders-nav-dropdown-wrap > a')
    ).map((a) => ({
      text: a.textContent.trim().replace(/\s+/g, ' '),
      active: a.getAttribute('data-status') === 'active',
      underlineBg: a.querySelector('span')?.style.backgroundColor || getComputedStyle(a.querySelector('span')).backgroundColor,
    }));
    const logoImg = hdr.querySelector('img');
    const logoOk = logoImg && logoImg.complete && logoImg.naturalWidth > 0;
    const hasDropdownWrap = !!hdr.querySelector('.wanders-nav-dropdown-wrap');
    const hasDrawer = !!document.getElementById('b44MobileMenuDrawer');

    return {
      height: Math.round(hdr.getBoundingClientRect().height),
      bg: hdrCs.backgroundColor,
      borderBottom: hdrCs.borderBottomColor,
      innerLeft: Math.round(innerRect.left),
      innerWidth: Math.round(innerRect.width),
      ctaBg: ctaCs ? ctaCs.backgroundColor : null,
      ctaRadius: ctaCs ? ctaCs.borderRadius : null,
      links,
      logoOk,
      hasDropdownWrap,
      hasDrawer,
    };
  });

  if (info.shot) {
    await page.screenshot({
      path: `${ARTIFACTS}/${info.shot}`,
      clip: { x: 0, y: 0, width: 1440, height: 140 },
    });
  }

  // Verify mobile drawer toggle on bang-mau.html
  let mobileDrawerOk = true;
  if (info.url.includes('bang-mau.html') && info.url.startsWith('http')) {
    await page.setViewport({ width: 390, height: 844 });
    await page.click('header button[aria-label="Mở menu"]');
    await new Promise((r) => setTimeout(r, 120));
    mobileDrawerOk = await page.$eval('#b44MobileMenuDrawer', (el) => !el.classList.contains('hidden'));
    await page.click('header button[aria-label="Mở menu"]');
  }

  page.off('console', onErr);
  page.off('requestfailed', onFail);

  const navOrderOk = data.links.map((l) => l.text).join('|') === 'Giới thiệu|Sản phẩm|Bảng màu|Dự án|Liên hệ';
  const activeMatches = !info.expectedActive || data.links.some((l) => l.text === info.expectedActive && l.active);
  const matchesRef = !refHeader || (
    data.height === refHeader.height &&
    data.bg === refHeader.bg &&
    data.borderBottom === refHeader.borderBottom &&
    data.innerLeft === refHeader.innerLeft &&
    data.innerWidth === refHeader.innerWidth &&
    data.ctaBg === refHeader.ctaBg &&
    data.ctaRadius === refHeader.ctaRadius
  );

  const ok = errors.length === 0 && fails.length === 0 && data.logoOk && data.hasDropdownWrap && data.hasDrawer && navOrderOk && activeMatches && matchesRef && mobileDrawerOk;

  console.log(
    `[${ok ? 'PASS' : 'FAIL'}] ${info.name} | h=${data.height}px w=${data.innerWidth}px cta=${data.ctaBg} active=${data.links.filter(l => l.active).map(l => l.text).join(',')} | dropdown=${data.hasDropdownWrap} drawer=${data.hasDrawer} err=${errors.length} fail=${fails.length}`
  );
  if (!ok) console.log({ data, errors, fails, navOrderOk, activeMatches, matchesRef, mobileDrawerOk });
  return { ok, data };
}

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--allow-file-access-from-files'],
  });
  const page = await browser.newPage();

  const refResult = await inspectHeader(page, PAGES[0], null);
  let allOk = refResult.ok;
  for (let i = 1; i < PAGES.length; i++) {
    const res = await inspectHeader(page, PAGES[i], refResult.data);
    allOk = res.ok && allOk;
  }

  await browser.close();
  if (!allOk) {
    process.exitCode = 1;
    console.error('HEADER SYNC VERIFICATION FAILED');
  } else {
    console.log('ALL HEADER SYNC CHECKS PASSED!');
  }
}

run().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

