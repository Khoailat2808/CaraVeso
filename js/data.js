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
    loadJSON('data/products.json'),
    loadJSON('data/collections.json'),
    loadJSON('data/hero-slides.json'),
    loadJSON('data/inspirations.json'),
    loadJSON('data/reviews.json'),
    loadJSON('data/initial-cart.json'),
    loadJSON('data/vouchers.json'),
    loadJSON('data/nav-items.json'),
    loadJSON('data/locations.json'),
    loadJSON('data/footer-links.json'),
    loadJSON('data/account.json'),
    loadJSON('data/chat-products.json'),
    loadJSON('data/rooms.json'),
    loadJSON('data/styles.json'),
    loadJSON('data/catalog.json'),
    loadJSON('data/search-suggestions.json'),
    loadJSON('data/product-types.json')
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
