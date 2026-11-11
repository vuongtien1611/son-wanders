const fs = require('fs');
const path = require('path');

// Read existing bang-mau.html
const srcPath = path.join(__dirname, '../website_download/bang-mau.html');
let html = fs.readFileSync(srcPath, 'utf8');

// Build the complete Studio V2 HTML & JS
const studioV2Html = `
  <main>
    <!-- Hero Banner (Preserved WANDERS Style) -->
    <section class="relative isolate overflow-hidden bg-charcoal">
      <div class="absolute inset-0">
        <span class="inline-block relative h-full w-full object-cover">
          <span class="block relative w-full h-full overflow-hidden">
            <img loading="lazy" class="w-full h-full inset-0 absolute object-cover" alt="Bảng màu WANDERS" src="./images/base44/2bf1eb277_generated_476435e1.png">
          </span>
        </span>
        <div class="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/50 to-charcoal/40"></div>
      </div>
      <div class="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col justify-end pb-12 pt-24 sm:pb-14 min-h-[360px] lg:min-h-[440px]">
        <p class="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#E0A899]">
          <span class="h-0.5 w-7 bg-[#C56E4F]"></span>MÀU ĐANG XEM — BẢNG MÀU WANDERS
        </p>
        <h1 class="rise mt-3 max-w-[24ch] text-balance text-[32px] font-bold leading-[1.08] tracking-[-0.02em] text-white sm:text-[42px] lg:text-[50px]">
          Bảng màu WANDERS
        </h1>
        <p class="mt-4 max-w-[62ch] text-[14.5px] leading-[1.7] text-bone/85 sm:text-[15.5px]">
          Chăm sóc từng chi tiết nhỏ để mang lại vẻ đẹp bóng bẩy cho ngôi nhà WANDERS. Tra cứu nhanh, lựa chọn rõ ràng, phối nhiều màu trực quan và xem trước ngay trên không gian phòng khách hoặc phòng ngủ.
        </p>
      </div>
    </section>

    <!-- SECTION 1: WANDERS COLOR STUDIO V2 (3-COLUMN LAYOUT) -->
    <section id="color-studio-app" class="bg-[#F8F6F0] py-8 lg:py-12 border-t border-line">
      <div class="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        
        <!-- Toast Notification -->
        <div id="studio-toast" class="fixed bottom-6 right-6 z-50 transform translate-y-20 opacity-0 transition-all duration-300 pointer-events-none bg-charcoal text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-white/10 text-sm font-medium">
          <svg class="w-5 h-5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
          <span id="studio-toast-msg">Đã sao chép!</span>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-[260px_1fr_330px] gap-6 items-start">
          
          <!-- ========================================== -->
          <!-- 1. SIDEBAR TRÁI: Tra cứu & lọc màu         -->
          <!-- ========================================== -->
          <aside class="bg-white rounded-2xl p-5 border border-black/5 shadow-sm space-y-6">
            <div>
              <h2 class="text-[15px] font-bold text-charcoal tracking-tight">Tra cứu &amp; lọc màu</h2>
              
              <!-- Search Input -->
              <div class="relative mt-3">
                <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                <input id="color-search-input" type="text" placeholder="Tìm mã màu hoặc tên màu..." 
                  class="w-full pl-9 pr-8 py-2.5 text-[13px] rounded-xl border border-gray-200 bg-[#FAFAFA] placeholder-gray-400 focus:bg-white focus:outline-none focus:border-[#0F4C3A] focus:ring-1 focus:ring-[#0F4C3A] transition-all">
                <button id="color-search-clear" type="button" class="hidden absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
            </div>

            <!-- Bộ sưu tập màu -->
            <div>
              <h3 class="text-[13px] font-semibold text-charcoal mb-2.5">Bộ sưu tập màu</h3>
              <div id="collection-pills" class="space-y-1.5">
                <!-- Dynamically rendered pills -->
              </div>
            </div>

            <!-- Lọc nâng cao -->
            <div>
              <h3 class="text-[13px] font-semibold text-charcoal mb-2.5">Lọc nâng cao</h3>
              <div class="space-y-3">
                <!-- Sắc độ -->
                <div>
                  <label class="block text-[11.5px] font-medium text-ink/75 mb-1">Sắc độ</label>
                  <select id="filter-shade" class="w-full py-2 px-3 text-[12.5px] rounded-xl border border-gray-200 bg-[#FAFAFA] focus:bg-white focus:outline-none focus:border-[#0F4C3A]">
                    <option value="all">Tất cả sắc độ</option>
                    <option value="light">Sắc độ nhạt (Pastel)</option>
                    <option value="medium">Sắc độ vừa (Trung tính)</option>
                    <option value="deep">Sắc độ đậm (Sâu)</option>
                  </select>
                </div>

                <!-- Độ sáng -->
                <div>
                  <label class="block text-[11.5px] font-medium text-ink/75 mb-1">Độ sáng</label>
                  <select id="filter-brightness" class="w-full py-2 px-3 text-[12.5px] rounded-xl border border-gray-200 bg-[#FAFAFA] focus:bg-white focus:outline-none focus:border-[#0F4C3A]">
                    <option value="all">Tất cả độ sáng</option>
                    <option value="high">Sáng cao</option>
                    <option value="mid">Sáng vừa</option>
                    <option value="dark">Trầm / Tối</option>
                  </select>
                </div>

                <!-- Tông màu -->
                <div>
                  <label class="block text-[11.5px] font-medium text-ink/75 mb-1">Tông màu</label>
                  <select id="filter-tone" class="w-full py-2 px-3 text-[12.5px] rounded-xl border border-gray-200 bg-[#FAFAFA] focus:bg-white focus:outline-none focus:border-[#0F4C3A]">
                    <option value="all">Tất cả tông</option>
                    <option value="warm">Tông ấm (Warm)</option>
                    <option value="cool">Tông lạnh (Cool)</option>
                    <option value="neutral">Trung tính (Neutral)</option>
                  </select>
                </div>
              </div>

              <!-- Nút Xóa bộ lọc -->
              <button id="btn-reset-filters" type="button" class="mt-4 flex items-center gap-1.5 text-[12px] text-ink/70 hover:text-charcoal transition-colors">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                <span>Xóa bộ lọc</span>
              </button>
            </div>
          </aside>

          <!-- ========================================== -->
          <!-- 2. CỘT GIỮA: Central Color Studio          -->
          <!-- ========================================== -->
          <div class="min-w-0">
            
            <!-- Khu vực 1: Banner màu đang chọn (Active Color Preview) -->
            <div id="active-color-banner" 
              class="w-full h-[140px] rounded-2xl relative overflow-hidden p-6 sm:p-7 flex flex-col justify-between transition-colors duration-300 border border-black/5 shadow-sm"
              style="background-color: #D49B8E;">
              
              <!-- Subtle decorative lighting accent on right side -->
              <div class="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-black/10 via-black/5 to-transparent pointer-events-none"></div>

              <!-- Top Row: Subtitle + Action buttons -->
              <div class="flex items-center justify-between relative z-10">
                <span id="active-banner-tag" class="text-[11px] font-bold tracking-[0.2em] uppercase text-white/90">
                  MÀU ĐANG XEM
                </span>
                
                <div class="flex items-center gap-2">
                  <!-- Lưu yêu thích -->
                  <button id="btn-fav-color" type="button" aria-label="Lưu yêu thích" 
                    class="w-8 h-8 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/50 transition-all shadow-sm">
                    <svg id="icon-heart" class="w-4 h-4 fill-none stroke-current" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                  </button>
                  
                  <!-- Copy mã màu -->
                  <button id="btn-copy-color" type="button" aria-label="Sao chép mã màu" 
                    class="w-8 h-8 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/50 transition-all shadow-sm">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Bottom Row: Big Color Code + Name -->
              <div class="relative z-10">
                <div id="active-banner-code" class="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-none">
                  WN0824
                </div>
                <div id="active-banner-name" class="text-[14px] sm:text-[15px] font-medium text-white/90 mt-1.5">
                  Prairie Gentian
                </div>
              </div>
            </div>

            <!-- Khu vực 2: Toolbar thanh công cụ -->
            <div class="h-11 flex items-center justify-between mt-4 mb-3.5 gap-3">
              <!-- Left side: Dropdowns & Counter -->
              <div class="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1">
                <!-- Dropdown chọn Bộ sưu tập -->
                <select id="toolbar-collection-select" 
                  class="py-2 pl-3 pr-8 text-[12.5px] font-medium rounded-xl border border-gray-200 bg-white text-charcoal focus:outline-none focus:border-[#0F4C3A] cursor-pointer shadow-2xl">
                  <option value="warm-neutral">Trung tính ấm</option>
                  <option value="earth-tone">Tông đất</option>
                  <option value="sage-green">Xanh cỏ thơm</option>
                  <option value="modern-blue">Xanh hiện đại</option>
                  <option value="soft-white">Trắng mềm</option>
                </select>

                <!-- Dropdown chọn Sắc độ -->
                <select id="toolbar-shade-select" 
                  class="py-2 pl-3 pr-8 text-[12.5px] font-medium rounded-xl border border-gray-200 bg-white text-charcoal focus:outline-none focus:border-[#0F4C3A] cursor-pointer shadow-2xl">
                  <option value="all">Tất cả sắc độ</option>
                  <option value="light">Sắc độ nhạt</option>
                  <option value="medium">Sắc độ vừa</option>
                  <option value="deep">Sắc độ đậm</option>
                </select>

                <!-- Color count badge -->
                <span id="color-count-badge" class="hidden sm:inline-flex text-[11px] font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg">
                  24 màu
                </span>
              </div>

              <!-- Right side: Nút Grid View & Compact View -->
              <div class="flex items-center gap-1.5 shrink-0 bg-white p-1 rounded-xl border border-gray-200">
                <!-- Grid View button -->
                <button id="btn-view-grid" type="button" aria-label="Lưới chuẩn" 
                  class="w-8 h-8 rounded-lg flex items-center justify-center transition-colors bg-[#0F4C3A] text-white">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="7" height="7" rx="1"></rect>
                    <rect x="14" y="3" width="7" height="7" rx="1"></rect>
                    <rect x="14" y="14" width="7" height="7" rx="1"></rect>
                    <rect x="3" y="14" width="7" height="7" rx="1"></rect>
                  </svg>
                </button>

                <!-- Compact View button -->
                <button id="btn-view-compact" type="button" aria-label="Lưới thu gọn" 
                  class="w-8 h-8 rounded-lg flex items-center justify-center transition-colors text-gray-400 hover:text-gray-700 hover:bg-gray-50">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <line x1="4" y1="6" x2="20" y2="6"></line>
                    <line x1="4" y1="12" x2="20" y2="12"></line>
                    <line x1="4" y1="18" x2="20" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Khu vực 3: Lưới ô màu (Color Swatch Grid) -->
            <div id="swatch-grid-container" class="relative min-h-[300px]">
              <div id="swatch-grid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-3 gap-y-4">
                <!-- Swatch cards rendered dynamically -->
              </div>

              <!-- Empty state for no results -->
              <div id="swatch-empty" class="hidden text-center py-16 bg-white rounded-2xl border border-gray-200/60 p-6">
                <svg class="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <p class="text-base font-semibold text-charcoal">Không tìm thấy màu phù hợp</p>
                <p class="text-[13px] text-gray-500 mt-1">Hãy thử tìm với từ khóa khác hoặc xóa bộ lọc.</p>
                <button type="button" onclick="document.getElementById('btn-reset-filters').click()" class="mt-4 px-4 py-2 text-[12px] font-medium bg-[#0F4C3A] text-white rounded-lg hover:bg-[#0b382b] transition-colors">
                  Xóa bộ lọc
                </button>
              </div>
            </div>

          </div>

          <!-- ========================================== -->
          <!-- 3. SIDEBAR PHẢI: Màu đang chọn & Bảng phối -->
          <!-- ========================================== -->
          <aside class="space-y-4">
            
            <!-- Card 1: Màu đang chọn -->
            <div class="bg-white rounded-2xl p-4 border border-black/5 shadow-sm">
              <h3 class="text-[13px] font-bold text-charcoal mb-3">Màu đang chọn</h3>
              <div class="flex items-center gap-3.5">
                <div id="sidebar-preview-color" class="w-14 h-14 rounded-xl shrink-0 border border-black/10 shadow-inner" style="background-color: #D49B8E;"></div>
                <div class="flex-1 min-w-0">
                  <div id="sidebar-preview-code" class="text-base font-bold text-charcoal truncate leading-tight">WN0824</div>
                  <div id="sidebar-preview-name" class="text-[12px] text-gray-500 truncate mt-0.5">Prairie Gentian</div>
                  <div id="sidebar-preview-hex" class="text-[11px] font-mono text-gray-400 mt-0.5">#D49B8E</div>
                </div>
                <button id="btn-save-bookmark" type="button" aria-label="Đánh dấu" class="text-gray-400 hover:text-[#0F4C3A] transition-colors p-1">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
                </button>
              </div>
            </div>

            <!-- Card 2: Bảng phối của bạn (3/4) -->
            <div class="bg-white rounded-2xl p-4 border border-black/5 shadow-sm">
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-[13px] font-bold text-charcoal">
                  Bảng phối của bạn <span id="palette-counter" class="text-gray-500 font-normal">(3/4)</span>
                </h3>
              </div>
              
              <!-- 4 Slots Grid -->
              <div id="palette-slots" class="grid grid-cols-4 gap-2 mb-3">
                <!-- 4 Slots rendered dynamically -->
              </div>

              <!-- Buttons -->
              <div class="space-y-2">
                <button id="btn-add-to-palette" type="button" 
                  class="w-full py-2.5 px-3 rounded-xl bg-[#0F4C3A] text-white text-[12.5px] font-semibold flex items-center justify-center gap-1.5 hover:bg-[#0b382b] transition-colors shadow-sm">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path></svg>
                  <span>Thêm vào bảng phối</span>
                </button>
                <button id="btn-clear-palette" type="button" 
                  class="w-full py-1.5 px-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-[11.5px] font-medium transition-colors text-center">
                  Xóa chọn
                </button>
              </div>
            </div>

            <!-- Card 3: Xem trước trên không gian -->
            <div class="bg-white rounded-2xl p-4 border border-black/5 shadow-sm">
              <h3 class="text-[13px] font-bold text-charcoal mb-2.5">Xem trước trên không gian</h3>
              
              <!-- Room Tabs: Phòng khách vs Phòng ngủ -->
              <div class="grid grid-cols-2 gap-1.5 p-1 bg-gray-100 rounded-xl mb-3">
                <button id="tab-room-living" type="button" 
                  class="py-1.5 px-2 text-[12px] font-semibold rounded-lg transition-all bg-[#0F4C3A] text-white shadow-sm flex items-center justify-center gap-1">
                  <span>🛋</span> Phòng khách
                </button>
                <button id="tab-room-bedroom" type="button" 
                  class="py-1.5 px-2 text-[12px] font-medium rounded-lg transition-all text-gray-600 hover:text-charcoal flex items-center justify-center gap-1">
                  <span>🛏</span> Phòng ngủ
                </button>
              </div>

              <!-- Room Preview Stage with SVG Wall Recoloring -->
              <div class="relative aspect-[16/10] rounded-xl overflow-hidden bg-gray-100 border border-gray-200 group">
                <!-- Base Room Photographic Layer -->
                <img id="room-base-img" src="./images/collection-purple-room.jpg" alt="Phòng khách WANDERS" class="w-full h-full object-cover">
                
                <!-- Realistic Wall Mask SVG Overlay -->
                <svg id="room-wall-svg" class="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1024 653" preserveAspectRatio="none">
                  <!-- Trần (Ceiling) -->
                  <polygon id="svg-ceiling" points="0,0 1024,0 1024,65 0,65" 
                    fill="#FAF8F5" style="mix-blend-mode: multiply; opacity: 0.85; transition: fill 0.4s ease;"></polygon>
                  
                  <!-- Tường nhấn (Accent Wall - Left Column) -->
                  <polygon id="svg-accent" points="0,65 240,65 240,480 0,510" 
                    fill="#A89098" style="mix-blend-mode: multiply; opacity: 0.88; transition: fill 0.4s ease;"></polygon>
                  
                  <!-- Tường chính (Main Back Wall) -->
                  <polygon id="svg-main" points="240,65 1024,65 1024,490 830,480 815,365 245,380 240,480" 
                    fill="#D49B8E" style="mix-blend-mode: multiply; opacity: 0.88; transition: fill 0.4s ease;"></polygon>
                </svg>

                <!-- Navigation Arrow Buttons -->
                <button id="btn-room-prev" type="button" aria-label="Xem phòng trước" 
                  class="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 hover:bg-white text-charcoal flex items-center justify-center shadow-md transition-all opacity-80 hover:opacity-100">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"></path></svg>
                </button>
                <button id="btn-room-next" type="button" aria-label="Xem phòng sau" 
                  class="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 hover:bg-white text-charcoal flex items-center justify-center shadow-md transition-all opacity-80 hover:opacity-100">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path></svg>
                </button>
              </div>

              <!-- 3 Wall Surface Selector Chips -->
              <div class="mt-3 space-y-1.5">
                <div class="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
                  Chọn bề mặt để sơn:
                </div>
                
                <!-- Chip 1: Tường chính -->
                <button id="chip-wall-main" type="button" 
                  class="w-full flex items-center justify-between p-2 rounded-xl border-2 border-[#0F4C3A] bg-emerald-50/50 text-left transition-all">
                  <div class="flex items-center gap-2.5">
                    <span id="chip-color-main" class="w-4 h-4 rounded-full border border-black/10 shrink-0" style="background-color: #D49B8E;"></span>
                    <span class="text-[12px] font-semibold text-charcoal">Tường chính</span>
                  </div>
                  <span id="chip-code-main" class="text-[11px] font-mono text-gray-500">WN0824</span>
                </button>

                <!-- Chip 2: Tường nhấn -->
                <button id="chip-wall-accent" type="button" 
                  class="w-full flex items-center justify-between p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-left transition-all">
                  <div class="flex items-center gap-2.5">
                    <span id="chip-color-accent" class="w-4 h-4 rounded-full border border-black/10 shrink-0" style="background-color: #A89098;"></span>
                    <span class="text-[12px] font-medium text-charcoal">Tường nhấn</span>
                  </div>
                  <span id="chip-code-accent" class="text-[11px] font-mono text-gray-500">HND088</span>
                </button>

                <!-- Chip 3: Trần -->
                <button id="chip-wall-ceiling" type="button" 
                  class="w-full flex items-center justify-between p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-left transition-all">
                  <div class="flex items-center gap-2.5">
                    <span id="chip-color-ceiling" class="w-4 h-4 rounded-full border border-black/10 shrink-0" style="background-color: #FAF8F5;"></span>
                    <span class="text-[12px] font-medium text-charcoal">Trần</span>
                  </div>
                  <span id="chip-code-ceiling" class="text-[11px] font-mono text-gray-500">Trắng mềm</span>
                </button>
              </div>

            </div>

          </aside>

        </div>

      </div>
    </section>

    <!-- SECTION 2: GỢI Ý PHỐI MÀU (Harmonious Curated Palettes) -->
    <section class="border-t border-line bg-cream py-14 lg:py-20">
      <div class="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-9">
          <div>
            <p class="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#C56E4F]">
              <span class="h-0.5 w-6 bg-[#C56E4F]"></span>GỢI Ý PHỐI MÀU
            </p>
            <h2 class="mt-2 text-[24px] sm:text-[30px] font-bold tracking-tight text-charcoal">
              Phối màu hài hòa cho không gian sống
            </h2>
          </div>
          <a href="#color-studio-app" class="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#0F4C3A] hover:text-[#0b382b] transition-colors">
            Xem thêm gợi ý phối màu
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
          </a>
        </div>

        <!-- 4 Curated Palette Cards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <!-- Card 1: Nền ấm thư giãn -->
          <div class="group bg-white rounded-2xl overflow-hidden border border-gray-200/80 hover:shadow-md transition-all duration-300 flex flex-col">
            <div class="aspect-[16/10] overflow-hidden relative bg-sand">
              <img src="./images/collection-purple-room.jpg" alt="Nền ấm thư giãn" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
            </div>
            <div class="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 class="text-[15px] font-bold text-charcoal">Nền ấm thư giãn</h3>
                <p class="text-[12.5px] text-gray-500 mt-1 leading-relaxed">
                  Tông tường màu ấm, nhẹ nhàng và dễ ứng dụng.
                </p>
                <!-- 3 Color Chips -->
                <div class="flex gap-1.5 mt-4">
                  <span class="h-6 flex-1 rounded-md border border-black/5" style="background-color: #F3EADB;" title="#F3EADB"></span>
                  <span class="h-6 flex-1 rounded-md border border-black/5" style="background-color: #CDB99C;" title="#CDB99C"></span>
                  <span class="h-6 flex-1 rounded-md border border-black/5" style="background-color: #283235;" title="#283235"></span>
                </div>
              </div>
              <button type="button" onclick="applyPresetPalette(['#F3EADB', '#CDB99C', '#283235'], 'Nền ấm thư giãn')" 
                class="mt-4 pt-3 border-t border-gray-100 inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-[#C56E4F] group-hover:text-[#0F4C3A] transition-colors">
                Xem chi tiết
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </button>
            </div>
          </div>

          <!-- Card 2: Hồng đất hiện đại -->
          <div class="group bg-white rounded-2xl overflow-hidden border border-gray-200/80 hover:shadow-md transition-all duration-300 flex flex-col">
            <div class="aspect-[16/10] overflow-hidden relative bg-sand">
              <img src="./images/base44/08867f386_generated_9bb6eef6.png" alt="Hồng đất hiện đại" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
            </div>
            <div class="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 class="text-[15px] font-bold text-charcoal">Hồng đất hiện đại</h3>
                <p class="text-[12.5px] text-gray-500 mt-1 leading-relaxed">
                  Gam màu ấm tạo sự dễ chịu cho phòng ngủ.
                </p>
                <!-- 3 Color Chips -->
                <div class="flex gap-1.5 mt-4">
                  <span class="h-6 flex-1 rounded-md border border-black/5" style="background-color: #D49B8E;" title="#D49B8E"></span>
                  <span class="h-6 flex-1 rounded-md border border-black/5" style="background-color: #C58A63;" title="#C58A63"></span>
                  <span class="h-6 flex-1 rounded-md border border-black/5" style="background-color: #63382A;" title="#63382A"></span>
                </div>
              </div>
              <button type="button" onclick="applyPresetPalette(['#D49B8E', '#C58A63', '#63382A'], 'Hồng đất hiện đại')" 
                class="mt-4 pt-3 border-t border-gray-100 inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-[#C56E4F] group-hover:text-[#0F4C3A] transition-colors">
                Xem chi tiết
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </button>
            </div>
          </div>

          <!-- Card 3: Xanh cỏ thơm thanh lịch -->
          <div class="group bg-white rounded-2xl overflow-hidden border border-gray-200/80 hover:shadow-md transition-all duration-300 flex flex-col">
            <div class="aspect-[16/10] overflow-hidden relative bg-sand">
              <img src="./images/base44/8099d7d28_generated_8abc6bed.png" alt="Xanh cỏ thơm thanh lịch" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
            </div>
            <div class="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 class="text-[15px] font-bold text-charcoal">Xanh cỏ thơm thanh lịch</h3>
                <p class="text-[12.5px] text-gray-500 mt-1 leading-relaxed">
                  Tạo cảm giác thoáng đãng lại gần gũi rừng núi.
                </p>
                <!-- 3 Color Chips -->
                <div class="flex gap-1.5 mt-4">
                  <span class="h-6 flex-1 rounded-md border border-black/5" style="background-color: #CFD3BE;" title="#CFD3BE"></span>
                  <span class="h-6 flex-1 rounded-md border border-black/5" style="background-color: #83906F;" title="#83906F"></span>
                  <span class="h-6 flex-1 rounded-md border border-black/5" style="background-color: #EFE6D8;" title="#EFE6D8"></span>
                </div>
              </div>
              <button type="button" onclick="applyPresetPalette(['#CFD3BE', '#83906F', '#EFE6D8'], 'Xanh cỏ thơm thanh lịch')" 
                class="mt-4 pt-3 border-t border-gray-100 inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-[#C56E4F] group-hover:text-[#0F4C3A] transition-colors">
                Xem chi tiết
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </button>
            </div>
          </div>

          <!-- Card 4: Xanh hiện đại cân bằng -->
          <div class="group bg-white rounded-2xl overflow-hidden border border-gray-200/80 hover:shadow-md transition-all duration-300 flex flex-col">
            <div class="aspect-[16/10] overflow-hidden relative bg-sand">
              <img src="./images/base44/7266e0bc1_generated_27f36fa1.png" alt="Xanh hiện đại cân bằng" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
            </div>
            <div class="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 class="text-[15px] font-bold text-charcoal">Xanh hiện đại cân bằng</h3>
                <p class="text-[12.5px] text-gray-500 mt-1 leading-relaxed">
                  Thích hợp cho phòng khách và nhiều phòng cách biệt.
                </p>
                <!-- 3 Color Chips -->
                <div class="flex gap-1.5 mt-4">
                  <span class="h-6 flex-1 rounded-md border border-black/5" style="background-color: #DCE3E4;" title="#DCE3E4"></span>
                  <span class="h-6 flex-1 rounded-md border border-black/5" style="background-color: #8098A1;" title="#8098A1"></span>
                  <span class="h-6 flex-1 rounded-md border border-black/5" style="background-color: #FCFAF6;" title="#FCFAF6"></span>
                </div>
              </div>
              <button type="button" onclick="applyPresetPalette(['#DCE3E4', '#8098A1', '#FCFAF6'], 'Xanh hiện đại cân bằng')" 
                class="mt-4 pt-3 border-t border-gray-100 inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-[#C56E4F] group-hover:text-[#0F4C3A] transition-colors">
                Xem chi tiết
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>

    <!-- Call to action Section (Preserved) -->
    <section class="bg-sand py-16 lg:py-20">
      <div class="mx-auto w-full max-w-[1320px] px-6 md:px-10">
        <div class="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <h2 class="text-[26px] font-semibold leading-[1.14] tracking-[-0.02em] text-charcoal sm:text-[34px]">
              Cần người cùng chọn màu cho công trình?
            </h2>
            <p class="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-ink">
              Mỗi căn phòng có hướng đón sáng và công năng khác nhau. Hãy để đội ngũ tư vấn WANDERS cùng bạn chọn ra bảng màu hoàn hảo.
            </p>
          </div>
          <div class="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <a class="inline-flex items-center justify-center bg-charcoal px-7 py-4 text-[12px] font-medium uppercase tracking-[0.14em] text-bone transition-colors duration-300 hover:bg-terracotta" href="./lien-he.html">
              Đăng ký tư vấn màu
            </a>
            <a class="inline-flex items-center justify-center border border-charcoal px-7 py-4 text-[12px] font-medium uppercase tracking-[0.14em] text-charcoal transition-colors duration-300 hover:bg-charcoal hover:text-bone" href="./san-pham.html">
              Xem sản phẩm sơn
            </a>
          </div>
        </div>
      </div>
    </section>
  </main>
`;

// Script logic is saved in a dedicated companion JS file: assets/wanders_color_studio_v2.js
console.log('Studio V2 HTML template ready. Length:', studioV2Html.length);

