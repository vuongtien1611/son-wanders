const fs = require('fs');
const path = require('path');
const BASE_DIR = path.join(__dirname, '../website_download');
const { renderHead, renderHeader, renderFooter, products, colorPalette, getImg } = require('./base44_common');

function buildHomePage() {
  console.log('Building Homepage with Base44 Design System...');

  // 1. Featured Products for Catalogue Section (curated authentic 8 products from 24)
  const featuredProds = products.slice(0, 8);

  const homeHtml = `<!DOCTYPE html>
<html lang="vi">
<head>
  ${renderHead('WANDERS — Sơn trang trí &amp; Color Studio', 'Sơn trang trí WANDERS cao cấp công nghệ Anh Quốc, cung cấp giải pháp sơn nội thất, ngoại thất, sơn lót kháng kiềm, chống thấm và hệ thống Color Studio chuyên nghiệp.', 0)}
</head>
<body class="bg-[#F8F6F1] text-[#273134]">

  <!-- HEADER -->
  ${renderHeader('home', 0)}

  <main>

    <!-- SECTION 1: HERO BANNER -->
    <section class="relative min-h-[620px] lg:min-h-[710px] w-full overflow-hidden flex items-center bg-[#283235]">
      <!-- Background Image -->
      <div class="absolute inset-0 z-0">
        <img class="w-full h-full object-cover opacity-85" alt="Không gian kiến trúc WANDERS" src="./images/base44/85e7f93c0_generated_2df1c9b3.png">
        <div class="absolute inset-0 bg-gradient-to-r from-[#283235]/90 via-[#283235]/65 to-transparent"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-[#283235]/80 via-transparent to-transparent"></div>
      </div>

      <!-- Hero Content -->
      <div class="base44-container relative z-10 py-20 lg:py-28">
        <div class="max-w-[720px]">
          <p class="mb-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#F8F6F0]/80">
            <span class="h-px w-8 bg-[#D36A44]"></span>
            WANDERS PAINT · DEINE WAND MAL ANDERS
          </p>

          <h1 class="text-white text-[38px] sm:text-[50px] lg:text-[64px] font-semibold leading-[1.08] tracking-[-0.025em]">
            Mỗi bức tường, một dấu ấn riêng.
          </h1>

          <p class="mt-6 max-w-[540px] text-[16px] sm:text-[17px] leading-[1.65] text-[#F8F6F0]/85 font-normal">
            Khám phá những giải pháp sơn và cảm hứng màu sắc giúp biến đổi không gian sống của bạn cùng công nghệ sơn bền vững từ WANDERS.
          </p>

          <div class="mt-9 flex flex-wrap items-center gap-4">
            <a href="./bang-mau.html" class="btn-terracotta">
              <span>KHÁM PHÁ BẢNG MÀU</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
            <a href="./san-pham.html" class="inline-flex items-center gap-2 border border-white/60 hover:border-white bg-white/10 hover:bg-white/20 text-white text-[13px] font-medium uppercase tracking-[0.14em] px-6 py-3.5 backdrop-blur-sm transition-all duration-200">
              <span>XEM SẢN PHẨM</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 2: COLOR EXPLORER -->
    <section class="border-t border-[#E5E3DC] bg-[#F8F6F0] py-20 lg:py-28" id="color-explorer">
      <div class="base44-container">
        
        <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12">
          <div class="max-w-[640px]">
            <p class="mb-4 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-[#68716D]">
              <span class="h-px w-8 bg-[#D36A44]"></span>
              Color Explorer
            </p>
            <h2 class="text-[28px] sm:text-[34px] lg:text-[40px] font-semibold leading-[1.14] tracking-[-0.02em] text-[#283235]">
              Khám phá màu sắc của riêng bạn
            </h2>
          </div>
          <p class="max-w-[400px] text-[15px] leading-[1.7] text-[#68716D]">
            Tìm cảm hứng màu sắc phù hợp với phong cách và không gian sống từ phòng khách, phòng ngủ đến mặt tiền kiến trúc.
          </p>
        </div>

        <div class="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-[1.3fr_1fr] lg:gap-14">
          
          <!-- Left: Big Visual with dynamic swatch & room image -->
          <div>
            <div class="relative overflow-hidden bg-[#EAE3D2] aspect-[4/3] w-full">
              <img id="explorerRoomImg" class="w-full h-full object-cover transition-opacity duration-300" alt="Không gian minh họa màu sắc WANDERS" src="./images/base44/8099d7d28_generated_8abc6bed.png">
              
              <div class="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-[#283235]/90 via-[#283235]/40 to-transparent p-6 pt-20">
                <div>
                  <p id="explorerGroupSubtitle" class="text-[10px] uppercase tracking-[0.24em] text-[#F8F6F0]/70">Warm Neutral — Trung tính ấm</p>
                  <p id="explorerColorName" class="mt-1.5 text-xl font-medium text-white">Cát ấm WANDERS</p>
                </div>
                <div class="flex items-center gap-3 text-white">
                  <span id="explorerColorBox" class="h-9 w-9 border border-white/60 shadow-inner" style="background-color: #DFD0B8;"></span>
                  <span id="explorerColorHex" class="font-mono text-[12px] tracking-wider font-semibold">#DFD0B8</span>
                </div>
              </div>
            </div>
            <p class="mt-4 text-[12.5px] leading-relaxed text-[#68716D]">
              * Bảng màu WANDERS được nghiên cứu tối ưu hóa cho ánh sáng tự nhiên và điều kiện khí hậu nhiệt đới ẩm Việt Nam.
            </p>
          </div>

          <!-- Right: Color Group Selector Accordion / Tabs -->
          <div class="flex flex-col justify-between">
            <div class="border-y border-[#E5E3DC]" id="explorerGroupList">
              
              <!-- Group 01 -->
              <div class="explorer-group-item border-b border-[#E5E3DC] last:border-b-0 py-4 cursor-pointer transition-colors" data-group="0">
                <div class="flex items-center justify-between gap-4">
                  <span class="flex items-baseline gap-3">
                    <span class="font-mono text-[11px] text-[#68716D]/70">01</span>
                    <span class="text-[16px] font-semibold text-[#283235]">Trung tính ấm</span>
                    <span class="hidden sm:inline text-[10px] uppercase tracking-[0.16em] text-[#68716D]">WARM NEUTRAL</span>
                  </span>
                  <div class="flex shrink-0">
                    <span class="h-5 w-4 border border-[#E5E3DC]" style="background-color: #DFD0B8;"></span>
                    <span class="h-5 w-4 border border-[#E5E3DC]" style="background-color: #CDB99C;"></span>
                    <span class="h-5 w-4 border border-[#E5E3DC]" style="background-color: #B5A082;"></span>
                    <span class="h-5 w-4 border border-[#E5E3DC]" style="background-color: #9E896C;"></span>
                  </div>
                </div>
                <div class="group-swatches mt-3 flex gap-2 pt-2">
                  <button class="h-8 w-8 border-2 border-white shadow-sm hover:scale-110 transition-transform" style="background-color: #DFD0B8;" data-hex="#DFD0B8" data-name="Cát ấm" title="#DFD0B8"></button>
                  <button class="h-8 w-8 border-2 border-white shadow-sm hover:scale-110 transition-transform" style="background-color: #CDB99C;" data-hex="#CDB99C" data-name="Lúa mạch nhạt" title="#CDB99C"></button>
                  <button class="h-8 w-8 border-2 border-white shadow-sm hover:scale-110 transition-transform" style="background-color: #B5A082;" data-hex="#B5A082" data-name="Đất nung sáng" title="#B5A082"></button>
                  <button class="h-8 w-8 border-2 border-white shadow-sm hover:scale-110 transition-transform" style="background-color: #9E896C;" data-hex="#9E896C" data-name="Gỗ thông ấm" title="#9E896C"></button>
                </div>
              </div>

              <!-- Group 02 -->
              <div class="explorer-group-item border-b border-[#E5E3DC] last:border-b-0 py-4 cursor-pointer transition-colors" data-group="1">
                <div class="flex items-center justify-between gap-4">
                  <span class="flex items-baseline gap-3">
                    <span class="font-mono text-[11px] text-[#68716D]/70">02</span>
                    <span class="text-[16px] font-semibold text-[#283235]">Tông đất</span>
                    <span class="hidden sm:inline text-[10px] uppercase tracking-[0.16em] text-[#68716D]">EARTH TONE</span>
                  </span>
                  <div class="flex shrink-0">
                    <span class="h-5 w-4 border border-[#E5E3DC]" style="background-color: #D3A27F;"></span>
                    <span class="h-5 w-4 border border-[#E5E3DC]" style="background-color: #BC8563;"></span>
                    <span class="h-5 w-4 border border-[#E5E3DC]" style="background-color: #986446;"></span>
                    <span class="h-5 w-4 border border-[#E5E3DC]" style="background-color: #6F452C;"></span>
                  </div>
                </div>
                <div class="group-swatches mt-3 flex gap-2 pt-2 hidden">
                  <button class="h-8 w-8 border-2 border-white shadow-sm hover:scale-110 transition-transform" style="background-color: #D3A27F;" data-hex="#D3A27F" data-name="Đất sét non" title="#D3A27F"></button>
                  <button class="h-8 w-8 border-2 border-white shadow-sm hover:scale-110 transition-transform" style="background-color: #BC8563;" data-hex="#BC8563" data-name="Đất nung mờ" title="#BC8563"></button>
                  <button class="h-8 w-8 border-2 border-white shadow-sm hover:scale-110 transition-transform" style="background-color: #986446;" data-hex="#986446" data-name="Nâu đất trầm" title="#986446"></button>
                  <button class="h-8 w-8 border-2 border-white shadow-sm hover:scale-110 transition-transform" style="background-color: #6F452C;" data-hex="#6F452C" data-name="Vỏ cây thông" title="#6F452C"></button>
                </div>
              </div>

              <!-- Group 03 -->
              <div class="explorer-group-item border-b border-[#E5E3DC] last:border-b-0 py-4 cursor-pointer transition-colors" data-group="2">
                <div class="flex items-center justify-between gap-4">
                  <span class="flex items-baseline gap-3">
                    <span class="font-mono text-[11px] text-[#68716D]/70">03</span>
                    <span class="text-[16px] font-semibold text-[#283235]">Xanh xô thơm</span>
                    <span class="hidden sm:inline text-[10px] uppercase tracking-[0.16em] text-[#68716D]">SAGE GREEN</span>
                  </span>
                  <div class="flex shrink-0">
                    <span class="h-5 w-4 border border-[#E5E3DC]" style="background-color: #C8D3C5;"></span>
                    <span class="h-5 w-4 border border-[#E5E3DC]" style="background-color: #A3B59E;"></span>
                    <span class="h-5 w-4 border border-[#E5E3DC]" style="background-color: #7E927A;"></span>
                    <span class="h-5 w-4 border border-[#E5E3DC]" style="background-color: #556B52;"></span>
                  </div>
                </div>
                <div class="group-swatches mt-3 flex gap-2 pt-2 hidden">
                  <button class="h-8 w-8 border-2 border-white shadow-sm hover:scale-110 transition-transform" style="background-color: #C8D3C5;" data-hex="#C8D3C5" data-name="Sương sớm vườn" title="#C8D3C5"></button>
                  <button class="h-8 w-8 border-2 border-white shadow-sm hover:scale-110 transition-transform" style="background-color: #A3B59E;" data-hex="#A3B59E" data-name="Xô thơm mộc" title="#A3B59E"></button>
                  <button class="h-8 w-8 border-2 border-white shadow-sm hover:scale-110 transition-transform" style="background-color: #7E927A;" data-hex="#7E927A" data-name="Lá rêu đá" title="#7E927A"></button>
                  <button class="h-8 w-8 border-2 border-white shadow-sm hover:scale-110 transition-transform" style="background-color: #556B52;" data-hex="#556B52" data-name="Rừng thông già" title="#556B52"></button>
                </div>
              </div>

              <!-- Group 04 -->
              <div class="explorer-group-item border-b border-[#E5E3DC] last:border-b-0 py-4 cursor-pointer transition-colors" data-group="3">
                <div class="flex items-center justify-between gap-4">
                  <span class="flex items-baseline gap-3">
                    <span class="font-mono text-[11px] text-[#68716D]/70">04</span>
                    <span class="text-[16px] font-semibold text-[#283235]">Xanh hiện đại</span>
                    <span class="hidden sm:inline text-[10px] uppercase tracking-[0.16em] text-[#68716D]">MODERN BLUE</span>
                  </span>
                  <div class="flex shrink-0">
                    <span class="h-5 w-4 border border-[#E5E3DC]" style="background-color: #C0D2DC;"></span>
                    <span class="h-5 w-4 border border-[#E5E3DC]" style="background-color: #8EADC0;"></span>
                    <span class="h-5 w-4 border border-[#E5E3DC]" style="background-color: #58809A;"></span>
                    <span class="h-5 w-4 border border-[#E5E3DC]" style="background-color: #315873;"></span>
                  </div>
                </div>
                <div class="group-swatches mt-3 flex gap-2 pt-2 hidden">
                  <button class="h-8 w-8 border-2 border-white shadow-sm hover:scale-110 transition-transform" style="background-color: #C0D2DC;" data-hex="#C0D2DC" data-name="Biển sương mai" title="#C0D2DC"></button>
                  <button class="h-8 w-8 border-2 border-white shadow-sm hover:scale-110 transition-transform" style="background-color: #8EADC0;" data-hex="#8EADC0" data-name="Xanh bắc âu" title="#8EADC0"></button>
                  <button class="h-8 w-8 border-2 border-white shadow-sm hover:scale-110 transition-transform" style="background-color: #58809A;" data-hex="#58809A" data-name="Mây trời lộng" title="#58809A"></button>
                  <button class="h-8 w-8 border-2 border-white shadow-sm hover:scale-110 transition-transform" style="background-color: #315873;" data-hex="#315873" data-name="Đại dương sâu" title="#315873"></button>
                </div>
              </div>

              <!-- Group 05 -->
              <div class="explorer-group-item border-b border-[#E5E3DC] last:border-b-0 py-4 cursor-pointer transition-colors" data-group="4">
                <div class="flex items-center justify-between gap-4">
                  <span class="flex items-baseline gap-3">
                    <span class="font-mono text-[11px] text-[#68716D]/70">05</span>
                    <span class="text-[16px] font-semibold text-[#283235]">Trắng mềm</span>
                    <span class="hidden sm:inline text-[10px] uppercase tracking-[0.16em] text-[#68716D]">SOFT WHITE</span>
                  </span>
                  <div class="flex shrink-0">
                    <span class="h-5 w-4 border border-[#E5E3DC]" style="background-color: #F8F6F0;"></span>
                    <span class="h-5 w-4 border border-[#E5E3DC]" style="background-color: #F1ECE1;"></span>
                    <span class="h-5 w-4 border border-[#E5E3DC]" style="background-color: #E6E0D2;"></span>
                    <span class="h-5 w-4 border border-[#E5E3DC]" style="background-color: #D6CFC1;"></span>
                  </div>
                </div>
                <div class="group-swatches mt-3 flex gap-2 pt-2 hidden">
                  <button class="h-8 w-8 border-2 border-white shadow-sm hover:scale-110 transition-transform" style="background-color: #F8F6F0;" data-hex="#F8F6F0" data-name="Trắng ngọc trai" title="#F8F6F0"></button>
                  <button class="h-8 w-8 border-2 border-white shadow-sm hover:scale-110 transition-transform" style="background-color: #F1ECE1;" data-hex="#F1ECE1" data-name="Trắng ngà mờ" title="#F1ECE1"></button>
                  <button class="h-8 w-8 border-2 border-white shadow-sm hover:scale-110 transition-transform" style="background-color: #E6E0D2;" data-hex="#E6E0D2" data-name="Trắng lanh thô" title="#E6E0D2"></button>
                  <button class="h-8 w-8 border-2 border-white shadow-sm hover:scale-110 transition-transform" style="background-color: #D6CFC1;" data-hex="#D6CFC1" data-name="Trắng bột đá" title="#D6CFC1"></button>
                </div>
              </div>

            </div>

            <div class="mt-8 pt-6">
              <a href="./bang-mau.html" class="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.16em] text-[#D36A44] hover:text-[#B35532] transition-colors">
                <span>MỞ COLOR STUDIO ĐẦY ĐỦ</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>

    <!-- SECTION 3: PAINT COLLECTIONS (6 CATEGORIES ASYMMETRIC GRID 7+5 & 3+3+3+3) -->
    <section class="bg-[#F8F6F0] py-20 lg:py-28" id="paint-collections">
      <div class="base44-container">
        
        <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12">
          <div class="max-w-[640px]">
            <p class="mb-4 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-[#68716D]">
              <span class="h-px w-8 bg-[#D36A44]"></span>
              Paint Collections
            </p>
            <h2 class="text-[28px] sm:text-[34px] lg:text-[40px] font-semibold leading-[1.14] tracking-[-0.02em] text-[#283235]">
              Giải pháp sơn cho mọi không gian
            </h2>
          </div>
          <p class="max-w-[400px] text-[15px] leading-[1.7] text-[#68716D]">
            Sáu nhóm sản phẩm được tổ chức theo bề mặt và điều kiện sử dụng — từ lớp lót kháng kiềm đến lớp phủ hoàn thiện bảo vệ dài lâu.
          </p>
        </div>

        <div class="mt-12 grid gap-5 lg:mt-16 lg:grid-cols-12">
          
          <!-- 1. Sơn nội thất (col-span-7) -->
          <a class="group relative block overflow-hidden bg-[#EAE3D2] lg:col-span-7 text-decoration-none aspect-[4/3]" href="./san-pham.html?nhom=noi-that">
            <img class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" alt="Sơn nội thất WANDERS" src="./images/base44/7f7b7d76e_generated_2a17cf56.png">
            <div class="absolute inset-0 bg-gradient-to-t from-[#283235]/90 via-[#283235]/30 to-transparent p-6 sm:p-8 flex flex-col justify-end">
              <p class="text-[10px] uppercase tracking-[0.24em] text-[#F8F6F0]/70 font-semibold">INTERIOR FINISH</p>
              <div class="mt-2 flex items-end justify-between gap-4">
                <div>
                  <h3 class="text-2xl sm:text-3xl font-semibold text-white">Sơn nội thất</h3>
                  <p class="mt-2 max-w-[42ch] text-[13.5px] text-[#F8F6F0]/80">Mịn bóng sang trọng, kháng khuẩn, lau chùi vượt trội và bền màu dài lâu cho tổ ấm.</p>
                </div>
                <span class="flex h-10 w-10 shrink-0 items-center justify-center border border-white/40 text-white group-hover:border-[#D36A44] group-hover:bg-[#D36A44] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>
                </span>
              </div>
            </div>
          </a>

          <!-- 2. Sơn ngoại thất (col-span-5) -->
          <a class="group relative block overflow-hidden bg-[#EAE3D2] lg:col-span-5 text-decoration-none aspect-[4/3]" href="./san-pham.html?nhom=ngoai-that">
            <img class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" alt="Sơn ngoại thất WANDERS" src="./images/base44/85e7f93c0_generated_2df1c9b3.png">
            <div class="absolute inset-0 bg-gradient-to-t from-[#283235]/90 via-[#283235]/30 to-transparent p-6 sm:p-8 flex flex-col justify-end">
              <p class="text-[10px] uppercase tracking-[0.24em] text-[#F8F6F0]/70 font-semibold">EXTERIOR PROTECTION</p>
              <div class="mt-2 flex items-end justify-between gap-4">
                <div>
                  <h3 class="text-2xl sm:text-3xl font-semibold text-white">Sơn ngoại thất</h3>
                  <p class="mt-2 max-w-[36ch] text-[13.5px] text-[#F8F6F0]/80">Chống tia UV, kháng kiềm muối hóa và chịu đựng điều kiện thời tiết nhiệt đới khắc nghiệt.</p>
                </div>
                <span class="flex h-10 w-10 shrink-0 items-center justify-center border border-white/40 text-white group-hover:border-[#D36A44] group-hover:bg-[#D36A44] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>
                </span>
              </div>
            </div>
          </a>

          <!-- 3. Sơn chống thấm (col-span-3) -->
          <a class="group relative block overflow-hidden bg-[#EAE3D2] lg:col-span-3 text-decoration-none aspect-[4/3] sm:aspect-auto sm:h-[290px]" href="./san-pham.html?nhom=chong-tham">
            <img class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" alt="Sơn chống thấm WANDERS" src="./images/base44/5d10e1c6d_generated_213965c5.png">
            <div class="absolute inset-0 bg-gradient-to-t from-[#283235]/90 via-[#283235]/25 to-transparent p-5 flex flex-col justify-end">
              <h3 class="text-lg font-semibold text-white">Sơn chống thấm</h3>
              <p class="mt-1 text-[12px] text-[#F8F6F0]/80">Bảo vệ cấu trúc tường và sàn khỏi xâm thực ẩm.</p>
              <div class="mt-3 flex justify-end">
                <span class="flex h-8 w-8 items-center justify-center border border-white/40 text-white group-hover:border-[#D36A44] group-hover:bg-[#D36A44] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>
                </span>
              </div>
            </div>
          </a>

          <!-- 4. Sơn lót (col-span-3) -->
          <a class="group relative block overflow-hidden bg-[#EAE3D2] lg:col-span-3 text-decoration-none aspect-[4/3] sm:aspect-auto sm:h-[290px]" href="./san-pham.html?nhom=son-lot">
            <img class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" alt="Sơn lót WANDERS" src="./images/base44/7f6a476c9_generated_9cbd24f3.png">
            <div class="absolute inset-0 bg-gradient-to-t from-[#283235]/90 via-[#283235]/25 to-transparent p-5 flex flex-col justify-end">
              <h3 class="text-lg font-semibold text-white">Sơn lót kháng kiềm</h3>
              <p class="mt-1 text-[12px] text-[#F8F6F0]/80">Tăng bám dính, chống loang màu tối đa.</p>
              <div class="mt-3 flex justify-end">
                <span class="flex h-8 w-8 items-center justify-center border border-white/40 text-white group-hover:border-[#D36A44] group-hover:bg-[#D36A44] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>
                </span>
              </div>
            </div>
          </a>

          <!-- 5. Sơn chống nóng (col-span-3) -->
          <a class="group relative block overflow-hidden bg-[#EAE3D2] lg:col-span-3 text-decoration-none aspect-[4/3] sm:aspect-auto sm:h-[290px]" href="./san-pham.html?nhom=chong-nong">
            <img class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" alt="Sơn chống nóng WANDERS" src="./images/base44/11ef022d2_generated_ea4a85fa.png">
            <div class="absolute inset-0 bg-gradient-to-t from-[#283235]/90 via-[#283235]/25 to-transparent p-5 flex flex-col justify-end">
              <h3 class="text-lg font-semibold text-white">Sơn chống nóng</h3>
              <p class="mt-1 text-[12px] text-[#F8F6F0]/80">Hạ nhiệt độ bề mặt mái và tường đến 12-25°C.</p>
              <div class="mt-3 flex justify-end">
                <span class="flex h-8 w-8 items-center justify-center border border-white/40 text-white group-hover:border-[#D36A44] group-hover:bg-[#D36A44] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>
                </span>
              </div>
            </div>
          </a>

          <!-- 6. Sản phẩm khác (col-span-3) -->
          <a class="group relative block overflow-hidden bg-[#EAE3D2] lg:col-span-3 text-decoration-none aspect-[4/3] sm:aspect-auto sm:h-[290px]" href="./san-pham.html?nhom=khac">
            <img class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" alt="Sản phẩm khác WANDERS" src="./images/base44/f8b86d905_generated_509a0b06.png">
            <div class="absolute inset-0 bg-gradient-to-t from-[#283235]/90 via-[#283235]/25 to-transparent p-5 flex flex-col justify-end">
              <h3 class="text-lg font-semibold text-white">Sản phẩm khác</h3>
              <p class="mt-1 text-[12px] text-[#F8F6F0]/80">Bột bả, mastic dẻo và phụ gia hoàn thiện.</p>
              <div class="mt-3 flex justify-end">
                <span class="flex h-8 w-8 items-center justify-center border border-white/40 text-white group-hover:border-[#D36A44] group-hover:bg-[#D36A44] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>
                </span>
              </div>
            </div>
          </a>

        </div>

      </div>
    </section>

    <!-- SECTION 4: CATALOGUE (AUTHENTIC 24 WANDERS PRODUCTS FROM EXCEL) -->
    <section class="border-t border-[#E5E3DC] bg-[#F3EEDB] py-20 lg:py-28" id="catalogue">
      <div class="base44-container">
        
        <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12">
          <div class="max-w-[640px]">
            <p class="mb-4 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-[#68716D]">
              <span class="h-px w-8 bg-[#D36A44]"></span>
              Catalogue
            </p>
            <h2 class="text-[28px] sm:text-[34px] lg:text-[40px] font-semibold leading-[1.14] tracking-[-0.02em] text-[#283235]">
              Sản phẩm WANDERS nổi bật
            </h2>
          </div>
          <p class="max-w-[400px] text-[15px] leading-[1.7] text-[#68716D]">
            Danh mục sản phẩm chính thức từ tài liệu kỹ thuật WANDERS với thông số thực nghiệm, độ phủ và chứng nhận tiêu chuẩn.
          </p>
        </div>

        <!-- Filter tabs -->
        <div class="mt-10 flex flex-wrap items-center gap-2 border-b border-[#E5E3DC] pb-3" id="catalogueTabs">
          <button class="cat-tab px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#283235] border-b-2 border-[#D36A44]" data-cat="all">Tất cả</button>
          <button class="cat-tab px-4 py-2.5 text-[12px] font-medium uppercase tracking-[0.14em] text-[#68716D] hover:text-[#283235]" data-cat="son-noi-that">Sơn nội thất</button>
          <button class="cat-tab px-4 py-2.5 text-[12px] font-medium uppercase tracking-[0.14em] text-[#68716D] hover:text-[#283235]" data-cat="son-ngoai-that">Sơn ngoại thất</button>
          <button class="cat-tab px-4 py-2.5 text-[12px] font-medium uppercase tracking-[0.14em] text-[#68716D] hover:text-[#283235]" data-cat="chong-tham">Sơn chống thấm</button>
          <button class="cat-tab px-4 py-2.5 text-[12px] font-medium uppercase tracking-[0.14em] text-[#68716D] hover:text-[#283235]" data-cat="son-lot">Sơn lót</button>
        </div>

        <!-- Product Grid (8 authentic cards) -->
        <div class="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4" id="catalogueGrid">
          ${featuredProds.map(prod => `
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
              <h3 class="mt-4 text-[16px] font-semibold leading-snug text-[#283235] group-hover:text-[#D36A44] transition-colors">
                ${prod.name}
              </h3>
              <p class="mt-1.5 text-[13px] leading-relaxed text-[#68716D] line-clamp-2">
                ${prod.desc ? prod.desc.substring(0, 85) + '...' : 'Sơn công nghệ Anh Quốc cao cấp, bảo vệ tối ưu.'}
              </p>
              <span class="mt-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#D36A44]">
                <span>XEM CHI TIẾT</span>
                <span>→</span>
              </span>
            </a>
          `).join('')}
        </div>

        <div class="mt-12 text-center">
          <a href="./san-pham.html" class="btn-outline-charcoal">
            <span>XEM TOÀN BỘ 24 SẢN PHẨM WANDERS</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
        </div>

      </div>
    </section>

    <!-- SECTION 5: LIVING WITH COLOUR -->
    <section class="bg-[#F8F6F0] py-20 lg:py-28" id="living-with-colour">
      <div class="base44-container">
        
        <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12">
          <div class="max-w-[640px]">
            <p class="mb-4 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-[#68716D]">
              <span class="h-px w-8 bg-[#D36A44]"></span>
              Living with colour
            </p>
            <h2 class="text-[28px] sm:text-[34px] lg:text-[40px] font-semibold leading-[1.14] tracking-[-0.02em] text-[#283235]">
              Màu sắc thay đổi không gian sống
            </h2>
          </div>
          <p class="max-w-[400px] text-[15px] leading-[1.7] text-[#68716D]">
            Bốn hướng phối màu cho bốn cách sống khác nhau — chọn một phong cách để xem bảng màu gợi ý.
          </p>
        </div>

        <div class="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
          
          <!-- Left: Big lifestyle room visual -->
          <div class="relative overflow-hidden bg-[#EAE3D2] aspect-[4/3] lg:aspect-[3/2] w-full">
            <img id="livingRoomImg" class="w-full h-full object-cover transition-opacity duration-300" alt="Phong cách sống WANDERS" src="./images/base44/edf841af7_generated_77536f0e.png">
            <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#283235]/85 to-transparent p-6 sm:p-8">
              <p id="livingSubtitle" class="text-[10px] uppercase tracking-[0.24em] text-[#F8F6F0]/70 font-semibold">MODERN MINIMAL</p>
              <p id="livingTitle" class="mt-2 text-xl sm:text-2xl font-medium text-white">Tối giản hiện đại</p>
            </div>
          </div>

          <!-- Right: 4 Style Tabs and Recommendations -->
          <div class="flex flex-col justify-between">
            <div>
              <div class="flex flex-wrap gap-2.5" id="livingStyleTabs">
                <button class="living-tab border px-4 py-2.5 text-[12px] font-medium uppercase tracking-[0.12em] transition-colors border-[#283235] bg-[#283235] text-[#F8F6F0]" data-idx="0">Tối giản hiện đại</button>
                <button class="living-tab border px-4 py-2.5 text-[12px] font-medium uppercase tracking-[0.12em] transition-colors border-[#E5E3DC] text-[#68716D] hover:border-[#283235] hover:text-[#283235]" data-idx="1">Sống ấm</button>
                <button class="living-tab border px-4 py-2.5 text-[12px] font-medium uppercase tracking-[0.12em] transition-colors border-[#E5E3DC] text-[#68716D] hover:border-[#283235] hover:text-[#283235]" data-idx="2">Cảm hứng thiên nhiên</button>
                <button class="living-tab border px-4 py-2.5 text-[12px] font-medium uppercase tracking-[0.12em] transition-colors border-[#E5E3DC] text-[#68716D] hover:border-[#283235] hover:text-[#283235]" data-idx="3">Sang trọng đương đại</button>
              </div>

              <div class="mt-8">
                <h4 id="livingDescTitle" class="text-lg font-semibold text-[#283235]">Đường nét gọn, sắc thái dịu nhẹ</h4>
                <p id="livingDescText" class="mt-3 text-[14.5px] leading-relaxed text-[#68716D]">
                  Không gian tập trung vào ánh sáng tự nhiên, bề mặt tường mờ mịn và những gam màu trung tính nhẹ nhàng giúp tâm trí thư thái sau ngày dài.
                </p>

                <!-- Color chips recommendation -->
                <div class="mt-6 border-t border-[#E5E3DC] pt-6">
                  <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#68716D]">Gợi ý 3 màu phối chuẩn</p>
                  <div class="mt-4 grid grid-cols-3 gap-3" id="livingSwatches">
                    <div class="flex flex-col">
                      <span class="h-12 w-full border border-[#E5E3DC]" style="background-color: #DFD0B8;"></span>
                      <span class="mt-2 text-[11px] font-medium text-[#283235]">Trắng cát</span>
                      <span class="font-mono text-[10px] text-[#68716D]">#DFD0B8</span>
                    </div>
                    <div class="flex flex-col">
                      <span class="h-12 w-full border border-[#E5E3DC]" style="background-color: #8A9A86;"></span>
                      <span class="mt-2 text-[11px] font-medium text-[#283235]">Xô thơm</span>
                      <span class="font-mono text-[10px] text-[#68716D]">#8A9A86</span>
                    </div>
                    <div class="flex flex-col">
                      <span class="h-12 w-full border border-[#E5E3DC]" style="background-color: #B5A082;"></span>
                      <span class="mt-2 text-[11px] font-medium text-[#283235]">Đất ấm</span>
                      <span class="font-mono text-[10px] text-[#68716D]">#B5A082</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-8 pt-4">
              <a href="./bang-mau.html" class="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.16em] text-[#D36A44] hover:text-[#B35532] transition-colors">
                <span>TẠO BẢNG PHỐI RIÊNG TRÊN COLOR STUDIO</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>

    <!-- SECTION 6: PROJECT JOURNAL -->
    <section class="border-t border-[#E5E3DC] bg-[#F8F6F0] py-20 lg:py-28" id="projects">
      <div class="base44-container">
        
        <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12">
          <div class="max-w-[640px]">
            <p class="mb-4 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-[#68716D]">
              <span class="h-px w-8 bg-[#D36A44]"></span>
              Project Journal
            </p>
            <h2 class="text-[28px] sm:text-[34px] lg:text-[40px] font-semibold leading-[1.14] tracking-[-0.02em] text-[#283235]">
              Không gian &amp; Công trình WANDERS
            </h2>
          </div>
          <p class="max-w-[400px] text-[15px] leading-[1.7] text-[#68716D]">
            Ghi chép về vật liệu, ánh sáng và cách một bảng màu WANDERS đi vào đời sống của công trình thực tế.
          </p>
        </div>

        <div class="mt-12 grid gap-5 lg:mt-16 lg:grid-cols-12">
          
          <!-- Project 1 (col-span-7) -->
          <a class="group relative block overflow-hidden bg-[#EAE3D2] lg:col-span-7 text-decoration-none aspect-[4/3]" href="./du-an.html">
            <img class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" alt="Biệt thự mái bằng WANDERS" src="./images/base44/0cff00e0d_generated_6094395e.png">
            <span class="absolute left-4 top-4 border border-white/30 bg-[#283235]/50 px-2.5 py-1 text-[9px] uppercase tracking-[0.16em] text-white backdrop-blur-sm">Hình ảnh công trình</span>
            <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#283235]/90 via-[#283235]/25 to-transparent p-6 sm:p-8">
              <p class="text-[10px] uppercase tracking-[0.22em] text-[#F8F6F0]/70 font-semibold">NHÀ Ở CAO CẤP</p>
              <div class="mt-2 flex items-end justify-between gap-4">
                <div>
                  <h3 class="text-2xl sm:text-3xl font-semibold text-white">Biệt thự mái bằng</h3>
                  <p class="mt-2 max-w-[40ch] text-[13.5px] text-[#F8F6F0]/80">Mặt tiền trắng ngà kết hợp khối ốp đất nung mộc, sân vườn nhiệt đới hiện đại.</p>
                </div>
                <span class="flex h-10 w-10 shrink-0 items-center justify-center border border-white/40 text-white group-hover:border-[#D36A44] group-hover:bg-[#D36A44] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>
                </span>
              </div>
            </div>
          </a>

          <!-- Project 2 (col-span-5) -->
          <a class="group relative block overflow-hidden bg-[#EAE3D2] lg:col-span-5 text-decoration-none aspect-[4/3]" href="./du-an.html">
            <img class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" alt="Căn hộ trung tâm WANDERS" src="./images/base44/08867f386_generated_9bb6eef6.png">
            <span class="absolute left-4 top-4 border border-white/30 bg-[#283235]/50 px-2.5 py-1 text-[9px] uppercase tracking-[0.16em] text-white backdrop-blur-sm">Hình ảnh công trình</span>
            <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#283235]/90 via-[#283235]/25 to-transparent p-6 sm:p-8">
              <p class="text-[10px] uppercase tracking-[0.22em] text-[#F8F6F0]/70 font-semibold">CĂN HỘ CAO CẤP</p>
              <div class="mt-2 flex items-end justify-between gap-4">
                <div>
                  <h3 class="text-2xl sm:text-3xl font-semibold text-white">Căn hộ trung tâm</h3>
                  <p class="mt-2 max-w-[36ch] text-[13.5px] text-[#F8F6F0]/80">Bảng màu ấm với tường phòng khách trung tính, nhấn gỗ óc chó.</p>
                </div>
                <span class="flex h-10 w-10 shrink-0 items-center justify-center border border-white/40 text-white group-hover:border-[#D36A44] group-hover:bg-[#D36A44] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>
                </span>
              </div>
            </div>
          </a>

          <!-- Project 3 (col-span-4) -->
          <a class="group relative block overflow-hidden bg-[#EAE3D2] lg:col-span-4 text-decoration-none aspect-[4/3] sm:aspect-auto sm:h-[300px]" href="./du-an.html">
            <img class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" alt="Quán cà phê studio" src="./images/base44/7266e0bc1_generated_27f36fa1.png">
            <div class="absolute inset-0 bg-gradient-to-t from-[#283235]/90 via-[#283235]/25 to-transparent p-5 flex flex-col justify-end">
              <p class="text-[10px] uppercase tracking-[0.2em] text-[#F8F6F0]/70 font-semibold">THƯƠNG MẠI</p>
              <h3 class="mt-1 text-xl font-semibold text-white">Quán cà phê studio</h3>
              <p class="mt-1 text-[12.5px] text-[#F8F6F0]/80">Hiệu ứng tường vôi mờ, hòa quyện ánh sáng vàng.</p>
            </div>
          </a>

          <!-- Project 4 (col-span-4) -->
          <a class="group relative block overflow-hidden bg-[#EAE3D2] lg:col-span-4 text-decoration-none aspect-[4/3] sm:aspect-auto sm:h-[300px]" href="./du-an.html">
            <img class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" alt="Sảnh làm việc sáng tạo" src="./images/base44/699adaa7a_generated_49cef920.png">
            <div class="absolute inset-0 bg-gradient-to-t from-[#283235]/90 via-[#283235]/25 to-transparent p-5 flex flex-col justify-end">
              <p class="text-[10px] uppercase tracking-[0.2em] text-[#F8F6F0]/70 font-semibold">VĂN PHÒNG</p>
              <h3 class="mt-1 text-xl font-semibold text-white">Sảnh làm việc</h3>
              <p class="mt-1 text-[12.5px] text-[#F8F6F0]/80">Tông xanh xô thơm thanh lịch, tạo cảm hứng tập trung.</p>
            </div>
          </a>

          <!-- Project 5 (col-span-4) -->
          <a class="group relative block overflow-hidden bg-[#EAE3D2] lg:col-span-4 text-decoration-none aspect-[4/3] sm:aspect-auto sm:h-[300px]" href="./du-an.html">
            <img class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" alt="Nhà vườn một tầng" src="./images/base44/d46ca89f2_generated_e7f1be47.png">
            <div class="absolute inset-0 bg-gradient-to-t from-[#283235]/90 via-[#283235]/25 to-transparent p-5 flex flex-col justify-end">
              <p class="text-[10px] uppercase tracking-[0.2em] text-[#F8F6F0]/70 font-semibold">NHÀ NGHỈ DƯỠNG</p>
              <h3 class="mt-1 text-xl font-semibold text-white">Nhà vườn một tầng</h3>
              <p class="mt-1 text-[12.5px] text-[#F8F6F0]/80">Trắng mềm hòa quyện thảm cỏ và nắng sớm tự nhiên.</p>
            </div>
          </a>

        </div>

        <div class="mt-12 text-center">
          <a href="./du-an.html" class="btn-outline-charcoal">
            <span>TẤT CẢ DỰ ÁN &amp; CÔNG TRÌNH</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
        </div>

      </div>
    </section>

    <!-- SECTION 7: WHY WANDERS -->
    <section class="bg-[#F8F6F0] py-20 lg:py-28" id="why-wanders">
      <div class="base44-container">
        <div class="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
          
          <div class="relative overflow-hidden bg-[#EAE3D2] aspect-[4/5] w-full">
            <img class="w-full h-full object-cover" alt="Quy trình chất lượng WANDERS" src="./images/base44/b61550fbc_generated_9d16c57c.png">
            <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#283235]/85 to-transparent p-6 sm:p-8">
              <p class="text-[10px] uppercase tracking-[0.24em] text-[#F8F6F0]/70 font-semibold">TIÊU CHUẨN KỸ THUẬT</p>
              <p class="mt-1.5 text-xl font-medium text-white">Chính xác trong từng gam màu</p>
            </div>
          </div>

          <div>
            <p class="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#68716D]">
              <span class="h-px w-8 bg-[#D36A44]"></span>
              Why Wanders
            </p>
            <h2 class="mt-4 text-[28px] sm:text-[34px] lg:text-[40px] font-semibold leading-[1.14] tracking-[-0.02em] text-[#283235]">
              Giá trị tạo nên WANDERS
            </h2>
            <p class="mt-5 text-[15.5px] leading-[1.75] text-[#68716D]">
              Một thương hiệu sơn được xây từ ba việc cốt lõi: chọn đúng màu, đúng lớp bảo vệ và luôn đồng hành cùng các kiến trúc sư, chủ nhà trong suốt quá trình xây dựng.
            </p>

            <div class="mt-8 space-y-6">
              
              <div class="border-l-2 border-[#D36A44] pl-5">
                <h3 class="text-base font-semibold text-[#283235]">1. Chọn đúng màu</h3>
                <p class="mt-1.5 text-[14px] leading-relaxed text-[#68716D]">Bảng màu WANDERS được chắt lọc để lên tường không bị chói gắt, luôn giữ được vẻ đẹp sâu lắng dưới nhiều nguồn sáng.</p>
              </div>

              <div class="border-l-2 border-[#283235] pl-5">
                <h3 class="text-base font-semibold text-[#283235]">2. Đúng lớp bảo vệ</h3>
                <p class="mt-1.5 text-[14px] leading-relaxed text-[#68716D]">Hệ thống từ sơn lót kháng kiềm, chống thấm chuyên dụng đến sơn phủ nội ngoại thất được liên kết hóa học bền vững.</p>
              </div>

              <div class="border-l-2 border-[#283235]/40 pl-5">
                <h3 class="text-base font-semibold text-[#283235]">3. Đồng hành lâu dài</h3>
                <p class="mt-1.5 text-[14px] leading-relaxed text-[#68716D]">Đội ngũ kỹ thuật hỗ trợ khảo sát mặt bằng, tư vấn phối màu và quy trình thi công chuẩn cho từng công trình.</p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- SECTION 8: ABOUT WANDERS (CHARCOAL DARK SECTION) -->
    <section class="bg-[#283235] text-[#F8F6F0] py-20 lg:py-24" id="about">
      <div class="base44-container">
        <div class="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16">
          
          <div class="order-2 lg:order-1">
            <p class="flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-[#F8F6F0]/60 font-semibold">
              <span class="h-px w-8 bg-[#D36A44]"></span>
              About Wanders
            </p>
            <h2 class="mt-4 text-[28px] sm:text-[34px] lg:text-[40px] font-semibold leading-[1.14] tracking-[-0.02em] text-white">
              Khám phá WANDERS
            </h2>
            <p class="mt-6 text-[15px] sm:text-[16px] leading-[1.8] text-[#F8F6F0]/75">
              WANDERS bắt đầu từ một ý niệm đơn giản: màu sơn không phải lớp phủ cuối cùng của công trình, mà là vật liệu định hình cảm giác sống bên trong nó. Chúng tôi xây dựng danh mục sản phẩm theo bề mặt và điều kiện khí hậu thực tế tại Việt Nam — từ ẩm ướt, nồm gió mùa đến nắng gắt miền biển.
            </p>
            <p class="mt-4 text-[15px] sm:text-[16px] leading-[1.8] text-[#F8F6F0]/75">
              Mỗi màu trong hệ thống Color Studio được lựa chọn để khi lên tường không chỉ đẹp mắt, mà còn tạo cảm giác thư thái, tự nhiên cho gia chủ.
            </p>

            <div class="mt-8 flex flex-wrap gap-4">
              <a href="./gioi-thieu.html" class="inline-flex items-center gap-2 border border-white/50 hover:border-white bg-white/10 hover:bg-white/20 text-white text-[12px] font-semibold uppercase tracking-[0.16em] px-6 py-3.5 transition-all">
                <span>TÌM HIỂU THÊM VỀ WANDERS</span>
                <span>→</span>
              </a>
            </div>
          </div>

          <div class="order-1 lg:order-2">
            <div class="relative overflow-hidden bg-[#384346] aspect-[4/3] w-full">
              <img class="w-full h-full object-cover" alt="Xưởng pha màu và phòng lab WANDERS" src="./images/base44/3c75327b9_generated_679d52e2.png">
              <span class="absolute right-4 bottom-4 border border-white/30 bg-[#283235]/60 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-white backdrop-blur-sm">Phòng Lab &amp; Nghiên cứu màu sắc</span>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- SECTION 9: TRUST & MEDIA (PARTNERS & CERTIFICATIONS) -->
    <section class="border-t border-[#E5E3DC] bg-[#F3EEDB] py-20 lg:py-24" id="trust">
      <div class="base44-container">
        
        <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12">
          <div class="max-w-[640px]">
            <p class="mb-4 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-[#68716D]">
              <span class="h-px w-8 bg-[#D36A44]"></span>
              Trust &amp; Media
            </p>
            <h2 class="text-[28px] sm:text-[34px] lg:text-[40px] font-semibold leading-[1.14] tracking-[-0.02em] text-[#283235]">
              Đối tác, chứng nhận và truyền thông
            </h2>
          </div>
          <p class="max-w-[400px] text-[15px] leading-[1.7] text-[#68716D]">
            Các thông tin kỹ thuật, năng lực sản xuất và chứng nhận hợp chuẩn quốc gia được WANDERS kiểm định nghiêm ngặt.
          </p>
        </div>

        <div class="mt-12 grid gap-10 border-t border-[#E5E3DC] pt-10 lg:grid-cols-3 lg:gap-12">
          
          <div>
            <h3 class="text-lg font-semibold text-[#283235]">Đối tác nguyên liệu hàng đầu</h3>
            <p class="mt-3 text-[14px] leading-relaxed text-[#68716D]">
              Ứng dụng các dòng nhựa Acrylic copolymer, phụ gia chống rêu mốc và bột màu vô cơ nhập khẩu từ các tập đoàn hóa chất quốc tế uy tín (Dow, BASF, Tronox, Degussa).
            </p>
            <div class="mt-6 flex flex-wrap gap-2 text-[12px] font-mono text-[#283235]/80">
              <span class="bg-[#F8F6F0] px-3 py-1.5 border border-[#E5E3DC]">DOW CHEMICAL</span>
              <span class="bg-[#F8F6F0] px-3 py-1.5 border border-[#E5E3DC]">TRONOX</span>
              <span class="bg-[#F8F6F0] px-3 py-1.5 border border-[#E5E3DC]">DEGUSSA</span>
              <span class="bg-[#F8F6F0] px-3 py-1.5 border border-[#E5E3DC]">ROHM HAAS</span>
            </div>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-[#283235]">Chứng nhận &amp; Tiêu chuẩn</h3>
            <p class="mt-3 text-[14px] leading-relaxed text-[#68716D]">
              Toàn bộ sản phẩm WANDERS được kiểm định và sản xuất tuân thủ hệ thống quản lý chất lượng quốc tế và quy chuẩn kỹ thuật xây dựng Việt Nam.
            </p>
            <div class="mt-6 flex flex-col gap-2.5 text-[13px] text-[#283235]">
              <div class="flex items-center gap-2">
                <span class="h-2 w-2 rounded-full bg-[#D36A44]"></span>
                <span class="font-medium">Hệ thống quản lý chất lượng ISO 9001:2015</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="h-2 w-2 rounded-full bg-[#D36A44]"></span>
                <span class="font-medium">Quy chuẩn kỹ thuật quốc gia QCVN 16:2014/BXD</span>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-[#283235]">Nhà máy &amp; Công nghệ</h3>
            <p class="mt-3 text-[14px] leading-relaxed text-[#68716D]">
              Dây chuyền sản xuất tự động hóa khép kín tại KCN Ngọc Hồi, Thanh Trì, Hà Nội, đảm bảo công suất ổn định và chất lượng đồng đều cho hàng triệu mét vuông tường mỗi năm.
            </p>
            <div class="mt-6">
              <a href="./gioi-thieu.html" class="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#D36A44]">
                <span>XEM CHI TIẾT NĂNG LỰC SẢN XUẤT</span>
                <span>→</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>

    <!-- SECTION 10: JOURNAL (ARTICLES) -->
    <section class="bg-[#F8F6F0] py-20 lg:py-28" id="journal">
      <div class="base44-container">
        
        <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12">
          <div class="max-w-[640px]">
            <p class="mb-4 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-[#68716D]">
              <span class="h-px w-8 bg-[#D36A44]"></span>
              Journal
            </p>
            <h2 class="text-[28px] sm:text-[34px] lg:text-[40px] font-semibold leading-[1.14] tracking-[-0.02em] text-[#283235]">
              Cẩm nang màu sắc &amp; Sơn nhà
            </h2>
          </div>
          <p class="max-w-[400px] text-[15px] leading-[1.7] text-[#68716D]">
            Kinh nghiệm chọn sơn, phối màu và bảo vệ công trình — ghi lại từ quá trình làm việc thực tế cùng các chuyên gia.
          </p>
        </div>

        <div class="mt-12 grid gap-x-8 gap-y-12 md:grid-cols-3">
          
          <article class="group">
            <div class="relative overflow-hidden bg-[#EAE3D2] aspect-[16/10] w-full">
              <img class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Kinh nghiệm chọn sơn ngoại thất" src="./images/base44/f87fca256_generated_6e727af7.png">
            </div>
            <p class="mt-4 text-[11px] font-medium uppercase tracking-[0.16em] text-[#D36A44]">KINH NGHIỆM THI CÔNG</p>
            <h3 class="mt-2 text-lg font-semibold text-[#283235] group-hover:text-[#D36A44] transition-colors">
              Quy trình chuẩn bị bề mặt tường trước khi sơn phủ
            </h3>
            <p class="mt-2 text-[13.5px] leading-relaxed text-[#68716D]">
              Vì sao độ ẩm tường dưới 16% và lớp lót kháng kiềm là hai yếu tố quyết định 80% độ bền của màng sơn.
            </p>
          </article>

          <article class="group">
            <div class="relative overflow-hidden bg-[#EAE3D2] aspect-[16/10] w-full">
              <img class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Nghệ thuật phối màu trung tính" src="./images/base44/3c75327b9_generated_679d52e2.png">
            </div>
            <p class="mt-4 text-[11px] font-medium uppercase tracking-[0.16em] text-[#D36A44]">TƯ VẤN MÀU SẮC</p>
            <h3 class="mt-2 text-lg font-semibold text-[#283235] group-hover:text-[#D36A44] transition-colors">
              Nghệ thuật phối màu trung tính ấm cho phòng khách
            </h3>
            <p class="mt-2 text-[13.5px] leading-relaxed text-[#68716D]">
              Cách kết hợp 3 sắc độ cát ấm, xô thơm và trắng ngà để không gian sống luôn thoáng đãng và sang trọng.
            </p>
          </article>

          <article class="group">
            <div class="relative overflow-hidden bg-[#EAE3D2] aspect-[16/10] w-full">
              <img class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Chống thấm tường mùa mưa" src="./images/base44/85e7f93c0_generated_2df1c9b3.png">
            </div>
            <p class="mt-4 text-[11px] font-medium uppercase tracking-[0.16em] text-[#D36A44]">BẢO VỆ CÔNG TRÌNH</p>
            <h3 class="mt-2 text-lg font-semibold text-[#283235] group-hover:text-[#D36A44] transition-colors">
              Giải pháp chống thấm đa năng cho tường giáp ranh
            </h3>
            <p class="mt-2 text-[13.5px] leading-relaxed text-[#68716D]">
              Ứng dụng công nghệ màng thở đàn hồi cao, ngăn ngừa triệt để hiện tượng ẩm mốc và bong tróc vào mùa nồm ẩm.
            </p>
          </article>

        </div>

      </div>
    </section>

    <!-- SECTION 11: CTA (TƯ VẤN) -->
    <section class="bg-[#EAE3D2] py-16 lg:py-24" id="cta">
      <div class="base44-container">
        <div class="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:gap-16">
          <div>
            <p class="flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-[#283235]/60 font-semibold">
              <span class="h-px w-8 bg-[#D36A44]"></span>
              Tư vấn trực tiếp
            </p>
            <h2 class="mt-4 text-[28px] sm:text-[34px] lg:text-[42px] font-semibold leading-[1.14] tracking-[-0.02em] text-[#283235]">
              Bạn đang tìm màu sơn phù hợp cho công trình?
            </h2>
            <p class="mt-4 text-[15.5px] leading-[1.75] text-[#283235]/75">
              Liên hệ WANDERS để được đội ngũ chuyên viên hỗ trợ lựa chọn giải pháp sản phẩm, định mức vật tư và bảng màu 3D chuẩn xác.
            </p>
          </div>

          <div class="flex flex-col gap-4 lg:items-end">
            <a href="./lien-he.html" class="inline-flex w-full items-center justify-between gap-8 bg-[#D36A44] px-8 py-5 text-[13px] font-semibold uppercase tracking-[0.16em] text-white hover:bg-[#B35532] transition-colors">
              <span>GỬI YÊU CẦU TƯ VẤN</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
            <div class="flex items-center gap-3 text-[14px] text-[#283235]">
              <span class="font-medium text-[#68716D]">Hoặc gọi hotline:</span>
              <a href="tel:0937760688" class="font-bold text-[#283235] hover:text-[#D36A44] transition-colors text-[16px]">0937.760.688</a>
            </div>
          </div>
        </div>
      </div>
    </section>

  </main>

  <!-- FOOTER -->
  ${renderFooter(0)}

  <!-- Interactive JavaScript for Color Explorer, Tabs, Living with Colour -->
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      
      // 1. Color Explorer Group Switcher
      const groupItems = document.querySelectorAll('.explorer-group-item');
      const roomImg = document.getElementById('explorerRoomImg');
      const groupSubtitle = document.getElementById('explorerGroupSubtitle');
      const colorName = document.getElementById('explorerColorName');
      const colorBox = document.getElementById('explorerColorBox');
      const colorHex = document.getElementById('explorerColorHex');

      const groupData = [
        {
          name: 'Warm Neutral — Trung tính ấm',
          defaultColor: 'Cát ấm WANDERS',
          defaultHex: '#DFD0B8',
          img: './images/base44/8099d7d28_generated_8abc6bed.png'
        },
        {
          name: 'Earth Tone — Tông đất',
          defaultColor: 'Đất nung mờ WANDERS',
          defaultHex: '#BC8563',
          img: './images/base44/edf841af7_generated_77536f0e.png'
        },
        {
          name: 'Sage Green — Xanh xô thơm',
          defaultColor: 'Xô thơm mộc WANDERS',
          defaultHex: '#A3B59E',
          img: './images/base44/7f7b7d76e_generated_2a17cf56.png'
        },
        {
          name: 'Modern Blue — Xanh hiện đại',
          defaultColor: 'Biển sương mai WANDERS',
          defaultHex: '#8EADC0',
          img: './images/base44/0cff00e0d_generated_6094395e.png'
        },
        {
          name: 'Soft White — Trắng mềm',
          defaultColor: 'Trắng ngọc trai WANDERS',
          defaultHex: '#F8F6F0',
          img: './images/base44/85e7f93c0_generated_2df1c9b3.png'
        }
      ];

      groupItems.forEach(item => {
        item.addEventListener('click', (e) => {
          const idx = parseInt(item.getAttribute('data-group'), 10);
          const data = groupData[idx];
          if (!data) return;

          // Toggle swatches row
          groupItems.forEach(g => {
            const swatches = g.querySelector('.group-swatches');
            if (swatches) swatches.classList.add('hidden');
          });
          const currSwatches = item.querySelector('.group-swatches');
          if (currSwatches) currSwatches.classList.remove('hidden');

          // If clicked a specific swatch button inside
          const swatchBtn = e.target.closest('button');
          if (swatchBtn) {
            const hex = swatchBtn.getAttribute('data-hex');
            const name = swatchBtn.getAttribute('data-name');
            colorHex.textContent = hex;
            colorBox.style.backgroundColor = hex;
            colorName.textContent = name + ' WANDERS';
          } else {
            colorHex.textContent = data.defaultHex;
            colorBox.style.backgroundColor = data.defaultHex;
            colorName.textContent = data.defaultColor;
          }

          groupSubtitle.textContent = data.name;
          roomImg.src = data.img;
        });
      });

      // 2. Catalogue Tab Filter
      const catTabs = document.querySelectorAll('.cat-tab');
      const productCards = document.querySelectorAll('#catalogueGrid .b44-product-card');

      catTabs.forEach(tab => {
        tab.addEventListener('click', () => {
          catTabs.forEach(t => {
            t.classList.remove('border-b-2', 'border-[#D36A44]', 'text-[#283235]', 'font-semibold');
            t.classList.add('text-[#68716D]', 'font-medium');
          });
          tab.classList.add('border-b-2', 'border-[#D36A44]', 'text-[#283235]', 'font-semibold');
          tab.classList.remove('text-[#68716D]');

          const cat = tab.getAttribute('data-cat');
          productCards.forEach(card => {
            if (cat === 'all' || card.getAttribute('data-cat') === cat) {
              card.style.display = 'block';
            } else {
              card.style.display = 'none';
            }
          });
        });
      });

      // 3. Living with Colour Switcher
      const livingTabs = document.querySelectorAll('.living-tab');
      const livingRoomImg = document.getElementById('livingRoomImg');
      const livingSubtitle = document.getElementById('livingSubtitle');
      const livingTitle = document.getElementById('livingTitle');
      const livingDescTitle = document.getElementById('livingDescTitle');
      const livingDescText = document.getElementById('livingDescText');
      const livingSwatches = document.getElementById('livingSwatches');

      const livingData = [
        {
          subtitle: 'MODERN MINIMAL',
          title: 'Tối giản hiện đại',
          descTitle: 'Đường nét gọn, sắc thái dịu nhẹ',
          descText: 'Không gian tập trung vào ánh sáng tự nhiên, bề mặt tường mờ mịn và những gam màu trung tính nhẹ nhàng giúp tâm trí thư thái sau ngày dài.',
          img: './images/base44/edf841af7_generated_77536f0e.png',
          swatches: [
            { name: 'Trắng cát', hex: '#DFD0B8' },
            { name: 'Xô thơm', hex: '#8A9A86' },
            { name: 'Đất ấm', hex: '#B5A082' }
          ]
        },
        {
          subtitle: 'WARM LIVING',
          title: 'Sống ấm cúng',
          descTitle: 'Chất liệu thô mộc, ánh sáng vàng ấm',
          descText: 'Sự kết hợp giữa gam màu đất nung, gỗ sồi tự nhiên và ánh đèn dịu giúp mỗi buổi tối sum vầy thêm phần ấm áp, chan hòa cảm xúc.',
          img: './images/base44/8099d7d28_generated_8abc6bed.png',
          swatches: [
            { name: 'Đất nung', hex: '#BC8563' },
            { name: 'Cát vàng', hex: '#D3A27F' },
            { name: 'Trắng kem', hex: '#F1ECE1' }
          ]
        },
        {
          subtitle: 'NATURE INSPIRED',
          title: 'Cảm hứng thiên nhiên',
          descTitle: 'Sắc xanh tươi mát hòa cùng vườn nhà',
          descText: 'Đưa hơi thở cỏ cây vào từng góc phòng với sắc xanh xô thơm và xanh ô-liu êm dịu, mở rộng thị giác kết nối với thiên nhiên bên ngoài.',
          img: './images/base44/7f7b7d76e_generated_2a17cf56.png',
          swatches: [
            { name: 'Xanh lá sương', hex: '#C8D3C5' },
            { name: 'Xô thơm mộc', hex: '#A3B59E' },
            { name: 'Lá rêu đá', hex: '#556B52' }
          ]
        },
        {
          subtitle: 'CONTEMPORARY LUXURY',
          title: 'Sang trọng đương đại',
          descTitle: 'Tương phản tinh tế, chiều sâu không gian',
          descText: 'Sắc xám than kết hợp xanh biển thẫm và điểm xuyết kim loại mang lại nét lịch lãm, vững chãi cho không gian sống đẳng cấp.',
          img: './images/base44/0cff00e0d_generated_6094395e.png',
          swatches: [
            { name: 'Xanh biển sâu', hex: '#315873' },
            { name: 'Xám khói đá', hex: '#8EADC0' },
            { name: 'Trắng bột đá', hex: '#D6CFC1' }
          ]
        }
      ];

      livingTabs.forEach(tab => {
        tab.addEventListener('click', () => {
          livingTabs.forEach(t => {
            t.classList.remove('bg-[#283235]', 'text-[#F8F6F0]', 'border-[#283235]');
            t.classList.add('border-[#E5E3DC]', 'text-[#68716D]');
          });
          tab.classList.add('bg-[#283235]', 'text-[#F8F6F0]', 'border-[#283235]');
          tab.classList.remove('border-[#E5E3DC]', 'text-[#68716D]');

          const idx = parseInt(tab.getAttribute('data-idx'), 10);
          const d = livingData[idx];
          if (!d) return;

          livingSubtitle.textContent = d.subtitle;
          livingTitle.textContent = d.title;
          livingDescTitle.textContent = d.descTitle;
          livingDescText.textContent = d.descText;
          livingRoomImg.src = d.img;

          livingSwatches.innerHTML = d.swatches.map(function(s) {
            return '<div class="flex flex-col">' +
              '<span class="h-12 w-full border border-[#E5E3DC]" style="background-color: ' + s.hex + ';"></span>' +
              '<span class="mt-2 text-[11px] font-medium text-[#283235]">' + s.name + '</span>' +
              '<span class="font-mono text-[10px] text-[#68716D]">' + s.hex + '</span>' +
            '</div>';
          }).join('');
        });
      });

    });
  </script>
</body>
</html>`;

  fs.writeFileSync(path.join(BASE_DIR, 'index.html'), homeHtml);
  console.log('Successfully generated index.html! Size:', homeHtml.length);
}

module.exports = { buildHomePage };

if (require.main === module) {
  buildHomePage();
}
