const ADMIN_DATA = {
  revenueSeries: {
    today: [12, 18, 16, 24, 28, 35, 42, 48],
    '7days': [110, 135, 128, 164, 190, 175, 220],
    '30days': [80, 92, 120, 108, 145, 160, 155, 180, 210, 198, 230, 260],
    '12months': [120, 145, 150, 170, 190, 220, 260, 240, 280, 310, 330, 360]
  },
  reviews: [
    {
      customer: 'Trương Võ Kỳ',
      product: 'Ghế sofa Milano Shape U',
      date: '30/06/2026  11:43',
      category: 'Sofa 2 chỗ, Trắng kem',
      content: 'Mẫu đẹp, nhìn rất cưng phù hợp decor phòng, thiết kế độc đáo'
    },
    {
      customer: 'Trương Võ Kỳ',
      product: 'Ghế sofa Milano Shape U',
      date: '30/06/2026  11:43',
      category: 'Sofa 2 chỗ, Trắng kem',
      content: 'Mẫu đẹp, nhìn rất cưng phù hợp decor phòng, thiết kế độc đáo'
    }
  ],
  bestSellers: [
    { name: 'Ghế sofa milano sharpe U', type: '2 chỗ ngồi, trắng kem', sold: 35, revenue: 35000000 },
    { name: 'Ghế sofa milano sharpe U', type: '2 chỗ ngồi, trắng kem', sold: 35, revenue: 35000000 },
    { name: 'Ghế sofa milano sharpe U', type: '2 chỗ ngồi, trắng kem', sold: 35, revenue: 35000000 },
    { name: 'Bàn ăn Signature Walnut', type: 'Gỗ óc chó, 6 ghế', sold: 28, revenue: 14100000 },
    { name: 'Nệm Kymdan Long Thành', type: '1.8 x 2m, trắng kem', sold: 22, revenue: 18500000 },
    { name: 'Tủ quần áo Oak Wood', type: '4 cánh, gỗ sồi', sold: 18, revenue: 24900000 }
  ],
  adminProductsTotal: 523,
  adminProducts: [
    { id: 'SP001', name: 'Ghế Sofa Milano shape U', sku: 'HHT080906', stock: 35, category: 'sofa', room: 'phong-khach' },
    { id: 'SP002', name: 'Ghế Sofa Milano shape U', sku: 'HHT080906', stock: 0, category: 'sofa', room: 'phong-khach' },
    { id: 'SP003', name: 'Ghế Sofa Milano shape U', sku: 'HHT080906', stock: 6, category: 'sofa', room: 'phong-khach' },
    { id: 'SP004', name: 'Ghế Sofa Milano shape U', sku: 'HHT080906', stock: 35, category: 'sofa', room: 'phong-khach' },
    { id: 'SP005', name: 'Ghế Sofa Milano shape U', sku: 'HHT080906', stock: 7, category: 'sofa', room: 'phong-khach' },
    { id: 'SP006', name: 'Bàn ăn Signature Walnut', sku: 'BA-M04-021', stock: 3, category: 'ban', room: 'phong-bep' },
    { id: 'SP007', name: 'Tủ quần áo Oak Wood', sku: 'TU-OAK-004', stock: 0, category: 'tu', room: 'phong-ngu' },
    { id: 'SP008', name: 'Đèn bàn Aurora', sku: 'DEN-AU-033', stock: 12, category: 'den', room: 'phong-ngu' },
    { id: 'SP009', name: 'Ghế Sofa Milano shape U', sku: 'HHT080906', stock: 4, category: 'sofa', room: 'phong-khach' },
    { id: 'SP010', name: 'Ghế Sofa Milano shape U', sku: 'HHT080906', stock: 0, category: 'sofa', room: 'phong-khach' },
    { id: 'SP011', name: 'Ghế Sofa Milano shape U', sku: 'HHT080906', stock: 10, category: 'sofa', room: 'phong-khach' }
  ],
  categories: [
    { id: 'rooms', name: 'Các phòng', level: 0, parentId: null, quantity: 0 },
    { id: 'work-room', name: 'Phòng làm việc', level: 1, parentId: 'rooms', quantity: 200 },
    { id: 'desk', name: 'Bàn làm việc', level: 2, parentId: 'work-room', quantity: 30 },
    { id: 'office-chair', name: 'Ghế văn phòng', level: 2, parentId: 'work-room', quantity: 40 },
    { id: 'filing-cabinet', name: 'Tủ hồ sơ', level: 2, parentId: 'work-room', quantity: 40 },
    { id: 'bookshelf-room', name: 'Kệ sách', level: 2, parentId: 'work-room', quantity: 30 },
    { id: 'computer-desk', name: 'Bàn máy tính', level: 2, parentId: 'work-room', quantity: 30 },
    { id: 'living-room', name: 'Phòng khách', level: 1, parentId: 'rooms', quantity: 200 },
    { id: 'dining-room', name: 'Phòng ăn', level: 1, parentId: 'rooms', quantity: 200 },
    { id: 'bedroom', name: 'Phòng ngủ', level: 1, parentId: 'rooms', quantity: 200 },
    { id: 'kitchen', name: 'Phòng bếp', level: 1, parentId: 'rooms', quantity: 200 },
    { id: 'bathroom', name: 'Phòng tắm', level: 1, parentId: 'rooms', quantity: 200 },
    { id: 'outdoor', name: 'Ngoài trời', level: 1, parentId: 'rooms', quantity: 120 },
    { id: 'kids-room', name: 'Nội thất cho trẻ', level: 1, parentId: 'rooms', quantity: 90 },
    { id: 'products-root', name: 'Sản phẩm', level: 0, parentId: null, quantity: 0 },
    { id: 'chairs', name: 'Ghế', level: 1, parentId: 'products-root', quantity: 180 },
    { id: 'sofa-chair', name: 'Ghế Sofa', level: 2, parentId: 'chairs', quantity: 35 },
    { id: 'armchair', name: 'Ghế bành', level: 2, parentId: 'chairs', quantity: 25 },
    { id: 'dining-chair', name: 'Ghế ăn', level: 2, parentId: 'chairs', quantity: 40 },
    { id: 'office-chair-product', name: 'Ghế văn phòng', level: 2, parentId: 'chairs', quantity: 40 },
    { id: 'lazy-chair', name: 'Ghế lười', level: 2, parentId: 'chairs', quantity: 40 },
    { id: 'tables', name: 'Bàn', level: 1, parentId: 'products-root', quantity: 140 },
    { id: 'beds', name: 'Giường', level: 1, parentId: 'products-root', quantity: 130 },
    { id: 'wardrobes', name: 'Tủ', level: 1, parentId: 'products-root', quantity: 110 },
    { id: 'shelves', name: 'Kệ', level: 1, parentId: 'products-root', quantity: 105 },
    { id: 'bedding', name: 'Đệm và chăn ga', level: 1, parentId: 'products-root', quantity: 95 },
    { id: 'rugs', name: 'Thảm', level: 1, parentId: 'products-root', quantity: 82 },
    { id: 'lights', name: 'Đèn', level: 1, parentId: 'products-root', quantity: 77 },
    { id: 'curtains', name: 'Rèm cửa', level: 1, parentId: 'products-root', quantity: 66 }
  ],
  contentHome: {
    banner: [
      { id: 'BN01', order: 1, createdAt: '09/07/2026', image: 'Image/z8037729213517_6b733c4e3d23a5216813f493449279ae.jpg' },
      { id: 'BN02', order: 2, createdAt: '09/07/2026', image: 'Image/z8037729213517_6b733c4e3d23a5216813f493449279ae.jpg' },
      { id: 'BN03', order: 3, createdAt: '09/07/2026', image: 'Image/z8037729213517_6b733c4e3d23a5216813f493449279ae.jpg' }
    ],
    collections: [
      { id: 'CL01', order: 1, name: 'Oda', image: 'Image/z8037729213517_6b733c4e3d23a5216813f493449279ae.jpg' },
      { id: 'CL02', order: 2, name: 'Kichi', image: 'Image/z8037729213517_6b733c4e3d23a5216813f493449279ae.jpg' },
      { id: 'CL03', order: 3, name: 'Poseidon', image: 'Image/z8037729213517_6b733c4e3d23a5216813f493449279ae.jpg' }
    ],
    inspirations: [
      { id: 'IN01', order: 1, createdAt: '09/07/2026', image: 'Image/z8037729213517_6b733c4e3d23a5216813f493449279ae.jpg' },
      { id: 'IN02', order: 2, createdAt: '09/07/2026', image: 'Image/z8037729213517_6b733c4e3d23a5216813f493449279ae.jpg' },
      { id: 'IN03', order: 3, createdAt: '09/07/2026', image: 'Image/z8037729213517_6b733c4e3d23a5216813f493449279ae.jpg' }
    ]
  },
  contentRooms: {
    banner: 'Image/z8037741154588_26b826cdcfe77255681eae7d64d9a377.jpg',
    rooms: [
      { id: 'ROOM01', name: 'Phòng khách', image: 'Image/z8037741154588_26b826cdcfe77255681eae7d64d9a377.jpg' },
      { id: 'ROOM02', name: 'Phòng khách', image: 'Image/z8037741541942_92f7e62b519dd56098b68bcc8935925a.jpg' },
      { id: 'ROOM03', name: 'Phòng khách', image: 'Image/z8037741967697_3c18c047a31876f640e07af0b38112e7.jpg' },
      { id: 'ROOM04', name: 'Phòng khách', image: 'Image/z8037741154588_26b826cdcfe77255681eae7d64d9a377.jpg' },
      { id: 'ROOM05', name: 'Phòng khách', image: 'Image/z8037741541942_92f7e62b519dd56098b68bcc8935925a.jpg' },
      { id: 'ROOM06', name: 'Phòng khách', image: 'Image/z8037741967697_3c18c047a31876f640e07af0b38112e7.jpg' },
      { id: 'ROOM07', name: 'Phòng khách', image: 'Image/z8037741154588_26b826cdcfe77255681eae7d64d9a377.jpg' },
      { id: 'ROOM08', name: 'Phòng khách', image: 'Image/z8037741541942_92f7e62b519dd56098b68bcc8935925a.jpg' }
    ],
    ideas: [
      { id: 'IDEA01', order: 1, name: 'Minimalist (Tối giản)', image: 'Image/z8037741154588_26b826cdcfe77255681eae7d64d9a377.jpg' },
      { id: 'IDEA02', order: 2, name: 'Minimalist (Tối giản)', image: 'Image/z8037741541942_92f7e62b519dd56098b68bcc8935925a.jpg' },
      { id: 'IDEA03', order: 3, name: 'Minimalist (Tối giản)', image: 'Image/z8037741967697_3c18c047a31876f640e07af0b38112e7.jpg' }
    ],
    blogs: [
      { id: 'BLOG01', order: 1, name: 'CaraVeso hiểu và trân trọng giấc ngủ của bạn', date: '09/07/2026', status: 'Đã đăng' },
      { id: 'BLOG02', order: 2, name: 'CaraVeso hiểu và trân trọng giấc ngủ của bạn', date: '09/07/2026', status: 'Đã đăng' }
    ]
  },
  customersTotal: 98,
  customersGrandTotal: 1248,
  customers: [
    {
      id: 'KH001',
      name: 'Lionel Messi',
      email: 'tienhhk24411@st.uel.edu.vn',
      phone: '0919120176',
      tier: 'vip',
      gender: 'Nam',
      birthday: '08 Sep 2006',
      address: 'Số 18, đường Hoàng Diệu,\nTân An Phường Lagi, tỉnh\nLâm Đồng',
      createdAt: '10/07/2022',
      totalOrders: 20,
      totalSpent: 70000000,
      locked: false,
      avatar: 'Image/z8035902036779_91f5c3755db42487914a1f8d431c1122.jpg'
    },
    {
      id: 'KH002',
      name: 'Lionel Messi',
      email: 'tienhhk24411@st.uel.edu.vn',
      phone: '0919120176',
      tier: 'vip',
      gender: 'Nam',
      birthday: '08 Sep 2006',
      address: 'Số 18, đường Hoàng Diệu,\nTân An Phường Lagi, tỉnh\nLâm Đồng',
      createdAt: '10/07/2022',
      totalOrders: 20,
      totalSpent: 70000000,
      locked: false,
      avatar: 'Image/z8035902036779_91f5c3755db42487914a1f8d431c1122.jpg'
    },
    {
      id: 'KH003',
      name: 'Lionel Messi',
      email: 'tienhhk24411@st.uel.edu.vn',
      phone: '0919120176',
      tier: 'vip',
      gender: 'Nam',
      birthday: '08 Sep 2006',
      address: 'Số 18, đường Hoàng Diệu,\nTân An Phường Lagi, tỉnh\nLâm Đồng',
      createdAt: '10/07/2022',
      totalOrders: 20,
      totalSpent: 70000000,
      locked: false,
      avatar: 'Image/z8035902036779_91f5c3755db42487914a1f8d431c1122.jpg'
    },
    {
      id: 'KH004',
      name: 'Lionel Messi',
      email: 'tienhhk24411@st.uel.edu.vn',
      phone: '0919120176',
      tier: 'loyal',
      gender: 'Nam',
      birthday: '08 Sep 2006',
      address: 'Số 18, đường Hoàng Diệu,\nTân An Phường Lagi, tỉnh\nLâm Đồng',
      createdAt: '10/07/2022',
      totalOrders: 12,
      totalSpent: 28000000,
      locked: false,
      avatar: 'Image/z8035902036779_91f5c3755db42487914a1f8d431c1122.jpg'
    },
    {
      id: 'KH005',
      name: 'Lionel Messi',
      email: 'tienhhk24411@st.uel.edu.vn',
      phone: '0919120176',
      tier: 'new',
      gender: 'Nam',
      birthday: '08 Sep 2006',
      address: 'Số 18, đường Hoàng Diệu,\nTân An Phường Lagi, tỉnh\nLâm Đồng',
      createdAt: '10/07/2022',
      totalOrders: 1,
      totalSpent: 3600000,
      locked: false,
      avatar: 'Image/z8035902036779_91f5c3755db42487914a1f8d431c1122.jpg'
    },
    {
      id: 'KH006',
      name: 'Nguyễn Minh Anh',
      email: 'minhanh@example.com',
      phone: '0908123456',
      tier: 'loyal',
      gender: 'Nữ',
      birthday: '12 Mar 1999',
      address: 'Quận 3, Thành phố Hồ Chí Minh',
      createdAt: '18/02/2023',
      totalOrders: 9,
      totalSpent: 19000000,
      locked: true,
      avatar: '../CaraVeso/img/khuyen-mai-assets/113f6c88d43c35ec11a950e6656f2781a318356c.png'
    }
  ],
  paymentsTotal: 1518,
  payments: [
    {
      id: '#H000358241',
      time: '28 Jun,\n6:50 PM',
      timeKey: 'june28',
      customer: 'Lionel\nMessi',
      initials: 'LM',
      avatar: 'Image/z8035902036779_91f5c3755db42487914a1f8d431c1122.jpg',
      avatarColor: '#d8b291',
      status: 'success',
      method: 'Momo',
      total: 19800000
    },
    {
      id: '#H000247651',
      time: '30 Jun,\n9:53 AM',
      timeKey: 'june30',
      customer: 'Cristiano\nRonaldo',
      initials: 'CR',
      avatar: 'Image/z8035902214819_031ff1a69d59b3b3287ba9a5e278fef0.jpg',
      avatarColor: '#f1c1c7',
      status: 'pending',
      method: 'Thanh toán khi nhận',
      total: 3600000,
      danger: true
    },
    {
      id: '#H000453824',
      time: 'Hôm nay,\n11:00 AM',
      timeKey: 'today',
      customer: 'Kylian\nMbappé',
      initials: 'KM',
      avatar: 'Image/z8035902384682_68d785f2e177f72491431b8f891ecf80.jpg',
      avatarColor: '#28415c',
      status: 'success',
      method: 'Momo',
      total: 16500000
    },
    {
      id: '#H000665241',
      time: '30 Jun,\n6:51 AM',
      timeKey: 'june30',
      customer: 'Erling\nHaaland',
      initials: 'EH',
      avatar: 'Image/z8035902546352_17d1c6a379de5f5a97e86ed7da01083d.jpg',
      avatarColor: '#d7a987',
      status: 'success',
      method: 'Ngân hàng',
      total: 10200000
    },
    {
      id: '#H000358220',
      time: 'Hôm qua,\n6:51 PM',
      timeKey: 'june30',
      customer: 'Harry\nKane',
      initials: 'HK',
      avatar: 'Image/z8035902881534_7461087ca3f33524f700b10a1c49ee3e.jpg',
      avatarColor: '#9fb8cf',
      status: 'success',
      method: 'Ngân hàng',
      total: 14100000
    },
    {
      id: '#H000759821',
      time: 'Hôm nay,\n4:30 PM',
      timeKey: 'today',
      customer: 'Son\nHeung-min',
      initials: 'SH',
      avatar: 'Image/z8035902881534_7461087ca3f33524f700b10a1c49ee3e.jpg',
      avatarColor: '#d9d0bb',
      status: 'pending',
      method: 'Thanh toán khi nhận',
      total: 6800000
    }
  ],
  ordersTotal: 1518,
  orders: [
    {
      id: '#H000358241',
      time: 'Hôm nay,\n8:27 PM',
      customer: 'Lionel\nMessi',
      initials: 'LM',
      avatar: 'Image/z8035902036779_91f5c3755db42487914a1f8d431c1122.jpg',
      avatarColor: '#d8b291',
      status: 'delivered',
      payment: 'Momo',
      total: 19800000,
      product: {
        name: 'Bàn ăn Signature Walnut',
        sku: 'BA-M04-021',
        desc: 'Gỗ óc chó cao cấp,\n160 × 85 × 75 cm',
        quantity: 1,
        image: 'Image/z8035903506391_a5c7fd790ad0cbf0bff848a0aec26bb8.jpg'
      },
      timelineStep: 4
    },
    {
      id: '#H000247651',
      time: 'Hôm nay,\n4:15 PM',
      customer: 'Cristiano\nRonaldo',
      initials: 'CR',
      avatar: 'Image/z8035902214819_031ff1a69d59b3b3287ba9a5e278fef0.jpg',
      avatarColor: '#f1c1c7',
      status: 'cancel-request',
      payment: 'Thanh toán khi nhận',
      total: 3600000,
      danger: true,
      product: {
        name: 'Ghế sofa Milano Shape U',
        sku: 'SF-MLN-001',
        desc: 'Sofa 2 chỗ, trắng kem',
        quantity: 1,
        image: 'Image/z8035903506391_a5c7fd790ad0cbf0bff848a0aec26bb8.jpg'
      },
      timelineStep: 1
    },
    {
      id: '#H000453824',
      time: 'Hôm nay,\n1:53 PM',
      customer: 'Kylian\nMbappé',
      initials: 'KM',
      avatar: 'Image/z8035902384682_68d785f2e177f72491431b8f891ecf80.jpg',
      avatarColor: '#28415c',
      status: 'confirmed',
      payment: 'Momo',
      total: 16500000,
      product: {
        name: 'Nệm Kymdan Long Thành',
        sku: 'NEM-KMD-001',
        desc: 'Êm ái, công thái học, 1.8 × 2m',
        quantity: 1,
        image: 'Image/z8035903506391_a5c7fd790ad0cbf0bff848a0aec26bb8.jpg'
      },
      timelineStep: 1
    },
    {
      id: '#H000665241',
      time: 'Hôm nay,\n10:15 AM',
      customer: 'Erling\nHaaland',
      initials: 'EH',
      avatar: 'Image/z8035902546352_17d1c6a379de5f5a97e86ed7da01083d.jpg',
      avatarColor: '#d7a987',
      status: 'shipping',
      payment: 'Ngân hàng',
      total: 10200000,
      product: {
        name: 'Kệ bếp Minimal',
        sku: 'KEB-MN-042',
        desc: 'Kệ bếp gỗ công nghiệp phủ melamine',
        quantity: 1,
        image: 'Image/z8035903506391_a5c7fd790ad0cbf0bff848a0aec26bb8.jpg'
      },
      timelineStep: 3
    },
    {
      id: '#H000358220',
      time: 'Hôm qua,\n7:30 PM',
      customer: 'Harry\nKane',
      initials: 'HK',
      avatar: 'Image/z8035902881534_7461087ca3f33524f700b10a1c49ee3e.jpg',
      avatarColor: '#9fb8cf',
      status: 'preparing',
      payment: 'Ngân hàng',
      total: 14100000,
      product: {
        name: 'Bàn ăn Signature Walnut',
        sku: 'BA-M04-021',
        desc: 'Gỗ óc chó cao cấp,\n160 × 85 × 75 cm',
        quantity: 1,
        image: 'Image/z8035903506391_a5c7fd790ad0cbf0bff848a0aec26bb8.jpg'
      },
      timelineStep: 2
    },
    {
      id: '#H000759821',
      time: 'Hôm qua,\n4:30 PM',
      customer: 'Son\nHeung-min',
      initials: 'SH',
      avatar: 'Image/z8035902881534_7461087ca3f33524f700b10a1c49ee3e.jpg',
      avatarColor: '#d9d0bb',
      status: 'new',
      payment: 'Thanh toán khi nhận',
      total: 6800000,
      product: {
        name: 'Đèn bàn Aurora',
        sku: 'DEN-AU-033',
        desc: 'Đèn trang trí ánh sáng vàng ấm',
        quantity: 1,
        image: 'Image/z8035903506391_a5c7fd790ad0cbf0bff848a0aec26bb8.jpg'
      },
      timelineStep: 0
    }
  ],
  refunds: [
    {
      id: '#H000249668',
      time: '30 Jun,\n4:15 PM',
      customer: 'Hồng Thất Công',
      reason: 'Sản phẩm bị lỗi!',
      status: 'processing',
      description: 'Bàn ăn có một chân bị ngắn hơn so với các chân còn lại, nên bị bập bênh!',
      product: {
        name: 'Bàn ăn Signature Walnut',
        sku: 'BA-M04-021',
        desc: 'Gỗ óc chó cao cấp, 160 x 85 x 75 cm',
        quantity: 1,
        image: 'Image/z8035903506391_a5c7fd790ad0cbf0bff848a0aec26bb8.jpg'
      },
      paymentMethod: 'Momo',
      amount: 14100000,
      fee: 'Miễn phí',
      requestDate: '30 Jun 2026',
      eta: '02 Jul 2026 (2 ngày làm việc)'
    },
    {
      id: '#H000255481',
      time: '29 Jun,\n6:45 PM',
      customer: 'Âu Dương Phong',
      reason: 'Sản phẩm hư hỏng',
      status: 'refunded',
      description: 'Gối trang trí bị rách phần viền sau khi nhận hàng.',
      product: {
        name: 'Gối tua rua Linen',
        sku: 'GOI-LN-019',
        desc: 'Vải linen mềm, màu be tự nhiên',
        quantity: 2,
        image: 'Image/z8035903506391_a5c7fd790ad0cbf0bff848a0aec26bb8.jpg'
      },
      paymentMethod: 'Ngân hàng',
      amount: 850000,
      fee: 'Miễn phí',
      requestDate: '29 Jun 2026',
      eta: '01 Jul 2026'
    },
    {
      id: '#H000255581',
      time: '29 Jun,\n9:45 PM',
      customer: 'Đoàn Trí Hưng',
      reason: 'Giao nhầm hàng',
      status: 'processing',
      description: 'Khách đặt đèn trang trí nhưng nhận được móc treo tường.',
      product: {
        name: 'Đèn bàn Aurora',
        sku: 'DEN-AU-033',
        desc: 'Đèn trang trí ánh sáng vàng ấm',
        quantity: 1,
        image: 'Image/z8035903506391_a5c7fd790ad0cbf0bff848a0aec26bb8.jpg'
      },
      paymentMethod: 'Momo',
      amount: 2400000,
      fee: 'Miễn phí',
      requestDate: '29 Jun 2026',
      eta: '01 Jul 2026'
    },
    {
      id: '#H000249888',
      time: '28 Jun,\n10:25 AM',
      customer: 'Hoàng Dược Sư',
      reason: 'Đổi ý',
      status: 'rejected',
      description: 'Khách đổi ý sau khi sản phẩm đã giao thành công.',
      product: {
        name: 'Kệ bếp Minimal',
        sku: 'KEB-MN-042',
        desc: 'Kệ bếp gỗ công nghiệp phủ melamine',
        quantity: 1,
        image: 'Image/z8035903506391_a5c7fd790ad0cbf0bff848a0aec26bb8.jpg'
      },
      paymentMethod: 'Thanh toán khi nhận',
      amount: 5100000,
      fee: 'Miễn phí',
      requestDate: '28 Jun 2026',
      eta: 'Không áp dụng'
    }
  ]
};

