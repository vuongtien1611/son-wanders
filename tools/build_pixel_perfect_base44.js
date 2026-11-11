const fs = require('fs');
const path = require('path');

const AUDIT_DIR = path.join(__dirname, '../audit_base44');
const BASE_DIR = path.join(__dirname, '../website_download');
const DATA_DIR = path.join(BASE_DIR, 'data');

// Load authentic products and palette
const products = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'wanders_products.json'), 'utf8'));
const colorPalette = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'color_palette.json'), 'utf8'));
const manifest = JSON.parse(fs.readFileSync(path.join(BASE_DIR, 'images/base44/manifest.json'), 'utf8'));

// Build filename map
const fileMap = {};
for (const [url, localPath] of Object.entries(manifest)) {
  const m = url.match(/([a-zA-Z0-9_-]+\.(?:png|jpg|jpeg|webp|svg))/i);
  if (m) fileMap[m[1]] = localPath;
}

// Global text and image replacer
function transformBase44Html(html, depth = 0) {
  const prefix = depth > 0 ? '../'.repeat(depth) : './';

  let res = html;

  // 1. Replace remote images
  res = res.replace(/https:\/\/media\.base44\.com\/images\/public\/[^\s"'>)]+/g, (matched) => {
    const m = matched.match(/([a-zA-Z0-9_-]+\.(?:png|jpg|jpeg|webp|svg))/i);
    if (m && fileMap[m[1]]) {
      return prefix + fileMap[m[1]];
    }
    return matched;
  });

  // 2. Replace placeholders
  res = res.replace(/\[Cập nhật hotline\]/g, '<a href="tel:0937760688" class="hover:underline">0937.760.688</a>');
  res = res.replace(/\[Cập nhật email\]/g, '<a href="mailto:wanderspaint@gmail.com" class="hover:underline">wanderspaint@gmail.com</a>');
  res = res.replace(/\[Cập nhật địa chỉ showroom\]/g, 'Lam Điền, Xã Quảng Bị, Thành phố Hà Nội');
  res = res.replace(/\[Cập nhật giờ làm việc\]/g, 'Thứ Hai – Chủ Nhật: 08:00 – 18:00');

  // 3. Update internal links
  res = res.replace(/href="\/(san-pham|bang-mau|du-an|gioi-thieu|lien-he)"/g, `href="${prefix}$1.html"`);
  res = res.replace(/href="\/(san-pham\?[^"]+)"/g, `href="${prefix}$1"`);
  res = res.replace(/href="\/"/g, `href="${prefix}index.html"`);

  return res;
}

// Read raw templates
let headerHtml = fs.readFileSync(path.join(AUDIT_DIR, 'header.html'), 'utf8');
let footerHtml = fs.readFileSync(path.join(AUDIT_DIR, 'footer.html'), 'utf8');

function renderPage(title, description, mainContent, activeNav = 'home', depth = 0) {
  const prefix = depth > 0 ? '../'.repeat(depth) : './';
  
  let header = transformBase44Html(headerHtml, depth);
  let footer = transformBase44Html(footerHtml, depth);
  let content = transformBase44Html(mainContent, depth);

  // Set active nav in header
  if (activeNav && activeNav !== 'home') {
    header = header.replace(new RegExp(`href="${prefix}${activeNav}\\.html"([^>]*)`, 'g'), `href="${prefix}${activeNav}.html" data-status="active"$1`);
  } else if (activeNav === 'home') {
    header = header.replace(new RegExp(`href="${prefix}index\\.html"([^>]*)`, 'g'), `href="${prefix}index.html" data-status="active"$1`);
  }

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta content="width=device-width, initial-scale=1.0" name="viewport">
  <link rel="icon" type="image/png" href="${prefix}images/base44/a963c52b6_image.png">
  <title>${title}</title>
  <meta content="${description}" name="description">
  
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet">
  
  <link rel="stylesheet" href="${prefix}assets/base44.css">
  <link rel="stylesheet" href="${prefix}assets/wanders_header_dropdown.css">
</head>
<body class="bg-bone text-charcoal font-body antialiased">
  ${header}
  <main>
    ${content}
  </main>
  ${footer}

  <!-- Mobile Drawer Toggle Script -->
  <div id="b44MobileMenuDrawer" class="fixed inset-x-0 top-[76px] z-40 hidden border-b border-line bg-bone px-6 py-8 shadow-2xl transition-all duration-300 md:hidden">
    <nav class="flex flex-col gap-5">
      <a class="text-[16px] font-medium text-charcoal hover:text-terracotta" href="${prefix}gioi-thieu.html">Giới thiệu</a>
      <a class="text-[16px] font-medium text-charcoal hover:text-terracotta" href="${prefix}san-pham.html">Sản phẩm</a>
      <a class="text-[16px] font-medium text-charcoal hover:text-terracotta" href="${prefix}bang-mau.html">Bảng màu</a>
      <a class="text-[16px] font-medium text-charcoal hover:text-terracotta" href="${prefix}du-an.html">Dự án</a>
      <a class="text-[16px] font-medium text-charcoal hover:text-terracotta" href="${prefix}lien-he.html">Liên hệ</a>
      <a class="mt-4 inline-flex items-center justify-between bg-charcoal px-6 py-4 text-[12px] font-medium uppercase tracking-[0.14em] text-bone" href="${prefix}lien-he.html">
        <span>Tư vấn chọn sơn</span>
        <span>→</span>
      </a>
    </nav>
  </div>

  <script>
    document.addEventListener('DOMContentLoaded', () => {
      // Mobile menu toggle
      const menuBtn = document.querySelector('header button[aria-label=\"Mở menu\"]');
      const drawer = document.getElementById('b44MobileMenuDrawer');
      if (menuBtn && drawer) {
        menuBtn.addEventListener('click', () => {
          drawer.classList.toggle('hidden');
        });
      }
    });
  </script>
  <script src="${prefix}assets/wanders_nav_dropdown.js"></script>
</body>
</html>`;
}

// Save helper for root and subfolder
function saveBoth(fileName, folderName, html) {
  fs.writeFileSync(path.join(BASE_DIR, fileName), html);
  console.log(`Saved root: ${fileName}`);
  if (folderName) {
    const fPath = path.join(BASE_DIR, folderName);
    if (!fs.existsSync(fPath)) fs.mkdirSync(fPath, { recursive: true });
    const subHtml = html
      .replace(/href="\.\//g, 'href="../')
      .replace(/src="\.\//g, 'src="../')
      .replace(/href="\.\.\/assets\//g, 'href="../assets/')
      .replace(/src="\.\.\/images\//g, 'src="../images/');
    fs.writeFileSync(path.join(fPath, 'index.html'), subHtml);
    console.log(`Saved folder: ${folderName}/index.html`);
  }
}

// ========================================================
// 1. BUILD HOMEPAGE (index.html)
// ========================================================
function buildHomepage() {
  console.log('Building Pixel-Perfect Homepage...');

  // Curate 4 real WANDERS products for Catalogue Section using authentic Excel images
  const featured = [
    {
      code: 'EX555',
      name: 'Sơn Ngoại Thất Bền Đẹp',
      desc: 'Giữ màu mặt tiền dưới nắng mưa và sương muối.',
      packaging: '5L & 18L',
      image: './images/products/wanders-ex-555.jpeg',
      link: './san-pham/satin-for-exterior-ex5000/index.html',
      cat: 'son-ngoai-that'
    },
    {
      code: 'IN3*',
      name: 'Sơn Nội Thất Che Phủ Hiệu Quả',
      desc: 'Bề mặt mờ mịn màng, độ phủ cao và an toàn sức khỏe.',
      packaging: '5L & 18L',
      image: './images/products/wanders-in-3.jpeg',
      link: './san-pham/bronze-for-interior-in3000/index.html',
      cat: 'son-noi-that'
    },
    {
      code: 'WATERPROOF-CT B5',
      name: 'Sơn Chống Thấm Pha Xi Măng B5',
      desc: 'Màng thở đanh chắc, chống thấm ngược hoàn hảo.',
      packaging: '5L & 18L',
      image: './images/products/wanders-ct-xi-mang.jpeg',
      link: './san-pham/waterproof-nano-wnano/index.html',
      cat: 'chong-tham'
    },
    {
      code: 'LĐN 515',
      name: 'Sơn Lót Kiềm Đa Năng',
      desc: 'Tăng cường bám dính, kháng kiềm hóa tối ưu.',
      packaging: '5L & 18L',
      image: './images/products/wanders-lot-da-nang.jpeg',
      link: './san-pham/sealer-super-sp5000/index.html',
      cat: 'son-lot'
    }
  ];

  // Read section 0 to 10
  let s0 = fs.readFileSync(path.join(AUDIT_DIR, 'section_0.html'), 'utf8');
  let s1 = fs.readFileSync(path.join(AUDIT_DIR, 'section_1.html'), 'utf8');
  let s2 = fs.readFileSync(path.join(AUDIT_DIR, 'section_2.html'), 'utf8');
  let s3 = fs.readFileSync(path.join(AUDIT_DIR, 'section_3.html'), 'utf8');
  let s4 = fs.readFileSync(path.join(AUDIT_DIR, 'section_4.html'), 'utf8');
  let s5 = fs.readFileSync(path.join(AUDIT_DIR, 'section_5.html'), 'utf8');
  let s6 = fs.readFileSync(path.join(AUDIT_DIR, 'section_6.html'), 'utf8');
  let s7 = fs.readFileSync(path.join(AUDIT_DIR, 'section_7.html'), 'utf8');
  let s8 = fs.readFileSync(path.join(AUDIT_DIR, 'section_8.html'), 'utf8');
  let s9 = fs.readFileSync(path.join(AUDIT_DIR, 'section_9.html'), 'utf8');
  let s10 = fs.readFileSync(path.join(AUDIT_DIR, 'section_10.html'), 'utf8');

  // Customize Section 3 (Catalogue) with real WANDERS products
  const productCardsHtml = featured.map(p => `
    <a class="group block b44-card" href="${p.link}" data-cat="${p.cat}">
      <div class="relative aspect-[4/5] w-full overflow-hidden border border-line bg-gradient-to-br from-[#F5EFE6] to-[#EAE0D0] flex items-center justify-center p-4">
        <span class="absolute inset-x-0 top-0 flex items-center justify-between px-4 py-3 z-10">
          <span class="text-[9.5px] uppercase tracking-[0.18em] text-charcoal/70 font-mono font-bold">${p.code}</span>
          <span class="text-[9px] uppercase tracking-[0.14em] text-terracotta font-semibold">${p.packaging}</span>
        </span>
        <img src="${p.image}" class="product-image h-full w-full object-contain object-center drop-shadow-md group-hover:scale-105 transition-transform duration-300 p-2" style="width:100%;height:100%;object-fit:contain;object-position:center;" alt="${p.name}">
        <span class="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center border border-charcoal/20 bg-bone/40 text-charcoal opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-up-right h-4 w-4"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg>
        </span>
      </div>
      <h3 class="mt-4 text-[15.5px] font-semibold leading-snug text-charcoal group-hover:text-terracotta transition-colors">${p.name}</h3>
      <p class="mt-2 text-[13px] leading-relaxed text-ink line-clamp-2">${p.desc}</p>
      <span class="mt-3 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-terracotta">Xem chi tiết<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-up-right h-3.5 w-3.5"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg></span>
    </a>
  `).join('');

  // Replace product cards inside Section 3
  s3 = s3.replace(/<div class="mt-9 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/, `
    <div class="mt-9 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4" id="homeCatalogueGrid">
      ${productCardsHtml}
    </div>
  </div></section>`);

  const fullMain = [s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10].join('\n');
  const homeHtml = renderPage(
    'WANDERS — Sơn trang trí & Color Studio',
    'Sơn trang trí và giải pháp màu sắc cho không gian sống hiện đại — mỗi bức tường, một dấu ấn riêng.',
    fullMain,
    'home',
    0
  );

  // Add interactive Vanilla JS for Color Explorer, Catalogue Tabs, Living with Colour
  const scriptTag = `
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      // 1. Color Explorer Switching
      const expSection = document.querySelector('section:has(#explorerRoomImg), section:nth-of-type(2)');
      if (expSection) {
        const buttons = expSection.querySelectorAll('button[type="button"]');
        const img = expSection.querySelector('img');
        const subtitle = expSection.querySelector('.bg-gradient-to-t p:first-child');
        const colorName = expSection.querySelector('.bg-gradient-to-t p.text-lg, .bg-gradient-to-t p:nth-child(2)');
        const colorBox = expSection.querySelector('.bg-gradient-to-t span[style*="background-color"]');
        const colorHex = expSection.querySelector('.bg-gradient-to-t span.font-mono');

        const groups = [
          { name: 'Warm Neutral — Trung tính ấm', color: 'Cát ấm', hex: '#DFD0B8', img: './images/base44/8099d7d28_generated_8abc6bed.png' },
          { name: 'Earth Tone — Tông đất', color: 'Đất nung mờ', hex: '#BC8563', img: './images/base44/edf841af7_generated_77536f0e.png' },
          { name: 'Sage Green — Xanh xô thơm', color: 'Xô thơm mộc', hex: '#A3B59E', img: './images/base44/7f7b7d76e_generated_2a17cf56.png' },
          { name: 'Modern Blue — Xanh hiện đại', color: 'Biển sương mai', hex: '#8EADC0', img: './images/base44/0cff00e0d_generated_6094395e.png' },
          { name: 'Soft White — Trắng mềm', color: 'Trắng ngọc trai', hex: '#F8F6F0', img: './images/base44/85e7f93c0_generated_2df1c9b3.png' }
        ];

        buttons.forEach((btn, idx) => {
          btn.addEventListener('click', () => {
            buttons.forEach(b => {
              b.classList.remove('text-charcoal');
              b.classList.add('text-ink');
            });
            btn.classList.add('text-charcoal');
            btn.classList.remove('text-ink');

            const g = groups[idx] || groups[0];
            if (subtitle) subtitle.textContent = g.name;
            if (colorName) colorName.textContent = g.color;
            if (colorHex) colorHex.textContent = g.hex;
            if (colorBox) colorBox.style.backgroundColor = g.hex;
            if (img) img.src = g.img;
          });
        });
      }

      // 2. Catalogue Tab Switching
      const catSection = document.querySelector('section:nth-of-type(4)');
      if (catSection) {
        const tabs = catSection.querySelectorAll('button[type="button"]');
        const cards = catSection.querySelectorAll('.b44-card');

        tabs.forEach(tab => {
          tab.addEventListener('click', () => {
            tabs.forEach(t => {
              t.classList.remove('text-charcoal');
              t.classList.add('text-ink');
              const bar = t.querySelector('span');
              if (bar) bar.classList.replace('opacity-100', 'opacity-0');
            });
            tab.classList.add('text-charcoal');
            tab.classList.remove('text-ink');
            const activeBar = tab.querySelector('span');
            if (activeBar) activeBar.classList.replace('opacity-0', 'opacity-100');

            const text = tab.innerText.toLowerCase();
            let cat = 'all';
            if (text.includes('ngoại thất')) cat = 'son-ngoai-that';
            else if (text.includes('nội thất')) cat = 'son-noi-that';
            else if (text.includes('chống thấm')) cat = 'chong-tham';
            else if (text.includes('lót')) cat = 'son-lot';

            cards.forEach(card => {
              if (cat === 'all' || card.getAttribute('data-cat') === cat) {
                card.style.display = 'block';
              } else {
                card.style.display = 'none';
              }
            });
          });
        });
      }

      // 3. Living with Colour Tabs
      const livingSection = document.querySelector('section:nth-of-type(5)');
      if (livingSection) {
        const tabs = livingSection.querySelectorAll('button[type="button"]');
        const img = livingSection.querySelector('img');
        const title = livingSection.querySelector('.bg-gradient-to-t p:last-child');
        const subtitle = livingSection.querySelector('.bg-gradient-to-t p:first-child');

        const styles = [
          { subtitle: 'Modern Minimal', title: 'Tối giản hiện đại', img: './images/base44/edf841af7_generated_77536f0e.png' },
          { subtitle: 'Warm Living', title: 'Sống ấm', img: './images/base44/8099d7d28_generated_8abc6bed.png' },
          { subtitle: 'Nature Inspired', title: 'Cảm hứng thiên nhiên', img: './images/base44/7f7b7d76e_generated_2a17cf56.png' },
          { subtitle: 'Contemporary Luxury', title: 'Sang trọng đương đại', img: './images/base44/0cff00e0d_generated_6094395e.png' }
        ];

        tabs.forEach((tab, idx) => {
          tab.addEventListener('click', () => {
            tabs.forEach(t => {
              t.classList.remove('border-charcoal', 'bg-charcoal', 'text-bone');
              t.classList.add('border-line', 'text-ink');
            });
            tab.classList.add('border-charcoal', 'bg-charcoal', 'text-bone');
            tab.classList.remove('border-line', 'text-ink');

            const s = styles[idx] || styles[0];
            if (title) title.textContent = s.title;
            if (subtitle) subtitle.textContent = s.subtitle;
            if (img) img.src = s.img;
          });
        });
      }
    });
  </script>
</body>`;

  const finalHtml = homeHtml.replace('</body>', scriptTag);
  saveBoth('index.html', '', finalHtml);
}

// ========================================================
// 2. BUILD SAN-PHAM (san-pham.html)
// ========================================================
function buildSanPham() {
  console.log('Building Pixel-Perfect San-Pham Page...');

  let raw = fs.readFileSync(path.join(AUDIT_DIR, 'raw_san-pham.html'), 'utf8');

  // Reload latest products with real images
  const latestProducts = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'wanders_products.json'), 'utf8'));

  // Replace demo cards with all 24 real products using authentic Excel images
  const realProductCardsHtml = latestProducts.map(p => `
    <a class="group block sp-product-card" href="./${p.link}" data-cat="${p.category}">
      <div class="relative aspect-[4/5] w-full overflow-hidden border border-line bg-gradient-to-br from-[#F5EFE6] to-[#EAE0D0] flex items-center justify-center p-4">
        <span class="absolute inset-x-0 top-0 px-4 py-3 flex items-center justify-between text-[9.5px] uppercase tracking-[0.18em] text-charcoal/70 font-mono font-bold z-10">
          <span>${p.code}</span>
          <span class="text-terracotta">${p.packaging || '5L & 18L'}</span>
        </span>
        <img src="./${p.image}" class="product-image h-full w-full object-contain object-center drop-shadow-md group-hover:scale-105 transition-transform duration-300 p-3" style="width:100%;height:100%;object-fit:contain;object-position:center;" alt="${p.name}">
        <span class="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center border border-charcoal/20 bg-bone/40 text-charcoal opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-up-right h-4 w-4"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg>
        </span>
      </div>
      <p class="mt-3 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-terracotta">${p.categoryName || 'Sơn cao cấp'}</p>
      <h3 class="mt-1 text-[15.5px] font-semibold leading-snug text-charcoal group-hover:text-terracotta transition-colors">${p.name}</h3>
      <p class="mt-2 text-[13px] leading-relaxed text-ink line-clamp-2">${p.desc ? p.desc.substring(0, 95) + '...' : 'Dòng sơn trang trí và bảo vệ bề mặt chính thức từ WANDERS.'}</p>
      <span class="mt-3 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-terracotta">Xem chi tiết<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-up-right h-3.5 w-3.5"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg></span>
    </a>
  `).join('');

  // Replace demo grid in raw_san-pham with authentic 24 WANDERS products
  raw = raw.replace(/<div class="mt-10 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">[\s\S]*?<\/section>/, `
    <div class="mt-10 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" id="allProductsGrid">
      ${realProductCardsHtml}
    </div>
  </div></section>`);

  const pageHtml = renderPage(
    'Sản phẩm — WANDERS',
    'Danh mục 24 dòng sơn WANDERS chính thức: sơn nội thất, ngoại thất, chống thấm, sơn lót và sơn chống nóng.',
    raw,
    'san-pham',
    0
  );

  const interactiveScript = `
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const surfaceBtns = document.querySelectorAll('button');
      const cards = document.querySelectorAll('.sp-product-card');

      const catMap = {
        'tất cả': 'all',
        'nội thất': 'son-noi-that',
        'ngoại thất': 'son-ngoai-that',
        'chống thấm': 'chong-tham',
        'lót': 'son-lot',
        'chống nóng': 'son-chong-nong',
        'khác': 'san-pham-khac'
      };

      // Handle query param
      const urlParams = new URLSearchParams(window.location.search);
      const nhom = urlParams.get('nhom');
      if (nhom) {
        cards.forEach(c => {
          if (c.getAttribute('data-cat') === ('son-' + nhom) || c.getAttribute('data-cat') === nhom) {
            c.style.display = 'block';
          } else {
            c.style.display = 'none';
          }
        });
      }

      surfaceBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const text = btn.innerText.toLowerCase();
          let targetCat = 'all';
          for (const [k, v] of Object.entries(catMap)) {
            if (text.includes(k)) {
              targetCat = v;
              break;
            }
          }

          cards.forEach(card => {
            if (targetCat === 'all' || card.getAttribute('data-cat') === targetCat) {
              card.style.display = 'block';
            } else {
              card.style.display = 'none';
            }
          });
        });
      });
    });
  </script>
</body>`;

  saveBoth('san-pham.html', 'san-pham', pageHtml.replace('</body>', interactiveScript));
}

// ========================================================
// 3. BUILD BANG-MAU (bang-mau.html & cam-hung-mau-sac.html)
// ========================================================
function buildBangMau() {
  console.log('Building Pixel-Perfect Bang-Mau Page...');

  let raw = fs.readFileSync(path.join(AUDIT_DIR, 'raw_bang-mau.html'), 'utf8');

  const pageHtml = renderPage(
    'Bảng màu & Color Studio — WANDERS',
    'Khám phá bảng màu sơn WANDERS: trải nghiệm Color Studio, chọn mẫu màu, xem mã HEX và tạo bảng phối 3 màu cho không gian kiến trúc.',
    raw,
    'bang-mau',
    0
  );

  // Add interactive Color Studio functionality to exact Base44 elements
  const colorStudioScript = `
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const paletteData = ${JSON.stringify(colorPalette)};
      const groups = Object.values(paletteData).filter(g => g && g.name);

      const groupTabs = document.querySelectorAll('section:nth-of-type(2) .no-scrollbar button');
      const swatchButtons = document.querySelectorAll('section:nth-of-type(2) .grid button');
      const previewBox = document.querySelector('aside .mt-4.h-28');
      const colorNameEl = document.querySelector('aside p.text-\\[15px\\]');
      const colorCodeEl = document.querySelector('aside p.font-mono');
      const addBtn = document.querySelector('aside button');
      const countEl = document.querySelector('aside span.font-mono');
      const slots = document.querySelectorAll('aside .grid.grid-cols-3 > div');

      let currentSelected = null;
      let myPalette = [];

      swatchButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const hex = btn.querySelector('span[style*=\"background-color\"]')?.style.backgroundColor || '#DFD0B8';
          const name = btn.querySelector('p.text-xs, p:first-of-type')?.innerText || 'Cát ấm';
          const code = btn.querySelector('p.font-mono')?.innerText || 'MH0801';

          currentSelected = { hex, name, code };
          if (previewBox) previewBox.style.backgroundColor = hex;
          if (colorNameEl) colorNameEl.textContent = name;
          if (colorCodeEl) colorCodeEl.textContent = code + ' · ' + hex;

          if (addBtn) {
            addBtn.disabled = false;
            addBtn.classList.remove('cursor-not-allowed', 'text-ink/50', 'border-line');
            addBtn.classList.add('bg-charcoal', 'text-bone', 'hover:bg-terracotta');
          }
        });
      });

      if (addBtn) {
        addBtn.addEventListener('click', () => {
          if (!currentSelected || myPalette.length >= 3) return;
          myPalette.push(currentSelected);
          renderPalette();
        });
      }

      function renderPalette() {
        if (countEl) countEl.textContent = myPalette.length + '/3';
        slots.forEach((s, idx) => {
          const item = myPalette[idx];
          if (item) {
            s.innerHTML = '<div class=\"h-16 w-full border border-line flex flex-col items-center justify-center p-1 text-white shadow-sm\" style=\"background-color:' + item.hex + '\"><span class=\"text-[9.5px] font-mono font-bold drop-shadow-sm\">' + item.code + '</span><span class=\"text-[8.5px] drop-shadow-sm line-clamp-1\">' + item.name + '</span></div>';
          } else {
            s.innerHTML = '<div class=\"h-16 w-full border border-dashed border-line bg-bone\"></div>';
          }
        });
      }
    });
  </script>
</body>`;

  const finalHtml = pageHtml.replace('</body>', colorStudioScript);
  saveBoth('bang-mau.html', 'bang-mau', finalHtml);
  saveBoth('cam-hung-mau-sac.html', 'cam-hung-mau-sac', finalHtml);
}

// ========================================================
// 4. BUILD DU-AN (du-an.html)
// ========================================================
function buildDuAn() {
  console.log('Building Pixel-Perfect Du-An Page...');
  let raw = fs.readFileSync(path.join(AUDIT_DIR, 'raw_du-an.html'), 'utf8');

  const pageHtml = renderPage(
    'Dự án & Công trình — WANDERS',
    'Ghi chép về vật liệu, ánh sáng và cách một bảng màu WANDERS đi vào đời sống của công trình thực tế.',
    raw,
    'du-an',
    0
  );
  saveBoth('du-an.html', 'du-an', pageHtml);
}

// ========================================================
// 5. BUILD GIOI-THIEU (gioi-thieu.html)
// ========================================================
function buildGioiThieu() {
  console.log('Building Pixel-Perfect Gioi-Thieu Page...');
  let raw = fs.readFileSync(path.join(AUDIT_DIR, 'raw_gioi-thieu.html'), 'utf8');

  const pageHtml = renderPage(
    'Giới thiệu WANDERS — Deine Wand mal anders',
    'Khám phá WANDERS: định hướng màu sắc, định hướng sản phẩm và cam kết chất lượng bền vững cho không gian sống hiện đại.',
    raw,
    'gioi-thieu',
    0
  );
  saveBoth('gioi-thieu.html', 'gioi-thieu', pageHtml);
}

// ========================================================
// 6. BUILD LIEN-HE (lien-he.html)
// ========================================================
function buildLienHe() {
  console.log('Building Pixel-Perfect Lien-He Page...');
  let raw = fs.readFileSync(path.join(AUDIT_DIR, 'raw_lien-he.html'), 'utf8');

  const pageHtml = renderPage(
    'Liên hệ — WANDERS',
    'Liên hệ WANDERS: Hotline 0937.760.688, Email wanderspaint@gmail.com, địa chỉ Lam Điền, Xã Quảng Bị, Hà Nội.',
    raw,
    'lien-he',
    0
  );

  // Production note: run apply_production_readiness.js after building to strip unverified sections & wire /api/contact
  const formScript = `<script>console.info('WANDERS base layout compiled');</script></body>`;

  saveBoth('lien-he.html', 'lien-he', pageHtml.replace('</body>', formScript));
}

// Run All
function buildAll() {
  console.log('=== STARTING PIXEL-PERFECT BASE44 COMPILATION ===');
  buildHomepage();
  buildSanPham();
  buildBangMau();
  buildDuAn();
  buildGioiThieu();
  buildLienHe();
  console.log('=== PIXEL-PERFECT BASE44 COMPILATION COMPLETE ===');
}

buildAll();
