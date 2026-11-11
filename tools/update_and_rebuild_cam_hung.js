const fs = require('fs');
const path = require('path');

const buildScriptPath = path.join(__dirname, 'build_cam_hung_page.js');
let script = fs.readFileSync(buildScriptPath, 'utf8');

// 1. Add coreCss loading if not present
if (!script.includes('const coreCss =')) {
  script = script.replace(
    "const paletteJson = fs.readFileSync('c:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/data/color_palette.json', 'utf8');",
    `const paletteJson = fs.readFileSync('c:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/data/color_palette.json', 'utf8');
const coreCss = fs.readFileSync('c:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/assets/index-BDqGYMxC.css', 'utf8');`
  );
}

// 2. Remove manifest.json link to avoid CORS error on file:///
script = script.replace('<link href="${p}manifest.json" rel="manifest">', '<!-- manifest omitted for offline file:/// compatibility -->');

// 3. Remove crossorigin on stylesheet and inline coreCss
script = script.replace(
  '<link rel="stylesheet" crossorigin href="${p}assets/index-BDqGYMxC.css">',
  `<link rel="stylesheet" href="\${p}assets/index-BDqGYMxC.css">
  <style id="inlined-core-css">
    \${coreCss}
  </style>`
);

// 4. Ensure SVGs have width and height
script = script.replace(
  '<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>',
  '<svg class="h-4 w-4" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>'
);

script = script.replace(
  '<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>',
  '<svg class="h-4 w-4" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>'
);

// 5. Ensure hamburger button is in right actions
if (!script.includes('aria-label="Mở menu"')) {
  script = script.replace(
    `<a class="hidden rounded-[3px] bg-brand-green px-4 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-brand-ink sm:inline-flex" href="\${p}lien-he/index.html" data-discover="true">Nhận tư vấn</a>
        </div>`,
    `<a class="hidden rounded-[3px] bg-brand-green px-4 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-brand-ink sm:inline-flex" href="\${p}lien-he/index.html" data-discover="true">Nhận tư vấn</a>
          <button type="button" aria-label="Mở menu" class="flex h-10 w-10 items-center justify-center border border-brand-line text-brand-ink lg:hidden"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-menu h-5 w-5"><line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="18" y2="18"></line></svg></button>
        </div>`
  );
}

fs.writeFileSync(buildScriptPath, script, 'utf8');
console.log('build_cam_hung_page.js updated successfully!');

