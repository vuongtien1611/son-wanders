const fs = require('fs');
const path = require('path');

const jsPath = path.join(__dirname, '../website_download/assets/index-BG3fZPr5.js');
let js = fs.readFileSync(jsPath, 'utf8');

const ALL_IMG_MAP = {
  // 1. IN 3*
  'bronze-for-interior-in3000': 'images/products/wanders-in-3.jpeg',
  'IN3000': 'images/products/wanders-in-3.jpeg',
  'IN3*': 'images/products/wanders-in-3.jpeg',
  'IN 3': 'images/products/wanders-in-3.jpeg',

  // 2. IN 525
  'silver-for-interior-in5000': 'images/products/wanders-in-525.jpeg',
  'IN5000': 'images/products/wanders-in-525.jpeg',
  'IN525': 'images/products/wanders-in-525.jpeg',
  'IN 525': 'images/products/wanders-in-525.jpeg',

  // 3. IN 626
  'silk-for-interior-in6000': 'images/products/wanders-in-626.jpeg',
  'IN6000': 'images/products/wanders-in-626.jpeg',
  'IN626': 'images/products/wanders-in-626.jpeg',
  'IN 626': 'images/products/wanders-in-626.jpeg',

  // 4. IN 828
  'gold-for-interior-in8000': 'images/products/wanders-in-828.jpeg',
  'IN8000': 'images/products/wanders-in-828.jpeg',
  'IN828': 'images/products/wanders-in-828.jpeg',
  'IN 828': 'images/products/wanders-in-828.jpeg',

  // 5. IN 929
  'diamond-for-interior-in9000': 'images/products/wanders-in-929.jpeg',
  'IN9000': 'images/products/wanders-in-929.jpeg',
  'IN929': 'images/products/wanders-in-929.jpeg',
  'IN 929': 'images/products/wanders-in-929.jpeg',

  // 6. EX 555
  'satin-for-exterior-ex5000': 'images/products/wanders-ex-555.jpeg',
  'EX5000': 'images/products/wanders-ex-555.jpeg',
  'EX555': 'images/products/wanders-ex-555.jpeg',
  'EX 555': 'images/products/wanders-ex-555.jpeg',

  // 7. EX 777
  'titan-for-exterior-ex7000': 'images/products/wanders-ex-777.jpeg',
  'EX7000': 'images/products/wanders-ex-777.jpeg',
  'EX777': 'images/products/wanders-ex-777.jpeg',
  'EX 777': 'images/products/wanders-ex-777.jpeg',

  // 8. EX 999
  'anti-uv-exterior-ex9000': 'images/products/wanders-ex999.jpeg',
  'EX9000': 'images/products/wanders-ex999.jpeg',
  'EX999': 'images/products/wanders-ex999.jpeg',
  'EX 999': 'images/products/wanders-ex999.jpeg',

  // 9. LĐN 515
  'sealer-super-sp5000': 'images/products/wanders-lot-da-nang.jpeg',
  'SP5000': 'images/products/wanders-lot-da-nang.jpeg',
  'LĐN 515': 'images/products/wanders-lot-da-nang.jpeg',
  'LDN 515': 'images/products/wanders-lot-da-nang.jpeg',
  'Lót đă năng': 'images/products/wanders-lot-da-nang.jpeg',

  // 10. CK 818
  'sealer-pro-sp8000': 'images/products/wanders-kiem-noi.jpeg',
  'SP8000': 'images/products/wanders-kiem-noi.jpeg',
  'CK818': 'images/products/wanders-kiem-noi.jpeg',
  'Kiềm nội': 'images/products/wanders-kiem-noi.jpeg',

  // 11. CK 919
  'sealer-nano-sn8000': 'images/products/wanders-kiem-ngoai.jpeg',
  'SN8000': 'images/products/wanders-kiem-ngoai.jpeg',
  'CK919': 'images/products/wanders-kiem-ngoai.jpeg',
  'Kiềm ngoại': 'images/products/wanders-kiem-ngoai.jpeg',

  // 12. PRIMER NANOTECH
  'primer-nanotech-khang-muoi': 'images/products/wanders-sieu-lien-ket.jpeg',
  'PRIMER NANOTECH': 'images/products/wanders-sieu-lien-ket.jpeg',
  'Siêu liên kết': 'images/products/wanders-sieu-lien-ket.jpeg',

  // 13. WATERPROOF-CT B5
  'waterproof-nano-wnano': 'images/products/wanders-ct-xi-mang.jpeg',
  'WNANO': 'images/products/wanders-ct-xi-mang.jpeg',
  'WATERPROOF-CT B5': 'images/products/wanders-ct-xi-mang.jpeg',
  'CT xi măng': 'images/products/wanders-ct-xi-mang.jpeg',

  // 14. WATERPROOF-CT B5 MÀU
  'waterproof-e5-we5': 'images/products/wanders-ct-mau.jpeg',
  'WE5': 'images/products/wanders-ct-mau.jpeg',
  'WATERPROOF-CT B5 MÀU': 'images/products/wanders-ct-mau.jpeg',
  'CT màu': 'images/products/wanders-ct-mau.jpeg',

  // 15. XIKA BITUM
  'xika-bitum-chong-tham-san': 'images/products/wanders-ct-bitum.jpeg',
  'XI-KA BITUM': 'images/products/wanders-ct-bitum.jpeg',
  'XIKA BITUM': 'images/products/wanders-ct-bitum.jpeg',
  'CT Bitum': 'images/products/wanders-ct-bitum.jpeg',

  // 16. XIKA LASTIC
  'xika-lastic': 'images/products/wanders-ct-lo-thien.jpeg',
  'XIKA LASTIC': 'images/products/wanders-ct-lo-thien.jpeg',
  'CT lộ thiên': 'images/products/wanders-ct-lo-thien.jpeg',

  // 17. CN08
  'son-chong-nong-cn08': 'images/products/wanders-chong-nong.png',
  'CN08': 'images/products/wanders-chong-nong.png',
  'Chống nóng': 'images/products/wanders-chong-nong.png',

  // 18. MH 9999
  'son-nhu-cao-cap-mh9999': 'images/products/wanders-nhu-vang.jpeg',
  'MH9999': 'images/products/wanders-nhu-vang.jpeg',
  'MH 9999': 'images/products/wanders-nhu-vang.jpeg',
  'Nhũ vàng': 'images/products/wanders-nhu-vang.jpeg',

  // 19. CLEAR NANO
  'clear-nano-phu-bong': 'images/products/wanders-bong-clear.jpeg',
  'CLEAR NANO': 'images/products/wanders-bong-clear.jpeg',
  'Bóng Clear': 'images/products/wanders-bong-clear.jpeg',

  // 20. PHỦ BÓNG 2K
  'son-bong-2k': 'images/products/wanders-2k.jpeg',
  'PHỦ BÓNG 2K': 'images/products/wanders-2k.jpeg',
  '2K': 'images/products/wanders-2k.jpeg',

  // 21. PUTTY INTER
  'bot-ba-noi-ngoai-that-putty': 'images/products/wanders-bot-ba-noi.jpeg',
  'PUTTY INTER & EXTER': 'images/products/wanders-bot-ba-noi.jpeg',
  'PUTTY INTER': 'images/products/wanders-bot-ba-noi.jpeg',
  'Bột bả nội': 'images/products/wanders-bot-ba-noi.jpeg',

  // 22. PUTTY EXTER
  'bot-ba-ngoai-that-cao-cap': 'images/products/wanders-bot-ba-ngoai.jpeg',
  'PUTTY FOR EXTERIOR': 'images/products/wanders-bot-ba-ngoai.jpeg',
  'PUTTY EXTER': 'images/products/wanders-bot-ba-ngoai.jpeg',
  'Bột bả ngoại': 'images/products/wanders-bot-ba-ngoai.jpeg',

  // 23. LATEX MH
  'phu-gia-chong-tham-latex-mh': 'images/products/wanders-latex.jpeg',
  'LATEX MH': 'images/products/wanders-latex.jpeg',
  'Latex': 'images/products/wanders-latex.jpeg',

  // 24. SƠN CHẬU CẢNH
  'son-chau-canh-cao-cap': 'images/products/wanders-sheet1.jpeg',
  'CHẬU CẢNH': 'images/products/wanders-sheet1.jpeg',
  'SƠN CHẬU CẢNH': 'images/products/wanders-sheet1.jpeg',
  'Sheet1': 'images/products/wanders-sheet1.jpeg'
};

const newFCode = `var _IMG_MAP=${JSON.stringify(ALL_IMG_MAP)};
function F_({product:e,className:t}){
  var _fn=_IMG_MAP[e?.slug]||_IMG_MAP[e?.code]||e?.image;
  if(_fn){
    var _fullSrc=_fn.startsWith('http')?_fn:('/'+_fn.replace(/^\\.?\\//,''));
    return (0,j.jsx)(\"div\",{className:Kr(\"flex items-center justify-center bg-brand-ivory/60 p-4 overflow-hidden relative group/prodimg\",t),children:(0,j.jsx)(\"img\",{src:_fullSrc,alt:e?.name||'',loading:\"lazy\",className:\"product-image h-full w-full object-contain object-center transition-transform duration-300 group-hover/prodimg:scale-105 drop-shadow-md\",style:{width:\"100%\",height:\"100%\",objectFit:\"contain\",objectPosition:\"center\"}})});
  }
  return (0,j.jsxs)(\"div\",{className:Kr(\"flex flex-col items-center justify-center bg-brand-ivory\",t),children:[(0,j.jsx)(\"span\",{className:\"font-mono text-[11px] uppercase tracking-[0.2em] text-brand-green\",children:e?.code}),(0,j.jsx)(\"span\",{className:\"mt-3 h-px w-8 bg-brand-line\"}),(0,j.jsx)(\"span\",{className:\"mt-3 px-4 text-center text-[11px] leading-snug text-brand-slate/80\",children:\"Ảnh sản phẩm đang cập nhật\"})]});
}`;

const fIdx = js.indexOf('var _IMG_MAP=');
if (fIdx !== -1) {
  const iIdx = js.indexOf('var I_=[', fIdx);
  if (iIdx !== -1) {
    js = js.substring(0, fIdx) + newFCode + js.substring(iIdx);
    fs.writeFileSync(jsPath, js, 'utf8');
    console.log('SUCCESS: Patched React bundle F_ with all 24 authentic images!');
  } else {
    console.error('Could not locate var I_');
  }
} else {
  console.error('Could not locate var _IMG_MAP');
}
