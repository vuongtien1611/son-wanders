const fs = require('fs');
const path = require('path');
const {
  renderHead,
  renderHeader,
  renderConsultationCta,
  renderFooter,
  renderMobileDrawer,
  renderCoreScripts,
} = require('./wanders_layout');

function generatePageHtml(isSubdir = false, pageTitle = 'Bảng màu & Color Studio — WANDERS', canonicalPath = 'bang-mau.html') {
  const prefix = isSubdir ? '../' : './';

  return `<!DOCTYPE html>
<html lang="vi">
${renderHead({
  prefix,
  title: pageTitle,
  description: 'Khám phá bảng màu sơn WANDERS: trải nghiệm Color Studio, tra cứu nhanh, chọn mẫu màu và xem mã HEX cho không gian kiến trúc.',
  ogImage: 'images/base44/2bf1eb277_generated_476435e1.png',
  canonicalPath,
  extraCss: ['wanders_color_studio.css'],
})}
<body class="font-body antialiased">
  ${renderHeader(prefix, 'bang-mau')}

  <main>
    <!-- ============================================================ -->
    <!-- HERO BANNER (ARCHITECTURAL DEEP FOREST GREEN)                -->
    <!-- ============================================================ -->
    <section class="color-hero-section">
      <div class="absolute inset-0">
        <span class="inline-block relative h-full w-full object-cover">
          <img class="w-full h-full inset-0 absolute object-cover" alt="Bảng màu WANDERS" width="1440" height="440" src="${prefix}images/base44/2bf1eb277_generated_476435e1.png">
        </span>
        <div class="color-hero-overlay"></div>
      </div>

      <div class="wanders-container color-hero-inner">
        <p class="w-eyebrow w-eyebrow--light w-hero-stagger w-hero-stagger--1">
          <span class="w-eyebrow-line"></span>Color Studio · 120 sắc độ chuẩn
        </p>
        <h1 class="w-subhero-title mt-4 max-w-[24ch] text-[#FFFFFF] w-hero-stagger w-hero-stagger--2">
          Bảng màu WANDERS
        </h1>
        <p class="mt-3 max-w-[58ch] text-[14.5px] leading-[1.7] text-[#F6F3EC]/85 sm:text-[15.5px] w-hero-stagger w-hero-stagger--3">
          Tra cứu nhanh, lọc theo sắc độ và đối chiếu mã màu HEX chuẩn xác cho không gian nội thất và ngoại thất.
        </p>
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- COLOR STUDIO (ACCURATE ARCHITECTURAL TOOL — PURE HEX)        -->
    <!-- ============================================================ -->
    <section id="color-studio-app">
      <div class="wanders-container">

        <div id="studio-toast" class="studio-toast">
          <svg width="20" height="20" style="color: #D6AD45;" class="shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
          <span id="studio-toast-msg">Đã sao chép!</span>
        </div>

        <div class="color-studio-layout">
          <aside class="color-filter-panel studio-sidebar-card space-y-6">
            <div>
              <h2 class="w-ui-title text-[15px] font-bold tracking-tight" style="color: #073B2E;">Tra cứu &amp; lọc màu</h2>

              <div class="relative mt-3">
                <svg width="17" height="17" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                <input id="color-search-input" type="text" placeholder="Tìm mã màu hoặc tên..." class="w-full h-11 rounded-xl">
                <button id="color-search-clear" type="button" aria-label="Xóa tìm kiếm" class="hidden absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1">
                  <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
            </div>

            <div>
              <h3 class="text-[13px] font-semibold mb-2.5" style="color: #273238;">Bộ sưu tập màu</h3>
              <div id="collection-pills" class="space-y-1.5"></div>
            </div>

            <div>
              <h3 class="text-[13px] font-semibold mb-2.5" style="color: #273238;">Lọc nâng cao</h3>
              <div class="space-y-2.5">
                <div>
                  <label for="filter-shade" class="block text-[11px] font-medium mb-1" style="color: #5A6468;">Sắc độ</label>
                  <select id="filter-shade" class="studio-select w-full text-[12.5px]">
                    <option value="all">Tất cả sắc độ</option>
                    <option value="light">Sắc độ nhạt (Pastel)</option>
                    <option value="medium">Sắc độ vừa (Trung tính)</option>
                    <option value="deep">Sắc độ đậm (Sâu)</option>
                  </select>
                </div>

                <div>
                  <label for="filter-brightness" class="block text-[11px] font-medium mb-1" style="color: #5A6468;">Độ sáng</label>
                  <select id="filter-brightness" class="studio-select w-full text-[12.5px]">
                    <option value="all">Tất cả độ sáng</option>
                    <option value="high">Sáng cao</option>
                    <option value="mid">Sáng vừa</option>
                    <option value="dark">Trầm / Tối</option>
                  </select>
                </div>

                <div>
                  <label for="filter-tone" class="block text-[11px] font-medium mb-1" style="color: #5A6468;">Tông màu</label>
                  <select id="filter-tone" class="studio-select w-full text-[12.5px]">
                    <option value="all">Tất cả tông</option>
                    <option value="warm">Tông ấm (Warm)</option>
                    <option value="cool">Tông lạnh (Cool)</option>
                    <option value="neutral">Trung tính (Neutral)</option>
                  </select>
                </div>
              </div>

              <button id="btn-reset-filters" type="button" class="mt-4 flex items-center gap-1.5 text-[12px] transition-colors hover:text-[#073B2E]" style="color: #5A6468;">
                <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                <span>Xóa bộ lọc</span>
              </button>
            </div>
          </aside>

          <div class="color-main-panel min-w-0">
            <!-- Active Color Preview Banner (Pure Flat HEX, 220ms transition) -->
            <div id="active-color-banner" class="studio-active-banner" style="background-color: #D49B8E;">
              <div class="studio-active-banner-overlay"></div>

              <div class="flex items-center justify-between relative z-10">
                <span id="active-banner-tag" class="text-[11px] font-bold tracking-[0.2em] uppercase text-white/90">
                  MÀU ĐANG XEM
                </span>

                <div class="flex items-center gap-2">
                  <button id="btn-fav-color" type="button" aria-label="Lưu yêu thích" class="banner-action-btn text-white">
                    <svg id="icon-heart" width="16" height="16" class="fill-none stroke-current" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                  </button>

                  <button id="btn-copy-color" type="button" aria-label="Sao chép mã màu" class="banner-action-btn text-white">
                    <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  </button>
                </div>
              </div>

              <div class="relative z-10 flex items-end justify-between gap-4">
                <div>
                  <div id="active-banner-code" class="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-none">
                    WN0824
                  </div>
                  <div class="flex flex-wrap items-center gap-2.5 mt-1.5">
                    <span id="active-banner-name" class="text-[14px] sm:text-[15px] font-medium text-white/90">
                      Prairie Gentian
                    </span>
                    <span id="active-banner-hex" class="text-[12px] font-mono px-2.5 py-0.5 rounded-md bg-black/15 text-white/95">
                      #D49B8E
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="studio-toolbar">
              <div class="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1">
                <select id="toolbar-collection-select" aria-label="Chọn bộ sưu tập màu" class="studio-select text-[12.5px]">
                  <option value="warm-neutral">Trung tính ấm</option>
                  <option value="earth-tone">Tông đất</option>
                  <option value="sage-green">Xanh cỏ thơm</option>
                  <option value="modern-blue">Xanh hiện đại</option>
                  <option value="soft-white">Trắng mềm</option>
                </select>

                <select id="toolbar-shade-select" aria-label="Chọn sắc độ" class="studio-select text-[12.5px]">
                  <option value="all">Tất cả sắc độ</option>
                  <option value="light">Sắc độ nhạt</option>
                  <option value="medium">Sắc độ vừa</option>
                  <option value="deep">Sắc độ đậm</option>
                </select>

                <span id="color-count-badge" class="hidden sm:inline-flex text-[11.5px] font-semibold bg-white px-2.5 py-1.5 rounded-xl shadow-sm" style="color: #5A6468; border: 1px solid #E2DDD2;">
                  24 màu
                </span>
              </div>

              <div class="view-toggle-wrap shrink-0">
                <button id="btn-view-grid" type="button" aria-label="Lưới chuẩn" class="view-toggle-btn active">
                  <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="7" height="7" rx="1"></rect>
                    <rect x="14" y="3" width="7" height="7" rx="1"></rect>
                    <rect x="14" y="14" width="7" height="7" rx="1"></rect>
                    <rect x="3" y="14" width="7" height="7" rx="1"></rect>
                  </svg>
                </button>
                <button id="btn-view-compact" type="button" aria-label="Lưới thu gọn" class="view-toggle-btn">
                  <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <line x1="4" y1="6" x2="20" y2="6"></line>
                    <line x1="4" y1="12" x2="20" y2="12"></line>
                    <line x1="4" y1="18" x2="20" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>

            <div id="swatch-grid-container" class="relative min-h-[300px]">
              <div id="swatch-grid" class="color-swatch-grid"></div>

              <div id="swatch-empty" class="hidden text-center py-16 bg-white rounded-2xl p-6" style="border: 1px solid #E2DDD2;">
                <svg width="44" height="44" class="mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <p class="text-base font-semibold" style="color: #073B2E;">Không tìm thấy màu phù hợp</p>
                <p class="text-[13px] mt-1" style="color: #5A6468;">Hãy thử tìm với từ khóa khác hoặc xóa bộ lọc.</p>
                <button type="button" onclick="document.getElementById('btn-reset-filters').click()" class="wanders-btn-primary inline-flex mt-4 px-5 py-2.5 text-[12px]">
                  Xóa bộ lọc
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- GỢI Ý PHỐI MÀU (WHITE SECTION, PURE HEX SWATCHES)            -->
    <!-- ============================================================ -->
    <section class="suggested-section py-16 lg:py-20">
      <div class="wanders-container">
        <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 w-reveal">
          <div>
            <p class="suggested-tag">
              <span class="suggested-tag-line"></span>GỢI Ý PHỐI MÀU
            </p>
            <h2 class="w-section-title mt-3" style="color: #073B2E;">
              Phối màu hài hòa cho không gian sống
            </h2>
          </div>
          <a href="#color-studio-app" class="w-text-link">
            <span>Lên đầu bảng màu</span>
            <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14"></path><path stroke-linecap="round" stroke-linejoin="round" d="m12 5 7 7-7 7"></path></svg>
          </a>
        </div>

        <div class="suggested-palettes-grid">
          <div class="suggested-palette-card group w-reveal">
            <div class="aspect-[16/10] overflow-hidden relative bg-[#E8E2D5]">
              <img src="${prefix}images/base44/edf841af7_generated_77536f0e.png" alt="Nền ấm thư giãn" width="350" height="219" class="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700">
            </div>
            <div class="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 class="text-[16px] font-semibold" style="color: #073B2E;">Nền ấm thư giãn</h3>
                <p class="text-[13px] mt-1.5 leading-relaxed" style="color: #5A6468;">Tông tường màu ấm, nhẹ nhàng và dễ ứng dụng.</p>
                <div class="flex gap-1.5 mt-4">
                  <span class="h-6 flex-1 rounded border border-black/10" style="background-color: #F3EADB;" title="WN0809 — Linen Cream"></span>
                  <span class="h-6 flex-1 rounded border border-black/10" style="background-color: #CDB99C;" title="WN0817 — Clay Beige"></span>
                  <span class="h-6 flex-1 rounded border border-black/10" style="background-color: #283235;" title="WN0819 — Taupe Mocha"></span>
                </div>
              </div>
              <button type="button" onclick="applyPresetPalette(['#F3EADB', '#CDB99C', '#283235'], 'Nền ấm thư giãn')" class="suggested-card-btn">
                Xem chi tiết
                <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </button>
            </div>
          </div>

          <div class="suggested-palette-card group w-reveal w-reveal-delay-1">
            <div class="aspect-[16/10] overflow-hidden relative bg-[#E8E2D5]">
              <img src="${prefix}images/base44/08867f386_generated_9bb6eef6.png" alt="Hồng đất hiện đại" width="350" height="219" class="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700">
            </div>
            <div class="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 class="text-[16px] font-semibold" style="color: #073B2E;">Hồng đất hiện đại</h3>
                <p class="text-[13px] mt-1.5 leading-relaxed" style="color: #5A6468;">Gam màu ấm tạo sự dễ chịu cho phòng ngủ.</p>
                <div class="flex gap-1.5 mt-4">
                  <span class="h-6 flex-1 rounded border border-black/10" style="background-color: #D49B8E;" title="WN0824 — Prairie Gentian"></span>
                  <span class="h-6 flex-1 rounded border border-black/10" style="background-color: #C58A63;" title="ET0104 — Terracotta Glow"></span>
                  <span class="h-6 flex-1 rounded border border-black/10" style="background-color: #63382A;" title="ET0124 — Ancient Soil"></span>
                </div>
              </div>
              <button type="button" onclick="applyPresetPalette(['#D49B8E', '#C58A63', '#63382A'], 'Hồng đất hiện đại')" class="suggested-card-btn">
                Xem chi tiết
                <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </button>
            </div>
          </div>

          <div class="suggested-palette-card group w-reveal w-reveal-delay-2">
            <div class="aspect-[16/10] overflow-hidden relative bg-[#E8E2D5]">
              <img src="${prefix}images/base44/8099d7d28_generated_8abc6bed.png" alt="Xanh cỏ thơm thanh lịch" width="350" height="219" class="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700">
            </div>
            <div class="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 class="text-[16px] font-semibold" style="color: #073B2E;">Xanh cỏ thơm thanh lịch</h3>
                <p class="text-[13px] mt-1.5 leading-relaxed" style="color: #5A6468;">Tạo cảm giác thoáng đãng lại gần gũi thiên nhiên.</p>
                <div class="flex gap-1.5 mt-4">
                  <span class="h-6 flex-1 rounded border border-black/10" style="background-color: #CFD3BE;" title="SG0203 — Sage Mist"></span>
                  <span class="h-6 flex-1 rounded border border-black/10" style="background-color: #83906F;" title="SG0211 — Thyme Blossom"></span>
                  <span class="h-6 flex-1 rounded border border-black/10" style="background-color: #EFE6D8;" title="SW0403 — Warm Alabaster"></span>
                </div>
              </div>
              <button type="button" onclick="applyPresetPalette(['#CFD3BE', '#83906F', '#EFE6D8'], 'Xanh cỏ thơm thanh lịch')" class="suggested-card-btn">
                Xem chi tiết
                <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </button>
            </div>
          </div>

          <div class="suggested-palette-card group w-reveal w-reveal-delay-3">
            <div class="aspect-[16/10] overflow-hidden relative bg-[#E8E2D5]">
              <img src="${prefix}images/base44/7266e0bc1_generated_27f36fa1.png" alt="Xanh hiện đại cân bằng" width="350" height="219" class="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700">
            </div>
            <div class="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 class="text-[16px] font-semibold" style="color: #073B2E;">Xanh hiện đại cân bằng</h3>
                <p class="text-[13px] mt-1.5 leading-relaxed" style="color: #5A6468;">Thích hợp cho phòng khách và không gian mở.</p>
                <div class="flex gap-1.5 mt-4">
                  <span class="h-6 flex-1 rounded border border-black/10" style="background-color: #DCE3E4;" title="MB0301 — Coastal Cloud"></span>
                  <span class="h-6 flex-1 rounded border border-black/10" style="background-color: #8098A1;" title="MB0316 — Storm Gray-Blue"></span>
                  <span class="h-6 flex-1 rounded border border-black/10" style="background-color: #FCFAF6;" title="SW0401 — Cotton White"></span>
                </div>
              </div>
              <button type="button" onclick="applyPresetPalette(['#DCE3E4', '#8098A1', '#FCFAF6'], 'Xanh hiện đại cân bằng')" class="suggested-card-btn">
                Xem chi tiết
                <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    ${renderConsultationCta(prefix)}
  </main>

  ${renderFooter(prefix)}
  ${renderMobileDrawer(prefix)}
  ${renderCoreScripts(prefix, { extraScripts: ['wanders_color_studio_v2.js'] })}
</body>
</html>`;
}

const targets = [
  { path: 'giao-dien/website_download/bang-mau.html', isSubdir: false, title: 'Bảng màu & Color Studio — WANDERS', canonical: 'bang-mau.html' },
  { path: 'giao-dien/website_download/cam-hung-mau-sac.html', isSubdir: false, title: 'Cảm hứng màu sắc & Color Studio — WANDERS', canonical: 'cam-hung-mau-sac.html' },
  { path: 'giao-dien/website_download/bang-mau/index.html', isSubdir: true, title: 'Bảng màu & Color Studio — WANDERS', canonical: 'bang-mau.html' },
  { path: 'giao-dien/website_download/cam-hung-mau-sac/index.html', isSubdir: true, title: 'Cảm hứng màu sắc & Color Studio — WANDERS', canonical: 'cam-hung-mau-sac.html' }
];

targets.forEach((t) => {
  const dir = path.dirname(t.path);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(t.path, generatePageHtml(t.isSubdir, t.title, t.canonical), 'utf8');
  console.log('Built unified Color Studio page:', t.path);
});
