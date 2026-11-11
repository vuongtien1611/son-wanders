const fs = require('fs');
const path = require('path');

// Root directories
const BASE_DIR = path.join(__dirname, '../website_download');
const DATA_DIR = path.join(BASE_DIR, 'data');

// Load authentic WANDERS products
const products = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'wanders_products.json'), 'utf8'));

// Load authentic color palette
const colorPalette = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'color_palette.json'), 'utf8'));

// Image manifest
const manifestPath = path.join(BASE_DIR, 'images/base44/manifest.json');
const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')) : {};

// Helper to resolve image paths relative to root or subdirectories
function getImg(filename, depth = 0) {
  const prefix = depth > 0 ? '../'.repeat(depth) : './';
  return `${prefix}images/base44/${filename}`;
}

function getLocalImg(subPath, depth = 0) {
  const prefix = depth > 0 ? '../'.repeat(depth) : './';
  return `${prefix}${subPath.replace(/^\//, '')}`;
}

// Common Head Elements
function renderHead(title, description, depth = 0) {
  const prefix = depth > 0 ? '../'.repeat(depth) : './';
  return `
  <meta charset="utf-8">
  <meta content="width=device-width, initial-scale=1.0" name="viewport">
  <link rel="icon" type="image/png" href="${prefix}images/base44/a963c52b6_image.png">
  <title>${title}</title>
  <meta content="${description}" name="description">
  
  <!-- Google Fonts: Be Vietnam Pro -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet">
  
  <!-- Base44 Design System Stylesheet -->
  <link rel="stylesheet" href="${prefix}assets/base44.css">
  
  <style>
    :root {
      --background: 40 33% 96%;
      --foreground: 194 14% 18%;
      --font-body: 'Be Vietnam Pro', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      --font-heading: 'Be Vietnam Pro', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      --color-bone: #F8F6F0;
      --color-cream: #F3EEDB;
      --color-sand: #EAE3D2;
      --color-line: #E5E3DC;
      --color-charcoal: #283235;
      --color-ink: #273134;
      --color-terracotta: #D36A44;
      --color-clay: #B35532;
    }

    body {
      font-family: var(--font-body);
      background-color: #F8F6F1;
      color: #273134;
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
    }

    /* Container quy chuẩn Base44 1320px */
    .base44-container {
      max-width: 1320px;
      margin-left: auto;
      margin-right: auto;
      padding-left: 24px;
      padding-right: 24px;
      width: 100%;
      box-sizing: border-box;
    }
    @media (min-width: 768px) {
      .base44-container {
        padding-left: 40px;
        padding-right: 40px;
      }
    }

    /* Base44 Button Styles */
    .btn-terracotta {
      background-color: #D36A44;
      color: #FFFFFF !important;
      font-weight: 500;
      font-size: 13px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      padding: 14px 24px;
      display: inline-flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      border: none;
      text-decoration: none;
      transition: all 0.25s ease;
      border-radius: 0;
    }
    .btn-terracotta:hover {
      background-color: #B35532;
      transform: translateY(-1px);
    }

    .btn-charcoal {
      background-color: #283235;
      color: #F8F6F0 !important;
      font-weight: 500;
      font-size: 13px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      padding: 14px 24px;
      display: inline-flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      transition: all 0.25s ease;
      border-radius: 0;
    }
    .btn-charcoal:hover {
      background-color: #1A2325;
      transform: translateY(-1px);
    }

    .btn-outline-charcoal {
      border: 1px solid #283235;
      background: transparent;
      color: #283235 !important;
      font-weight: 500;
      font-size: 13px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      padding: 14px 24px;
      display: inline-flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      transition: all 0.25s ease;
      border-radius: 0;
    }
    .btn-outline-charcoal:hover {
      background: #283235;
      color: #F8F6F0 !important;
    }

    /* Product card style */
    .b44-product-card {
      display: block;
      background: transparent;
      text-decoration: none;
      transition: transform 0.3s ease;
    }
    .b44-product-card:hover {
      transform: translateY(-4px);
    }
    .b44-product-image-box {
      position: relative;
      aspect-ratio: 4/5;
      width: 100%;
      overflow: hidden;
      border: 1px solid #E5E3DC;
      background: linear-gradient(165deg, #F5EFE6 0%, #EAE0D0 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      box-sizing: border-box;
    }
    .b44-product-image-box img {
      max-height: 82%;
      max-width: 82%;
      object-fit: contain;
      filter: drop-shadow(0 10px 18px rgba(40, 50, 53, 0.18));
      transition: transform 0.4s ease;
    }
    .b44-product-card:hover .b44-product-image-box img {
      transform: scale(1.06);
    }
    .b44-arrow-icon {
      position: absolute;
      bottom: 16px;
      right: 16px;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(40, 50, 53, 0.2);
      background: rgba(248, 246, 240, 0.6);
      color: #283235;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    .b44-product-card:hover .b44-arrow-icon {
      opacity: 1;
    }
  </style>
  `;
}

// Common Header
function renderHeader(activePage = 'home', depth = 0) {
  const prefix = depth > 0 ? '../'.repeat(depth) : './';
  
  const navItems = [
    { id: 'san-pham', label: 'Sản phẩm', href: `${prefix}san-pham.html` },
    { id: 'bang-mau', label: 'Bảng màu', href: `${prefix}bang-mau.html` },
    { id: 'du-an', label: 'Dự án', href: `${prefix}du-an.html` },
    { id: 'gioi-thieu', label: 'Giới thiệu', href: `${prefix}gioi-thieu.html` },
    { id: 'lien-he', label: 'Liên hệ', href: `${prefix}lien-he.html` }
  ];

  return `
  <header class="sticky top-0 z-50 border-b border-[#E5E3DC] bg-[#F8F6F0]/95 backdrop-blur-md transition-shadow duration-300">
    <div class="base44-container flex h-[76px] items-center justify-between gap-6 md:h-[86px]">
      
      <!-- Brand Logo -->
      <a class="flex shrink-0 items-center gap-3.5 text-decoration-none" href="${prefix}index.html">
        <span class="inline-block relative h-10 w-10 md:h-11 md:w-11">
          <img class="w-full h-full object-contain" alt="Logo WANDERS" src="${prefix}images/base44/a963c52b6_image.png">
        </span>
        <span class="flex flex-col">
          <span class="font-bold tracking-tight text-[22px] md:text-[25px] leading-none text-[#283235]">WANDERS</span>
          <span class="text-[9px] md:text-[9.5px] uppercase tracking-[0.24em] text-[#68716D] font-medium mt-1">DEINE WAND MAL ANDERS</span>
        </span>
      </a>

      <!-- Desktop Navigation Menu -->
      <nav class="hidden md:flex items-center gap-8 lg:gap-10">
        ${navItems.map(item => {
          const isActive = activePage === item.id;
          return `
            <a href="${item.href}" class="text-[13.5px] font-medium tracking-wide transition-colors duration-200 ${isActive ? 'text-[#283235] font-semibold border-b-2 border-[#D36A44] pb-1' : 'text-[#68716D] hover:text-[#283235]'}">
              ${item.label}
            </a>
          `;
        }).join('')}
      </nav>

      <!-- CTA Button & Mobile Toggle -->
      <div class="flex items-center gap-4">
        <a href="${prefix}lien-he.html" class="hidden sm:inline-flex items-center gap-2 bg-[#283235] hover:bg-[#1A2325] text-[#F8F6F0] text-[12px] font-medium uppercase tracking-[0.16em] px-5 py-3 transition-colors duration-200">
          <span>TƯ VẤN CHỌN SƠN</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </a>

        <!-- Mobile Menu Toggle Button -->
        <button id="mobileMenuBtn" aria-label="Toggle menu" class="md:hidden flex items-center justify-center p-2 text-[#283235] focus:outline-none">
          <svg id="hamburgerIcon" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          <svg id="closeIcon" class="w-6 h-6 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

    </div>

    <!-- Mobile Drawer Navigation -->
    <div id="mobileDrawer" class="hidden md:hidden border-t border-[#E5E3DC] bg-[#F8F6F0] px-6 py-6 transition-all duration-300">
      <div class="flex flex-col gap-4">
        ${navItems.map(item => `
          <a href="${item.href}" class="text-[16px] font-medium ${activePage === item.id ? 'text-[#D36A44] font-semibold' : 'text-[#283235]'} py-2 border-b border-[#E5E3DC]/60">
            ${item.label}
          </a>
        `).join('')}
        <a href="${prefix}lien-he.html" class="mt-4 flex items-center justify-between bg-[#283235] text-[#F8F6F0] text-[13px] font-medium uppercase tracking-[0.14em] px-5 py-3.5">
          <span>TƯ VẤN CHỌN SƠN</span>
          <span>→</span>
        </a>
      </div>
    </div>
  </header>
  `;
}

// Common Footer
function renderFooter(depth = 0) {
  const prefix = depth > 0 ? '../'.repeat(depth) : './';

  return `
  <!-- BASE44 FOOTER -->
  <footer class="bg-[#283235] text-[#F8F6F0]/70 border-t border-[#384346]">
    <div class="base44-container py-16 md:py-20">
      <div class="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr] lg:gap-10">
        
        <!-- Cột 1: Thương hiệu WANDERS -->
        <div>
          <div class="flex items-center gap-3">
            <span class="bg-[#F8F6F0] p-1.5 inline-block">
              <img class="h-9 w-9 object-contain" alt="WANDERS Logo" src="${prefix}images/base44/a963c52b6_image.png">
            </span>
            <div class="flex flex-col">
              <span class="font-bold tracking-tight text-[22px] leading-none text-white">WANDERS</span>
              <span class="text-[9.5px] uppercase tracking-[0.24em] text-[#F8F6F0]/70 font-medium mt-1">DEINE WAND MAL ANDERS</span>
            </div>
          </div>
          <p class="mt-6 max-w-[38ch] text-[14px] leading-relaxed text-[#F8F6F0]/70">
            Sơn trang trí và giải pháp màu sắc cho không gian sống hiện đại — mỗi bức tường, một dấu ấn riêng cùng công nghệ chất lượng cao.
          </p>
          <div class="mt-8 flex items-center gap-3">
            <span class="inline-block h-2 w-2 rounded-full bg-[#D36A44]"></span>
            <span class="text-[12px] uppercase tracking-[0.16em] text-[#F8F6F0]/60">Công nghệ Anh Quốc · Tiêu chuẩn ISO 9001:2015</span>
          </div>
        </div>

        <!-- Cột 2: Sản phẩm -->
        <div>
          <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-white">Sản phẩm</p>
          <ul class="mt-5 space-y-3 text-[13.5px]">
            <li><a href="${prefix}san-pham.html?nhom=noi-that" class="hover:text-white transition-colors">Sơn nội thất cao cấp</a></li>
            <li><a href="${prefix}san-pham.html?nhom=ngoai-that" class="hover:text-white transition-colors">Sơn ngoại thất bền màu</a></li>
            <li><a href="${prefix}san-pham.html?nhom=chong-tham" class="hover:text-white transition-colors">Sơn chống thấm đa năng</a></li>
            <li><a href="${prefix}san-pham.html?nhom=son-lot" class="hover:text-white transition-colors">Sơn lót kháng kiềm</a></li>
            <li><a href="${prefix}san-pham.html?nhom=chong-nong" class="hover:text-white transition-colors">Sơn chống nóng cách nhiệt</a></li>
            <li><a href="${prefix}san-pham.html?nhom=khac" class="hover:text-white transition-colors">Sản phẩm hoàn thiện khác</a></li>
          </ul>
        </div>

        <!-- Cột 3: Khám phá -->
        <div>
          <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-white">Khám phá</p>
          <ul class="mt-5 space-y-3 text-[13.5px]">
            <li><a href="${prefix}bang-mau.html" class="hover:text-white transition-colors">Bảng màu &amp; Color Studio</a></li>
            <li><a href="${prefix}du-an.html" class="hover:text-white transition-colors">Dự án &amp; Công trình</a></li>
            <li><a href="${prefix}gioi-thieu.html" class="hover:text-white transition-colors">Về thương hiệu WANDERS</a></li>
            <li><a href="${prefix}lien-he.html" class="hover:text-white transition-colors">Liên hệ tư vấn</a></li>
            <li><a href="${prefix}cam-hung-mau-sac.html" class="hover:text-white transition-colors">Cảm hứng màu sắc</a></li>
          </ul>
        </div>

        <!-- Cột 4: Liên hệ chính thức WANDERS -->
        <div>
          <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-white">Liên hệ chính thức</p>
          <ul class="mt-5 space-y-3.5 text-[13.5px] leading-relaxed">
            <li class="flex items-start gap-2.5">
              <span class="text-[#D36A44] font-bold">Hotline:</span>
              <a href="tel:0937760688" class="text-white font-medium hover:underline">0937.760.688</a>
            </li>
            <li class="flex items-start gap-2.5">
              <span class="text-[#D36A44] font-bold">Email:</span>
              <a href="mailto:wanderspaint@gmail.com" class="text-white hover:underline">wanderspaint@gmail.com</a>
            </li>
            <li class="flex items-start gap-2.5">
              <span class="text-[#D36A44] font-bold shrink-0">Địa chỉ:</span>
              <span>Lam Điền, Xã Quảng Bị, Thành phố Hà Nội</span>
            </li>
            <li class="flex items-start gap-2.5">
              <span class="text-[#D36A44] font-bold shrink-0">Nhà máy:</span>
              <span>Khu công nghiệp Ngọc Hồi, Thanh Trì, Hà Nội</span>
            </li>
          </ul>
        </div>

      </div>

      <!-- Copyright & Legal -->
      <div class="mt-16 border-t border-[#384346] pt-8 flex flex-col sm:flex-row items-center justify-between text-[12px] text-[#F8F6F0]/50 gap-4">
        <p>© 2026 WANDERS Paint. All rights reserved.</p>
        <div class="flex gap-6">
          <a href="${prefix}gioi-thieu.html" class="hover:text-white transition-colors">Chính sách bảo mật</a>
          <span>·</span>
          <a href="${prefix}gioi-thieu.html" class="hover:text-white transition-colors">Điều khoản sử dụng</a>
          <span>·</span>
          <a href="${prefix}gioi-thieu.html" class="hover:text-white transition-colors">Quy chuẩn kỹ thuật</a>
        </div>
      </div>
    </div>
  </footer>

  <!-- Base44 Global Script -->
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      // Mobile menu toggle
      const btn = document.getElementById('mobileMenuBtn');
      const drawer = document.getElementById('mobileDrawer');
      const hamburger = document.getElementById('hamburgerIcon');
      const close = document.getElementById('closeIcon');

      if (btn && drawer) {
        btn.addEventListener('click', () => {
          const isOpen = !drawer.classList.contains('hidden');
          if (isOpen) {
            drawer.classList.add('hidden');
            hamburger.classList.remove('hidden');
            close.classList.add('hidden');
          } else {
            drawer.classList.remove('hidden');
            hamburger.classList.add('hidden');
            close.classList.remove('hidden');
          }
        });
      }
    });
  </script>
  `;
}

console.log('Base components initialized.');
module.exports = {
  renderHead,
  renderHeader,
  renderFooter,
  products,
  colorPalette,
  getImg,
  getLocalImg
};

