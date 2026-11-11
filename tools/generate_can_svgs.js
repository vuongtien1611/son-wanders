const fs = require('fs');
const path = require('path');

function createCanSvg(theme) {
  // theme: { bodyColor, lidColor, labelColor, name, code, accent }
  const { bodyColor, bodyGradient, labelColor, name, code, lidColor = '#E5E7EB' } = theme;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320" width="100%" height="100%">
  <defs>
    <!-- Drop Shadow -->
    <radialGradient id="shadow-${code}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#000000" stop-opacity="0.32"/>
      <stop offset="60%" stop-color="#000000" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>

    <!-- Metal Lid Gradient -->
    <linearGradient id="lidGrad-${code}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#D1D5DB"/>
      <stop offset="25%" stop-color="#F3F4F6"/>
      <stop offset="50%" stop-color="#FFFFFF"/>
      <stop offset="75%" stop-color="#E5E7EB"/>
      <stop offset="100%" stop-color="#9CA3AF"/>
    </linearGradient>

    <!-- Bucket Body 3D Cylinder Gradient -->
    <linearGradient id="bodyGrad-${code}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${bodyGradient[0]}"/>
      <stop offset="20%" stop-color="${bodyGradient[1]}"/>
      <stop offset="50%" stop-color="${bodyGradient[2]}"/>
      <stop offset="80%" stop-color="${bodyGradient[1]}"/>
      <stop offset="100%" stop-color="${bodyGradient[3]}"/>
    </linearGradient>

    <!-- Label Gradient -->
    <linearGradient id="labelGrad-${code}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${labelColor[0]}"/>
      <stop offset="50%" stop-color="${labelColor[1]}"/>
      <stop offset="100%" stop-color="${labelColor[2]}"/>
    </linearGradient>
  </defs>

  <!-- Shadow under can -->
  <ellipse cx="160" cy="288" rx="100" ry="16" fill="url(#shadow-${code})"/>

  <!-- Metal Handle Wire -->
  <path d="M 52 108 C 52 32, 268 32, 268 108" fill="none" stroke="#9CA3AF" stroke-width="4.5" stroke-linecap="round"/>
  <rect x="135" y="44" width="50" height="10" rx="4" fill="#374151"/>

  <!-- Handle Ear Mounts -->
  <circle cx="52" cy="112" r="7" fill="#6B7280"/>
  <circle cx="52" cy="112" r="3.5" fill="#D1D5DB"/>
  <circle cx="268" cy="112" r="7" fill="#6B7280"/>
  <circle cx="268" cy="112" r="3.5" fill="#D1D5DB"/>

  <!-- Bucket Body (Tapered Cylinder) -->
  <path d="M 58 102 L 72 272 Q 72 284 160 284 Q 248 284 248 272 L 262 102 Z" fill="url(#bodyGrad-${code})"/>

  <!-- Label Wrap on Body -->
  <path d="M 62 136 L 69 248 Q 160 258 251 248 L 258 136 Q 160 144 62 136 Z" fill="url(#labelGrad-${code})"/>

  <!-- Label Content -->
  <!-- WANDERS Logo -->
  <g transform="translate(160, 172)">
    <text x="0" y="0" font-family="'Be Vietnam Pro', sans-serif" font-size="20" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="-0.5">
      WANDERS<tspan font-size="9" dy="-8" font-weight="bold">®</tspan>
    </text>
    <!-- Golden Swoosh below WANDERS -->
    <path d="M -42 5 C -15 1, 20 1, 44 4" stroke="#D4AF37" stroke-width="2.2" stroke-linecap="round" fill="none"/>
  </g>

  <!-- Product Name on Can -->
  <text x="160" y="202" font-family="'Be Vietnam Pro', sans-serif" font-size="10" font-weight="800" fill="#FFFFFF" text-anchor="middle" letter-spacing="0.5" opacity="0.95">
    ${name.toUpperCase()}
  </text>
  
  <!-- Subtle line under name -->
  <line x1="120" y1="210" x2="200" y2="210" stroke="#FFFFFF" stroke-width="0.8" opacity="0.4"/>

  <!-- Code on Can -->
  <text x="160" y="224" font-family="monospace" font-size="9" font-weight="700" fill="#F3F4F6" text-anchor="middle" letter-spacing="1">
    ${code}
  </text>

  <!-- Spec Badges on Label -->
  <text x="160" y="238" font-family="'Be Vietnam Pro', sans-serif" font-size="7.5" font-weight="600" fill="#D4AF37" text-anchor="middle" letter-spacing="0.4">
    UK TECHNOLOGY • ISO 9001:2015
  </text>

  <!-- Top Rim & Lid -->
  <ellipse cx="160" cy="102" rx="103" ry="14" fill="url(#lidGrad-${code})" stroke="#9CA3AF" stroke-width="1.2"/>
  <ellipse cx="160" cy="100" rx="96" ry="11" fill="#F9FAFB" stroke="#D1D5DB" stroke-width="1"/>
  <ellipse cx="160" cy="99" rx="84" ry="8" fill="#E5E7EB"/>
  <ellipse cx="160" cy="98" rx="60" ry="5.5" fill="#F3F4F6"/>
</svg>`;
}

const cans = [
  {
    filename: 'can-wanders-interior-green.svg',
    bodyColor: '#0F4C3A',
    bodyGradient: ['#0A3428', '#0F4C3A', '#19765D', '#07241C'],
    labelColor: ['#07241C', '#0F4C3A', '#07241C'],
    name: 'Sơn Nội Thất Cao Cấp',
    code: 'W-INT01'
  },
  {
    filename: 'can-wanders-exterior-yellow.svg',
    bodyColor: '#D99B26',
    bodyGradient: ['#A06F14', '#D49622', '#F3B846', '#85590D'],
    labelColor: ['#85590D', '#D49622', '#85590D'],
    name: 'Sơn Ngoại Thất Bền Màu',
    code: 'W-EXT02'
  },
  {
    filename: 'can-wanders-waterproof-blue.svg',
    bodyColor: '#1E4E79',
    bodyGradient: ['#12314E', '#1E4E79', '#3173AD', '#0C2033'],
    labelColor: ['#0C2033', '#1E4E79', '#0C2033'],
    name: 'Sơn Chống Thấm Đa Năng',
    code: 'W-WP03'
  },
  {
    filename: 'can-wanders-sealer-teal.svg',
    bodyColor: '#2D6A5F',
    bodyGradient: ['#1A423A', '#2D6A5F', '#469687', '#122E29'],
    labelColor: ['#122E29', '#2D6A5F', '#122E29'],
    name: 'Sơn Lót Kháng Kiềm',
    code: 'W-PR04'
  }
];

const imgDir = path.join(__dirname, '../website_download/images');
cans.forEach(can => {
  const svg = createCanSvg(can);
  fs.writeFileSync(path.join(imgDir, can.filename), svg, 'utf8');
  console.log('Created can SVG:', can.filename);
});

