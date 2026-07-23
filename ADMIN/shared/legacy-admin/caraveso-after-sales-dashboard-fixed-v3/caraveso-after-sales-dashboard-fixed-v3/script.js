// Quản lý dịch vụ hậu mãi - CaraVeso Management
// Logic chính: đọc data.json, lọc giao nhiều điều kiện, phân trang, mở chi tiết và cập nhật trạng thái trực tiếp.

const FALLBACK_DATA = [
  {
    "id": "#HHT080906",
    "thoi_gian": "28 Jun,\n6:50 PM",
    "khach_hang": {
      "ho_ten": "Hoàng\nHuy Tiến",
      "avatar": "assets/avatar_1.png",
      "email": "tienhhk24411@st.uel.edu.vn",
      "ngay_sinh": "08/09/2006",
      "so_dien_thoai": "0919120176",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Đổi trả",
    "li_do": "Sản phẩm thiếu",
    "trang_thai": "Chờ xét duyệt",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Ghế Sofa Milano Shape U",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Sản phẩm thiếu 1 gối",
      "mo_ta_chi_tiet": "So với mô tả hàng 2 gối nhưng tôi chỉ nhận lại 1 gối, yêu cầu shop đề xuất phương án đổi hàng phù hợp",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#HHT080906",
    "thoi_gian": "30 Jun,\n9:53 AM",
    "khach_hang": {
      "ho_ten": "Hoàng\nHuy Tiến",
      "avatar": "assets/avatar_1.png",
      "email": "tienhhk24411@st.uel.edu.vn",
      "ngay_sinh": "08/09/2006",
      "so_dien_thoai": "0919120176",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Bảo hành",
    "li_do": "Sản phẩm lỗi",
    "trang_thai": "Chờ xét duyệt",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Ghế Sofa Milano Shape U",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Sản phẩm bị lún nệm và phát ra tiếng kêu khi sử dụng",
      "mo_ta_chi_tiet": "Sau khi sử dụng được hai tuần phần nệm bên trái bị lún và có tiếng kêu khi ngồi.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#TPH0453824",
    "thoi_gian": "Hôm nay,\n11:00 AM",
    "khach_hang": {
      "ho_ten": "Trần\nPhước Huy",
      "avatar": "assets/avatar_2.png",
      "email": "huytp24411@st.uel.edu.vn",
      "ngay_sinh": "10/04/2005",
      "so_dien_thoai": "0919550124",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Đổi trả",
    "li_do": "Không như mô tả",
    "trang_thai": "Hoàn thành",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Ghế Sofa Milano Shape U",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Không đúng mô tả sản phẩm",
      "mo_ta_chi_tiet": "Sản phẩm nhận được có màu sắc và kích thước khác so với hình ảnh trên website.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#TAK0665241",
    "thoi_gian": "30 Jun,\n6:51 AM",
    "khach_hang": {
      "ho_ten": "Trần\nAnh Khoa",
      "avatar": "assets/avatar_admin.png",
      "email": "khoata24411@st.uel.edu.vn",
      "ngay_sinh": "12/01/2005",
      "so_dien_thoai": "0919886741",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Đổi trả",
    "li_do": "Sản phẩm lỗi",
    "trang_thai": "Hoàn thành",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Ghế Sofa Milano Shape U",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Sản phẩm lỗi bề mặt",
      "mo_ta_chi_tiet": "Bề mặt vải có vết xước và đường may chưa hoàn thiện ở cạnh ghế.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#NTD0358220",
    "thoi_gian": "Hôm qua,\n6:51 PM",
    "khach_hang": {
      "ho_ten": "Nguyễn\nTiến Đạt",
      "avatar": "assets/avatar_3.png",
      "email": "datnt24411@st.uel.edu.vn",
      "ngay_sinh": "02/03/2005",
      "so_dien_thoai": "0919347721",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Bảo hành",
    "li_do": "Màu sắc không hợp",
    "trang_thai": "Từ chối",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Ghế Sofa Milano Shape U",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Màu sắc không hợp với không gian",
      "mo_ta_chi_tiet": "Khách hàng yêu cầu bảo hành nhưng lý do thuộc nhóm thay đổi nhu cầu sử dụng, không thuộc chính sách bảo hành.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#HHT000001",
    "thoi_gian": "1 Jun,\n12:17 AM",
    "khach_hang": {
      "ho_ten": "Nguyễn\nTiến Đạt",
      "avatar": "assets/avatar_2.png",
      "email": "nguyễntiếnđạt@st.uel.edu.vn",
      "ngay_sinh": "24/02/2000",
      "so_dien_thoai": "0919819600",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Đổi trả",
    "li_do": "Kích thước lớn hơn mô tả",
    "trang_thai": "Chờ xét duyệt",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Ghế Sofa Milano Shape U",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Kích thước lớn hơn mô tả",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#HHT000002",
    "thoi_gian": "17 Jun,\n10:01 PM",
    "khach_hang": {
      "ho_ten": "Vũ\nHoàng Long",
      "avatar": "assets/avatar_5.png",
      "email": "vũhoànglong@st.uel.edu.vn",
      "ngay_sinh": "14/04/2000",
      "so_dien_thoai": "0919794026",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Đổi trả",
    "li_do": "Không như mô tả",
    "trang_thai": "Chờ xét duyệt",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Tủ quần áo gỗ tự nhiên",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Không như mô tả",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#HHT000003",
    "thoi_gian": "7 Jun,\n6:06 AM",
    "khach_hang": {
      "ho_ten": "Lê\nMinh Hoàng",
      "avatar": "assets/avatar_1.png",
      "email": "lêminhhoàng@st.uel.edu.vn",
      "ngay_sinh": "12/06/2000",
      "so_dien_thoai": "0919940781",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Đổi trả",
    "li_do": "Sản phẩm lỗi",
    "trang_thai": "Chờ xét duyệt",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Kệ tivi gỗ sồi",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Sản phẩm lỗi",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#HHT000004",
    "thoi_gian": "10 Jun,\n11:39 PM",
    "khach_hang": {
      "ho_ten": "Đinh\nTiến Dũng",
      "avatar": "assets/avatar_3.png",
      "email": "đinhtiếndũng@st.uel.edu.vn",
      "ngay_sinh": "19/04/2000",
      "so_dien_thoai": "0919103413",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Đổi trả",
    "li_do": "Sản phẩm thiếu",
    "trang_thai": "Chờ xét duyệt",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Ghế Sofa Milano Shape U",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Sản phẩm thiếu",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#HHT000005",
    "thoi_gian": "15 Jun,\n11:53 AM",
    "khach_hang": {
      "ho_ten": "Bùi\nThị Mai",
      "avatar": "assets/avatar_3.png",
      "email": "bùithịmai@st.uel.edu.vn",
      "ngay_sinh": "12/04/2000",
      "so_dien_thoai": "0919419283",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Đổi trả",
    "li_do": "Màu sắc không hợp",
    "trang_thai": "Chờ xét duyệt",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Bàn ăn Concorde mặt đá",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Màu sắc không hợp",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#HHT000006",
    "thoi_gian": "9 Jun,\n11:44 PM",
    "khach_hang": {
      "ho_ten": "Lý\nThanh Hải",
      "avatar": "assets/avatar_3.png",
      "email": "lýthanhhải@st.uel.edu.vn",
      "ngay_sinh": "27/01/2000",
      "so_dien_thoai": "0919305641",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Đổi trả",
    "li_do": "Màu sắc không hợp",
    "trang_thai": "Chờ xét duyệt",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Bàn ăn Concorde mặt đá",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Màu sắc không hợp",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#HHT000007",
    "thoi_gian": "7 Jun,\n11:31 AM",
    "khach_hang": {
      "ho_ten": "Đỗ\nHải Đăng",
      "avatar": "assets/avatar_4.png",
      "email": "đỗhảiđăng@st.uel.edu.vn",
      "ngay_sinh": "05/05/2000",
      "so_dien_thoai": "0919238849",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Đổi trả",
    "li_do": "Giao sai mẫu mã",
    "trang_thai": "Chờ xét duyệt",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Kệ tivi gỗ sồi",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Giao sai mẫu mã",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#HHT000008",
    "thoi_gian": "12 Jun,\n4:08 PM",
    "khach_hang": {
      "ho_ten": "Lý\nThanh Hải",
      "avatar": "assets/avatar_1.png",
      "email": "lýthanhhải@st.uel.edu.vn",
      "ngay_sinh": "25/01/2000",
      "so_dien_thoai": "0919122691",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Đổi trả",
    "li_do": "Giao sai mẫu mã",
    "trang_thai": "Chờ xét duyệt",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Kệ tivi gỗ sồi",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Giao sai mẫu mã",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#HHT000009",
    "thoi_gian": "15 Jun,\n9:16 PM",
    "khach_hang": {
      "ho_ten": "Cao\nMinh Tú",
      "avatar": "assets/avatar_1.png",
      "email": "caominhtú@st.uel.edu.vn",
      "ngay_sinh": "22/12/2000",
      "so_dien_thoai": "0919184514",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Đổi trả",
    "li_do": "Màu sắc không hợp",
    "trang_thai": "Chờ xét duyệt",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Kệ tivi gỗ sồi",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Màu sắc không hợp",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#HHT000010",
    "thoi_gian": "1 Jun,\n12:56 PM",
    "khach_hang": {
      "ho_ten": "Phan\nVăn Đức",
      "avatar": "assets/avatar_5.png",
      "email": "phanvănđức@st.uel.edu.vn",
      "ngay_sinh": "25/03/2000",
      "so_dien_thoai": "0919814893",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Đổi trả",
    "li_do": "Không như mô tả",
    "trang_thai": "Chờ xét duyệt",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Bàn ăn Concorde mặt đá",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Không như mô tả",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#HHT000011",
    "thoi_gian": "18 Jun,\n9:58 AM",
    "khach_hang": {
      "ho_ten": "Phạm\nThanh Sơn",
      "avatar": "assets/avatar_3.png",
      "email": "phạmthanhsơn@st.uel.edu.vn",
      "ngay_sinh": "16/01/2000",
      "so_dien_thoai": "0919154303",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Đổi trả",
    "li_do": "Sản phẩm lỗi",
    "trang_thai": "Chờ xét duyệt",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Giường ngủ bọc da Luxury",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Sản phẩm lỗi",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#HHT000012",
    "thoi_gian": "24 Jun,\n8:52 AM",
    "khach_hang": {
      "ho_ten": "Trần\nAnh Khoa",
      "avatar": "assets/avatar_5.png",
      "email": "trầnanhkhoa@st.uel.edu.vn",
      "ngay_sinh": "25/03/2000",
      "so_dien_thoai": "0919278248",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Đổi trả",
    "li_do": "Sản phẩm thiếu",
    "trang_thai": "Chờ xét duyệt",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Giường ngủ bọc da Luxury",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Sản phẩm thiếu",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#HHT000013",
    "thoi_gian": "30 Jun,\n9:48 PM",
    "khach_hang": {
      "ho_ten": "Đặng\nMỹ Linh",
      "avatar": "assets/avatar_2.png",
      "email": "đặngmỹlinh@st.uel.edu.vn",
      "ngay_sinh": "23/05/2000",
      "so_dien_thoai": "0919657871",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Đổi trả",
    "li_do": "Màu sắc không hợp",
    "trang_thai": "Chờ xét duyệt",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Bàn ăn Concorde mặt đá",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Màu sắc không hợp",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#HHT000014",
    "thoi_gian": "11 Jun,\n1:37 PM",
    "khach_hang": {
      "ho_ten": "Trần\nAnh Khoa",
      "avatar": "assets/avatar_5.png",
      "email": "trầnanhkhoa@st.uel.edu.vn",
      "ngay_sinh": "08/01/2000",
      "so_dien_thoai": "0919103105",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Đổi trả",
    "li_do": "Không như mô tả",
    "trang_thai": "Chờ xét duyệt",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Ghế Sofa Milano Shape U",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Không như mô tả",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#HHT000015",
    "thoi_gian": "9 Jun,\n11:31 AM",
    "khach_hang": {
      "ho_ten": "Vũ\nHoàng Long",
      "avatar": "assets/avatar_2.png",
      "email": "vũhoànglong@st.uel.edu.vn",
      "ngay_sinh": "24/10/2000",
      "so_dien_thoai": "0919973763",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Đổi trả",
    "li_do": "Giao sai mẫu mã",
    "trang_thai": "Chờ xét duyệt",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Ghế Sofa Milano Shape U",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Giao sai mẫu mã",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#HHT000016",
    "thoi_gian": "12 Jun,\n7:26 AM",
    "khach_hang": {
      "ho_ten": "Dương\nGia Bảo",
      "avatar": "assets/avatar_1.png",
      "email": "dươnggiabảo@st.uel.edu.vn",
      "ngay_sinh": "22/11/2000",
      "so_dien_thoai": "0919106513",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Đổi trả",
    "li_do": "Sản phẩm thiếu",
    "trang_thai": "Chờ xét duyệt",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Bàn ăn Concorde mặt đá",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Sản phẩm thiếu",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#HHT000017",
    "thoi_gian": "15 Jun,\n3:27 AM",
    "khach_hang": {
      "ho_ten": "Đinh\nTiến Dũng",
      "avatar": "assets/avatar_4.png",
      "email": "đinhtiếndũng@st.uel.edu.vn",
      "ngay_sinh": "08/02/2000",
      "so_dien_thoai": "0919781080",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Đổi trả",
    "li_do": "Không như mô tả",
    "trang_thai": "Chờ xét duyệt",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Ghế Sofa Milano Shape U",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Không như mô tả",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#HHT000018",
    "thoi_gian": "6 Jun,\n7:31 AM",
    "khach_hang": {
      "ho_ten": "Vũ\nHoàng Long",
      "avatar": "assets/avatar_4.png",
      "email": "vũhoànglong@st.uel.edu.vn",
      "ngay_sinh": "02/03/2000",
      "so_dien_thoai": "0919606474",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Đổi trả",
    "li_do": "Bị móp méo khi vận chuyển",
    "trang_thai": "Chờ xét duyệt",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Kệ tivi gỗ sồi",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Bị móp méo khi vận chuyển",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#HHT000019",
    "thoi_gian": "22 Jun,\n12:31 AM",
    "khach_hang": {
      "ho_ten": "Đinh\nTiến Dũng",
      "avatar": "assets/avatar_3.png",
      "email": "đinhtiếndũng@st.uel.edu.vn",
      "ngay_sinh": "07/01/2000",
      "so_dien_thoai": "0919980500",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Đổi trả",
    "li_do": "Kích thước lớn hơn mô tả",
    "trang_thai": "Chờ xét duyệt",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Giường ngủ bọc da Luxury",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Kích thước lớn hơn mô tả",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#HHT000020",
    "thoi_gian": "30 Jun,\n9:10 AM",
    "khach_hang": {
      "ho_ten": "Tống\nKhánh Linh",
      "avatar": "assets/avatar_5.png",
      "email": "tốngkhánhlinh@st.uel.edu.vn",
      "ngay_sinh": "03/03/2000",
      "so_dien_thoai": "0919191361",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Đổi trả",
    "li_do": "Màu sắc không hợp",
    "trang_thai": "Chờ xét duyệt",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Giường ngủ bọc da Luxury",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Màu sắc không hợp",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#HHT000021",
    "thoi_gian": "20 Jun,\n1:39 AM",
    "khach_hang": {
      "ho_ten": "Võ\nThị Sáu",
      "avatar": "assets/avatar_5.png",
      "email": "võthịsáu@st.uel.edu.vn",
      "ngay_sinh": "19/09/2000",
      "so_dien_thoai": "0919543534",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Đổi trả",
    "li_do": "Không như mô tả",
    "trang_thai": "Chờ xét duyệt",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Kệ tivi gỗ sồi",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Không như mô tả",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#HHT000022",
    "thoi_gian": "15 Jun,\n6:59 PM",
    "khach_hang": {
      "ho_ten": "Ngô\nQuốc Bảo",
      "avatar": "assets/avatar_1.png",
      "email": "ngôquốcbảo@st.uel.edu.vn",
      "ngay_sinh": "01/08/2000",
      "so_dien_thoai": "0919991183",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Đổi trả",
    "li_do": "Không như mô tả",
    "trang_thai": "Chờ xét duyệt",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Giường ngủ bọc da Luxury",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Không như mô tả",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#HHT000023",
    "thoi_gian": "30 Jun,\n6:56 AM",
    "khach_hang": {
      "ho_ten": "Lê\nMinh Hoàng",
      "avatar": "assets/avatar_2.png",
      "email": "lêminhhoàng@st.uel.edu.vn",
      "ngay_sinh": "12/05/2000",
      "so_dien_thoai": "0919278498",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Đổi trả",
    "li_do": "Sản phẩm lỗi",
    "trang_thai": "Chờ xét duyệt",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Ghế Sofa Milano Shape U",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Sản phẩm lỗi",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#HHT000024",
    "thoi_gian": "10 Jun,\n11:06 PM",
    "khach_hang": {
      "ho_ten": "Đinh\nTiến Dũng",
      "avatar": "assets/avatar_2.png",
      "email": "đinhtiếndũng@st.uel.edu.vn",
      "ngay_sinh": "09/02/2000",
      "so_dien_thoai": "0919182449",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Đổi trả",
    "li_do": "Kích thước lớn hơn mô tả",
    "trang_thai": "Chờ xét duyệt",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Bàn ăn Concorde mặt đá",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Kích thước lớn hơn mô tả",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#HHT000025",
    "thoi_gian": "7 Jun,\n11:40 PM",
    "khach_hang": {
      "ho_ten": "Đỗ\nHải Đăng",
      "avatar": "assets/avatar_5.png",
      "email": "đỗhảiđăng@st.uel.edu.vn",
      "ngay_sinh": "16/05/2000",
      "so_dien_thoai": "0919016400",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Đổi trả",
    "li_do": "Kích thước lớn hơn mô tả",
    "trang_thai": "Chờ xét duyệt",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Tủ quần áo gỗ tự nhiên",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Kích thước lớn hơn mô tả",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#HHT000026",
    "thoi_gian": "21 Jun,\n5:10 PM",
    "khach_hang": {
      "ho_ten": "Lê\nMinh Hoàng",
      "avatar": "assets/avatar_5.png",
      "email": "lêminhhoàng@st.uel.edu.vn",
      "ngay_sinh": "23/07/2000",
      "so_dien_thoai": "0919801128",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Đổi trả",
    "li_do": "Bị móp méo khi vận chuyển",
    "trang_thai": "Chờ xét duyệt",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Ghế Sofa Milano Shape U",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Bị móp méo khi vận chuyển",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#HHT000027",
    "thoi_gian": "19 Jun,\n9:09 AM",
    "khach_hang": {
      "ho_ten": "Hoàng\nKim Ngân",
      "avatar": "assets/avatar_1.png",
      "email": "hoàngkimngân@st.uel.edu.vn",
      "ngay_sinh": "10/06/2000",
      "so_dien_thoai": "0919053315",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Đổi trả",
    "li_do": "Bị móp méo khi vận chuyển",
    "trang_thai": "Chờ xét duyệt",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Giường ngủ bọc da Luxury",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Bị móp méo khi vận chuyển",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#HHT000028",
    "thoi_gian": "20 Jun,\n12:09 PM",
    "khach_hang": {
      "ho_ten": "Dương\nGia Bảo",
      "avatar": "assets/avatar_2.png",
      "email": "dươnggiabảo@st.uel.edu.vn",
      "ngay_sinh": "28/03/2000",
      "so_dien_thoai": "0919260256",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Đổi trả",
    "li_do": "Bị móp méo khi vận chuyển",
    "trang_thai": "Chờ xét duyệt",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Bàn ăn Concorde mặt đá",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Bị móp méo khi vận chuyển",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#HHT000029",
    "thoi_gian": "26 Jun,\n12:06 AM",
    "khach_hang": {
      "ho_ten": "Phạm\nThanh Sơn",
      "avatar": "assets/avatar_1.png",
      "email": "phạmthanhsơn@st.uel.edu.vn",
      "ngay_sinh": "28/08/2000",
      "so_dien_thoai": "0919337543",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Đổi trả",
    "li_do": "Sản phẩm lỗi",
    "trang_thai": "Chờ xét duyệt",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Bàn ăn Concorde mặt đá",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Sản phẩm lỗi",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#HHT000030",
    "thoi_gian": "13 Jun,\n6:17 PM",
    "khach_hang": {
      "ho_ten": "Đặng\nMỹ Linh",
      "avatar": "assets/avatar_3.png",
      "email": "đặngmỹlinh@st.uel.edu.vn",
      "ngay_sinh": "12/11/2000",
      "so_dien_thoai": "0919868501",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Đổi trả",
    "li_do": "Sản phẩm thiếu",
    "trang_thai": "Chờ xét duyệt",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Tủ quần áo gỗ tự nhiên",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Sản phẩm thiếu",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#HHT000031",
    "thoi_gian": "9 Jun,\n1:06 PM",
    "khach_hang": {
      "ho_ten": "Võ\nThị Sáu",
      "avatar": "assets/avatar_3.png",
      "email": "võthịsáu@st.uel.edu.vn",
      "ngay_sinh": "24/06/2000",
      "so_dien_thoai": "0919698169",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Đổi trả",
    "li_do": "Không như mô tả",
    "trang_thai": "Chờ xét duyệt",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Bàn ăn Concorde mặt đá",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Không như mô tả",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#HHT000032",
    "thoi_gian": "23 Jun,\n7:00 PM",
    "khach_hang": {
      "ho_ten": "Trần\nPhước Huy",
      "avatar": "assets/avatar_5.png",
      "email": "trầnphướchuy@st.uel.edu.vn",
      "ngay_sinh": "22/12/2000",
      "so_dien_thoai": "0919356159",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Đổi trả",
    "li_do": "Sản phẩm lỗi",
    "trang_thai": "Chờ xét duyệt",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Tủ quần áo gỗ tự nhiên",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Sản phẩm lỗi",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#HHT000033",
    "thoi_gian": "24 Jun,\n5:32 AM",
    "khach_hang": {
      "ho_ten": "Nguyễn\nTiến Đạt",
      "avatar": "assets/avatar_4.png",
      "email": "nguyễntiếnđạt@st.uel.edu.vn",
      "ngay_sinh": "11/07/2000",
      "so_dien_thoai": "0919482366",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Đổi trả",
    "li_do": "Kích thước lớn hơn mô tả",
    "trang_thai": "Chờ xét duyệt",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Bàn ăn Concorde mặt đá",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Kích thước lớn hơn mô tả",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#HHT000034",
    "thoi_gian": "10 Jun,\n7:35 PM",
    "khach_hang": {
      "ho_ten": "Võ\nThị Sáu",
      "avatar": "assets/avatar_3.png",
      "email": "võthịsáu@st.uel.edu.vn",
      "ngay_sinh": "10/04/2000",
      "so_dien_thoai": "0919699577",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Đổi trả",
    "li_do": "Giao sai mẫu mã",
    "trang_thai": "Chờ xét duyệt",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Kệ tivi gỗ sồi",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Giao sai mẫu mã",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#HHT000035",
    "thoi_gian": "17 Jun,\n8:50 PM",
    "khach_hang": {
      "ho_ten": "Đặng\nMỹ Linh",
      "avatar": "assets/avatar_2.png",
      "email": "đặngmỹlinh@st.uel.edu.vn",
      "ngay_sinh": "22/02/2000",
      "so_dien_thoai": "0919489513",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Đổi trả",
    "li_do": "Kích thước lớn hơn mô tả",
    "trang_thai": "Chờ xét duyệt",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Tủ quần áo gỗ tự nhiên",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Kích thước lớn hơn mô tả",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#HHT000036",
    "thoi_gian": "5 Jun,\n1:02 AM",
    "khach_hang": {
      "ho_ten": "Đặng\nMỹ Linh",
      "avatar": "assets/avatar_4.png",
      "email": "đặngmỹlinh@st.uel.edu.vn",
      "ngay_sinh": "20/02/2000",
      "so_dien_thoai": "0919769367",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Đổi trả",
    "li_do": "Không như mô tả",
    "trang_thai": "Chờ xét duyệt",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Kệ tivi gỗ sồi",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Không như mô tả",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#HHT000037",
    "thoi_gian": "21 Jun,\n12:00 PM",
    "khach_hang": {
      "ho_ten": "Lê\nMinh Hoàng",
      "avatar": "assets/avatar_1.png",
      "email": "lêminhhoàng@st.uel.edu.vn",
      "ngay_sinh": "25/07/2000",
      "so_dien_thoai": "0919328708",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Đổi trả",
    "li_do": "Không như mô tả",
    "trang_thai": "Chờ xét duyệt",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Bàn ăn Concorde mặt đá",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Không như mô tả",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#HHT000038",
    "thoi_gian": "15 Jun,\n3:51 AM",
    "khach_hang": {
      "ho_ten": "Nguyễn\nTiến Đạt",
      "avatar": "assets/avatar_5.png",
      "email": "nguyễntiếnđạt@st.uel.edu.vn",
      "ngay_sinh": "18/10/2000",
      "so_dien_thoai": "0919579868",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Đổi trả",
    "li_do": "Bị móp méo khi vận chuyển",
    "trang_thai": "Chờ xét duyệt",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Kệ tivi gỗ sồi",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Bị móp méo khi vận chuyển",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#HHT000039",
    "thoi_gian": "15 Jun,\n5:48 AM",
    "khach_hang": {
      "ho_ten": "Trịnh\nCông Sơn",
      "avatar": "assets/avatar_3.png",
      "email": "trịnhcôngsơn@st.uel.edu.vn",
      "ngay_sinh": "25/09/2000",
      "so_dien_thoai": "0919734714",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Đổi trả",
    "li_do": "Không như mô tả",
    "trang_thai": "Chờ xét duyệt",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Bàn ăn Concorde mặt đá",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Không như mô tả",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#HHT000040",
    "thoi_gian": "11 Jun,\n9:05 AM",
    "khach_hang": {
      "ho_ten": "Đỗ\nHải Đăng",
      "avatar": "assets/avatar_2.png",
      "email": "đỗhảiđăng@st.uel.edu.vn",
      "ngay_sinh": "13/12/2000",
      "so_dien_thoai": "0919231665",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Đổi trả",
    "li_do": "Sản phẩm lỗi",
    "trang_thai": "Chờ xét duyệt",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Giường ngủ bọc da Luxury",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Sản phẩm lỗi",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#HHT000041",
    "thoi_gian": "2 Jun,\n4:53 AM",
    "khach_hang": {
      "ho_ten": "Dương\nGia Bảo",
      "avatar": "assets/avatar_5.png",
      "email": "dươnggiabảo@st.uel.edu.vn",
      "ngay_sinh": "23/01/2000",
      "so_dien_thoai": "0919967054",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Đổi trả",
    "li_do": "Màu sắc không hợp",
    "trang_thai": "Chờ xét duyệt",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Kệ tivi gỗ sồi",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Màu sắc không hợp",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#HHT000042",
    "thoi_gian": "18 Jun,\n12:47 PM",
    "khach_hang": {
      "ho_ten": "Dương\nGia Bảo",
      "avatar": "assets/avatar_5.png",
      "email": "dươnggiabảo@st.uel.edu.vn",
      "ngay_sinh": "08/08/2000",
      "so_dien_thoai": "0919346706",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Đổi trả",
    "li_do": "Bị móp méo khi vận chuyển",
    "trang_thai": "Chờ xét duyệt",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Tủ quần áo gỗ tự nhiên",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Bị móp méo khi vận chuyển",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#HHT000043",
    "thoi_gian": "24 Jun,\n3:53 AM",
    "khach_hang": {
      "ho_ten": "Lý\nThanh Hải",
      "avatar": "assets/avatar_2.png",
      "email": "lýthanhhải@st.uel.edu.vn",
      "ngay_sinh": "20/09/2000",
      "so_dien_thoai": "0919069901",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Đổi trả",
    "li_do": "Kích thước lớn hơn mô tả",
    "trang_thai": "Chờ xét duyệt",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Kệ tivi gỗ sồi",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Kích thước lớn hơn mô tả",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#HHT000044",
    "thoi_gian": "6 Jun,\n1:16 AM",
    "khach_hang": {
      "ho_ten": "Phan\nVăn Đức",
      "avatar": "assets/avatar_2.png",
      "email": "phanvănđức@st.uel.edu.vn",
      "ngay_sinh": "15/06/2000",
      "so_dien_thoai": "0919564641",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Đổi trả",
    "li_do": "Không như mô tả",
    "trang_thai": "Chờ xét duyệt",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Kệ tivi gỗ sồi",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Không như mô tả",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#HHT000045",
    "thoi_gian": "2 Jun,\n6:14 PM",
    "khach_hang": {
      "ho_ten": "Đinh\nTiến Dũng",
      "avatar": "assets/avatar_1.png",
      "email": "đinhtiếndũng@st.uel.edu.vn",
      "ngay_sinh": "25/01/2000",
      "so_dien_thoai": "0919330923",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Đổi trả",
    "li_do": "Sản phẩm thiếu",
    "trang_thai": "Chờ xét duyệt",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Bàn ăn Concorde mặt đá",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Sản phẩm thiếu",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#HHT000046",
    "thoi_gian": "19 Jun,\n4:29 PM",
    "khach_hang": {
      "ho_ten": "Nguyễn\nTiến Đạt",
      "avatar": "assets/avatar_3.png",
      "email": "nguyễntiếnđạt@st.uel.edu.vn",
      "ngay_sinh": "06/10/2000",
      "so_dien_thoai": "0919912419",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Đổi trả",
    "li_do": "Màu sắc không hợp",
    "trang_thai": "Chờ xét duyệt",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Ghế Sofa Milano Shape U",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Màu sắc không hợp",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#TAK000047",
    "thoi_gian": "22 Jun,\n7:25 PM",
    "khach_hang": {
      "ho_ten": "Võ\nThị Sáu",
      "avatar": "assets/avatar_2.png",
      "email": "võthịsáu@st.uel.edu.vn",
      "ngay_sinh": "03/10/2000",
      "so_dien_thoai": "0919314919",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Bảo hành",
    "li_do": "Bề mặt da bong tróc",
    "trang_thai": "Chờ xét duyệt",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Ghế Sofa Milano Shape U",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Bề mặt da bong tróc",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#TAK000048",
    "thoi_gian": "14 Jun,\n11:23 AM",
    "khach_hang": {
      "ho_ten": "Đinh\nTiến Dũng",
      "avatar": "assets/avatar_3.png",
      "email": "đinhtiếndũng@st.uel.edu.vn",
      "ngay_sinh": "01/07/2000",
      "so_dien_thoai": "0919716572",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Bảo hành",
    "li_do": "Bề mặt da bong tróc",
    "trang_thai": "Chờ xét duyệt",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Kệ tivi gỗ sồi",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Bề mặt da bong tróc",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#TAK000049",
    "thoi_gian": "21 Jun,\n5:39 PM",
    "khach_hang": {
      "ho_ten": "Tống\nKhánh Linh",
      "avatar": "assets/avatar_5.png",
      "email": "tốngkhánhlinh@st.uel.edu.vn",
      "ngay_sinh": "25/08/2000",
      "so_dien_thoai": "0919769453",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Bảo hành",
    "li_do": "Lún nệm khi sử dụng",
    "trang_thai": "Chờ xét duyệt",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Ghế Sofa Milano Shape U",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Lún nệm khi sử dụng",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#TAK000050",
    "thoi_gian": "8 Jun,\n8:36 PM",
    "khach_hang": {
      "ho_ten": "Phan\nVăn Đức",
      "avatar": "assets/avatar_4.png",
      "email": "phanvănđức@st.uel.edu.vn",
      "ngay_sinh": "11/01/2000",
      "so_dien_thoai": "0919752735",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Bảo hành",
    "li_do": "Bề mặt da bong tróc",
    "trang_thai": "Chờ xét duyệt",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Tủ quần áo gỗ tự nhiên",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Bề mặt da bong tróc",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#TAK000051",
    "thoi_gian": "29 Jun,\n10:44 PM",
    "khach_hang": {
      "ho_ten": "Bùi\nThị Mai",
      "avatar": "assets/avatar_5.png",
      "email": "bùithịmai@st.uel.edu.vn",
      "ngay_sinh": "01/09/2000",
      "so_dien_thoai": "0919313678",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Bảo hành",
    "li_do": "Bề mặt da bong tróc",
    "trang_thai": "Chờ xét duyệt",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Bàn ăn Concorde mặt đá",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Bề mặt da bong tróc",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#TAK000052",
    "thoi_gian": "21 Jun,\n12:31 AM",
    "khach_hang": {
      "ho_ten": "Trịnh\nCông Sơn",
      "avatar": "assets/avatar_1.png",
      "email": "trịnhcôngsơn@st.uel.edu.vn",
      "ngay_sinh": "03/05/2000",
      "so_dien_thoai": "0919363495",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Bảo hành",
    "li_do": "Đèn LED không sáng",
    "trang_thai": "Chờ xét duyệt",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Kệ tivi gỗ sồi",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Đèn LED không sáng",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#TAK000053",
    "thoi_gian": "12 Jun,\n7:47 PM",
    "khach_hang": {
      "ho_ten": "Tống\nKhánh Linh",
      "avatar": "assets/avatar_3.png",
      "email": "tốngkhánhlinh@st.uel.edu.vn",
      "ngay_sinh": "23/08/2000",
      "so_dien_thoai": "0919444313",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Bảo hành",
    "li_do": "Chân ghế bị lung lay",
    "trang_thai": "Từ chối",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Tủ quần áo gỗ tự nhiên",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Chân ghế bị lung lay",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#TAK000054",
    "thoi_gian": "25 Jun,\n12:11 AM",
    "khach_hang": {
      "ho_ten": "Đinh\nTiến Dũng",
      "avatar": "assets/avatar_4.png",
      "email": "đinhtiếndũng@st.uel.edu.vn",
      "ngay_sinh": "09/12/2000",
      "so_dien_thoai": "0919989413",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Bảo hành",
    "li_do": "Sản phẩm lỗi",
    "trang_thai": "Từ chối",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Tủ quần áo gỗ tự nhiên",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Sản phẩm lỗi",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#TAK000055",
    "thoi_gian": "6 Jun,\n5:00 PM",
    "khach_hang": {
      "ho_ten": "Hoàng\nKim Ngân",
      "avatar": "assets/avatar_2.png",
      "email": "hoàngkimngân@st.uel.edu.vn",
      "ngay_sinh": "09/01/2000",
      "so_dien_thoai": "0919084271",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Bảo hành",
    "li_do": "Lún nệm khi sử dụng",
    "trang_thai": "Từ chối",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Ghế Sofa Milano Shape U",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Lún nệm khi sử dụng",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#TAK000056",
    "thoi_gian": "16 Jun,\n8:28 AM",
    "khach_hang": {
      "ho_ten": "Ngô\nQuốc Bảo",
      "avatar": "assets/avatar_1.png",
      "email": "ngôquốcbảo@st.uel.edu.vn",
      "ngay_sinh": "09/08/2000",
      "so_dien_thoai": "0919116719",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Bảo hành",
    "li_do": "Chân ghế bị lung lay",
    "trang_thai": "Từ chối",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Ghế Sofa Milano Shape U",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Chân ghế bị lung lay",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#TAK000057",
    "thoi_gian": "26 Jun,\n10:19 AM",
    "khach_hang": {
      "ho_ten": "Lê\nMinh Hoàng",
      "avatar": "assets/avatar_2.png",
      "email": "lêminhhoàng@st.uel.edu.vn",
      "ngay_sinh": "04/09/2000",
      "so_dien_thoai": "0919699938",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Bảo hành",
    "li_do": "Lún nệm khi sử dụng",
    "trang_thai": "Từ chối",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Kệ tivi gỗ sồi",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Lún nệm khi sử dụng",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#TAK000058",
    "thoi_gian": "10 Jun,\n10:27 AM",
    "khach_hang": {
      "ho_ten": "Phan\nVăn Đức",
      "avatar": "assets/avatar_5.png",
      "email": "phanvănđức@st.uel.edu.vn",
      "ngay_sinh": "02/10/2000",
      "so_dien_thoai": "0919133412",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Bảo hành",
    "li_do": "Lò xo đệm bị gãy",
    "trang_thai": "Từ chối",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Bàn ăn Concorde mặt đá",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Lò xo đệm bị gãy",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#TAK000059",
    "thoi_gian": "3 Jun,\n3:00 AM",
    "khach_hang": {
      "ho_ten": "Đinh\nTiến Dũng",
      "avatar": "assets/avatar_5.png",
      "email": "đinhtiếndũng@st.uel.edu.vn",
      "ngay_sinh": "16/05/2000",
      "so_dien_thoai": "0919034471",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Bảo hành",
    "li_do": "Lún nệm khi sử dụng",
    "trang_thai": "Từ chối",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Bàn ăn Concorde mặt đá",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Lún nệm khi sử dụng",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#TAK000060",
    "thoi_gian": "22 Jun,\n4:27 AM",
    "khach_hang": {
      "ho_ten": "Võ\nThị Sáu",
      "avatar": "assets/avatar_2.png",
      "email": "võthịsáu@st.uel.edu.vn",
      "ngay_sinh": "21/03/2000",
      "so_dien_thoai": "0919421024",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Bảo hành",
    "li_do": "Bề mặt da bong tróc",
    "trang_thai": "Hoàn thành",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Giường ngủ bọc da Luxury",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Bề mặt da bong tróc",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#TAK000061",
    "thoi_gian": "30 Jun,\n5:28 AM",
    "khach_hang": {
      "ho_ten": "Võ\nThị Sáu",
      "avatar": "assets/avatar_3.png",
      "email": "võthịsáu@st.uel.edu.vn",
      "ngay_sinh": "23/07/2000",
      "so_dien_thoai": "0919488771",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Bảo hành",
    "li_do": "Đèn LED không sáng",
    "trang_thai": "Hoàn thành",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Giường ngủ bọc da Luxury",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Đèn LED không sáng",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#TAK000062",
    "thoi_gian": "24 Jun,\n6:38 AM",
    "khach_hang": {
      "ho_ten": "Dương\nGia Bảo",
      "avatar": "assets/avatar_1.png",
      "email": "dươnggiabảo@st.uel.edu.vn",
      "ngay_sinh": "08/11/2000",
      "so_dien_thoai": "0919990490",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Bảo hành",
    "li_do": "Sản phẩm lỗi",
    "trang_thai": "Hoàn thành",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Bàn ăn Concorde mặt đá",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Sản phẩm lỗi",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#TAK000063",
    "thoi_gian": "21 Jun,\n8:58 AM",
    "khach_hang": {
      "ho_ten": "Tống\nKhánh Linh",
      "avatar": "assets/avatar_5.png",
      "email": "tốngkhánhlinh@st.uel.edu.vn",
      "ngay_sinh": "14/11/2000",
      "so_dien_thoai": "0919717565",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Bảo hành",
    "li_do": "Lò xo đệm bị gãy",
    "trang_thai": "Hoàn thành",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Tủ quần áo gỗ tự nhiên",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Lò xo đệm bị gãy",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#TAK000064",
    "thoi_gian": "28 Jun,\n3:21 AM",
    "khach_hang": {
      "ho_ten": "Nguyễn\nTiến Đạt",
      "avatar": "assets/avatar_4.png",
      "email": "nguyễntiếnđạt@st.uel.edu.vn",
      "ngay_sinh": "10/11/2000",
      "so_dien_thoai": "0919680715",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Bảo hành",
    "li_do": "Đèn LED không sáng",
    "trang_thai": "Hoàn thành",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Tủ quần áo gỗ tự nhiên",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Đèn LED không sáng",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#TAK000065",
    "thoi_gian": "25 Jun,\n7:55 PM",
    "khach_hang": {
      "ho_ten": "Nguyễn\nTiến Đạt",
      "avatar": "assets/avatar_1.png",
      "email": "nguyễntiếnđạt@st.uel.edu.vn",
      "ngay_sinh": "22/09/2000",
      "so_dien_thoai": "0919760385",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Bảo hành",
    "li_do": "Bề mặt da bong tróc",
    "trang_thai": "Hoàn thành",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Giường ngủ bọc da Luxury",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Bề mặt da bong tróc",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#TAK000066",
    "thoi_gian": "21 Jun,\n8:48 AM",
    "khach_hang": {
      "ho_ten": "Trịnh\nCông Sơn",
      "avatar": "assets/avatar_3.png",
      "email": "trịnhcôngsơn@st.uel.edu.vn",
      "ngay_sinh": "18/03/2000",
      "so_dien_thoai": "0919477109",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Bảo hành",
    "li_do": "Hỏng chốt khóa",
    "trang_thai": "Hoàn thành",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Bàn ăn Concorde mặt đá",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Hỏng chốt khóa",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#TAK000067",
    "thoi_gian": "10 Jun,\n9:00 PM",
    "khach_hang": {
      "ho_ten": "Phạm\nThanh Sơn",
      "avatar": "assets/avatar_1.png",
      "email": "phạmthanhsơn@st.uel.edu.vn",
      "ngay_sinh": "08/02/2000",
      "so_dien_thoai": "0919712748",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Bảo hành",
    "li_do": "Đèn LED không sáng",
    "trang_thai": "Hoàn thành",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Tủ quần áo gỗ tự nhiên",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Đèn LED không sáng",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#TAK000068",
    "thoi_gian": "16 Jun,\n4:29 PM",
    "khach_hang": {
      "ho_ten": "Trịnh\nCông Sơn",
      "avatar": "assets/avatar_4.png",
      "email": "trịnhcôngsơn@st.uel.edu.vn",
      "ngay_sinh": "07/10/2000",
      "so_dien_thoai": "0919821465",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Bảo hành",
    "li_do": "Lò xo đệm bị gãy",
    "trang_thai": "Hoàn thành",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Giường ngủ bọc da Luxury",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Lò xo đệm bị gãy",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#TAK000069",
    "thoi_gian": "10 Jun,\n12:19 PM",
    "khach_hang": {
      "ho_ten": "Hoàng\nHuy Tiến",
      "avatar": "assets/avatar_5.png",
      "email": "hoànghuytiến@st.uel.edu.vn",
      "ngay_sinh": "22/08/2000",
      "so_dien_thoai": "0919278755",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Bảo hành",
    "li_do": "Bề mặt da bong tróc",
    "trang_thai": "Hoàn thành",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Giường ngủ bọc da Luxury",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Bề mặt da bong tróc",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#TAK000070",
    "thoi_gian": "13 Jun,\n8:59 AM",
    "khach_hang": {
      "ho_ten": "Đinh\nTiến Dũng",
      "avatar": "assets/avatar_2.png",
      "email": "đinhtiếndũng@st.uel.edu.vn",
      "ngay_sinh": "23/04/2000",
      "so_dien_thoai": "0919963605",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Bảo hành",
    "li_do": "Hỏng chốt khóa",
    "trang_thai": "Hoàn thành",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Kệ tivi gỗ sồi",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Hỏng chốt khóa",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#TAK000071",
    "thoi_gian": "13 Jun,\n11:50 PM",
    "khach_hang": {
      "ho_ten": "Lý\nThanh Hải",
      "avatar": "assets/avatar_2.png",
      "email": "lýthanhhải@st.uel.edu.vn",
      "ngay_sinh": "16/01/2000",
      "so_dien_thoai": "0919289517",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Bảo hành",
    "li_do": "Đèn LED không sáng",
    "trang_thai": "Hoàn thành",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Ghế Sofa Milano Shape U",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Đèn LED không sáng",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#TAK000072",
    "thoi_gian": "1 Jun,\n12:09 AM",
    "khach_hang": {
      "ho_ten": "Phan\nVăn Đức",
      "avatar": "assets/avatar_2.png",
      "email": "phanvănđức@st.uel.edu.vn",
      "ngay_sinh": "03/08/2000",
      "so_dien_thoai": "0919459615",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Bảo hành",
    "li_do": "Chân ghế bị lung lay",
    "trang_thai": "Hoàn thành",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Giường ngủ bọc da Luxury",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Chân ghế bị lung lay",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#TAK000073",
    "thoi_gian": "21 Jun,\n12:56 PM",
    "khach_hang": {
      "ho_ten": "Đỗ\nHải Đăng",
      "avatar": "assets/avatar_5.png",
      "email": "đỗhảiđăng@st.uel.edu.vn",
      "ngay_sinh": "02/10/2000",
      "so_dien_thoai": "0919134316",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Bảo hành",
    "li_do": "Lò xo đệm bị gãy",
    "trang_thai": "Hoàn thành",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Ghế Sofa Milano Shape U",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Lò xo đệm bị gãy",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#TAK000074",
    "thoi_gian": "15 Jun,\n3:44 AM",
    "khach_hang": {
      "ho_ten": "Nguyễn\nTiến Đạt",
      "avatar": "assets/avatar_1.png",
      "email": "nguyễntiếnđạt@st.uel.edu.vn",
      "ngay_sinh": "02/06/2000",
      "so_dien_thoai": "0919045562",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Bảo hành",
    "li_do": "Hỏng chốt khóa",
    "trang_thai": "Hoàn thành",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Bàn ăn Concorde mặt đá",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Hỏng chốt khóa",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#TAK000075",
    "thoi_gian": "19 Jun,\n11:50 AM",
    "khach_hang": {
      "ho_ten": "Dương\nGia Bảo",
      "avatar": "assets/avatar_2.png",
      "email": "dươnggiabảo@st.uel.edu.vn",
      "ngay_sinh": "03/10/2000",
      "so_dien_thoai": "0919693792",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Bảo hành",
    "li_do": "Chân ghế bị lung lay",
    "trang_thai": "Hoàn thành",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Bàn ăn Concorde mặt đá",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Chân ghế bị lung lay",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#TAK000076",
    "thoi_gian": "15 Jun,\n5:42 AM",
    "khach_hang": {
      "ho_ten": "Bùi\nThị Mai",
      "avatar": "assets/avatar_4.png",
      "email": "bùithịmai@st.uel.edu.vn",
      "ngay_sinh": "10/11/2000",
      "so_dien_thoai": "0919821759",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Bảo hành",
    "li_do": "Lò xo đệm bị gãy",
    "trang_thai": "Hoàn thành",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Tủ quần áo gỗ tự nhiên",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Lò xo đệm bị gãy",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#TAK000077",
    "thoi_gian": "23 Jun,\n5:29 PM",
    "khach_hang": {
      "ho_ten": "Dương\nGia Bảo",
      "avatar": "assets/avatar_2.png",
      "email": "dươnggiabảo@st.uel.edu.vn",
      "ngay_sinh": "13/08/2000",
      "so_dien_thoai": "0919136959",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Bảo hành",
    "li_do": "Đèn LED không sáng",
    "trang_thai": "Hoàn thành",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Tủ quần áo gỗ tự nhiên",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Đèn LED không sáng",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#TAK000078",
    "thoi_gian": "1 Jun,\n11:25 AM",
    "khach_hang": {
      "ho_ten": "Ngô\nQuốc Bảo",
      "avatar": "assets/avatar_5.png",
      "email": "ngôquốcbảo@st.uel.edu.vn",
      "ngay_sinh": "28/11/2000",
      "so_dien_thoai": "0919097439",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Bảo hành",
    "li_do": "Đèn LED không sáng",
    "trang_thai": "Hoàn thành",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Tủ quần áo gỗ tự nhiên",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Đèn LED không sáng",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#TAK000079",
    "thoi_gian": "20 Jun,\n5:43 PM",
    "khach_hang": {
      "ho_ten": "Đặng\nMỹ Linh",
      "avatar": "assets/avatar_2.png",
      "email": "đặngmỹlinh@st.uel.edu.vn",
      "ngay_sinh": "21/02/2000",
      "so_dien_thoai": "0919047095",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Bảo hành",
    "li_do": "Lún nệm khi sử dụng",
    "trang_thai": "Hoàn thành",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Bàn ăn Concorde mặt đá",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Lún nệm khi sử dụng",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#TAK000080",
    "thoi_gian": "11 Jun,\n12:26 AM",
    "khach_hang": {
      "ho_ten": "Ngô\nQuốc Bảo",
      "avatar": "assets/avatar_2.png",
      "email": "ngôquốcbảo@st.uel.edu.vn",
      "ngay_sinh": "26/09/2000",
      "so_dien_thoai": "0919588424",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Bảo hành",
    "li_do": "Sản phẩm lỗi",
    "trang_thai": "Hoàn thành",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Kệ tivi gỗ sồi",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Sản phẩm lỗi",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#TAK000081",
    "thoi_gian": "24 Jun,\n6:51 AM",
    "khach_hang": {
      "ho_ten": "Ngô\nQuốc Bảo",
      "avatar": "assets/avatar_1.png",
      "email": "ngôquốcbảo@st.uel.edu.vn",
      "ngay_sinh": "05/04/2000",
      "so_dien_thoai": "0919685160",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Bảo hành",
    "li_do": "Hỏng chốt khóa",
    "trang_thai": "Hoàn thành",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Tủ quần áo gỗ tự nhiên",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Hỏng chốt khóa",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#TAK000082",
    "thoi_gian": "15 Jun,\n6:43 PM",
    "khach_hang": {
      "ho_ten": "Nguyễn\nTiến Đạt",
      "avatar": "assets/avatar_3.png",
      "email": "nguyễntiếnđạt@st.uel.edu.vn",
      "ngay_sinh": "19/07/2000",
      "so_dien_thoai": "0919513709",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Bảo hành",
    "li_do": "Chân ghế bị lung lay",
    "trang_thai": "Hoàn thành",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Giường ngủ bọc da Luxury",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Chân ghế bị lung lay",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#TAK000083",
    "thoi_gian": "8 Jun,\n11:04 PM",
    "khach_hang": {
      "ho_ten": "Cao\nMinh Tú",
      "avatar": "assets/avatar_4.png",
      "email": "caominhtú@st.uel.edu.vn",
      "ngay_sinh": "23/05/2000",
      "so_dien_thoai": "0919612004",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Bảo hành",
    "li_do": "Bề mặt da bong tróc",
    "trang_thai": "Hoàn thành",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Kệ tivi gỗ sồi",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Bề mặt da bong tróc",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#TAK000084",
    "thoi_gian": "8 Jun,\n9:08 AM",
    "khach_hang": {
      "ho_ten": "Nguyễn\nTiến Đạt",
      "avatar": "assets/avatar_3.png",
      "email": "nguyễntiếnđạt@st.uel.edu.vn",
      "ngay_sinh": "22/12/2000",
      "so_dien_thoai": "0919869261",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Bảo hành",
    "li_do": "Sản phẩm lỗi",
    "trang_thai": "Hoàn thành",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Kệ tivi gỗ sồi",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Sản phẩm lỗi",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#TAK000085",
    "thoi_gian": "9 Jun,\n1:44 AM",
    "khach_hang": {
      "ho_ten": "Dương\nGia Bảo",
      "avatar": "assets/avatar_4.png",
      "email": "dươnggiabảo@st.uel.edu.vn",
      "ngay_sinh": "15/04/2000",
      "so_dien_thoai": "0919515850",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Bảo hành",
    "li_do": "Chân ghế bị lung lay",
    "trang_thai": "Hoàn thành",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Kệ tivi gỗ sồi",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Chân ghế bị lung lay",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#TAK000086",
    "thoi_gian": "4 Jun,\n8:05 PM",
    "khach_hang": {
      "ho_ten": "Đặng\nMỹ Linh",
      "avatar": "assets/avatar_5.png",
      "email": "đặngmỹlinh@st.uel.edu.vn",
      "ngay_sinh": "01/01/2000",
      "so_dien_thoai": "0919532931",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Bảo hành",
    "li_do": "Bề mặt da bong tróc",
    "trang_thai": "Hoàn thành",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Giường ngủ bọc da Luxury",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Bề mặt da bong tróc",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#TAK000087",
    "thoi_gian": "7 Jun,\n4:21 PM",
    "khach_hang": {
      "ho_ten": "Võ\nThị Sáu",
      "avatar": "assets/avatar_5.png",
      "email": "võthịsáu@st.uel.edu.vn",
      "ngay_sinh": "01/05/2000",
      "so_dien_thoai": "0919228421",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Bảo hành",
    "li_do": "Lún nệm khi sử dụng",
    "trang_thai": "Hoàn thành",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Ghế Sofa Milano Shape U",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Lún nệm khi sử dụng",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#TAK000088",
    "thoi_gian": "12 Jun,\n4:37 AM",
    "khach_hang": {
      "ho_ten": "Hoàng\nHuy Tiến",
      "avatar": "assets/avatar_2.png",
      "email": "hoànghuytiến@st.uel.edu.vn",
      "ngay_sinh": "09/01/2000",
      "so_dien_thoai": "0919268117",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Bảo hành",
    "li_do": "Lún nệm khi sử dụng",
    "trang_thai": "Hoàn thành",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Kệ tivi gỗ sồi",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Lún nệm khi sử dụng",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#TAK000089",
    "thoi_gian": "17 Jun,\n10:06 AM",
    "khach_hang": {
      "ho_ten": "Hoàng\nKim Ngân",
      "avatar": "assets/avatar_2.png",
      "email": "hoàngkimngân@st.uel.edu.vn",
      "ngay_sinh": "20/01/2000",
      "so_dien_thoai": "0919847007",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Bảo hành",
    "li_do": "Hỏng chốt khóa",
    "trang_thai": "Hoàn thành",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Kệ tivi gỗ sồi",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Hỏng chốt khóa",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#TAK000090",
    "thoi_gian": "16 Jun,\n12:58 AM",
    "khach_hang": {
      "ho_ten": "Nguyễn\nTiến Đạt",
      "avatar": "assets/avatar_1.png",
      "email": "nguyễntiếnđạt@st.uel.edu.vn",
      "ngay_sinh": "11/10/2000",
      "so_dien_thoai": "0919212499",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Bảo hành",
    "li_do": "Lò xo đệm bị gãy",
    "trang_thai": "Hoàn thành",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Giường ngủ bọc da Luxury",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Lò xo đệm bị gãy",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#TAK000091",
    "thoi_gian": "13 Jun,\n10:33 AM",
    "khach_hang": {
      "ho_ten": "Đỗ\nHải Đăng",
      "avatar": "assets/avatar_5.png",
      "email": "đỗhảiđăng@st.uel.edu.vn",
      "ngay_sinh": "20/07/2000",
      "so_dien_thoai": "0919118367",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Bảo hành",
    "li_do": "Đèn LED không sáng",
    "trang_thai": "Hoàn thành",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Bàn ăn Concorde mặt đá",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Đèn LED không sáng",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#TAK000092",
    "thoi_gian": "27 Jun,\n8:25 AM",
    "khach_hang": {
      "ho_ten": "Đỗ\nHải Đăng",
      "avatar": "assets/avatar_1.png",
      "email": "đỗhảiđăng@st.uel.edu.vn",
      "ngay_sinh": "11/07/2000",
      "so_dien_thoai": "0919545271",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Bảo hành",
    "li_do": "Lò xo đệm bị gãy",
    "trang_thai": "Hoàn thành",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Ghế Sofa Milano Shape U",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Lò xo đệm bị gãy",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  },
  {
    "id": "#TAK000093",
    "thoi_gian": "3 Jun,\n7:06 PM",
    "khach_hang": {
      "ho_ten": "Trần\nAnh Khoa",
      "avatar": "assets/avatar_3.png",
      "email": "trầnanhkhoa@st.uel.edu.vn",
      "ngay_sinh": "26/03/2000",
      "so_dien_thoai": "0919809885",
      "dia_chi": "Số 18, đường Hoàng Diệu, Tân An, Phường Lagi, tỉnh Lâm Đồng"
    },
    "loai_hau_mai": "Bảo hành",
    "li_do": "Hỏng chốt khóa",
    "trang_thai": "Hoàn thành",
    "chi_tiet_san_pham": {
      "ten_san_pham": "Ghế Sofa Milano Shape U",
      "phan_loai": "Ghế 2 chỗ, Trắng Kem",
      "loi_gap_phai": "Hỏng chốt khóa",
      "mo_ta_chi_tiet": "Khách hàng phản ánh sản phẩm chưa đúng kỳ vọng sau khi nhận hàng. Bộ phận hậu mãi cần kiểm tra minh chứng và phản hồi phương án xử lý phù hợp.",
      "hinh_anh_minh_chung": [
        "assets/proof1.png",
        "assets/proof2.png",
        "assets/proof3.png"
      ]
    }
  }
];

const state = {
  rawData: [],
  filteredData: [],
  tab: "Tất cả",
  status: "Tất cả",
  time: "Tất cả",
  search: "",
  currentPage: 1,
  pageSize: 5,
  selectedKey: null
};

const els = {
  tableBody: document.getElementById("tableBody"),
  detailPanel: document.getElementById("detailPanel"),
  searchInput: document.getElementById("searchInput"),
  total: document.getElementById("metricTotal"),
  pending: document.getElementById("metricPending"),
  rejected: document.getElementById("metricRejected"),
  done: document.getElementById("metricDone"),
  paginationText: document.getElementById("paginationText"),
  prevPage: document.getElementById("prevPage"),
  nextPage: document.getElementById("nextPage"),
  toast: document.getElementById("toast")
};

async function init() {
  try {
    const res = await fetch("data.json", { cache: "no-store" });
    if (!res.ok) throw new Error("Không đọc được data.json");
    state.rawData = await res.json();
  } catch (error) {
    // Khi mở trực tiếp bằng file://, một số trình duyệt chặn fetch().
    // Dữ liệu dự phòng giúp giao diện vẫn chạy đầy đủ tương tác.
    state.rawData = structuredClone(FALLBACK_DATA);
    showToast("Đang dùng dữ liệu dự phòng. Nếu muốn đọc data.json trực tiếp, hãy mở bằng Live Server.");
  }

  // Gắn khóa nội bộ duy nhất để tránh lỗi khi có nhiều dòng trùng ID.
  state.rawData = state.rawData.map((item, index) => ({ ...item, __key: String(index) }));

  bindEvents();
  applyFilters();
}

function bindEvents() {
  document.querySelectorAll(".tab").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach(x => x.classList.remove("active"));
      btn.classList.add("active");
      state.tab = btn.dataset.tab;
      state.currentPage = 1;
      state.selectedKey = null;
      closeDetail(false);
      applyFilters();
    });
  });

  els.searchInput.addEventListener("input", e => {
    state.search = e.target.value.trim();
    state.currentPage = 1;
    applyFilters();
  });

  document.querySelectorAll(".custom-select").forEach(select => {
    const trigger = select.querySelector(".select-trigger");
    const valueNode = select.querySelector(".select-value");

    trigger.addEventListener("click", e => {
      e.stopPropagation();
      document.querySelectorAll(".custom-select.open").forEach(x => {
        if (x !== select) toggleSelect(x, false);
      });
      toggleSelect(select, !select.classList.contains("open"));
    });

    select.querySelectorAll(".select-menu button").forEach(option => {
      option.addEventListener("click", e => {
        e.stopPropagation();
        const value = option.dataset.value;
        valueNode.textContent = value;
        if (select.dataset.select === "status") state.status = value;
        if (select.dataset.select === "time") state.time = value;
        state.currentPage = 1;
        state.selectedKey = null;
        closeDetail(false);
        toggleSelect(select, false);
        applyFilters();
      });
    });
  });

  document.addEventListener("click", () => {
    document.querySelectorAll(".custom-select.open").forEach(x => toggleSelect(x, false));
  });

  els.prevPage.addEventListener("click", () => {
    if (state.currentPage > 1) {
      state.currentPage -= 1;
      state.selectedKey = null;
      closeDetail(false);
      renderTable();
    }
  });

  els.nextPage.addEventListener("click", () => {
    const totalPages = Math.max(1, Math.ceil(state.filteredData.length / state.pageSize));
    if (state.currentPage < totalPages) {
      state.currentPage += 1;
      state.selectedKey = null;
      closeDetail(false);
      renderTable();
    }
  });

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) logoutBtn.addEventListener("click", () => showToast("Đã bấm đăng xuất Admin"));
}

function toggleSelect(select, open) {
  select.classList.toggle("open", open);
  const trigger = select.querySelector(".select-trigger");
  trigger.setAttribute("aria-expanded", open ? "true" : "false");
}

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function applyFilters() {
  const search = normalizeText(state.search);

  state.filteredData = state.rawData.filter(item => {
    const byTab = state.tab === "Tất cả" || item.loai_hau_mai === state.tab;
    const byStatus = state.status === "Tất cả" || item.trang_thai === state.status;
    const byTime = state.time === "Tất cả" || matchTime(item.thoi_gian, state.time);
    const searchableText = `${item.id} ${item.khach_hang?.ho_ten || ""} ${item.li_do || ""}`;
    const bySearch = !search || normalizeText(searchableText).includes(search);
    return byTab && byStatus && byTime && bySearch;
  });

  updateMetrics();
  renderTable();
}

function matchTime(time, value) {
  const t = normalizeText(time);
  if (value === "Hôm nay") return t.includes("hom nay");
  if (value === "Hôm qua") return t.includes("hom qua");
  if (value === "Tháng 6") return t.includes("jun");
  return true;
}

function updateMetrics() {
  const data = state.filteredData;
  els.total.textContent = data.length;
  els.pending.textContent = data.filter(x => x.trang_thai === "Chờ xét duyệt").length;
  els.rejected.textContent = data.filter(x => x.trang_thai === "Từ chối").length;
  els.done.textContent = data.filter(x => x.trang_thai === "Hoàn thành").length;
}

function renderTable() {
  const total = state.filteredData.length;
  const totalPages = Math.max(1, Math.ceil(total / state.pageSize));
  if (state.currentPage > totalPages) state.currentPage = totalPages;

  const start = (state.currentPage - 1) * state.pageSize;
  const pageItems = state.filteredData.slice(start, start + state.pageSize);

  if (!pageItems.length) {
    els.tableBody.innerHTML = `<div class="empty-row">Không có yêu cầu phù hợp với bộ lọc hiện tại.</div>`;
  } else {
    els.tableBody.innerHTML = pageItems.map(item => renderRow(item)).join("");
  }

  const first = total === 0 ? 0 : start + 1;
  const last = Math.min(start + state.pageSize, total);
  els.paginationText.textContent = `Hiển thị ${first}-${last} trong tổng ${total}`;
  els.prevPage.disabled = state.currentPage <= 1;
  els.nextPage.disabled = state.currentPage >= totalPages;

  document.querySelectorAll(".table-row").forEach(row => {
    row.addEventListener("click", () => openDetail(row.dataset.key));
  });
}

function renderRow(item) {
  const rowClass = state.selectedKey === item.__key ? "table-row grid-row selected" : "table-row grid-row";
  const avatar = item.khach_hang?.avatar || "assets/avatar_1.png";
  const name = String(item.khach_hang?.ho_ten || "Không rõ").replace(/\n/g, " ");
  const initials = getInitials(name);
  const avatarHtml = `<img src="${escapeAttr(avatar)}" alt="" onerror="this.style.display='none'; this.nextElementSibling.style.display='grid'" /><span class="avatar-fallback" aria-hidden="true">${initials}</span>`;

  return `
    <button class="${rowClass}" data-key="${escapeAttr(item.__key)}" type="button" aria-label="Xem chi tiết ${escapeAttr(item.id)}">
      <span class="cell cell-id" title="${escapeAttr(item.id)}">${escapeHtml(item.id)}</span>
      <span class="cell cell-time">${escapeHtml(item.thoi_gian)}</span>
      <span class="cell customer">${avatarHtml}<strong title="${escapeAttr(name)}">${escapeHtml(name)}</strong></span>
      <span class="cell cell-center"><span class="badge ${item.loai_hau_mai === "Đổi trả" ? "type-return" : "type-warranty"}">${escapeHtml(item.loai_hau_mai)}</span></span>
      <span class="cell reason" title="${escapeAttr(item.li_do)}">${escapeHtml(item.li_do)}</span>
      <span class="cell cell-center"><span class="badge ${statusClass(item.trang_thai)}">${escapeHtml(item.trang_thai)}</span></span>
    </button>`;
}

function getInitials(name) {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "--";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[parts.length - 2][0] || ""}${parts[parts.length - 1][0] || ""}`.toUpperCase();
}

function statusClass(status) {
  if (status === "Hoàn thành") return "status-done";
  if (status === "Từ chối") return "status-rejected";
  return "status-pending";
}

function openDetail(key) {
  const item = state.rawData.find(x => x.__key === key);
  if (!item) return;

  state.selectedKey = key;
  renderTable();

  const detailTitle = item.loai_hau_mai === "Đổi trả" ? "Chi tiết Đổi trả" : "Chi tiết Bảo hành";
  const detailTypeTitle = item.loai_hau_mai === "Đổi trả" ? "Thông tin đổi trả" : "Thông tin bảo hành";
  const codeLabel = item.loai_hau_mai === "Đổi trả" ? "Mã đổi/trả:" : "Mã bảo hành:";
  const requestExtra = item.loai_hau_mai === "Đổi trả"
    ? `<div class="info-item"><b>Yêu cầu:</b><span>Đổi hàng</span></div>`
    : "";
  const proofImages = (item.chi_tiet_san_pham?.hinh_anh_minh_chung || [])
    .map(src => `<img src="${escapeAttr(src)}" alt="Hình ảnh minh chứng" />`).join("");

  els.detailPanel.innerHTML = `
    <div class="detail-head">
      <h3>${detailTitle} ${escapeHtml(item.id)}</h3>
      <button class="close-detail" type="button" aria-label="Đóng chi tiết">×</button>
    </div>

    <div class="info-section customer-section">
      <h4>Thông tin khách hàng</h4>
      <div class="info-grid">
        <div class="info-item"><b>Họ và tên:</b><span>${escapeHtml(item.khach_hang.ho_ten).replaceAll("\n", " ")}</span></div>
        <div class="info-item"><b>Email:</b><span>${escapeHtml(item.khach_hang.email)}</span></div>
        <div class="info-item"><b>Ngày sinh:</b><span>${escapeHtml(item.khach_hang.ngay_sinh)}</span></div>
        <div class="info-item"><b>Số điện thoại:</b><span>${escapeHtml(item.khach_hang.so_dien_thoai)}</span></div>
        <div class="info-item wide"><b>Địa chỉ:</b><span>${escapeHtml(item.khach_hang.dia_chi)}</span></div>
      </div>
    </div>

    <div class="info-section request-section">
      <h4>${detailTypeTitle}</h4>
      <p class="product-title">${escapeHtml(item.chi_tiet_san_pham.ten_san_pham)}</p>
      <div class="info-grid">
        <div class="info-item"><b>${codeLabel}</b><span>${escapeHtml(item.id.replace("#", ""))}</span></div>
        ${requestExtra}
        <div class="info-item"><b>Phân loại:</b><span>${escapeHtml(item.chi_tiet_san_pham.phan_loai)}</span></div>
        <div class="info-item"><b>Tình trạng:</b><span>${escapeHtml(item.trang_thai)}</span></div>
        <div class="info-item wide"><b>Lỗi gặp phải:</b><span>${escapeHtml(item.chi_tiet_san_pham.loi_gap_phai)}</span></div>
        <div class="info-item wide"><b>Mô tả chi tiết:</b><span>${escapeHtml(item.chi_tiet_san_pham.mo_ta_chi_tiet)}</span></div>
      </div>
      <p class="product-title proof-title">Hình ảnh minh chứng:</p>
      <div class="proof-list">${proofImages}</div>
    </div>

    <div class="feedback">
      <label for="replyText">Phản hồi đến khách hàng <span class="required">*</span></label>
      <textarea id="replyText" placeholder="Để lại phản hồi cho khách hàng..."></textarea>
      <div class="modal-actions">
        <button class="action-btn reject" type="button" data-action="reject">Từ chối yêu cầu</button>
        <button class="action-btn approve" type="button" data-action="approve">Duyệt yêu cầu</button>
      </div>
    </div>`;

  els.detailPanel.classList.remove("hidden");
  els.detailPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
  els.detailPanel.querySelector(".close-detail").addEventListener("click", () => closeDetail(true));
  els.detailPanel.querySelector("[data-action='approve']").addEventListener("click", () => mutateStatus(key, "Hoàn thành"));
  els.detailPanel.querySelector("[data-action='reject']").addEventListener("click", () => mutateStatus(key, "Từ chối"));
}

function closeDetail(shouldRender = true) {
  state.selectedKey = null;
  els.detailPanel.classList.add("hidden");
  els.detailPanel.innerHTML = "";
  if (shouldRender) renderTable();
}

function mutateStatus(key, nextStatus) {
  const item = state.rawData.find(x => x.__key === key);
  if (!item) return;

  item.trang_thai = nextStatus;
  closeDetail(false);
  applyFilters();
  showToast(`Đã cập nhật ${item.id} thành “${nextStatus}”.`);
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => els.toast.classList.remove("show"), 2600);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/\n/g, " ");
}

init();
