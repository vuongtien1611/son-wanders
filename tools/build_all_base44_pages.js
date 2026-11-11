const fs = require('fs');
const path = require('path');
const { renderHead, renderHeader, renderFooter, products, colorPalette, getImg } = require('./base44_common');

const BASE_DIR = path.join(__dirname, '../website_download');

// Helper to write both page.html and page/index.html
function savePage(fileName, folderName, htmlContent) {
  // 1. Root .html file
  const rootFilePath = path.join(BASE_DIR, fileName);
  fs.writeFileSync(rootFilePath, htmlContent);
  console.log(`Saved root: ${fileName} (${htmlContent.length} bytes)`);

  // 2. Folder index.html file
  if (folderName) {
    const folderPath = path.join(BASE_DIR, folderName);
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });
    // Adjust relative paths for 1-level deep subfolder
    const folderHtml = htmlContent
      .replace(/href="\.\//g, 'href="../')
      .replace(/src="\.\//g, 'src="../')
      .replace(/href="\.\.\/assets\//g, 'href="../assets/')
      .replace(/src="\.\.\/images\//g, 'src="../images/');
    fs.writeFileSync(path.join(folderPath, 'index.html'), folderHtml);
    console.log(`Saved subfolder: ${folderName}/index.html`);
  }
}

// ==========================================
// 1. BUILD SAN-PHAM (SẢN PHẨM)
// ==========================================
function buildSanPhamPage() {
  console.log('Building San-Pham Page...');

  const categories = [
    { id: 'all', name: 'Tất cả sản phẩm', count: products.length },
    { id: 'son-noi-that', name: 'Sơn nội thất', count: products.filter(p => p.category === 'son-noi-that').length },
    { id: 'son-ngoai-that', name: 'Sơn ngoại thất', count: products.filter(p => p.category === 'son-ngoai-that').length },
    { id: 'chong-tham', name: 'Sơn chống thấm', count: products.filter(p => p.category === 'chong-tham').length },
    { id: 'son-lot', name: 'Sơn lót kháng kiềm', count: products.filter(p => p.category === 'son-lot').length },
    { id: 'son-chong-nong', name: 'Sơn chống nóng', count: products.filter(p => p.category === 'son-chong-nong').length },
    { id: 'san-pham-khac', name: 'Sản phẩm khác', count: products.filter(p => p.category === 'san-pham-khac').length }
  ];

  const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  ${renderHead('Sản phẩm — WANDERS', 'Hệ thống 24 dòng sơn WANDERS cao cấp: sơn nội thất, ngoại thất, chống thấm, sơn lót kháng kiềm, chống nóng và vật liệu hoàn thiện công nghệ Anh Quốc.', 0)}
</head>
<body class="bg-[#F8F6F1] text-[#273134]">
  ${renderHeader('san-pham', 0)}

  <main>
    <!-- HERO SẢN PHẨM -->
    <section class="border-b border-[#E5E3DC] bg-[#F8F6F0] py-16 lg:py-24">
      <div class="base44-container">
        <p class="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#68716D]">
          <span class="h-px w-8 bg-[#D36A44]"></span>
          WANDERS CATALOGUE
        </p>
        <h1 class="text-[34px] sm:text-[44px] lg:text-[52px] font-semibold leading-[1.1] tracking-[-0.02em] text-[#283235]">
          Sản phẩm WANDERS
        </h1>
        <p class="mt-5 max-w-[600px] text-[16px] leading-[1.7] text-[#68716D]">
          Hệ sinh thái sơn cao cấp được nghiên cứu chuyên biệt cho khí hậu nhiệt đới Việt Nam — từ bảo vệ bề mặt ngoài trời đến lớp hoàn thiện mịn đẹp bên trong.
        </p>

        <!-- Category Filter Tabs -->
        <div class="mt-10 flex flex-wrap gap-2.5 pt-4 border-t border-[#E5E3DC]">
          ${categories.map((c, i) => `
            <button class="sp-filter-btn px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.12em] transition-all border ${i === 0 ? 'bg-[#283235] text-white border-[#283235]' : 'bg-transparent text-[#68716D] border-[#E5E3DC] hover:border-[#283235] hover:text-[#283235]'}" data-cat="${c.id}">
              ${c.name} (${c.count})
            </button>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- PRODUCT GRID (24 SẢN PHẨM THẬT TỪ EXCEL) -->
    <section class="py-16 lg:py-24">
      <div class="base44-container">
        
        <div class="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" id="productsGrid">
          ${products.map(prod => `
            <a class="b44-product-card group" href="./${prod.link}" data-cat="${prod.category}">
              <div class="b44-product-image-box">
                <span class="absolute inset-x-0 top-0 flex items-center justify-between px-4 py-3">
                  <span class="text-[10px] font-mono uppercase tracking-[0.18em] text-[#283235]/65 font-bold">${prod.code}</span>
                  <span class="text-[9.5px] uppercase tracking-[0.14em] text-[#D36A44] font-semibold">${prod.packaging || '5L & 18L'}</span>
                </span>
                <img src="./${prod.image}" alt="${prod.name}">
                <span class="b44-arrow-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>
                </span>
              </div>
              <p class="mt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#D36A44]">${prod.categoryName || 'Sơn cao cấp'}</p>
              <h3 class="mt-1 text-[16px] font-semibold leading-snug text-[#283235] group-hover:text-[#D36A44] transition-colors">
                ${prod.name}
              </h3>
              <p class="mt-1.5 text-[13px] leading-relaxed text-[#68716D] line-clamp-2">
                ${prod.desc ? prod.desc.substring(0, 85) + '...' : 'Sơn công nghệ Anh Quốc cao cấp, bảo vệ tối ưu.'}
              </p>
              <span class="mt-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#283235] group-hover:text-[#D36A44]">
                <span>XEM THÔNG SỐ KỸ THUẬT</span>
                <span>→</span>
              </span>
            </a>
          `).join('')}
        </div>

      </div>
    </section>

    <!-- CTA CUỐI TRANG SẢN PHẨM -->
    <section class="bg-[#EAE3D2] py-16 lg:py-20 border-t border-[#E5E3DC]">
      <div class="base44-container flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <h2 class="text-2xl sm:text-3xl font-semibold text-[#283235]">Cần tư vấn định mức và giải pháp kỹ thuật?</h2>
          <p class="mt-2 text-[15px] text-[#283235]/75">Đội ngũ kỹ sư WANDERS sẵn sàng tính toán khối lượng và tư vấn quy trình thi công tối ưu cho công trình của bạn.</p>
        </div>
        <div class="flex items-center gap-4 shrink-0">
          <a href="./lien-he.html" class="btn-terracotta">
            <span>NHẬN TƯ VẤN KỸ THUẬT</span>
            <span>→</span>
          </a>
        </div>
      </div>
    </section>
  </main>

  ${renderFooter(0)}

  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const btns = document.querySelectorAll('.sp-filter-btn');
      const cards = document.querySelectorAll('#productsGrid .b44-product-card');

      // Check query param e.g. ?nhom=noi-that
      const params = new URLSearchParams(window.location.search);
      const queryNhom = params.get('nhom');
      if (queryNhom) {
        const catMap = {
          'noi-that': 'son-noi-that',
          'ngoai-that': 'son-ngoai-that',
          'chong-tham': 'chong-tham',
          'son-lot': 'son-lot',
          'chong-nong': 'son-chong-nong',
          'khac': 'san-pham-khac'
        };
        const targetCat = catMap[queryNhom] || queryNhom;
        btns.forEach(btn => {
          if (btn.getAttribute('data-cat') === targetCat) {
            btn.click();
          }
        });
      }

      btns.forEach(btn => {
        btn.addEventListener('click', () => {
          btns.forEach(b => {
            b.classList.remove('bg-[#283235]', 'text-white', 'border-[#283235]');
            b.classList.add('bg-transparent', 'text-[#68716D]', 'border-[#E5E3DC]');
          });
          btn.classList.add('bg-[#283235]', 'text-white', 'border-[#283235]');
          btn.classList.remove('bg-transparent', 'text-[#68716D]', 'border-[#E5E3DC]');

          const cat = btn.getAttribute('data-cat');
          cards.forEach(card => {
            if (cat === 'all' || card.getAttribute('data-cat') === cat) {
              card.style.display = 'block';
            } else {
              card.style.display = 'none';
            }
          });
        });
      });
    });
  </script>
</body>
</html>`;

  savePage('san-pham.html', 'san-pham', html);
}

// ==========================================
// 2. BUILD BANG-MAU (BẢNG MÀU & COLOR STUDIO)
// ==========================================
function buildBangMauPage() {
  console.log('Building Bang-Mau Page...');

  // Flatten colors from colorPalette
  const groups = Object.values(colorPalette).filter(g => g && g.name);

  const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  ${renderHead('Bảng màu &amp; Color Studio — WANDERS', 'Khám phá bảng màu sơn WANDERS: trải nghiệm Color Studio, chọn mẫu màu, xem mã HEX và tạo bảng phối 3 màu cho không gian kiến trúc.', 0)}
  <style>
    .swatch-item {
      cursor: pointer;
      transition: all 0.15s ease;
      position: relative;
    }
    .swatch-item:hover {
      transform: scale(1.08);
      z-index: 10;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .swatch-item.active {
      outline: 3px solid #283235;
      outline-offset: 1px;
      z-index: 10;
    }
  </style>
</head>
<body class="bg-[#F8F6F1] text-[#273134]">
  ${renderHeader('bang-mau', 0)}

  <main>
    <!-- COLOR STUDIO HERO -->
    <section class="border-b border-[#E5E3DC] bg-[#F8F6F0] py-16 lg:py-20">
      <div class="base44-container">
        <p class="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#68716D]">
          <span class="h-px w-8 bg-[#D36A44]"></span>
          COLOR STUDIO EXPERIMENTAL
        </p>
        <h1 class="text-[34px] sm:text-[44px] lg:text-[52px] font-semibold leading-[1.1] tracking-[-0.02em] text-[#283235]">
          Bảng màu WANDERS
        </h1>
        <p class="mt-4 max-w-[640px] text-[16px] leading-[1.7] text-[#68716D]">
          Hệ thống màu sơn kiến trúc được phát triển bởi các chuyên gia màu sắc, tái tạo vẻ đẹp tự nhiên, thanh lịch và bền bỉ dưới ánh sáng ban ngày.
        </p>
      </div>
    </section>

    <!-- COLOR STUDIO WORKSPACE (SOLID COLOR BLOCK + SWATCH GRID + 3-COLOR GENERATOR) -->
    <section class="py-16 lg:py-24">
      <div class="base44-container">
        
        <div class="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
          
          <!-- LEFT: PURE SOLID COLOR PREVIEW BLOCK (NO GRADIENTS, NO NOISE) -->
          <div>
            <div class="border border-[#E5E3DC] bg-white p-6 shadow-sm">
              <div class="flex items-center justify-between pb-4 border-b border-[#E5E3DC]">
                <div>
                  <span class="text-[10px] uppercase tracking-[0.2em] text-[#68716D] font-semibold">MÀU ĐANG CHỌN</span>
                  <h3 id="studioColorName" class="text-2xl font-bold text-[#283235] mt-1">Tím Hoa Roselle</h3>
                </div>
                <div class="text-right">
                  <span id="studioColorCode" class="font-mono text-[14px] font-bold text-[#D36A44]">G70856</span>
                  <p id="studioColorHex" class="font-mono text-[12px] text-[#68716D]">#E5A8C5</p>
                </div>
              </div>

              <!-- PURE SOLID COLOR DISPLAY -->
              <div id="studioSolidBox" class="mt-6 aspect-[16/10] w-full border border-[#E5E3DC] shadow-inner transition-colors duration-200" style="background-color: #E5A8C5;"></div>

              <!-- Action buttons -->
              <div class="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#E5E3DC]">
                <button id="addToPaletteBtn" class="inline-flex items-center gap-2 bg-[#283235] hover:bg-[#1A2325] text-white text-[12px] font-semibold uppercase tracking-[0.14em] px-5 py-3 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
                  <span>THÊM VÀO BẢNG PHỐI (TỐI ĐA 3)</span>
                </button>
                <button id="copyHexBtn" class="inline-flex items-center gap-1.5 border border-[#E5E3DC] bg-white hover:bg-[#F8F6F0] text-[#283235] text-[12px] font-mono px-4 py-3 transition-colors">
                  <span>SAO CHÉP MÃ HEX</span>
                </button>
              </div>
            </div>

            <!-- 3-COLOR PALETTE GENERATOR (BASE44 CORE FEATURE) -->
            <div class="mt-8 border border-[#E5E3DC] bg-white p-6 shadow-sm">
              <div class="flex items-center justify-between pb-3 border-b border-[#E5E3DC]">
                <h4 class="text-base font-semibold text-[#283235]">Bảng phối cá nhân (3 màu)</h4>
                <button id="clearPaletteBtn" class="text-[12px] text-[#D36A44] hover:underline font-medium">Làm mới</button>
              </div>
              <p class="mt-2 text-[13px] text-[#68716D]">Chọn tối đa 3 màu từ bảng bên phải để tạo sự hài hòa giữa tường chính, tường điểm nhấn và trần/chân tường.</p>
              
              <div class="mt-5 grid grid-cols-3 gap-3" id="personalPaletteGrid">
                <div class="flex flex-col items-center justify-center p-3 border border-dashed border-[#E5E3DC] h-[90px] text-center" id="slot0">
                  <span class="text-[11px] text-[#68716D]">Màu 1 (Chính)</span>
                </div>
                <div class="flex flex-col items-center justify-center p-3 border border-dashed border-[#E5E3DC] h-[90px] text-center" id="slot1">
                  <span class="text-[11px] text-[#68716D]">Màu 2 (Nhấn)</span>
                </div>
                <div class="flex flex-col items-center justify-center p-3 border border-dashed border-[#E5E3DC] h-[90px] text-center" id="slot2">
                  <span class="text-[11px] text-[#68716D]">Màu 3 (Trần/Nền)</span>
                </div>
              </div>
            </div>

          </div>

          <!-- RIGHT: COLOR SWATCH GRID & GROUP TABS -->
          <div>
            <div class="flex flex-wrap gap-2 border-b border-[#E5E3DC] pb-4" id="colorGroupTabs">
              ${groups.map((g, i) => `
                <button class="color-grp-tab px-3.5 py-2 text-[12px] font-semibold uppercase tracking-[0.1em] transition-all border ${i === 0 ? 'bg-[#283235] text-white border-[#283235]' : 'bg-white text-[#68716D] border-[#E5E3DC] hover:border-[#283235]'}" data-group="${g.slug || g.code}">
                  ${g.name.split('–')[0].trim()}
                </button>
              `).join('')}
            </div>

            <!-- Swatches Grid -->
            <div class="mt-6">
              <div class="flex items-center justify-between pb-3">
                <span class="text-[12px] text-[#68716D]">Di chuột để xem tên / Bấm để chọn màu</span>
                <span class="text-[12px] font-mono text-[#283235] font-semibold" id="swatchHoverInfo">G70856 - Tím Hoa Roselle</span>
              </div>

              <div class="grid grid-cols-6 sm:grid-cols-8 gap-2 border border-[#E5E3DC] bg-white p-4 shadow-sm max-h-[520px] overflow-y-auto" id="swatchesContainer">
                ${(groups[0]?.colors || []).map(c => `
                  <div class="swatch-item h-12 w-full border border-black/10" style="background-color: ${c.hex};" data-hex="${c.hex}" data-code="${c.code}" data-name="${c.name_vi}" title="${c.code} - ${c.name_vi}"></div>
                `).join('')}
              </div>
            </div>

            <!-- Curator advice -->
            <div class="mt-8 border-l-2 border-[#D36A44] pl-4 py-1">
              <p class="text-[13px] leading-relaxed text-[#68716D]">
                <strong class="text-[#283235]">Lưu ý kỹ thuật:</strong> Màu sắc hiển thị trên màn hình có thể chênh lệch 5-8% so với màng sơn thực tế do ánh sáng màn hình và độ bóng hoàn thiện (mờ, bóng ngọc trai, bóng cao cấp).
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>

    <!-- SECTION: BỐN BẢNG PHỐI CÓ THỂ DÙNG NGAY (BASE44 EXACT SECTION) -->
    <section class="border-t border-[#E5E3DC] bg-[#F3EEDB] py-20 lg:py-24">
      <div class="base44-container">
        
        <div class="max-w-[640px]">
          <p class="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#68716D]">
            <span class="h-px w-8 bg-[#D36A44]"></span>
            CURATED PALETTES
          </p>
          <h2 class="text-[28px] sm:text-[34px] lg:text-[40px] font-semibold leading-[1.14] tracking-[-0.02em] text-[#283235]">
            Bốn bảng phối có thể dùng ngay
          </h2>
          <p class="mt-3 text-[15px] leading-relaxed text-[#68716D]">
            Được phối chuẩn tỷ lệ 60-30-10 từ các kiến trúc sư, tối ưu hóa cảm giác ánh sáng và chiều sâu không gian.
          </p>
        </div>

        <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          
          <div class="border border-[#E5E3DC] bg-white p-6 shadow-sm">
            <h3 class="text-lg font-semibold text-[#283235]">Nền ấm tối giản</h3>
            <p class="mt-1 text-[13px] text-[#68716D]">Thanh lịch, ấm cúng và thoáng đạt.</p>
            <div class="mt-5 grid grid-cols-3 gap-2">
              <div class="h-14 border border-[#E5E3DC]" style="background-color: #DFD0B8;" title="#DFD0B8"></div>
              <div class="h-14 border border-[#E5E3DC]" style="background-color: #CDB99C;" title="#CDB99C"></div>
              <div class="h-14 border border-[#E5E3DC]" style="background-color: #9E896C;" title="#9E896C"></div>
            </div>
            <div class="mt-3 flex justify-between text-[11px] font-mono text-[#68716D]">
              <span>#DFD0B8</span>
              <span>#CDB99C</span>
              <span>#9E896C</span>
            </div>
          </div>

          <div class="border border-[#E5E3DC] bg-white p-6 shadow-sm">
            <h3 class="text-lg font-semibold text-[#283235]">Đất nung &amp; cát</h3>
            <p class="mt-1 text-[13px] text-[#68716D]">Mộc mạc, chiều sâu và thư giãn.</p>
            <div class="mt-5 grid grid-cols-3 gap-2">
              <div class="h-14 border border-[#E5E3DC]" style="background-color: #D3A27F;" title="#D3A27F"></div>
              <div class="h-14 border border-[#E5E3DC]" style="background-color: #BC8563;" title="#BC8563"></div>
              <div class="h-14 border border-[#E5E3DC]" style="background-color: #6F452C;" title="#6F452C"></div>
            </div>
            <div class="mt-3 flex justify-between text-[11px] font-mono text-[#68716D]">
              <span>#D3A27F</span>
              <span>#BC8563</span>
              <span>#6F452C</span>
            </div>
          </div>

          <div class="border border-[#E5E3DC] bg-white p-6 shadow-sm">
            <h3 class="text-lg font-semibold text-[#283235]">Xanh vườn nhà</h3>
            <p class="mt-1 text-[13px] text-[#68716D]">Gắn kết thiên nhiên, xoa dịu giác quan.</p>
            <div class="mt-5 grid grid-cols-3 gap-2">
              <div class="h-14 border border-[#E5E3DC]" style="background-color: #C8D3C5;" title="#C8D3C5"></div>
              <div class="h-14 border border-[#E5E3DC]" style="background-color: #A3B59E;" title="#A3B59E"></div>
              <div class="h-14 border border-[#E5E3DC]" style="background-color: #556B52;" title="#556B52"></div>
            </div>
            <div class="mt-3 flex justify-between text-[11px] font-mono text-[#68716D]">
              <span>#C8D3C5</span>
              <span>#A3B59E</span>
              <span>#556B52</span>
            </div>
          </div>

          <div class="border border-[#E5E3DC] bg-white p-6 shadow-sm">
            <h3 class="text-lg font-semibold text-[#283235]">Biển mờ sáng</h3>
            <p class="mt-1 text-[13px] text-[#68716D]">Hiện đại, tĩnh lặng và khoáng đạt.</p>
            <div class="mt-5 grid grid-cols-3 gap-2">
              <div class="h-14 border border-[#E5E3DC]" style="background-color: #C0D2DC;" title="#C0D2DC"></div>
              <div class="h-14 border border-[#E5E3DC]" style="background-color: #8EADC0;" title="#8EADC0"></div>
              <div class="h-14 border border-[#E5E3DC]" style="background-color: #315873;" title="#315873"></div>
            </div>
            <div class="mt-3 flex justify-between text-[11px] font-mono text-[#68716D]">
              <span>#C0D2DC</span>
              <span>#8EADC0</span>
              <span>#315873</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  </main>

  ${renderFooter(0)}

  <script>
    const allGroups = ${JSON.stringify(groups)};
    let selectedColor = { code: 'G70856', name: 'Tím Hoa Roselle', hex: '#E5A8C5' };
    let personalPalette = [];

    document.addEventListener('DOMContentLoaded', () => {
      const tabs = document.querySelectorAll('.color-grp-tab');
      const container = document.getElementById('swatchesContainer');
      const hoverInfo = document.getElementById('swatchHoverInfo');
      const solidBox = document.getElementById('studioSolidBox');
      const colorName = document.getElementById('studioColorName');
      const colorCode = document.getElementById('studioColorCode');
      const colorHex = document.getElementById('studioColorHex');
      const copyBtn = document.getElementById('copyHexBtn');
      const addBtn = document.getElementById('addToPaletteBtn');
      const clearBtn = document.getElementById('clearPaletteBtn');

      function bindSwatches() {
        const swatches = container.querySelectorAll('.swatch-item');
        swatches.forEach(s => {
          s.addEventListener('mouseenter', () => {
            hoverInfo.textContent = s.getAttribute('data-code') + ' - ' + s.getAttribute('data-name');
          });
          s.addEventListener('click', () => {
            swatches.forEach(x => x.classList.remove('active'));
            s.classList.add('active');
            selectedColor = {
              code: s.getAttribute('data-code'),
              name: s.getAttribute('data-name'),
              hex: s.getAttribute('data-hex')
            };
            solidBox.style.backgroundColor = selectedColor.hex;
            colorName.textContent = selectedColor.name;
            colorCode.textContent = selectedColor.code;
            colorHex.textContent = selectedColor.hex;
          });
        });
      }

      bindSwatches();

      // Tab switching
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          tabs.forEach(t => {
            t.classList.remove('bg-[#283235]', 'text-white', 'border-[#283235]');
            t.classList.add('bg-white', 'text-[#68716D]', 'border-[#E5E3DC]');
          });
          tab.classList.add('bg-[#283235]', 'text-white', 'border-[#283235]');
          tab.classList.remove('bg-white', 'text-[#68716D]', 'border-[#E5E3DC]');

          const grpId = tab.getAttribute('data-group');
          const group = allGroups.find(g => (g.slug || g.code) === grpId) || allGroups[0];
          if (group && group.colors) {
            container.innerHTML = group.colors.map(c => 
              '<div class=\"swatch-item h-12 w-full border border-black/10\" style=\"background-color: ' + c.hex + ';\" data-hex=\"' + c.hex + '\" data-code=\"' + c.code + '\" data-name=\"' + c.name_vi + '\" title=\"' + c.code + ' - ' + c.name_vi + '\"></div>'
            ).join('');
            bindSwatches();
          }
        });
      });

      // Copy Hex
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(selectedColor.hex).then(() => {
          alert('Đã sao chép mã màu: ' + selectedColor.hex);
        });
      });

      // Add to palette
      addBtn.addEventListener('click', () => {
        if (personalPalette.length >= 3) {
          alert('Bảng phối đã đạt tối đa 3 màu. Hãy bấm \"Làm mới\" nếu muốn chọn lại.');
          return;
        }
        personalPalette.push(selectedColor);
        updatePersonalPalette();
      });

      clearBtn.addEventListener('click', () => {
        personalPalette = [];
        updatePersonalPalette();
      });

      function updatePersonalPalette() {
        for (let i = 0; i < 3; i++) {
          const slot = document.getElementById('slot' + i);
          if (personalPalette[i]) {
            const c = personalPalette[i];
            slot.className = 'flex flex-col items-center justify-center p-2 border border-[#E5E3DC] h-[90px] text-center text-white';
            slot.style.backgroundColor = c.hex;
            slot.innerHTML = '<span class=\"font-mono text-[11px] font-bold drop-shadow-sm\">' + c.code + '</span><span class=\"text-[10px] drop-shadow-sm\">' + c.name + '</span>';
          } else {
            slot.className = 'flex flex-col items-center justify-center p-3 border border-dashed border-[#E5E3DC] h-[90px] text-center text-[#68716D]';
            slot.style.backgroundColor = 'transparent';
            slot.innerHTML = '<span class=\"text-[11px]\">Màu ' + (i + 1) + '</span>';
          }
        }
      }
    });
  </script>
</body>
</html>`;

  savePage('bang-mau.html', 'bang-mau', html);
  // Also update cam-hung-mau-sac.html for full backward compatibility
  savePage('cam-hung-mau-sac.html', 'cam-hung-mau-sac', html);
}

// ==========================================
// 3. BUILD DU-AN (DỰ ÁN & CÔNG TRÌNH)
// ==========================================
function buildDuAnPage() {
  console.log('Building Du-An Page...');

  const projects = [
    {
      title: 'Biệt thự mái bằng',
      category: 'nha-o',
      categoryName: 'Nhà ở cao cấp',
      location: 'Khu đô thị sinh thái, Hà Nội',
      desc: 'Mặt tiền trắng ngà kết hợp khối ốp đất nung mộc, sân vườn nhiệt đới hiện đại. Ứng dụng hệ sơn ngoại thất chống kiềm muối hóa WANDERS.',
      image: './images/base44/0cff00e0d_generated_6094395e.png',
      colors: ['#F1ECE1', '#BC8563', '#68716D']
    },
    {
      title: 'Căn hộ trung tâm',
      category: 'nha-o',
      categoryName: 'Căn hộ cao cấp',
      location: 'Quận Ba Đình, Hà Nội',
      desc: 'Bảng màu ấm với tường phòng khách trung tính nhẹ nhàng, nhấn gỗ óc chó tự nhiên và ánh sáng ban mai tinh khôi.',
      image: './images/base44/08867f386_generated_9bb6eef6.png',
      colors: ['#DFD0B8', '#9E896C', '#F8F6F0']
    },
    {
      title: 'Quán cà phê studio',
      category: 'thuong-mai',
      categoryName: 'Thương mại & Dịch vụ',
      location: 'Tây Hồ, Hà Nội',
      desc: 'Bề mặt tường hiệu ứng vôi mờ cổ điển, hòa quyện ánh sáng vàng ấm và cây cỏ nhiệt đới, tạo không gian sáng tạo thư giãn.',
      image: './images/base44/7266e0bc1_generated_27f36fa1.png',
      colors: ['#D3A27F', '#BC8563', '#283235']
    },
    {
      title: 'Sảnh làm việc sáng tạo',
      category: 'thuong-mai',
      categoryName: 'Văn phòng hiện đại',
      location: 'Cầu Giấy, Hà Nội',
      desc: 'Tông màu xanh xô thơm thanh lịch, tạo cảm hứng tập trung và cân bằng năng lượng tích cực cho không gian làm việc.',
      image: './images/base44/699adaa7a_generated_49cef920.png',
      colors: ['#A3B59E', '#C8D3C5', '#556B52']
    },
    {
      title: 'Nhà vườn một tầng',
      category: 'nha-o',
      categoryName: 'Biệt thự nghỉ dưỡng',
      location: 'Sóc Sơn, Hà Nội',
      desc: 'Trắng mềm thanh khiết hòa quyện thảm cỏ và nắng sớm tự nhiên, mang lại cảm giác bình yên, tĩnh tại.',
      image: './images/base44/d46ca89f2_generated_e7f1be47.png',
      colors: ['#F8F6F0', '#DFD0B8', '#7E927A']
    }
  ];

  const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  ${renderHead('Dự án &amp; Công trình — WANDERS', 'Khám phá các công trình kiến trúc biệt thự, căn hộ cao cấp và không gian thương mại hoàn thiện bằng sơn WANDERS.', 0)}
</head>
<body class="bg-[#F8F6F1] text-[#273134]">
  ${renderHeader('du-an', 0)}

  <main>
    <section class="border-b border-[#E5E3DC] bg-[#F8F6F0] py-16 lg:py-24">
      <div class="base44-container">
        <p class="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#68716D]">
          <span class="h-px w-8 bg-[#D36A44]"></span>
          WANDERS ARCHITECTURE
        </p>
        <h1 class="text-[34px] sm:text-[44px] lg:text-[52px] font-semibold leading-[1.1] tracking-[-0.02em] text-[#283235]">
          Dự án &amp; Công trình
        </h1>
        <p class="mt-4 max-w-[640px] text-[16px] leading-[1.7] text-[#68716D]">
          Ghi chép về vật liệu, ánh sáng và cách các giải pháp sơn WANDERS tôn vinh đường nét kiến trúc đương đại.
        </p>
      </div>
    </section>

    <section class="py-16 lg:py-24">
      <div class="base44-container">
        
        <div class="grid gap-12 lg:grid-cols-2 lg:gap-14">
          ${projects.map(proj => `
            <div class="border border-[#E5E3DC] bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div class="aspect-[16/10] w-full overflow-hidden bg-[#EAE3D2]">
                <img class="w-full h-full object-cover hover:scale-105 transition-transform duration-500" src="${proj.image}" alt="${proj.title}">
              </div>
              <div class="p-8">
                <div class="flex items-center justify-between">
                  <span class="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D36A44]">${proj.categoryName}</span>
                  <span class="text-[12px] text-[#68716D]">${proj.location}</span>
                </div>
                <h3 class="mt-3 text-2xl font-semibold text-[#283235]">${proj.title}</h3>
                <p class="mt-3 text-[14.5px] leading-relaxed text-[#68716D]">${proj.desc}</p>
                
                <div class="mt-6 flex items-center justify-between pt-6 border-t border-[#E5E3DC]">
                  <div class="flex items-center gap-2">
                    <span class="text-[11px] uppercase tracking-wider text-[#68716D]">Màu sắc chủ đạo:</span>
                    <div class="flex gap-1.5">
                      ${proj.colors.map(col => `<span class="h-5 w-5 border border-[#E5E3DC]" style="background-color: ${col};" title="${col}"></span>`).join('')}
                    </div>
                  </div>
                  <a href="./lien-he.html" class="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#D36A44] hover:underline">
                    Tư vấn công trình →
                  </a>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

      </div>
    </section>
  </main>

  ${renderFooter(0)}
</body>
</html>`;

  savePage('du-an.html', 'du-an', html);
}

// ==========================================
// 4. BUILD GIOI-THIEU (GIỚI THIỆU WANDERS)
// ==========================================
function buildGioiThieuPage() {
  console.log('Building Gioi-Thieu Page...');

  const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  ${renderHead('Giới thiệu WANDERS — Deine Wand mal anders', 'Tìm hiểu câu chuyện thương hiệu sơn WANDERS: định hướng màu sắc kiến trúc, dây chuyền chuyển giao công nghệ Anh Quốc và tiêu chuẩn chất lượng bền vững.', 0)}
</head>
<body class="bg-[#F8F6F1] text-[#273134]">
  ${renderHeader('gioi-thieu', 0)}

  <main>
    <section class="border-b border-[#E5E3DC] bg-[#F8F6F0] py-16 lg:py-24">
      <div class="base44-container">
        <p class="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#68716D]">
          <span class="h-px w-8 bg-[#D36A44]"></span>
          DEINE WAND MAL ANDERS
        </p>
        <h1 class="text-[34px] sm:text-[44px] lg:text-[52px] font-semibold leading-[1.1] tracking-[-0.02em] text-[#283235]">
          Khám phá WANDERS
        </h1>
        <p class="mt-4 max-w-[640px] text-[16px] leading-[1.7] text-[#68716D]">
          WANDERS được xây dựng trên niềm tin rằng màu sơn và chất lượng màng sơn là linh hồn tạo nên cảm giác bình an, đẳng cấp cho mỗi không gian sống.
        </p>
      </div>
    </section>

    <!-- CÂU CHUYỆN THƯƠNG HIỆU -->
    <section class="py-16 lg:py-24">
      <div class="base44-container">
        <div class="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
          <div>
            <h2 class="text-2xl sm:text-3xl font-semibold text-[#283235]">Bắt đầu từ một bức tường</h2>
            <p class="mt-5 text-[15.5px] leading-[1.8] text-[#68716D]">
              Trong tiếng Đức, câu khẩu hiệu <em class="text-[#283235] font-serif">"Deine Wand mal anders"</em> mang ý nghĩa: Hãy biến bức tường của bạn thành một tác phẩm khác biệt. WANDERS không xem sơn là một loại vật liệu xây dựng đơn thuần, mà là lớp áo định hình thẩm mỹ và bảo vệ tổ ấm trước thời gian.
            </p>
            <p class="mt-4 text-[15.5px] leading-[1.8] text-[#68716D]">
              Tại Việt Nam, với đặc thù khí hậu nhiệt đới gió mùa nóng ẩm, chúng tôi tối ưu hóa từng công thức nhựa Acrylic, khoáng màu bền sáng và màng thở kháng nấm mốc để bề mặt sơn luôn bền đẹp từ 8 đến 15 năm.
            </p>

            <div class="mt-8 grid grid-cols-2 gap-6 border-t border-[#E5E3DC] pt-8">
              <div>
                <p class="font-mono text-3xl font-bold text-[#D36A44]">100%</p>
                <p class="mt-1 text-[13px] text-[#68716D]">Công nghệ chuyển giao Anh Quốc</p>
              </div>
              <div>
                <p class="font-mono text-3xl font-bold text-[#283235]">ISO 9001</p>
                <p class="mt-1 text-[13px] text-[#68716D]">Tiêu chuẩn quản lý chất lượng quốc tế</p>
              </div>
            </div>
          </div>

          <div class="relative overflow-hidden bg-[#EAE3D2] aspect-[4/3]">
            <img class="w-full h-full object-cover" src="./images/base44/b61550fbc_generated_9d16c57c.png" alt="Xưởng sản xuất WANDERS">
          </div>
        </div>
      </div>
    </section>

    <!-- 3 ĐỊNH HƯỚNG CỐT LÕI -->
    <section class="bg-[#F3EEDB] py-16 lg:py-24 border-t border-[#E5E3DC]">
      <div class="base44-container">
        <div class="text-center max-w-[600px] mx-auto">
          <p class="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#D36A44]">TRIẾT LÝ PHÁT TRIỂN</p>
          <h2 class="mt-3 text-2xl sm:text-3xl font-semibold text-[#283235]">Ba định hướng của WANDERS</h2>
        </div>

        <div class="mt-12 grid gap-8 md:grid-cols-3">
          <div class="border border-[#E5E3DC] bg-white p-8">
            <h3 class="text-lg font-semibold text-[#283235]">1. Định hướng màu sắc</h3>
            <p class="mt-3 text-[14px] leading-relaxed text-[#68716D]">
              Không tạo ra hàng ngàn màu gây bối rối, Color Studio WANDERS tuyển chọn các dải màu tinh tế, có chiều sâu thị giác và thích hợp với nội thất Á Đông hiện đại.
            </p>
          </div>

          <div class="border border-[#E5E3DC] bg-white p-8">
            <h3 class="text-lg font-semibold text-[#283235]">2. Định hướng sản phẩm</h3>
            <p class="mt-3 text-[14px] leading-relaxed text-[#68716D]">
              Tập trung vào độ phủ thực tế, khả năng lau chùi vượt trội, hàm lượng VOC cực thấp an toàn cho trẻ nhỏ và người già.
            </p>
          </div>

          <div class="border border-[#E5E3DC] bg-white p-8">
            <h3 class="text-lg font-semibold text-[#283235]">3. Định hướng hợp tác</h3>
            <p class="mt-3 text-[14px] leading-relaxed text-[#68716D]">
              Đồng hành cùng kiến trúc sư, nhà thầu và các đại lý phân phối với chính sách bảo hành rõ ràng, hỗ trợ mẫu thử và phối màu 3D miễn phí.
            </p>
          </div>
        </div>
      </div>
    </section>
  </main>

  ${renderFooter(0)}
</body>
</html>`;

  savePage('gioi-thieu.html', 'gioi-thieu', html);
}

// ==========================================
// 5. BUILD LIEN-HE (LIÊN HỆ WANDERS)
// ==========================================
function buildLienHePage() {
  console.log('Building Lien-He Page...');

  const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  ${renderHead('Liên hệ — WANDERS', 'Liên hệ WANDERS: Hotline 0937.760.688, Email wanderspaint@gmail.com, địa chỉ Lam Điền, Xã Quảng Bị, Hà Nội. Tư vấn giải pháp sơn và phối màu miễn phí.', 0)}
</head>
<body class="bg-[#F8F6F1] text-[#273134]">
  ${renderHeader('lien-he', 0)}

  <main>
    <section class="border-b border-[#E5E3DC] bg-[#F8F6F0] py-16 lg:py-24">
      <div class="base44-container">
        <p class="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#68716D]">
          <span class="h-px w-8 bg-[#D36A44]"></span>
          WANDERS DIRECT CONTACT
        </p>
        <h1 class="text-[34px] sm:text-[44px] lg:text-[52px] font-semibold leading-[1.1] tracking-[-0.02em] text-[#283235]">
          Liên hệ WANDERS
        </h1>
        <p class="mt-4 max-w-[640px] text-[16px] leading-[1.7] text-[#68716D]">
          Chúng tôi luôn sẵn sàng lắng nghe, tư vấn màu sắc và hỗ trợ kỹ thuật tận nơi cho công trình của bạn.
        </p>
      </div>
    </section>

    <section class="py-16 lg:py-24">
      <div class="base44-container">
        
        <div class="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          
          <!-- THÔNG TIN CHÍNH THỨC -->
          <div>
            <h2 class="text-2xl font-semibold text-[#283235]">Thông tin kết nối</h2>
            <p class="mt-3 text-[15px] leading-relaxed text-[#68716D]">
              Hãy liên hệ trực tiếp với bộ phận chăm sóc khách hàng hoặc văn phòng điều hành WANDERS qua các kênh chính thức:
            </p>

            <div class="mt-8 space-y-6">
              
              <div class="border border-[#E5E3DC] bg-white p-6 shadow-sm">
                <span class="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D36A44]">HOTLINE TƯ VẤN</span>
                <p class="mt-2 text-2xl font-bold text-[#283235]">
                  <a href="tel:0937760688" class="hover:text-[#D36A44] transition-colors">0937.760.688</a>
                </p>
                <p class="mt-1 text-[13px] text-[#68716D]">Hỗ trợ kỹ thuật &amp; đặt hàng 24/7</p>
              </div>

              <div class="border border-[#E5E3DC] bg-white p-6 shadow-sm">
                <span class="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D36A44]">EMAIL LIÊN HỆ</span>
                <p class="mt-2 text-lg font-bold text-[#283235]">
                  <a href="mailto:wanderspaint@gmail.com" class="hover:text-[#D36A44] transition-colors">wanderspaint@gmail.com</a>
                </p>
                <p class="mt-1 text-[13px] text-[#68716D]">Tiếp nhận hồ sơ dự án &amp; đại lý</p>
              </div>

              <div class="border border-[#E5E3DC] bg-white p-6 shadow-sm">
                <span class="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D36A44]">ĐỊA CHỈ TRỤ SỞ</span>
                <p class="mt-2 text-[15px] font-bold text-[#283235]">
                  Lam Điền, Xã Quảng Bị, Thành phố Hà Nội
                </p>
                <p class="mt-1 text-[13px] text-[#68716D]">Nhà máy sản xuất: KCN Ngọc Hồi, Thanh Trì, Hà Nội</p>
              </div>

            </div>
          </div>

          <!-- FORM TƯ VẤN TRỰC TIẾP (HOẠT ĐỘNG HOÀN TOÀN) -->
          <div class="border border-[#E5E3DC] bg-white p-8 sm:p-10 shadow-sm">
            <h2 class="text-2xl font-semibold text-[#283235]">Gửi yêu cầu tư vấn</h2>
            <p class="mt-2 text-[14px] text-[#68716D]">Vui lòng điền thông tin bên dưới, chuyên viên WANDERS sẽ liên hệ lại trong vòng 30 phút.</p>

            <form id="contactConsultForm" class="mt-8 space-y-5">
              
              <div>
                <label class="block text-[12px] font-semibold uppercase tracking-[0.14em] text-[#283235]" for="fullName">Họ và tên *</label>
                <input class="mt-2 w-full border border-[#E5E3DC] bg-[#F8F6F1] px-4 py-3 text-[14.5px] text-[#283235] focus:border-[#283235] focus:outline-none" type="text" id="fullName" required placeholder="Ví dụ: Nguyễn Văn A">
              </div>

              <div class="grid gap-5 sm:grid-cols-2">
                <div>
                  <label class="block text-[12px] font-semibold uppercase tracking-[0.14em] text-[#283235]" for="phone">Số điện thoại *</label>
                  <input class="mt-2 w-full border border-[#E5E3DC] bg-[#F8F6F1] px-4 py-3 text-[14.5px] text-[#283235] focus:border-[#283235] focus:outline-none" type="tel" id="phone" required placeholder="09xx xxx xxx">
                </div>

                <div>
                  <label class="block text-[12px] font-semibold uppercase tracking-[0.14em] text-[#283235]" for="email">Email</label>
                  <input class="mt-2 w-full border border-[#E5E3DC] bg-[#F8F6F1] px-4 py-3 text-[14.5px] text-[#283235] focus:border-[#283235] focus:outline-none" type="email" id="email" placeholder="email@example.com">
                </div>
              </div>

              <div>
                <label class="block text-[12px] font-semibold uppercase tracking-[0.14em] text-[#283235]" for="projectType">Loại công trình</label>
                <select class="mt-2 w-full border border-[#E5E3DC] bg-[#F8F6F1] px-4 py-3 text-[14.5px] text-[#283235] focus:border-[#283235] focus:outline-none" id="projectType">
                  <option value="biet-thu">Biệt thự / Villa</option>
                  <option value="nha-pho">Nhà phố / Liền kề</option>
                  <option value="can-ho">Căn hộ chung cư</option>
                  <option value="thuong-mai">Showroom / Quán cà phê / Nhà hàng</option>
                  <option value="cong-trinh-khac">Công trình khác</option>
                </select>
              </div>

              <div>
                <label class="block text-[12px] font-semibold uppercase tracking-[0.14em] text-[#283235]" for="message">Diện tích hoặc yêu cầu tư vấn</label>
                <textarea class="mt-2 w-full border border-[#E5E3DC] bg-[#F8F6F1] px-4 py-3 text-[14.5px] text-[#283235] focus:border-[#283235] focus:outline-none" id="message" rows="4" placeholder="Nhập diện tích sàn hoặc nội dung cần tư vấn cụ thể..."></textarea>
              </div>

              <button type="submit" class="w-full btn-terracotta py-4 justify-center">
                <span>GỬI THÔNG TIN TƯ VẤN NGAY</span>
                <span>→</span>
              </button>

              <div id="formSuccessAlert" class="hidden p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[14px]">
                Cảm ơn bạn! Yêu cầu tư vấn đã được gửi thành công đến đội ngũ kỹ thuật WANDERS. Chúng tôi sẽ liên hệ trong ít phút.
              </div>
            </form>

          </div>

        </div>

      </div>
    </section>
  </main>

  ${renderFooter(0)}

  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const form = document.getElementById('contactConsultForm');
      const alertBox = document.getElementById('formSuccessAlert');

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        alertBox.classList.remove('hidden');
        form.reset();
        setTimeout(() => {
          alertBox.classList.add('hidden');
        }, 8000);
      });
    });
  </script>
</body>
</html>`;

  savePage('lien-he.html', 'lien-he', html);
}

// Master Runner
function buildAllPages() {
  console.log('--- STARTING COMPREHENSIVE BASE44 BUILD ---');
  buildSanPhamPage();
  buildBangMauPage();
  buildDuAnPage();
  buildGioiThieuPage();
  buildLienHePage();
  console.log('--- COMPREHENSIVE BASE44 BUILD COMPLETE ---');
}

module.exports = { buildAllPages };

if (require.main === module) {
  buildAllPages();
}

