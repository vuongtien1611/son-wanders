const fs = require('fs');
const path = require('path');

const dataDir = 'C:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/data';
const jsonPath = path.join(dataDir, 'color_palette.json');
const collections = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Add Red collection
collections.push({
  id: 6,
  code: 'RED',
  name: 'Red – Đỏ Nồng Nàn & Quyền Quý',
  slug: 'red',
  accent_hex: '#DC2626',
  image: 'images/022_6f3c1edac_generated_image.png',
  description: 'Nhóm màu Red toát lên sự nồng ấm, đam mê và quyền uy đầy kiêu hãnh. Phù hợp cho những không gian tạo ấn tượng mạnh mẽ, điểm nhấn kiến trúc nghệ thuật và mang lại tài lộc may mắn cho gia chủ.',
  sort_order: 6,
  is_active: true,
  colors: [
    { code: 'MH0118', name_vi: 'Đỏ Hồng Ngọc Đậm', name_en: 'RUBY EMBRACE', hex: '#D64550', is_featured: true },
    { code: 'MH0101', name_vi: 'Hồng Đào Sương Mai', name_en: 'PEACH BLUSH', hex: '#FFF1F2' },
    { code: 'MH0102', name_vi: 'Hồng San Hô Nhạt', name_en: 'SOFT CORAL', hex: '#FFE4E6' },
    { code: 'MH0103', name_vi: 'Hồng Cánh Hoa', name_en: 'ROSE TINT', hex: '#FECDD3' },
    { code: 'MH0104', name_vi: 'Hồng Phấn Tươi', name_en: 'VIVID BLUSH', hex: '#FDA4AF' },
    { code: 'MH0105', name_vi: 'Đỏ San Hô', name_en: 'CORAL RED', hex: '#FB7185' },
    { code: 'MH0106', name_vi: 'Đỏ Thắm Tươi', name_en: 'ROSE CARMINE', hex: '#F43F5E' },
    { code: 'MH0107', name_vi: 'Đỏ Phấn Nhẹ', name_en: 'PALE ROSE', hex: '#FEF2F2' },
    { code: 'MH0108', name_vi: 'Đỏ Hoa Đào', name_en: 'CHERRY BLOSSOM', hex: '#FEE2E2' },
    { code: 'MH0109', name_vi: 'Đỏ Phấn Mịn', name_en: 'POWDER ROSE', hex: '#FECACA' },
    { code: 'MH0110', name_vi: 'Đỏ Dâu Tây', name_en: 'STRAWBERRY RED', hex: '#FCA5A5' },
    { code: 'MH0111', name_vi: 'Đỏ Tươi Rực', name_en: 'SCARLET FLAME', hex: '#F87171' },
    { code: 'MH0112', name_vi: 'Đỏ Cờ Truyền Thống', name_en: 'CRIMSON PRIDE', hex: '#EF4444' },
    { code: 'MH0113', name_vi: 'Đỏ Ruby Quý Tộc', name_en: 'ROYAL RUBY', hex: '#DC2626' },
    { code: 'MH0114', name_vi: 'Đỏ Mận Chín', name_en: 'RIPE PLUM RED', hex: '#B91C1C' },
    { code: 'MH0115', name_vi: 'Đỏ Rượu Vang', name_en: 'BORDEAUX WINE', hex: '#991B1B' },
    { code: 'MH0116', name_vi: 'Đỏ Máu Bồ Câu', name_en: 'DEEP CARMINE', hex: '#7F1D1D' },
    { code: 'MH0117', name_vi: 'Đỏ Đất Nung', name_en: 'TERRACOTTA', hex: '#9A3412' }
  ]
});

// Add Brown collection
collections.push({
  id: 7,
  code: 'BROWN',
  name: 'Brown – Nâu Mộc Mạc & Bền Vững',
  slug: 'brown',
  accent_hex: '#854D0E',
  image: 'images/006_d0746339d_generated_image.png',
  description: 'Nhóm màu Brown gợi nhớ đến gỗ trầm, đất mẹ và sự vững chãi, ấm cúng. Mang lại cảm giác an tâm, bền vững và phong thái sang trọng đậm chất quý tộc cho không gian sống gia đình.',
  sort_order: 7,
  is_active: true,
  colors: [
    { code: 'MH0530', name_vi: 'Gỗ Tuyết Tùng Trầm', name_en: 'CEDAR WOOD', hex: '#9C6644', is_featured: true },
    { code: 'MH0501', name_vi: 'Kem Cà Phê Nhạt', name_en: 'LATTE FOAM', hex: '#FDF8F5' },
    { code: 'MH0502', name_vi: 'Cát Sa Mạc Ấm', name_en: 'WARM DUNES', hex: '#F5EBE1' },
    { code: 'MH0503', name_vi: 'Nâu Bánh Quy', name_en: 'BISCUIT TINT', hex: '#EBD9C8' },
    { code: 'MH0504', name_vi: 'Nâu Hạnh Nhân', name_en: 'ALMOND WOOD', hex: '#DCC3AC' },
    { code: 'MH0505', name_vi: 'Nâu Caramel Dịu', name_en: 'CARAMEL DRIZZLE', hex: '#C8A88D' },
    { code: 'MH0506', name_vi: 'Nâu Quế Rừng', name_en: 'CINNAMON SPICE', hex: '#B58D6E' },
    { code: 'MH0507', name_vi: 'Nâu Gỗ Sồi', name_en: 'OAK TIMBER', hex: '#9D7351' },
    { code: 'MH0508', name_vi: 'Nâu Hạt Dẻ', name_en: 'ROASTED CHESTNUT', hex: '#845A38' },
    { code: 'MH0509', name_vi: 'Nâu Socola Đậm', name_en: 'RICH CHOCOLATE', hex: '#6A4423' },
    { code: 'MH0510', name_vi: 'Nâu Gỗ Óc Chó', name_en: 'WALNUT SHADOW', hex: '#523114' },
    { code: 'MH0511', name_vi: 'Nâu Cà Phê Đen', name_en: 'ESPRESSO NOIR', hex: '#3B200A' },
    { code: 'MH0512', name_vi: 'Nâu Đất Mẹ', name_en: 'EARTHEN BROWN', hex: '#2A1505' }
  ]
});

fs.writeFileSync(jsonPath, JSON.stringify(collections, null, 2), 'utf8');
console.log('Now have', collections.length, 'collections in color_palette.json!');

