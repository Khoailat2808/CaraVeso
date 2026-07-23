# CaraVeso source structure

This project was reorganized from two top-level interface folders into:

```text
.
├── Khach-Hang/
├── Admin/
└── data/
```

The refactor only changes file locations, folder structure, and relative paths. It does not intentionally change UI, content, business logic, data fields, images, colors, fonts, effects, or workflows.

## Customer pages

Customer pages are in `Khach-Hang/`. Each page has its own folder with `index.html`, plus a page-local `style.css` and `script.js` placeholder when the page uses shared assets.

- `trang-chu/`
- `danh-muc-san-pham/`
- `san-pham/`
- `chi-tiet-san-pham/`
- `danh-muc-cac-phong/`
- `phong/`
- `phong-cach/`
- `khuyen-mai/`
- `gio-hang/`
- `thanh-toan/`
- `phuong-thuc-thanh-toan/`
- `cong-thanh-toan/`
- `dat-hang-thanh-cong/`
- `dang-nhap/`
- `dang-ky/`
- `tai-khoan/`
- `sua-tai-khoan/`
- `doi-mat-khau/`
- `dia-chi/`
- `yeu-thich/`
- `don-hang/`
- `chi-tiet-don-hang/`
- `danh-gia/`
- `chi-tiet-dich-vu/`
- `bao-hanh/`
- `thong-tin-bao-hanh/`
- `yeu-cau-doi-tra/`
- `chatbox-ai/`
- `chi-tiet-san-pham-chatbox/`

Customer shared files:

- `Khach-Hang/shared/css/style.css`
- `Khach-Hang/shared/css/warranty.css`
- `Khach-Hang/shared/js/data.js`
- `Khach-Hang/shared/js/main.js`
- `Khach-Hang/shared/img/`

Customer start page:

- `Khach-Hang/trang-chu/index.html`

## Admin pages

Admin pages are in `Admin/`. Each page has its own folder with `index.html`, `style.css`, and `script.js`.

- `tong-quan/`
- `quan-ly-don-hang/`
- `quan-ly-khach-hang/`
- `quan-ly-san-pham/`
- `quan-ly-noi-dung/`
- `quan-ly-danh-muc/`
- `quan-ly-thanh-toan/`
- `quan-ly-voucher/`
- `quan-ly-hau-mai/`
- `cham-soc-khach-hang/`

Admin shared files:

- `Admin/shared/styles.css`
- `Admin/shared/data.js`
- `Admin/shared/app.js`
- `Admin/shared/Image/`
- `Admin/shared/legacy-admin/`

Admin start page:

- `Admin/tong-quan/index.html`

## Data files

Shared JSON data now lives under root `data/`.

Customer data:

- `data/customer/account.json`
- `data/customer/catalog.json`
- `data/customer/chat-products.json`
- `data/customer/collections.json`
- `data/customer/footer-links.json`
- `data/customer/hero-slides.json`
- `data/customer/initial-cart.json`
- `data/customer/inspirations.json`
- `data/customer/locations.json`
- `data/customer/nav-items.json`
- `data/customer/product-types.json`
- `data/customer/products.json`
- `data/customer/reviews.json`
- `data/customer/rooms.json`
- `data/customer/search-suggestions.json`
- `data/customer/styles.json`
- `data/customer/vouchers.json`

Admin data:

- `data/admin/aftersales-data.json`
- `data/admin/promotions.json`
- `data/admin/reviews.json`
- `data/admin/vouchers.json`

## Moved files

- Former `CaraVeso/*.html` files were moved into individual folders under `Khach-Hang/`.
- Former `CaraVeso/css`, `CaraVeso/js`, and `CaraVeso/img` were moved to `Khach-Hang/shared/`.
- Former `CaraVeso/data/*.json` files were moved to `data/customer/`.
- Former `ADMIN/*.html` files were moved into individual folders under `Admin/`.
- Admin page-specific files for voucher, support, and aftersales were moved into their page folders as `style.css`, `script.js`, and `assets/`.
- Former common admin files `styles.css`, `data.js`, `app.js`, `Image/`, and archived admin folders were moved to `Admin/shared/`.
- Former root admin JSON files were moved to `data/admin/`.

## Updated paths

The following references were updated:

- Customer page links from old `*.html` URLs to new folder URLs like `../san-pham/`.
- Customer shared CSS/JS links to `../shared/css/...` and `../shared/js/...`.
- Customer image references to `../shared/img/...`.
- Customer JSON fetch paths in `Khach-Hang/shared/js/data.js` to `../../data/customer/...`.
- Admin page links from old `*.html` URLs to new folder URLs like `../quan-ly-san-pham/`.
- Admin shared CSS/JS links to `../shared/...`.
- Admin page-specific asset links to local `assets/...`.
- Admin JSON fetch paths to `../../data/admin/...`.
- Admin image paths to `../shared/Image/...` where they are resolved from page folders.

## How to run

Use a local static server from the project root because the project loads JSON with `fetch()`.

Example:

```bash
python -m http.server 8000
```

Then open:

- Customer: `http://localhost:8000/Khach-Hang/trang-chu/`
- Admin: `http://localhost:8000/Admin/tong-quan/`

Opening pages directly with `file://` may block JSON loading in some browsers.

## Verification notes

- Checked for stale high-risk references to old `css/`, `js/`, old admin scripts/styles, and old page `.html` links.
- Updated voucher, support, aftersales, customer data, and admin data fetch paths.
- Preserved archived admin copies under `Admin/shared/legacy-admin/`; those are retained as source assets and may still contain their original internal references.

## Image Fix Audit

An image-specific audit was completed after restructuring.

Fixed image path groups:

- Customer JSON image paths in `data/customer/*.json` now resolve from customer page folders to `../shared/img/...`.
- Admin aftersales data paths in `data/admin/aftersales-data.json` now resolve to `../shared/Image/...` and page-local `assets/...`.
- Admin support/review data paths in `data/admin/reviews.json` now resolve to `../shared/Image/...` and page-local `assets/...`.
- One legacy admin content image path in `Admin/shared/data.js` was updated away from the old `CaraVeso/img/...` layout.

Image verification summary:

- Image files scanned: 781.
- Image references checked: 1,358.
- Customer pages checked: 29.
- Admin pages checked: 10.
- Local server page failures: 0.
- Local server image failures: 0.

## Development notes

- Add new customer pages as `Khach-Hang/<page-slug>/index.html`.
- Add new admin pages as `Admin/<page-slug>/index.html`.
- Put shared JSON in `data/customer/` or `data/admin/` and update fetch paths relative to the page URL.
- Keep shared customer assets under `Khach-Hang/shared/`.
- Keep shared admin assets under `Admin/shared/`.
