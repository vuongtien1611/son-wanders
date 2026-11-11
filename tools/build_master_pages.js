/**
 * WANDERS MASTER REDESIGN BUILDER
 * Compiles:
 *   - index.html
 *   - gioi-thieu.html & gioi-thieu/index.html
 *   - san-pham.html & san-pham/index.html
 *   - du-an.html & du-an/index.html
 *   - lien-he.html & lien-he/index.html
 * All using the unified WANDERS Design System & Cinematic Motion System.
 */
const fs = require('fs');
const path = require('path');
const {
  escapeHtml,
  renderHead,
  renderHeader,
  renderConsultationCta,
  renderFooter,
  renderMobileDrawer,
  renderCoreScripts,
} = require('./wanders_layout');
const { PROJECTS } = require('./build_project_detail_pages');

const ROOT = path.resolve(__dirname, '../website_download');
const products = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/wanders_products.json'), 'utf8'));

function saveRootAndSubdir(rootFile, subFolder, buildFn) {
  fs.writeFileSync(path.join(ROOT, rootFile), buildFn('./'), 'utf8');
  console.log('Built:', rootFile);
  if (subFolder) {
    const dir = path.join(ROOT, subFolder);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), buildFn('../'), 'utf8');
    console.log('Built:', `${subFolder}/index.html`);
  }
}

function renderProductCard(p, prefix) {
  return `
      <a class="sp-product-card" href="${prefix}${escapeHtml(p.link)}" data-cat="${escapeHtml(p.category)}">
        <div class="wpc-top">
          <span class="wpc-code">${escapeHtml(p.code)}</span>
          <span class="wpc-badge">${escapeHtml(p.packaging || '5L & 18L')}</span>
        </div>
        <div class="wpc-media">
          <img src="${prefix}${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" class="wpc-img" decoding="async">
        </div>
        <div class="wpc-body">
          <p class="wpc-cat">${escapeHtml(p.categoryName || 'Sơn cao cấp')}</p>
          <h3 class="wpc-title">${escapeHtml(p.name)}</h3>
          <p class="wpc-desc">${escapeHtml(p.desc || '')}</p>
          <div class="wpc-footer">
            <span class="wpc-cta">
              <span>Xem chi tiết</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="wpc-cta-arrow">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </span>
          </div>
        </div>
      </a>`;
}

// ============================================================================
// 1. HOMEPAGE (index.html)
// ============================================================================
function buildHomepageHtml() {
  const prefix = './';

  // Curated 12 products across the 4 main categories so every tab displays a balanced row of 3-4 real WANDERS products
  const pickCodes = [
    'EX999', 'IN929', 'WATERPROOF-CT B5', 'LĐN 515',
    'EX777', 'EX555',
    'IN828', 'IN626', 'IN525',
    'WATERPROOF-CT B5 MÀU', 'XIKA BITUM', 'XIKA LASTIC',
    'CK919', 'CK818', 'PRIMER NANOTECH'
  ];
  const homeCatalogueProducts = pickCodes
    .map((code) => products.find((p) => p.code === code))
    .filter(Boolean);

  const featuredSet = new Set(['EX999', 'IN929', 'WATERPROOF-CT B5', 'LĐN 515']);

  const catalogueCardsHtml = homeCatalogueProducts
    .map((p) => {
      const isFeatured = featuredSet.has(p.code);
      return `
      <a class="sp-product-card home-cat-card" href="${prefix}${escapeHtml(p.link)}" data-cat="${escapeHtml(p.category)}" data-featured="${isFeatured ? '1' : '0'}"${isFeatured ? '' : ' style="display:none"'}>
        <div class="wpc-top">
          <span class="wpc-code">${escapeHtml(p.code)}</span>
          <span class="wpc-badge">${escapeHtml(p.packaging || '5L & 18L')}</span>
        </div>
        <div class="wpc-media">
          <img src="${prefix}${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" class="wpc-img" decoding="async">
        </div>
        <div class="wpc-body">
          <p class="wpc-cat">${escapeHtml(p.categoryName)}</p>
          <h3 class="wpc-title">${escapeHtml(p.name)}</h3>
          <p class="wpc-desc">${escapeHtml((p.desc || '').slice(0, 110))}</p>
          <div class="wpc-footer">
            <span class="wpc-cta">
              <span>Xem chi tiết</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="wpc-cta-arrow">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </span>
          </div>
        </div>
      </a>`;
    })
    .join('\n');

  const p0 = PROJECTS[0];
  const p1 = PROJECTS[1];
  const p2 = PROJECTS[2];

  return `<!DOCTYPE html>
<html lang="vi">
${renderHead({
  prefix,
  title: 'WANDERS — Sơn trang trí & Color Studio',
  description: 'Sơn trang trí và giải pháp màu sắc WANDERS cho không gian sống hiện đại — mỗi bức tường, một dấu ấn riêng.',
  ogImage: 'images/base44/2c9aa4c1c_generated_be64a0c2.png',
  canonicalPath: '',
  extraCss: ['wanders_product_card.css'],
  includeIntro: true,
})}
<body class="font-body antialiased">
  <div id="wanders-intro" class="wi-overlay" aria-hidden="true"></div>
  ${renderHeader(prefix, 'home')}

  <main>
    <!-- ============================================================ -->
    <!-- SECTION 1: CINEMATIC HERO (Synced with Intro Power Wipe)     -->
    <!-- ============================================================ -->
    <section class="w-hero-section">
      <div class="absolute inset-0">
        <span class="relative hero-zoom hidden h-full w-full object-cover sm:block" data-base44-image="" data-base44-image-src="./images/base44/2c9aa4c1c_generated_be64a0c2.png">
          <span class="block relative w-full h-full overflow-hidden">
            <img class="w-full h-full inset-0 absolute object-cover" alt="Biệt thự hiện đại với tường sơn trắng ngà và khối đất nung" src="./images/base44/2c9aa4c1c_generated_be64a0c2.png">
          </span>
        </span>
        <span class="inline-block relative hero-zoom h-full w-full object-cover sm:hidden" data-base44-image="" data-base44-image-src="./images/base44/373ede7be_generated_c18e3afd.png">
          <span class="block relative w-full h-full overflow-hidden">
            <img class="w-full h-full inset-0 absolute object-cover" alt="Mặt tiền biệt thự sơn trắng ngà dưới nắng sớm" src="./images/base44/373ede7be_generated_c18e3afd.png">
          </span>
        </span>
        <div class="w-hero-overlay"></div>
      </div>

      <div class="wanders-container relative z-10 flex min-h-[540px] flex-col justify-end pb-14 pt-28 sm:min-h-[620px] sm:pb-16 lg:min-h-[710px] lg:pb-20">
        <p class="w-eyebrow w-eyebrow--light w-hero-stagger w-hero-stagger--1">
          <span class="w-eyebrow-line"></span>WANDERS PAINT · DEINE WAND MAL ANDERS
        </p>
        <h1 class="w-hero-title mt-6 max-w-[14ch] text-white sm:max-w-[16ch] w-hero-stagger w-hero-stagger--2">
          Mỗi bức tường, một dấu ấn riêng.
        </h1>
        <p class="mt-6 max-w-[46ch] text-[15px] leading-[1.75] text-[#F6F3EC]/88 sm:text-[16px] w-hero-stagger w-hero-stagger--3">
          Khám phá những giải pháp sơn và cảm hứng màu sắc dành cho không gian sống hiện đại.
        </p>
        <div class="mt-9 flex flex-col gap-3.5 sm:flex-row sm:items-center w-hero-stagger w-hero-stagger--4">
          <a class="w-btn w-btn-gold" href="./bang-mau.html">
            <span>Khám phá bảng màu</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="w-btn-arrow h-4 w-4"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
          </a>
          <a class="w-btn w-btn-glass" href="./san-pham.html">
            <span>Xem sản phẩm</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="w-btn-arrow h-4 w-4"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
          </a>
        </div>
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- SECTION 2: COLOR EXPLORER (Warm Ivory #F6F3EC)               -->
    <!-- ============================================================ -->
    <section id="homeColorExplorer" class="border-t border-[#E2DDD2] w-bg-ivory py-20 lg:py-28">
      <div class="wanders-container">
        <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12 w-reveal">
          <div class="max-w-[640px]">
            <p class="w-eyebrow mb-4"><span class="w-eyebrow-line"></span>Color Explorer</p>
            <h2 class="w-section-title text-[#073B2E]">Khám phá màu sắc của riêng bạn</h2>
          </div>
          <p class="max-w-[400px] text-[15.5px] leading-[1.7] text-[#5A6468]">Tìm cảm hứng màu sắc phù hợp với phong cách và ánh sáng của từng không gian sống.</p>
        </div>

        <div class="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-[1.3fr_1fr] lg:gap-14 w-reveal">
          <div>
            <div class="w-explorer-frame">
              <span class="inline-block relative aspect-[4/3] w-full object-cover" data-base44-image="" data-base44-image-src="./images/ChatGPT Image Nov 11, 2026, 10_50_14 AM-1.png">
                <span class="block relative w-full h-full overflow-hidden">
                  <img class="w-full h-full inset-0 absolute object-cover object-center" alt="Biệt thự màu kem, beige phong cách Trung tính ấm (Warm Neutral)" src="./images/ChatGPT Image Nov 11, 2026, 10_50_14 AM-1.png">
                </span>
              </span>
              <div class="w-explorer-overlay flex items-end justify-between gap-4">
                <div>
                  <p class="text-[10.5px] font-medium uppercase tracking-[0.24em] text-[#E8CA7A]">Warm Neutral — Trung tính ấm</p>
                  <p class="mt-1.5 text-lg font-medium text-white">Cát ấm</p>
                </div>
                <div class="flex items-center gap-3 text-white">
                  <span class="h-9 w-9 rounded border border-white/60 shadow-sm" style="background-color:#DFD0B8"></span>
                  <span class="font-mono text-[11.5px] tracking-wide">#DFD0B8</span>
                </div>
              </div>
            </div>
            <p class="mt-4 text-[13px] leading-relaxed text-[#5A6468]">Hệ màu tham khảo gồm 120 mã tiêu chuẩn — khám phá đầy đủ mã màu và thông số HEX tại Color Studio.</p>
          </div>

          <div>
            <div class="border-y border-[#E2DDD2]" id="explorerGroupList">
              <button type="button" class="w-explorer-group-btn is-active">
                <span class="flex items-baseline gap-3">
                  <span class="font-mono text-[10.5px] text-[#D6AD45] font-semibold">01</span>
                  <span class="text-[15.5px]">Trung tính ấm</span>
                  <span class="hidden text-[10px] uppercase tracking-[0.16em] text-[#5A6468]/75 sm:inline">Warm Neutral</span>
                </span>
                <span class="flex shrink-0">
                  <span class="h-5 w-4 border border-[#273238]/15" style="background-color:#DFD0B8"></span>
                  <span class="h-5 w-4 border border-[#273238]/15" style="background-color:#CDB99C"></span>
                  <span class="h-5 w-4 border border-[#273238]/15" style="background-color:#B9A489"></span>
                  <span class="h-5 w-4 border border-[#273238]/15" style="background-color:#A78E72"></span>
                </span>
              </button>
              <button type="button" class="w-explorer-group-btn">
                <span class="flex items-baseline gap-3">
                  <span class="font-mono text-[10.5px] text-[#D6AD45] font-semibold">02</span>
                  <span class="text-[15.5px]">Tông đất</span>
                  <span class="hidden text-[10px] uppercase tracking-[0.16em] text-[#5A6468]/75 sm:inline">Earth Tone</span>
                </span>
                <span class="flex shrink-0">
                  <span class="h-5 w-4 border border-[#273238]/15" style="background-color:#C58A63"></span>
                  <span class="h-5 w-4 border border-[#273238]/15" style="background-color:#B1714B"></span>
                  <span class="h-5 w-4 border border-[#273238]/15" style="background-color:#95583A"></span>
                  <span class="h-5 w-4 border border-[#273238]/15" style="background-color:#7C4730"></span>
                </span>
              </button>
              <button type="button" class="w-explorer-group-btn">
                <span class="flex items-baseline gap-3">
                  <span class="font-mono text-[10.5px] text-[#D6AD45] font-semibold">03</span>
                  <span class="text-[15.5px]">Xanh xô thơm</span>
                  <span class="hidden text-[10px] uppercase tracking-[0.16em] text-[#5A6468]/75 sm:inline">Sage Green</span>
                </span>
                <span class="flex shrink-0">
                  <span class="h-5 w-4 border border-[#273238]/15" style="background-color:#B7BEA3"></span>
                  <span class="h-5 w-4 border border-[#273238]/15" style="background-color:#9DA787"></span>
                  <span class="h-5 w-4 border border-[#273238]/15" style="background-color:#83906F"></span>
                  <span class="h-5 w-4 border border-[#273238]/15" style="background-color:#6B7859"></span>
                </span>
              </button>
              <button type="button" class="w-explorer-group-btn">
                <span class="flex items-baseline gap-3">
                  <span class="font-mono text-[10.5px] text-[#D6AD45] font-semibold">04</span>
                  <span class="text-[15.5px]">Xanh hiện đại</span>
                  <span class="hidden text-[10px] uppercase tracking-[0.16em] text-[#5A6468]/75 sm:inline">Modern Blue</span>
                </span>
                <span class="flex shrink-0">
                  <span class="h-5 w-4 border border-[#273238]/15" style="background-color:#A2B4BB"></span>
                  <span class="h-5 w-4 border border-[#273238]/15" style="background-color:#8098A1"></span>
                  <span class="h-5 w-4 border border-[#273238]/15" style="background-color:#637C87"></span>
                  <span class="h-5 w-4 border border-[#273238]/15" style="background-color:#4C6470"></span>
                </span>
              </button>
              <button type="button" class="w-explorer-group-btn">
                <span class="flex items-baseline gap-3">
                  <span class="font-mono text-[10.5px] text-[#D6AD45] font-semibold">05</span>
                  <span class="text-[15.5px]">Trắng mềm</span>
                  <span class="hidden text-[10px] uppercase tracking-[0.16em] text-[#5A6468]/75 sm:inline">Soft White</span>
                </span>
                <span class="flex shrink-0">
                  <span class="h-5 w-4 border border-[#273238]/15" style="background-color:#F1ECE0"></span>
                  <span class="h-5 w-4 border border-[#273238]/15" style="background-color:#EBE4D5"></span>
                  <span class="h-5 w-4 border border-[#273238]/15" style="background-color:#E2DACB"></span>
                  <span class="h-5 w-4 border border-[#273238]/15" style="background-color:#D6CCBA"></span>
                </span>
              </button>
            </div>

            <div class="mt-7 grid grid-cols-4 gap-3" id="explorerSwatchGrid">
              <button type="button" aria-label="Chọn màu Trắng ngà" class="w-explorer-swatch" style="background-color:#F3EADB"></button>
              <button type="button" aria-label="Chọn màu Be cát" class="w-explorer-swatch" style="background-color:#EADFCB"></button>
              <button type="button" aria-label="Chọn màu Cát ấm" class="w-explorer-swatch is-selected" style="background-color:#DFD0B8"><span class="absolute inset-0 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 text-[#073B2E]"><path d="M20 6 9 17l-5-5"></path></svg></span></button>
              <button type="button" aria-label="Chọn màu Đá mật" class="w-explorer-swatch" style="background-color:#CDB99C"></button>
              <button type="button" aria-label="Chọn màu Hạt dẻ nhạt" class="w-explorer-swatch" style="background-color:#B9A489"></button>
              <button type="button" aria-label="Chọn màu Nâu tro" class="w-explorer-swatch" style="background-color:#A78E72"></button>
              <button type="button" aria-label="Chọn màu Nâu đất" class="w-explorer-swatch" style="background-color:#8C7660"></button>
              <button type="button" aria-label="Chọn màu Nâu cà phê" class="w-explorer-swatch" style="background-color:#6F5B49"></button>
            </div>

            <p id="explorerGroupDesc" class="mt-6 text-[14.5px] leading-[1.7] text-[#5A6468]">Tông be, ngà và cát ấm — nền tảng an toàn cho không gian sống nhiều ánh sáng tự nhiên.</p>
            <a class="w-text-link mt-7" href="./bang-mau.html">
              <span>Mở Color Studio</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- SECTION 3: PAINT COLLECTIONS (White #FFFFFF)                 -->
    <!-- ============================================================ -->
    <section class="w-bg-white py-20 lg:py-28">
      <div class="wanders-container">
        <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12 w-reveal">
          <div class="max-w-[640px]">
            <p class="w-eyebrow mb-4"><span class="w-eyebrow-line"></span>Paint Collections</p>
            <h2 class="w-section-title text-[#073B2E]">Giải pháp sơn cho mọi không gian</h2>
          </div>
          <p class="max-w-[400px] text-[15.5px] leading-[1.7] text-[#5A6468]">Sáu nhóm sản phẩm được tổ chức theo bề mặt và điều kiện sử dụng — từ lớp lót đến hoàn thiện ngoại thất.</p>
        </div>

        <div class="mt-12 grid gap-5 lg:mt-16 lg:grid-cols-12 w-reveal">
          <a class="w-arch-card group lg:col-span-7" href="./san-pham/son-noi-that/index.html">
            <span class="inline-block relative w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] aspect-[4/3]">
              <span class="block relative w-full h-full overflow-hidden">
                <img class="w-full h-full inset-0 absolute object-cover" alt="Sơn nội thất" src="./images/base44/7f7b7d76e_generated_2a17cf56.png">
              </span>
            </span>
            <div class="w-arch-card-overlay"></div>
            <div class="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
              <div>
                <h3 class="font-semibold text-white text-xl sm:text-2xl">Sơn nội thất</h3>
                <p class="mt-2 max-w-[38ch] text-[13.5px] leading-relaxed text-[#F6F3EC]/85">Bề mặt mờ mịn, dễ vệ sinh cho phòng khách, phòng ngủ và khu vực sinh hoạt.</p>
              </div>
              <span class="w-arch-card-arrow">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg>
              </span>
            </div>
          </a>

          <a class="w-arch-card group lg:col-span-5 lg:mt-12" href="./san-pham/son-ngoai-that/index.html">
            <span class="inline-block relative w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] aspect-[4/3]">
              <span class="block relative w-full h-full overflow-hidden">
                <img class="w-full h-full inset-0 absolute object-cover" alt="Sơn ngoại thất" src="./images/base44/85e7f93c0_generated_2df1c9b3.png">
              </span>
            </span>
            <div class="w-arch-card-overlay"></div>
            <div class="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
              <div>
                <h3 class="font-semibold text-white text-xl sm:text-2xl">Sơn ngoại thất</h3>
                <p class="mt-2 max-w-[38ch] text-[13.5px] leading-relaxed text-[#F6F3EC]/85">Lớp phủ giữ màu bền vững cho tường ngoài, ban công và mặt tiền.</p>
              </div>
              <span class="w-arch-card-arrow">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg>
              </span>
            </div>
          </a>
        </div>

        <div class="mt-5 grid grid-cols-2 gap-5 lg:grid-cols-4 w-reveal w-reveal-delay-1">
          <a class="w-arch-card group" href="./san-pham/son-chong-tham/index.html">
            <span class="inline-block relative w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] aspect-[3/4]">
              <span class="block relative w-full h-full overflow-hidden">
                <img class="w-full h-full inset-0 absolute object-cover" alt="Sơn chống thấm" src="./images/base44/5d10e1c6d_generated_213965c5.png">
              </span>
            </span>
            <div class="w-arch-card-overlay"></div>
            <div class="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
              <h3 class="font-semibold text-white text-[16px]">Sơn chống thấm</h3>
              <span class="w-arch-card-arrow">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg>
              </span>
            </div>
          </a>

          <a class="w-arch-card group" href="./san-pham/son-lot/index.html">
            <span class="inline-block relative w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] aspect-[3/4]">
              <span class="block relative w-full h-full overflow-hidden">
                <img class="w-full h-full inset-0 absolute object-cover" alt="Sơn lót" src="./images/base44/7f6a476c9_generated_9cbd24f3.png">
              </span>
            </span>
            <div class="w-arch-card-overlay"></div>
            <div class="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
              <h3 class="font-semibold text-white text-[16px]">Sơn lót</h3>
              <span class="w-arch-card-arrow">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg>
              </span>
            </div>
          </a>

          <a class="w-arch-card group" href="./san-pham/son-chong-nong/index.html">
            <span class="inline-block relative w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] aspect-[3/4]">
              <span class="block relative w-full h-full overflow-hidden">
                <img class="w-full h-full inset-0 absolute object-cover" alt="Sơn chống nóng" src="./images/base44/11ef022d2_generated_ea4a85fa.png">
              </span>
            </span>
            <div class="w-arch-card-overlay"></div>
            <div class="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
              <h3 class="font-semibold text-white text-[16px]">Sơn chống nóng</h3>
              <span class="w-arch-card-arrow">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg>
              </span>
            </div>
          </a>

          <a class="w-arch-card group" href="./san-pham/san-pham-khac/index.html">
            <span class="inline-block relative w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] aspect-[3/4]">
              <span class="block relative w-full h-full overflow-hidden">
                <img class="w-full h-full inset-0 absolute object-cover" alt="Sản phẩm khác" src="./images/base44/f8b86d905_generated_509a0b06.png">
              </span>
            </span>
            <div class="w-arch-card-overlay"></div>
            <div class="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
              <h3 class="font-semibold text-white text-[16px]">Sản phẩm khác</h3>
              <span class="w-arch-card-arrow">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg>
              </span>
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- SECTION 4: SẢN PHẨM WANDERS NỔI BẬT (Warm Ivory #F6F3EC)     -->
    <!-- ============================================================ -->
    <section id="homeCatalogueSection" class="border-t border-[#E2DDD2] w-bg-ivory py-20 lg:py-28">
      <div class="wanders-container">
        <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12 w-reveal">
          <div class="max-w-[640px]">
            <p class="w-eyebrow mb-4"><span class="w-eyebrow-line"></span>Catalogue</p>
            <h2 class="w-section-title text-[#073B2E]">Sản phẩm WANDERS nổi bật</h2>
          </div>
          <div class="flex flex-col gap-3 md:items-end">
            <p class="max-w-[400px] text-[15px] leading-[1.7] text-[#5A6468]">Danh mục sản phẩm WANDERS chính thức theo bề mặt thi công và công năng bảo vệ.</p>
            <a class="w-text-link" href="./san-pham.html">
              <span>Xem tất cả ${products.length} sản phẩm</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            </a>
          </div>
        </div>

        <div class="mt-9 flex flex-wrap items-center gap-x-2 gap-y-2 border-b border-[#E2DDD2] pb-1 w-reveal" id="homeCatalogueTabs">
          <button type="button" data-filter="featured" class="relative px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.14em] transition-colors duration-200 text-[#073B2E]">Nổi bật<span class="absolute inset-x-0 -bottom-1 h-[2px] bg-[#D6AD45] transition-opacity duration-200 opacity-100"></span></button>
          <button type="button" data-filter="son-ngoai-that" class="relative px-4 py-3 text-[12px] font-medium uppercase tracking-[0.14em] transition-colors duration-200 text-[#5A6468] hover:text-[#073B2E]">Sơn ngoại thất<span class="absolute inset-x-0 -bottom-1 h-[2px] bg-[#D6AD45] transition-opacity duration-200 opacity-0"></span></button>
          <button type="button" data-filter="son-noi-that" class="relative px-4 py-3 text-[12px] font-medium uppercase tracking-[0.14em] transition-colors duration-200 text-[#5A6468] hover:text-[#073B2E]">Sơn nội thất<span class="absolute inset-x-0 -bottom-1 h-[2px] bg-[#D6AD45] transition-opacity duration-200 opacity-0"></span></button>
          <button type="button" data-filter="chong-tham" class="relative px-4 py-3 text-[12px] font-medium uppercase tracking-[0.14em] transition-colors duration-200 text-[#5A6468] hover:text-[#073B2E]">Sơn chống thấm<span class="absolute inset-x-0 -bottom-1 h-[2px] bg-[#D6AD45] transition-opacity duration-200 opacity-0"></span></button>
          <button type="button" data-filter="son-lot" class="relative px-4 py-3 text-[12px] font-medium uppercase tracking-[0.14em] transition-colors duration-200 text-[#5A6468] hover:text-[#073B2E]">Sơn lót<span class="absolute inset-x-0 -bottom-1 h-[2px] bg-[#D6AD45] transition-opacity duration-200 opacity-0"></span></button>
        </div>

        <div class="mt-9 wanders-products-grid w-reveal" id="homeCatalogueGrid">
          ${catalogueCardsHtml}
        </div>
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- SECTION 5: LIVING WITH COLOUR (White #FFFFFF)                -->
    <!-- ============================================================ -->
    <section id="homeLivingSection" class="w-bg-white py-20 lg:py-28">
      <div class="wanders-container">
        <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12 w-reveal">
          <div class="max-w-[640px]">
            <p class="w-eyebrow mb-4"><span class="w-eyebrow-line"></span>Living with colour</p>
            <h2 class="w-section-title text-[#073B2E]">Màu sắc thay đổi không gian sống</h2>
          </div>
          <p class="max-w-[400px] text-[15.5px] leading-[1.7] text-[#5A6468]">Bốn hướng phối màu cho bốn cách sống khác nhau — chọn một phong cách để xem bảng màu gợi ý.</p>
        </div>

        <div class="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-[1.4fr_1fr] lg:gap-14 w-reveal">
          <div class="w-explorer-frame">
            <span class="inline-block relative aspect-[4/3] w-full object-cover lg:aspect-[3/2]">
              <span class="block relative w-full h-full overflow-hidden">
                <img id="livingStyleImg" class="w-full h-full inset-0 absolute object-cover transition-all duration-500" alt="Không gian minh hoạ phong cách Tối giản hiện đại" src="./images/base44/edf841af7_generated_77536f0e.png">
              </span>
            </span>
            <div class="w-explorer-overlay">
              <p id="livingStyleSub" class="text-[10.5px] font-medium uppercase tracking-[0.24em] text-[#E8CA7A]">Modern Minimal</p>
              <p id="livingStyleTitle" class="mt-1.5 text-lg font-medium text-white sm:text-xl">Tối giản hiện đại</p>
            </div>
          </div>

          <div class="flex flex-col">
            <div class="flex flex-wrap gap-2" id="livingStyleTabs">
              <button type="button" class="w-filter-pill is-active px-4 py-2.5 text-[11.5px] font-semibold uppercase tracking-[0.12em]">Tối giản hiện đại</button>
              <button type="button" class="w-filter-pill px-4 py-2.5 text-[11.5px] font-medium uppercase tracking-[0.12em]">Sống ấm</button>
              <button type="button" class="w-filter-pill px-4 py-2.5 text-[11.5px] font-medium uppercase tracking-[0.12em]">Cảm hứng thiên nhiên</button>
              <button type="button" class="w-filter-pill px-4 py-2.5 text-[11.5px] font-medium uppercase tracking-[0.12em]">Sang trọng đương đại</button>
            </div>

            <p id="livingStyleDesc" class="mt-8 text-[15.5px] leading-[1.8] text-[#273238]/88">Bề mặt sáng, ít chi tiết, đường nét kiến trúc được giữ lại làm nhân vật chính. Một sắc nhấn duy nhất đủ để căn phòng có điểm dừng.</p>

            <div class="mt-8">
              <p class="text-[10.5px] font-semibold uppercase tracking-[0.24em] text-[#073B2E]">Bảng phối màu gợi ý</p>
              <div class="mt-4 flex gap-1.5" id="livingPaletteBlocks">
                <div class="flex-1"><div class="h-20 w-full rounded border border-[#273238]/12" style="background-color:#EDE7DC"></div><p class="mt-2 font-mono text-[10.5px] text-[#5A6468]">#EDE7DC</p></div>
                <div class="flex-1"><div class="h-20 w-full rounded border border-[#273238]/12" style="background-color:#D6CDBE"></div><p class="mt-2 font-mono text-[10.5px] text-[#5A6468]">#D6CDBE</p></div>
                <div class="flex-1"><div class="h-20 w-full rounded border border-[#273238]/12" style="background-color:#283235"></div><p class="mt-2 font-mono text-[10.5px] text-[#5A6468]">#283235</p></div>
                <div class="flex-1"><div class="h-20 w-full rounded border border-[#273238]/12" style="background-color:#C56E4F"></div><p class="mt-2 font-mono text-[10.5px] text-[#5A6468]">#C56E4F</p></div>
              </div>
            </div>

            <p class="mt-8 border-t border-[#E2DDD2] pt-5 text-[12.5px] leading-relaxed text-[#5A6468]">Gợi ý phối màu theo bốn phong cách kiến trúc — sử dụng Color Studio để tra cứu mã màu chi tiết.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- SECTION 6: ABOUT WANDERS (Deep Forest Green Brand Story)     -->
    <!-- ============================================================ -->
    <section class="w-forest-story py-20 lg:py-24">
      <div class="wanders-container relative z-10">
        <div class="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16">
          <div class="order-2 lg:order-1 w-reveal">
            <p class="w-eyebrow w-eyebrow--light"><span class="w-eyebrow-line"></span>About Wanders</p>
            <h2 class="w-section-title mt-5 text-[#F6F3EC]">Khám phá WANDERS</h2>
            <div class="w-gold-rule mt-5"></div>
            <p class="mt-6 max-w-[52ch] text-[15.5px] leading-[1.85] text-[#F6F3EC]/82">WANDERS bắt đầu từ một ý niệm đơn giản: màu sơn không phải lớp phủ cuối cùng của công trình, mà là vật liệu định hình cảm giác sống bên trong nó. Chúng tôi xây dựng danh mục sản phẩm theo bề mặt và điều kiện khí hậu, song song với một hệ thống màu sắc có thể sử dụng từ phác thảo thiết kế đến công trình hoàn thiện.</p>
            <a class="w-btn w-btn-glass mt-9" href="./gioi-thieu.html">
              <span>Về WANDERS</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" class="w-btn-arrow h-4 w-4"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            </a>
          </div>
          <div class="order-1 lg:order-2 w-reveal w-reveal-delay-1">
            <div class="overflow-hidden rounded-[10px] border border-[#D6AD45]/25">
              <span class="inline-block relative aspect-[16/10] w-full object-cover">
                <span class="block relative w-full h-full overflow-hidden">
                  <img class="w-full h-full inset-0 absolute object-cover w-reveal-img" alt="Không gian colour studio với hệ mẫu màu trung tính" src="./images/base44/f87fca256_generated_6e727af7.png">
                </span>
              </span>
            </div>
            <div class="mt-3 flex items-center justify-between gap-4 border-t border-[#F6F3EC]/18 pt-3.5 text-[11px] uppercase tracking-[0.2em] text-[#E8CA7A]/80">
              <span>Colour Studio</span>
              <span>WANDERS Paint</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- SECTION 7: PROJECT JOURNAL (Warm Ivory #F6F3EC)              -->
    <!-- ============================================================ -->
    <section class="w-bg-ivory py-20 lg:py-28">
      <div class="wanders-container">
        <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12 w-reveal">
          <div class="max-w-[640px]">
            <p class="w-eyebrow mb-4"><span class="w-eyebrow-line"></span>Project Journal</p>
            <h2 class="w-section-title text-[#073B2E]">Không gian &amp; Công trình WANDERS</h2>
          </div>
          <p class="max-w-[400px] text-[15.5px] leading-[1.7] text-[#5A6468]">Ghi chép về vật liệu, ánh sáng và cách một bảng màu đi vào đời sống của kiến trúc.</p>
        </div>

        <div class="mt-12 grid gap-5 lg:mt-16 lg:grid-cols-12 w-reveal">
          <a class="w-arch-card group lg:col-span-7" href="./du-an/${p0.slug}/index.html">
            <span class="inline-block relative w-full h-full min-h-[300px] object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] aspect-[4/3]">
              <span class="block relative w-full h-full overflow-hidden">
                <img class="w-full h-full inset-0 absolute object-cover" alt="${escapeHtml(p0.title)}" src="./images/base44/${p0.heroImage}">
              </span>
            </span>
            <div class="w-arch-card-overlay"></div>
            <span class="absolute left-4 top-4 rounded border border-[#F6F3EC]/30 bg-[#073B2E]/70 px-2.5 py-1 text-[9.5px] uppercase tracking-[0.16em] text-[#F6F3EC] backdrop-blur-sm">Phối cảnh định hướng</span>
            <div class="absolute inset-x-0 bottom-0 p-6 pt-16">
              <p class="text-[10.5px] uppercase tracking-[0.22em] text-[#E8CA7A]">${escapeHtml(p0.category)}</p>
              <div class="mt-2 flex items-end justify-between gap-4">
                <div>
                  <h3 class="font-semibold text-white text-xl sm:text-[26px]">${escapeHtml(p0.title)}</h3>
                  <p class="mt-2 max-w-[40ch] text-[13.5px] leading-relaxed text-[#F6F3EC]/82">${escapeHtml(p0.excerpt)}</p>
                </div>
                <span class="w-arch-card-arrow">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg>
                </span>
              </div>
            </div>
          </a>

          <div class="grid gap-5 lg:col-span-5">
            <a class="w-arch-card group" href="./du-an/${p1.slug}/index.html">
              <span class="inline-block relative w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] aspect-[16/10]">
                <span class="block relative w-full h-full overflow-hidden">
                  <img class="w-full h-full inset-0 absolute object-cover" alt="${escapeHtml(p1.title)}" src="./images/base44/${p1.heroImage}">
                </span>
              </span>
              <div class="w-arch-card-overlay"></div>
              <span class="absolute left-4 top-4 rounded border border-[#F6F3EC]/30 bg-[#073B2E]/70 px-2.5 py-1 text-[9.5px] uppercase tracking-[0.16em] text-[#F6F3EC] backdrop-blur-sm">Phối cảnh định hướng</span>
              <div class="absolute inset-x-0 bottom-0 p-5 pt-16 sm:p-6">
                <p class="text-[10px] uppercase tracking-[0.22em] text-[#E8CA7A]">${escapeHtml(p1.category)}</p>
                <div class="mt-2 flex items-end justify-between gap-4">
                  <h3 class="font-semibold text-white text-[18px]">${escapeHtml(p1.title)}</h3>
                  <span class="w-arch-card-arrow">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg>
                  </span>
                </div>
              </div>
            </a>

            <a class="w-arch-card group" href="./du-an/${p2.slug}/index.html">
              <span class="inline-block relative w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] aspect-[16/10]">
                <span class="block relative w-full h-full overflow-hidden">
                  <img class="w-full h-full inset-0 absolute object-cover" alt="${escapeHtml(p2.title)}" src="./images/base44/${p2.heroImage}">
                </span>
              </span>
              <div class="w-arch-card-overlay"></div>
              <span class="absolute left-4 top-4 rounded border border-[#F6F3EC]/30 bg-[#073B2E]/70 px-2.5 py-1 text-[9.5px] uppercase tracking-[0.16em] text-[#F6F3EC] backdrop-blur-sm">Phối cảnh định hướng</span>
              <div class="absolute inset-x-0 bottom-0 p-5 pt-16 sm:p-6">
                <p class="text-[10px] uppercase tracking-[0.22em] text-[#E8CA7A]">${escapeHtml(p2.category)}</p>
                <div class="mt-2 flex items-end justify-between gap-4">
                  <h3 class="font-semibold text-white text-[18px]">${escapeHtml(p2.title)}</h3>
                  <span class="w-arch-card-arrow">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg>
                  </span>
                </div>
              </div>
            </a>
          </div>
        </div>

        <div class="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-reveal">
          <p class="text-[12.5px] leading-relaxed text-[#5A6468]">Phối cảnh minh họa tham khảo định hướng màu sắc và vật liệu cho từng loại hình kiến trúc.</p>
          <a class="w-text-link shrink-0" href="./du-an.html">
            <span>Xem tất cả dự án</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
          </a>
        </div>
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- SECTION 8: WHY WANDERS (White #FFFFFF)                       -->
    <!-- ============================================================ -->
    <section class="border-t border-[#E2DDD2] w-bg-white py-20 lg:py-28">
      <div class="wanders-container">
        <div class="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
          <div class="relative overflow-hidden rounded-[10px] bg-[#E8E2D5] w-reveal">
            <span class="inline-block relative aspect-[4/5] w-full object-cover">
              <span class="block relative w-full h-full overflow-hidden">
                <img class="w-full h-full inset-0 absolute object-cover w-reveal-img" alt="Thi công sơn lên bề mặt tường kiến trúc" src="./images/base44/b61550fbc_generated_9d16c57c.png">
              </span>
            </span>
          </div>
          <div class="w-reveal w-reveal-delay-1">
            <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-10">
              <div class="max-w-[460px]">
                <p class="w-eyebrow mb-4"><span class="w-eyebrow-line"></span>Why Wanders</p>
                <h2 class="w-section-title text-[#073B2E]">Giá trị tạo nên WANDERS</h2>
              </div>
              <p class="max-w-[360px] text-[15px] leading-[1.7] text-[#5A6468]">Một thương hiệu sơn được xây từ ba việc: chọn đúng màu, đúng lớp và đúng người đồng hành.</p>
            </div>
            <ol class="mt-9 divide-y divide-[#E2DDD2] border-t border-[#E2DDD2]">
              <li class="flex gap-5 py-6">
                <span class="mt-1 font-mono text-[11.5px] font-bold text-[#D6AD45]">01</span>
                <div>
                  <h3 class="text-[16px] font-semibold leading-snug text-[#073B2E]">Chọn màu cùng không gian thật</h3>
                  <p class="mt-2 text-[14.5px] leading-[1.7] text-[#5A6468]">Tư vấn màu dựa trên hướng sáng, vật liệu và thói quen sinh hoạt của từng không gian, thay vì một bảng màu chung.</p>
                </div>
              </li>
              <li class="flex gap-5 py-6">
                <span class="mt-1 font-mono text-[11.5px] font-bold text-[#D6AD45]">02</span>
                <div>
                  <h3 class="text-[16px] font-semibold leading-snug text-[#073B2E]">Hệ sản phẩm đồng bộ</h3>
                  <p class="mt-2 text-[14.5px] leading-[1.7] text-[#5A6468]">Từ xử lý bề mặt, lớp lót đến lớp phủ hoàn thiện — các lớp sơn được chọn để làm việc cùng nhau.</p>
                </div>
              </li>
              <li class="flex gap-5 py-6">
                <span class="mt-1 font-mono text-[11.5px] font-bold text-[#D6AD45]">03</span>
                <div>
                  <h3 class="text-[16px] font-semibold leading-snug text-[#073B2E]">Định hướng cho khí hậu Việt Nam</h3>
                  <p class="mt-2 text-[14.5px] leading-[1.7] text-[#5A6468]">Danh mục sản phẩm được tổ chức theo nắng mưa và độ ẩm đặc trưng của từng vùng công trình.</p>
                </div>
              </li>
              <li class="flex gap-5 py-6">
                <span class="mt-1 font-mono text-[11.5px] font-bold text-[#D6AD45]">04</span>
                <div>
                  <h3 class="text-[16px] font-semibold leading-snug text-[#073B2E]">Đồng hành từ thiết kế đến thi công</h3>
                  <p class="mt-2 text-[14.5px] leading-[1.7] text-[#5A6468]">Hỗ trợ hồ sơ màu, mẫu thử và hướng dẫn thi công cho kiến trúc sư và đội ngũ công trình.</p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- SECTION 9: CONSULTATION CTA (Scene 04 Deep Forest Green)     -->
    <!-- ============================================================ -->
    ${renderConsultationCta(prefix)}
  </main>

  ${renderFooter(prefix)}
  ${renderMobileDrawer(prefix)}

  <script>
    document.addEventListener('DOMContentLoaded', () => {
      // 1. Color Explorer Switching (5 groups + 8 pure HEX swatches + staggered fade)
      const expSection = document.getElementById('homeColorExplorer');
      if (expSection) {
        const groupButtons = Array.from(document.querySelectorAll('#explorerGroupList button[type="button"]'));
        const swatchGrid = document.getElementById('explorerSwatchGrid');
        const swatchButtons = swatchGrid ? Array.from(swatchGrid.querySelectorAll('button[type="button"]')) : [];
        const imgContainer = expSection.querySelector('.w-explorer-frame');
        const outerSpan = imgContainer ? imgContainer.querySelector('[data-base44-image]') : null;
        const primaryImg = imgContainer ? imgContainer.querySelector('img') : null;
        const imgWrap = primaryImg ? primaryImg.parentElement : null;
        const subtitle = imgContainer ? imgContainer.querySelector('.w-explorer-overlay p:first-child') : null;
        const colorName = imgContainer ? imgContainer.querySelector('.w-explorer-overlay p:last-child') : null;
        const colorBox = imgContainer ? imgContainer.querySelector('.w-explorer-overlay span[style*="background-color"]') : null;
        const colorHex = imgContainer ? imgContainer.querySelector('.w-explorer-overlay span.font-mono') : null;
        const descEl = document.getElementById('explorerGroupDesc');

        const groups = [
          {
            name: 'Warm Neutral — Trung tính ấm',
            alt: 'Biệt thự màu kem, beige phong cách Trung tính ấm (Warm Neutral)',
            desc: 'Tông be, ngà và cát ấm — nền tảng an toàn cho không gian sống nhiều ánh sáng tự nhiên.',
            img: './images/ChatGPT Image Nov 11, 2026, 10_50_14 AM-1.png',
            swatches: [
              { name: 'Trắng ngà', hex: '#F3EADB' },
              { name: 'Be cát', hex: '#EADFCB' },
              { name: 'Cát ấm', hex: '#DFD0B8' },
              { name: 'Đá mật', hex: '#CDB99C' },
              { name: 'Hạt dẻ nhạt', hex: '#B9A489' },
              { name: 'Nâu tro', hex: '#A78E72' },
              { name: 'Nâu đất', hex: '#8C7660' },
              { name: 'Nâu cà phê', hex: '#6F5B49' }
            ]
          },
          {
            name: 'Earth Tone — Tông đất',
            alt: 'Biệt thự màu đất nung, terracotta phong cách Tông đất (Earth Tone)',
            desc: 'Sắc đất nung, hổ phách và nâu sẫm mang đến chiều sâu mộc mạc, ấm áp cho kiến trúc.',
            img: './images/ChatGPT Image Nov 11, 2026, 10_50_16 AM-2.png',
            swatches: [
              { name: 'Cát sa mạc', hex: '#EADFCB' },
              { name: 'Đất nung nhạt', hex: '#D7A48C' },
              { name: 'Ánh đất nung', hex: '#C58A63' },
              { name: 'Hổ phách cháy', hex: '#B1714B' },
              { name: 'Đất đỏ bazan', hex: '#95583A' },
              { name: 'Nâu gạch mộc', hex: '#7C4730' },
              { name: 'Hạt dẻ nướng', hex: '#6F5443' },
              { name: 'Nâu sẫm', hex: '#4A3528' }
            ]
          },
          {
            name: 'Sage Green — Xanh xô thơm',
            alt: 'Biệt thự màu xanh sage phong cách Xanh xô thơm (Sage Green)',
            desc: 'Gam xanh thảo mộc dịu mắt tạo cảm giác thư giãn, cân bằng cho phòng ngủ và không gian nghỉ ngơi.',
            img: './images/ChatGPT Image Nov 11, 2026, 10_50_17 AM-3.png',
            swatches: [
              { name: 'Sương ban mai', hex: '#E8EDE0' },
              { name: 'Sương xô thơm', hex: '#CFD8C2' },
              { name: 'Xô thơm mộc', hex: '#B7BEA3' },
              { name: 'Thảo mộc dịu', hex: '#9DA787' },
              { name: 'Lá ô-liu', hex: '#83906F' },
              { name: 'Rêu Bắc Âu', hex: '#6B7859' },
              { name: 'Thông xanh', hex: '#556145' },
              { name: 'Rừng trầm', hex: '#3F4A33' }
            ]
          },
          {
            name: 'Modern Blue — Xanh hiện đại',
            alt: 'Biệt thự màu xanh lam, xanh ghi phong cách Xanh hiện đại (Modern Blue)',
            desc: 'Sắc xanh dương pha ghi thanh lịch, giữ sự tỉnh táo và thoáng đãng cho phòng làm việc.',
            img: './images/ChatGPT Image Nov 11, 2026, 10_50_19 AM-4.png',
            swatches: [
              { name: 'Sương biển', hex: '#D9E4E8' },
              { name: 'Xanh băng nhạt', hex: '#C3D3D9' },
              { name: 'Gió biển mờ', hex: '#A2B4BB' },
              { name: 'Biển sương mai', hex: '#8098A1' },
              { name: 'Xanh thép', hex: '#637C87' },
              { name: 'Chàm hiện đại', hex: '#4C6470' },
              { name: 'Biển đêm', hex: '#344954' },
              { name: 'Xanh than sâu', hex: '#24343D' }
            ]
          },
          {
            name: 'Soft White — Trắng mềm',
            alt: 'Biệt thự màu trắng ngà, ivory phong cách Trắng mềm (Soft White)',
            desc: 'Các sắc trắng ấm và trắng ngà tinh khiết giúp khuếch tán ánh sáng tự nhiên mềm mại.',
            img: './images/ChatGPT Image Nov 11, 2026, 10_50_21 AM-5.png',
            swatches: [
              { name: 'Trắng sứ ấm', hex: '#FAF8F3' },
              { name: 'Trắng ngọc trai', hex: '#F6F3EC' },
              { name: 'Trắng ngà', hex: '#F1ECE0' },
              { name: 'Kem lanh', hex: '#EBE4D5' },
              { name: 'Sứ mịn', hex: '#E2DACB' },
              { name: 'Be phấn nhẹ', hex: '#D6CCBA' },
              { name: 'Đá phấn ấm', hex: '#C9BEB0' },
              { name: 'Ghi đá sáng', hex: '#BDB4A6' }
            ]
          }
        ];

        const preloaded = {};
        groups.forEach((g) => {
          const pre = new Image();
          pre.decoding = 'async';
          pre.src = g.img;
          preloaded[g.img] = pre;
        });

        let currentImgSrc = groups[0].img;
        let switchTimer = null;
        let switchSeq = 0;

        function swapExplorerImage(nextSrc, nextAlt) {
          if (!primaryImg) return;
          if (outerSpan) outerSpan.setAttribute('data-base44-image-src', nextSrc);
          if (nextSrc === currentImgSrc) {
            primaryImg.alt = nextAlt || primaryImg.alt;
            return;
          }
          const seq = ++switchSeq;
          const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          const prevSrc = currentImgSrc;
          currentImgSrc = nextSrc;

          const applyTransition = () => {
            if (seq !== switchSeq) return;
            primaryImg.removeAttribute('srcset');
            if (switchTimer) {
              clearTimeout(switchTimer);
              switchTimer = null;
            }
            if (reduced) {
              if (imgWrap) imgWrap.style.backgroundImage = '';
              primaryImg.style.transition = 'none';
              primaryImg.style.opacity = '1';
              primaryImg.style.transform = 'scale(1)';
              primaryImg.src = nextSrc;
              primaryImg.alt = nextAlt || '';
              return;
            }
            if (imgWrap && prevSrc) {
              imgWrap.style.backgroundImage = 'url("' + encodeURI(prevSrc) + '")';
              imgWrap.style.backgroundSize = 'cover';
              imgWrap.style.backgroundPosition = 'center';
            }
            primaryImg.style.transition = 'none';
            primaryImg.style.opacity = '0';
            primaryImg.style.transform = 'scale(1.025)';
            primaryImg.style.objectPosition = 'center center';
            primaryImg.src = nextSrc;
            primaryImg.alt = nextAlt || '';
            void primaryImg.offsetWidth;
            requestAnimationFrame(() => {
              if (seq !== switchSeq) return;
              primaryImg.style.transition = 'opacity 440ms cubic-bezier(0.22, 1, 0.36, 1), transform 480ms cubic-bezier(0.22, 1, 0.36, 1)';
              primaryImg.style.opacity = '1';
              primaryImg.style.transform = 'scale(1)';
              switchTimer = setTimeout(() => {
                if (seq === switchSeq && imgWrap) {
                  imgWrap.style.backgroundImage = '';
                }
              }, 500);
            });
          };

          const cached = preloaded[nextSrc];
          if (cached && cached.complete && cached.naturalWidth > 0) {
            applyTransition();
          } else {
            const loader = cached || new Image();
            loader.addEventListener('load', applyTransition, { once: true });
            loader.addEventListener('error', applyTransition, { once: true });
            if (!cached) {
              loader.src = nextSrc;
              preloaded[nextSrc] = loader;
            }
          }
        }

        function getCheckColor(hex) {
          const c = hex.replace('#', '');
          const r = parseInt(c.substr(0, 2), 16);
          const g = parseInt(c.substr(2, 2), 16);
          const b = parseInt(c.substr(4, 2), 16);
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          return lum > 155 ? '#073B2E' : '#FFFFFF';
        }

        let activeGroup = groups[0];

        function selectSwatch(sIdx) {
          const sw = activeGroup.swatches[sIdx] || activeGroup.swatches[0];
          const chkColor = getCheckColor(sw.hex);
          const checkHtml = '<span class="absolute inset-0 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="' + chkColor + '" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5"><path d="M20 6 9 17l-5-5"></path></svg></span>';
          swatchButtons.forEach((b, i) => {
            b.innerHTML = i === sIdx ? checkHtml : '';
            b.classList.toggle('is-selected', i === sIdx);
          });
          if (colorName) colorName.textContent = sw.name;
          if (colorHex) colorHex.textContent = sw.hex;
          if (colorBox) colorBox.style.backgroundColor = sw.hex;
        }

        groupButtons.forEach((btn, idx) => {
          btn.addEventListener('click', () => {
            groupButtons.forEach((b) => b.classList.remove('is-active'));
            btn.classList.add('is-active');

            activeGroup = groups[idx] || groups[0];
            if (subtitle) subtitle.textContent = activeGroup.name;
            if (descEl) descEl.textContent = activeGroup.desc;
            swapExplorerImage(activeGroup.img, activeGroup.alt);

            const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            swatchButtons.forEach((sb, sIdx) => {
              const sw = activeGroup.swatches[sIdx];
              if (sw) {
                sb.style.backgroundColor = sw.hex;
                sb.setAttribute('aria-label', 'Chọn màu ' + sw.name);
                if (!reduced) {
                  sb.classList.remove('is-stagger');
                  sb.style.animationDelay = (sIdx * 28) + 'ms';
                  void sb.offsetWidth;
                  sb.classList.add('is-stagger');
                }
              }
            });
            selectSwatch(2);
          });
        });

        swatchButtons.forEach((sb, sIdx) => {
          sb.addEventListener('click', () => selectSwatch(sIdx));
        });
      }

      // 2. Catalogue Tab Switching
      const catTabs = Array.from(document.querySelectorAll('#homeCatalogueTabs button[type="button"]'));
      const catCards = Array.from(document.querySelectorAll('#homeCatalogueGrid .home-cat-card'));
      if (catTabs.length && catCards.length) {
        catTabs.forEach((tab) => {
          tab.addEventListener('click', () => {
            catTabs.forEach((t) => {
              t.classList.remove('text-[#073B2E]', 'font-semibold');
              t.classList.add('text-[#5A6468]', 'font-medium');
              const bar = t.querySelector('span');
              if (bar) bar.classList.replace('opacity-100', 'opacity-0');
            });
            tab.classList.add('text-[#073B2E]', 'font-semibold');
            tab.classList.remove('text-[#5A6468]', 'font-medium');
            const activeBar = tab.querySelector('span');
            if (activeBar) activeBar.classList.replace('opacity-0', 'opacity-100');

            const filter = tab.getAttribute('data-filter') || 'featured';
            catCards.forEach((card) => {
              const show = filter === 'featured'
                ? card.getAttribute('data-featured') === '1'
                : card.getAttribute('data-cat') === filter;
              card.style.display = show ? '' : 'none';
            });
          });
        });
      }

      // 3. Living with Colour Tabs
      const livingTabs = Array.from(document.querySelectorAll('#livingStyleTabs button[type="button"]'));
      const livingImg = document.getElementById('livingStyleImg');
      const livingTitle = document.getElementById('livingStyleTitle');
      const livingSub = document.getElementById('livingStyleSub');
      const livingDesc = document.getElementById('livingStyleDesc');
      const livingBlocks = Array.from(document.querySelectorAll('#livingPaletteBlocks > div'));

      const styles = [
        {
          subtitle: 'Modern Minimal',
          title: 'Tối giản hiện đại',
          img: './images/base44/edf841af7_generated_77536f0e.png',
          desc: 'Bề mặt sáng, ít chi tiết, đường nét kiến trúc được giữ lại làm nhân vật chính. Một sắc nhấn duy nhất đủ để căn phòng có điểm dừng.',
          palette: ['#EDE7DC', '#D6CDBE', '#283235', '#C56E4F']
        },
        {
          subtitle: 'Warm Living',
          title: 'Sống ấm',
          img: './images/base44/8099d7d28_generated_8abc6bed.png',
          desc: 'Bảng màu cát ấm, kem lanh và gỗ tự nhiên giúp không gian tiếp khách giữ được sự gần gũi, dễ chịu suốt cả ngày.',
          palette: ['#F3EADB', '#DFD0B8', '#A78E72', '#6F5B49']
        },
        {
          subtitle: 'Nature Inspired',
          title: 'Cảm hứng thiên nhiên',
          img: './images/base44/7f7b7d76e_generated_2a17cf56.png',
          desc: 'Sự kết hợp giữa xanh xô thơm dịu mát và trắng ngà mang hơi thở vườn cây vào không gian nghỉ ngơi yên tĩnh.',
          palette: ['#F1ECE0', '#CFD8C2', '#9DA787', '#556145']
        },
        {
          subtitle: 'Contemporary Luxury',
          title: 'Sang trọng đương đại',
          img: './images/base44/0cff00e0d_generated_6094395e.png',
          desc: 'Đối thoại tương phản giữa trắng ngà, ghi đá sâu và đất nung trầm tạo nên diện mạo tinh tế cho biệt thự và căn hộ cao cấp.',
          palette: ['#F1ECE0', '#C58A63', '#4C585C', '#283235']
        }
      ];

      if (livingTabs.length) {
        livingTabs.forEach((tab, idx) => {
          tab.addEventListener('click', () => {
            livingTabs.forEach((t) => t.classList.remove('is-active', 'font-semibold'));
            tab.classList.add('is-active', 'font-semibold');

            const s = styles[idx] || styles[0];
            if (livingTitle) livingTitle.textContent = s.title;
            if (livingSub) livingSub.textContent = s.subtitle;
            if (livingDesc) livingDesc.textContent = s.desc;
            if (livingImg) {
              livingImg.style.opacity = '0.6';
              livingImg.src = s.img;
              requestAnimationFrame(() => { livingImg.style.opacity = '1'; });
            }
            livingBlocks.forEach((blk, pIdx) => {
              const hex = s.palette[pIdx];
              if (!hex) return;
              const box = blk.querySelector('div');
              const hexTxt = blk.querySelector('p');
              if (box) box.style.backgroundColor = hex;
              if (hexTxt) hexTxt.textContent = hex;
            });
          });
        });
      }
    });
  </script>
  ${renderCoreScripts(prefix, { includeIntro: true })}
</body>
</html>`;
}

// ============================================================================
// 2. GIOI-THIEU (gioi-thieu.html & gioi-thieu/index.html)
// ============================================================================
function buildGioiThieuHtml(prefix) {
  return `<!DOCTYPE html>
<html lang="vi">
${renderHead({
  prefix,
  title: 'Giới thiệu WANDERS — Deine Wand mal anders',
  description: 'Khám phá WANDERS: định hướng màu sắc, định hướng sản phẩm và giải pháp sơn kiến trúc hiện đại.',
  ogImage: 'images/base44/2c9aa4c1c_generated_be64a0c2.png',
  canonicalPath: 'gioi-thieu.html',
})}
<body class="font-body antialiased">
  ${renderHeader(prefix, 'gioi-thieu')}

  <main>
    <section class="w-hero-section">
      <div class="absolute inset-0">
        <span class="inline-block relative h-full w-full object-cover">
          <span class="block relative w-full h-full overflow-hidden">
            <img class="w-full h-full inset-0 absolute object-cover" alt="Khám phá WANDERS" src="${prefix}images/base44/f87fca256_generated_6e727af7.png">
          </span>
        </span>
        <div class="w-subhero-overlay"></div>
      </div>
      <div class="wanders-container relative z-10 flex flex-col justify-end pb-14 pt-24 min-h-[400px] lg:min-h-[480px]">
        <p class="w-eyebrow w-eyebrow--light w-hero-stagger w-hero-stagger--1"><span class="w-eyebrow-line"></span>About Wanders</p>
        <h1 class="w-subhero-title mt-5 max-w-[24ch] text-white w-hero-stagger w-hero-stagger--2">Khám phá WANDERS</h1>
        <p class="mt-4 max-w-[54ch] text-[15px] leading-[1.75] text-[#F6F3EC]/85 sm:text-[16px] w-hero-stagger w-hero-stagger--3">Một thương hiệu sơn được xây quanh ý niệm: màu sắc là vật liệu định hình cảm giác sống, không chỉ là lớp phủ cuối cùng.</p>
      </div>
    </section>

    <!-- Editorial Story Block (Warm Ivory #F6F3EC) -->
    <section class="w-bg-ivory py-16 lg:py-24">
      <div class="wanders-container">
        <div class="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 w-reveal">
          <div>
            <p class="w-eyebrow"><span class="w-eyebrow-line"></span>Câu chuyện</p>
            <h2 class="w-section-title mt-5 text-[#073B2E]">Bắt đầu từ một bức tường</h2>
            <div class="w-gold-rule mt-5"></div>
          </div>
          <div class="space-y-5 text-[15.5px] leading-[1.85] text-[#273238]/88">
            <p>WANDERS ra đời từ quan sát đơn giản: rất nhiều công trình được thiết kế rất kỹ ở phần hình khối, nhưng lại quyết định màu sơn vào phút cuối. Chúng tôi muốn đưa việc chọn màu trở lại đúng vị trí của nó — một bước thiết kế, không phải một bước mua vật tư.</p>
            <p>Vì vậy website này được tổ chức quanh màu sắc trước, sản phẩm sau. Mỗi nhóm màu đi kèm bối cảnh sử dụng, mỗi sản phẩm đi kèm vai trò trong cấu tạo bề mặt. Tagline gốc <em>Deine Wand mal anders</em> — "bức tường của bạn, một cách khác" — là tiêu chí cho mọi lựa chọn thiết kế.</p>
          </div>
        </div>

        <div class="mt-14 grid gap-6 sm:grid-cols-2 w-reveal w-reveal-delay-1">
          <figure>
            <div class="overflow-hidden rounded-[10px] border border-[#E2DDD2] bg-[#E8E2D5]">
              <span class="inline-block relative aspect-[4/3] w-full object-cover">
                <span class="block relative w-full h-full overflow-hidden">
                  <img class="w-full h-full inset-0 absolute object-cover w-reveal-img" alt="Không gian colour studio với hệ mẫu màu" src="${prefix}images/base44/f87fca256_generated_6e727af7.png">
                </span>
              </span>
            </div>
            <figcaption class="mt-3.5 flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-[#5A6468]">
              <span class="font-semibold text-[#073B2E]">Colour studio</span>
              <span>Không gian trưng bày màu sắc</span>
            </figcaption>
          </figure>
          <figure>
            <div class="overflow-hidden rounded-[10px] border border-[#E2DDD2] bg-[#E8E2D5]">
              <span class="inline-block relative aspect-[4/3] w-full object-cover">
                <span class="block relative w-full h-full overflow-hidden">
                  <img class="w-full h-full inset-0 absolute object-cover w-reveal-img" alt="Khu vực pha màu trong phòng thí nghiệm" src="${prefix}images/base44/91ce1fd3b_generated_b88649b8.png">
                </span>
              </span>
            </div>
            <figcaption class="mt-3.5 flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-[#5A6468]">
              <span class="font-semibold text-[#073B2E]">Khu pha màu</span>
              <span>Kiểm định sắc độ chuẩn</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>

    <!-- Brand Pillars (White #FFFFFF) -->
    <section class="border-t border-[#E2DDD2] w-bg-white py-16 lg:py-24">
      <div class="wanders-container">
        <div class="w-reveal">
          <p class="w-eyebrow"><span class="w-eyebrow-line"></span>Định hướng chất lượng</p>
          <h2 class="w-section-title mt-4 text-[#073B2E]">Ba trụ cột thiết kế và vật liệu</h2>
        </div>

        <div class="mt-10 grid gap-8 border-t border-[#E2DDD2] pt-10 md:grid-cols-3 md:gap-10 w-reveal w-reveal-delay-1">
          <div>
            <p class="font-mono text-[11.5px] font-bold text-[#D6AD45]">01</p>
            <h3 class="mt-3 text-[18px] font-semibold text-[#073B2E]">Định hướng màu sắc</h3>
            <p class="mt-3 text-[14.5px] leading-[1.75] text-[#5A6468]">Xây dựng một hệ màu có thể sử dụng xuyên suốt từ phác thảo thiết kế, mẫu thử tại công trình đến lớp phủ hoàn thiện.</p>
          </div>
          <div>
            <p class="font-mono text-[11.5px] font-bold text-[#D6AD45]">02</p>
            <h3 class="mt-3 text-[18px] font-semibold text-[#073B2E]">Định hướng sản phẩm</h3>
            <p class="mt-3 text-[14.5px] leading-[1.75] text-[#5A6468]">Danh mục được tổ chức theo bề mặt và điều kiện khí hậu, để mỗi lớp sơn có một vai trò rõ ràng trong cấu tạo tường.</p>
          </div>
          <div>
            <p class="font-mono text-[11.5px] font-bold text-[#D6AD45]">03</p>
            <h3 class="mt-3 text-[18px] font-semibold text-[#073B2E]">Định hướng hợp tác</h3>
            <p class="mt-3 text-[14.5px] leading-[1.75] text-[#5A6468]">Làm việc cùng kiến trúc sư, đơn vị thi công và nhà phân phối nhằm giữ đúng màu và đúng kỹ thuật tại công trình.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Brand Material Focus Band (Deep Forest Green Accent) -->
    <section class="w-forest-story py-16 lg:py-20">
      <div class="wanders-container">
        <div class="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16 w-reveal">
          <div>
            <p class="w-eyebrow w-eyebrow--light"><span class="w-eyebrow-line"></span>Tiêu chuẩn ứng dụng</p>
            <h2 class="w-section-title mt-4 text-[#F6F3EC]">Màu sắc chuẩn xác trên từng lớp vật liệu</h2>
            <div class="w-gold-rule mt-5"></div>
            <p class="mt-5 max-w-[54ch] text-[15.5px] leading-[1.8] text-[#F6F3EC]/82">Từ hệ Color Studio 120 mã chuẩn đến 24 dòng sơn chuyên biệt cho nội thất, ngoại thất, chống thấm và chống nóng — mọi cấu phần đều hướng đến độ bền màu và chiều sâu thẩm mỹ lâu dài.</p>
          </div>
          <div class="flex flex-col gap-3.5 sm:flex-row lg:justify-end">
            <a class="w-btn w-btn-gold" href="${prefix}bang-mau.html">
              <span>Tra cứu Color Studio</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="w-btn-arrow h-4 w-4"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            </a>
            <a class="w-btn w-btn-glass" href="${prefix}san-pham.html">
              <span>Xem 24 sản phẩm</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="w-btn-arrow h-4 w-4"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Warm Ivory Consultation Strip before Footer or direct CTA -->
    <section class="w-bg-ivory py-14 lg:py-16">
      <div class="wanders-container flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between w-reveal">
        <div>
          <p class="w-eyebrow"><span class="w-eyebrow-line"></span>Đồng hành công trình</p>
          <p class="mt-3 text-[16px] font-medium text-[#073B2E]">Liên hệ trực tiếp để nhận tư vấn chọn sơn, định mức thi công và mẫu màu thực tế.</p>
        </div>
        <div class="flex flex-wrap items-center gap-4 shrink-0">
          <a href="tel:0937760688" class="text-[14px] font-semibold text-[#073B2E] hover:text-[#0F4C3A]">Hotline: 0937.760.688</a>
          <a class="w-btn w-btn-forest" href="${prefix}lien-he.html">
            <span>Liên hệ tư vấn</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="w-btn-arrow"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
          </a>
        </div>
      </div>
    </section>
  </main>

  ${renderFooter(prefix)}
  ${renderMobileDrawer(prefix)}
  ${renderCoreScripts(prefix)}
</body>
</html>`;
}

// ============================================================================
// 3. SAN-PHAM (san-pham.html & san-pham/index.html)
// ============================================================================
function buildSanPhamHtml(prefix) {
  const categoryTiles = [
    { label: 'Sơn nội thất', img: '7f7b7d76e_generated_2a17cf56.png' },
    { label: 'Sơn ngoại thất', img: '85e7f93c0_generated_2df1c9b3.png' },
    { label: 'Sơn chống thấm', img: '5d10e1c6d_generated_213965c5.png' },
    { label: 'Sơn lót', img: '7f6a476c9_generated_9cbd24f3.png' },
    { label: 'Sơn chống nóng', img: '11ef022d2_generated_ea4a85fa.png' },
    { label: 'Sản phẩm khác', img: 'f8b86d905_generated_509a0b06.png' },
  ];

  const tilesHtml = categoryTiles
    .map(
      (t) => `
      <button type="button" class="group relative overflow-hidden rounded-[8px] text-left transition-all duration-300">
        <span class="inline-block relative aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]">
          <span class="block relative w-full h-full overflow-hidden">
            <img class="w-full h-full inset-0 absolute object-cover" alt="${escapeHtml(t.label)}" src="${prefix}images/base44/${t.img}">
          </span>
        </span>
        <span class="absolute inset-0 bg-gradient-to-t from-[#073B2E]/90 via-[#073B2E]/25 to-transparent"></span>
        <span class="absolute inset-x-3 bottom-3 text-[11.5px] font-semibold uppercase leading-tight tracking-[0.1em] text-white">${escapeHtml(t.label)}</span>
      </button>`
    )
    .join('\n');

  const cardsHtml = products.map((p) => renderProductCard(p, prefix)).join('\n');

  return `<!DOCTYPE html>
<html lang="vi">
${renderHead({
  prefix,
  title: 'Sản phẩm — WANDERS',
  description: `Danh mục ${products.length} dòng sơn WANDERS chính thức: sơn nội thất, ngoại thất, chống thấm, sơn lót, sơn chống nóng và sản phẩm chuyên dụng.`,
  ogImage: 'images/base44/85e7f93c0_generated_2df1c9b3.png',
  canonicalPath: 'san-pham.html',
  extraCss: ['wanders_product_card.css'],
})}
<body class="font-body antialiased">
  ${renderHeader(prefix, 'san-pham')}

  <main>
    <section class="w-hero-section">
      <div class="absolute inset-0">
        <span class="inline-block relative h-full w-full object-cover">
          <span class="block relative w-full h-full overflow-hidden">
            <img class="w-full h-full inset-0 absolute object-cover" alt="Sản phẩm WANDERS" src="${prefix}images/base44/85e7f93c0_generated_2df1c9b3.png">
          </span>
        </span>
        <div class="w-subhero-overlay"></div>
      </div>
      <div class="wanders-container relative z-10 flex flex-col justify-end pb-14 pt-24 min-h-[380px] lg:min-h-[460px]">
        <p class="w-eyebrow w-eyebrow--light w-hero-stagger w-hero-stagger--1"><span class="w-eyebrow-line"></span>Paint Collections</p>
        <h1 class="w-subhero-title mt-5 max-w-[24ch] text-white w-hero-stagger w-hero-stagger--2">Sản phẩm WANDERS</h1>
        <p class="mt-4 max-w-[54ch] text-[15px] leading-[1.7] text-[#F6F3EC]/85 sm:text-[16px] w-hero-stagger w-hero-stagger--3">Danh mục ${products.length} dòng sản phẩm WANDERS chính thức được tổ chức theo bề mặt thi công và điều kiện sử dụng.</p>
      </div>
    </section>

    <section class="w-bg-ivory py-16 lg:py-20">
      <div class="wanders-container">
        <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between w-reveal">
          <div>
            <p class="w-eyebrow"><span class="w-eyebrow-line"></span>Sáu nhóm sản phẩm</p>
            <h2 class="w-section-title mt-3 text-[#073B2E]">Chọn theo bề mặt thi công</h2>
          </div>
          <button type="button" id="btnAllProducts" class="w-filter-pill is-active self-start px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em]">Tất cả sản phẩm</button>
        </div>

        <div class="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6 w-reveal" id="productCatTiles">
          ${tilesHtml}
        </div>

        <div class="mt-14 border-t border-[#E2DDD2] pt-10">
          <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between w-reveal">
            <div>
              <div class="flex flex-wrap items-center gap-4">
                <h2 id="productsSectionTitle" class="w-section-title text-[#073B2E]">Tất cả sản phẩm</h2>
                <p id="productsCountLabel" class="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#0F4C3A]">${products.length} sản phẩm</p>
              </div>
              <p class="mt-2 max-w-[62ch] text-[14.5px] leading-[1.7] text-[#5A6468]">Danh mục đầy đủ các nhóm sơn và sản phẩm phụ trợ chính thức của WANDERS.</p>
            </div>
            <div class="w-full lg:w-[360px]">
              <input id="productSearchInput" type="search" aria-label="Tìm kiếm sản phẩm" placeholder="Tìm tên hoặc mã sản phẩm (VD: IN525, EX9000)..." class="w-full rounded-[6px] border border-[#E2DDD2] bg-white px-4 py-3 text-[13.5px] text-[#273238] outline-none transition-colors placeholder:text-[#5A6468]/60 focus:border-[#073B2E]">
            </div>
          </div>

          <div class="mt-10 wanders-products-grid" id="allProductsGrid">
            ${cardsHtml}
          </div>

          <div id="productsEmptyState" class="hidden rounded-[10px] border border-[#E2DDD2] bg-white px-6 py-12 text-center mt-8">
            <p class="text-[15.5px] font-medium text-[#073B2E]">Không tìm thấy sản phẩm phù hợp với từ khoá tìm kiếm.</p>
            <button type="button" id="btnResetProductSearch" class="w-btn w-btn-forest mt-4">Hiển thị toàn bộ ${products.length} sản phẩm</button>
          </div>
        </div>
      </div>
    </section>

    ${renderConsultationCta(prefix)}
  </main>

  ${renderFooter(prefix)}
  ${renderMobileDrawer(prefix)}

  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const allBtn = document.getElementById('btnAllProducts');
      const tileBtns = Array.from(document.querySelectorAll('#productCatTiles button[type="button"]'));
      const cards = Array.from(document.querySelectorAll('#allProductsGrid .sp-product-card'));
      const searchInput = document.getElementById('productSearchInput');
      const countEl = document.getElementById('productsCountLabel');
      const titleEl = document.getElementById('productsSectionTitle');
      const emptyEl = document.getElementById('productsEmptyState');
      const resetEmptyBtn = document.getElementById('btnResetProductSearch');

      const catLabels = {
        'all': 'Tất cả sản phẩm',
        'son-noi-that': 'Sơn nội thất',
        'son-ngoai-that': 'Sơn ngoại thất',
        'chong-tham': 'Sơn chống thấm',
        'son-lot': 'Sơn lót',
        'son-chong-nong': 'Sơn chống nóng',
        'san-pham-khac': 'Sản phẩm khác'
      };

      const nhomMap = {
        'noi-that': 'son-noi-that',
        'ngoai-that': 'son-ngoai-that',
        'chong-tham': 'chong-tham',
        'son-lot': 'son-lot',
        'chong-nong': 'son-chong-nong',
        'khac': 'san-pham-khac'
      };

      let activeCat = 'all';
      let searchQuery = '';

      function applyFilter() {
        const q = searchQuery.trim().toLowerCase();
        let visible = 0;

        cards.forEach((card) => {
          const cat = card.getAttribute('data-cat');
          const catOk = activeCat === 'all' || cat === activeCat;
          const text = (card.textContent + ' ' + (card.getAttribute('href') || '')).toLowerCase();
          const searchOk = !q || text.includes(q);
          const show = catOk && searchOk;
          card.style.display = show ? '' : 'none';
          if (show) visible++;
        });

        if (countEl) countEl.textContent = visible + ' sản phẩm';
        if (titleEl) titleEl.textContent = catLabels[activeCat] || 'Tất cả sản phẩm';
        if (emptyEl) emptyEl.classList.toggle('hidden', visible > 0);

        if (allBtn) {
          allBtn.classList.toggle('is-active', activeCat === 'all');
        }

        tileBtns.forEach((btn) => {
          const label = btn.textContent.trim().toLowerCase();
          const matchedCat = Object.entries(catLabels).find(([k, v]) => k !== 'all' && label.includes(v.toLowerCase()))?.[0];
          const isSelected = matchedCat && matchedCat === activeCat;
          btn.style.outline = isSelected ? '2.5px solid #D6AD45' : '';
          btn.style.outlineOffset = isSelected ? '2px' : '';
        });
      }

      if (allBtn) {
        allBtn.addEventListener('click', () => {
          activeCat = 'all';
          applyFilter();
        });
      }

      tileBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          const text = btn.innerText.toLowerCase();
          let target = 'all';
          if (text.includes('nội thất')) target = 'son-noi-that';
          else if (text.includes('ngoại thất')) target = 'son-ngoai-that';
          else if (text.includes('chống thấm')) target = 'chong-tham';
          else if (text.includes('lót')) target = 'son-lot';
          else if (text.includes('chống nóng')) target = 'son-chong-nong';
          else if (text.includes('khác')) target = 'san-pham-khac';
          activeCat = target;
          applyFilter();
        });
      });

      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          searchQuery = e.target.value || '';
          applyFilter();
        });
      }

      if (resetEmptyBtn) {
        resetEmptyBtn.addEventListener('click', () => {
          activeCat = 'all';
          searchQuery = '';
          if (searchInput) searchInput.value = '';
          applyFilter();
        });
      }

      const urlParams = new URLSearchParams(window.location.search);
      const nhom = urlParams.get('nhom');
      if (nhom) {
        activeCat = nhomMap[nhom] || nhom;
        applyFilter();
        const gridEl = document.getElementById('allProductsGrid');
        if (gridEl) {
          setTimeout(() => gridEl.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
        }
      } else {
        applyFilter();
      }
    });
  </script>
  ${renderCoreScripts(prefix)}
</body>
</html>`;
}

// ============================================================================
// 4. DU-AN (du-an.html & du-an/index.html)
// ============================================================================
function buildDuAnHtml(prefix, isSubdir) {
  const linkPrefix = isSubdir ? './' : './du-an/';
  const cardsHtml = PROJECTS.map((p, idx) => {
    const isLead = idx === 0;
    const spanClass = isLead ? 'lg:col-span-2' : '';
    const aspectClass = isLead ? 'aspect-[16/10]' : (idx === 1 ? 'aspect-[4/3] lg:aspect-auto lg:h-full' : 'aspect-[4/3]');
    return `
      <a class="w-arch-card group ${spanClass}${idx === 1 ? ' lg:min-h-full' : ''}" href="${linkPrefix}${p.slug}/index.html" data-proj-cat="${escapeHtml(p.category)}">
        <span class="inline-block relative w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03] ${aspectClass}">
          <span class="block relative w-full h-full overflow-hidden">
            <img class="w-full h-full inset-0 absolute object-cover" alt="${escapeHtml(p.title)}" src="${prefix}images/base44/${p.heroImage}">
          </span>
        </span>
        <div class="w-arch-card-overlay"></div>
        <span class="absolute left-4 top-4 rounded border border-[#F6F3EC]/30 bg-[#073B2E]/70 px-2.5 py-1 text-[9.5px] uppercase tracking-[0.16em] text-[#F6F3EC] backdrop-blur-sm">Phối cảnh định hướng</span>
        <div class="absolute inset-x-0 bottom-0 p-6 pt-16">
          <p class="text-[10.5px] uppercase tracking-[0.22em] text-[#E8CA7A]">${escapeHtml(p.category)}</p>
          <div class="mt-2 flex items-end justify-between gap-4">
            <h2 class="font-semibold text-white text-[19px] sm:text-[22px]">${escapeHtml(p.title)}</h2>
            <span class="w-arch-card-arrow">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg>
            </span>
          </div>
        </div>
      </a>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="vi">
${renderHead({
  prefix,
  title: 'Dự án & Công trình — WANDERS',
  description: 'Ghi chép về vật liệu, ánh sáng và cách một bảng màu WANDERS đi vào đời sống của kiến trúc.',
  ogImage: 'images/base44/0cff00e0d_generated_6094395e.png',
  canonicalPath: 'du-an.html',
})}
<body class="font-body antialiased">
  ${renderHeader(prefix, 'du-an')}

  <main>
    <section class="w-hero-section">
      <div class="absolute inset-0">
        <span class="inline-block relative h-full w-full object-cover">
          <span class="block relative w-full h-full overflow-hidden">
            <img class="w-full h-full inset-0 absolute object-cover" alt="Dự án &amp; Công trình" src="${prefix}images/base44/0cff00e0d_generated_6094395e.png">
          </span>
        </span>
        <div class="w-subhero-overlay"></div>
      </div>
      <div class="wanders-container relative z-10 flex flex-col justify-end pb-14 pt-24 min-h-[380px] lg:min-h-[460px]">
        <p class="w-eyebrow w-eyebrow--light w-hero-stagger w-hero-stagger--1"><span class="w-eyebrow-line"></span>Project Journal</p>
        <h1 class="w-subhero-title mt-5 max-w-[24ch] text-white w-hero-stagger w-hero-stagger--2">Dự án &amp; Công trình</h1>
        <p class="mt-4 max-w-[54ch] text-[15px] leading-[1.7] text-[#F6F3EC]/85 sm:text-[16px] w-hero-stagger w-hero-stagger--3">Những không gian được ghi lại theo cách chúng ta nhìn màu sắc: ánh sáng, vật liệu và bề mặt tường.</p>
      </div>
    </section>

    <section class="w-bg-ivory py-14 lg:py-20">
      <div class="wanders-container">
        <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between w-reveal">
          <div class="no-scrollbar -mx-6 flex gap-2 overflow-x-auto px-6 md:mx-0 md:px-0" id="projectFilterBar">
            <button type="button" class="w-filter-pill is-active shrink-0 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em]">Tất cả</button>
            <button type="button" class="w-filter-pill shrink-0 px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.12em]">Nhà ở</button>
            <button type="button" class="w-filter-pill shrink-0 px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.12em]">Căn hộ</button>
            <button type="button" class="w-filter-pill shrink-0 px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.12em]">Thương mại</button>
            <button type="button" class="w-filter-pill shrink-0 px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.12em]">Văn phòng</button>
          </div>
          <p id="projectCountLabel" class="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#073B2E]">${PROJECTS.length} phối cảnh</p>
        </div>

        <div class="mt-10 grid gap-6 lg:grid-cols-3 w-reveal" id="projectsGrid">
          ${cardsHtml}
        </div>

        <p class="mt-10 max-w-[80ch] text-[12.5px] leading-relaxed text-[#5A6468]">Hình ảnh minh họa định hướng màu sắc &amp; bề mặt kiến trúc WANDERS (phối cảnh tham khảo, phân biệt với ảnh công trình thực tế sau khi xác nhận nghiệm thu).</p>
      </div>
    </section>

    ${renderConsultationCta(prefix)}
  </main>

  ${renderFooter(prefix)}
  ${renderMobileDrawer(prefix)}

  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const filterButtons = Array.from(document.querySelectorAll('#projectFilterBar button[type="button"]'));
      const projectCards = Array.from(document.querySelectorAll('#projectsGrid [data-proj-cat]'));
      const countEl = document.getElementById('projectCountLabel');

      filterButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
          const selected = btn.textContent.trim();
          filterButtons.forEach((b) => {
            b.classList.toggle('is-active', b === btn);
            b.classList.toggle('font-semibold', b === btn);
          });
          let visible = 0;
          projectCards.forEach((card) => {
            const cat = card.getAttribute('data-proj-cat') || '';
            const show = selected === 'Tất cả' || cat === selected;
            card.style.display = show ? '' : 'none';
            if (show) visible++;
          });
          if (countEl) countEl.textContent = visible + ' phối cảnh';
        });
      });
    });
  </script>
  ${renderCoreScripts(prefix)}
</body>
</html>`;
}

// ============================================================================
// 5. LIEN-HE (lien-he.html & lien-he/index.html)
// ============================================================================
function buildLienHeHtml(prefix) {
  return `<!DOCTYPE html>
<html lang="vi">
${renderHead({
  prefix,
  title: 'Liên hệ — WANDERS',
  description: 'Liên hệ WANDERS: Hotline 0937.760.688, Email wanderspaint@gmail.com, Lam Điền, Xã Quảng Bị, Thành phố Hà Nội.',
  ogImage: 'images/base44/2c9aa4c1c_generated_be64a0c2.png',
  canonicalPath: 'lien-he.html',
})}
<body class="font-body antialiased">
  ${renderHeader(prefix, 'lien-he')}

  <main>
    <section class="w-hero-section">
      <div class="absolute inset-0">
        <span class="inline-block relative h-full w-full object-cover">
          <span class="block relative w-full h-full overflow-hidden">
            <img class="w-full h-full inset-0 absolute object-cover" alt="Liên hệ WANDERS" src="${prefix}images/base44/f87fca256_generated_6e727af7.png">
          </span>
        </span>
        <div class="w-subhero-overlay"></div>
      </div>
      <div class="wanders-container relative z-10 flex flex-col justify-end pb-12 pt-24 min-h-[290px] lg:min-h-[360px]">
        <p class="w-eyebrow w-eyebrow--light w-hero-stagger w-hero-stagger--1"><span class="w-eyebrow-line"></span>Contact</p>
        <h1 class="w-subhero-title mt-4 max-w-[24ch] text-white w-hero-stagger w-hero-stagger--2">Liên hệ WANDERS</h1>
        <p class="mt-4 max-w-[54ch] text-[15px] leading-[1.7] text-[#F6F3EC]/85 sm:text-[16px] w-hero-stagger w-hero-stagger--3">Gửi nhu cầu tư vấn màu sắc và sản phẩm. WANDERS sẽ phản hồi trong giờ làm việc.</p>
      </div>
    </section>

    <section class="w-bg-ivory py-16 lg:py-24">
      <div class="wanders-container">
        <div class="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
          <div class="w-reveal">
            <p class="w-eyebrow"><span class="w-eyebrow-line"></span>Thông tin liên hệ</p>
            <dl class="mt-6 divide-y divide-[#E2DDD2] border-y border-[#E2DDD2]">
              <div class="py-4">
                <dt class="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[#5A6468]">Hotline</dt>
                <dd class="mt-2 text-[15.5px] font-semibold text-[#073B2E]"><a href="tel:0937760688" class="hover:underline">0937.760.688</a></dd>
              </div>
              <div class="py-4">
                <dt class="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[#5A6468]">Email</dt>
                <dd class="mt-2 text-[15.5px] text-[#273238]"><a href="mailto:wanderspaint@gmail.com" class="hover:text-[#073B2E] hover:underline">wanderspaint@gmail.com</a></dd>
              </div>
              <div class="py-4">
                <dt class="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[#5A6468]">Địa chỉ</dt>
                <dd class="mt-2 text-[15.5px] leading-relaxed text-[#273238]">Lam Điền, Xã Quảng Bị, Thành phố Hà Nội</dd>
              </div>
              <div class="py-4">
                <dt class="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[#5A6468]">Giờ làm việc</dt>
                <dd class="mt-2 text-[15.5px] text-[#273238]">Thứ Hai – Chủ Nhật: 08:00 – 18:00</dd>
              </div>
            </dl>
            <div class="mt-8 rounded-[10px] border border-[#E2DDD2] bg-white p-6">
              <p class="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[#073B2E]">Hỗ trợ trực tiếp</p>
              <p class="mt-2.5 text-[13.5px] leading-relaxed text-[#5A6468]">Đội ngũ kỹ thuật WANDERS tiếp nhận yêu cầu tư vấn màu sắc, báo giá công trình và mẫu thử trực tiếp qua hotline <a href="tel:0937760688" class="font-semibold text-[#073B2E] hover:underline">0937.760.688</a>.</p>
            </div>
          </div>

          <div class="w-reveal w-reveal-delay-1">
            <h2 class="w-section-title text-[#073B2E]">Gửi yêu cầu tư vấn</h2>
            <p class="mt-3 max-w-[52ch] text-[14.5px] leading-[1.75] text-[#5A6468]">Chỉ mất một phút. Thông tin bạn gửi được lưu lại để WANDERS liên hệ tư vấn trực tiếp.</p>
            <div class="mt-7">
              <form class="rounded-[10px] border border-[#E2DDD2] bg-white p-6 shadow-sm sm:p-8">
                <div class="space-y-5">
                  <div>
                    <label for="full_name" class="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#073B2E]">Họ tên <span class="text-[#D6AD45]">*</span></label>
                    <input id="full_name" placeholder="Nguyễn Văn A" class="mt-2 w-full rounded-[6px] border border-[#E2DDD2] bg-[#FAF8F3] px-4 py-3 text-[14px] text-[#273238] outline-none transition-colors placeholder:text-[#5A6468]/55 focus:border-[#073B2E] focus:bg-white" value="">
                  </div>
                  <div class="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label for="phone" class="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#073B2E]">Điện thoại <span class="text-[#D6AD45]">*</span></label>
                      <input id="phone" inputmode="tel" placeholder="09xx xxx xxx" class="mt-2 w-full rounded-[6px] border border-[#E2DDD2] bg-[#FAF8F3] px-4 py-3 text-[14px] text-[#273238] outline-none transition-colors placeholder:text-[#5A6468]/55 focus:border-[#073B2E] focus:bg-white" value="">
                    </div>
                    <div>
                      <label for="email" class="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#073B2E]">Email <span class="normal-case font-normal tracking-normal text-[#5A6468]/70">(tuỳ chọn)</span></label>
                      <input id="email" inputmode="email" placeholder="ban@email.com" class="mt-2 w-full rounded-[6px] border border-[#E2DDD2] bg-[#FAF8F3] px-4 py-3 text-[14px] text-[#273238] outline-none transition-colors placeholder:text-[#5A6468]/55 focus:border-[#073B2E] focus:bg-white" value="">
                    </div>
                  </div>
                  <div>
                    <label for="need" class="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#073B2E]">Nhu cầu tư vấn</label>
                    <select id="need" class="mt-2 w-full appearance-none rounded-[6px] border border-[#E2DDD2] bg-[#FAF8F3] px-4 py-3 text-[14px] text-[#273238] outline-none transition-colors focus:border-[#073B2E] focus:bg-white">
                      <option value="" selected="">Chọn nhóm sản phẩm</option>
                      <option value="Sơn nội thất">Sơn nội thất</option>
                      <option value="Sơn ngoại thất">Sơn ngoại thất</option>
                      <option value="Sơn chống thấm">Sơn chống thấm</option>
                      <option value="Sơn lót">Sơn lót</option>
                      <option value="Sơn chống nóng">Sơn chống nóng</option>
                      <option value="Sản phẩm khác">Sản phẩm khác</option>
                      <option value="Tư vấn màu">Tư vấn màu</option>
                    </select>
                  </div>
                  <div>
                    <label for="message" class="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#073B2E]">Nội dung <span class="text-[#D6AD45]">*</span></label>
                    <textarea id="message" rows="4" placeholder="Ví dụ: cần tư vấn màu cho tường ngoài nhà phố 3 tầng, hướng tây." class="mt-2 w-full resize-none rounded-[6px] border border-[#E2DDD2] bg-[#FAF8F3] px-4 py-3 text-[14px] leading-relaxed text-[#273238] outline-none transition-colors placeholder:text-[#5A6468]/55 focus:border-[#073B2E] focus:bg-white"></textarea>
                  </div>
                </div>
                <button type="submit" class="w-btn w-btn-forest mt-6 w-full justify-between disabled:cursor-wait disabled:opacity-70">
                  <span>Gửi yêu cầu tư vấn</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="w-btn-arrow h-4 w-4"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                </button>
                <div id="contactFormStatus" class="hidden mt-4 rounded-[6px] border p-4 text-[13px] leading-relaxed" role="status" aria-live="polite"></div>
                <p class="mt-4 text-[12px] leading-relaxed text-[#5A6468]">Thông tin của bạn chỉ được dùng để liên hệ tư vấn và không hiển thị công khai.</p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>

  ${renderFooter(prefix)}
  ${renderMobileDrawer(prefix)}

  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const form = document.querySelector('form');
      if (!form) return;
      const statusBox = document.getElementById('contactFormStatus');
      const submitBtn = form.querySelector('button[type="submit"]');

      function showStatus(type, msg) {
        if (!statusBox) return;
        statusBox.classList.remove('hidden');
        if (type === 'ok') {
          statusBox.style.borderColor = '#0F4C3A';
          statusBox.style.backgroundColor = '#EFF6F3';
          statusBox.style.color = '#073B2E';
        } else {
          statusBox.style.borderColor = '#B91C1C';
          statusBox.style.backgroundColor = '#FEF2F2';
          statusBox.style.color = '#7F1D1D';
        }
        statusBox.textContent = msg;
      }

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const full_name = (document.getElementById('full_name')?.value || '').trim();
        const phone = (document.getElementById('phone')?.value || '').trim();
        const email = (document.getElementById('email')?.value || '').trim();
        const need = (document.getElementById('need')?.value || '').trim();
        const message = (document.getElementById('message')?.value || '').trim();

        if (full_name.length < 2) {
          showStatus('err', 'Vui lòng nhập họ tên hợp lệ (tối thiểu 2 ký tự).');
          document.getElementById('full_name')?.focus();
          return;
        }
        if (!/^[0-9+\\-\\s().]{8,20}$/.test(phone)) {
          showStatus('err', 'Vui lòng nhập số điện thoại liên hệ hợp lệ.');
          document.getElementById('phone')?.focus();
          return;
        }
        if (email && !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
          showStatus('err', 'Địa chỉ email chưa đúng định dạng.');
          document.getElementById('email')?.focus();
          return;
        }
        if (message.length < 5) {
          showStatus('err', 'Vui lòng mô tả ngắn gọn nhu cầu tư vấn (tối thiểu 5 ký tự).');
          document.getElementById('message')?.focus();
          return;
        }

        if (window.location.protocol === 'file:') {
          showStatus('err', 'Bạn đang xem trang ở chế độ tệp cục bộ (file:///) chưa kết nối máy chủ gửi biểu mẫu. Vui lòng truy cập qua máy chủ web (HTTP/HTTPS) hoặc liên hệ trực tiếp Hotline 0937.760.688.');
          return;
        }

        const origLabel = submitBtn ? submitBtn.innerHTML : '';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'ĐANG GỬI YÊU CẦU...';
        }

        try {
          const resp = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ full_name, phone, email, need, message })
          });
          const data = await resp.json().catch(() => ({}));
          if (!resp.ok || !data.ok) {
            showStatus('err', data.error || 'Không thể gửi yêu cầu lúc này. Vui lòng thử lại hoặc gọi Hotline 0937.760.688.');
          } else {
            showStatus('ok', 'Đã tiếp nhận yêu cầu tư vấn (Mã #' + data.id + '). Đội ngũ kỹ thuật WANDERS sẽ liên hệ qua số ' + phone + ' trong giờ làm việc.');
            form.reset();
          }
        } catch (err) {
          showStatus('err', 'Kết nối máy chủ gián đoạn. Vui lòng gọi trực tiếp Hotline 0937.760.688 hoặc email wanderspaint@gmail.com.');
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = origLabel;
          }
        }
      });
    });
  </script>
  ${renderCoreScripts(prefix)}
</body>
</html>`;
}

function buildMasterPages() {
  fs.writeFileSync(path.join(ROOT, 'index.html'), buildHomepageHtml(), 'utf8');
  console.log('Built: index.html');

  saveRootAndSubdir('gioi-thieu.html', 'gioi-thieu', (p) => buildGioiThieuHtml(p));
  saveRootAndSubdir('san-pham.html', 'san-pham', (p) => buildSanPhamHtml(p));
  saveRootAndSubdir('du-an.html', 'du-an', (p) => buildDuAnHtml(p, p === '../'));
  saveRootAndSubdir('lien-he.html', 'lien-he', (p) => buildLienHeHtml(p));
}

if (require.main === module) {
  buildMasterPages();
}

module.exports = { buildMasterPages };

