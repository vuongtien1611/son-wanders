/**
 * WANDERS SHARED LUXURY LAYOUT MODULE
 * Single source of truth for Head, Header, Scene-04 CTA, Footer, Mobile Drawer & Motion Scripts.
 */
function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderHead({
  prefix = './',
  title = 'WANDERS — Sơn trang trí & Color Studio',
  description = 'Sơn trang trí và giải pháp màu sắc cho không gian sống hiện đại — mỗi bức tường, một dấu ấn riêng.',
  ogImage = 'images/base44/2c9aa4c1c_generated_be64a0c2.png',
  canonicalPath = '',
  extraCss = [],
  includeIntro = false,
} = {}) {
  const canonicalUrl = canonicalPath ? `https://wanders.vn/${canonicalPath}` : 'https://wanders.vn/';
  const cssLinks = [
    `${prefix}assets/base44.css`,
    `${prefix}assets/wanders_header_dropdown.css`,
    ...extraCss.map((c) => `${prefix}assets/${c}`),
    `${prefix}assets/wanders-luxury.css`,
  ]
    .map((href) => `  <link rel="stylesheet" href="${href}">`)
    .join('\n');

  const introHead = includeIntro
    ? `\n  <link rel="stylesheet" href="${prefix}assets/wanders-intro.css">
  <script>
    (function () {
      try {
        var qs = window.location.search || '';
        var force = qs.indexOf('intro=1') !== -1;
        var skip = qs.indexOf('intro=0') !== -1;
        var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!skip && (force || !reduced)) {
          document.documentElement.classList.add('wi-active');
          setTimeout(function () {
            document.documentElement.classList.remove('wi-active');
            document.documentElement.classList.add('wi-hero-enter');
          }, 5200);
        }
      } catch (e) {}
    })();
  </script>`
    : '';

  return `<head>
  <meta charset="utf-8">
  <meta content="width=device-width, initial-scale=1.0" name="viewport">
  <link rel="icon" type="image/png" href="${prefix}images/base44/a963c52b6_image.png">
  <title>${escapeHtml(title)}</title>
  <meta content="${escapeHtml(description)}" name="description">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="WANDERS">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:image" content="${prefix}${ogImage}">
  <link rel="canonical" href="${canonicalUrl}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&display=swap" rel="stylesheet">
${cssLinks}${introHead}
</head>`;
}

function renderHeader(prefix = './', activeNav = 'home') {
  const logoSrc = `${prefix}images/base44/a963c52b6_image.png`;
  const navItems = [
    { id: 'gioi-thieu', label: 'Giới thiệu', href: `${prefix}gioi-thieu.html` },
    { id: 'san-pham', label: 'Sản phẩm', href: `${prefix}san-pham.html` },
    { id: 'bang-mau', label: 'Bảng màu', href: `${prefix}bang-mau.html` },
    { id: 'du-an', label: 'Dự án', href: `${prefix}du-an.html` },
    { id: 'lien-he', label: 'Liên hệ', href: `${prefix}lien-he.html` },
  ];

  const navHtml = navItems
    .map((item) => {
      const activeAttr = activeNav === item.id ? ' data-status="active"' : '';
      return `<a class="group w-nav-link" href="${item.href}"${activeAttr}>${item.label}<span class="w-nav-line"></span></a>`;
    })
    .join('');

  const homeActiveAttr = activeNav === 'home' ? ' data-status="active" aria-current="page"' : '';
  const ctaActiveAttr = activeNav === 'lien-he' ? ' data-status="active"' : '';

  return `<header class="w-header"><div class="mx-auto flex h-[76px] w-full max-w-[1320px] items-center justify-between gap-6 px-6 md:h-[86px] md:px-10"><a class="flex shrink-0 items-center" href="${prefix}index.html"${homeActiveAttr} aria-label="Trang chủ WANDERS"><img class="w-brand-logo" alt="Logo WANDERS" src="${logoSrc}"></a><nav class="hidden items-center gap-7 lg:flex xl:gap-10">${navHtml}</nav><div class="flex items-center gap-2"><a class="w-header-cta hidden shrink-0 lg:inline-flex" href="${prefix}lien-he.html"${ctaActiveAttr}>Tư vấn chọn sơn</a><button type="button" aria-label="Mở menu" class="flex h-11 w-11 items-center justify-center border border-[#E2DDD2] bg-white/60 text-[#073B2E] transition-colors hover:border-[#073B2E] lg:hidden"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-menu h-5 w-5"><line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="18" y2="18"></line></svg></button></div></div></header>`;
}

function renderConsultationCta(prefix = './') {
  return `<section class="w-cta-band py-16 lg:py-24">
    <div class="w-cta-ribbon" aria-hidden="true">
      <svg viewBox="0 0 1440 360" preserveAspectRatio="none">
        <defs>
          <linearGradient id="wCtaPaintWave" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#0F4C3A" stop-opacity="0" />
            <stop offset="45%" stop-color="#196850" stop-opacity="0.7" />
            <stop offset="85%" stop-color="#D6AD45" stop-opacity="0.35" />
            <stop offset="100%" stop-color="#D6AD45" stop-opacity="0" />
          </linearGradient>
        </defs>
        <path d="M-40,295 C260,210 520,335 840,240 C1120,155 1290,220 1480,145 L1480,360 L-40,360 Z" fill="url(#wCtaPaintWave)" />
        <path d="M-40,295 C260,210 520,335 840,240 C1120,155 1290,220 1480,145" fill="none" stroke="#D6AD45" stroke-width="1.2" stroke-opacity="0.45" />
      </svg>
    </div>
    <div class="wanders-container relative z-10">
      <div class="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:gap-16 w-reveal">
        <div>
          <p class="w-eyebrow w-eyebrow--light"><span class="w-eyebrow-line"></span>Tư vấn chuyên sâu</p>
          <h2 class="w-section-title mt-5 max-w-[22ch] text-[#F6F3EC]">Bạn đang tìm màu sơn phù hợp cho công trình?</h2>
          <p class="mt-4 max-w-[48ch] text-[15.5px] leading-[1.75] text-[#F6F3EC]/80">Đội ngũ kỹ thuật WANDERS đồng hành lựa chọn sắc độ, hệ sơn lót và lớp phủ hoàn thiện phù hợp điều kiện ánh sáng và bề mặt công trình.</p>
        </div>
        <div class="flex flex-col gap-5 lg:items-end">
          <a class="w-btn w-btn-gold w-full sm:w-auto" href="${prefix}lien-he.html">
            <span>Nhận tư vấn ngay</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="w-btn-arrow h-4 w-4"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
          </a>
          <div class="text-[13px] leading-relaxed text-[#F6F3EC]/80 lg:text-right">
            <p>Hotline: <a href="tel:0937760688" class="font-semibold text-[#E8CA7A] hover:underline">0937.760.688</a></p>
            <p class="mt-0.5">Email: <a href="mailto:wanderspaint@gmail.com" class="text-[#F6F3EC] hover:text-[#E8CA7A] hover:underline">wanderspaint@gmail.com</a></p>
          </div>
        </div>
      </div>
    </div>
  </section>`;
}

function renderFooter(prefix = './') {
  const logoSrc = `${prefix}images/base44/a963c52b6_image.png`;
  return `<footer class="w-footer">
    <div class="wanders-container pt-16 pb-12 lg:pt-20 lg:pb-14">
      <div class="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr] lg:gap-10">
        <div>
          <div>
            <span class="w-footer-logo-badge">
              <img class="w-footer-logo" alt="Logo WANDERS" src="${logoSrc}">
            </span>
          </div>
          <p class="mt-6 max-w-[34ch] text-[13.5px] leading-relaxed text-[#F6F3EC]/70">Sơn trang trí và giải pháp màu sắc cho không gian sống hiện đại — mỗi bức tường, một dấu ấn riêng.</p>
          <p class="mt-5 text-[12.5px] leading-relaxed text-[#F6F3EC]/55">Lam Điền, Xã Quảng Bị, Thành phố Hà Nội</p>
        </div>

        <div>
          <p class="w-footer-heading">Menu</p>
          <ul class="mt-5 space-y-3">
            <li><a class="w-footer-link" href="${prefix}gioi-thieu.html">Giới thiệu</a></li>
            <li><a class="w-footer-link" href="${prefix}san-pham.html">Sản phẩm</a></li>
            <li><a class="w-footer-link" href="${prefix}bang-mau.html">Bảng màu</a></li>
            <li><a class="w-footer-link" href="${prefix}du-an.html">Dự án</a></li>
            <li><a class="w-footer-link" href="${prefix}lien-he.html">Liên hệ</a></li>
          </ul>
        </div>

        <div>
          <p class="w-footer-heading">Danh mục sản phẩm</p>
          <ul class="mt-5 space-y-3">
            <li><a class="w-footer-link" href="${prefix}san-pham/son-noi-that/index.html">Sơn nội thất</a></li>
            <li><a class="w-footer-link" href="${prefix}san-pham/son-ngoai-that/index.html">Sơn ngoại thất</a></li>
            <li><a class="w-footer-link" href="${prefix}san-pham/son-chong-tham/index.html">Sơn chống thấm</a></li>
            <li><a class="w-footer-link" href="${prefix}san-pham/son-lot/index.html">Sơn lót</a></li>
            <li><a class="w-footer-link" href="${prefix}san-pham/son-chong-nong/index.html">Sơn chống nóng</a></li>
            <li><a class="w-footer-link" href="${prefix}san-pham/san-pham-khac/index.html">Sản phẩm khác</a></li>
          </ul>
        </div>

        <div>
          <p class="w-footer-heading">Liên hệ</p>
          <ul class="mt-5 space-y-3 text-[13.5px] leading-relaxed">
            <li><span class="text-[#F6F3EC]/45 block text-[11px] uppercase tracking-[0.14em]">Hotline</span><a href="tel:0937760688" class="text-[#F6F3EC] font-medium hover:text-[#D6AD45] hover:underline">0937.760.688</a></li>
            <li><span class="text-[#F6F3EC]/45 block text-[11px] uppercase tracking-[0.14em]">Email</span><a href="mailto:wanderspaint@gmail.com" class="text-[#F6F3EC] hover:text-[#D6AD45] hover:underline">wanderspaint@gmail.com</a></li>
            <li><span class="text-[#F6F3EC]/45 block text-[11px] uppercase tracking-[0.14em]">Giờ làm việc</span><span class="text-[#F6F3EC]/80">Thứ Hai – Chủ Nhật: 08:00 – 18:00</span></li>
          </ul>
          <a class="mt-6 inline-flex items-center gap-2 border border-[#D6AD45]/55 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#E8CA7A] transition-colors duration-200 hover:bg-[#D6AD45] hover:text-[#073B2E]" href="${prefix}lien-he.html">Nhận tư vấn</a>
        </div>
      </div>

      <div class="mt-14 flex flex-col gap-3 border-t border-[#F6F3EC]/15 pt-7 text-[11.5px] text-[#F6F3EC]/50 sm:flex-row sm:items-center sm:justify-between">
        <p>© WANDERS. Deine Wand mal anders.</p>
        <p>Hotline: 0937.760.688 · Email: wanderspaint@gmail.com</p>
      </div>
    </div>
  </footer>`;
}

function renderMobileDrawer(prefix = './') {
  return `<div id="b44MobileMenuDrawer" class="fixed inset-x-0 top-[76px] z-40 hidden border-b border-[#E2DDD2] bg-[#F6F3EC] px-6 py-8 shadow-2xl transition-all duration-300 lg:hidden">
    <nav class="flex flex-col gap-5">
      <a class="text-[16px] font-medium text-[#273238] hover:text-[#073B2E]" href="${prefix}gioi-thieu.html">Giới thiệu</a>
      <a class="text-[16px] font-medium text-[#273238] hover:text-[#073B2E]" href="${prefix}san-pham.html">Sản phẩm</a>
      <a class="text-[16px] font-medium text-[#273238] hover:text-[#073B2E]" href="${prefix}bang-mau.html">Bảng màu</a>
      <a class="text-[16px] font-medium text-[#273238] hover:text-[#073B2E]" href="${prefix}du-an.html">Dự án</a>
      <a class="text-[16px] font-medium text-[#273238] hover:text-[#073B2E]" href="${prefix}lien-he.html">Liên hệ</a>
      <a class="w-btn w-btn-forest mt-3 justify-between" href="${prefix}lien-he.html">
        <span>Tư vấn chọn sơn</span>
        <span class="w-btn-arrow">→</span>
      </a>
    </nav>
  </div>`;
}

function renderCoreScripts(prefix = './', { includeIntro = false, extraScripts = [] } = {}) {
  const extras = extraScripts.map((s) => `  <script src="${prefix}assets/${s}"></script>`).join('\n');
  const introScript = includeIntro ? `\n  <script src="${prefix}assets/wanders-intro.js"></script>` : '';
  return `<script>
    document.addEventListener('DOMContentLoaded', () => {
      const menuBtn = document.querySelector('header button[aria-label="Mở menu"]');
      const drawer = document.getElementById('b44MobileMenuDrawer');
      if (menuBtn && drawer) {
        menuBtn.addEventListener('click', () => {
          drawer.classList.toggle('hidden');
        });
      }
    });
  </script>
${extras ? extras + '\n' : ''}  <script src="${prefix}assets/wanders_nav_dropdown.js"></script>
  <script src="${prefix}assets/wanders-motion.js"></script>${introScript}`;
}

module.exports = {
  escapeHtml,
  renderHead,
  renderHeader,
  renderConsultationCta,
  renderFooter,
  renderMobileDrawer,
  renderCoreScripts,
};

