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

const ROOT = path.resolve(__dirname, '../website_download');

const PROJECTS = [
  {
    slug: 'biet-thu-mai-bang',
    category: 'Nhà ở',
    title: 'Biệt thự mái bằng',
    excerpt: 'Mặt tiền trắng ngà kết hợp khối ốp đất nung, sân vườn nhiệt đới.',
    description:
      'Công trình nhà ở với hai khối chức năng lệch tầng, mặt tiền sử dụng sắc trắng ngà làm nền và một khối ốp màu đất nung để tạo điểm nhấn. Các mảng tường lớn được giữ phẳng, hạn chế chi tiết để ánh nắng tạo hình khối.',
    applicationArea: 'Mặt tiền & sân vườn',
    suggestedLine: 'Ngoại thất EX9000 / Lót SN8000',
    heroImage: '0cff00e0d_generated_6094395e.png',
    galleryImages: [
      '0cff00e0d_generated_6094395e.png',
      'f8b86d905_generated_509a0b06.png',
      'b61550fbc_generated_9d16c57c.png',
    ],
    palette: [
      { hex: '#F1ECE0', name: 'Trắng ngà' },
      { hex: '#C58A63', name: 'Đất nung' },
      { hex: '#283235', name: 'Than trầm' },
    ],
    related: ['can-ho-trung-tam', 'quan-ca-phe-studio'],
  },
  {
    slug: 'can-ho-trung-tam',
    category: 'Căn hộ',
    title: 'Căn hộ trung tâm',
    excerpt: 'Tông cát ấm cho căn hộ nhiều ánh sáng, nội thất gỗ.',
    description:
      'Toàn bộ tường được giữ trong một nhóm tông cát ấm để mở rộng cảm giác diện tích. Nội thất gỗ sáng và vải lanh là các vật liệu chính, hạn chế chi tiết trang trí.',
    applicationArea: 'Phòng khách & nội thất',
    suggestedLine: 'Nội thất IN626 / IN828',
    heroImage: '08867f386_generated_9bb6eef6.png',
    galleryImages: [
      '08867f386_generated_9bb6eef6.png',
      'f8b86d905_generated_509a0b06.png',
      'b61550fbc_generated_9d16c57c.png',
    ],
    palette: [
      { hex: '#EFE6D8', name: 'Cát sáng' },
      { hex: '#CDB99C', name: 'Cát ấm' },
      { hex: '#6F5B49', name: 'Gỗ trầm' },
    ],
    related: ['biet-thu-mai-bang', 'quan-ca-phe-studio'],
  },
  {
    slug: 'quan-ca-phe-studio',
    category: 'Thương mại',
    title: 'Quán cà phê studio',
    excerpt: 'Xanh ô-liu đậm và đá mài sáng cho không gian F&B.',
    description:
      'Không gian thương mại sử dụng mảng tường xanh đậm để tạo chiều sâu, kết hợp mặt bàn đá mài sáng và gỗ tự nhiên. Bề mặt tường được chọn loại dễ vệ sinh trong môi trường đông khách.',
    applicationArea: 'Không gian F&B & studio',
    suggestedLine: 'Nội thất IN626 lau chùi hiệu quả',
    heroImage: '7266e0bc1_generated_27f36fa1.png',
    galleryImages: [
      '7266e0bc1_generated_27f36fa1.png',
      'f8b86d905_generated_509a0b06.png',
      'b61550fbc_generated_9d16c57c.png',
    ],
    palette: [
      { hex: '#556145', name: 'Xanh ô-liu' },
      { hex: '#EFE6D8', name: 'Kem đá mài' },
      { hex: '#B1714B', name: 'Nâu gỗ ấm' },
    ],
    related: ['biet-thu-mai-bang', 'can-ho-trung-tam'],
  },
  {
    slug: 'sanh-lam-viec',
    category: 'Văn phòng',
    title: 'Sảnh làm việc',
    excerpt: 'Ghi đá ấm và bề mặt lì tinh giản cho khu vực đón tiếp hiện đại.',
    description:
      'Không gian sảnh văn phòng ưu tiên cảm giác tập trung và trật tự thị giác bằng gam ghi đá ấm làm chủ đạo. Bề mặt sơn nội thất độ bóng thấp giúp hạn chế chói sáng dưới hệ đèn kiến trúc và làm nổi bật các chi tiết kim loại tối màu.',
    applicationArea: 'Sảnh đón tiếp & văn phòng',
    suggestedLine: 'Nội thất IN525 siêu mịn',
    heroImage: '699adaa7a_generated_49cef920.png',
    galleryImages: [
      '699adaa7a_generated_49cef920.png',
      'f8b86d905_generated_509a0b06.png',
      'b61550fbc_generated_9d16c57c.png',
    ],
    palette: [
      { hex: '#EAE5DC', name: 'Ghi đá ấm' },
      { hex: '#3A4042', name: 'Xám kiến trúc' },
      { hex: '#C26A46', name: 'Cam đất' },
    ],
    related: ['quan-ca-phe-studio', 'can-ho-trung-tam'],
  },
  {
    slug: 'nha-vuon-mot-tang',
    category: 'Nhà ở',
    title: 'Nhà vườn một tầng',
    excerpt: 'Trắng kem dịu mắt hoà quyện cùng hiên gỗ và mảng xanh sân vườn.',
    description:
      'Ngôi nhà một tầng mở rộng tầm nhìn ra khu vườn nhiệt đới với lớp sơn ngoại thất trắng kem ấm áp, giảm phản xạ nắng gắt buổi trưa. Sắc trung tính nhẹ giúp chuyển tiếp mềm mại giữa hiên nhà, gạch nung và tán cây xanh.',
    applicationArea: 'Ngoại thất & hiên nhà vườn',
    suggestedLine: 'Ngoại thất EX555 / Chống thấm WE5',
    heroImage: 'd46ca89f2_generated_e7f1be47.png',
    galleryImages: [
      'd46ca89f2_generated_e7f1be47.png',
      'f8b86d905_generated_509a0b06.png',
      'b61550fbc_generated_9d16c57c.png',
    ],
    palette: [
      { hex: '#F3EEE4', name: 'Trắng kem' },
      { hex: '#8A9478', name: 'Xanh lá xô thơm' },
      { hex: '#685544', name: 'Nâu đất' },
    ],
    related: ['biet-thu-mai-bang', 'can-ho-trung-tam'],
  },
];

const PROJECT_BY_SLUG = Object.fromEntries(PROJECTS.map((p) => [p.slug, p]));

function buildProjectDetailHtml(project) {
  const prefix = '../../';
  const heroSrc = `${prefix}images/base44/${project.heroImage}`;

  const paletteHtml = project.palette
    .map(
      (s) =>
        `<span class="h-7 w-7 rounded border border-[#273238]/15" style="background-color:${s.hex}" title="${escapeHtml(s.name)} (${s.hex})"></span>`
    )
    .join('');

  const galleryHtml = project.galleryImages
    .map((img, idx) => {
      const imgSrc = `${prefix}images/base44/${img}`;
      const alt = `${project.title} — phối cảnh ${idx + 1}`;
      return `<button type="button" data-gallery-src="${imgSrc}" data-gallery-alt="${escapeHtml(alt)}" class="group relative cursor-pointer overflow-hidden rounded-[10px] bg-[#E5DFD3] text-left"><span class="inline-block relative aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" data-base44-image="" data-base44-image-src="${imgSrc}"><span class="block relative w-full h-full overflow-hidden"><img class="w-full h-full inset-0 absolute object-cover" alt="${escapeHtml(alt)}" src="${imgSrc}"></span></span><span class="absolute inset-0 bg-[#073B2E]/0 transition-colors duration-300 group-hover:bg-[#073B2E]/18"></span></button>`;
    })
    .join('');

  const relatedHtml = project.related
    .map((relSlug) => {
      const rel = PROJECT_BY_SLUG[relSlug];
      if (!rel) return '';
      const relImg = `${prefix}images/base44/${rel.heroImage}`;
      const relHref = `../${rel.slug}/index.html`;
      return `<a class="w-arch-card group" href="${relHref}"><span class="inline-block relative aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" data-base44-image="" data-base44-image-src="${relImg}"><span class="block relative w-full h-full overflow-hidden"><img class="w-full h-full inset-0 absolute object-cover" alt="${escapeHtml(rel.title)}" src="${relImg}"></span></span><div class="w-arch-card-overlay"></div><span class="absolute left-4 top-4 rounded border border-[#F6F3EC]/30 bg-[#073B2E]/70 px-2.5 py-1 text-[9.5px] uppercase tracking-[0.16em] text-[#F6F3EC] backdrop-blur-sm">Phối cảnh định hướng</span><div class="absolute inset-x-0 bottom-0 p-5 pt-16"><p class="text-[10px] uppercase tracking-[0.22em] text-[#E8CA7A]">${escapeHtml(rel.category)}</p><h3 class="mt-2 text-[18px] font-semibold text-white">${escapeHtml(rel.title)}</h3></div></a>`;
    })
    .join('');

  return `<!DOCTYPE html>
<html lang="vi">
${renderHead({
  prefix,
  title: `${project.title} — Dự án WANDERS`,
  description: project.excerpt,
  ogImage: `images/base44/${project.heroImage}`,
  canonicalPath: `du-an/${project.slug}/index.html`,
  extraCss: ['wanders-gallery-lightbox.css'],
})}
<body class="font-body antialiased">
  ${renderHeader(prefix, 'du-an')}
  <main>
    <section class="w-hero-section">
      <div class="absolute inset-0">
        <span class="inline-block relative h-full w-full object-cover" data-base44-image="" data-base44-image-src="${heroSrc}">
          <span class="block relative w-full h-full overflow-hidden">
            <img class="w-full h-full inset-0 absolute object-cover" alt="${escapeHtml(project.title)}" src="${heroSrc}">
          </span>
        </span>
        <div class="w-subhero-overlay"></div>
      </div>
      <div class="wanders-container relative z-10 flex min-h-[420px] flex-col justify-end pb-12 pt-24 lg:min-h-[500px]">
        <div class="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-[#F6F3EC]/70 w-hero-stagger w-hero-stagger--1">
          <a class="transition-colors hover:text-[#D6AD45]" href="${prefix}du-an.html">Dự án</a>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="h-3 w-3"><path d="m9 18 6-6-6-6"></path></svg>
          <span class="text-[#E8CA7A]">${escapeHtml(project.category)}</span>
        </div>
        <h1 class="w-subhero-title mt-4 text-white w-hero-stagger w-hero-stagger--2">${escapeHtml(project.title)}</h1>
        <p class="mt-4 max-w-[54ch] text-[15px] leading-[1.7] text-[#F6F3EC]/85 w-hero-stagger w-hero-stagger--3">${escapeHtml(project.excerpt)}</p>
      </div>
    </section>

    <section class="border-b border-[#E2DDD2] w-bg-white">
      <div class="wanders-container">
        <div class="grid grid-cols-2 gap-6 py-8 sm:grid-cols-4 w-reveal">
          <div>
            <p class="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-[#5A6468]">Loại công trình</p>
            <p class="mt-2 text-[14.5px] font-medium text-[#073B2E]">${escapeHtml(project.category)}</p>
          </div>
          <div>
            <p class="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-[#5A6468]">Không gian áp dụng</p>
            <p class="mt-2 text-[14.5px] font-medium text-[#273238]">${escapeHtml(project.applicationArea)}</p>
          </div>
          <div>
            <p class="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-[#5A6468]">Hệ sơn gợi ý</p>
            <p class="mt-2 text-[14.5px] font-medium text-[#273238]">${escapeHtml(project.suggestedLine)}</p>
          </div>
          <div>
            <p class="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-[#5A6468]">Bảng màu định hướng</p>
            <div class="mt-2 flex gap-2">${paletteHtml}</div>
          </div>
        </div>
      </div>
    </section>

    <section class="w-bg-ivory py-14 lg:py-20">
      <div class="wanders-container">
        <div class="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:gap-16 w-reveal">
          <div>
            <p class="w-eyebrow"><span class="w-eyebrow-line"></span>Mô tả phối cảnh</p>
            <p class="mt-5 text-[15.5px] leading-[1.85] text-[#273238]/88">${escapeHtml(project.description)}</p>
          </div>
          <div class="rounded-[10px] border border-[#E2DDD2] bg-white p-7">
            <p class="text-[10.5px] font-semibold uppercase tracking-[0.24em] text-[#073B2E]">Tư vấn định hướng</p>
            <p class="mt-4 text-[14px] leading-[1.75] text-[#5A6468]">Phối cảnh minh họa định hướng màu sắc kiến trúc WANDERS. Liên hệ đội ngũ kỹ thuật để được phối màu phù hợp ánh sáng và vật liệu công trình thực tế.</p>
            <a class="w-text-link mt-6" href="${prefix}lien-he.html">
              <span>Tư vấn màu cho công trình</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" class="h-3.5 w-3.5"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            </a>
          </div>
        </div>

        <div class="mt-12 grid gap-5 sm:grid-cols-3 w-reveal" data-wanders-gallery="${escapeHtml(project.title)}">${galleryHtml}</div>
        <p class="mt-4 text-[12px] text-[#5A6468]">Phối cảnh tham khảo định hướng màu sắc — nhấn vào ảnh để xem kích thước lớn.</p>
      </div>
    </section>

    <section class="border-t border-[#E2DDD2] w-bg-white py-14 lg:py-20">
      <div class="wanders-container">
        <div class="flex items-end justify-between gap-4 w-reveal">
          <h2 class="w-section-title text-[#073B2E]">Dự án tham khảo khác</h2>
          <a class="w-text-link" href="${prefix}du-an.html">
            <span>Xem tất cả</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" class="h-3.5 w-3.5"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
          </a>
        </div>
        <div class="mt-8 grid gap-6 sm:grid-cols-2 w-reveal">${relatedHtml}</div>
      </div>
    </section>

    ${renderConsultationCta(prefix)}
  </main>

  ${renderFooter(prefix)}
  ${renderMobileDrawer(prefix)}

  ${renderCoreScripts(prefix, { extraScripts: ['wanders-gallery-lightbox.js'] })}
</body>
</html>`;
}

function buildAllProjectDetailPages() {
  PROJECTS.forEach((project) => {
    const dir = path.join(ROOT, 'du-an', project.slug);
    fs.mkdirSync(dir, { recursive: true });
    const outPath = path.join(dir, 'index.html');
    fs.writeFileSync(outPath, buildProjectDetailHtml(project), 'utf8');
    console.log('Generated:', path.relative(ROOT, outPath));
  });
}

if (require.main === module) {
  buildAllProjectDetailPages();
}

module.exports = { PROJECTS, buildAllProjectDetailPages };
