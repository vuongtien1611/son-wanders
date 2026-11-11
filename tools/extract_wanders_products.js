const xlsx = require('xlsx');
const fs = require('fs');

const wb = xlsx.readFile('Sơn WANDERS.xlsx');

// 24 sheets
const sheetMeta = {
  'IN 3': {
    code: 'IN3*',
    name: 'Sơn Nội Thất Che Phủ Hiệu Quả',
    fullName: 'SƠN NỘI THẤT CHE PHỦ HIỆU QUẢ - EFFECTIVE COVERAGE IN3*',
    category: 'son-noi-that',
    categoryName: 'Sơn nội thất',
    packaging: '5L & 18L',
    image: 'images/can-wanders-interior-green.svg',
    link: 'san-pham/bronze-for-interior-in3000/index.html'
  },
  'IN 525': {
    code: 'IN525',
    name: 'Sơn Nội Thất Siêu Mịn, Siêu Trắng',
    fullName: 'SƠN NỘI THẤT SIÊU MỊN, SIÊU TRẮNG – SILVER INTERIOR IN525',
    category: 'son-noi-that',
    categoryName: 'Sơn nội thất',
    packaging: '5L & 18L',
    image: 'images/can-wanders-interior-green.svg',
    link: 'san-pham/silver-for-interior-in5000/index.html'
  },
  'IN 626': {
    code: 'IN626',
    name: 'Sơn Nội Thất Bóng Cao Cấp',
    fullName: 'SƠN NỘI THẤT BÓNG CAO CẤP – SILK INTERIOR IN626',
    category: 'son-noi-that',
    categoryName: 'Sơn nội thất',
    packaging: '5L & 18L',
    image: 'images/can-wanders-interior-green.svg',
    link: 'san-pham/silk-for-interior-in6000/index.html'
  },
  'IN 828': {
    code: 'IN828',
    name: 'Sơn Nội Thất Siêu Bóng Ánh Ngọc Hợp Kim',
    fullName: 'SƠN NỘI THẤT SIÊU BÓNG ÁNH NGỌC – GOLD INTERIOR IN828',
    category: 'son-noi-that',
    categoryName: 'Sơn nội thất',
    packaging: '5L & 18L',
    image: 'images/can-wanders-interior-green.svg',
    link: 'san-pham/gold-for-interior-in8000/index.html'
  },
  'IN 929': {
    code: 'IN929',
    name: 'Sơn Nội Thất Siêu Bóng Ánh Ngọc Kháng Khuẩn',
    fullName: 'SƠN NỘI THẤT SIÊU BÓNG ÁNH NGỌC KHÁNG KHUẨN – DIAMOND INTERIOR IN929',
    category: 'son-noi-that',
    categoryName: 'Sơn nội thất',
    packaging: '5L & 18L',
    image: 'images/can-wanders-interior-green.svg',
    link: 'san-pham/diamond-for-interior-in9000/index.html'
  },
  'EX 555': {
    code: 'EX555',
    name: 'Sơn Ngoại Thất Bền Đẹp',
    fullName: 'SƠN NGOẠI THẤT BỀN ĐẸP – SATIN EXTERIOR EX555',
    category: 'son-ngoai-that',
    categoryName: 'Sơn ngoại thất',
    packaging: '5L & 18L',
    image: 'images/can-wanders-exterior-yellow.svg',
    link: 'san-pham/satin-for-exterior-ex5000/index.html'
  },
  'EX 777': {
    code: 'EX777',
    name: 'Sơn Ngoại Thất Siêu Bóng Ngọc Trai',
    fullName: 'SƠN NGOẠI THẤT SIÊU BÓNG NGỌC TRAI – TITAN EXTERIOR EX777',
    category: 'son-ngoai-that',
    categoryName: 'Sơn ngoại thất',
    packaging: '5L & 18L',
    image: 'images/can-wanders-exterior-yellow.svg',
    link: 'san-pham/titan-for-exterior-ex7000/index.html'
  },
  'EX999': {
    code: 'EX999',
    name: 'Sơn Ngoại Thất Siêu Bóng Hợp Kim Chống Nóng',
    fullName: 'SƠN NGOẠI THẤT SIÊU BÓNG HỢP KIM CHỐNG NÓNG – ANTI-UV EXTERIOR EX999',
    category: 'son-ngoai-that',
    categoryName: 'Sơn ngoại thất',
    packaging: '5L & 18L',
    image: 'images/can-wanders-exterior-yellow.svg',
    link: 'san-pham/anti-uv-exterior-ex9000/index.html'
  },
  'Lót đă năng': {
    code: 'LĐN 515',
    name: 'Sơn Lót Kiềm Đa Năng',
    fullName: 'SƠN LÓT KIỀM ĐA NĂNG – SEALER SUPER LĐN 515',
    category: 'son-lot',
    categoryName: 'Sơn lót',
    packaging: '5L & 18L',
    image: 'images/can-wanders-sealer-teal.svg',
    link: 'san-pham/sealer-super-sp5000/index.html'
  },
  'Kiềm nội': {
    code: 'CK818',
    name: 'Sơn Lót Nội Thất Kháng Kiềm Cao Cấp',
    fullName: 'SƠN LÓT NỘI THẤT KHÁNG KIỀM CAO CẤP – SEALER INTERIOR CK818',
    category: 'son-lot',
    categoryName: 'Sơn lót',
    packaging: '5L & 18L',
    image: 'images/can-wanders-sealer-teal.svg',
    link: 'san-pham/sealer-pro-sp8000/index.html'
  },
  'Kiềm ngoại': {
    code: 'CK919',
    name: 'Sơn Lót Ngoại Thất Kháng Kiềm Cao Cấp',
    fullName: 'SƠN LÓT NGOẠI THẤT KHÁNG KIỀM CAO CẤP – SEALER EXTERIOR CK919',
    category: 'son-lot',
    categoryName: 'Sơn lót',
    packaging: '5L & 18L',
    image: 'images/can-wanders-sealer-teal.svg',
    link: 'san-pham/sealer-nano-sn8000/index.html'
  },
  'Siêu liên kết': {
    code: 'PRIMER NANOTECH',
    name: 'Sơn Lót Siêu Kháng Muối & Liên Kết',
    fullName: 'SƠN LÓT SIÊU LIÊN KẾT KHÁNG MUỐI PRIMER NANOTECH',
    category: 'son-lot',
    categoryName: 'Sơn lót',
    packaging: '5L & 18L',
    image: 'images/can-wanders-sealer-teal.svg',
    link: 'san-pham/primer-nanotech-khang-muoi/index.html'
  },
  'CT xi măng': {
    code: 'WATERPROOF-CT B5',
    name: 'Sơn Chống Thấm Pha Xi Măng B5',
    fullName: 'SƠN CHỐNG THẤM XI MĂNG – WATERPROOF-CT B5',
    category: 'chong-tham',
    categoryName: 'Chống thấm',
    packaging: '5L & 18L',
    image: 'images/can-wanders-waterproof-blue.svg',
    link: 'san-pham/waterproof-nano-wnano/index.html'
  },
  'CT màu': {
    code: 'WATERPROOF-CT B5 MÀU',
    name: 'Sơn Chống Thấm Màu Trực Tiếp B5',
    fullName: 'SƠN CHỐNG THẤM MÀU TRỰC TIẾP – WATERPROOF-CT B5',
    category: 'chong-tham',
    categoryName: 'Chống thấm',
    packaging: '5L & 18L',
    image: 'images/can-wanders-waterproof-blue.svg',
    link: 'san-pham/waterproof-e5-we5/index.html'
  },
  'CT Bitum': {
    code: 'XIKA BITUM',
    name: 'Sơn Chống Thấm Sàn Đàn Hồi Xi-Ka Bitum',
    fullName: 'SƠN CHỐNG THẤM SÀN ĐÀN HỒI – XI-KA BITUM',
    category: 'chong-tham',
    categoryName: 'Chống thấm',
    packaging: 'Thùng 18L',
    image: 'images/product-xika-bitum.png',
    link: 'san-pham/xika-bitum-chong-tham-san/index.html'
  },
  'CT lộ thiên': {
    code: 'XIKA LASTIC',
    name: 'Sơn Chống Thấm Siêu Đàn Hồi Lộ Thiên Xika Lastic',
    fullName: 'SƠN CHỐNG THẤM LỘ THIÊN SIÊU ĐÀN HỒI – XIKA LASTIC',
    category: 'chong-tham',
    categoryName: 'Chống thấm',
    packaging: 'Thùng 18L',
    image: 'images/product-xika-lastic.png',
    link: 'san-pham/xika-lastic/index.html'
  },
  'Chống nóng': {
    code: 'CN08',
    name: 'Sơn Chống Nóng Cách Nhiệt Cao Cấp CN08',
    fullName: 'SƠN CHỐNG NÓNG CAO CẤP CN08',
    category: 'son-chong-nong',
    categoryName: 'Sơn chống nóng',
    packaging: '5L & 18L',
    image: 'images/product-son-chong-nong-cn08.png',
    link: 'san-pham/son-chong-nong-cn08/index.html'
  },
  'Nhũ vàng': {
    code: 'MH 9999',
    name: 'Sơn Nhũ Vàng Ánh Kim Cao Cấp',
    fullName: 'SƠN NHŨ VÀNG CAO CẤP MH 9999',
    category: 'san-pham-khac',
    categoryName: 'Sản phẩm khác',
    packaging: 'Lon 1L',
    image: 'images/product-son-nhu-mh9999.png',
    link: 'san-pham/son-nhu-cao-cap-mh9999/index.html'
  },
  'Bóng Clear': {
    code: 'CLEAR NANO',
    name: 'Sơn Phủ Bóng Clear Nano Bảo Vệ',
    fullName: 'SƠN PHỦ BÓNG CLEAR NANO BẢO VỆ',
    category: 'san-pham-khac',
    categoryName: 'Sản phẩm khác',
    packaging: '1L & 5L',
    image: 'images/product-clear-nano.png',
    link: 'san-pham/clear-nano-phu-bong/index.html'
  },
  '2K': {
    code: 'PHỦ BÓNG 2K',
    name: 'Sơn Phủ Bóng 2K Hai Thành Phần WANDERS',
    fullName: 'PHỦ BÓNG 2K HAI THÀNH PHẦN WANDERS',
    category: 'san-pham-khac',
    categoryName: 'Sản phẩm khác',
    packaging: 'Bộ 2 thành phần',
    image: 'images/product-son-bong-2k.png',
    link: 'san-pham/son-bong-2k/index.html'
  },
  'Bột bả nội': {
    code: 'PUTTY INTER',
    name: 'Bột Bả Nội Thất Cao Cấp',
    fullName: 'BỘT BẢ NỘI THẤT CAO CẤP PUTTY FOR INTERIOR',
    category: 'san-pham-khac',
    categoryName: 'Sản phẩm khác',
    packaging: 'Bao 40Kg',
    image: 'images/product-bot-ba-noi-that.png',
    link: 'san-pham/bot-ba-noi-ngoai-that-putty/index.html'
  },
  'Bột bả ngoại': {
    code: 'PUTTY EXTER',
    name: 'Bột Bả Ngoại Thất Chịu Ẩm Cao Cấp',
    fullName: 'BỘT BẢ NGOẠI THẤT CAO CẤP PUTTY FOR EXTERIOR',
    category: 'san-pham-khac',
    categoryName: 'Sản phẩm khác',
    packaging: 'Bao 40Kg',
    image: 'images/product-bot-ba-ngoai-that.png',
    link: 'san-pham/bot-ba-ngoai-that-cao-cap/index.html'
  },
  'Latex': {
    code: 'LATEX MH',
    name: 'Phụ Gia Chống Thấm & Tác Nhân Kết Nối',
    fullName: 'PHỤ GIA CHỐNG THẤM & TÁC NHÂN KẾT NỐI LATEX MH',
    category: 'san-pham-khac',
    categoryName: 'Sản phẩm khác',
    packaging: 'Can 5L & 18L',
    image: 'images/product-latex-mh.png',
    link: 'san-pham/phu-gia-chong-tham-latex-mh/index.html'
  },
  'Sheet1': {
    code: 'SƠN CHẬU CẢNH',
    name: 'Sơn Chậu Cảnh Chuyên Dụng WANDERS',
    fullName: 'SƠN CHẬU CẢNH CAO CẤP WANDERS',
    category: 'san-pham-khac',
    categoryName: 'Sản phẩm khác',
    packaging: 'Lon 1L & 5L',
    image: 'images/product-son-chau-canh.png',
    link: 'san-pham/son-chau-canh-cao-cap/index.html'
  }
};

const fullProducts = [];

wb.SheetNames.forEach(sheetName => {
  const meta = sheetMeta[sheetName];
  if (!meta) return;

  const ws = wb.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json(ws, { header: 1 });
  let desc = '';
  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];
    if (!row) continue;
    const line = row.join(' ').trim();
    if (line.includes('MÔ TẢ SẢN PHẨM')) {
      for (let next = r + 1; next < r + 4; next++) {
        if (rows[next] && rows[next].join(' ').trim().length > 30) {
          desc = rows[next].join(' ').trim();
          // Clean any remaining MY HOUR in descriptions to WANDERS
          desc = desc.replace(/MY\s*HOUR/gi, 'WANDERS');
          break;
        }
      }
    }
  }

  // Fallback description from sheet content if needed
  if (!desc) {
    if (sheetName === 'Siêu liên kết') desc = 'Dòng sản phẩm đặc thù nghiên cứu với mục đích xử lý các bức tường cũ hỏng, bị kiềm hóa, muối hóa, nấm mốc.';
    if (sheetName === 'Sheet1') desc = 'Sơn nước ngoại thất phù hợp bề mặt chậu cây cảnh, nhiệt đới hóa hoàn toàn bởi công nghệ chống thấm kháng kiềm hiệu quả.';
    if (sheetName === 'Chống nóng') desc = 'Sơn chống nóng chuyên dụng cho mái tôn, vách tôn, tường đứng giúp giảm nhiệt hiệu quả, phản xạ bức xạ mặt trời.';
    if (sheetName === 'Bột bả nội') desc = 'Dùng để che lấp các lỗ hổng và làm phẳng các bề mặt hồ vữa hay bê tông trước khi sơn lót trong nhà.';
    if (sheetName === 'Bột bả ngoại') desc = 'Dùng để che lấp các lỗ hổng và làm phẳng các bề mặt hồ vữa hay bê tông trước khi sơn lót ngoài trời.';
  }

  fullProducts.push({
    sheet: sheetName,
    code: meta.code,
    name: meta.name,
    fullName: meta.fullName,
    category: meta.category,
    categoryName: meta.categoryName,
    packaging: meta.packaging,
    desc: desc,
    image: meta.image,
    link: meta.link
  });
});

fs.writeFileSync('giao-dien/website_download/data/wanders_products.json', JSON.stringify(fullProducts, null, 2), 'utf8');
console.log('Successfully saved wanders_products.json with', fullProducts.length, 'authentic products!');
