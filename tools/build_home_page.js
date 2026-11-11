const fs = require('fs');
const path = require('path');

// Read core CSS
const coreCssPath = path.join(__dirname, '../website_download/assets/index-BDqGYMxC.css');
const rawCoreCss = fs.existsSync(coreCssPath) ? fs.readFileSync(coreCssPath, 'utf8') : '';
const coreCss = rawCoreCss.replace(/MY\s*HOUR/gi, 'WANDERS').replace(/MYHOUSE/gi, 'WANDERS');

// Read authentic 24 WANDERS products
const productsPath = path.join(__dirname, '../website_download/data/wanders_products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

// Top 4 curated featured products matching the mockup exactly
const top4Featured = [
  {
    name: 'SƠN NỘI THẤT CAO CẤP',
    code: 'W-INT01',
    category: 'son-noi-that',
    image: 'images/can-wanders-interior-green.svg',
    link: 'san-pham/bronze-for-interior-in3000/index.html'
  },
  {
    name: 'SƠN NGOẠI THẤT BỀN MÀU',
    code: 'W-EXT02',
    category: 'son-ngoai-that',
    image: 'images/can-wanders-exterior-yellow.svg',
    link: 'san-pham/anti-uv-exterior-ex9000/index.html'
  },
  {
    name: 'SƠN CHỐNG THẤM ĐA NĂNG',
    code: 'W-WP03',
    category: 'chong-tham',
    image: 'images/can-wanders-waterproof-blue.svg',
    link: 'san-pham/waterproof-nano-wnano/index.html'
  },
  {
    name: 'SƠN LÓT KHÁNG KIỀM',
    code: 'W-PR04',
    category: 'son-lot',
    image: 'images/can-wanders-sealer-teal.svg',
    link: 'san-pham/sealer-nano-sn8000/index.html'
  }
];

// Remaining authentic products for slider continuity
const remainingProducts = products.filter(p => !['IN3*', 'EX929', 'CT01', 'PR01'].includes(p.code));

// Combined slider products starting with the 4 mockup cans
const allSliderProducts = [
  ...top4Featured,
  ...remainingProducts.map(p => ({
    name: p.name.toUpperCase(),
    code: p.code,
    category: p.category,
    image: p.image,
    link: p.link
  }))
];

function generateHomePage() {
  // Generate HTML for product cards in slider
  // Proportions: Card height 395px, image box 250px (~65% of height), authentic vector paint cans
  const productCardsHtml = allSliderProducts.map((prod) => {
    return `
      <div class="product-slide-item" data-category="${prod.category}">
        <div>
          <!-- Packaging Image Container (65% card height, prominent and centered) -->
          <div class="product-img-box">
            <img src="${prod.image}" alt="${prod.name}" loading="lazy">
          </div>

          <!-- Product Name -->
          <h3 class="product-card-title">
            ${prod.name}
          </h3>
        </div>

        <!-- Code on left, Arrow on right (tight spacing, zero excess whitespace) -->
        <div class="product-card-bottom">
          <span class="product-card-code">${prod.code}</span>
          <a href="${prod.link}" class="product-card-arrow" aria-label="Chi tiết ${prod.name}">
            →
          </a>
        </div>
      </div>
    `;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%230F4C3A'/><text x='50%' y='68%' font-size='60' font-weight='bold' text-anchor='middle' fill='%23D6AD45' font-family='sans-serif'>W</text></svg>">
  <meta content="width=device-width, initial-scale=1.0" name="viewport">
  <link href="./manifest.json" rel="manifest">
  <title>Sơn WANDERS – Sắc màu kiến tạo không gian sống đẳng cấp</title>
  <meta content="Thương hiệu sơn WANDERS cung cấp giải pháp sơn nội thất, ngoại thất, sơn lót kháng kiềm, chống thấm và sơn chuyên dụng cao cấp công nghệ Anh Quốc, tiêu chuẩn ISO 9001:2015 & QCVN 16:2014/BXD." name="description">
  <link href="https://fonts.googleapis.com" rel="preconnect">
  <link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect">
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="./assets/index-BDqGYMxC.css">

  <style id="inlined-core-css">
    ${coreCss}
  </style>

  <style id="wanders-master-mockup-css">
    :root {
      --color-brand-green: #0F4C3A;
      --color-dark-green: #073B2E;
      --color-gold: #D6AD45;
      --color-cream: #FAF9F5;
      --color-white: #FFFFFF;
      --color-ink: #17231F;
    }

    body {
      font-family: 'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: #FFFFFF;
      color: var(--color-ink);
      overflow-x: hidden;
      font-size: 15px;
      line-height: 1.6;
    }
    
    .font-serif {
      font-family: 'Playfair Display', Georgia, serif;
    }

    /* Container quy chuẩn: 1280px, padding ngang 24px */
    .wanders-container {
      max-width: 1280px;
      margin-left: auto;
      margin-right: auto;
      padding-left: 24px;
      padding-right: 24px;
      width: 100%;
      box-sizing: border-box;
    }

    /* Section spacing quy chuẩn 64px - 88px */
    .wanders-section {
      padding-top: 72px;
      padding-bottom: 72px;
    }
    @media (min-width: 1024px) {
      .wanders-section {
        padding-top: 80px;
        padding-bottom: 80px;
      }
    }

    /* Hero Typography */
    .hero-heading {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 50px;
      line-height: 1.15;
      font-weight: 700;
      color: var(--color-dark-green);
      letter-spacing: -0.02em;
    }
    @media (max-width: 1024px) {
      .hero-heading { font-size: 40px; line-height: 1.18; }
    }
    @media (max-width: 640px) {
      .hero-heading { font-size: 32px; line-height: 1.22; }
    }

    /* Section Typography */
    .section-heading {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 32px;
      line-height: 1.25;
      font-weight: 700;
      color: #111827;
      letter-spacing: -0.01em;
    }
    @media (max-width: 640px) {
      .section-heading { font-size: 26px; line-height: 1.3; }
    }

    .section-eyebrow {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.22em;
      display: block;
      margin-bottom: 8px;
    }
    .section-eyebrow-green { color: var(--color-brand-green); }
    .section-eyebrow-gold { color: var(--color-gold); }

    .section-desc {
      font-size: 15px;
      line-height: 1.6;
      color: #4B5563;
    }

    /* Buttons quy chuẩn */
    .btn-wanders-green {
      background: var(--color-brand-green);
      color: #FFFFFF !important;
      font-size: 14px;
      font-weight: 700;
      padding: 13px 26px;
      border-radius: 4px;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 4px 12px rgba(15, 76, 58, 0.25);
      transition: all 0.2s ease;
      white-space: nowrap;
    }
    .btn-wanders-green:hover {
      background: #145E48;
      transform: translateY(-1px);
      box-shadow: 0 6px 18px rgba(15, 76, 58, 0.35);
    }

    .btn-wanders-outline {
      background: rgba(255, 255, 255, 0.95);
      border: 1px solid #9CA3AF;
      color: #1F2937 !important;
      font-size: 14px;
      font-weight: 700;
      padding: 13px 26px;
      border-radius: 4px;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s ease;
      white-space: nowrap;
    }
    .btn-wanders-outline:hover {
      border-color: var(--color-brand-green);
      color: var(--color-brand-green) !important;
      transform: translateY(-1px);
    }

    /* Mega Menu Header Rules */
    header, header > div, .shell { overflow: visible !important; }
    .nav-dropdown { position: relative !important; display: flex !important; align-items: center !important; height: 100% !important; }
    .nav-dropdown::after { content: ''; position: absolute; top: 100%; left: -20px; right: -20px; height: 20px; background: transparent; z-index: 99998; pointer-events: none; }
    .nav-dropdown:hover::after { pointer-events: auto; }
    .nav-dropdown-menu, .nav-mega-menu {
      position: absolute !important;
      top: calc(100% - 2px) !important;
      left: -15px !important;
      width: 740px !important;
      min-width: 680px !important;
      max-width: calc(100vw - 32px) !important;
      box-sizing: border-box !important;
      background: #FFFFFF !important;
      border: 1px solid #E8E6E1 !important;
      border-top: 3px solid var(--color-gold) !important;
      border-radius: 6px !important;
      box-shadow: 0 20px 45px -12px rgba(26, 36, 33, 0.22), 0 4px 16px rgba(0, 0, 0, 0.06) !important;
      z-index: 999999 !important;
      padding: 16px 18px !important;
      opacity: 0 !important;
      visibility: hidden !important;
      transform: translateY(8px) !important;
      transition: opacity 0.22s cubic-bezier(0.16, 1, 0.3, 1), transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.22s !important;
      pointer-events: none !important;
    }
    .nav-dropdown:hover .nav-dropdown-menu,
    .nav-dropdown:focus-within .nav-dropdown-menu {
      opacity: 1 !important;
      visibility: visible !important;
      transform: translateY(0) !important;
      pointer-events: auto !important;
      display: block !important;
    }
    .nav-dropdown-menu:hover {
      opacity: 1 !important;
      visibility: visible !important;
      transform: translateY(0) !important;
      pointer-events: auto !important;
      display: block !important;
    }
    .nav-mega-grid {
      display: grid !important;
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      gap: 10px 14px !important;
      width: 100% !important;
      box-sizing: border-box !important;
    }
    .nav-mega-item {
      display: flex !important;
      align-items: flex-start !important;
      gap: 12px !important;
      padding: 10px 12px !important;
      border-radius: 6px !important;
      border: 1px solid transparent !important;
      background: #FFFFFF !important;
      text-decoration: none !important;
      transition: all 0.18s ease-in-out !important;
      box-sizing: border-box !important;
      width: 100% !important;
      min-width: 0 !important;
    }
    .nav-mega-item:hover {
      background: var(--color-cream) !important;
      border-color: #EFECE6 !important;
      transform: translateY(-1px) !important;
      box-shadow: 0 4px 12px rgba(26, 36, 33, 0.05) !important;
    }
    .nav-mega-icon {
      width: 38px !important;
      height: 38px !important;
      border-radius: 6px !important;
      background: rgba(214, 173, 69, 0.14) !important;
      color: var(--color-gold) !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      flex-shrink: 0 !important;
      font-size: 16px !important;
      transition: all 0.2s ease !important;
    }
    .nav-mega-item:hover .nav-mega-icon {
      background: var(--color-gold) !important;
      color: #FFFFFF !important;
    }
    .nav-mega-content {
      flex: 1 1 auto !important;
      min-width: 0 !important;
      display: flex !important;
      flex-direction: column !important;
    }
    .nav-mega-title {
      font-family: inherit !important;
      font-size: 13.5px !important;
      font-weight: 600 !important;
      color: #1A2421 !important;
      line-height: 1.35 !important;
      margin: 0 !important;
      white-space: nowrap !important;
      transition: color 0.15s ease !important;
    }
    .nav-mega-item:hover .nav-mega-title { color: var(--color-brand-green) !important; }
    .nav-mega-desc {
      font-size: 11.5px !important;
      color: #64748B !important;
      line-height: 1.45 !important;
      margin-top: 3px !important;
      white-space: normal !important;
      word-wrap: break-word !important;
      overflow: visible !important;
      display: block !important;
    }
    .nav-mega-footer {
      margin-top: 14px !important;
      padding-top: 12px !important;
      border-top: 1px solid #ECEAE4 !important;
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      width: 100% !important;
      box-sizing: border-box !important;
    }
    .nav-mega-footer-text {
      font-size: 11.5px !important;
      color: #64748B !important;
      display: flex !important;
      align-items: center !important;
      gap: 6px !important;
    }
    .nav-mega-footer-link {
      font-size: 12px !important;
      font-weight: 600 !important;
      color: var(--color-brand-green) !important;
      text-decoration: none !important;
      display: inline-flex !important;
      align-items: center !important;
      gap: 4px !important;
      transition: all 0.15s ease !important;
    }
    .nav-mega-footer-link:hover { color: var(--color-gold) !important; transform: translateX(2px) !important; }

    /* Category Pill Badge on Eco-cards */
    .eco-category-pill {
      position: absolute;
      bottom: 14px;
      left: 14px;
      right: 14px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(6px);
      border-radius: 9999px;
      padding: 8px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      transition: all 0.25s ease;
    }
    .eco-category-card:hover .eco-category-pill {
      background: #FFFFFF;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.14);
    }

    /* Filter Tabs in Product Section */
    .product-filter-tab {
      padding: 8px 20px;
      font-size: 14px;
      font-weight: 600;
      border-radius: 9999px;
      cursor: pointer;
      border: 1px solid #E5E7EB;
      background: #FFFFFF;
      color: #4B5563;
      white-space: nowrap;
      transition: all 0.2s ease;
    }
    .product-filter-tab:hover {
      border-color: var(--color-brand-green);
      color: var(--color-brand-green);
    }
    .product-filter-tab.active {
      background: var(--color-brand-green) !important;
      color: #FFFFFF !important;
      border-color: var(--color-brand-green) !important;
    }

    /* Product Slider horizontal scrolling */
    .product-slider-wrapper {
      display: flex;
      gap: 20px;
      overflow-x: auto;
      scroll-behavior: smooth;
      scrollbar-width: none;
      -ms-overflow-style: none;
      padding: 10px 4px 20px 4px;
      width: 100%;
      box-sizing: border-box;
    }
    .product-slider-wrapper::-webkit-scrollbar {
      display: none;
    }

    /* Product Card Quy Chuẩn (4 card desktop, chiều cao ảnh 65%) */
    .product-slide-item {
      width: 285px;
      min-width: 285px;
      height: 395px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: #FFFFFF;
      border: 1px solid #E5E7EB;
      border-radius: 12px;
      padding: 16px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      transition: all 0.25s ease;
      box-sizing: border-box;
      flex-shrink: 0;
    }
    @media (min-width: 1024px) {
      .product-slide-item {
        width: calc((100% - 60px) / 4);
        min-width: calc((100% - 60px) / 4);
      }
    }
    .product-slide-item:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
      border-color: rgba(15, 76, 58, 0.4);
    }
    .product-img-box {
      height: 250px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--color-cream);
      border-radius: 8px;
      padding: 10px;
      box-sizing: border-box;
      overflow: hidden;
    }
    .product-img-box img {
      max-height: 220px;
      max-width: 90%;
      width: auto;
      object-fit: contain;
      filter: drop-shadow(0 6px 14px rgba(0, 0, 0, 0.14));
      transition: transform 0.3s ease;
    }
    .product-slide-item:hover .product-img-box img {
      transform: scale(1.05);
    }
    .product-card-title {
      font-size: 14.5px;
      font-weight: 700;
      text-transform: uppercase;
      color: #111827;
      line-height: 1.35;
      margin-top: 12px;
      min-height: 40px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      transition: color 0.2s ease;
    }
    .product-slide-item:hover .product-card-title {
      color: var(--color-brand-green);
    }
    .product-card-bottom {
      padding-top: 12px;
      border-top: 1px solid #F3F4F6;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: auto;
    }
    .product-card-code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 13.5px;
      font-weight: 700;
      color: var(--color-brand-green);
      letter-spacing: 0.05em;
    }
    .product-card-arrow {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: #FFFFFF;
      border: 1px solid #E5E7EB;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 700;
      color: #4B5563;
      transition: all 0.2s ease;
      text-decoration: none;
    }
    .product-slide-item:hover .product-card-arrow {
      background: var(--color-brand-green);
      color: #FFFFFF;
      border-color: var(--color-brand-green);
    }

    /* Slider Arrows */
    .slider-arrow-btn-left {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: #FFFFFF;
      border: 1px solid #D1D5DB;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #111827;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .slider-arrow-btn-left:hover {
      border-color: var(--color-brand-green);
      color: var(--color-brand-green);
      transform: scale(1.08);
    }

    .slider-arrow-btn-right {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: var(--color-brand-green);
      border: 1px solid var(--color-brand-green);
      box-shadow: 0 4px 14px rgba(15, 76, 58, 0.3);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #FFFFFF;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .slider-arrow-btn-right:hover {
      background: #145e48;
      border-color: #145e48;
      transform: scale(1.08);
    }

    /* CTA Banner Quy Chuẩn */
    .cta-banner-box {
      background-color: var(--color-brand-green);
      color: #FFFFFF;
      border-radius: 18px;
      padding: 48px;
      position: relative;
      overflow: hidden;
      box-shadow: 0 20px 45px -15px rgba(15, 76, 58, 0.35);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 32px;
    }
    @media (max-width: 1024px) {
      .cta-banner-box {
        flex-direction: column;
        text-align: center;
        padding: 40px 24px;
      }
    }
    .cta-heading {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 34px;
      font-weight: 700;
      line-height: 1.22;
      color: #FFFFFF;
    }
    @media (max-width: 640px) {
      .cta-heading { font-size: 26px; }
    }
    .cta-desc {
      font-size: 15px;
      line-height: 1.55;
      color: rgba(209, 250, 229, 0.95);
      margin-top: 10px;
    }
    .btn-primary-white {
      background: #FFFFFF;
      color: var(--color-brand-green) !important;
      font-size: 14px;
      font-weight: 700;
      padding: 14px 28px;
      border-radius: 4px;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
      transition: all 0.2s ease;
      white-space: nowrap;
    }
    .btn-primary-white:hover {
      background: #F3F4F6;
      transform: translateY(-1px);
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.16);
    }
    .btn-secondary-phone {
      background: #0B3B2C;
      border: 1px solid rgba(16, 185, 129, 0.5);
      color: #FFFFFF !important;
      font-size: 14px;
      font-weight: 700;
      padding: 14px 28px;
      border-radius: 4px;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
      transition: all 0.2s ease;
      white-space: nowrap;
    }
    .btn-secondary-phone:hover {
      background: #124D3A;
      border-color: rgba(16, 185, 129, 0.8);
      transform: translateY(-1px);
    }

    /* Floating Brand Value Strip */
    .brand-value-strip {
      background: var(--color-cream);
      border: 1px solid #EAE7E0;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
      padding: 20px 24px;
      margin-top: -30px;
      position: relative;
      z-index: 20;
    }
    @media (max-width: 768px) {
      .brand-value-strip {
        margin-top: 20px;
        padding: 16px;
      }
    }

    /* Footer Quy Chuẩn Master Mockup */
    footer, .wanders-footer {
      background-color: #073B2E !important;
      color: #FFFFFF !important;
    }
    footer a {
      color: #D1D5DB;
      text-decoration: none;
      transition: color 0.15s ease;
    }
    footer a:hover {
      color: #D6AD45 !important;
    }
  </style>
</head>
<body class="bg-white text-[#17231F] antialiased">
  <div id="root" class="flex min-h-screen flex-col">

    <!-- 1. HEADER (CHIỀU CAO 72PX, LOGO WANDERS VỚI SÓNG VÀNG GOLD, MENU, HOTLINE, NÚT XANH ĐẬM) -->
    <header class="sticky top-0 z-50 border-b border-gray-200/90 bg-white/95 backdrop-blur-md">
      <div class="wanders-container flex h-[72px] items-center justify-between gap-6">
        <!-- Logo WANDERS -->
        <a aria-label="Sơn WANDERS – Trang chủ" class="shrink-0 flex items-center" href="index.html">
          <span class="relative inline-flex flex-col">
            <span class="font-bold tracking-tight text-[28px] leading-none text-[#0F4C3A]" style="letter-spacing: -0.01em;">
              WANDERS<sup style="font-size: 12px; font-weight: 700; color: #0F4C3A; top: -0.7em;">®</sup>
            </span>
            <!-- Golden swoosh wave -->
            <svg class="w-[110px] h-[8px] -mt-[2px]" viewBox="0 0 108 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 5.5C28 1.5 68 1.5 107 4.5" stroke="#D6AD45" stroke-width="2.6" stroke-linecap="round"/>
              <path d="M25 6C55 2.5 85 3 105 5.5" stroke="#C5A880" stroke-width="1.8" stroke-linecap="round" opacity="0.6"/>
            </svg>
          </span>
        </a>

        <!-- Menu điều hướng ở giữa (5 mục) -->
        <nav class="hidden items-center lg:flex gap-1" aria-label="Điều hướng chính">
          <a class="px-4 py-2 text-[14px] font-medium text-gray-800 hover:text-[#0F4C3A] transition-colors" href="gioi-thieu/index.html">Giới thiệu</a>
          
          <!-- Dropdown Sản phẩm Mega Menu -->
          <div class="relative group flex h-[72px] items-center nav-dropdown">
            <a class="px-4 py-2 text-[14px] font-medium text-gray-800 hover:text-[#0F4C3A] flex items-center gap-1.5 transition-colors" href="san-pham/index.html">
              <span>Sản phẩm</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180"><path d="m6 9 6 6 6-6"/></svg>
            </a>
            
            <div class="nav-dropdown-menu nav-mega-menu absolute left-0 top-[70px] hidden group-hover:block group-focus-within:block border border-gray-200 bg-white shadow-2xl z-50 rounded-lg">
              <div class="nav-mega-grid">
                <a href="san-pham/son-noi-that/index.html" class="nav-mega-item group/item">
                  <div class="nav-mega-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  </div>
                  <div class="nav-mega-content">
                    <span class="nav-mega-title">Sơn nội thất WANDERS</span>
                    <span class="nav-mega-desc">Mịn bóng sang trọng, kháng khuẩn, lau chùi vượt trội &amp; bền màu dài lâu</span>
                  </div>
                </a>
                <a href="san-pham/son-ngoai-that/index.html" class="nav-mega-item group/item">
                  <div class="nav-mega-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  </div>
                  <div class="nav-mega-content">
                    <span class="nav-mega-title">Sơn ngoại thất bảo vệ</span>
                    <span class="nav-mega-desc">Chống tia cực tím UV, kháng kiềm muối hóa &amp; chịu thời tiết khắc nghiệt</span>
                  </div>
                </a>
                <a href="san-pham/son-chong-tham/index.html" class="nav-mega-item group/item">
                  <div class="nav-mega-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
                  </div>
                  <div class="nav-mega-content">
                    <span class="nav-mega-title">Sơn chống thấm đa năng</span>
                    <span class="nav-mega-desc">Pha xi măng B5, chống thấm màu, Bitum sàn &amp; Xika Lastic lộ thiên</span>
                  </div>
                </a>
                <a href="san-pham/son-lot/index.html" class="nav-mega-item group/item">
                  <div class="nav-mega-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 11V4a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v7"/><path d="M14 11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9"/><path d="M4 11h16v3a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6v-3z"/></svg>
                  </div>
                  <div class="nav-mega-content">
                    <span class="nav-mega-title">Sơn lót kháng kiềm chuyên sâu</span>
                    <span class="nav-mega-desc">Kháng kiềm hóa vượt trội, chống loang màu &amp; tăng liên kết lớp phủ</span>
                  </div>
                </a>
                <a href="san-pham/son-chong-nong/index.html" class="nav-mega-item group/item">
                  <div class="nav-mega-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
                  </div>
                  <div class="nav-mega-content">
                    <span class="nav-mega-title">Sơn chống nóng cách nhiệt CN08</span>
                    <span class="nav-mega-desc">Phản xạ nhiệt bức xạ mặt trời, hạ nhiệt bề mặt công trình 5-8°C</span>
                  </div>
                </a>
                <a href="san-pham/san-pham-khac/index.html" class="nav-mega-item group/item">
                  <div class="nav-mega-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                  </div>
                  <div class="nav-mega-content">
                    <span class="nav-mega-title">Sản phẩm đặc dụng &amp; Bột bả</span>
                    <span class="nav-mega-desc">Sơn chậu cảnh, phủ bóng Clear Nano, bóng 2K &amp; bột bả nội ngoại thất</span>
                  </div>
                </a>
              </div>
              <div class="nav-mega-footer">
                <div class="nav-mega-footer-text">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #0F4C3A;"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  <span>Công nghệ Anh Quốc • Tiêu chuẩn ISO 9001:2015 &amp; QCVN 16:2014/BXD</span>
                </div>
                <a href="san-pham/index.html" class="nav-mega-footer-link">
                  <span>Xem toàn bộ 24 sản phẩm</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </a>
              </div>
            </div>
          </div>

          <a class="px-4 py-2 text-[14px] font-medium text-gray-800 hover:text-[#0F4C3A] transition-colors" href="du-an/index.html">Dự án</a>
          <a class="px-4 py-2 text-[14px] font-medium text-gray-800 hover:text-[#0F4C3A] transition-colors" href="cam-hung-mau-sac/index.html">Cảm hứng màu sắc</a>
          <a class="px-4 py-2 text-[14px] font-medium text-gray-800 hover:text-[#0F4C3A] transition-colors" href="tin-tuc/index.html">Tin tức</a>
        </nav>

        <!-- Bên phải: Hotline & Nút Nhận tư vấn màu xanh đậm -->
        <div class="flex items-center gap-5">
          <a href="tel:0937760688" class="hidden xl:inline-flex items-center gap-2 text-[14px] font-bold text-gray-900 hover:text-[#0F4C3A] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 text-[#0F4C3A]"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            <span>0937.760.688</span>
          </a>
          <a class="hidden sm:inline-flex items-center gap-1.5 rounded-[4px] bg-[#0F4C3A] px-5 py-2.5 text-[13.5px] font-semibold text-white transition-colors hover:bg-[#145e48] shadow-sm" href="lien-he/index.html">
            <span>Nhận tư vấn</span>
            <span class="text-base leading-none">→</span>
          </a>
          <!-- Mobile Menu Button -->
          <button id="mobileMenuToggle" type="button" aria-label="Mở menu" class="flex h-10 w-10 items-center justify-center rounded border border-gray-200 text-gray-800 lg:hidden hover:bg-gray-50">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          </button>
        </div>
      </div>
    </header>

    <!-- MOBILE MENU DRAWER -->
    <div id="mobileMenuDrawer" class="fixed inset-0 z-50 hidden bg-black/60 backdrop-blur-sm">
      <div class="fixed inset-y-0 right-0 w-[300px] bg-white p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
        <div>
          <div class="flex items-center justify-between pb-4 border-b border-gray-200">
            <span class="font-bold text-xl text-[#0F4C3A]">WANDERS<sup>®</sup></span>
            <button id="mobileMenuClose" class="text-gray-500 hover:text-gray-900 text-2xl font-bold">✕</button>
          </div>
          <nav class="flex flex-col gap-3.5 mt-6 text-sm font-semibold text-gray-800">
            <a href="index.html" class="hover:text-[#0F4C3A] py-1">Trang chủ</a>
            <a href="gioi-thieu/index.html" class="hover:text-[#0F4C3A] py-1">Giới thiệu</a>
            <a href="san-pham/index.html" class="hover:text-[#0F4C3A] py-1">Sản phẩm (24 dòng sơn)</a>
            <a href="du-an/index.html" class="hover:text-[#0F4C3A] py-1">Dự án &amp; Công trình</a>
            <a href="cam-hung-mau-sac/index.html" class="hover:text-[#0F4C3A] py-1">Cảm hứng màu sắc</a>
            <a href="tin-tuc/index.html" class="hover:text-[#0F4C3A] py-1">Tin tức</a>
            <a href="lien-he/index.html" class="hover:text-[#0F4C3A] py-1">Liên hệ</a>
          </nav>
        </div>
        <div class="pt-6 border-t border-gray-200">
          <p class="text-xs text-gray-500">Hotline: <strong class="text-gray-900">0937.760.688</strong></p>
          <p class="text-xs text-gray-500 mt-1">Email: wanderspaint@gmail.com</p>
          <a href="lien-he/index.html" class="mt-4 block w-full text-center py-2.5 rounded bg-[#0F4C3A] text-white text-xs font-bold uppercase tracking-wider">
            Nhận tư vấn ngay
          </a>
        </div>
      </div>
    </div>

    <!-- 2. HERO BANNER (CHIỀU CAO 440-480PX, BIỆT THỰ ÁNH SÁNG BAN NGÀY, TIÊU ĐỀ PLAYFAIR DISPLAY) -->
    <section class="relative h-[440px] sm:h-[470px] lg:h-[490px] w-full overflow-hidden bg-gray-100 flex items-center select-none">
      <!-- High-res Villa Background (1440x700 sharp) -->
      <img src="images/002_c1c8fa6d8_generated_image.png" alt="Kiến trúc công trình hoàn thiện sơn WANDERS" class="absolute inset-0 h-full w-full object-cover object-center">
      
      <!-- Gradient overlay vừa vặn bên trái giúp chữ sắc nét tuyệt đối mà không che mất kiến trúc -->
      <div class="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent w-full md:w-[58%]"></div>
      
      <!-- Content Container -->
      <div class="wanders-container relative z-10 w-full">
        <div class="max-w-xl text-gray-900">
          <!-- Main Headline (Playfair Display 50px bold) -->
          <h1 class="hero-heading">
            Sắc màu kiến tạo<br>
            không gian sống<br>
            đẳng cấp.
          </h1>

          <!-- Description (Font nội dung chuẩn 15px) -->
          <p class="section-desc mt-3.5 max-w-lg">
            Giải pháp sơn nội thất, ngoại thất và bảo vệ công trình với chất lượng bền đẹp cùng thời gian.
          </p>

          <!-- 2 Buttons: Khám phá sản phẩm & Khám phá dự án -->
          <div class="mt-6 flex flex-wrap items-center gap-3.5">
            <a href="#san-pham-noi-bat" class="btn-wanders-green">
              <span>Khám phá sản phẩm</span>
              <span class="font-bold">→</span>
            </a>
            <a href="du-an/index.html" class="btn-wanders-outline">
              <span>Khám phá dự án</span>
              <span class="font-bold">→</span>
            </a>
          </div>

          <!-- Slider Indicators -->
          <div class="mt-7 flex items-center gap-2">
            <span class="h-2.5 w-6 rounded-full bg-[#0F4C3A]"></span>
            <span class="h-2.5 w-2.5 rounded-full bg-gray-400"></span>
            <span class="h-2.5 w-2.5 rounded-full bg-gray-400"></span>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. DẢI GIÁ TRỊ THƯƠNG HIỆU (THANH NỔI NGAY DƯỚI HERO, NỀN TRẮNG KEM, BO GÓC NHẸ) -->
    <div class="wanders-container">
      <div class="brand-value-strip">
        <div class="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-200/90 text-gray-800">
          <!-- 1. Màu sắc đa dạng -->
          <div class="flex items-center gap-3.5 px-2 py-2.5 md:py-0 md:px-4">
            <svg class="h-7 w-7 text-[#0F4C3A] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
            </svg>
            <div>
              <h4 class="text-[14.5px] font-bold text-gray-900">Màu sắc đa dạng</h4>
              <p class="text-[12.5px] text-gray-500 mt-0.5">Phù hợp mọi phong cách</p>
            </div>
          </div>

          <!-- 2. Bảo vệ bền vững -->
          <div class="flex items-center gap-3.5 px-2 py-2.5 md:py-0 md:px-4">
            <svg class="h-7 w-7 text-[#0F4C3A] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>
            </svg>
            <div>
              <h4 class="text-[14.5px] font-bold text-gray-900">Bảo vệ bền vững</h4>
              <p class="text-[12.5px] text-gray-500 mt-0.5">Chống thấm, chống kiềm hiệu quả</p>
            </div>
          </div>

          <!-- 3. Giải pháp toàn diện -->
          <div class="flex items-center gap-3.5 px-2 py-2.5 md:py-0 md:px-4">
            <svg class="h-7 w-7 text-[#0F4C3A] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
            </svg>
            <div>
              <h4 class="text-[14.5px] font-bold text-gray-900">Giải pháp toàn diện</h4>
              <p class="text-[12.5px] text-gray-500 mt-0.5">Từ nội thất đến ngoại thất</p>
            </div>
          </div>

          <!-- 4. Đồng hành lâu dài -->
          <div class="flex items-center gap-3.5 px-2 py-2.5 md:py-0 md:px-4">
            <svg class="h-7 w-7 text-[#0F4C3A] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="m11 17 2 2a1 1 0 0 0 1.4 0l4.6-4.6a1 1 0 0 0 0-1.4l-2-2a1 1 0 0 0-1.4 0L14 12.6"/><path d="m18 10 1-1a2 2 0 0 0 0-2.8l-1.2-1.2a2 2 0 0 0-2.8 0l-1 1"/><path d="m3 21 9-9"/><path d="m12.2 3.8-2 2a2 2 0 0 0 0 2.8l1.2 1.2a2 2 0 0 0 2.8 0l2-2"/>
            </svg>
            <div>
              <h4 class="text-[14.5px] font-bold text-gray-900">Đồng hành lâu dài</h4>
              <p class="text-[12.5px] text-gray-500 mt-0.5">Tư vấn và hỗ trợ tận tâm</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 4. HỆ SINH THÁI SẢN PHẨM (24% TRÁI: TIÊU ĐỀ, 76% PHẢI: GRID 3 CỘT X 2 HÀNG NHÃN PILL TRẮNG) -->
    <section class="wanders-section bg-white">
      <div class="wanders-container">
        <div class="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">
          
          <!-- Cột bên trái (~24%): Tiêu đề và mô tả -->
          <div class="w-full lg:w-[24%] shrink-0">
            <span class="section-eyebrow section-eyebrow-green">HỆ SINH THÁI SẢN PHẨM</span>
            <h2 class="section-heading">
              Giải pháp sơn toàn diện cho mọi công trình.
            </h2>
            <p class="section-desc mt-4">
              Hệ sinh thái sản phẩm WANDERS đáp ứng nhu cầu hoàn thiện và bảo vệ công trình.
            </p>
          </div>

          <!-- Bên phải (~76%): 6 ảnh danh mục (Grid 3 cột x 2 hàng, khoảng cách đều) -->
          <div class="w-full lg:w-[76%] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- 1. Sơn nội thất -->
            <a href="san-pham/son-noi-that/index.html" class="eco-category-card group relative block aspect-[16/11] overflow-hidden rounded-2xl bg-gray-100 shadow-sm">
              <img src="images/004_5d6cbf088_generated_image.png" alt="Sơn nội thất WANDERS" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108">
              <div class="eco-category-pill">
                <div class="flex items-center gap-2.5">
                  <svg class="h-4 w-4 text-[#0F4C3A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                  <span class="text-[14px] font-bold text-gray-900">Sơn nội thất</span>
                </div>
                <span class="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-[#0F4C3A] text-xs font-bold transition-colors group-hover:bg-[#0F4C3A] group-hover:text-white">→</span>
              </div>
            </a>

            <!-- 2. Sơn ngoại thất -->
            <a href="san-pham/son-ngoai-that/index.html" class="eco-category-card group relative block aspect-[16/11] overflow-hidden rounded-2xl bg-gray-100 shadow-sm">
              <img src="images/005_7c6a54e1f_generated_image.png" alt="Sơn ngoại thất WANDERS" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108">
              <div class="eco-category-pill">
                <div class="flex items-center gap-2.5">
                  <svg class="h-4 w-4 text-[#0F4C3A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  <span class="text-[14px] font-bold text-gray-900">Sơn ngoại thất</span>
                </div>
                <span class="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-[#0F4C3A] text-xs font-bold transition-colors group-hover:bg-[#0F4C3A] group-hover:text-white">→</span>
              </div>
            </a>

            <!-- 3. Sơn chống thấm -->
            <a href="san-pham/son-chong-tham/index.html" class="eco-category-card group relative block aspect-[16/11] overflow-hidden rounded-2xl bg-gray-100 shadow-sm">
              <img src="images/006_d0746339d_generated_image.png" alt="Sơn chống thấm WANDERS" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108">
              <div class="eco-category-pill">
                <div class="flex items-center gap-2.5">
                  <svg class="h-4 w-4 text-[#0F4C3A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
                  <span class="text-[14px] font-bold text-gray-900">Sơn chống thấm</span>
                </div>
                <span class="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-[#0F4C3A] text-xs font-bold transition-colors group-hover:bg-[#0F4C3A] group-hover:text-white">→</span>
              </div>
            </a>

            <!-- 4. Sơn lót kháng kiềm -->
            <a href="san-pham/son-lot/index.html" class="eco-category-card group relative block aspect-[16/11] overflow-hidden rounded-2xl bg-gray-100 shadow-sm">
              <img src="images/007_5cd8515fc_generated_image.png" alt="Sơn lót kháng kiềm WANDERS" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108">
              <div class="eco-category-pill">
                <div class="flex items-center gap-2.5">
                  <svg class="h-4 w-4 text-[#0F4C3A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 11V4a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v7"/><path d="M4 11h16v3a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6v-3z"/></svg>
                  <span class="text-[14px] font-bold text-gray-900">Sơn lót kháng kiềm</span>
                </div>
                <span class="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-[#0F4C3A] text-xs font-bold transition-colors group-hover:bg-[#0F4C3A] group-hover:text-white">→</span>
              </div>
            </a>

            <!-- 5. Sơn chống nóng -->
            <a href="san-pham/son-chong-nong/index.html" class="eco-category-card group relative block aspect-[16/11] overflow-hidden rounded-2xl bg-gray-100 shadow-sm">
              <img src="images/008_c8142a774_generated_image.png" alt="Sơn chống nóng WANDERS" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108">
              <div class="eco-category-pill">
                <div class="flex items-center gap-2.5">
                  <svg class="h-4 w-4 text-[#0F4C3A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/></svg>
                  <span class="text-[14px] font-bold text-gray-900">Sơn chống nóng</span>
                </div>
                <span class="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-[#0F4C3A] text-xs font-bold transition-colors group-hover:bg-[#0F4C3A] group-hover:text-white">→</span>
              </div>
            </a>

            <!-- 6. Sản phẩm khác -->
            <a href="san-pham/san-pham-khac/index.html" class="eco-category-card group relative block aspect-[16/11] overflow-hidden rounded-2xl bg-gray-100 shadow-sm">
              <img src="images/009_6fa827603_generated_image.png" alt="Sản phẩm đặc dụng WANDERS" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108">
              <div class="eco-category-pill">
                <div class="flex items-center gap-2.5">
                  <svg class="h-4 w-4 text-[#0F4C3A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                  <span class="text-[14px] font-bold text-gray-900">Sản phẩm khác</span>
                </div>
                <span class="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-[#0F4C3A] text-xs font-bold transition-colors group-hover:bg-[#0F4C3A] group-hover:text-white">→</span>
              </div>
            </a>
          </div>

        </div>
      </div>
    </section>

    <!-- 5. SẢN PHẨM NỔI BẬT (SLIDER NGANG 4 CARD ĐỒNG NHẤT, KHU VỰC ẢNH CHIẾM 65% CHIỀU CAO CARD, TAB CÙNG HÀNG) -->
    <section id="san-pham-noi-bat" class="wanders-section bg-[#FAF8F5]">
      <div class="wanders-container">
        
        <!-- Header Row: Heading & Description (Trái) + Tab Danh Mục (Phải) -->
        <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <span class="section-eyebrow section-eyebrow-gold">SẢN PHẨM NỔI BẬT</span>
            <h2 class="section-heading">
              Khám phá các dòng sơn WANDERS.
            </h2>
            <p class="section-desc mt-1.5">
              Giải pháp sơn chất lượng cho từng hạng mục công trình.
            </p>
          </div>

          <!-- Tab danh mục nằm cùng hàng -->
          <div class="flex items-center gap-2.5 overflow-x-auto pb-1" id="productFilterTabs">
            <button type="button" class="product-filter-tab active" data-filter="all">Tất cả</button>
            <button type="button" class="product-filter-tab" data-filter="son-noi-that">Sơn nội thất</button>
            <button type="button" class="product-filter-tab" data-filter="son-ngoai-that">Sơn ngoại thất</button>
            <button type="button" class="product-filter-tab" data-filter="son-lot">Sơn lót</button>
            <button type="button" class="product-filter-tab" data-filter="chong-tham">Chống thấm</button>
            <button type="button" class="product-filter-tab" data-filter="son-chong-nong">Chống nóng</button>
          </div>
        </div>

        <!-- Slider Ngang 4 Card với 2 nút chuyển trái/phải -->
        <div class="relative group">
          <!-- Prev Button (Trắng viền) -->
          <button id="sliderPrevBtn" type="button" class="slider-arrow-btn-left absolute -left-4 sm:-left-6 top-1/2 -translate-y-1/2 z-20" aria-label="Sản phẩm trước">
            ‹
          </button>
          
          <!-- Next Button (Xanh đậm WANDERS) -->
          <button id="sliderNextBtn" type="button" class="slider-arrow-btn-right absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2 z-20" aria-label="Sản phẩm sau">
            ›
          </button>

          <!-- Slider Container (Desktop 4 card khít đều nhau, chiều cao đồng nhất 395px) -->
          <div id="productSlider" class="product-slider-wrapper">
            ${productCardsHtml}
          </div>
        </div>

      </div>
    </section>

    <!-- 6. CẢM HỨNG MÀU SẮC (BỐ CỤC 3 CỘT: 36% ẢNH LỚN, 28% NỘI DUNG GIỚI THIỆU, 36% 3 BỘ SƯU TẬP MÀU) -->
    <section class="wanders-section bg-white">
      <div class="wanders-container">
        <span class="section-eyebrow section-eyebrow-green">CẢM HỨNG MÀU SẮC</span>
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center mt-2">
          
          <!-- Cột 1 (~36%): Hình ảnh phòng khách hoàn thiện sơn tường xanh lá thanh lịch -->
          <div class="lg:col-span-4 overflow-hidden rounded-2xl aspect-[4/3] bg-gray-100 shadow-md relative group">
            <img src="images/004_5d6cbf088_generated_image.png" alt="Phòng khách tông xanh lá WANDERS" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105">
          </div>

          <!-- Cột 2 (~28%): Tiêu đề, nội dung và nút CTA Khám phá bảng màu -->
          <div class="lg:col-span-4 px-2">
            <h2 class="section-heading">
              Khám phá thế giới<br>màu sắc WANDERS.
            </h2>
            <p class="section-desc mt-3.5">
              Khơi nguồn cảm hứng từ những gam màu tinh tế dành cho không gian sống hiện đại, đẳng cấp và bền vững theo thời gian.
            </p>
            <div class="mt-6">
              <a href="cam-hung-mau-sac/index.html" class="btn-wanders-green">
                <span>Khám phá bảng màu</span>
                <span class="font-bold">→</span>
              </a>
            </div>
          </div>

          <!-- Cột 3 (~36%): 3 bộ sưu tập màu có thumbnail và dải màu lớn sắc nét -->
          <div class="lg:col-span-4 flex flex-col gap-4">
            <!-- BST 1: Blue -->
            <a href="cam-hung-mau-sac/index.html" class="group flex items-center justify-between gap-3.5 rounded-xl border border-gray-200/90 bg-[#FAF8F5] p-3.5 shadow-sm hover:border-[#0F4C3A]/50 hover:shadow-md transition-all">
              <div class="flex items-center gap-3">
                <img src="images/019_2dae2fe94_generated_image.png" alt="BST Blue" class="h-14 w-15 rounded-lg object-cover">
                <div>
                  <h4 class="text-[14px] font-bold text-gray-900 group-hover:text-[#0F4C3A] transition-colors">Bộ sưu tập Blue</h4>
                  <p class="text-[12px] text-gray-500 mt-0.5">Thanh bình, tươi mát</p>
                </div>
              </div>
              <!-- Dải 4 ô màu nhận diện rõ nét -->
              <div class="flex gap-1.5 shrink-0">
                <span class="h-9 w-5 rounded-sm shadow-sm" style="background-color: #89C2D9;"></span>
                <span class="h-9 w-5 rounded-sm shadow-sm" style="background-color: #4A6B82;"></span>
                <span class="h-9 w-5 rounded-sm shadow-sm" style="background-color: #2B4C6F;"></span>
                <span class="h-9 w-5 rounded-sm shadow-sm" style="background-color: #1A365D;"></span>
              </div>
            </a>

            <!-- BST 2: Roselle -->
            <a href="cam-hung-mau-sac/index.html" class="group flex items-center justify-between gap-3.5 rounded-xl border border-gray-200/90 bg-[#FAF8F5] p-3.5 shadow-sm hover:border-[#0F4C3A]/50 hover:shadow-md transition-all">
              <div class="flex items-center gap-3">
                <img src="images/room-purple-clean.jpg" alt="BST Roselle" class="h-14 w-15 rounded-lg object-cover">
                <div>
                  <h4 class="text-[14px] font-bold text-gray-900 group-hover:text-[#0F4C3A] transition-colors">Bộ sưu tập Roselle</h4>
                  <p class="text-[12px] text-gray-500 mt-0.5">Ngọt ngào, nhẹ nhàng</p>
                </div>
              </div>
              <div class="flex gap-1.5 shrink-0">
                <span class="h-9 w-5 rounded-sm shadow-sm" style="background-color: #F3E1EC;"></span>
                <span class="h-9 w-5 rounded-sm shadow-sm" style="background-color: #E5A8C5;"></span>
                <span class="h-9 w-5 rounded-sm shadow-sm" style="background-color: #DDB3D8;"></span>
                <span class="h-9 w-5 rounded-sm shadow-sm" style="background-color: #9D4EDD;"></span>
              </div>
            </a>

            <!-- BST 3: Earthy -->
            <a href="cam-hung-mau-sac/index.html" class="group flex items-center justify-between gap-3.5 rounded-xl border border-gray-200/90 bg-[#FAF8F5] p-3.5 shadow-sm hover:border-[#0F4C3A]/50 hover:shadow-md transition-all">
              <div class="flex items-center gap-3">
                <img src="images/043_6f3c1edac_generated_image.png" alt="BST Earthy" class="h-14 w-15 rounded-lg object-cover">
                <div>
                  <h4 class="text-[14px] font-bold text-gray-900 group-hover:text-[#0F4C3A] transition-colors">Bộ sưu tập Earthy</h4>
                  <p class="text-[12px] text-gray-500 mt-0.5">Ấm áp, gần gũi</p>
                </div>
              </div>
              <div class="flex gap-1.5 shrink-0">
                <span class="h-9 w-5 rounded-sm shadow-sm" style="background-color: #E7DEC8;"></span>
                <span class="h-9 w-5 rounded-sm shadow-sm" style="background-color: #C5A880;"></span>
                <span class="h-9 w-5 rounded-sm shadow-sm" style="background-color: #9C6644;"></span>
                <span class="h-9 w-5 rounded-sm shadow-sm" style="background-color: #6F4E37;"></span>
              </div>
            </a>
          </div>

        </div>
      </div>
    </section>

    <!-- 7. DỰ ÁN & CÔNG TRÌNH (BỐ CỤC THEO ẢNH MẪU: 24% TRÁI LÀ TIÊU ĐỀ, 76% PHẢI LÀ 4 ẢNH CÔNG TRÌNH NGANG NHAU) -->
    <section class="wanders-section bg-[#FAF8F5]">
      <div class="wanders-container">
        <div class="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          
          <!-- Cột bên trái (~24%): Tiêu đề và giới thiệu -->
          <div class="w-full lg:w-[24%] shrink-0">
            <span class="section-eyebrow section-eyebrow-gold">DỰ ÁN &amp; CÔNG TRÌNH</span>
            <h2 class="section-heading">
              Dấu ấn WANDERS trên từng công trình.
            </h2>
            <p class="section-desc mt-3">
              Khám phá những không gian kiến trúc và giải pháp hoàn thiện cùng WANDERS.
            </p>
          </div>

          <!-- Cột bên phải (~76%): 4 Card ảnh công trình độ phân giải cao -->
          <div class="w-full lg:w-[76%] grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            <!-- 1. Biệt thự (Ảnh 659x371 sắc nét) -->
            <a href="du-an/index.html" class="group block overflow-hidden rounded-xl bg-white border border-gray-200/90 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
              <div class="aspect-[4/3] overflow-hidden bg-gray-100">
                <img src="images/019_2dae2fe94_generated_image.png" alt="Biệt thự hoàn thiện sơn WANDERS" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108">
              </div>
              <div class="p-3.5 flex items-center gap-2.5">
                <svg class="h-4 w-4 text-[#0F4C3A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                <span class="text-[14px] font-bold text-gray-900 group-hover:text-[#0F4C3A] transition-colors">Biệt thự</span>
              </div>
            </a>

            <!-- 2. Nhà phố (Ảnh 376x282 sắc nét) -->
            <a href="du-an/index.html" class="group block overflow-hidden rounded-xl bg-white border border-gray-200/90 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
              <div class="aspect-[4/3] overflow-hidden bg-gray-100">
                <img src="images/040_46a08f9f8_generated_image.png" alt="Nhà phố hoàn thiện sơn WANDERS" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108">
              </div>
              <div class="p-3.5 flex items-center gap-2.5">
                <svg class="h-4 w-4 text-[#0F4C3A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <span class="text-[14px] font-bold text-gray-900 group-hover:text-[#0F4C3A] transition-colors">Nhà phố</span>
              </div>
            </a>

            <!-- 3. Căn hộ (Ảnh 376x282 sắc nét) -->
            <a href="du-an/index.html" class="group block overflow-hidden rounded-xl bg-white border border-gray-200/90 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
              <div class="aspect-[4/3] overflow-hidden bg-gray-100">
                <img src="images/043_6f3c1edac_generated_image.png" alt="Căn hộ hoàn thiện sơn WANDERS" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108">
              </div>
              <div class="p-3.5 flex items-center gap-2.5">
                <svg class="h-4 w-4 text-[#0F4C3A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                <span class="text-[14px] font-bold text-gray-900 group-hover:text-[#0F4C3A] transition-colors">Căn hộ</span>
              </div>
            </a>

            <!-- 4. Công trình thương mại (Ảnh 1440x480 sắc nét) -->
            <a href="du-an/index.html" class="group block overflow-hidden rounded-xl bg-white border border-gray-200/90 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
              <div class="aspect-[4/3] overflow-hidden bg-gray-100">
                <img src="images/047_80052f6df_generated_image.png" alt="Công trình thương mại hoàn thiện sơn WANDERS" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108">
              </div>
              <div class="p-3.5 flex items-center gap-2.5">
                <svg class="h-4 w-4 text-[#0F4C3A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/></svg>
                <span class="text-[14px] font-bold text-gray-900 group-hover:text-[#0F4C3A] transition-colors">Công trình thương mại</span>
              </div>
            </a>
          </div>

        </div>
      </div>
    </section>

    <!-- 8. VÌ SAO CHỌN WANDERS (DẢI THÔNG TIN NGANG VỚI 4 LỢI THẾ CÓ ICON LỚN RÕ NÉT) -->
    <section class="wanders-section bg-white border-y border-gray-200/90">
      <div class="wanders-container">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          
          <!-- Bên trái: Tiêu đề lớn -->
          <div class="max-w-xs shrink-0">
            <span class="section-eyebrow section-eyebrow-gold">VÌ SAO CHỌN WANDERS</span>
            <h2 class="section-heading text-[26px] sm:text-[30px]">
              WANDERS – Chất lượng tạo nên giá trị bền vững.
            </h2>
          </div>

          <!-- Bên phải: 4 lợi thế có icon lớn và nội dung chuẩn font -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6 flex-1">
            <!-- 1. Chất lượng sản phẩm -->
            <div class="text-center md:text-left">
              <div class="mx-auto md:mx-0 flex h-14 w-14 items-center justify-center rounded-xl bg-[#FAF8F5] text-[#0F4C3A] mb-3.5 border border-gray-100 shadow-sm">
                <svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3h12l4 6-10 13L2 9Z"/></svg>
              </div>
              <h4 class="text-[15px] font-bold text-gray-900">Chất lượng sản phẩm</h4>
              <p class="text-[13px] text-gray-500 mt-1 leading-normal">Bền màu, bền bỉ theo thời gian</p>
            </div>

            <!-- 2. Công nghệ & nguyên liệu -->
            <div class="text-center md:text-left">
              <div class="mx-auto md:mx-0 flex h-14 w-14 items-center justify-center rounded-xl bg-[#FAF8F5] text-[#0F4C3A] mb-3.5 border border-gray-100 shadow-sm">
                <svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 2v7.31L4.69 19.3A2 2 0 0 0 6.44 22h11.12a2 2 0 0 0 1.75-2.7L14 9.31V2"/></svg>
              </div>
              <h4 class="text-[15px] font-bold text-gray-900">Công nghệ &amp; nguyên liệu</h4>
              <p class="text-[13px] text-gray-500 mt-1 leading-normal">An toàn, thân thiện môi trường</p>
            </div>

            <!-- 3. Giải pháp đa dạng -->
            <div class="text-center md:text-left">
              <div class="mx-auto md:mx-0 flex h-14 w-14 items-center justify-center rounded-xl bg-[#FAF8F5] text-[#0F4C3A] mb-3.5 border border-gray-100 shadow-sm">
                <svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
              </div>
              <h4 class="text-[15px] font-bold text-gray-900">Giải pháp đa dạng</h4>
              <p class="text-[13px] text-gray-500 mt-1 leading-normal">Đáp ứng mọi nhu cầu</p>
            </div>

            <!-- 4. Đồng hành cùng khách hàng -->
            <div class="text-center md:text-left">
              <div class="mx-auto md:mx-0 flex h-14 w-14 items-center justify-center rounded-xl bg-[#FAF8F5] text-[#0F4C3A] mb-3.5 border border-gray-100 shadow-sm">
                <svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
              </div>
              <h4 class="text-[15px] font-bold text-gray-900">Đồng hành cùng khách hàng</h4>
              <p class="text-[13px] text-gray-500 mt-1 leading-normal">Tư vấn chuyên nghiệp, tận tâm</p>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- 9. CTA CUỐI TRANG (BANNER CARD BO GÓC NỀN XANH WANDERS ĐẬM, HÌNH CON LĂN SƠN, NÚT NHẬN TƯ VẤN & HOTLINE) -->
    <section id="cta-cuoi-trang" class="py-14 lg:py-18 bg-white">
      <div class="wanders-container">
        <div class="cta-banner-box">
          
          <!-- Bên trái: Tiêu đề lớn & mô tả -->
          <div class="max-w-md text-center lg:text-left z-10">
            <h2 class="cta-heading">
              Cùng WANDERS kiến tạo<br>không gian sống bền đẹp.
            </h2>
            <p class="cta-desc">
              Liên hệ với chúng tôi để được tư vấn giải pháp sơn phù hợp cho công trình.
            </p>
          </div>

          <!-- Ở giữa: Đồ họa con lăn sơn đang lăn vệt sơn mới -->
          <div class="hidden md:flex items-center justify-center shrink-0 z-10 px-4">
            <svg class="h-24 w-auto opacity-95 drop-shadow-xl" viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <!-- Fresh paint trail -->
              <path d="M10 40 L115 40" stroke="#257A5F" stroke-width="32" stroke-linecap="round"/>
              <path d="M25 40 L105 40" stroke="#2E8B6D" stroke-width="22" stroke-linecap="round" opacity="0.6"/>
              <!-- Roller cylinder -->
              <rect x="105" y="18" width="30" height="42" rx="5" fill="#E8F1EC" stroke="#082A1F" stroke-width="2"/>
              <rect x="110" y="22" width="20" height="34" rx="3" fill="#3D9B79"/>
              <!-- Metal arm bracket -->
              <path d="M120 60 L120 72 L150 72 L150 40" stroke="#CBD5E1" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
              <!-- Handle -->
              <path d="M150 72 L172 78" stroke="#94A3B8" stroke-width="4.5" stroke-linecap="round"/>
              <rect x="165" y="73" width="28" height="11" rx="3.5" fill="#D97706" transform="rotate(14 165 73)"/>
            </svg>
          </div>

          <!-- Bên phải: 2 Nút Nhận tư vấn & Hotline -->
          <div class="flex flex-col sm:flex-row items-center gap-4 shrink-0 z-10 w-full sm:w-auto justify-center">
            <a href="lien-he/index.html" class="btn-primary-white w-full sm:w-auto justify-center">
              <span>Nhận tư vấn</span>
              <span class="font-bold">→</span>
            </a>
            <a href="tel:0937760688" class="btn-secondary-phone w-full sm:w-auto justify-center">
              <svg class="h-4 w-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <span>0937.760.688</span>
            </a>
          </div>

        </div>
      </div>
    </section>

    <!-- 10. NĂNG LỰC SẢN XUẤT & ĐỐI TÁC (ẢNH NHÀ MÁY LỚN SẮC NÉT, VẠCH VÀNG GOLD TIÊU ĐỀ, LƯỚI ĐỐI TÁC 4 CỘT) -->
    <section class="wanders-section bg-[#FAF8F5] border-b border-gray-200/90">
      <div class="wanders-container">
        
        <!-- Năng lực sản xuất: 50% ảnh lớn, 50% nội dung -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div class="lg:col-span-6 overflow-hidden rounded-2xl aspect-[16/11] bg-gray-100 shadow-md">
            <img src="images/facility-wanders.png" alt="Nhà máy sản xuất sơn WANDERS" class="h-full w-full object-cover">
          </div>
          <div class="lg:col-span-6">
            <!-- Vạch đứng vàng gold bên trái tiêu đề đúng ảnh mẫu -->
            <div class="border-l-4 border-[#D6AD45] pl-4 mb-4">
              <h3 class="font-serif text-[28px] sm:text-[34px] font-bold text-gray-900 leading-tight">
                Dây chuyền chuyển giao<br>công nghệ Anh Quốc
              </h3>
            </div>
            
            <p class="section-desc mt-3 text-[14.5px] leading-relaxed">
              Ứng dụng công nghệ sơn tiên tiến được chuyển giao từ Anh Quốc, đảm bảo chất lượng ổn định, an toàn và thân thiện với môi trường, đáp ứng các tiêu chuẩn khắt khe trong ngành sơn và vật liệu hoàn thiện.
            </p>

            <!-- Lưới đối tác đồng hành 4 cột x 2 hàng nằm ngay bên dưới phần mô tả đúng ảnh mẫu -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 items-center mt-6">
              <div class="flex h-12 items-center justify-center rounded-lg border border-gray-200/80 bg-[#FAF9F5] text-xs font-bold text-gray-700 shadow-sm hover:border-[#0F4C3A]/30 transition-all">ACC</div>
              <div class="flex h-12 items-center justify-center rounded-lg border border-gray-200/80 bg-[#FAF9F5] text-xs font-bold text-gray-700 shadow-sm hover:border-[#0F4C3A]/30 transition-all">TRONOX</div>
              <div class="flex h-12 items-center justify-center rounded-lg border border-gray-200/80 bg-[#FAF9F5] text-xs font-bold text-red-600 shadow-sm hover:border-[#0F4C3A]/30 transition-all">DOW</div>
              <div class="flex h-12 items-center justify-center rounded-lg border border-gray-200/80 bg-[#FAF9F5] text-xs font-bold text-gray-800 shadow-sm hover:border-[#0F4C3A]/30 transition-all">ROHM HAAS</div>
              <div class="flex h-12 items-center justify-center rounded-lg border border-gray-200/80 bg-[#FAF9F5] text-xs font-bold text-purple-700 shadow-sm hover:border-[#0F4C3A]/30 transition-all">TPBank</div>
              <div class="flex h-12 items-center justify-center rounded-lg border border-gray-200/80 bg-[#FAF9F5] text-xs font-bold text-gray-700 shadow-sm hover:border-[#0F4C3A]/30 transition-all">DEGUSSA</div>
              <div class="flex h-12 items-center justify-center rounded-lg border border-gray-200/80 bg-[#FAF9F5] text-xs font-bold text-blue-700 shadow-sm hover:border-[#0F4C3A]/30 transition-all">nuplex</div>
              <div class="flex h-12 items-center justify-center rounded-lg border border-gray-200/80 bg-[#FAF9F5] text-xs font-bold text-blue-800 shadow-sm hover:border-[#0F4C3A]/30 transition-all">VietinBank</div>
            </div>

          </div>
        </div>

      </div>
    </section>

    <!-- 11. FOOTER (NỀN XANH LÁ ĐẬM #073B2E, CHỮ TRẮNG, PHÂN CẤP 4 CỘT THEO ĐÚNG MASTER PROMPT) -->
    <footer class="bg-[#073B2E] text-white pt-14 pb-8 border-t border-emerald-900/50">
      <div class="wanders-container">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-emerald-800/60">
          
          <!-- Cột 1: Thương hiệu -->
          <div>
            <span class="relative inline-flex flex-col mb-4">
              <span class="font-bold tracking-tight text-[26px] leading-none text-white">
                WANDERS<sup>®</sup>
              </span>
              <svg class="w-[102px] h-[7px] -mt-[1px]" viewBox="0 0 108 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 5.5C28 1.5 68 1.5 107 4.5" stroke="#D6AD45" stroke-width="2.6" stroke-linecap="round"/>
              </svg>
            </span>
            <p class="text-[13.5px] text-gray-300 leading-relaxed mt-2.5">
              Thương hiệu sơn và vật liệu hoàn thiện cho không gian sống hiện đại, bền vững và đẳng cấp.
            </p>
          </div>

          <!-- Cột 2: Sản phẩm -->
          <div>
            <h4 class="text-[14px] font-bold uppercase tracking-wider text-white mb-4">Sản phẩm</h4>
            <ul class="text-[13.5px] text-gray-300 space-y-2.5 font-medium">
              <li><a href="san-pham/son-noi-that/index.html" class="hover:text-[#D6AD45] transition-colors">Sơn nội thất</a></li>
              <li><a href="san-pham/son-ngoai-that/index.html" class="hover:text-[#D6AD45] transition-colors">Sơn ngoại thất</a></li>
              <li><a href="san-pham/son-lot/index.html" class="hover:text-[#D6AD45] transition-colors">Sơn lót</a></li>
              <li><a href="san-pham/son-chong-tham/index.html" class="hover:text-[#D6AD45] transition-colors">Sơn chống thấm</a></li>
              <li><a href="san-pham/son-chong-nong/index.html" class="hover:text-[#D6AD45] transition-colors">Sơn chống nóng</a></li>
              <li><a href="san-pham/san-pham-khac/index.html" class="hover:text-[#D6AD45] transition-colors">Sản phẩm khác</a></li>
            </ul>
          </div>

          <!-- Cột 3: Điều hướng -->
          <div>
            <h4 class="text-[14px] font-bold uppercase tracking-wider text-white mb-4">Điều hướng</h4>
            <ul class="text-[13.5px] text-gray-300 space-y-2.5 font-medium">
              <li><a href="gioi-thieu/index.html" class="hover:text-[#D6AD45] transition-colors">Giới thiệu</a></li>
              <li><a href="san-pham/index.html" class="hover:text-[#D6AD45] transition-colors">Sản phẩm</a></li>
              <li><a href="du-an/index.html" class="hover:text-[#D6AD45] transition-colors">Dự án</a></li>
              <li><a href="cam-hung-mau-sac/index.html" class="hover:text-[#D6AD45] transition-colors">Cảm hứng màu sắc</a></li>
              <li><a href="tin-tuc/index.html" class="hover:text-[#D6AD45] transition-colors">Tin tức</a></li>
            </ul>
          </div>

          <!-- Cột 4: Thông tin chính thức WANDERS -->
          <div>
            <h4 class="text-[14px] font-bold uppercase tracking-wider text-white mb-4">Liên hệ WANDERS</h4>
            <ul class="text-[13.5px] text-gray-300 space-y-2.5 leading-relaxed">
              <li class="flex items-center gap-2">
                <svg class="h-4 w-4 text-[#D6AD45] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <span>Hotline: <a href="tel:0937760688" class="text-white font-bold hover:underline">0937.760.688</a></span>
              </li>
              <li class="flex items-center gap-2">
                <svg class="h-4 w-4 text-[#D6AD45] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                <span>Email: <a href="mailto:wanderspaint@gmail.com" class="hover:underline">wanderspaint@gmail.com</a></span>
              </li>
              <li class="flex items-start gap-2">
                <svg class="h-4 w-4 text-[#D6AD45] shrink-0 mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>Địa chỉ: Lam Điền, Xã Quảng Bị, Thành phố Hà Nội</span>
              </li>
            </ul>
          </div>

        </div>

        <!-- Copyright bar -->
        <div class="pt-6 flex flex-col sm:flex-row items-center justify-between text-[12.5px] text-gray-400 gap-4">
          <p>© 2026 WANDERS. All rights reserved.</p>
          <div class="flex gap-5">
            <a href="gioi-thieu/index.html" class="hover:text-white transition-colors">Chính sách bảo mật</a>
            <span>|</span>
            <a href="gioi-thieu/index.html" class="hover:text-white transition-colors">Điều khoản sử dụng</a>
            <span>|</span>
            <a href="gioi-thieu/index.html" class="hover:text-white transition-colors">Chính sách bảo hành</a>
          </div>
        </div>

      </div>
    </footer>

  </div>

  <!-- Interactive JavaScript -->
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      // 1. Mobile Menu Drawer
      const toggleBtn = document.getElementById('mobileMenuToggle');
      const closeBtn = document.getElementById('mobileMenuClose');
      const drawer = document.getElementById('mobileMenuDrawer');

      if (toggleBtn && drawer) {
        toggleBtn.addEventListener('click', () => {
          drawer.classList.remove('hidden');
        });
      }
      if (closeBtn && drawer) {
        closeBtn.addEventListener('click', () => {
          drawer.classList.add('hidden');
        });
      }

      // 2. Product Filter Tabs & Carousel Interaction
      const filterTabs = document.querySelectorAll('#productFilterTabs .product-filter-tab');
      const productCards = document.querySelectorAll('.product-slide-item');
      const slider = document.getElementById('productSlider');
      const prevBtn = document.getElementById('sliderPrevBtn');
      const nextBtn = document.getElementById('sliderNextBtn');

      if (prevBtn && slider) {
        prevBtn.addEventListener('click', () => {
          slider.scrollBy({ left: -315, behavior: 'smooth' });
        });
      }
      if (nextBtn && slider) {
        nextBtn.addEventListener('click', () => {
          slider.scrollBy({ left: 315, behavior: 'smooth' });
        });
      }

      filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
          filterTabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');

          const filter = tab.getAttribute('data-filter');

          productCards.forEach(card => {
            const cardCat = card.getAttribute('data-category');
            if (filter === 'all' || cardCat === filter) {
              card.style.display = 'flex';
            } else {
              card.style.display = 'none';
            }
          });

          // Reset scroll
          if (slider) slider.scrollTo({ left: 0, behavior: 'smooth' });
        });
      });
    });
  </script>
</body>
</html>`;
}

// Write to index.html
const outPath = path.join(__dirname, '../website_download/index.html');
fs.writeFileSync(outPath, generateHomePage(), 'utf8');
console.log('Successfully generated WANDERS index.html matching MASTER PROMPT! Size:', fs.statSync(outPath).size);
