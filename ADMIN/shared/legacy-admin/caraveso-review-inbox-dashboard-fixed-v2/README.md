# CaraVeso - Quản lý đánh giá sản phẩm & Inbox

Mở `index.html` bằng Live Server để `fetch('reviews.json')` hoạt động ổn định. Nếu mở trực tiếp bằng `file://`, mã nguồn vẫn có fallback data và lưu vào `localStorage`.

Các file chính:
- `index.html`: cấu trúc SPA.
- `style.css`: giao diện theo phong cách Figma, có CSS variables.
- `script.js`: render dữ liệu, lọc, phản hồi, chuyển sang Inbox, lưu `localStorage`.
- `reviews.json`: 50 bản ghi đánh giá mẫu.
- `assets/`: icon sidebar, avatar, ảnh sản phẩm và ảnh minh chứng.
