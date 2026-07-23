# Ảnh sản phẩm CaraVeso

Đường dẫn ảnh của từng sản phẩm được khai báo trong `data/products.json` (trường `img`).
Bảng dưới là ảnh đang được gán cho mỗi sản phẩm.

Muốn đổi ảnh: bỏ file mới vào thư mục này rồi sửa lại `img` tương ứng trong `data/products.json`.

| ID | Sản phẩm | File ảnh đang dùng | Ghi chú |
|----|----------|--------------------|---------|
| 1  | Nệm Kymdan Long Thành        | `nem-kymdan-long-thanh.webp`     | ✅ nệm |
| 2  | Ghế Sofa Milano Shape U      | `ghe.webp`                       | ✅ ghế bọc bouclé trắng kem (khớp mô tả) |
| 3  | Ghế Sofa CaraVeso Vintage    | `ghe-sofa-caraveso-vintage.webp` | ✅ sofa (vàng mustard) |
| 4  | Bàn Trà Đá Marble Tròn       | `ke.webp`                        | ⚠️ tạm dùng ảnh tủ đầu giường — **cần ảnh bàn trà** |
| 5  | Tủ Quần Áo Oak Wood 4 Cánh   | `tu-quan-ao-oak-wood-4-canh.webp`| ✅ tủ quần áo |
| 6  | Đèn Sàn Nordic Linen         | `den.webp`                       | ✅ đèn |
| 7  | Ghế Sofa Góc L-Shape Boucle  | `sofa.webp`                      | ✅ sofa (xám) |
| 8  | Bàn Ăn Gỗ Óc Chó 6 Ghế       | `ban.webp`                       | ✅ bàn (thay ảnh giường cũ) |
| 9  | Kệ Tivi Treo Tường Smoke     | `kebep.webp`                     | ✅ tủ/kệ treo tường |
| 10 | Ghế Sofa Văng Nỉ Cloud       | `ghe-sofa-caraveso-vintage.webp` | dùng lại ảnh sofa (vàng) |
| 11 | Gương Đứng Viền Kim Loại Arc | `rem.webp`                       | ⚠️ tạm dùng ảnh rèm — **cần ảnh gương** |
| 12 | Bộ Chăn Ga Gối Cotton Sateen | `goi1.webp`                      | ✅ vỏ gối sateen |
| 13 | Ghế Sofa Đơn Armchair Teddy  | `ghe-sofa-milano-shape-u.webp`   | ✅ ghế đơn (mây) |
| 14 | Tủ Giày Thông Minh Slim      | `tu-quan-ao-oak-wood-4-canh.webp`| dùng lại ảnh tủ |
| 15 | Đèn Thả Trần Rattan Bali     | `den.webp`                       | dùng lại ảnh đèn |
| 16 | Ghế Sofa Chữ U Emerald       | `sofa.webp`                      | dùng lại ảnh sofa (xám) |

## Ảnh dùng cho card danh mục (trang room.html)
`giuong.webp`, `ghe-go.webp` (ghế gỗ), `loha.webp` (thảm) được dùng làm ảnh đại diện danh mục
trong `js/main.js` (map `CAT_IMAGES`).

## Cần bổ sung ảnh đúng loại
Còn thiếu ảnh đúng cho: **bàn trà (4)**, **gương (11)** — đang gán tạm.
Nếu có ảnh thật cho các mục này, bỏ vào thư mục rồi cập nhật `data/products.json`.

## File chưa dùng
`bed.webp`, `bed1.webp`, `nem.webp`, `goi.webp`, `moc.webp` (móc treo) — hiện chưa gán cho sản phẩm/danh mục nào.
