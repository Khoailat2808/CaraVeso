/* ============================================================
   CARAVESO — MOCK DATA (data.js)
   Toàn bộ dữ liệu giả của website được hard-code tại đây.
   KHÔNG có API, KHÔNG có database.
   ============================================================ */

/* ---------- Danh sách sản phẩm ---------- */
const PRODUCTS = [
  {
    id: 1,
    name: 'Nệm Kymdan Long Thành',
    shortName: 'Nệm Kymdan',
    desc: 'Êm ái, thoải mái, Công thái học, 1.8x2m',
    price: 18500000,
    oldPrice: 20000000,
    category: 'nem',
    room: 'phong-ngu',
    img: 'https://picsum.photos/seed/caraveso-nem1/500/500',
    colors: ['#e8e2d5', '#0b3056', '#8a8a8a'],
    sku: 'NEM-KMD-001',
    stock: 50,
    isNew: true,
    isSale: true
  },
  {
    id: 2,
    name: 'Ghế Sofa Milano Shape U',
    shortName: 'Sofa Milano',
    desc: 'Êm ái, thoải mái, bọc da, 100×180×120cm',
    price: 10000000,
    oldPrice: 12500000,
    category: 'sofa',
    room: 'phong-khach',
    img: 'https://picsum.photos/seed/caraveso-sofa1/500/500',
    colors: ['#efe9dd', '#f3c7cf', '#0b3056', '#e08b4e'],
    sku: 'SF-MLN-001',
    stock: 50,
    isNew: true,
    isSale: true
  },
  {
    id: 3,
    name: 'Ghế Sofa CaraVeso Vintage',
    shortName: 'Sofa Vintage',
    desc: 'Êm ái, thoải mái, bọc da, 100×180×120cm',
    price: 18500000,
    oldPrice: null,
    category: 'sofa',
    room: 'phong-khach',
    img: 'https://picsum.photos/seed/caraveso-sofa2/500/500',
    colors: ['#3b3b3b', '#175e3b'],
    sku: 'SF-VTG-002',
    stock: 32,
    isNew: true,
    isSale: false
  },
  {
    id: 4,
    name: 'Bàn Trà Đá Marble Tròn',
    shortName: 'Bàn trà Marble',
    desc: 'Đá cẩm thạch tự nhiên, chân gỗ sồi, D80cm',
    price: 7200000,
    oldPrice: 8500000,
    category: 'ban',
    room: 'phong-khach',
    img: 'https://picsum.photos/seed/caraveso-ban1/500/500',
    colors: ['#f5f5f0', '#2b2b2b'],
    sku: 'BT-MRB-003',
    stock: 18,
    isNew: false,
    isSale: true
  },
  {
    id: 5,
    name: 'Tủ Quần Áo Oak Wood 4 Cánh',
    shortName: 'Tủ Oak Wood',
    desc: 'Gỗ sồi tự nhiên, ray giảm chấn, 200×240cm',
    price: 24900000,
    oldPrice: null,
    category: 'tu',
    room: 'phong-ngu',
    img: 'https://picsum.photos/seed/caraveso-tu1/500/500',
    colors: ['#b58e5a', '#e8e2d5'],
    sku: 'TU-OAK-004',
    stock: 12,
    isNew: true,
    isSale: false
  },
  {
    id: 6,
    name: 'Đèn Sàn Nordic Linen',
    shortName: 'Đèn sàn Nordic',
    desc: 'Chụp vải linen, thân thép sơn tĩnh điện, H160cm',
    price: 2350000,
    oldPrice: 2900000,
    category: 'den',
    room: 'phong-khach',
    img: 'https://picsum.photos/seed/caraveso-den1/500/500',
    colors: ['#efe9dd', '#2b2b2b'],
    sku: 'DEN-NRD-005',
    stock: 45,
    isNew: false,
    isSale: true
  },
  {
    id: 7,
    name: 'Ghế Sofa Góc L-Shape Boucle',
    shortName: 'Sofa góc L',
    desc: 'Êm ái, thoải mái, bọc da, 100×180×120cm',
    price: 18500000,
    oldPrice: 21000000,
    category: 'sofa',
    room: 'phong-khach',
    img: 'https://picsum.photos/seed/caraveso-sofa3/500/500',
    colors: ['#efe9dd', '#8a8a8a', '#0b3056'],
    sku: 'SF-LSP-006',
    stock: 27,
    isNew: true,
    isSale: true
  },
  {
    id: 8,
    name: 'Bàn Ăn Gỗ Óc Chó 6 Ghế',
    shortName: 'Bàn ăn Óc Chó',
    desc: 'Gỗ óc chó nhập khẩu, mặt bàn 1.8m, 6 ghế nệm',
    price: 32000000,
    oldPrice: null,
    category: 'ban',
    room: 'phong-an',
    img: 'https://picsum.photos/seed/caraveso-ban2/500/500',
    colors: ['#6b4a2e'],
    sku: 'BA-OCC-007',
    stock: 8,
    isNew: true,
    isSale: false
  },
  {
    id: 9,
    name: 'Kệ Tivi Treo Tường Smoke',
    shortName: 'Kệ Tivi Smoke',
    desc: 'MDF phủ melamine chống ẩm, 240×45cm',
    price: 5600000,
    oldPrice: 6400000,
    category: 'ke',
    room: 'phong-khach',
    img: 'https://picsum.photos/seed/caraveso-ke1/500/500',
    colors: ['#2b2b2b', '#b58e5a'],
    sku: 'KE-SMK-008',
    stock: 21,
    isNew: false,
    isSale: true
  },
  {
    id: 10,
    name: 'Ghế Sofa Văng Nỉ Cloud',
    shortName: 'Sofa văng Cloud',
    desc: 'Êm ái, thoải mái, bọc da, 100×180×120cm',
    price: 14200000,
    oldPrice: null,
    category: 'sofa',
    room: 'phong-khach',
    img: 'https://picsum.photos/seed/caraveso-sofa4/500/500',
    colors: ['#e8e2d5', '#175e3b', '#0b3056'],
    sku: 'SF-CLD-009',
    stock: 36,
    isNew: true,
    isSale: false
  },
  {
    id: 11,
    name: 'Gương Đứng Viền Kim Loại Arc',
    shortName: 'Gương Arc',
    desc: 'Viền thép mạ vàng đồng, 60×170cm',
    price: 3100000,
    oldPrice: 3800000,
    category: 'trang-tri',
    room: 'phong-ngu',
    img: 'https://picsum.photos/seed/caraveso-guong1/500/500',
    colors: ['#c9a24b'],
    sku: 'TT-ARC-010',
    stock: 29,
    isNew: false,
    isSale: true
  },
  {
    id: 12,
    name: 'Bộ Chăn Ga Gối Cotton Sateen',
    shortName: 'Chăn ga Sateen',
    desc: 'Cotton Sateen 600 sợi, mềm mịn, 1.8×2m',
    price: 1850000,
    oldPrice: 2200000,
    category: 'nem',
    room: 'phong-ngu',
    img: 'https://picsum.photos/seed/caraveso-changa/500/500',
    colors: ['#efe9dd', '#f3c7cf', '#8a8a8a'],
    sku: 'CG-STN-011',
    stock: 64,
    isNew: true,
    isSale: true
  },
  {
    id: 13,
    name: 'Ghế Sofa Đơn Armchair Teddy',
    shortName: 'Armchair Teddy',
    desc: 'Êm ái, thoải mái, bọc da, 100×180×120cm',
    price: 6900000,
    oldPrice: null,
    category: 'sofa',
    room: 'phong-khach',
    img: 'https://picsum.photos/seed/caraveso-sofa5/500/500',
    colors: ['#efe9dd', '#e08b4e'],
    sku: 'SF-TDY-012',
    stock: 40,
    isNew: false,
    isSale: false
  },
  {
    id: 14,
    name: 'Tủ Giày Thông Minh Slim',
    shortName: 'Tủ giày Slim',
    desc: 'Cánh lật 3 tầng, gỗ MDF An Cường, 120×17×102cm',
    price: 4300000,
    oldPrice: 4900000,
    category: 'tu',
    room: 'phong-khach',
    img: 'https://picsum.photos/seed/caraveso-tu2/500/500',
    colors: ['#e8e2d5', '#2b2b2b'],
    sku: 'TU-SLM-013',
    stock: 33,
    isNew: false,
    isSale: true
  },
  {
    id: 15,
    name: 'Đèn Thả Trần Rattan Bali',
    shortName: 'Đèn thả Rattan',
    desc: 'Mây tự nhiên đan tay, D45cm, đui E27',
    price: 1650000,
    oldPrice: null,
    category: 'den',
    room: 'phong-an',
    img: 'https://picsum.photos/seed/caraveso-den2/500/500',
    colors: ['#b58e5a'],
    sku: 'DEN-RTN-014',
    stock: 52,
    isNew: true,
    isSale: false
  },
  {
    id: 16,
    name: 'Ghế Sofa Chữ U Emerald',
    shortName: 'Sofa chữ U',
    desc: 'Êm ái, thoải mái, bọc da, 100×180×120cm',
    price: 28500000,
    oldPrice: 31000000,
    category: 'sofa',
    room: 'phong-khach',
    img: 'https://picsum.photos/seed/caraveso-sofa6/500/500',
    colors: ['#175e3b', '#0b3056', '#3b3b3b'],
    sku: 'SF-EMR-015',
    stock: 9,
    isNew: false,
    isSale: true
  }
];

/* ---------- Bộ sưu tập (CaraVeso Collections) ---------- */
const COLLECTIONS = [
  {
    id: 'oda',
    name: 'ODA',
    tagline: 'Đa dạng lựa chọn, vẻ đẹp sang trọng',
    img: 'https://picsum.photos/seed/caraveso-col1/1280/603'
  },
  {
    id: 'nordic',
    name: 'NORDIC LIVING',
    tagline: 'Tối giản Bắc Âu, ấm áp từng góc nhỏ',
    img: 'https://picsum.photos/seed/caraveso-col2/1280/603'
  },
  {
    id: 'indochine',
    name: 'INDOCHINE',
    tagline: 'Hoài niệm Đông Dương, tinh tế vượt thời gian',
    img: 'https://picsum.photos/seed/caraveso-col3/1280/603'
  }
];

/* ---------- Banner hero (Trang chủ) ---------- */
const HERO_SLIDES = [
  {
    img: 'https://picsum.photos/seed/caraveso-hero1/1440/652',
    title: 'Không gian sống chuẩn mực',
    sub: 'Nội thất cao cấp cho ngôi nhà Việt'
  },
  {
    img: 'https://picsum.photos/seed/caraveso-hero2/1440/652',
    title: 'Bộ sưu tập ODA 2026',
    sub: 'Đa dạng lựa chọn, vẻ đẹp sang trọng'
  },
  {
    img: 'https://picsum.photos/seed/caraveso-hero3/1440/652',
    title: 'Ưu đãi mùa hè lên đến 30%',
    sub: 'Áp dụng cho toàn bộ dòng sofa nhập khẩu'
  }
];

/* ---------- Nguồn cảm hứng (gallery cuối trang chủ) ---------- */
const INSPIRATIONS = [
  { img: 'https://picsum.photos/seed/caraveso-insp1/630/630', wide: true },
  { img: 'https://picsum.photos/seed/caraveso-insp2/411/630', wide: false },
  { img: 'https://picsum.photos/seed/caraveso-insp3/630/630', wide: true },
  { img: 'https://picsum.photos/seed/caraveso-insp4/411/630', wide: false },
  { img: 'https://picsum.photos/seed/caraveso-insp5/630/630', wide: true }
];

/* ---------- Đánh giá sản phẩm (trang chi tiết) ---------- */
const REVIEWS = [
  {
    name: 'Hoàng Huy Tiến',
    stars: 4,
    date: '26/06/2026 11:43',
    variant: 'Sofa 2 chỗ, Trắng kem',
    comment: 'Màu đẹp, nhìn rất cưng phù hợp decor phòng, thiết kế độc đáo',
    images: 4
  },
  {
    name: 'Trần Ngọc Minh Anh',
    stars: 5,
    date: '18/06/2026 09:12',
    variant: 'Sofa 3 chỗ, Xanh navy',
    comment: 'Giao hàng nhanh, đóng gói kỹ. Ngồi rất êm, vải boucle sờ thích tay. Sẽ ủng hộ shop tiếp!',
    images: 3
  },
  {
    name: 'Lê Quốc Bảo',
    stars: 4,
    date: '02/06/2026 20:37',
    variant: 'Sofa 2 chỗ, Cam đất',
    comment: 'Sofa đẹp đúng hình, lắp đặt tận nơi chuyên nghiệp. Trừ 1 sao vì giao trễ 1 ngày.',
    images: 2
  }
];

/* ---------- Giỏ hàng khởi tạo (mô phỏng) ---------- */
const INITIAL_CART = [
  { productId: 1, qty: 1, checked: true },
  { productId: 2, qty: 1, checked: true },
  { productId: 7, qty: 1, checked: false }
];

/* ---------- Mã giảm giá hợp lệ (mô phỏng) ---------- */
const VOUCHERS = {
  CARAVESO100: { type: 'fixed', value: 100000, label: 'Giảm 100.000 VNĐ' },
  SALE10: { type: 'percent', value: 10, label: 'Giảm 10% đơn hàng' },
  FREESHIP: { type: 'fixed', value: 0, label: 'Miễn phí giao hàng' }
};

/* ---------- Menu điều hướng ---------- */
const NAV_ITEMS = [
  { label: 'Sản phẩm', href: 'products.html', dropdown: ['Ghế sofa', 'Bàn', 'Tủ - Kệ', 'Nệm - Chăn ga', 'Đèn trang trí'] },
  { label: 'Các phòng', href: 'products.html', dropdown: ['Phòng khách', 'Phòng ngủ', 'Phòng ăn', 'Phòng làm việc'] },
  { label: 'Khuyến mãi', href: 'promo.html', dropdown: ['Khuyến mãi hôm nay', 'Voucher của tôi'] },
  { label: 'Hỗ trợ/ Bảo hành', href: '#', dropdown: null }
];

/* ---------- Địa giới hành chính (mô phỏng cho form thanh toán) ---------- */
const LOCATIONS = [
  {
    name: 'TP. Hồ Chí Minh',
    districts: [
      { name: 'Quận 7', wards: ['Phường Tân Phú', 'Phường Tân Phong', 'Phường Phú Mỹ'] },
      { name: 'Quận 1', wards: ['Phường Bến Nghé', 'Phường Bến Thành', 'Phường Đa Kao'] },
      { name: 'TP. Thủ Đức', wards: ['Phường Thảo Điền', 'Phường An Phú', 'Phường Hiệp Bình Chánh'] }
    ]
  },
  {
    name: 'Hà Nội',
    districts: [
      { name: 'Quận Hoàn Kiếm', wards: ['Phường Hàng Trống', 'Phường Tràng Tiền', 'Phường Cửa Đông'] },
      { name: 'Quận Cầu Giấy', wards: ['Phường Dịch Vọng', 'Phường Nghĩa Đô', 'Phường Yên Hòa'] }
    ]
  },
  {
    name: 'Đà Nẵng',
    districts: [
      { name: 'Quận Hải Châu', wards: ['Phường Thạch Thang', 'Phường Hải Châu 1'] },
      { name: 'Quận Sơn Trà', wards: ['Phường An Hải Bắc', 'Phường Mân Thái'] }
    ]
  }
];

/* ---------- Liên kết footer ---------- */
const FOOTER_LINKS = {
  thongTin: [
    'Câu hỏi thường gặp', 'Hướng dẫn mua hàng', 'Chính sách giao hàng',
    'Chính sách đổi trả', 'Chính sách bảo hành', 'Phương thức thanh toán',
    'Điều khoản sử dụng', 'Chính sách bảo mật', 'Chính sách thành viên'
  ],
  caraveso: ['Về chúng tôi', 'Liên hệ', 'Hệ thống showroom', 'Blog & Cảm hứng sống', 'Tuyển dụng']
};
