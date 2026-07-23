/* ============================================================
   CARAVESO — DATA LOADER (data.js)
   Toàn bộ dữ liệu website được tách ra các file JSON trong thư mục /data.
   File này nạp (fetch) các JSON đó vào biến toàn cục và cung cấp
   một Promise `APP_DATA_READY` để main.js chờ dữ liệu sẵn sàng
   trước khi render.

   LƯU Ý: Vì dùng fetch() nên website phải chạy qua server
   (VD: VS Code Live Server / http://localhost), KHÔNG mở trực tiếp
   file .html bằng đường dẫn file:/// (trình duyệt sẽ chặn fetch).
   ============================================================ */

/* ---------- Biến toàn cục (sẽ được gán sau khi tải JSON) ---------- */
let PRODUCTS = [];
let COLLECTIONS = [];
let HERO_SLIDES = [];
let INSPIRATIONS = [];
let REVIEWS = [];
let INITIAL_CART = [];
let VOUCHERS = {};
let NAV_ITEMS = [];
let LOCATIONS = [];
let FOOTER_LINKS = {};
let ACCOUNT_USER = {};
let ACCOUNT_ORDERS = [];
let CHAT_PRODUCTS = [];
let ROOMS = {};
let STYLES = {};
let CATALOG = {};
let SEARCH_SUGGESTIONS = { recent: [], popular: [] };
let PRODUCT_TYPES = {};

/* ---------- Nạp dữ liệu JSON ---------- */
const APP_DATA_READY = (async function loadAppData() {
  async function loadJSON(path) {
    // no-cache: luôn xác thực lại với server (tránh dùng bản JSON cũ trong cache
    // khi dữ liệu thay đổi — nhất là với server tĩnh không gửi Cache-Control)
    const res = await fetch(path, { cache: 'no-cache' });
    if (!res.ok) {
      throw new Error('Không tải được ' + path + ' (HTTP ' + res.status + ')');
    }
    return res.json();
  }

  const [
    products, collections, heroSlides, inspirations, reviews,
    initialCart, vouchers, navItems, locations, footerLinks,
    account, chatProducts, rooms, styles, catalog, searchSuggestions, productTypes
  ] = await Promise.all([
    loadJSON('../../data/customer/products.json'),
    loadJSON('../../data/customer/collections.json'),
    loadJSON('../../data/customer/hero-slides.json'),
    loadJSON('../../data/customer/inspirations.json'),
    loadJSON('../../data/customer/reviews.json'),
    loadJSON('../../data/customer/initial-cart.json'),
    loadJSON('../../data/customer/vouchers.json'),
    loadJSON('../../data/customer/nav-items.json'),
    loadJSON('../../data/customer/locations.json'),
    loadJSON('../../data/customer/footer-links.json'),
    loadJSON('../../data/customer/account.json'),
    loadJSON('../../data/customer/chat-products.json'),
    loadJSON('../../data/customer/rooms.json'),
    loadJSON('../../data/customer/styles.json'),
    loadJSON('../../data/customer/catalog.json'),
    loadJSON('../../data/customer/search-suggestions.json'),
    loadJSON('../../data/customer/product-types.json')
  ]);

  PRODUCTS = products;
  COLLECTIONS = collections;
  HERO_SLIDES = heroSlides;
  INSPIRATIONS = inspirations;
  REVIEWS = reviews;
  INITIAL_CART = initialCart;
  VOUCHERS = vouchers;
  NAV_ITEMS = navItems;
  LOCATIONS = locations;
  FOOTER_LINKS = footerLinks;
  ACCOUNT_USER = account.user;
  ACCOUNT_ORDERS = account.orders;
  CHAT_PRODUCTS = chatProducts;
  ROOMS = rooms;
  STYLES = styles;
  CATALOG = catalog;
  SEARCH_SUGGESTIONS = searchSuggestions;
  PRODUCT_TYPES = productTypes;
})();
