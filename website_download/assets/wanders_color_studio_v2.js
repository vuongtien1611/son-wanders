/**
 * WANDERS COLOR STUDIO V2
 * Interactive Engine for Color Studio, Palette Board & Room Visualizer
 */

(function () {
  'use strict';

  // --- 1. DATA: 5 Collections x 24 Colors ---
  const COLLECTIONS = [
    {
      id: 'warm-neutral',
      name: 'Trung tính ấm',
      name_en: 'Warm Neutral',
      description: 'Nhóm màu trung tính ấm mang lại cảm giác bình yên, thư thái và sang trọng.',
      colors: [
        { code: 'WN0808', name_en: 'Ivory Mist', name_vi: 'Trắng ngà mờ', hex: '#F4ECE1', shade: 'light', brightness: 'high', tone: 'warm' },
        { code: 'WN0809', name_en: 'Linen Cream', name_vi: 'Kem vải lanh', hex: '#EFE4D2', shade: 'light', brightness: 'high', tone: 'warm' },
        { code: 'WN0810', name_en: 'Warm Porcelain', name_vi: 'Sứ ấm áp', hex: '#E8DCC8', shade: 'light', brightness: 'high', tone: 'warm' },
        { code: 'WN0811', name_en: 'Shell Beige', name_vi: 'Be vỏ sò', hex: '#E2D3BC', shade: 'light', brightness: 'high', tone: 'warm' },
        { code: 'WN0812', name_en: 'Sand Dune', name_vi: 'Cồn cát', hex: '#DBC9B0', shade: 'medium', brightness: 'mid', tone: 'warm' },
        { code: 'WN0813', name_en: 'Oatmeal', name_vi: 'Yến mạch', hex: '#D4BEA2', shade: 'medium', brightness: 'mid', tone: 'warm' },
        
        { code: 'WN0814', name_en: 'Almond Latte', name_vi: 'Latte hạnh nhân', hex: '#D8C6B0', shade: 'medium', brightness: 'mid', tone: 'warm' },
        { code: 'WN0815', name_en: 'Honey Beige', name_vi: 'Be mật ong', hex: '#D0BD9F', shade: 'medium', brightness: 'mid', tone: 'warm' },
        { code: 'WN0816', name_en: 'Biscotti', name_vi: 'Bánh quy Ý', hex: '#C8B291', shade: 'medium', brightness: 'mid', tone: 'warm' },
        { code: 'WN0817', name_en: 'Clay Beige', name_vi: 'Be đất sét', hex: '#B99F7F', shade: 'medium', brightness: 'mid', tone: 'warm' },
        { code: 'WN0818', name_en: 'Taupe Brown', name_vi: 'Nâu xám', hex: '#9E846A', shade: 'deep', brightness: 'dark', tone: 'warm' },
        { code: 'WN0819', name_en: 'Taupe Mocha', name_vi: 'Mocha trầm', hex: '#826D57', shade: 'deep', brightness: 'dark', tone: 'warm' },
        
        { code: 'WN0820', name_en: 'Rose Veil', name_vi: 'Khăn voan hồng', hex: '#F6E3DF', shade: 'light', brightness: 'high', tone: 'warm' },
        { code: 'WN0821', name_en: 'Blush Petal', name_vi: 'Cánh hoa phớt', hex: '#EFD2CB', shade: 'light', brightness: 'high', tone: 'warm' },
        { code: 'WN0822', name_en: 'Dusty Rose', name_vi: 'Hồng bụi', hex: '#E4BEB4', shade: 'medium', brightness: 'mid', tone: 'warm' },
        { code: 'WN0823', name_en: 'Roselle', name_vi: 'Hoa bụp giấm', hex: '#DCABA0', shade: 'medium', brightness: 'mid', tone: 'warm' },
        { code: 'WN0824', name_en: 'Prairie Gentian', name_vi: 'Tím thảo nguyên', hex: '#D49B8E', shade: 'medium', brightness: 'mid', tone: 'warm', is_featured: true },
        { code: 'WN0825', name_en: 'Mauve Haze', name_vi: 'Sương khói hồng', hex: '#B88579', shade: 'deep', brightness: 'mid', tone: 'warm' },
        
        { code: 'WN0826', name_en: 'Lilac Fog', name_vi: 'Sương mù tím', hex: '#E7E1EA', shade: 'light', brightness: 'high', tone: 'cool' },
        { code: 'WN0827', name_en: 'Orchid Mist', name_vi: 'Sương phong lan', hex: '#D8CDDD', shade: 'light', brightness: 'high', tone: 'cool' },
        { code: 'WN0828', name_en: 'Wisteria Light', name_vi: 'Tử đằng nhạt', hex: '#C6B8CF', shade: 'medium', brightness: 'mid', tone: 'cool' },
        { code: 'WN0829', name_en: 'Wisteria Bloom', name_vi: 'Tử đằng nở hoa', hex: '#B4A1BF', shade: 'medium', brightness: 'mid', tone: 'cool' },
        { code: 'WN0830', name_en: 'Plum Petal', name_vi: 'Cánh hoa mận', hex: '#A088AF', shade: 'deep', brightness: 'dark', tone: 'cool' },
        { code: 'WN0831', name_en: 'Vintage Violet', name_vi: 'Tím cổ điển', hex: '#856C97', shade: 'deep', brightness: 'dark', tone: 'cool' }
      ]
    },
    {
      id: 'earth-tone',
      name: 'Tông đất',
      name_en: 'Earth Tone',
      description: 'Sắc thái lấy cảm hứng từ đất sét, cát vàng và khoáng thạch tự nhiên.',
      colors: [
        { code: 'ET0101', name_en: 'Desert Sand', name_vi: 'Cát sa mạc', hex: '#EADFCB', shade: 'light', brightness: 'high', tone: 'warm' },
        { code: 'ET0102', name_en: 'Warm Ochre', name_vi: 'Hoàng thổ ấm', hex: '#DEC49B', shade: 'medium', brightness: 'mid', tone: 'warm' },
        { code: 'ET0103', name_en: 'Raw Sienna', name_vi: 'Đất nung thô', hex: '#CEAB7E', shade: 'medium', brightness: 'mid', tone: 'warm' },
        { code: 'ET0104', name_en: 'Terracotta Glow', name_vi: 'Ánh đất nung', hex: '#C58A63', shade: 'medium', brightness: 'mid', tone: 'warm' },
        { code: 'ET0105', name_en: 'Burnt Amber', name_vi: 'Hổ phách cháy', hex: '#B36D43', shade: 'deep', brightness: 'mid', tone: 'warm' },
        { code: 'ET0106', name_en: 'Deep Clay', name_vi: 'Đất sét đậm', hex: '#94512D', shade: 'deep', brightness: 'dark', tone: 'warm' },
        { code: 'ET0107', name_en: 'Spiced Cinnamon', name_vi: 'Quế cay', hex: '#A55C3A', shade: 'deep', brightness: 'dark', tone: 'warm' },
        { code: 'ET0108', name_en: 'Red Earth', name_vi: 'Đất đỏ bazan', hex: '#8D4024', shade: 'deep', brightness: 'dark', tone: 'warm' },
        { code: 'ET0109', name_en: 'Rustic Brick', name_vi: 'Gạch mộc', hex: '#7B331A', shade: 'deep', brightness: 'dark', tone: 'warm' },
        { code: 'ET0110', name_en: 'Earthy Taupe', name_vi: 'Nâu đất mộc', hex: '#988270', shade: 'medium', brightness: 'mid', tone: 'neutral' },
        { code: 'ET0111', name_en: 'Roasted Chestnut', name_vi: 'Hạt dẻ nướng', hex: '#6F5443', shade: 'deep', brightness: 'dark', tone: 'warm' },
        { code: 'ET0112', name_en: 'Dark Truffle', name_vi: 'Nấm cục đen', hex: '#4A3528', shade: 'deep', brightness: 'dark', tone: 'warm' },
        { code: 'ET0113', name_en: 'Wheat Grain', name_vi: 'Hạt lúa mì', hex: '#E6D3B3', shade: 'light', brightness: 'high', tone: 'warm' },
        { code: 'ET0114', name_en: 'Harvest Gold', name_vi: 'Vàng mùa gặt', hex: '#D7B88A', shade: 'medium', brightness: 'mid', tone: 'warm' },
        { code: 'ET0115', name_en: 'Golden Ochre', name_vi: 'Hoàng thổ kim', hex: '#C89C63', shade: 'medium', brightness: 'mid', tone: 'warm' },
        { code: 'ET0116', name_en: 'Warm Caramel', name_vi: 'Caramel ấm', hex: '#B78044', shade: 'deep', brightness: 'mid', tone: 'warm' },
        { code: 'ET0117', name_en: 'Toasted Pecan', name_vi: 'Hạt hồ đào', hex: '#9B632F', shade: 'deep', brightness: 'dark', tone: 'warm' },
        { code: 'ET0118', name_en: 'Espresso Bean', name_vi: 'Cà phê Espresso', hex: '#54361C', shade: 'deep', brightness: 'dark', tone: 'warm' },
        { code: 'ET0119', name_en: 'Sedona Dust', name_vi: 'Bụi sa thạch', hex: '#E8C1AC', shade: 'light', brightness: 'high', tone: 'warm' },
        { code: 'ET0120', name_en: 'Adobe Blush', name_vi: 'Đất nung phấn', hex: '#D7A48C', shade: 'medium', brightness: 'mid', tone: 'warm' },
        { code: 'ET0121', name_en: 'Canyon Stone', name_vi: 'Đá hẻm núi', hex: '#C4856A', shade: 'medium', brightness: 'mid', tone: 'warm' },
        { code: 'ET0122', name_en: 'Mojave Rust', name_vi: 'Rỉ sét sa mạc', hex: '#B0694D', shade: 'deep', brightness: 'dark', tone: 'warm' },
        { code: 'ET0123', name_en: 'Iron Bark', name_vi: 'Vỏ sắt trầm', hex: '#874831', shade: 'deep', brightness: 'dark', tone: 'warm' },
        { code: 'ET0124', name_en: 'Ancient Soil', name_vi: 'Đất cổ đại', hex: '#63382A', shade: 'deep', brightness: 'dark', tone: 'warm' }
      ]
    },
    {
      id: 'sage-green',
      name: 'Xanh cỏ thơm',
      name_en: 'Sage & Botanical',
      description: 'Sắc xanh dịu mát của thảo mộc, lá xô thơm và rừng nhiệt đới thanh bình.',
      colors: [
        { code: 'SG0201', name_en: 'Morning Dew', name_vi: 'Sương ban mai', hex: '#E8EDE0', shade: 'light', brightness: 'high', tone: 'cool' },
        { code: 'SG0202', name_en: 'Pale Celadon', name_vi: 'Men ngọc nhạt', hex: '#DDE4D2', shade: 'light', brightness: 'high', tone: 'cool' },
        { code: 'SG0203', name_en: 'Sage Mist', name_vi: 'Sương xô thơm', hex: '#CFD8C2', shade: 'light', brightness: 'high', tone: 'cool' },
        { code: 'SG0204', name_en: 'Silver Eucalyptus', name_vi: 'Bạch đàn bạc', hex: '#BFCCAF', shade: 'medium', brightness: 'mid', tone: 'cool' },
        { code: 'SG0205', name_en: 'Botanical Herbal', name_vi: 'Thảo mộc thanh nhã', hex: '#ADC09C', shade: 'medium', brightness: 'mid', tone: 'cool' },
        { code: 'SG0206', name_en: 'Olive Leaf', name_vi: 'Lá ô liu', hex: '#96AA84', shade: 'deep', brightness: 'mid', tone: 'cool' },
        { code: 'SG0207', name_en: 'Herbal Whisper', name_vi: 'Thì thầm cỏ xanh', hex: '#E4EBDC', shade: 'light', brightness: 'high', tone: 'cool' },
        { code: 'SG0208', name_en: 'Soft Willow', name_vi: 'Liễu rủ mềm', hex: '#D2DEC6', shade: 'light', brightness: 'high', tone: 'cool' },
        { code: 'SG0209', name_en: 'Meadow Grass', name_vi: 'Cỏ đồng nội', hex: '#BDCEA9', shade: 'medium', brightness: 'mid', tone: 'cool' },
        { code: 'SG0210', name_en: 'Foliage Green', name_vi: 'Tán lá xanh', hex: '#A5BD8D', shade: 'medium', brightness: 'mid', tone: 'cool' },
        { code: 'SG0211', name_en: 'Thyme Blossom', name_vi: 'Hoa dạ hương', hex: '#8CA572', shade: 'deep', brightness: 'mid', tone: 'cool' },
        { code: 'SG0212', name_en: 'Forest Shadow', name_vi: 'Bóng rừng già', hex: '#6C8652', shade: 'deep', brightness: 'dark', tone: 'cool' },
        { code: 'SG0213', name_en: 'Lichen Stone', name_vi: 'Đá địa y', hex: '#D7DECE', shade: 'light', brightness: 'high', tone: 'neutral' },
        { code: 'SG0214', name_en: 'Tea Bush', name_vi: 'Bụi trà xanh', hex: '#C1CCB5', shade: 'medium', brightness: 'mid', tone: 'cool' },
        { code: 'SG0215', name_en: 'Dried Laurel', name_vi: 'Nguyệt quế sấy', hex: '#A9B79B', shade: 'medium', brightness: 'mid', tone: 'cool' },
        { code: 'SG0216', name_en: 'Nordic Moss', name_vi: 'Rêu Bắc Âu', hex: '#8F9F81', shade: 'deep', brightness: 'mid', tone: 'cool' },
        { code: 'SG0217', name_en: 'Deep Pine', name_vi: 'Thông xanh thẳm', hex: '#677859', shade: 'deep', brightness: 'dark', tone: 'cool' },
        { code: 'SG0218', name_en: 'Woodland Canopy', name_vi: 'Vòm cây cổ thụ', hex: '#4A5A3D', shade: 'deep', brightness: 'dark', tone: 'cool' },
        { code: 'SG0219', name_en: 'Frosted Mint', name_vi: 'Bạc hà tuyết', hex: '#E2EBE5', shade: 'light', brightness: 'high', tone: 'cool' },
        { code: 'SG0220', name_en: 'Cool Basil', name_vi: 'Húng tây mát lạnh', hex: '#C8DDD1', shade: 'medium', brightness: 'mid', tone: 'cool' },
        { code: 'SG0221', name_en: 'Alpine Herb', name_vi: 'Cỏ đỉnh núi', hex: '#ADCBBC', shade: 'medium', brightness: 'mid', tone: 'cool' },
        { code: 'SG0222', name_en: 'Evergreen Mist', name_vi: 'Sương vạn niên', hex: '#8FB5A3', shade: 'deep', brightness: 'mid', tone: 'cool' },
        { code: 'SG0223', name_en: 'Seaweed Green', name_vi: 'Xanh rong biển', hex: '#6A9480', shade: 'deep', brightness: 'dark', tone: 'cool' },
        { code: 'SG0224', name_en: 'Deep Spruce', name_vi: 'Vân sam đậm', hex: '#426B57', shade: 'deep', brightness: 'dark', tone: 'cool' }
      ]
    },
    {
      id: 'modern-blue',
      name: 'Xanh hiện đại',
      name_en: 'Modern Blue',
      description: 'Cảm hứng từ bầu trời biển cả rộng lớn, mang lại vẻ đẹp tĩnh lặng và chiều sâu kiến trúc.',
      colors: [
        { code: 'MB0301', name_en: 'Coastal Cloud', name_vi: 'Mây ven biển', hex: '#E5ECF0', shade: 'light', brightness: 'high', tone: 'cool' },
        { code: 'MB0302', name_en: 'Mist Blue', name_vi: 'Xanh sương mờ', hex: '#D5DFE6', shade: 'light', brightness: 'high', tone: 'cool' },
        { code: 'MB0303', name_en: 'Nordic Sky', name_vi: 'Trời Bắc Âu', hex: '#C1D0DC', shade: 'medium', brightness: 'mid', tone: 'cool' },
        { code: 'MB0304', name_en: 'Fjord Blue', name_vi: 'Xanh vịnh hẹp', hex: '#A8BECE', shade: 'medium', brightness: 'mid', tone: 'cool' },
        { code: 'MB0305', name_en: 'Slate Horizon', name_vi: 'Chân trời đá phiến', hex: '#8BA8BE', shade: 'deep', brightness: 'mid', tone: 'cool' },
        { code: 'MB0306', name_en: 'Atlantic Deep', name_vi: 'Đại Tây Dương sâu thẳm', hex: '#668B9E', shade: 'deep', brightness: 'dark', tone: 'cool' },
        { code: 'MB0307', name_en: 'Morning Frost', name_vi: 'Sương giá sáng', hex: '#E7EFF2', shade: 'light', brightness: 'high', tone: 'cool' },
        { code: 'MB0308', name_en: 'Iceberg Tint', name_vi: 'Sắc băng trôi', hex: '#D2E2E8', shade: 'light', brightness: 'high', tone: 'cool' },
        { code: 'MB0309', name_en: 'Glacier Stream', name_vi: 'Suối sông băng', hex: '#BAD3DD', shade: 'medium', brightness: 'mid', tone: 'cool' },
        { code: 'MB0310', name_en: 'Breeze Teal', name_vi: 'Gió xanh ngọc', hex: '#9DC0CD', shade: 'medium', brightness: 'mid', tone: 'cool' },
        { code: 'MB0311', name_en: 'Ocean Breeze', name_vi: 'Gió biển trong lành', hex: '#7BAAB9', shade: 'deep', brightness: 'mid', tone: 'cool' },
        { code: 'MB0312', name_en: 'Deep Marine', name_vi: 'Hải dương sâu', hex: '#538B9B', shade: 'deep', brightness: 'dark', tone: 'cool' },
        { code: 'MB0313', name_en: 'Porcelain Slate', name_vi: 'Đá sứ xám', hex: '#E0E5E8', shade: 'light', brightness: 'high', tone: 'neutral' },
        { code: 'MB0314', name_en: 'Pewter Sky', name_vi: 'Trời thiếc bạc', hex: '#C7D0D6', shade: 'medium', brightness: 'mid', tone: 'cool' },
        { code: 'MB0315', name_en: 'Steel Horizon', name_vi: 'Thép chân trời', hex: '#AAB8C1', shade: 'medium', brightness: 'mid', tone: 'cool' },
        { code: 'MB0316', name_en: 'Storm Gray-Blue', name_vi: 'Xám bão lam', hex: '#8A9DA9', shade: 'deep', brightness: 'mid', tone: 'cool' },
        { code: 'MB0317', name_en: 'Denim Shadow', name_vi: 'Bóng vải Denim', hex: '#687E8C', shade: 'deep', brightness: 'dark', tone: 'cool' },
        { code: 'MB0318', name_en: 'Midnight Harbor', name_vi: 'Hải cảng đêm', hex: '#435865', shade: 'deep', brightness: 'dark', tone: 'cool' },
        { code: 'MB0319', name_en: 'Quiet Twilight', name_vi: 'Hoàng hôn tĩnh mịch', hex: '#DFE2EA', shade: 'light', brightness: 'high', tone: 'cool' },
        { code: 'MB0320', name_en: 'Dusk Cobalt', name_vi: 'Cobalt chạng vạng', hex: '#C4CADE', shade: 'medium', brightness: 'mid', tone: 'cool' },
        { code: 'MB0321', name_en: 'Classic Indigo', name_vi: 'Chàm cổ điển', hex: '#A2ADCE', shade: 'medium', brightness: 'mid', tone: 'cool' },
        { code: 'MB0322', name_en: 'Royal Blue Veil', name_vi: 'Màn xanh hoàng gia', hex: '#7E8DBD', shade: 'deep', brightness: 'mid', tone: 'cool' },
        { code: 'MB0323', name_en: 'Deep Sapphire', name_vi: 'Lam ngọc bích', hex: '#5869A3', shade: 'deep', brightness: 'dark', tone: 'cool' },
        { code: 'MB0324', name_en: 'WANDERS Navy', name_vi: 'Xanh Navy WANDERS', hex: '#2E3D70', shade: 'deep', brightness: 'dark', tone: 'cool' }
      ]
    },
    {
      id: 'soft-white',
      name: 'Trắng mềm',
      name_en: 'Soft White',
      description: 'Hệ màu trắng ngà, trắng phấn và kem tinh khôi, tạo nền tảng ánh sáng hoàn hảo.',
      colors: [
        { code: 'SW0401', name_en: 'Cotton White', name_vi: 'Trắng bông mềm', hex: '#FDFCF7', shade: 'light', brightness: 'high', tone: 'warm' },
        { code: 'SW0402', name_en: 'Snow Silk', name_vi: 'Tơ tuyết mỏng', hex: '#FAF8F2', shade: 'light', brightness: 'high', tone: 'warm' },
        { code: 'SW0403', name_en: 'Warm Alabaster', name_vi: 'Bạch ngọc ấm', hex: '#F7F4EC', shade: 'light', brightness: 'high', tone: 'warm' },
        { code: 'SW0404', name_en: 'Chalk White', name_vi: 'Trắng phấn mộc', hex: '#F3EFE5', shade: 'light', brightness: 'high', tone: 'warm' },
        { code: 'SW0405', name_en: 'Linen Veil', name_vi: 'Màn lanh nhẹ', hex: '#EFEADE', shade: 'light', brightness: 'high', tone: 'warm' },
        { code: 'SW0406', name_en: 'Parchment', name_vi: 'Giấy da cổ', hex: '#EBE4D5', shade: 'medium', brightness: 'high', tone: 'warm' },
        { code: 'SW0407', name_en: 'Feather White', name_vi: 'Lông vũ trắng', hex: '#FDFBF7', shade: 'light', brightness: 'high', tone: 'warm' },
        { code: 'SW0408', name_en: 'Pearl Dust', name_vi: 'Bụi ngọc trai', hex: '#F8F6F0', shade: 'light', brightness: 'high', tone: 'warm' },
        { code: 'SW0409', name_en: 'Vanilla Cream', name_vi: 'Kem Vani', hex: '#F4EFE7', shade: 'light', brightness: 'high', tone: 'warm' },
        { code: 'SW0410', name_en: 'Oat Whisper', name_vi: 'Thì thầm yến mạch', hex: '#EFE9DF', shade: 'medium', brightness: 'high', tone: 'warm' },
        { code: 'SW0411', name_en: 'Cashmere White', name_vi: 'Trắng len Cashmere', hex: '#E9E2D6', shade: 'medium', brightness: 'high', tone: 'warm' },
        { code: 'SW0412', name_en: 'Malted Milk', name_vi: 'Sữa mạch nha', hex: '#E3DBCD', shade: 'medium', brightness: 'mid', tone: 'warm' },
        { code: 'SW0413', name_en: 'Crisp Porcelain', name_vi: 'Sứ trắng tinh khiết', hex: '#FCFDFD', shade: 'light', brightness: 'high', tone: 'cool' },
        { code: 'SW0414', name_en: 'Morning Dew White', name_vi: 'Sương sớm trắng', hex: '#F7F9F9', shade: 'light', brightness: 'high', tone: 'cool' },
        { code: 'SW0415', name_en: 'Nordic Bleach', name_vi: 'Trắng sáng Bắc Âu', hex: '#F1F4F5', shade: 'light', brightness: 'high', tone: 'cool' },
        { code: 'SW0416', name_en: 'Silver White', name_vi: 'Trắng ánh bạc', hex: '#EAEEF0', shade: 'light', brightness: 'high', tone: 'cool' },
        { code: 'SW0417', name_en: 'Pale Haze', name_vi: 'Khói nhạt tinh khôi', hex: '#E2E7EA', shade: 'medium', brightness: 'high', tone: 'cool' },
        { code: 'SW0418', name_en: 'Soft Quartz', name_vi: 'Thạch anh mềm', hex: '#D9DFE3', shade: 'medium', brightness: 'mid', tone: 'cool' },
        { code: 'SW0419', name_en: 'Rose Chalk', name_vi: 'Phấn hồng phấn', hex: '#FDF8F7', shade: 'light', brightness: 'high', tone: 'warm' },
        { code: 'SW0420', name_en: 'Powder White', name_vi: 'Trắng bột mịn', hex: '#FAF3F1', shade: 'light', brightness: 'high', tone: 'warm' },
        { code: 'SW0421', name_en: 'Blush Milk', name_vi: 'Sữa phớt hồng', hex: '#F5ECE9', shade: 'light', brightness: 'high', tone: 'warm' },
        { code: 'SW0422', name_en: 'Pale Biscuit', name_vi: 'Bánh nướng nhạt', hex: '#EFE4E0', shade: 'medium', brightness: 'high', tone: 'warm' },
        { code: 'SW0423', name_en: 'Dusty Ivory', name_vi: 'Ngà voi khói', hex: '#E8DBD6', shade: 'medium', brightness: 'mid', tone: 'warm' },
        { code: 'SW0424', name_en: 'Faded Linen', name_vi: 'Vải lanh phai', hex: '#DFCEC8', shade: 'medium', brightness: 'mid', tone: 'warm' }
      ]
    }
  ];

  // Flatten all colors
  const ALL_COLORS = [];
  COLLECTIONS.forEach(col => {
    col.colors.forEach(c => {
      ALL_COLORS.push({ ...c, collection_id: col.id, collection_name: col.name });
    });
  });

  // --- 2. STATE MANAGEMENT ---
  const state = {
    selectedColor: ALL_COLORS.find(c => c.code === 'WN0824') || ALL_COLORS[0],
    activeCollection: 'warm-neutral',
    activeShade: 'all',
    activeBrightness: 'all',
    activeTone: 'all',
    searchQuery: '',
    viewMode: 'grid', // 'grid' | 'compact'
    favorites: new Set()
  };

  // --- 3. UTILITIES ---
  function removeVietnameseTones(str) {
    if (!str) return '';
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase();
  }

  function getLuminance(hex) {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const r = parseInt(c.substr(0, 2), 16);
    const g = parseInt(c.substr(2, 2), 16);
    const b = parseInt(c.substr(4, 2), 16);
    return 0.299 * r + 0.587 * g + 0.114 * b;
  }

  function showToast(message) {
    const toast = document.getElementById('studio-toast');
    const msgEl = document.getElementById('studio-toast-msg');
    if (!toast || !msgEl) return;
    msgEl.textContent = message;
    toast.classList.add('show');
    
    if (window._toastTimer) clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }

  // --- 4. RENDERERS ---

  // A. Render Left Collection Pills
  function renderCollectionPills() {
    const container = document.getElementById('collection-pills');
    if (!container) return;

    container.innerHTML = COLLECTIONS.map(col => {
      const isActive = state.activeCollection === col.id && !state.searchQuery;
      return `
        <button type="button" data-collection-id="${col.id}"
          class="col-pill-btn ${isActive ? 'active' : ''}">
          <span class="truncate">${col.name}</span>
          ${isActive 
            ? `<svg width="15" height="15" style="color:#FFFFFF;" class="shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path></svg>` 
            : `<span class="col-pill-count shrink-0">${col.colors.length}</span>`
          }
        </button>
      `;
    }).join('');

    // Attach click handlers
    container.querySelectorAll('.col-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const colId = btn.getAttribute('data-collection-id');
        state.activeCollection = colId;
        state.searchQuery = '';
        const searchInput = document.getElementById('color-search-input');
        if (searchInput) searchInput.value = '';
        const clearBtn = document.getElementById('color-search-clear');
        if (clearBtn) clearBtn.classList.add('hidden');
        
        // Sync toolbar dropdown
        const toolbarSelect = document.getElementById('toolbar-collection-select');
        if (toolbarSelect) toolbarSelect.value = colId;

        renderCollectionPills();
        renderSwatchGrid();
      });
    });
  }

  // B. Render Color Swatch Grid
  function renderSwatchGrid() {
    const gridEl = document.getElementById('swatch-grid');
    const emptyEl = document.getElementById('swatch-empty');
    const countBadge = document.getElementById('color-count-badge');
    if (!gridEl) return;

    // Filter colors based on state
    let filtered = ALL_COLORS;

    if (state.searchQuery) {
      const q = removeVietnameseTones(state.searchQuery.trim());
      filtered = filtered.filter(c => {
        return removeVietnameseTones(c.code).includes(q) ||
               removeVietnameseTones(c.name_en).includes(q) ||
               removeVietnameseTones(c.name_vi).includes(q) ||
               c.hex.toLowerCase().includes(q);
      });
    } else {
      // Filter by collection
      filtered = filtered.filter(c => c.collection_id === state.activeCollection);
    }

    // Filter by shade
    if (state.activeShade !== 'all') {
      filtered = filtered.filter(c => c.shade === state.activeShade);
    }

    // Filter by brightness
    if (state.activeBrightness !== 'all') {
      filtered = filtered.filter(c => c.brightness === state.activeBrightness);
    }

    // Filter by tone
    if (state.activeTone !== 'all') {
      filtered = filtered.filter(c => c.tone === state.activeTone);
    }

    // Update count badge
    if (countBadge) {
      countBadge.textContent = `${filtered.length} màu`;
    }

    if (filtered.length === 0) {
      gridEl.innerHTML = '';
      if (emptyEl) emptyEl.classList.remove('hidden');
      return;
    } else {
      if (emptyEl) emptyEl.classList.add('hidden');
    }

    // Determine grid classes based on viewMode
    const isCompact = state.viewMode === 'compact';
    gridEl.className = isCompact ? 'color-swatch-grid compact-mode' : 'color-swatch-grid';

    gridEl.innerHTML = filtered.map(c => {
      const isSelected = state.selectedColor && state.selectedColor.code === c.code;

      return `
        <div data-color-code="${c.code}" class="swatch-card ${isSelected ? 'active' : ''}">
          <!-- Color Swatch Rectangle -->
          <div class="swatch-color-box" style="background-color: ${c.hex};">
            <!-- Active Checkmark Circle (Top Right) -->
            ${isSelected ? `
              <div class="swatch-active-badge">
                <svg width="10" height="10" class="stroke-current" fill="none" stroke-width="3" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            ` : ''}
          </div>

          <!-- Color Label Below -->
          <div class="swatch-label-wrap">
            <div class="swatch-code">${c.code}</div>
            <div class="swatch-name">${c.name_en}</div>
          </div>
        </div>
      `;
    }).join('');

    // Attach click events
    gridEl.querySelectorAll('.swatch-card').forEach(card => {
      card.addEventListener('click', () => {
        const code = card.getAttribute('data-color-code');
        const colorObj = ALL_COLORS.find(c => c.code === code);
        if (colorObj) {
          selectColor(colorObj);
        }
      });
    });
  }

  // C. Select Color & Sync Active Banner + Grid
  function selectColor(colorObj) {
    state.selectedColor = colorObj;

    // 1. Update Active Preview Banner (Top of Studio)
    updateActiveBanner();

    // 2. Re-render swatch grid active highlight
    renderSwatchGrid();
  }

  // D. Update Active Preview Banner (Code, Name, HEX, Contrast, Favorite)
  function updateActiveBanner() {
    const banner = document.getElementById('active-color-banner');
    const codeEl = document.getElementById('active-banner-code');
    const nameEl = document.getElementById('active-banner-name');
    const hexEl = document.getElementById('active-banner-hex');
    const tagEl = document.getElementById('active-banner-tag');
    const favBtn = document.getElementById('btn-fav-color');
    const iconHeart = document.getElementById('icon-heart');
    const copyBtn = document.getElementById('btn-copy-color');
    if (!banner || !state.selectedColor) return;

    const hex = state.selectedColor.hex;
    banner.style.backgroundColor = hex;

    if (codeEl) codeEl.textContent = state.selectedColor.code;
    if (nameEl) nameEl.textContent = state.selectedColor.name_en;
    if (hexEl) hexEl.textContent = hex.toUpperCase();

    // Auto-adjust text contrast based on color brightness
    const lum = getLuminance(hex);
    const isLight = lum > 155;
    const textColor = isLight ? '#1F2937' : '#FFFFFF';
    const subColor = isLight ? 'rgba(31, 41, 55, 0.78)' : 'rgba(255, 255, 255, 0.88)';
    const btnBg = isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.25)';
    const hexBg = isLight ? 'rgba(0, 0, 0, 0.07)' : 'rgba(255, 255, 255, 0.2)';

    if (codeEl) codeEl.style.color = textColor;
    if (nameEl) nameEl.style.color = subColor;
    if (tagEl) tagEl.style.color = subColor;
    if (hexEl) {
      hexEl.style.backgroundColor = hexBg;
      hexEl.style.color = textColor;
    }

    if (favBtn) {
      favBtn.style.backgroundColor = btnBg;
      favBtn.style.color = textColor;
    }
    if (iconHeart) {
      const isFav = state.favorites.has(state.selectedColor.code);
      if (isFav) {
        iconHeart.setAttribute('fill', '#EF4444');
        iconHeart.setAttribute('stroke', '#EF4444');
      } else {
        iconHeart.setAttribute('fill', 'none');
        iconHeart.setAttribute('stroke', 'currentColor');
      }
    }
    if (copyBtn) {
      copyBtn.style.backgroundColor = btnBg;
      copyBtn.style.color = textColor;
    }
  }

  // --- 5. GLOBAL PRESET PALETTE FUNCTION (Called by bottom cards) ---
  const PRESET_COLLECTIONS_MAP = {
    'Nền ấm thư giãn': 'WN0809',
    'Hồng đất hiện đại': 'WN0824',
    'Xanh cỏ thơm thanh lịch': 'SG0203',
    'Xanh hiện đại cân bằng': 'MB0301'
  };

  window.applyPresetPalette = function (hexArray, title) {
    const targetCode = PRESET_COLLECTIONS_MAP[title];
    let match = targetCode ? ALL_COLORS.find(c => c.code === targetCode) : null;
    if (!match && Array.isArray(hexArray) && hexArray.length > 0) {
      match = ALL_COLORS.find(c => c.hex.toLowerCase() === hexArray[0].toLowerCase()) || ALL_COLORS[0];
    }

    if (match) {
      // Switch to its collection & clear search/filters so swatch is visible in grid
      state.activeCollection = match.collection_id;
      state.activeShade = 'all';
      state.activeBrightness = 'all';
      state.activeTone = 'all';
      state.searchQuery = '';

      const searchInput = document.getElementById('color-search-input');
      if (searchInput) searchInput.value = '';
      const clearBtn = document.getElementById('color-search-clear');
      if (clearBtn) clearBtn.classList.add('hidden');
      const tbCol = document.getElementById('toolbar-collection-select');
      if (tbCol) tbCol.value = match.collection_id;
      const tbShade = document.getElementById('toolbar-shade-select');
      if (tbShade) tbShade.value = 'all';
      const filterShade = document.getElementById('filter-shade');
      if (filterShade) filterShade.value = 'all';
      const filterBright = document.getElementById('filter-brightness');
      if (filterBright) filterBright.value = 'all';
      const filterTone = document.getElementById('filter-tone');
      if (filterTone) filterTone.value = 'all';

      renderCollectionPills();
      selectColor(match);
      showToast(`Đã chọn màu chủ đạo "${match.code} — ${match.name_en}" (${title})`);
    }

    const studioEl = document.getElementById('color-studio-app');
    if (studioEl) {
      studioEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // --- 6. EVENT BINDINGS & INITIALIZATION ---
  document.addEventListener('DOMContentLoaded', () => {
    // 1. Search with debounce
    const searchInput = document.getElementById('color-search-input');
    const searchClear = document.getElementById('color-search-clear');
    let searchDebounce = null;

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        clearTimeout(searchDebounce);
        const val = e.target.value;
        if (searchClear) {
          if (val) searchClear.classList.remove('hidden');
          else searchClear.classList.add('hidden');
        }
        searchDebounce = setTimeout(() => {
          state.searchQuery = val;
          renderSwatchGrid();
        }, 200);
      });
    }

    if (searchClear) {
      searchClear.addEventListener('click', () => {
        if (searchInput) {
          searchInput.value = '';
          searchInput.focus();
        }
        searchClear.classList.add('hidden');
        state.searchQuery = '';
        renderSwatchGrid();
      });
    }

    // 2. Toolbar Dropdowns
    const tbCol = document.getElementById('toolbar-collection-select');
    if (tbCol) {
      tbCol.addEventListener('change', (e) => {
        state.activeCollection = e.target.value;
        state.searchQuery = '';
        if (searchInput) searchInput.value = '';
        if (searchClear) searchClear.classList.add('hidden');
        renderCollectionPills();
        renderSwatchGrid();
      });
    }

    const tbShade = document.getElementById('toolbar-shade-select');
    const filterShade = document.getElementById('filter-shade');
    function syncShade(val) {
      state.activeShade = val;
      if (tbShade) tbShade.value = val;
      if (filterShade) filterShade.value = val;
      renderSwatchGrid();
    }
    if (tbShade) tbShade.addEventListener('change', (e) => syncShade(e.target.value));
    if (filterShade) filterShade.addEventListener('change', (e) => syncShade(e.target.value));

    // 3. Brightness & Tone filters
    const filterBright = document.getElementById('filter-brightness');
    if (filterBright) {
      filterBright.addEventListener('change', (e) => {
        state.activeBrightness = e.target.value;
        renderSwatchGrid();
      });
    }

    const filterTone = document.getElementById('filter-tone');
    if (filterTone) {
      filterTone.addEventListener('change', (e) => {
        state.activeTone = e.target.value;
        renderSwatchGrid();
      });
    }

    // 4. Reset Filters Button
    const btnReset = document.getElementById('btn-reset-filters');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        state.activeCollection = 'warm-neutral';
        state.activeShade = 'all';
        state.activeBrightness = 'all';
        state.activeTone = 'all';
        state.searchQuery = '';

        if (searchInput) searchInput.value = '';
        if (searchClear) searchClear.classList.add('hidden');
        if (tbCol) tbCol.value = 'warm-neutral';
        if (tbShade) tbShade.value = 'all';
        if (filterShade) filterShade.value = 'all';
        if (filterBright) filterBright.value = 'all';
        if (filterTone) filterTone.value = 'all';

        renderCollectionPills();
        renderSwatchGrid();
        showToast('Đã xóa các bộ lọc');
      });
    }

    // 5. Grid View vs Compact View
    const btnGrid = document.getElementById('btn-view-grid');
    const btnCompact = document.getElementById('btn-view-compact');
    if (btnGrid && btnCompact) {
      btnGrid.addEventListener('click', () => {
        state.viewMode = 'grid';
        btnGrid.classList.add('active');
        btnCompact.classList.remove('active');
        renderSwatchGrid();
      });

      btnCompact.addEventListener('click', () => {
        state.viewMode = 'compact';
        btnCompact.classList.add('active');
        btnGrid.classList.remove('active');
        renderSwatchGrid();
      });
    }

    // 6. Copy Color Code
    const btnCopy = document.getElementById('btn-copy-color');
    if (btnCopy) {
      btnCopy.addEventListener('click', () => {
        if (!state.selectedColor) return;
        const textToCopy = `${state.selectedColor.code} ${state.selectedColor.name_en} (${state.selectedColor.hex})`;
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Đã sao chép: ${state.selectedColor.code} (${state.selectedColor.hex})`);
        }).catch(() => {
          showToast(`Mã màu: ${state.selectedColor.code}`);
        });
      });
    }

    // 7. Favorite Toggle (Independent of removed sidebar)
    const btnFav = document.getElementById('btn-fav-color');
    if (btnFav) {
      btnFav.addEventListener('click', () => {
        if (!state.selectedColor) return;
        const code = state.selectedColor.code;
        if (state.favorites.has(code)) {
          state.favorites.delete(code);
          showToast(`Đã xóa ${code} khỏi mục yêu thích`);
        } else {
          state.favorites.add(code);
          showToast(`Đã lưu ${code} vào mục yêu thích`);
        }
        updateActiveBanner();
      });
    }

    // --- INITIAL RENDER ---
    renderCollectionPills();
    renderSwatchGrid();
    updateActiveBanner();
  });

})();
