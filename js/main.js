/* ============================================================
   CARAVESO — MAIN.JS
   Toàn bộ logic Frontend thuần (Vanilla JS).
   Không API, không localStorage (giỏ hàng giữ trong bộ nhớ phiên).
   Trang hiện tại được xác định qua <body data-page="...">.
   ============================================================ */

'use strict';

/* ============ 1. TIỆN ÍCH CHUNG ============ */

/** Định dạng tiền Việt: 18500000 -> "18.500.000 VNĐ" */
function fmtVND(n) {
  return n.toLocaleString('vi-VN') + ' VNĐ';
}

/** Tạo element nhanh: el('div', 'class-name', 'text') */
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

/** Tìm sản phẩm theo id */
function getProduct(id) {
  return PRODUCTS.find(function (p) { return p.id === Number(id); });
}

/** Thoát ký tự HTML (dùng khi ghép chuỗi innerHTML từ dữ liệu/nhập liệu) */
function esc(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

/* ============ 2. THƯ VIỆN ICON SVG ============ */
const ICONS = {
  chevronDown: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M6 9l6 6 6-6"/></svg>',
  search: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>',
  camera: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>',
  user: '<svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4.4 0-8 2.7-8 6v1h16v-1c0-3.3-3.6-6-8-6z"/></svg>',
  cart: '<svg width="27" height="27" viewBox="0 0 24 24" fill="currentColor"><path d="M7 18a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4zM3 2h2.5l.7 3H21a1 1 0 01.97 1.24l-1.8 7A2 2 0 0118.23 15H8.1l-.6 2H19v2H6a1 1 0 01-.96-1.27L6.2 13.6 4 4H3V2z"/></svg>',
  sparkle: '<svg width="22" height="22" viewBox="0 0 24 24" fill="url(#cbGrad)"><defs><linearGradient id="cbGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070d61"/><stop offset="1" stop-color="#e1a1ff"/></linearGradient></defs><path d="M12 2l1.8 5.7L19.5 9l-5.7 1.8L12 16.5l-1.8-5.7L4.5 9l5.7-1.3L12 2zm7 11l.9 2.8 2.8.9-2.8.9-.9 2.8-.9-2.8-2.8-.9 2.8-.9.9-2.8z"/></svg>',
  heart: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1-1a5.5 5.5 0 10-7.8 7.8l1 1L12 21.3l7.8-7.8 1-1a5.5 5.5 0 000-7.9z"/></svg>',
  arrowLeft: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M15 18l-6-6 6-6"/></svg>',
  arrowRight: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M9 6l6 6-6 6"/></svg>',
  filter: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M7 12h10M10 18h4"/></svg>',
  check: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1a7f37" stroke-width="2.4"><circle cx="12" cy="12" r="10"/><path d="M8 12.5l2.7 2.7L16 9.5"/></svg>',
  facebook: '<svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 10-1.6 19.9v-7h-2.5V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0012 2z"/></svg>',
  instagram: '<svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c2.7 0 3 0 4.1.1 1 0 1.7.2 2.3.4.6.3 1.1.6 1.6 1.1.5.5.8 1 1.1 1.6.2.6.4 1.3.4 2.3.1 1.1.1 1.4.1 4.5s0 3.4-.1 4.5c0 1-.2 1.7-.4 2.3a4.7 4.7 0 01-2.7 2.7c-.6.2-1.3.4-2.3.4-1.1.1-1.4.1-4.1.1s-3 0-4.1-.1c-1 0-1.7-.2-2.3-.4a4.7 4.7 0 01-2.7-2.7c-.2-.6-.4-1.3-.4-2.3C2 15.4 2 15.1 2 12s0-3.4.1-4.5c0-1 .2-1.7.4-2.3.3-.6.6-1.1 1.1-1.6.5-.5 1-.8 1.6-1.1.6-.2 1.3-.4 2.3-.4C8.6 2 8.9 2 12 2zm0 4.9a5.1 5.1 0 100 10.2 5.1 5.1 0 000-10.2zm0 8.4a3.3 3.3 0 110-6.6 3.3 3.3 0 010 6.6zm6.5-8.6a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0z"/></svg>',
  youtube: '<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 00.5 6.2 31 31 0 000 12a31 31 0 00.5 5.8 3 3 0 002.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 002.1-2.1A31 31 0 0024 12a31 31 0 00-.5-5.8zM9.6 15.6V8.4L15.8 12l-6.2 3.6z"/></svg>',
  tiktok: '<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M19.6 5.8a4.8 4.8 0 01-3.4-4.3H12.7v13.4a2.9 2.9 0 11-2-2.7V8.7a6.4 6.4 0 105 6.2V9.4a8.2 8.2 0 004.5 1.4V7.3c-.2 0-.4 0-.6-.1a4.8 4.8 0 01-.1-1.4z"/></svg>',
  trash: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4h8v2m1 0v14a2 2 0 01-2 2H9a2 2 0 01-2-2V6h10z"/></svg>',
  bank: '<svg width="46" height="46" viewBox="0 0 24 24" fill="#22344a"><path d="M12 1L2 6v2h20V6L12 1zm-8 9v7h2.6v-7H4zm6.7 0v7h2.6v-7h-2.6zm6.7 0v7H20v-7h-2.6zM2 19v2h20v-2H2z"/><circle cx="12" cy="4.6" r="1.2" fill="#fff"/><text x="12" y="5.4" font-size="2.6" text-anchor="middle" fill="#22344a" font-weight="bold">$</text></svg>',
  lock: '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a5 5 0 00-5 5v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V7a5 5 0 00-5-5zm-3 5a3 3 0 116 0v3H9V7z"/></svg>',
  cod: '<svg width="44" height="44" viewBox="0 0 24 24" fill="#111"><path d="M12 2a4 4 0 014 4c0 .7-.2 1.4-.5 2H17a1 1 0 011 1v1H6V9a1 1 0 011-1h1.5A4 4 0 0112 2zm0 2a2 2 0 00-2 2c0 1.1.9 2 2 2s2-.9 2-2a2 2 0 00-2-2zM3 13.5c2-1.2 3.8-1.1 5.4-.3l2.8 1.3c.9.4 1.2 1.4.8 2.2l4.6-1.5c1-.3 2 .2 2.4 1.1.3.9-.1 1.9-1 2.3l-6.5 2.9c-1 .5-2.2.5-3.2 0L3 19v-5.5z"/><text x="12" y="7.4" font-size="3.4" text-anchor="middle" fill="#fff" font-weight="bold">$</text></svg>',
  ewallet: '<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="1.7"><rect x="5" y="2.5" width="14" height="19" rx="2.4"/><path d="M9 2.5h6M10 18.8h4"/><rect x="8" y="7" width="8" height="5.6" rx="1" fill="#111" stroke="none"/><path d="M9.5 9.8h5" stroke="#fff" stroke-width="1.2"/></svg>',
  eye: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M1 12s4-7.5 11-7.5S23 12 23 12s-4 7.5-11 7.5S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>',
  eyeOff: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17.9 17.9A10.6 10.6 0 0112 19.5C5 19.5 1 12 1 12a19.8 19.8 0 015.1-5.9M9.9 4.7A10 10 0 0112 4.5C19 4.5 23 12 23 12a19.9 19.9 0 01-3.2 4.3M14.1 14.1a3 3 0 11-4.2-4.2"/><path d="M2 2l20 20"/></svg>',
  clock: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>'
};

/* ============ 3. TRẠNG THÁI GIỎ HÀNG (trong bộ nhớ) ============ */
/* Giỏ hàng khởi tạo bằng mock data để demo trang cart.html.
   Được nạp từ INITIAL_CART (data/initial-cart.json) sau khi dữ liệu tải xong. */
let cartState = [];
let appliedVoucher = null;

/** Khởi tạo giỏ hàng từ dữ liệu đã tải (gọi trong bước KHỞI CHẠY). */
function initCartState() {
  cartState = INITIAL_CART.map(function (item) { return Object.assign({}, item); });
}

function cartCount() {
  return cartState.reduce(function (sum, item) { return sum + item.qty; }, 0);
}

function updateCartBadge() {
  document.querySelectorAll('.cart-badge').forEach(function (badge) {
    const n = cartCount();
    badge.textContent = n;
    badge.hidden = n === 0;
  });
}

/** Tên hiển thị của các mã màu (dùng cho popup thêm giỏ + trang chi tiết) */
const COLOR_NAMES = {
  '#efe9dd': 'Trắng kem', '#f3c7cf': 'Hồng pastel', '#0b3056': 'Xanh navy',
  '#e08b4e': 'Cam đất', '#e8e2d5': 'Be sáng', '#8a8a8a': 'Xám',
  '#3b3b3b': 'Đen than', '#175e3b': 'Xanh lục', '#b58e5a': 'Gỗ sồi',
  '#6b4a2e': 'Óc chó', '#c9a24b': 'Vàng đồng', '#2b2b2b': 'Đen', '#f5f5f0': 'Trắng đá'
};

/** Thêm sản phẩm vào giỏ (không mở popup) */
function cartAdd(productId, qty) {
  qty = qty || 1;
  const existing = cartState.find(function (i) { return i.productId === productId; });
  if (existing) { existing.qty += qty; existing.checked = true; }
  else cartState.push({ productId: productId, qty: qty, checked: true });
  updateCartBadge();
}

/* ============ 4. HEADER / FOOTER DÙNG CHUNG ============ */

/** Thêm 1 từ khóa vào lịch sử tìm kiếm (trong bộ nhớ, mới nhất lên đầu) */
function addRecentSearch(term) {
  term = (term || '').trim();
  if (!term) return;
  const recent = SEARCH_SUGGESTIONS.recent || (SEARCH_SUGGESTIONS.recent = []);
  const i = recent.findIndex(function (t) { return t.toLowerCase() === term.toLowerCase(); });
  if (i !== -1) recent.splice(i, 1);
  recent.unshift(term);
  if (recent.length > 8) recent.length = 8;
}

function buildSearchBox(extraClass) {
  const wrap = el('div', 'search-wrap ' + (extraClass || ''));

  const form = el('form', 'search');
  form.setAttribute('role', 'search');
  form.innerHTML =
    '<button class="search__btn" type="submit" aria-label="Tìm kiếm">' + ICONS.search + '</button>' +
    '<input class="search__input" type="text" placeholder="Nhập sản phẩm, chất liệu, phong cách,..." aria-label="Tìm kiếm sản phẩm">' +
    '<button class="search__camera" type="button" aria-label="Tìm bằng hình ảnh">' + ICONS.camera + '</button>';
  const input = form.querySelector('.search__input');

  /* Panel gợi ý: lịch sử + phổ biến (Yêu cầu 2) */
  const panel = el('div', 'search-suggest');

  function renderPanel() {
    const recent = SEARCH_SUGGESTIONS.recent || [];
    const popular = SEARCH_SUGGESTIONS.popular || [];
    let html = '';
    if (recent.length) {
      html += '<div class="search-suggest__head">' +
        '<span class="search-suggest__title">Lịch sử tìm kiếm</span>' +
        '<button type="button" class="search-suggest__clear">Xoá tất cả</button></div>';
      html += '<ul class="search-suggest__list">' + recent.map(function (t) {
        return '<li><button type="button" class="search-suggest__item search-suggest__item--recent" data-term="' +
          esc(t) + '">' + ICONS.clock + '<span>' + esc(t) + '</span></button></li>';
      }).join('') + '</ul>';
    }
    if (popular.length) {
      html += '<div class="search-suggest__head"><span class="search-suggest__title">Tìm kiếm phổ biến</span></div>';
      html += '<ul class="search-suggest__list">' + popular.map(function (t) {
        return '<li><button type="button" class="search-suggest__item" data-term="' +
          esc(t) + '">' + esc(t) + '</button></li>';
      }).join('') + '</ul>';
    }
    panel.innerHTML = html || '<p class="search-suggest__empty">Chưa có gợi ý tìm kiếm.</p>';
  }

  // Chỉ ô tìm kiếm trên header desktop mới "biến hình" thanh header (Yêu cầu 1)
  function toggleHeaderSearch(on) {
    const hdr = wrap.closest('.header');
    if (hdr) hdr.classList.toggle('is-search-active', on);
  }

  function openPanel() { renderPanel(); wrap.classList.add('is-open'); toggleHeaderSearch(true); }
  function closePanel() { wrap.classList.remove('is-open'); toggleHeaderSearch(false); }

  function doSearch(q) {
    q = (q || '').trim();
    if (!q) { showToast('Vui lòng nhập từ khóa tìm kiếm'); return; }
    addRecentSearch(q);
    window.location.href = 'products.html?q=' + encodeURIComponent(q);
  }

  input.addEventListener('focus', openPanel);
  input.addEventListener('click', openPanel);

  panel.addEventListener('click', function (e) {
    if (e.target.closest('.search-suggest__clear')) {
      SEARCH_SUGGESTIONS.recent = [];
      renderPanel();
      input.focus();
      return;
    }
    const item = e.target.closest('.search-suggest__item');
    if (item) doSearch(item.dataset.term);
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    doSearch(input.value);
  });
  form.querySelector('.search__camera').addEventListener('click', function () {
    closePanel();
    openImageSearchModal();
  });

  /* Đóng panel khi click ra ngoài ô tìm kiếm */
  document.addEventListener('click', function (e) {
    if (!wrap.contains(e.target)) closePanel();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closePanel();
  });

  wrap.appendChild(form);
  wrap.appendChild(panel);
  return wrap;
}

/** Popup "Tìm kiếm bằng hình ảnh" — mở khi bấm icon camera trên ô tìm kiếm (Yêu cầu 2) */
function openImageSearchModal() {
  openModal(
    '<div class="imgsearch">' +
      '<h3 class="imgsearch__title">' + ICONS.camera + ' Tìm kiếm bằng hình ảnh</h3>' +
      '<button type="button" class="imgsearch__drop" id="imgsearch-drop">' +
        '<svg class="imgsearch__drop-ic" width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4">' +
          '<rect x="3" y="4" width="18" height="15" rx="2"/><circle cx="9" cy="10" r="1.6"/>' +
          '<path d="M4 18l5-5 4 4 2.5-2.5L20 17"/><path d="M18 3v5M15.5 5.5h5" stroke-linecap="round"/></svg>' +
        '<span class="imgsearch__drop-text">Tải hình ảnh lên</span>' +
        '<img class="imgsearch__preview" alt="Ảnh đã chọn" hidden>' +
        '<input type="file" id="imgsearch-file" accept="image/*" hidden>' +
      '</button>' +
      '<div class="imgsearch__or"><span>Hoặc</span></div>' +
      '<div class="imgsearch__url">' +
        '<input type="text" id="imgsearch-link" placeholder="Dán link sản phẩm vào đây">' +
        '<button type="button" class="btn-primary" id="imgsearch-go">Tìm kiếm</button>' +
      '</div>' +
    '</div>',
    'modal--imgsearch'
  );

  const modal = modalOverlay.querySelector('.modal');
  const drop = modal.querySelector('#imgsearch-drop');
  const file = modal.querySelector('#imgsearch-file');
  const preview = modal.querySelector('.imgsearch__preview');
  const dropText = modal.querySelector('.imgsearch__drop-text');
  const dropIc = modal.querySelector('.imgsearch__drop-ic');
  const linkInput = modal.querySelector('#imgsearch-link');
  let hasImage = false;

  // Bấm vùng thả để chọn file
  drop.addEventListener('click', function () { file.click(); });

  // Kéo–thả ảnh vào vùng
  drop.addEventListener('dragover', function (e) { e.preventDefault(); drop.classList.add('is-drag'); });
  drop.addEventListener('dragleave', function () { drop.classList.remove('is-drag'); });
  drop.addEventListener('drop', function (e) {
    e.preventDefault();
    drop.classList.remove('is-drag');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) showPreview(e.dataTransfer.files[0]);
  });

  file.addEventListener('change', function () {
    if (file.files && file.files[0]) showPreview(file.files[0]);
  });

  function showPreview(f) {
    if (!f.type || f.type.indexOf('image/') !== 0) {
      showToast('Vui lòng chọn tệp hình ảnh');
      return;
    }
    const reader = new FileReader();
    reader.onload = function (ev) {
      preview.src = ev.target.result;
      preview.hidden = false;
      dropText.hidden = true;
      if (dropIc) dropIc.style.display = 'none';
      hasImage = true;
    };
    reader.readAsDataURL(f);
  }

  // Thực hiện tìm kiếm: cần có ảnh hoặc link sản phẩm
  function runImageSearch() {
    const link = linkInput.value.trim();
    if (!hasImage && !link) {
      showToast('Hãy tải ảnh lên hoặc dán link sản phẩm');
      return;
    }
    closeModal();
    showToast('Đang tìm những sản phẩm tương tự…');
    const q = link ? '?q=' + encodeURIComponent(link) : '?imgsearch=1';
    setTimeout(function () { window.location.href = 'products.html' + q; }, 700);
  }

  modal.querySelector('#imgsearch-go').addEventListener('click', runImageSearch);
  linkInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); runImageSearch(); }
  });
}

/** Link cho 1 mục danh mục:
    - Sản phẩm → lưới products.html đã lọc theo danh mục
    - Các phòng → trang phòng room.html?room=<slug> */
function catalogHref(key, g, label) {
  if (key === 'rooms') return 'room.html?room=' + encodeURIComponent(g.slug);
  return 'products.html?category=' + encodeURIComponent(g.cat) +
    '&label=' + encodeURIComponent(label);
}

/** Tên hiển thị của danh mục sản phẩm theo slug (VD 'sofa' → 'Ghế') */
function getCategoryName(catSlug) {
  const groups = (CATALOG.products && CATALOG.products.groups) || [];
  const g = groups.find(function (x) { return x.cat === catSlug; });
  return g ? g.label : '';
}

/** Cấu hình phân loại (nhãn + tùy chọn) theo danh mục sản phẩm */
function getTypeConfig(category) {
  const cfg = PRODUCT_TYPES[category] || PRODUCT_TYPES._default;
  return cfg && cfg.options && cfg.options.length
    ? cfg
    : { label: 'Phân loại', options: ['Tiêu chuẩn'] };
}

/** Panel dropdown "Các phòng" — lưới thẻ ảnh từng phòng (Yêu cầu 4, ảnh 4) */
function buildRoomsPanel(cat) {
  const panel = el('div', 'mega mega--rooms');
  const grid = el('div', 'mega-rooms');
  (cat.groups || []).forEach(function (g) {
    const room = ROOMS[g.slug] || {};
    const card = el('a', 'mega-room');
    card.href = 'room.html?room=' + encodeURIComponent(g.slug);
    const thumb = el('span', 'mega-room__thumb');
    const img = el('img');
    img.src = room.img || '';
    img.alt = g.label;
    img.loading = 'lazy';
    thumb.appendChild(img);
    card.appendChild(thumb);
    card.appendChild(el('span', 'mega-room__name', g.label));
    grid.appendChild(card);
  });
  panel.appendChild(grid);
  const all = el('a', 'mega__all', cat.allLabel + ' →');
  all.href = cat.allHref;
  panel.appendChild(all);
  return panel;
}

/** Panel mega-menu nhiều cột dựng từ CATALOG[key] (Yêu cầu 3, ảnh 3) */
function buildMegaPanel(cat, key) {
  if (key === 'rooms') return buildRoomsPanel(cat);
  const panel = el('div', 'mega');
  const cols = el('div', 'mega__cols');
  (cat.groups || []).forEach(function (g) {
    const col = el('div', 'mega__col');
    const head = el('a', 'mega__group', g.label);
    head.href = catalogHref(key, g, g.label);
    col.appendChild(head);
    const ul = el('ul', 'mega__list');
    (g.children || []).forEach(function (child) {
      const li = el('li');
      const link = el('a', '', child);
      link.href = catalogHref(key, g, child);
      li.appendChild(link);
      ul.appendChild(li);
    });
    col.appendChild(ul);
    cols.appendChild(col);
  });
  panel.appendChild(cols);
  const all = el('a', 'mega__all', cat.allLabel + ' →');
  all.href = cat.allHref;
  panel.appendChild(all);
  return panel;
}

function renderHeader() {
  const mount = document.getElementById('site-header');
  if (!mount) return;

  /* --- Top bar --- */
  const topbar = el('div', 'topbar');
  topbar.innerHTML =
    '<div class="topbar__inner">' +
      '<p class="topbar__promo">Chỉ duy nhất 1 lần, tặng voucher 100.000 VNĐ cho khách hàng mới của CaraVeso</p>' +
      '<a class="topbar__auth" href="login.html">Đăng nhập/ Đăng ký</a>' +
    '</div>';

  /* --- Header chính --- */
  const header = el('header', 'header');
  const inner = el('div', 'header__inner');

  // Cột trái: hamburger (mobile) + nav (desktop)
  const left = el('div', 'header__left');

  const burger = el('button', 'hamburger');
  burger.setAttribute('aria-label', 'Mở menu');
  burger.innerHTML = '<span></span><span></span><span></span>';
  left.appendChild(burger);

  const nav = el('nav', 'nav');
  NAV_ITEMS.forEach(function (item) {
    const hasMega = item.mega && CATALOG[item.mega];
    const li = el('div', 'nav__item' + (hasMega ? ' nav__item--mega' : ''));
    const a = el('a', 'nav__link');
    a.href = item.href || '#';
    a.innerHTML = item.label + ((item.dropdown || hasMega) ? ICONS.chevronDown : '');
    li.appendChild(a);

    if (hasMega) {
      // Mega-menu nhiều cột — mở/đóng bằng click (Yêu cầu 3)
      li.appendChild(buildMegaPanel(CATALOG[item.mega], item.mega));
      a.addEventListener('click', function (e) {
        e.preventDefault();
        const willOpen = !li.classList.contains('is-open');
        nav.querySelectorAll('.nav__item--mega.is-open').forEach(function (x) { x.classList.remove('is-open'); });
        if (willOpen) li.classList.add('is-open');
      });
    } else if (item.dropdown) {
      const dd = el('div', 'nav__dropdown');
      item.dropdown.forEach(function (sub) {
        // Mục con có thể là chuỗi hoặc object {label, href}
        const subA = el('a', '', sub.label || sub);
        subA.href = sub.href || item.href;
        dd.appendChild(subA);
      });
      li.appendChild(dd);
    }
    nav.appendChild(li);
  });
  left.appendChild(nav);

  // Đóng mega-menu khi click ra ngoài hoặc nhấn Esc
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav__item--mega')) {
      nav.querySelectorAll('.nav__item--mega.is-open').forEach(function (x) { x.classList.remove('is-open'); });
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') nav.querySelectorAll('.nav__item--mega.is-open').forEach(function (x) { x.classList.remove('is-open'); });
  });

  // Giữa: logo
  const logo = el('a', 'logo', 'CaraVeso');
  logo.href = 'index.html';

  // Phải: search + chatbox + user + cart
  const right = el('div', 'header__right');
  right.appendChild(buildSearchBox('header__search-desktop'));

  const chatbox = el('a', 'chatbox-link');
  chatbox.href = 'chatbox-ai.html';
  chatbox.innerHTML = ICONS.sparkle + '<span>ChatBox</span>';
  right.appendChild(chatbox);

  const account = el('a', 'header__icon');
  account.href = 'account.html';
  account.setAttribute('aria-label', 'Tài khoản');
  account.innerHTML = ICONS.user;
  right.appendChild(account);

  const cartWrap = el('div', 'cart-wrap');
  const cartLink = el('a', 'header__icon');
  cartLink.href = 'cart.html';
  cartLink.setAttribute('aria-label', 'Giỏ hàng');
  cartLink.innerHTML = ICONS.cart + '<span class="cart-badge" hidden>0</span>';
  cartWrap.appendChild(cartLink);
  right.appendChild(cartWrap);

  inner.appendChild(left);
  inner.appendChild(logo);
  inner.appendChild(right);
  header.appendChild(inner);

  /* --- Menu mobile + overlay --- */
  const overlay = el('div', 'menu-overlay');
  const mobileMenu = el('div', 'mobile-menu');
  mobileMenu.appendChild(el('div', 'mobile-menu__logo', 'CaraVeso'));
  mobileMenu.appendChild(buildSearchBox());

  const list = el('ul', 'mobile-menu__list');
  NAV_ITEMS.forEach(function (item) {
    const li = el('li');
    const a = el('a', 'mobile-menu__link');
    a.href = item.dropdown ? '#' : item.href;
    a.innerHTML = item.label + (item.dropdown ? ICONS.chevronDown : '');
    li.appendChild(a);
    if (item.dropdown) {
      const sub = el('div', 'mobile-menu__sub');
      item.dropdown.forEach(function (s) {
        const subA = el('a', '', s.label || s);
        subA.href = s.href || item.href;
        sub.appendChild(subA);
      });
      li.appendChild(sub);
      a.addEventListener('click', function (e) {
        e.preventDefault();
        sub.classList.toggle('is-open');
      });
    }
    list.appendChild(li);
  });
  mobileMenu.appendChild(list);

  const authBtn = el('a', 'mobile-menu__auth', 'Đăng nhập / Đăng ký');
  authBtn.href = 'login.html';
  mobileMenu.appendChild(authBtn);

  function toggleMenu(open) {
    burger.classList.toggle('is-open', open);
    mobileMenu.classList.toggle('is-open', open);
    overlay.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  burger.addEventListener('click', function () {
    toggleMenu(!mobileMenu.classList.contains('is-open'));
  });
  overlay.addEventListener('click', function () { toggleMenu(false); });

  mount.appendChild(topbar);
  mount.appendChild(header);
  mount.appendChild(overlay);
  mount.appendChild(mobileMenu);
  updateCartBadge();
}

function renderFooter() {
  const mount = document.getElementById('site-footer');
  if (!mount) return;

  const footer = el('footer', 'footer');
  const container = el('div', 'container');
  const grid = el('div', 'footer__grid');

  // Cột 1: THÔNG TIN
  const col1 = el('div', 'footer__col');
  col1.appendChild(el('h4', '', 'THÔNG TIN'));
  const ul1 = el('ul');
  FOOTER_LINKS.thongTin.forEach(function (t) {
    const li = el('li');
    const a = el('a', '', t);
    a.href = '#';
    li.appendChild(a);
    ul1.appendChild(li);
  });
  col1.appendChild(ul1);

  // Cột 2: CARAVESO
  const col2 = el('div', 'footer__col');
  col2.appendChild(el('h4', '', 'CARAVESO'));
  const ul2 = el('ul');
  FOOTER_LINKS.caraveso.forEach(function (t) {
    const li = el('li');
    const a = el('a', '', t);
    a.href = '#';
    li.appendChild(a);
    ul2.appendChild(li);
  });
  col2.appendChild(ul2);

  // Cột 3: THÔNG TIN CÔNG TY
  const col3 = el('div', 'footer__col');
  col3.appendChild(el('h4', '', 'THÔNG TIN CÔNG TY'));
  col3.innerHTML +=
    '<p>Ngày hoạt động: 08 - 09 - 2006</p>' +
    '<p><b>Trụ sở chính:</b><br>CaraVeso Design Center, Tầng 15, Tòa nhà The Crescent Office,<br>' +
    '101 Tôn Dật Tiên, Khu đô thị Phú Mỹ Hưng, Phường Tân Phú,<br>Quận 7, Thành phố Hồ Chí Minh, Việt Nam.</p>' +
    '<p><b>Hotline:</b> 1900 080906<br><b>Email:</b> caravesodesign@.com.vn</p>';

  // Cột 4: logo
  const col4 = el('div', 'footer__col footer__col--brand');
  col4.appendChild(el('div', 'footer__logo', 'CaraVeso'));

  grid.appendChild(col1);
  grid.appendChild(col2);
  grid.appendChild(col3);
  grid.appendChild(col4);
  container.appendChild(grid);
  container.appendChild(el('hr', 'footer__bottom-line'));

  const bottom = el('div', 'footer__bottom');
  bottom.appendChild(el('p', 'footer__copy', 'Bản quyền © 2026 CARAVESO FURNITURE.'));
  const socials = el('div', 'footer__socials');
  [['Facebook', ICONS.facebook], ['Instagram', ICONS.instagram], ['YouTube', ICONS.youtube], ['TikTok', ICONS.tiktok]]
    .forEach(function (pair) {
      const a = el('a');
      a.href = '#';
      a.setAttribute('aria-label', pair[0]);
      a.innerHTML = pair[1];
      socials.appendChild(a);
    });
  bottom.appendChild(socials);
  container.appendChild(bottom);
  footer.appendChild(container);
  mount.appendChild(footer);
}

/** Widget chat hỗ trợ nổi ở góc phải — icon + khung chat (Yêu cầu 3, ảnh 3/5) */
function renderSupportChat() {
  if (document.querySelector('.support-chat')) return;  // tránh tạo trùng

  const root = el('div', 'support-chat');

  // Nút nổi mở chat
  const launcher = el('button', 'support-launcher');
  launcher.setAttribute('aria-label', 'Chat với CaraVeso');
  launcher.innerHTML =
    '<span class="support-launcher__bubble">' +
      '<svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
        '<path d="M12 3C6.5 3 2 6.6 2 11c0 2.4 1.3 4.5 3.4 6-.2 1-.8 2.3-1.7 3.3-.2.2 0 .6.3.5 1.9-.4 3.4-1.1 4.5-1.8 1.1.3 2.3.5 3.5.5 5.5 0 10-3.6 10-8s-4.5-8-10-8z"/>' +
        '<circle cx="8" cy="11" r="1.3" fill="#fff"/><circle cx="12" cy="11" r="1.3" fill="#fff"/><circle cx="16" cy="11" r="1.3" fill="#fff"/>' +
      '</svg>' +
    '</span>' +
    '<span class="support-launcher__label">Chat với CaraVeso</span>';

  // Khung chat
  const panel = el('div', 'support-panel');
  panel.innerHTML =
    '<div class="support-panel__head">' +
      '<span class="support-panel__title">' +
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.6 10.8a15 15 0 006.6 6.6l2.2-2.2a1 1 0 011-.24 11.4 11.4 0 003.6.58 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.24.2 2.45.58 3.6a1 1 0 01-.25 1l-2.23 2.2z"/></svg>' +
        'CaraVeso Support' +
      '</span>' +
      '<button type="button" class="support-panel__close" aria-label="Đóng">&times;</button>' +
    '</div>' +
    '<div class="support-panel__body">' +
      '<p class="support-panel__from">CaraVeso</p>' +
      '<div class="support-msg support-msg--bot">Xin chào! Mình là nhân viên hỗ trợ của CaraVeso</div>' +
      '<div class="support-msg support-msg--bot">Mình có thể giúp gì cho bạn?</div>' +
    '</div>' +
    '<form class="support-panel__input">' +
      '<input type="text" placeholder="Nhập tin nhắn" aria-label="Nhập tin nhắn">' +
      '<button type="submit" aria-label="Gửi">' +
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3l18 9-18 9 4-9-4-9zm4.7 9L5.6 6.8 16.5 12 5.6 17.2 7.7 12z"/></svg>' +
      '</button>' +
    '</form>';

  const body = panel.querySelector('.support-panel__body');
  const form = panel.querySelector('.support-panel__input');
  const input = form.querySelector('input');

  function openChat() {
    root.classList.add('is-open');
    setTimeout(function () { input.focus(); }, 200);
  }
  function closeChat() { root.classList.remove('is-open'); }

  launcher.addEventListener('click', openChat);
  panel.querySelector('.support-panel__close').addEventListener('click', closeChat);

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    const msg = el('div', 'support-msg support-msg--me', text);
    body.appendChild(msg);
    input.value = '';
    body.scrollTop = body.scrollHeight;
    // Phản hồi tự động (demo)
    setTimeout(function () {
      const reply = el('div', 'support-msg support-msg--bot',
        'Cảm ơn bạn đã liên hệ. Nhân viên CaraVeso sẽ phản hồi trong giây lát ạ!');
      body.appendChild(reply);
      body.scrollTop = body.scrollHeight;
    }, 800);
  });

  root.appendChild(panel);
  root.appendChild(launcher);
  document.body.appendChild(root);
}

/* ============ 5. MODAL & TOAST ============ */

let modalOverlay = null;

function ensureModalRoot() {
  if (modalOverlay) return modalOverlay;
  modalOverlay = el('div', 'modal-overlay');
  modalOverlay.innerHTML = '<div class="modal" role="dialog" aria-modal="true"></div>';
  document.body.appendChild(modalOverlay);

  // Đóng khi click ra ngoài modal
  modalOverlay.addEventListener('click', function (e) {
    if (e.target === modalOverlay) closeModal();
  });
  // Đóng bằng phím ESC
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });
  return modalOverlay;
}

function openModal(innerHTML, extraClass) {
  const root = ensureModalRoot();
  const modal = root.querySelector('.modal');
  modal.className = 'modal' + (extraClass ? ' ' + extraClass : '');
  modal.innerHTML = '<button class="modal__close" aria-label="Đóng">&times;</button>' + innerHTML;
  modal.querySelector('.modal__close').addEventListener('click', closeModal);
  root.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  if (!modalOverlay) return;
  modalOverlay.classList.remove('is-open');
  document.body.style.overflow = '';
}

/** Popup chọn thông số trước khi thêm vào giỏ (frame "Pop-up thêm vào giỏ hàng" 800×600) */
function openQuickAddModal(product) {
  // Thumbnail biến thể: ảnh sản phẩm nhuộm theo từng mã màu (mix-blend-mode)
  const variants = product.colors.map(function (color, i) {
    return '<button class="qa__variant' + (i === 0 ? ' is-active' : '') + '" data-color="' + color + '" ' +
      'aria-label="' + (COLOR_NAMES[color] || color) + '">' +
      '<span class="qa__variant-tint" style="background:' + color + '">' +
        '<img src="' + product.img + '" alt="">' +
      '</span></button>';
  }).join('');

  // Phân loại theo danh mục (nhãn + tùy chọn chọn được)
  const qaType = getTypeConfig(product.category);
  const typeChips = qaType.options.map(function (opt, i) {
    return '<button type="button" class="qa__chip' + (i === 0 ? ' is-active' : '') +
      '" data-type="' + esc(opt) + '">' + esc(opt) + '</button>';
  }).join('');

  openModal(
    '<div class="qa">' +
      '<div class="qa__left">' +
        '<div class="qa__img"><img src="' + product.img + '" alt="' + product.name + '"></div>' +
        '<a class="qa__detail-link" href="product-detail.html?id=' + product.id + '">Xem chi tiết sản phẩm</a>' +
      '</div>' +
      '<div class="qa__right">' +
        '<h3 class="qa__title">' + product.name + '</h3>' +
        '<p class="qa__meta"><b>SKU:</b> ' + product.sku + '</p>' +
        '<p class="qa__meta"><b>Tình trạng:</b> Còn ' + product.stock + ' sản phẩm</p>' +
        '<div class="qa__sect">' +
          '<p class="qa__sect-label">' + esc(qaType.label) + ' <small>(' + qaType.options.length + ')</small></p>' +
          '<p class="qa__sect-value" id="qa-type-label">' + esc(qaType.options[0]) + '</p>' +
          '<div class="qa__chips">' + typeChips + '</div>' +
        '</div>' +
        '<div class="qa__sect">' +
          '<p class="qa__sect-label">Màu sắc <small>(' + product.colors.length + ')</small></p>' +
          '<p class="qa__sect-value" id="qa-color-label">' + (COLOR_NAMES[product.colors[0]] || product.colors[0]) + '</p>' +
          '<div class="qa__variants">' + variants + '</div>' +
        '</div>' +
        '<p class="qa__price">' + fmtVND(product.price) + '</p>' +
        '<div class="qty-stepper">' +
          '<button id="qa-minus" aria-label="Giảm số lượng">−</button>' +
          '<input type="text" id="qa-qty" value="1" aria-label="Số lượng">' +
          '<button id="qa-plus" aria-label="Tăng số lượng">+</button>' +
        '</div>' +
        '<div class="qa__cta">' +
          '<button class="btn-primary" id="qa-add">Thêm vào giỏ</button>' +
          '<button class="btn-outline" id="qa-buy">Mua nhanh</button>' +
        '</div>' +
      '</div>' +
    '</div>',
    'modal--quickadd'
  );

  const modal = modalOverlay.querySelector('.modal');

  // Chọn loại (phân loại theo danh mục)
  modal.querySelectorAll('.qa__chip').forEach(function (btn) {
    btn.addEventListener('click', function () {
      modal.querySelectorAll('.qa__chip').forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      modal.querySelector('#qa-type-label').textContent = btn.dataset.type;
    });
  });

  // Chọn màu
  modal.querySelectorAll('.qa__variant').forEach(function (btn) {
    btn.addEventListener('click', function () {
      modal.querySelectorAll('.qa__variant').forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      modal.querySelector('#qa-color-label').textContent = COLOR_NAMES[btn.dataset.color] || btn.dataset.color;
    });
  });

  // Số lượng
  const qtyInput = modal.querySelector('#qa-qty');
  modal.querySelector('#qa-minus').addEventListener('click', function () {
    qtyInput.value = Math.max(1, Number(qtyInput.value) - 1);
  });
  modal.querySelector('#qa-plus').addEventListener('click', function () {
    qtyInput.value = Math.min(product.stock, Number(qtyInput.value) + 1);
  });
  qtyInput.addEventListener('change', function () {
    let v = parseInt(qtyInput.value, 10);
    if (isNaN(v) || v < 1) v = 1;
    qtyInput.value = Math.min(product.stock, v);
  });

  // Thêm vào giỏ / Mua nhanh
  modal.querySelector('#qa-add').addEventListener('click', function () {
    cartAdd(product.id, Number(qtyInput.value));
    closeModal();
    openCartPopup();
  });
  modal.querySelector('#qa-buy').addEventListener('click', function () {
    cartAdd(product.id, Number(qtyInput.value));
    window.location.href = 'checkout.html';
  });
}

/** Popup Cảnh báo hủy giao dịch (frame "PopUp cảnh báo" 500×200) */
function openCancelWarning(onConfirm) {
  openModal(
    '<div class="warn__head">' +
      '<svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
        '<path d="M10.3 3.6L1.9 18a2 2 0 001.7 3h16.8a2 2 0 001.7-3L13.7 3.6a2 2 0 00-3.4 0z"/>' +
        '<path d="M12 9v4M12 17h.01"/></svg>' +
      'Cảnh báo' +
    '</div>' +
    '<p class="warn__text">Giao dịch vẫn đang được tiến hành. Bạn có<br>chắc chắc <b>Hủy ?</b></p>' +
    '<div class="warn__actions">' +
      '<button class="warn-btn warn-btn--outline" data-back>Quay lại</button>' +
      '<button class="warn-btn warn-btn--primary" data-confirm>Xác nhận</button>' +
    '</div>',
    'modal--warn'
  );
  modalOverlay.querySelector('[data-back]').addEventListener('click', closeModal);
  modalOverlay.querySelector('[data-confirm]').addEventListener('click', function () {
    closeModal();
    onConfirm();
  });
}

let toastTimer = null;
function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = el('div', 'toast');
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('is-show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { toast.classList.remove('is-show'); }, 2600);
}

/* ---- Popup giỏ hàng (mini-cart) hiện cạnh icon giỏ khi thêm sản phẩm ---- */
let cartPopupTimer = null;
let cartPopupSuppressOutside = false;  // chặn cú click vừa mở popup tự đóng nó

/** Hẹn giờ tự ẩn popup sau ~3s (gọi lại mỗi lần có tương tác để reset). */
function scheduleCartPopupClose() {
  clearTimeout(cartPopupTimer);
  cartPopupTimer = setTimeout(closeCartPopup, 3000);
}

function closeCartPopup() {
  clearTimeout(cartPopupTimer);
  const popup = document.querySelector('.cart-popup');
  if (popup) popup.classList.remove('is-show');
}

/** Mở popup giỏ hàng cạnh icon giỏ. Nếu trang không có header thì fallback toast. */
function openCartPopup() {
  const wrap = document.querySelector('.cart-wrap');
  if (!wrap) { showToast('Đã thêm sản phẩm vào giỏ hàng'); return; }

  let popup = wrap.querySelector('.cart-popup');
  if (!popup) {
    popup = el('div', 'cart-popup');
    wrap.appendChild(popup);
    // Rê chuột vào popup thì tạm dừng đếm giờ, rời ra thì đếm lại
    popup.addEventListener('mouseenter', function () { clearTimeout(cartPopupTimer); });
    popup.addEventListener('mouseleave', scheduleCartPopupClose);
    // Bấm ra ngoài thì đóng popup (bỏ qua chính cú click vừa mở popup)
    document.addEventListener('click', function (e) {
      if (cartPopupSuppressOutside) return;
      if (popup.classList.contains('is-show') && !wrap.contains(e.target)) closeCartPopup();
    });
  }

  renderCartPopup(popup);
  popup.classList.add('is-show');
  // Cú click hiện tại vẫn đang bubble lên document — chặn nó đóng popup ngay
  cartPopupSuppressOutside = true;
  setTimeout(function () { cartPopupSuppressOutside = false; }, 0);
  scheduleCartPopupClose();
}

/** Dựng lại nội dung popup từ trạng thái giỏ hàng hiện tại. */
function renderCartPopup(popup) {
  popup.textContent = '';
  popup.appendChild(el('div', 'cart-popup__head', 'Giỏ hàng (' + cartState.length + ')'));

  const list = el('div', 'cart-popup__list');
  if (!cartState.length) {
    list.appendChild(el('p', 'cart-popup__empty', 'Giỏ hàng của bạn đang trống.'));
  } else {
    // Hiện sản phẩm mới thêm lên đầu
    cartState.slice().reverse().forEach(function (item) {
      const p = getProduct(item.productId);
      if (!p) return;
      const row = el('div', 'cart-popup__item');
      row.innerHTML =
        '<a class="cart-popup__img" href="product-detail.html?id=' + p.id + '"><img src="' + p.img + '" alt="' + p.name + '"></a>' +
        '<div class="cart-popup__info">' +
          '<a class="cart-popup__name" href="product-detail.html?id=' + p.id + '">' + p.name + '</a>' +
          '<p class="cart-popup__meta">' + p.desc + '</p>' +
        '</div>';

      const side = el('div', 'cart-popup__side');
      side.appendChild(el('p', 'cart-popup__price', fmtVND(p.price)));

      const stepper = el('div', 'qty-stepper');
      const minus = el('button', '', '−');
      minus.type = 'button';
      const qty = el('input');
      qty.type = 'text';
      qty.value = item.qty;
      qty.readOnly = true;
      qty.setAttribute('aria-label', 'Số lượng ' + p.name);
      const plus = el('button', '', '+');
      plus.type = 'button';
      minus.addEventListener('click', function () { setCartPopupQty(item, item.qty - 1, popup); });
      plus.addEventListener('click', function () { setCartPopupQty(item, item.qty + 1, popup); });
      stepper.appendChild(minus);
      stepper.appendChild(qty);
      stepper.appendChild(plus);
      side.appendChild(stepper);

      row.appendChild(side);
      list.appendChild(row);
    });
  }
  popup.appendChild(list);

  const foot = el('div', 'cart-popup__foot');
  const view = el('a', 'cart-popup__btn cart-popup__btn--primary', 'Xem giỏ hàng');
  view.href = 'cart.html';
  const cont = el('button', 'cart-popup__btn cart-popup__btn--ghost', 'Tiếp tục mua sắm');
  cont.type = 'button';
  cont.addEventListener('click', closeCartPopup);
  foot.appendChild(view);
  foot.appendChild(cont);
  popup.appendChild(foot);
}

/** Đổi số lượng 1 dòng từ trong popup (đồng bộ badge + dựng lại popup). */
function setCartPopupQty(item, newQty, popup) {
  item.qty = Math.min(99, Math.max(1, newQty));
  updateCartBadge();
  renderCartPopup(popup);
  scheduleCartPopupClose();
}

/* ============ 6. CARD SẢN PHẨM (dùng chung) ============ */

function buildProductCard(product) {
  const card = el('article', 'product-card');

  // Ảnh + badge sale
  const imgWrap = el('a', 'product-card__img-wrap');
  imgWrap.href = 'product-detail.html?id=' + product.id;
  const img = el('img');
  img.src = product.img;
  img.alt = product.name;
  img.loading = 'lazy';
  imgWrap.appendChild(img);
  if (product.isSale && product.oldPrice) {
    const pct = Math.round((1 - product.price / product.oldPrice) * 100);
    imgWrap.appendChild(el('span', 'product-card__badge', '-' + pct + '%'));
  }
  card.appendChild(imgWrap);

  // Tên + mô tả
  const name = el('h3', 'product-card__name');
  const nameLink = el('a', '', product.name);
  nameLink.href = 'product-detail.html?id=' + product.id;
  name.appendChild(nameLink);
  card.appendChild(name);
  card.appendChild(el('p', 'product-card__desc', product.desc));

  // Giá cũ (gạch ngang) + giá mới
  card.appendChild(el('p', 'product-card__old-price', product.oldPrice ? fmtVND(product.oldPrice) : ''));
  card.appendChild(el('p', 'product-card__price', fmtVND(product.price)));

  // Nút thêm giỏ + yêu thích
  const actions = el('div', 'product-card__actions');
  const addBtn = el('button', 'btn-add-cart', 'THÊM VÀO GIỎ');
  // Mở popup chọn thông số (màu, số lượng) trước khi thêm vào giỏ — theo Figma
  addBtn.addEventListener('click', function () { openQuickAddModal(product); });
  const favBtn = el('button', 'btn-fav');
  favBtn.setAttribute('aria-label', 'Yêu thích');
  favBtn.innerHTML = ICONS.heart;
  favBtn.addEventListener('click', function () {
    favBtn.classList.toggle('is-active');
    showToast(favBtn.classList.contains('is-active')
      ? 'Đã thêm vào danh sách yêu thích'
      : 'Đã bỏ khỏi danh sách yêu thích');
  });
  actions.appendChild(addBtn);
  actions.appendChild(favBtn);
  card.appendChild(actions);

  return card;
}

/** Gắn carousel sản phẩm (hàng trượt ngang + 2 mũi tên) vào mount */
function buildProductCarousel(products) {
  const wrap = el('div', 'product-carousel');
  const row = el('div', 'product-row');
  products.forEach(function (p) { row.appendChild(buildProductCard(p)); });

  const prev = el('button', 'slider-arrow slider-arrow--prev');
  prev.setAttribute('aria-label', 'Trước');
  prev.innerHTML = ICONS.arrowLeft;
  const next = el('button', 'slider-arrow slider-arrow--next');
  next.setAttribute('aria-label', 'Sau');
  next.innerHTML = ICONS.arrowRight;

  const step = 256 * 2; // trượt 2 card mỗi lần bấm
  prev.addEventListener('click', function () { row.scrollBy({ left: -step, behavior: 'smooth' }); });
  next.addEventListener('click', function () { row.scrollBy({ left: step, behavior: 'smooth' }); });

  wrap.appendChild(prev);
  wrap.appendChild(row);
  wrap.appendChild(next);
  return wrap;
}

/* ============ 7. TRANG CHỦ ============ */

function initHomePage() {
  /* --- Hero slider --- */
  const hero = document.getElementById('hero');
  if (hero) {
    const track = hero.querySelector('.hero__track');
    const dotsWrap = hero.querySelector('.hero__dots');
    let current = 0;
    let timer = null;

    HERO_SLIDES.forEach(function (slide, i) {
      const s = el('div', 'hero__slide' + (i === 0 ? ' is-active' : ''));
      s.innerHTML =
        '<img src="' + slide.img + '" alt="' + slide.title + '">' ;
      const caption = el('div', 'hero__caption');
      caption.innerHTML = '<h2>' + slide.title + '</h2><p>' + slide.sub + '</p>';
      s.appendChild(caption);
      track.appendChild(s);

      const dot = el('button', 'hero__dot' + (i === 0 ? ' is-active' : ''));
      dot.setAttribute('aria-label', 'Chuyển đến slide ' + (i + 1));
      dot.addEventListener('click', function () { goTo(i); });
      dotsWrap.appendChild(dot);
    });

    const slides = track.querySelectorAll('.hero__slide');
    const dots = dotsWrap.querySelectorAll('.hero__dot');

    function goTo(i) {
      slides[current].classList.remove('is-active');
      dots[current].classList.remove('is-active');
      current = (i + slides.length) % slides.length;
      slides[current].classList.add('is-active');
      dots[current].classList.add('is-active');
      restartAuto();
    }
    function restartAuto() {
      clearInterval(timer);
      timer = setInterval(function () { goTo(current + 1); }, 5000);
    }
    hero.querySelector('.slider-arrow--prev').addEventListener('click', function () { goTo(current - 1); });
    hero.querySelector('.slider-arrow--next').addEventListener('click', function () { goTo(current + 1); });
    restartAuto();
  }

  /* --- Các hàng sản phẩm --- */
  const newMount = document.getElementById('row-new');
  if (newMount) newMount.appendChild(buildProductCarousel(PRODUCTS.filter(function (p) { return p.isNew; })));

  const saleMount = document.getElementById('row-sale');
  if (saleMount) saleMount.appendChild(buildProductCarousel(PRODUCTS.filter(function (p) { return p.isSale; })));

  const forYou1 = document.getElementById('row-foryou-1');
  if (forYou1) forYou1.appendChild(buildProductCarousel(PRODUCTS.slice(0, 8)));

  const forYou2 = document.getElementById('row-foryou-2');
  if (forYou2) forYou2.appendChild(buildProductCarousel(PRODUCTS.slice(8).concat(PRODUCTS.slice(0, 3))));

  /* --- CaraVeso Collections (slider bộ sưu tập) --- */
  const colWrap = document.getElementById('collections');
  if (colWrap) {
    let colIndex = 0;
    const imgBox = colWrap.querySelector('.collections__img');
    const img = imgBox.querySelector('img');
    const name = colWrap.querySelector('.collections__name');
    const tagline = colWrap.querySelector('.collections__tagline');

    function showCollection(i) {
      colIndex = (i + COLLECTIONS.length) % COLLECTIONS.length;
      const c = COLLECTIONS[colIndex];
      img.src = c.img;
      img.alt = 'Bộ sưu tập ' + c.name;
      name.textContent = c.name;
      tagline.textContent = c.tagline;
      // Dựng lại hotspot cho ảnh bộ sưu tập đang hiển thị (Yêu cầu 3)
      imgBox.querySelectorAll('.hotspot-point').forEach(function (pt) { pt.remove(); });
      buildHotspots(imgBox, c.hotspots);
    }
    colWrap.querySelector('.slider-arrow--prev').addEventListener('click', function () { showCollection(colIndex - 1); });
    colWrap.querySelector('.slider-arrow--next').addEventListener('click', function () { showCollection(colIndex + 1); });
    showCollection(0);
  }

  /* --- Nguồn cảm hứng --- */
  const inspMount = document.getElementById('inspirations');
  if (inspMount) {
    INSPIRATIONS.forEach(function (item, i) {
      // Mỗi ảnh nằm trong 1 cell relative để gắn hotspot (Yêu cầu 3)
      const cell = el('div', 'inspiration-cell');
      const img = el('img');
      img.src = item.img;
      img.alt = 'Nguồn cảm hứng ' + (i + 1);
      img.loading = 'lazy';
      cell.appendChild(img);
      buildHotspots(cell, item.hotspots);
      inspMount.appendChild(cell);
    });
  }
}

/* ============ 8. TRANG DANH SÁCH SẢN PHẨM ============ */

/* ============ TRANG DANH MỤC (accordion — ảnh 4, 5) ============ */
function initCategoryIndexPage() {
  const root = document.getElementById('catalog-root');
  if (!root) return;
  const key = document.body.dataset.catalog;
  const cat = CATALOG[key];
  if (!cat) return;

  document.title = cat.title + ' — CaraVeso';
  const bc = document.getElementById('catalog-breadcrumb-name');
  if (bc) bc.textContent = cat.breadcrumb;
  const titleEl = document.getElementById('catalog-title');
  if (titleEl) titleEl.textContent = cat.title;

  const acc = el('div', 'cat-acc');
  (cat.groups || []).forEach(function (g) {
    const item = el('div', 'cat-acc__item');

    const head = el('button', 'cat-acc__head');
    head.type = 'button';
    head.innerHTML = '<span>' + esc(g.label) + '</span>' + ICONS.arrowRight;

    const body = el('div', 'cat-acc__body');
    (g.children || []).forEach(function (child) {
      const link = el('a', 'cat-acc__link', child);
      link.href = catalogHref(key, g, child);
      body.appendChild(link);
    });

    head.addEventListener('click', function () { item.classList.toggle('is-open'); });
    item.appendChild(head);
    item.appendChild(body);
    acc.appendChild(item);
  });
  root.appendChild(acc);
}

function initProductsPage() {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  const PAGE_SIZE = 8;
  let visibleCount = PAGE_SIZE;

  const params = new URLSearchParams(window.location.search);
  const catParam = params.get('category');

  // Trạng thái bộ lọc
  const state = {
    q: params.get('q') || '',
    categories: catParam ? [catParam] : [],
    color: null,
    priceMin: null,
    priceMax: null,
    sort: 'default'
  };

  // Tiêu đề trang theo nhãn danh mục (từ mega-menu/accordion) hoặc từ khóa tìm kiếm
  const titleEl = document.querySelector('.page-title');
  const labelParam = params.get('label');
  if (labelParam && titleEl) {
    titleEl.innerHTML = esc(labelParam) + '<small id="result-count"></small>';
  } else if (state.q && titleEl) {
    titleEl.innerHTML = 'Kết quả cho "' + esc(state.q) + '"<small id="result-count"></small>';
  }

  // Breadcrumb: Trang chủ › Sản phẩm › <Tên danh mục / từ khóa>
  const bcCat = document.getElementById('products-breadcrumb-cat');
  if (bcCat) {
    if (labelParam) bcCat.textContent = labelParam;
    else if (state.q) bcCat.textContent = 'Kết quả cho "' + state.q + '"';
  }

  // Tích sẵn checkbox danh mục tương ứng nếu vào từ mega-menu/accordion
  if (catParam) {
    const cb = document.querySelector('input[name="category"][value="' + catParam + '"]');
    if (cb) cb.checked = true;
  }

  function applyFilters() {
    let list = PRODUCTS.slice();

    if (state.q) {
      const q = state.q.toLowerCase();
      list = list.filter(function (p) {
        return (p.name + ' ' + p.desc).toLowerCase().indexOf(q) !== -1;
      });
    }
    if (state.categories.length) {
      list = list.filter(function (p) { return state.categories.indexOf(p.category) !== -1; });
    }
    if (state.color) {
      list = list.filter(function (p) { return p.colors.indexOf(state.color) !== -1; });
    }
    if (state.priceMin !== null) list = list.filter(function (p) { return p.price >= state.priceMin; });
    if (state.priceMax !== null) list = list.filter(function (p) { return p.price <= state.priceMax; });

    if (state.sort === 'price-asc') list.sort(function (a, b) { return a.price - b.price; });
    if (state.sort === 'price-desc') list.sort(function (a, b) { return b.price - a.price; });
    if (state.sort === 'name') list.sort(function (a, b) { return a.name.localeCompare(b.name, 'vi'); });

    return list;
  }

  function render() {
    const list = applyFilters();
    grid.textContent = '';

    const countEl = document.getElementById('result-count');
    if (countEl) countEl.textContent = '(' + list.length + ' sản phẩm)';

    if (!list.length) {
      grid.appendChild(el('p', 'grid-empty', 'Không tìm thấy sản phẩm phù hợp với bộ lọc.'));
    } else {
      list.slice(0, visibleCount).forEach(function (p) { grid.appendChild(buildProductCard(p)); });
    }

    const loadMoreBtn = document.getElementById('btn-load-more');
    if (loadMoreBtn) loadMoreBtn.style.display = visibleCount >= list.length ? 'none' : '';
  }

  /* --- Sự kiện bộ lọc --- */

  // Thu gọn / mở rộng nhóm lọc
  document.querySelectorAll('.filter-group__head').forEach(function (head) {
    head.addEventListener('click', function () {
      head.closest('.filter-group').classList.toggle('is-collapsed');
    });
  });

  // Checkbox phân loại
  document.querySelectorAll('input[name="category"]').forEach(function (cb) {
    cb.addEventListener('change', function () {
      state.categories = Array.prototype.slice
        .call(document.querySelectorAll('input[name="category"]:checked'))
        .map(function (c) { return c.value; });
      visibleCount = PAGE_SIZE;
      render();
    });
  });

  // Ô màu
  document.querySelectorAll('.color-swatch').forEach(function (sw) {
    sw.addEventListener('click', function () {
      const isActive = sw.classList.contains('is-active');
      document.querySelectorAll('.color-swatch').forEach(function (s) { s.classList.remove('is-active'); });
      state.color = isActive ? null : sw.dataset.color;
      if (!isActive) sw.classList.add('is-active');
      visibleCount = PAGE_SIZE;
      render();
    });
  });

  // Khoảng giá — slider 2 node đồng bộ với 2 ô nhập (Yêu cầu 1)
  const priceMinInput = document.getElementById('price-min');
  const priceMaxInput = document.getElementById('price-max');
  const rangeMin = document.getElementById('price-range-min');
  const rangeMax = document.getElementById('price-range-max');
  const priceFill = document.getElementById('price-fill');

  if (rangeMin && rangeMax) {
    const P_MIN = Number(rangeMin.min);
    const P_MAX = Number(rangeMin.max);
    const P_GAP = Number(rangeMin.step) || 500000;

    function parsePrice(s) {
      const d = String(s).replace(/[^\d]/g, '');
      return d ? Number(d) : null;
    }
    function updateFill() {
      const span = P_MAX - P_MIN || 1;
      const lo = Number(rangeMin.value);
      const hi = Number(rangeMax.value);
      priceFill.style.left = ((lo - P_MIN) / span * 100) + '%';
      priceFill.style.right = ((P_MAX - hi) / span * 100) + '%';
    }
    // Đồng bộ ô nhập + trạng thái lọc từ vị trí 2 node, rồi render
    function syncFromSliders(doRender) {
      const lo = Number(rangeMin.value);
      const hi = Number(rangeMax.value);
      priceMinInput.value = lo.toLocaleString('vi-VN');
      priceMaxInput.value = hi.toLocaleString('vi-VN');
      updateFill();
      state.priceMin = lo > P_MIN ? lo : null;
      state.priceMax = hi < P_MAX ? hi : null;
      if (doRender) { visibleCount = PAGE_SIZE; render(); }
    }

    rangeMin.addEventListener('input', function () {
      // Không cho node min vượt node max (giữ khoảng cách tối thiểu 1 bước)
      if (Number(rangeMin.value) > Number(rangeMax.value) - P_GAP) {
        rangeMin.value = Number(rangeMax.value) - P_GAP;
      }
      syncFromSliders(true);
    });
    rangeMax.addEventListener('input', function () {
      if (Number(rangeMax.value) < Number(rangeMin.value) + P_GAP) {
        rangeMax.value = Number(rangeMin.value) + P_GAP;
      }
      syncFromSliders(true);
    });

    // Gõ giá trực tiếp vào ô input → cập nhật node tương ứng
    priceMinInput.addEventListener('change', function () {
      let v = parsePrice(priceMinInput.value);
      if (v === null) v = P_MIN;
      v = Math.max(P_MIN, Math.min(v, Number(rangeMax.value) - P_GAP));
      rangeMin.value = v;
      syncFromSliders(true);
    });
    priceMaxInput.addEventListener('change', function () {
      let v = parsePrice(priceMaxInput.value);
      if (v === null) v = P_MAX;
      v = Math.min(P_MAX, Math.max(v, Number(rangeMin.value) + P_GAP));
      rangeMax.value = v;
      syncFromSliders(true);
    });

    // Khởi tạo hiển thị (không render lại — render() gọi ở cuối hàm)
    syncFromSliders(false);
  }

  // Sắp xếp
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', function () {
      state.sort = sortSelect.value;
      render();
    });
  }

  // Xem thêm
  const loadMoreBtn = document.getElementById('btn-load-more');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', function () {
      visibleCount += PAGE_SIZE;
      render();
    });
  }

  render();
}

/* ============ 9. TRANG CHI TIẾT SẢN PHẨM ============ */

function initProductDetailPage() {
  const root = document.getElementById('pd-root');
  if (!root) return;

  const id = Number(new URLSearchParams(window.location.search).get('id')) || 2;
  const product = getProduct(id) || PRODUCTS[1];

  /* --- Đổ thông tin cơ bản --- */
  document.title = product.name + ' — CaraVeso';
  document.getElementById('pd-title').textContent = product.name;
  document.getElementById('pd-sku').textContent = product.sku;
  document.getElementById('pd-stock').textContent = 'Còn ' + product.stock + ' sản phẩm';
  document.getElementById('pd-price').textContent = fmtVND(product.price);

  /* Breadcrumb: Trang chủ › Sản phẩm › <Danh mục> › <Tên sản phẩm> */
  const bcCat = document.getElementById('pd-breadcrumb-cat');
  const catName = getCategoryName(product.category);
  if (bcCat) {
    if (catName) {
      bcCat.innerHTML = '<a href="' +
        catalogHref('products', { cat: product.category }, catName) + '">' + esc(catName) + '</a>';
    } else {
      bcCat.remove();
    }
  }
  document.getElementById('pd-breadcrumb-name').textContent = product.name;

  /* --- Gallery: ảnh chính + 6 thumbnail --- */
  const mainImg = document.getElementById('pd-main-img');
  mainImg.src = product.img;
  mainImg.alt = product.name;

  const thumbsWrap = document.getElementById('pd-thumbs');
  const galleryImgs = (Array.isArray(product.images) && product.images.length)
    ? product.images
    : [product.img];
  galleryImgs.forEach(function (src, i) {
    const btn = el('button', 'pd__thumb' + (i === 0 ? ' is-active' : ''));
    btn.innerHTML = '<img src="' + src + '" alt="Ảnh ' + (i + 1) + ' của ' + product.name + '" loading="lazy">';
    btn.addEventListener('click', function () {
      thumbsWrap.querySelectorAll('.pd__thumb').forEach(function (t) { t.classList.remove('is-active'); });
      btn.classList.add('is-active');
      mainImg.src = src;
    });
    thumbsWrap.appendChild(btn);
  });

  /* --- Chọn loại (nhãn + tùy chọn theo danh mục sản phẩm) --- */
  const typeCfg = getTypeConfig(product.category);
  const typeWrap = document.getElementById('pd-types');
  const typeValue = document.getElementById('pd-type-value');
  document.getElementById('pd-type-label').firstChild.textContent = typeCfg.label + ' ';
  document.getElementById('pd-type-count').textContent = '(' + typeCfg.options.length + ')';
  typeValue.textContent = typeCfg.options[0];
  typeWrap.textContent = '';
  typeCfg.options.forEach(function (opt, i) {
    const chip = el('button', 'pd__chip' + (i === 0 ? ' is-active' : ''), opt);
    chip.type = 'button';
    chip.addEventListener('click', function () {
      typeWrap.querySelectorAll('.pd__chip').forEach(function (c) { c.classList.remove('is-active'); });
      chip.classList.add('is-active');
      typeValue.textContent = opt;
    });
    typeWrap.appendChild(chip);
  });

  /* --- Chọn màu --- */
  const colorWrap = document.getElementById('pd-colors');
  const colorNames = COLOR_NAMES;
  const colorLabel = document.getElementById('pd-color-label');
  document.getElementById('pd-color-count').textContent = '(' + product.colors.length + ')';
  product.colors.forEach(function (color, i) {
    const b = el('button', 'pd__color-thumb' + (i === 0 ? ' is-active' : ''));
    b.style.background = color;
    b.setAttribute('aria-label', colorNames[color] || color);
    b.addEventListener('click', function () {
      colorWrap.querySelectorAll('.pd__color-thumb').forEach(function (c) { c.classList.remove('is-active'); });
      b.classList.add('is-active');
      colorLabel.textContent = colorNames[color] || color;
    });
    colorWrap.appendChild(b);
  });
  colorLabel.textContent = colorNames[product.colors[0]] || product.colors[0];

  /* --- Xổ / thu gọn danh sách lựa chọn khi bấm dấu > (Yêu cầu 2) --- */
  function bindOptionToggle(row, target) {
    if (!row || !target) return;
    target.classList.add('is-collapsed');   // mặc định thu gọn, chỉ mở khi bấm
    row.classList.remove('is-open');
    row.addEventListener('click', function () {
      const collapsed = target.classList.toggle('is-collapsed');
      row.classList.toggle('is-open', !collapsed);
    });
  }
  bindOptionToggle(document.getElementById('pd-type-label').closest('.pd__option-row'), typeWrap);
  bindOptionToggle(colorLabel.closest('.pd__option-row'), colorWrap);

  /* --- Bộ đếm số lượng --- */
  const qtyInput = document.getElementById('pd-qty');
  document.getElementById('pd-qty-minus').addEventListener('click', function () {
    qtyInput.value = Math.max(1, Number(qtyInput.value) - 1);
  });
  document.getElementById('pd-qty-plus').addEventListener('click', function () {
    qtyInput.value = Math.min(product.stock, Number(qtyInput.value) + 1);
  });
  qtyInput.addEventListener('change', function () {
    let v = parseInt(qtyInput.value, 10);
    if (isNaN(v) || v < 1) v = 1;
    if (v > product.stock) v = product.stock;
    qtyInput.value = v;
  });

  /* --- Nút hành động (trang chi tiết đã có sẵn thông số nên thêm thẳng) --- */
  document.getElementById('pd-add-cart').addEventListener('click', function () {
    cartAdd(product.id, Number(qtyInput.value));
    openCartPopup();
  });
  document.getElementById('pd-buy-now').addEventListener('click', function () {
    cartAdd(product.id, Number(qtyInput.value));
    window.location.href = 'checkout.html';
  });

  /* --- Tabs mô tả / thông số / bảo hành --- */
  const tabBtns = document.querySelectorAll('.tabs__btn');
  const tabPanels = document.querySelectorAll('.tabs__panel');
  tabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      tabBtns.forEach(function (b) { b.classList.remove('is-active'); });
      tabPanels.forEach(function (p) { p.classList.remove('is-active'); });
      btn.classList.add('is-active');
      document.getElementById(btn.dataset.tab).classList.add('is-active');
    });
  });

  /* --- Đánh giá + phân trang mô phỏng --- */
  const reviewsWrap = document.getElementById('pd-reviews');
  function renderReviews(page) {
    reviewsWrap.textContent = '';
    // Mô phỏng: trang nào cũng hiển thị danh sách REVIEWS (dữ liệu giả)
    REVIEWS.forEach(function (r, idx) {
      const item = el('div', 'review');
      let stars = '';
      for (let i = 1; i <= 5; i++) {
        stars += '<span class="' + (i <= r.stars ? 'star--on' : 'star--off') + '">★</span>';
      }
      // Ảnh đánh giá: dùng ảnh thật của chính sản phẩm đang xem
      const rvGallery = (product.images && product.images.length) ? product.images : [product.img];
      let imgs = '';
      for (let i = 0; i < r.images; i++) {
        imgs += '<span><img src="' + rvGallery[i % rvGallery.length] + '" alt="Ảnh đánh giá" loading="lazy"></span>';
      }
      // Avatar: dùng ảnh sản phẩm thật trong dự án (xoay vòng cho đa dạng)
      const avatarImg = PRODUCTS[idx % PRODUCTS.length].img;
      item.innerHTML =
        '<div class="review__avatar"><img src="' + avatarImg + '" alt="' + r.name + '"></div>' +
        '<div class="review__body">' +
          '<p class="review__name">' + r.name + '</p>' +
          '<p class="review__stars">' + stars + '</p>' +
          '<p class="review__meta">' + r.date + ' &nbsp;|&nbsp; Phân loại: ' + r.variant + '</p>' +
          '<p class="review__comment">' + r.comment + '</p>' +
          '<div class="review__images">' + imgs + '</div>' +
        '</div>';
      reviewsWrap.appendChild(item);
    });
  }
  const pageBtns = document.querySelectorAll('.pagination [data-page]');
  const prevBtn = document.getElementById('rv-prev');
  const nextBtn = document.getElementById('rv-next');
  let rvPage = 1;
  function goReviewPage(p) {
    rvPage = Math.min(3, Math.max(1, p));
    pageBtns.forEach(function (b) {
      b.classList.toggle('is-active', Number(b.dataset.page) === rvPage);
    });
    renderReviews(rvPage);
  }
  pageBtns.forEach(function (b) {
    b.addEventListener('click', function () { goReviewPage(Number(b.dataset.page)); });
  });
  if (prevBtn) prevBtn.addEventListener('click', function () { goReviewPage(rvPage - 1); });
  if (nextBtn) nextBtn.addEventListener('click', function () { goReviewPage(rvPage + 1); });
  goReviewPage(1);

  /* --- Sản phẩm tương tự --- */
  const relatedMount = document.getElementById('pd-related');
  if (relatedMount) {
    const related = PRODUCTS.filter(function (p) {
      return p.category === product.category && p.id !== product.id;
    });
    const filled = related.length >= 4
      ? related
      : related.concat(PRODUCTS.filter(function (p) { return p.id !== product.id; })).slice(0, 8);
    relatedMount.appendChild(buildProductCarousel(filled));
  }
}

/* ============ 10. TRANG GIỎ HÀNG ============ */

const SHIPPING_FREE_LABEL = 'Miễn phí giao hàng';

/* Tính tiền cho một danh sách mặt hàng bất kỳ (dùng chung cho giỏ + thanh toán).
   Quy ước để hiển thị nhất quán: Tạm tính (giá gốc) − Giảm giá = Tổng.
     • subtotal  = Σ giá gốc (oldPrice, nếu không có thì price) × qty
     • saleDiscount = phần đã giảm sẵn của sản phẩm
     • voucherDiscount = giảm thêm theo mã (percent tính trên giá bán sau khuyến mãi) */
function computeTotals(items) {
  const subtotal = items.reduce(function (sum, i) {
    const p = getProduct(i.productId);
    return sum + (p.oldPrice || p.price) * i.qty;
  }, 0);
  const saleDiscount = items.reduce(function (sum, i) {
    const p = getProduct(i.productId);
    return sum + (p.oldPrice ? (p.oldPrice - p.price) * i.qty : 0);
  }, 0);
  let voucherDiscount = 0;
  if (appliedVoucher) {
    voucherDiscount = appliedVoucher.type === 'percent'
      ? Math.round((subtotal - saleDiscount) * appliedVoucher.value / 100)
      : appliedVoucher.value;
  }
  const discount = saleDiscount + voucherDiscount;
  return {
    itemCount: items.length,
    subtotal: subtotal,
    discount: discount,
    total: Math.max(0, subtotal - discount)
  };
}

function cartTotals() {
  return computeTotals(cartState.filter(function (i) { return i.checked; }));
}

function initCartPage() {
  const listWrap = document.getElementById('cart-items');
  if (!listWrap) return;

  function renderSummary() {
    const t = cartTotals();
    document.getElementById('sum-count').textContent = t.itemCount;
    document.getElementById('sum-subtotal-label').textContent = 'Tạm tính (' + t.itemCount + ' mặt hàng)';
    document.getElementById('sum-subtotal').textContent = fmtVND(t.subtotal);
    document.getElementById('sum-shipping').textContent = SHIPPING_FREE_LABEL;
    document.getElementById('sum-discount').textContent = fmtVND(t.discount);
    document.getElementById('sum-total').textContent = fmtVND(t.total);
  }

  function renderList() {
    listWrap.textContent = '';
    document.getElementById('cart-count').textContent = 'Mặt hàng (' + cartState.length + ')';

    if (!cartState.length) {
      const empty = el('div', 'cart-empty');
      empty.innerHTML = '<p style="font-size:20px;margin-bottom:14px">Giỏ hàng của bạn đang trống.</p>' +
        '<a class="btn-primary" href="products.html">Tiếp tục mua sắm</a>';
      listWrap.appendChild(empty);
      renderSummary();
      return;
    }

    cartState.forEach(function (item) {
      const p = getProduct(item.productId);
      const row = el('div', 'cart-item');

      // Checkbox chọn mặt hàng
      const check = el('input', 'cart-item__check');
      check.type = 'checkbox';
      check.checked = item.checked;
      check.setAttribute('aria-label', 'Chọn ' + p.name);
      check.addEventListener('change', function () {
        item.checked = check.checked;
        renderSummary();
      });

      // Ảnh
      const imgWrap = el('a', 'cart-item__img');
      imgWrap.href = 'product-detail.html?id=' + p.id;
      imgWrap.innerHTML = '<img src="' + p.img + '" alt="' + p.name + '">';

      // Nội dung
      const body = el('div', 'cart-item__body');
      const top = el('div', 'cart-item__top');
      const info = el('div');
      info.appendChild(el('h3', 'cart-item__name', p.name));
      const attr1 = el('p', 'cart-item__attr');
      attr1.innerHTML = '<b>Kích thước:</b> 1m8 × 2m';
      const attr2 = el('p', 'cart-item__attr');
      attr2.innerHTML = '<b>Chất liệu:</b> Cao su tự nhiên';
      const attr3 = el('p', 'cart-item__attr');
      attr3.innerHTML = '<b>Số lượng:</b> <span>' + item.qty + '</span>';
      info.appendChild(attr1);
      info.appendChild(attr2);
      info.appendChild(attr3);

      // Bộ đếm số lượng
      const stepper = el('div', 'qty-stepper');
      const minus = el('button', '', '−');
      const qtyInput = el('input');
      qtyInput.type = 'text';
      qtyInput.value = item.qty;
      qtyInput.setAttribute('aria-label', 'Số lượng');
      const plus = el('button', '', '+');
      minus.addEventListener('click', function () { changeQty(item, item.qty - 1); });
      plus.addEventListener('click', function () { changeQty(item, item.qty + 1); });
      qtyInput.addEventListener('change', function () {
        changeQty(item, parseInt(qtyInput.value, 10) || 1);
      });
      stepper.appendChild(minus);
      stepper.appendChild(qtyInput);
      stepper.appendChild(plus);

      top.appendChild(info);
      top.appendChild(stepper);
      body.appendChild(top);

      // Nút xóa
      const removeBtn = el('button', 'cart-item__remove');
      removeBtn.innerHTML = ICONS.trash + ' Xóa';
      removeBtn.addEventListener('click', function () {
        const idx = cartState.indexOf(item);
        if (idx !== -1) cartState.splice(idx, 1);
        updateCartBadge();
        renderList();
      });
      body.appendChild(removeBtn);

      // Tạm tính từng dòng
      const bottom = el('div', 'cart-item__bottom');
      const sub = el('div', 'cart-item__subtotal');
      sub.innerHTML = '<small>Tạm tính (đã bao gồm thuế)</small><strong>' + fmtVND(p.price * item.qty) + '</strong>';
      bottom.appendChild(sub);
      body.appendChild(bottom);

      row.appendChild(check);
      row.appendChild(imgWrap);
      row.appendChild(body);
      listWrap.appendChild(row);
    });
    renderSummary();
  }

  function changeQty(item, newQty) {
    item.qty = Math.min(99, Math.max(1, newQty));
    updateCartBadge();
    renderList();
  }

  /* --- Mã giảm giá --- */
  const voucherInput = document.getElementById('voucher-input');
  const voucherMsg = document.getElementById('voucher-msg');
  document.getElementById('voucher-apply').addEventListener('click', function () {
    const code = voucherInput.value.trim().toUpperCase();
    voucherMsg.classList.remove('is-ok', 'is-err');
    if (!code) {
      voucherMsg.textContent = 'Vui lòng nhập mã giảm giá.';
      voucherMsg.classList.add('is-err');
      return;
    }
    if (VOUCHERS[code]) {
      appliedVoucher = VOUCHERS[code];
      voucherMsg.textContent = 'Áp dụng thành công: ' + appliedVoucher.label;
      voucherMsg.classList.add('is-ok');
    } else {
      appliedVoucher = null;
      voucherMsg.textContent = 'Mã "' + code + '" không hợp lệ hoặc đã hết hạn.';
      voucherMsg.classList.add('is-err');
    }
    renderSummary();
  });

  /* --- Nút thanh toán --- */
  document.getElementById('btn-checkout').addEventListener('click', function () {
    if (!cartState.some(function (i) { return i.checked; })) {
      showToast('Vui lòng chọn ít nhất 1 mặt hàng để thanh toán');
      return;
    }
    window.location.href = 'checkout.html';
  });

  renderList();
}

/* ============ 11. LUỒNG THANH TOÁN ============ */
/* Luồng theo Figma:
   Giỏ hàng → checkout.html (địa chỉ + phương thức)
     • COD                  → order-success.html
     • Momo/chuyển khoản    → payment-method.html → payment-gateway.html?method=momo|bank
                              → (quét QR / bấm "Tại đây") → order-success.html
   Dữ liệu đơn hàng (mã đơn, tổng tiền) truyền qua query string — không dùng localStorage. */

/** Sinh mã đơn hàng dạng H000358241 */
function makeOrderId() {
  return 'H' + String(Math.floor(Math.random() * 1e9)).padStart(9, '0');
}

/** Đọc tham số đơn hàng từ URL (có giá trị mặc định để mở trang trực tiếp vẫn chạy) */
function getOrderParams() {
  const q = new URLSearchParams(window.location.search);
  return {
    order: q.get('order') || makeOrderId(),
    total: Number(q.get('total')) || 30000000,
    method: q.get('method') || 'momo'
  };
}

function initCheckoutPage() {
  const form = document.getElementById('checkout-form');
  if (!form) return;

  /* --- Tóm tắt đơn hàng (cột phải) --- */
  const itemsWrap = document.getElementById('checkout-items');
  const selected = cartState.filter(function (i) { return i.checked; });
  const source = selected.length ? selected : cartState;
  let ckTotals = computeTotals(source);

  source.forEach(function (item) {
    const p = getProduct(item.productId);

    const row = el('div', 'ck-order-item');
    row.innerHTML =
      '<img class="ck-order-item__img" src="' + p.img + '" alt="' + p.name + '">' +
      '<div>' +
        '<p class="ck-order-item__name">' + p.name + '</p>' +
        '<p class="ck-order-item__attr"><b>Kích thước:</b> 1m8 × 2m</p>' +
        '<p class="ck-order-item__attr"><b>Chất liệu:</b> Cao su tự nhiên</p>' +
        '<p class="ck-order-item__attr"><b>Số lượng:</b> ' + item.qty + '</p>' +
        '<p class="ck-order-item__price">' + fmtVND(p.price * item.qty) + '</p>' +
      '</div>';
    itemsWrap.appendChild(row);
  });

  document.getElementById('ck-count').textContent = source.length;
  document.getElementById('ck-subtotal-label').textContent = 'Tạm tính (' + source.length + ' mặt hàng)';
  document.getElementById('ck-subtotal').textContent = fmtVND(ckTotals.subtotal);

  // Cập nhật lại phần Giảm giá / Tổng tiền (thay đổi khi áp mã giảm giá)
  function renderCkSummary() {
    ckTotals = computeTotals(source);
    document.getElementById('ck-discount').textContent = fmtVND(ckTotals.discount);
    document.getElementById('ck-total').textContent = fmtVND(ckTotals.total);
  }
  renderCkSummary();

  /* --- Mã giảm giá (áp dụng ngay ở trang thanh toán — phục vụ luồng "Mua nhanh") --- */
  const ckVoucherInput = document.getElementById('ck-voucher-input');
  const ckVoucherMsg = document.getElementById('ck-voucher-msg');
  const ckVoucherApply = document.getElementById('ck-voucher-apply');
  if (ckVoucherApply) {
    // Nếu đã áp mã từ trang giỏ hàng thì hiển thị lại cho nhất quán
    if (appliedVoucher) {
      const applied = Object.keys(VOUCHERS).filter(function (k) { return VOUCHERS[k] === appliedVoucher; })[0];
      if (applied) ckVoucherInput.value = applied;
      ckVoucherMsg.textContent = 'Áp dụng thành công: ' + appliedVoucher.label;
      ckVoucherMsg.classList.add('is-ok');
    }
    ckVoucherApply.addEventListener('click', function () {
      const code = ckVoucherInput.value.trim().toUpperCase();
      ckVoucherMsg.classList.remove('is-ok', 'is-err');
      if (!code) {
        ckVoucherMsg.textContent = 'Vui lòng nhập mã giảm giá.';
        ckVoucherMsg.classList.add('is-err');
        return;
      }
      if (VOUCHERS[code]) {
        appliedVoucher = VOUCHERS[code];
        ckVoucherMsg.textContent = 'Áp dụng thành công: ' + appliedVoucher.label;
        ckVoucherMsg.classList.add('is-ok');
      } else {
        appliedVoucher = null;
        ckVoucherMsg.textContent = 'Mã "' + code + '" không hợp lệ hoặc đã hết hạn.';
        ckVoucherMsg.classList.add('is-err');
      }
      renderCkSummary();
    });
  }

  /* --- Select Tỉnh / Quận / Phường phụ thuộc nhau --- */
  const citySel = document.getElementById('ck-city');
  const districtSel = document.getElementById('ck-district');
  const wardSel = document.getElementById('ck-ward');

  function fillSelect(sel, placeholder, names) {
    sel.textContent = '';
    const ph = el('option', '', placeholder);
    ph.value = '';
    sel.appendChild(ph);
    names.forEach(function (n) {
      const opt = el('option', '', n);
      opt.value = n;
      sel.appendChild(opt);
    });
  }
  fillSelect(citySel, 'Lựa chọn Tỉnh/ Thành phố', LOCATIONS.map(function (l) { return l.name; }));
  fillSelect(districtSel, 'Lựa chọn Quận/ Huyện', []);
  fillSelect(wardSel, 'Lựa chọn Phường/ Xã', []);

  citySel.addEventListener('change', function () {
    const city = LOCATIONS.find(function (l) { return l.name === citySel.value; });
    fillSelect(districtSel, 'Lựa chọn Quận/ Huyện', city ? city.districts.map(function (d) { return d.name; }) : []);
    fillSelect(wardSel, 'Lựa chọn Phường/ Xã', []);
  });
  districtSel.addEventListener('change', function () {
    const city = LOCATIONS.find(function (l) { return l.name === citySel.value; });
    const district = city && city.districts.find(function (d) { return d.name === districtSel.value; });
    fillSelect(wardSel, 'Lựa chọn Phường/ Xã', district ? district.wards : []);
  });

  /* --- Loại địa chỉ (chip) + công tắc mặc định --- */
  document.querySelectorAll('.addr-chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      document.querySelectorAll('.addr-chip').forEach(function (c) { c.classList.remove('is-active'); });
      chip.classList.add('is-active');
    });
  });
  const switchEl = document.getElementById('ck-default-switch');
  switchEl.parentElement.addEventListener('click', function () {
    switchEl.classList.toggle('is-on');
  });

  /* --- Validate + điều hướng theo phương thức --- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const ok = validateForm([
      { id: 'ck-name', check: function (v) { return v.length >= 2; }, msg: 'Vui lòng nhập họ tên đầy đủ.' },
      { id: 'ck-phone', check: function (v) { return /^(0|\+84)\d{9,10}$/.test(v.replace(/\s/g, '')); }, msg: 'Số điện thoại không hợp lệ (VD: 0912345678).' },
      { id: 'ck-city', check: function (v) { return v !== ''; }, msg: 'Vui lòng chọn Tỉnh/ Thành phố.' },
      { id: 'ck-district', check: function (v) { return v !== ''; }, msg: 'Vui lòng chọn Quận/ Huyện.' },
      { id: 'ck-ward', check: function (v) { return v !== ''; }, msg: 'Vui lòng chọn Phường/ Xã.' },
      { id: 'ck-address', check: function (v) { return v.length >= 5; }, msg: 'Vui lòng nhập địa chỉ giao hàng.' }
    ]);
    if (!ok) return;

    const orderQuery = 'order=' + makeOrderId() + '&total=' + ckTotals.total;
    const method = document.querySelector('input[name="pay"]:checked').value;
    if (method === 'cod') {
      // COD: hoàn tất luôn
      window.location.href = 'order-success.html?' + orderQuery;
    } else {
      // Momo / chuyển khoản: sang trang chọn cổng thanh toán
      window.location.href = 'payment-method.html?' + orderQuery;
    }
  });
}

/* --- Trang chọn Momo hoặc Ngân hàng --- */
function initPaymentMethodPage() {
  const btn = document.getElementById('pm-submit');
  if (!btn) return;
  const params = getOrderParams();
  btn.addEventListener('click', function () {
    const method = document.querySelector('input[name="pm"]:checked').value;
    window.location.href = 'payment-gateway.html?method=' + method +
      '&order=' + params.order + '&total=' + params.total;
  });
}

/* --- Trang cổng thanh toán Momo / Ngân hàng --- */
function initGatewayPage() {
  const root = document.getElementById('gw-root');
  if (!root) return;
  const params = getOrderParams();
  const isMomo = params.method !== 'bank';
  const successUrl = 'order-success.html?order=' + params.order + '&total=' + params.total;

  /* Áp theme + nội dung theo cổng */
  document.body.classList.add(isMomo ? 'gw-momo' : 'gw-bank');
  document.title = (isMomo ? 'Thanh toán Momo' : 'Thanh toán Ngân hàng') + ' — CaraVeso';
  document.getElementById('gw-brand-name').textContent =
    isMomo ? 'Cổng thanh toán Momo' : 'Cổng thanh toán Ngân hàng';
  document.getElementById('gw-brand-icon').innerHTML = isMomo
    ? '<img class="momo-logo momo-logo--sm" src="img/logo_momo.png" alt="MoMo">'
    : ICONS.bank;
  document.getElementById('gw-order-id').textContent = params.order;
  document.getElementById('gw-desc').textContent = 'Payment for order #' + (isMomo ? 'Momo' : 'Bank');
  document.getElementById('gw-amount').textContent = fmtVND(params.total);

  /* Khối QR: Momo (ảnh khối QR hồng) / Ngân hàng (VietQR) — dùng ảnh nguồn trong /img */
  const qrWrap = document.getElementById('gw-qr');
  if (isMomo) {
    qrWrap.className = 'gw-qr--momo';
    qrWrap.innerHTML =
      '<button class="gw-qr-box gw-qr-box--img" id="gw-pay-demo" title="Nhấn để mô phỏng đã quét mã">' +
      '<img src="img/qr_momo.png" alt="Mã QR thanh toán MoMo"></button>';
  } else {
    qrWrap.className = 'gw-qr--bank';
    qrWrap.innerHTML =
      '<h3>Quét mã qua App Ngân hàng/ Ví điện tử</h3>' +
      '<button class="gw-qr-box" id="gw-pay-demo" title="Nhấn để mô phỏng đã quét mã">' +
      '<img src="img/qr_bank.png" alt="Mã QR VietQR — napas 247"></button>';
  }

  /* Mô phỏng thanh toán thành công: bấm QR hoặc link "Tại đây" */
  document.getElementById('gw-pay-demo').addEventListener('click', function () {
    window.location.href = successUrl;
  });
  document.getElementById('gw-result-link').addEventListener('click', function (e) {
    e.preventDefault();
    window.location.href = successUrl;
  });

  /* Bấm "Quay lại" giữa chừng = hủy giao dịch → hiện PopUp cảnh báo */
  const backLink = document.querySelector('.back-link');
  backLink.addEventListener('click', function (e) {
    e.preventDefault();
    openCancelWarning(function () {
      window.location.href = 'payment-method.html?order=' + params.order + '&total=' + params.total;
    });
  });

  /* Đếm ngược 10 phút — hết hạn thì hiện PopUp cảnh báo (theo Figma) */
  const minEl = document.getElementById('gw-min');
  const secEl = document.getElementById('gw-sec');
  let remain = 10 * 60;
  const timer = setInterval(function () {
    remain--;
    if (remain <= 0) {
      clearInterval(timer);
      minEl.textContent = '00';
      secEl.textContent = '00';
      openModal(
        '<h3 class="modal__title" style="color:var(--color-danger)">⚠ Đơn hàng đã hết hạn!</h3>' +
        '<p style="margin:12px 0 22px;font-size:15px;line-height:1.6">Phiên thanh toán cho đơn hàng ' +
        '<b>' + params.order + '</b> đã hết hạn. Vui lòng thực hiện lại giao dịch.</p>' +
        '<div class="modal__actions">' +
          '<a class="btn-primary" href="cart.html">Về giỏ hàng</a>' +
          '<button class="btn-outline" onclick="window.location.reload()">Thử lại</button>' +
        '</div>'
      );
      return;
    }
    minEl.textContent = String(Math.floor(remain / 60)).padStart(2, '0');
    secEl.textContent = String(remain % 60).padStart(2, '0');
  }, 1000);
}

/* --- Trang đặt hàng thành công --- */
function initOrderSuccessPage() {
  const codeEl = document.getElementById('success-order-id');
  if (!codeEl) return;
  codeEl.textContent = '#' + getOrderParams().order;
}

/* ============ 12. ĐĂNG NHẬP / ĐĂNG KÝ ============ */

/** Validate chung: rules = [{id, check(value), msg}] — hiện lỗi dưới từng ô input */
function validateForm(rules) {
  let ok = true;
  rules.forEach(function (rule) {
    const input = document.getElementById(rule.id);
    const errorEl = input.parentElement.querySelector('.form-error');
    const value = input.value.trim();
    if (!value) {
      input.classList.add('is-invalid');
      errorEl.textContent = 'Trường này không được để trống.';
      ok = false;
    } else if (!rule.check(value)) {
      input.classList.add('is-invalid');
      errorEl.textContent = rule.msg;
      ok = false;
    } else {
      input.classList.remove('is-invalid');
      errorEl.textContent = '';
    }
  });
  return ok;
}

/** Gắn nút ẩn/hiện mật khẩu cho mọi ô .password-field (theo Figma có icon con mắt) */
function initPasswordToggles() {
  document.querySelectorAll('.toggle-password').forEach(function (btn) {
    const input = btn.parentElement.querySelector('input');
    btn.innerHTML = ICONS.eyeOff;
    btn.addEventListener('click', function () {
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.innerHTML = show ? ICONS.eye : ICONS.eyeOff;
    });
  });
}

function initLoginPage() {
  const form = document.getElementById('login-form');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const ok = validateForm([
      { id: 'lg-email', check: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }, msg: 'Email không đúng định dạng.' },
      { id: 'lg-password', check: function (v) { return v.length >= 6; }, msg: 'Mật khẩu tối thiểu 6 ký tự.' }
    ]);
    if (ok) {
      showToast('Đăng nhập thành công! (mô phỏng)');
      setTimeout(function () { window.location.href = 'index.html'; }, 1200);
    }
  });
}

function initRegisterPage() {
  const form = document.getElementById('register-form');
  if (!form) return;

  const agree = document.getElementById('rg-agree');
  const agreeError = document.getElementById('rg-agree-error');
  agree.addEventListener('change', function () {
    if (agree.checked) agreeError.textContent = '';
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    // Email hoặc Số điện thoại (theo placeholder trong Figma)
    const okFields = validateForm([
      {
        id: 'rg-email',
        check: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || /^(0|\+84)\d{9,10}$/.test(v.replace(/\s/g, ''));
        },
        msg: 'Vui lòng nhập email hợp lệ hoặc số điện thoại (VD: 0912345678).'
      },
      { id: 'rg-name', check: function (v) { return v.length >= 2; }, msg: 'Họ tên tối thiểu 2 ký tự.' },
      { id: 'rg-password', check: function (v) { return v.length >= 6; }, msg: 'Mật khẩu tối thiểu 6 ký tự.' }
    ]);

    // Bắt buộc tick "Tôi trên 16 tuổi và đồng ý..."
    let okAgree = true;
    if (!agree.checked) {
      agreeError.textContent = 'Bạn cần đồng ý với Điều khoản và điều kiện để tiếp tục.';
      okAgree = false;
    }

    if (okFields && okAgree) {
      openModal(
        '<h3 class="modal__title modal__title--ok">' + ICONS.check + ' Đăng ký thành công!</h3>' +
        '<p style="margin:14px 0 22px;font-size:15px">Chào mừng bạn đến với CaraVeso. Voucher 100.000 VNĐ đã được gửi vào email của bạn.</p>' +
        '<div class="modal__actions"><a class="btn-primary" href="login.html">Đăng nhập ngay</a></div>'
      );
    }
  });
}

/* ============ 13. TRANG KHUYẾN MÃI (Countdown) ============ */

/* ============ TRANG CÁC PHÒNG (room.html) & PHONG CÁCH (style.html) ============ */

/** Gắn các nút tròn (hotspot) lên một ô ảnh collage.
    Hover (desktop) hoặc bấm (mobile) sẽ hiện tooltip sản phẩm. */
function buildHotspots(cell, hotspots) {
  (hotspots || []).forEach(function (h) {
    const p = getProduct(h.productId);
    if (!p) return;

    const point = el('div', 'hotspot-point' + (h.x > 55 ? ' hotspot-point--left' : ''));
    point.style.left = h.x + '%';
    point.style.top = h.y + '%';

    const dot = el('button', 'hotspot');
    dot.setAttribute('aria-label', 'Xem sản phẩm ' + p.name);

    // Tooltip = mini card sản phẩm, bấm vào đi tới trang chi tiết
    const tip = el('a', 'hotspot-tooltip');
    tip.href = 'product-detail.html?id=' + p.id;
    tip.innerHTML =
      '<div class="hotspot-tooltip__top">' +
        '<img src="' + p.img + '" alt="' + p.name + '">' +
        '<div>' +
          '<p class="hotspot-tooltip__name">' + p.name + '</p>' +
          '<p class="hotspot-tooltip__desc">' + p.desc + '</p>' +
        '</div>' +
      '</div>' +
      '<p class="hotspot-tooltip__price">' + fmtVND(p.price) + '</p>' +
      '<div class="hotspot-tooltip__foot">' +
        '<span class="hotspot-tooltip__hint">Nhấn để xem chi tiết</span>' +
        '<button class="hotspot-tooltip__icon" data-act="cart" aria-label="Thêm vào giỏ">' + ICONS.cart + '</button>' +
        '<button class="hotspot-tooltip__icon" data-act="fav" aria-label="Yêu thích">' + ICONS.heart + '</button>' +
      '</div>';

    // Icon giỏ/tim trong tooltip: không điều hướng, chỉ thao tác nhanh
    tip.querySelector('[data-act="cart"]').addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      cartAdd(p.id, 1);
      openCartPopup();
    });
    tip.querySelector('[data-act="fav"]').addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      e.currentTarget.classList.toggle('is-active');
      showToast(e.currentTarget.classList.contains('is-active')
        ? 'Đã thêm vào danh sách yêu thích'
        : 'Đã bỏ khỏi danh sách yêu thích');
    });

    // Bấm nút tròn (mobile/touch): bật tắt tooltip
    dot.addEventListener('click', function (e) {
      e.stopPropagation();
      const wasOpen = point.classList.contains('is-open');
      document.querySelectorAll('.hotspot-point.is-open').forEach(function (pt) { pt.classList.remove('is-open'); });
      if (!wasOpen) point.classList.add('is-open');
    });

    point.appendChild(dot);
    point.appendChild(tip);
    cell.appendChild(point);
  });
}

/** Dựng 1 khối collage ảnh + hotspot.
    layout = 'slider': ảnh hiện nguyên khung (không crop), cuộn ngang có mũi tên. */
function renderCollage(mountId, images, layout) {
  const mount = document.getElementById(mountId);
  if (!mount) return;
  if (layout === 'slider') {
    mount.className = 'collage-slider';
    const track = el('div', 'collage-slider__track');
    images.forEach(function (item) {
      const slide = el('div', 'collage-slide');
      const img = el('img');
      img.src = item.img;
      img.alt = '';
      slide.appendChild(img);
      buildHotspots(slide, item.hotspots);
      track.appendChild(slide);
    });
    const prev = el('button', 'slider-arrow slider-arrow--prev');
    prev.setAttribute('aria-label', 'Trước');
    prev.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M15 18l-6-6 6-6"/></svg>';
    const next = el('button', 'slider-arrow slider-arrow--next');
    next.setAttribute('aria-label', 'Sau');
    next.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M9 6l6 6-6 6"/></svg>';
    prev.addEventListener('click', function () { track.scrollBy({ left: -520, behavior: 'smooth' }); });
    next.addEventListener('click', function () { track.scrollBy({ left: 520, behavior: 'smooth' }); });
    mount.appendChild(prev);
    mount.appendChild(track);
    mount.appendChild(next);
    return;
  }
  images.forEach(function (item, i) {
    const cell = el('div', 'collage__cell' + (i === 0 ? ' collage__cell--main' : ''));
    const img = el('img');
    img.src = item.img;
    img.alt = '';
    img.loading = 'lazy';
    cell.appendChild(img);
    buildHotspots(cell, item.hotspots);
    mount.appendChild(cell);
  });
}

/* Ảnh đại diện cho từng danh mục (dùng ảnh sản phẩm thật trong img/products) */
const CAT_IMAGES = {
  'giuong': 'giuong.webp',
  'tu-ao': 'tu-quan-ao-oak-wood-4-canh.webp',
  'ban-lam-viec': 'ban.webp',
  'tu-ngan-keo': 'ke.webp',
  'tham': 'loha.webp',
  'ban-trang-diem': 'ke.webp',
  'sofa': 'sofa.webp',
  'ban-tra': 'ban.webp',
  'ke-tivi': 'kebep.webp',
  'den-san': 'den.webp',
  'tu-trang-tri': 'tu-quan-ao-oak-wood-4-canh.webp',
  'ban-an': 'ban.webp',
  'ghe-an': 'ghe-go.webp',
  'tu-bep': 'kebep.webp',
  'den-tha': 'den.webp',
  'ke-ruou': 'kebep.webp',
  'ghe-xoay': 'ghe.webp',
  'ke-sach': 'kebep.webp',
  'den-ban': 'den.webp',
  'tu-ho-so': 'tu-quan-ao-oak-wood-4-canh.webp'
};

function initRoomPage() {
  const root = document.getElementById('room-root');
  if (!root) return;

  const roomId = new URLSearchParams(window.location.search).get('room') || 'phong-ngu';
  const room = ROOMS[roomId] || ROOMS['phong-ngu'];

  document.title = room.name + ' — CaraVeso';
  document.getElementById('room-breadcrumb-name').textContent = room.name;
  document.getElementById('room-title').textContent = room.name;
  document.getElementById('room-desc').textContent = room.desc;
  const heroImg = document.getElementById('room-hero-img');
  heroImg.src = room.img;
  heroImg.alt = room.name;

  /* --- Danh mục sản phẩm (hàng ảnh cuộn ngang) --- */
  const catRow = document.getElementById('room-categories');
  room.categories.forEach(function (cat, i) {
    const a = el('a', 'cat-card');
    a.href = 'products.html';
    a.setAttribute('aria-label', cat);
    const catImg = (CAT_IMAGES[cat] || 'sofa.webp');
    a.innerHTML = '<img src="img/products/' + catImg + '" alt="' + cat + '" loading="lazy">';
    catRow.appendChild(a);
  });

  /* --- Ý tưởng: 4 card phong cách, KHÁM PHÁ -> style.html --- */
  document.getElementById('room-idea-title').textContent = room.ideaTitle;
  const ideaRow = document.getElementById('idea-row');
  Object.keys(STYLES).forEach(function (key) {
    const s = STYLES[key];
    const href = 'style.html?style=' + key + '&room=' + roomId;
    const ideaImg = (room.ideaImages && room.ideaImages[key]) || (STYLES[key] && STYLES[key].heroImg) || 'img/rooms/phòng ngủ.jpg';
    const card = el('article', 'idea-card');
    card.innerHTML =
      '<a class="idea-card__img" href="' + href + '">' +
        '<img src="' + ideaImg + '" alt="' + s.display + '" loading="lazy">' +
      '</a>' +
      '<h3 class="idea-card__title">' + s.display + '</h3>' +
      '<p class="idea-card__desc">' + s.cardDesc + '</p>' +
      '<a class="idea-card__btn" href="' + href + '">KHÁM PHÁ</a>';
    ideaRow.appendChild(card);
  });
  const ideaWrap = document.getElementById('idea-carousel');
  ideaWrap.querySelector('.slider-arrow--prev').addEventListener('click', function () {
    ideaRow.scrollBy({ left: -640, behavior: 'smooth' });
  });
  ideaWrap.querySelector('.slider-arrow--next').addEventListener('click', function () {
    ideaRow.scrollBy({ left: 640, behavior: 'smooth' });
  });

  /* --- 2 khối collage có hotspot --- */
  document.getElementById('collage1-title').textContent = room.collage1.title;
  document.getElementById('collage1-sub').textContent = room.collage1.sub;
  renderCollage('collage-1', room.collage1.images, room.collage1.layout);

  document.getElementById('collage2-title').textContent = room.collage2.title;
  document.getElementById('collage2-sub').textContent = room.collage2.sub;
  renderCollage('collage-2', room.collage2.images, room.collage2.layout);

  // Bấm ra ngoài thì đóng tooltip đang mở (cho mobile)
  document.addEventListener('click', function () {
    document.querySelectorAll('.hotspot-point.is-open').forEach(function (pt) { pt.classList.remove('is-open'); });
  });
}

function initStylePage() {
  const root = document.getElementById('style-root');
  if (!root) return;

  const q = new URLSearchParams(window.location.search);
  const styleId = q.get('style') || 'zen';
  const roomId = q.get('room') || 'phong-ngu';
  const style = STYLES[styleId] || STYLES.zen;
  const room = ROOMS[roomId] || ROOMS['phong-ngu'];

  document.title = style.display + ' — CaraVeso';

  /* --- Breadcrumb: Trang chủ › Các phòng › <Phòng> › <Style> --- */
  const bcRoom = document.getElementById('style-breadcrumb-room');
  bcRoom.textContent = room.name;
  bcRoom.href = 'room.html?room=' + roomId;
  document.getElementById('style-breadcrumb-name').textContent =
    style.display.split(' ')[0] + ' Style';

  /* --- Hero chữ trên ảnh --- */
  const hero = document.getElementById('style-hero');
  hero.querySelector('img').src = style.heroImg;
  document.getElementById('style-hero-name').textContent = style.name;
  document.getElementById('style-hero-tagline').textContent = style.tagline;

  /* --- Đoạn giới thiệu + 3 ảnh --- */
  document.getElementById('style-intro-title').textContent = style.tagline;
  document.getElementById('style-intro-desc').textContent = style.desc;
  const gallery = document.getElementById('style-gallery');
  style.gallery.forEach(function (src) {
    const img = el('img');
    img.src = src;
    img.alt = style.display;
    img.loading = 'lazy';
    gallery.appendChild(img);
  });

  /* --- Lưới sản phẩm 5 cột + phân trang --- */
  const PER_PAGE = 10;
  const list = PRODUCTS.slice();
  const totalPages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  let page = 1;
  const grid = document.getElementById('style-grid');
  const pag = document.getElementById('style-pagination');

  function renderProducts() {
    grid.textContent = '';
    list.slice((page - 1) * PER_PAGE, page * PER_PAGE).forEach(function (p) {
      grid.appendChild(buildProductCard(p));
    });
    pag.querySelectorAll('[data-pg]').forEach(function (b) {
      b.classList.toggle('is-active', Number(b.dataset.pg) === page);
    });
  }
  function goPage(p) {
    page = Math.min(totalPages, Math.max(1, p));
    renderProducts();
  }

  // Dựng nút phân trang: ‹ 1 2 … ›
  const prevBtn = el('button', '', '');
  prevBtn.innerHTML = ICONS.arrowLeft;
  prevBtn.addEventListener('click', function () { goPage(page - 1); });
  pag.appendChild(prevBtn);
  for (let i = 1; i <= totalPages; i++) {
    const b = el('button', '', String(i));
    b.dataset.pg = i;
    b.addEventListener('click', function () { goPage(i); });
    pag.appendChild(b);
  }
  const nextBtn = el('button', '', '');
  nextBtn.innerHTML = ICONS.arrowRight;
  nextBtn.addEventListener('click', function () { goPage(page + 1); });
  pag.appendChild(nextBtn);

  renderProducts();
}

function initPromoPage() {
  const grid = document.getElementById('promo-grid');
  if (grid) {
    const PAGE_SIZE = 8;
    let visibleCount = PAGE_SIZE;

    // Chỉ lấy sản phẩm đang giảm giá
    const SALE = PRODUCTS.filter(function (p) { return p.isSale; });

    const state = { categories: [], priceMin: null, priceMax: null, sort: 'default' };

    function applyFilters() {
      let list = SALE.slice();
      if (state.categories.length) {
        list = list.filter(function (p) { return state.categories.indexOf(p.category) !== -1; });
      }
      if (state.priceMin !== null) list = list.filter(function (p) { return p.price >= state.priceMin; });
      if (state.priceMax !== null) list = list.filter(function (p) { return p.price <= state.priceMax; });

      if (state.sort === 'price-asc') list.sort(function (a, b) { return a.price - b.price; });
      if (state.sort === 'price-desc') list.sort(function (a, b) { return b.price - a.price; });
      if (state.sort === 'name') list.sort(function (a, b) { return a.name.localeCompare(b.name, 'vi'); });
      return list;
    }

    function render() {
      const list = applyFilters();
      grid.textContent = '';
      const countEl = document.getElementById('result-count');
      if (countEl) countEl.textContent = '(' + list.length + ' sản phẩm)';
      if (!list.length) {
        grid.appendChild(el('p', 'grid-empty', 'Không tìm thấy sản phẩm phù hợp với bộ lọc.'));
      } else {
        list.slice(0, visibleCount).forEach(function (p) { grid.appendChild(buildProductCard(p)); });
      }
      const loadBtn = document.getElementById('btn-load-more');
      if (loadBtn) loadBtn.style.display = visibleCount >= list.length ? 'none' : '';
    }

    /* --- Sự kiện bộ lọc --- */

    // Thu gọn / mở rộng nhóm lọc
    document.querySelectorAll('.filter-group__head').forEach(function (head) {
      head.addEventListener('click', function () {
        head.closest('.filter-group').classList.toggle('is-collapsed');
      });
    });

    // Checkbox phân loại
    document.querySelectorAll('input[name="category"]').forEach(function (cb) {
      cb.addEventListener('change', function () {
        state.categories = Array.prototype.slice
          .call(document.querySelectorAll('input[name="category"]:checked'))
          .map(function (c) { return c.value; });
        visibleCount = PAGE_SIZE;
        render();
      });
    });

    // Khoảng giá — slider 2 node đồng bộ với 2 ô nhập
    const priceMinInput = document.getElementById('price-min');
    const priceMaxInput = document.getElementById('price-max');
    const rangeMin = document.getElementById('price-range-min');
    const rangeMax = document.getElementById('price-range-max');
    const priceFill = document.getElementById('price-fill');

    if (rangeMin && rangeMax) {
      const P_MIN = Number(rangeMin.min);
      const P_MAX = Number(rangeMin.max);
      const P_GAP = Number(rangeMin.step) || 500000;

      function parsePrice(s) {
        const d = String(s).replace(/[^\d]/g, '');
        return d ? Number(d) : null;
      }
      function updateFill() {
        const span = P_MAX - P_MIN || 1;
        const lo = Number(rangeMin.value);
        const hi = Number(rangeMax.value);
        priceFill.style.left = ((lo - P_MIN) / span * 100) + '%';
        priceFill.style.right = ((P_MAX - hi) / span * 100) + '%';
      }
      function syncFromSliders(doRender) {
        const lo = Number(rangeMin.value);
        const hi = Number(rangeMax.value);
        priceMinInput.value = lo.toLocaleString('vi-VN');
        priceMaxInput.value = hi.toLocaleString('vi-VN');
        updateFill();
        state.priceMin = lo > P_MIN ? lo : null;
        state.priceMax = hi < P_MAX ? hi : null;
        if (doRender) { visibleCount = PAGE_SIZE; render(); }
      }

      rangeMin.addEventListener('input', function () {
        if (Number(rangeMin.value) > Number(rangeMax.value) - P_GAP) {
          rangeMin.value = Number(rangeMax.value) - P_GAP;
        }
        syncFromSliders(true);
      });
      rangeMax.addEventListener('input', function () {
        if (Number(rangeMax.value) < Number(rangeMin.value) + P_GAP) {
          rangeMax.value = Number(rangeMin.value) + P_GAP;
        }
        syncFromSliders(true);
      });
      priceMinInput.addEventListener('change', function () {
        let v = parsePrice(priceMinInput.value);
        if (v === null) v = P_MIN;
        v = Math.max(P_MIN, Math.min(v, Number(rangeMax.value) - P_GAP));
        rangeMin.value = v;
        syncFromSliders(true);
      });
      priceMaxInput.addEventListener('change', function () {
        let v = parsePrice(priceMaxInput.value);
        if (v === null) v = P_MAX;
        v = Math.min(P_MAX, Math.max(v, Number(rangeMin.value) + P_GAP));
        rangeMax.value = v;
        syncFromSliders(true);
      });

      syncFromSliders(false);
    }

    // Sắp xếp
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', function () {
        state.sort = sortSelect.value;
        render();
      });
    }

    // Xem thêm
    const loadMoreBtn = document.getElementById('btn-load-more');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', function () {
        visibleCount += PAGE_SIZE;
        render();
      });
    }

    render();
  }

  /* Đồng hồ đếm ngược đến 0h ngày hôm sau */
  const dEl = document.getElementById('cd-days');
  if (!dEl) return;
  const hEl = document.getElementById('cd-hours');
  const mEl = document.getElementById('cd-mins');
  const sEl = document.getElementById('cd-secs');

  // Mốc kết thúc: 3 ngày kể từ lúc mở trang (mô phỏng đợt sale)
  const end = Date.now() + 3 * 24 * 60 * 60 * 1000;

  function pad(n) { return String(n).padStart(2, '0'); }
  function tick() {
    let diff = Math.max(0, end - Date.now());
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor(diff % 86400000 / 3600000);
    const mins = Math.floor(diff % 3600000 / 60000);
    const secs = Math.floor(diff % 60000 / 1000);
    dEl.textContent = pad(days);
    hEl.textContent = pad(hours);
    mEl.textContent = pad(mins);
    sEl.textContent = pad(secs);
  }
  tick();
  setInterval(tick, 1000);
}

/* ============ 15. TÌM KIẾM BẰNG CHATBOX AI ============ */

/* CHAT_PRODUCTS được nạp từ data/chat-products.json (xem js/data.js) */

function initChatboxAiPage() {
  const grid = document.getElementById('chat-product-grid');
  if (!grid) return;

  let visibleCount = 20;
  let budgetFilter = true;
  const loadMoreBtn = document.getElementById('chat-load-more');
  const filtersWrap = document.getElementById('chat-active-filters');
  const thread = document.getElementById('chat-thread');
  const compose = document.getElementById('chat-compose');
  const messageInput = document.getElementById('chat-message');
  const chatState = {
    category: 'table',
    seats: '4',
    style: 'modern',
    budget: 'Dưới 20 triệu',
    tone: 'gỗ sáng',
    room: 'căn hộ nhỏ'
  };

  function escapeHtml(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function chatTime() {
    return new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  }

  function appendUserMessage(text) {
    const row = el('div', 'chat-row chat-row--user');
    row.innerHTML = '<div class="chat-bubble chat-bubble--user">' + escapeHtml(text) + '<time>' + chatTime() + '</time></div>';
    thread.appendChild(row);
  }

  function appendAiMessage(html) {
    const row = el('div', 'chat-row chat-row--ai');
    row.innerHTML =
      '<span class="chat-sparkle">✦</span>' +
      '<div class="chat-bubble chat-bubble--ai chat-bubble--wide">' +
        html +
        '<time>' + chatTime() + '</time>' +
      '</div>';
    thread.appendChild(row);
    thread.scrollTop = thread.scrollHeight;
  }

  function syncControlsFromState() {
    document.getElementById('chat-category').value = chatState.category;
    document.getElementById('chat-seats').value = chatState.seats;
    document.getElementById('chat-style').value = chatState.style;
  }

  function inferChatContext(text) {
    const lower = text.toLowerCase();
    const changed = [];

    if (lower.indexOf('sofa') >= 0 || lower.indexOf('ghế sofa') >= 0) {
      chatState.category = 'sofa';
      changed.push('danh mục Sofa');
    } else if (lower.indexOf('ghế') >= 0 && lower.indexOf('bàn') < 0) {
      chatState.category = 'chair';
      changed.push('danh mục Ghế ăn');
    } else if (lower.indexOf('bàn') >= 0 || lower.indexOf('ăn') >= 0) {
      chatState.category = 'table';
      changed.push('danh mục Bàn ăn');
    }

    if (lower.indexOf('8 ghế') >= 0 || lower.indexOf('8 người') >= 0 || lower.indexOf('8 cho') >= 0) {
      chatState.seats = '8';
      changed.push('8 ghế');
    } else if (lower.indexOf('6 ghế') >= 0 || lower.indexOf('6 người') >= 0 || lower.indexOf('6 cho') >= 0) {
      chatState.seats = '6';
      changed.push('6 ghế');
    } else if (lower.indexOf('4 ghế') >= 0 || lower.indexOf('4 người') >= 0 || lower.indexOf('4 cho') >= 0) {
      chatState.seats = '4';
      changed.push('4 ghế');
    }

    if (lower.indexOf('bắc âu') >= 0 || lower.indexOf('nordic') >= 0 || lower.indexOf('scandinavian') >= 0) {
      chatState.style = 'nordic';
      changed.push('phong cách Bắc Âu');
    } else if (lower.indexOf('tối giản') >= 0 || lower.indexOf('minimal') >= 0 || lower.indexOf('minimalist') >= 0) {
      chatState.style = 'minimal';
      changed.push('phong cách Tối giản');
    } else if (lower.indexOf('hiện đại') >= 0 || lower.indexOf('modern') >= 0) {
      chatState.style = 'modern';
      changed.push('phong cách Hiện đại');
    }

    if (lower.indexOf('gỗ sáng') >= 0 || lower.indexOf('sồi') >= 0 || lower.indexOf('oak') >= 0) chatState.tone = 'gỗ sáng';
    if (lower.indexOf('óc chó') >= 0 || lower.indexOf('walnut') >= 0 || lower.indexOf('nâu') >= 0) chatState.tone = 'gỗ nâu ấm';
    if (lower.indexOf('trắng') >= 0 || lower.indexOf('kem') >= 0) chatState.tone = 'trắng kem';
    if (lower.indexOf('căn hộ') >= 0 || lower.indexOf('nhỏ') >= 0 || lower.indexOf('chung cư') >= 0) chatState.room = 'căn hộ nhỏ';
    if (lower.indexOf('rộng') >= 0 || lower.indexOf('phòng lớn') >= 0) chatState.room = 'không gian rộng';

    const budgetMatch = lower.match(/(\d+)\s*(tr|triệu|trieu)/);
    if (budgetMatch) {
      chatState.budget = 'Dưới ' + budgetMatch[1] + ' triệu';
      budgetFilter = Number(budgetMatch[1]) <= 20;
      changed.push(chatState.budget.toLowerCase());
    } else if (lower.indexOf('rẻ') >= 0 || lower.indexOf('tiết kiệm') >= 0 || lower.indexOf('dưới 20') >= 0) {
      chatState.budget = 'Dưới 20 triệu';
      budgetFilter = true;
      changed.push('ngân sách tiết kiệm');
    }

    syncControlsFromState();
    return changed;
  }

  function buildRecommendationSummary(prefix) {
    return prefix +
      '<div class="chat-summary">' +
        '<strong>Mình đang lọc theo:</strong>' +
        '<p><span>▣</span><b>Danh mục:</b> ' + document.getElementById('chat-category').selectedOptions[0].textContent + '</p>' +
        '<p><span>▣</span><b>Số ghế:</b> ' + chatState.seats + ' ghế</p>' +
        '<p><span>◆</span><b>Phong cách:</b> ' + document.getElementById('chat-style').selectedOptions[0].textContent + '</p>' +
        '<p><span>◆</span><b>Màu sắc:</b> ' + chatState.tone + '</p>' +
        '<p><span>▣</span><b>Không gian:</b> ' + chatState.room + '</p>' +
        '<button type="button">Đã cập nhật</button>' +
      '</div>';
  }

  function createAiReply(text, changed) {
    const lower = text.toLowerCase();
    if (/^(hi|hello|chào|xin chào|alo)\b/.test(lower)) {
      return 'Chào bạn, mình đây. Bạn cứ nói kiểu tự nhiên như “mình cần bàn ăn 4 ghế dưới 10 triệu cho căn hộ nhỏ”, mình sẽ lọc và gợi ý ngay.';
    }
    if (lower.indexOf('cảm ơn') >= 0 || lower.indexOf('thanks') >= 0) {
      return 'Không có gì nha. Mình vẫn giữ các gợi ý hiện tại ở bên phải, bạn muốn đổi ngân sách, màu hay số ghế thì nói mình chỉnh tiếp.';
    }
    if (lower.indexOf('bảo hành') >= 0) {
      return 'Với nhóm bàn ăn, CaraVeso thường hỗ trợ bảo hành kết cấu gỗ 24 tháng và đổi trả trong 30 ngày nếu lỗi do nhà sản xuất. Mình có thể ưu tiên mẫu dễ bảo trì nếu bạn muốn.';
    }
    if (lower.indexOf('giao') >= 0 || lower.indexOf('ship') >= 0) {
      return 'Thời gian giao thường khoảng 1-3 ngày nội thành và lâu hơn tùy khu vực. Với bàn ăn 4 ghế, mình khuyên chọn mẫu tháo lắp gọn để vận chuyển lên chung cư dễ hơn.';
    }
    if (lower.indexOf('mua') >= 0 || lower.indexOf('chọn') >= 0 || lower.indexOf('nên lấy') >= 0) {
      return 'Nếu ưu tiên gọn, sáng và dễ phối nội thất, mình nghiêng về Bộ bàn ăn Minimal Oak. Giá mềm, kiểu dáng an toàn, hợp căn hộ nhỏ. Bạn có thể bấm vào sản phẩm đầu tiên để xem chi tiết.';
    }
    if (changed.length) {
      return buildRecommendationSummary('Mình hiểu rồi. Mình đã cập nhật ' + changed.join(', ') + ' và sắp xếp lại gợi ý cho hợp nhu cầu hơn nhé.');
    }
    return 'Mình nghe được rồi. Bạn có thể nói rõ hơn một chút về loại sản phẩm, ngân sách, màu sắc hoặc kích thước phòng không? Ví dụ: “bàn ăn 6 ghế gỗ sáng dưới 15 triệu”.';
  }

  function productCard(product) {
    const image = product.img || 'img/products/ban.webp';
    const article = el('article', 'chat-product-card');
    article.innerHTML =
      '<a class="chat-product-card__img" href="chatbox-product-detail.html">' +
        '<img src="' + image + '" alt="' + product.name + '" loading="lazy">' +
      '</a>' +
      '<h3><a href="chatbox-product-detail.html">' + product.name + '</a></h3>' +
      '<p>' + product.desc + '</p>' +
      '<strong>' + fmtVND(product.price) + '</strong>' +
      '<div class="chat-product-card__actions">' +
        '<button class="btn-add-cart" type="button" data-chat-cart="' + product.id + '">THÊM VÀO GIỎ</button>' +
        '<button class="btn-fav" type="button" aria-label="Yêu thích">' + ICONS.heart + '</button>' +
      '</div>';
    return article;
  }

  function filteredProducts() {
    return CHAT_PRODUCTS.filter(function (product) {
      return !budgetFilter || product.price < 20000000;
    });
  }

  function renderFilters() {
    filtersWrap.innerHTML = budgetFilter
      ? '<button type="button" data-remove-filter="budget">Dưới 20 triệu <span>×</span></button>'
      : '';
    const removeBtn = filtersWrap.querySelector('[data-remove-filter]');
    if (removeBtn) {
      removeBtn.addEventListener('click', function () {
        budgetFilter = false;
        render();
      });
    }
  }

  function render() {
    const items = filteredProducts();
    grid.textContent = '';
    items.slice(0, visibleCount).forEach(function (product) {
      grid.appendChild(productCard(product));
    });
    loadMoreBtn.hidden = visibleCount >= items.length;
    renderFilters();

    grid.querySelectorAll('[data-chat-cart]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        cartAdd(8, 1);
        openCartPopup();
      });
    });
    grid.querySelectorAll('.btn-fav').forEach(function (btn) {
      btn.addEventListener('click', function () {
        btn.classList.toggle('is-active');
        showToast(btn.classList.contains('is-active') ? 'Đã thêm vào danh sách yêu thích' : 'Đã bỏ khỏi danh sách yêu thích');
      });
    });
  }

  loadMoreBtn.addEventListener('click', function () {
    visibleCount += 5;
    render();
  });

  document.getElementById('chat-filter-more').addEventListener('click', function () {
    budgetFilter = !budgetFilter;
    visibleCount = Math.max(visibleCount, 20);
    render();
  });

  ['chat-category', 'chat-seats', 'chat-style'].forEach(function (id) {
    document.getElementById(id).addEventListener('change', function () {
      showToast('ChatBox AI đã cập nhật bộ lọc gợi ý');
    });
  });

  compose.addEventListener('submit', function (e) {
    e.preventDefault();
    const text = messageInput.value.trim();
    if (!text) return;
    appendUserMessage(text);
    messageInput.value = '';

    const changed = inferChatContext(text);
    visibleCount = 20;
    render();
    window.setTimeout(function () {
      appendAiMessage(createAiReply(text, changed));
    }, 260);
  });

  messageInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      compose.requestSubmit();
    }
  });

  /* Đính kèm ảnh/tệp: mở hộp chọn tệp, gửi ảnh vào khung chat rồi AI phản hồi */
  const fileInput = document.getElementById('chat-file');
  const attachBtn = document.getElementById('chat-attach');
  if (attachBtn && fileInput) {
    attachBtn.addEventListener('click', function () { fileInput.click(); });
    fileInput.addEventListener('change', function () {
      const file = fileInput.files && fileInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function (ev) {
        // Bong bóng người dùng kèm ảnh đính kèm
        const row = el('div', 'chat-row chat-row--user');
        row.innerHTML =
          '<div class="chat-bubble chat-bubble--user">' +
            '<img class="chat-attach-img" src="' + ev.target.result + '" alt="Ảnh đính kèm">' +
            '<time>' + chatTime() + '</time>' +
          '</div>';
        thread.appendChild(row);
        thread.scrollTop = thread.scrollHeight;
        window.setTimeout(function () {
          appendAiMessage('Mình đã nhận được ảnh của bạn. Dưới đây là những sản phẩm có kiểu dáng tương tự nhé.');
        }, 260);
      };
      reader.readAsDataURL(file);
      fileInput.value = '';   // cho phép chọn lại cùng một tệp
    });
  }

  document.getElementById('chat-refresh').addEventListener('click', function () {
    chatState.category = 'table';
    chatState.seats = '4';
    chatState.style = 'modern';
    chatState.budget = 'Dưới 20 triệu';
    chatState.tone = 'gỗ sáng';
    chatState.room = 'căn hộ nhỏ';
    syncControlsFromState();
    budgetFilter = true;
    visibleCount = 20;
    render();
    showToast('Đã làm mới gợi ý từ ChatBox AI');
  });

  render();
}

function initChatboxProductDetailPage() {
  const mainImg = document.getElementById('chat-pd-main-img');
  if (!mainImg) return;

  document.querySelectorAll('#chat-pd-thumbs button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('#chat-pd-thumbs button').forEach(function (item) { item.classList.remove('is-active'); });
      btn.classList.add('is-active');
      mainImg.src = btn.dataset.img;
    });
  });

  const qtyInput = document.getElementById('chat-pd-qty');
  document.getElementById('chat-pd-minus').addEventListener('click', function () {
    qtyInput.value = Math.max(1, Number(qtyInput.value) - 1);
  });
  document.getElementById('chat-pd-plus').addEventListener('click', function () {
    qtyInput.value = Number(qtyInput.value) + 1;
  });

  document.querySelectorAll('.chat-pd-tabs .tabs__btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.chat-pd-tabs .tabs__btn').forEach(function (item) { item.classList.remove('is-active'); });
      document.querySelectorAll('.chat-pd-tabs .tabs__panel').forEach(function (panel) { panel.classList.remove('is-active'); });
      btn.classList.add('is-active');
      document.getElementById(btn.dataset.tab).classList.add('is-active');
    });
  });

  document.getElementById('chat-pd-add').addEventListener('click', function () {
    cartAdd(8, Number(qtyInput.value) || 1);
    openCartPopup();
  });
  document.getElementById('chat-pd-buy').addEventListener('click', function () {
    cartAdd(8, Number(qtyInput.value) || 1);
    window.location.href = 'cart.html';
  });

  const related = document.getElementById('chat-pd-related');
  CHAT_PRODUCTS.slice(1, 6).forEach(function (product) {
    const card = el('article', 'chat-product-card');
    card.innerHTML =
      '<a class="chat-product-card__img" href="chatbox-product-detail.html"><img src="' + product.img + '" alt="' + product.name + '" loading="lazy"></a>' +
      '<h3><a href="chatbox-product-detail.html">' + product.name + '</a></h3>' +
      '<p>' + product.desc + '</p>' +
      '<strong>' + fmtVND(product.price) + '</strong>' +
      '<div class="chat-product-card__actions"><button class="btn-add-cart" type="button">THÊM VÀO GIỎ</button><button class="btn-fav" type="button" aria-label="Yêu thích">' + ICONS.heart + '</button></div>';
    card.querySelector('.btn-add-cart').addEventListener('click', function () {
      cartAdd(8, 1);
      openCartPopup();
    });
    related.appendChild(card);
  });
}

/* ============ 16. QUẢN LÝ TÀI KHOẢN ============ */

/* ACCOUNT_USER và ACCOUNT_ORDERS được nạp từ data/account.json (xem js/data.js) */

const ACCOUNT_STEP_ICONS = {
  clock: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2"/></svg>',
  doc: '<svg viewBox="0 0 24 24"><path d="M7 3h7l4 4v14H7z"/><path d="M14 3v5h5"/><path d="M10 15l2 2 4-5"/></svg>',
  truck: '<svg viewBox="0 0 24 24"><path d="M3 7h11v9H3z"/><path d="M14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>',
  cancel: '<svg viewBox="0 0 24 24"><path d="M7 3h7l4 4v14H7z"/><path d="M14 3v5h5"/><path d="M10 14l5 5M15 14l-5 5"/></svg>'
};

function accountStepMarkup(steps, activeCount) {
  return '<div class="account-steps">' + steps.map(function (step, index) {
    const active = index < activeCount;
    return '<div class="account-step' + (active ? ' is-active' : '') + '">' +
      '<span class="account-step__dot">' + ACCOUNT_STEP_ICONS[step.icon] + '</span>' +
      '<span class="account-step__label">' + step.label + '</span>' +
    '</div>';
  }).join('') + '</div>';
}

function initAccountPage() {
  const page = document.body.dataset.page;

  if (page === 'account') {
    document.getElementById('acc-name').textContent = ACCOUNT_USER.name;
    document.getElementById('acc-birthday').textContent = ACCOUNT_USER.birthday;
    document.getElementById('acc-gender').textContent = ACCOUNT_USER.gender;
    document.getElementById('acc-email').textContent = ACCOUNT_USER.email;
    document.getElementById('acc-phone').textContent = ACCOUNT_USER.phone;
    return;
  }

  if (page === 'account-edit') {
    const form = document.getElementById('account-edit-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const ok = validateForm([
        { id: 'ae-name', check: function (v) { return v.length >= 2; }, msg: 'Họ tên tối thiểu 2 ký tự.' },
        { id: 'ae-phone', check: function (v) { return /^(0|\+84)\d{9,10}$/.test(v.replace(/\s/g, '')); }, msg: 'Số điện thoại không hợp lệ.' }
      ]);
      if (ok) showToast('Đã lưu thông tin tài khoản');
    });
    return;
  }

  if (page === 'account-password') {
    const form = document.getElementById('account-password-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const ok = validateForm([
        { id: 'ap-current', check: function (v) { return v.length >= 6; }, msg: 'Mật khẩu tối thiểu 6 ký tự.' },
        { id: 'ap-new', check: function (v) { return v.length >= 6; }, msg: 'Mật khẩu mới tối thiểu 6 ký tự.' },
        { id: 'ap-confirm', check: function (v) { return v === document.getElementById('ap-new').value.trim(); }, msg: 'Mật khẩu xác nhận không khớp.' }
      ]);
      if (ok) showToast('Đã cập nhật mật khẩu');
    });
    return;
  }

  if (page === 'account-orders') {
    const body = document.getElementById('account-orders-body');
    ACCOUNT_ORDERS.forEach(function (order) {
      const row = el('tr');
      row.innerHTML = '<td>' + order.id + '</td><td>' + order.date + '</td><td>' + fmtVND(order.total) +
        '</td><td>' + order.status + '</td><td><a href="account-order-detail.html?order=' + order.id + '">Chi tiết</a></td>';
      body.appendChild(row);
    });
    return;
  }

  if (page === 'account-order-detail') {
    document.getElementById('order-steps').innerHTML = accountStepMarkup([
      { label: 'Chờ xác nhận', icon: 'clock' },
      { label: 'Đã xác nhận', icon: 'doc' },
      { label: 'Đang giao hàng', icon: 'truck' },
      { label: 'Đã giao hàng', icon: 'truck' },
      { label: 'Đã hủy', icon: 'cancel' }
    ], 2);
    document.querySelectorAll('[data-buy-again]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        cartAdd(2, 1);
        openCartPopup();
      });
    });
    return;
  }

  if (page === 'account-service-detail') {
    document.getElementById('service-steps').innerHTML = accountStepMarkup([
      { label: 'Chờ xác nhận', icon: 'clock' },
      { label: 'Đã xác nhận', icon: 'doc' },
      { label: 'Chờ phản hồi', icon: 'truck' },
      { label: 'Đang xử lý', icon: 'truck' },
      { label: 'Xử lý thành công', icon: 'doc' }
    ], 2);
    return;
  }

  if (page === 'account-favorites') {
    document.querySelectorAll('[data-favorite-cart]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        cartAdd(Number(btn.dataset.favoriteCart), 1);
        openCartPopup();
      });
    });
    return;
  }

  if (page === 'account-review') {
    const stars = Array.prototype.slice.call(document.querySelectorAll('.review-star'));
    const ratingInput = document.getElementById('review-rating');
    const text = document.getElementById('review-text');
    const counter = document.getElementById('review-count');
    function paint(n) {
      stars.forEach(function (star, index) { star.classList.toggle('is-active', index < n); });
      ratingInput.value = n;
    }
    stars.forEach(function (star, index) {
      star.addEventListener('click', function () { paint(index + 1); });
    });
    text.addEventListener('input', function () { counter.textContent = text.value.length + '/1000'; });
    document.getElementById('review-form').addEventListener('submit', function (e) {
      e.preventDefault();
      if (!Number(ratingInput.value)) { showToast('Vui lòng chọn số sao đánh giá'); return; }
      if (text.value.trim().length < 10) { showToast('Vui lòng chia sẻ cảm nhận tối thiểu 10 ký tự'); return; }
      showToast('Đã gửi đánh giá của bạn');
    });
  }
}

/* ============ 14. KHỞI CHẠY ============ */

document.addEventListener('DOMContentLoaded', function () {
  // Các phần không phụ thuộc dữ liệu — chạy ngay
  initPasswordToggles();

  // Xóa trạng thái lỗi khi người dùng gõ lại
  document.addEventListener('input', function (e) {
    if (e.target.classList && e.target.classList.contains('is-invalid')) {
      e.target.classList.remove('is-invalid');
      const err = e.target.parentElement.querySelector('.form-error');
      if (err) err.textContent = '';
    }
  });

  // Chờ dữ liệu JSON tải xong rồi mới render các phần phụ thuộc dữ liệu
  APP_DATA_READY.then(function () {
    initCartState();
    renderHeader();
    renderFooter();
    renderSupportChat();

    const page = document.body.dataset.page;
    if (page === 'home') initHomePage();
    if (page === 'category-index') initCategoryIndexPage();
    if (page === 'products') initProductsPage();
    if (page === 'product-detail') initProductDetailPage();
    if (page === 'cart') initCartPage();
    if (page === 'checkout') initCheckoutPage();
    if (page === 'payment-method') initPaymentMethodPage();
    if (page === 'payment-gateway') initGatewayPage();
    if (page === 'order-success') initOrderSuccessPage();
    if (page === 'login') initLoginPage();
    if (page === 'register') initRegisterPage();
    if (page === 'promo') initPromoPage();
    if (page === 'room') initRoomPage();
    if (page === 'style') initStylePage();
    if (page === 'chatbox-ai') initChatboxAiPage();
    if (page === 'chatbox-product-detail') initChatboxProductDetailPage();
    if (page && page.indexOf('account') === 0) initAccountPage();
  }).catch(function (err) {
    console.error('CaraVeso — Không tải được dữ liệu JSON:', err);
    alert('Không tải được dữ liệu website.\n\nHãy chạy trang qua server (VD: VS Code Live Server / http://localhost) thay vì mở trực tiếp file .html.');
  });
});
