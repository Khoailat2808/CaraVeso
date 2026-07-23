const STORAGE_KEY = 'caraveso_reviews_inbox_v2';
const PAGE_SIZE = 5;
const SHARED_IMAGE_DIR = '../shared/Image/';
const PLAYER_AVATARS = [
  SHARED_IMAGE_DIR + 'z8035902036779_91f5c3755db42487914a1f8d431c1122.jpg',
  SHARED_IMAGE_DIR + 'z8035902214819_031ff1a69d59b3b3287ba9a5e278fef0.jpg',
  SHARED_IMAGE_DIR + 'z8035902384682_68d785f2e177f72491431b8f891ecf80.jpg',
  SHARED_IMAGE_DIR + 'z8035902546352_17d1c6a379de5f5a97e86ed7da01083d.jpg',
  SHARED_IMAGE_DIR + 'z8035902881534_7461087ca3f33524f700b10a1c49ee3e.jpg'
];
const PRODUCT_IMAGES = {
  sofa: SHARED_IMAGE_DIR + 'z8039641745385_f09f1ee6d8ff5cc12fa4c672ba110290.jpg',
  mattress: SHARED_IMAGE_DIR + 'z8039641899943_093a226b6dfa5fc814e2a1a8d2d7f846.jpg',
  table: SHARED_IMAGE_DIR + 'z8035903506391_a5c7fd790ad0cbf0bff848a0aec26bb8.jpg'
};

const state = {
  reviews: [],
  filteredReviews: [],
  currentPage: 1,
  filters: { product: 'Tất cả', stars: 'Tất cả', time: 'Tất cả' },
  expandedReplyId: null,
  currentView: 'dashboard',
  selectedConversationId: 'conv-hoang',
  starredConversations: new Set(['conv-thanh','conv-dat','conv-hoang'])
};

const els = {};

document.addEventListener('DOMContentLoaded', init);

async function init(){
  cacheDom();
  await loadReviews();
  buildSelectOptions();
  bindEvents();
  applyFilters();
  renderInbox();
}

function cacheDom(){
  els.dashboardView = document.getElementById('dashboardView');
  els.inboxView = document.getElementById('inboxView');
  els.reviewTableBody = document.getElementById('reviewTableBody');
  els.pageInfo = document.getElementById('pageInfo');
  els.metricTotal = document.getElementById('metricTotal');
  els.metricFiveStar = document.getElementById('metricFiveStar');
  els.metricNegative = document.getElementById('metricNegative');
  els.metricPending = document.getElementById('metricPending');
  els.prevPage = document.getElementById('prevPage');
  els.nextPage = document.getElementById('nextPage');
  els.toast = document.getElementById('toast');
  els.conversationList = document.getElementById('conversationList');
  els.conversationSearch = document.getElementById('conversationSearch');
  els.conversationInfo = document.getElementById('conversationInfo');
  els.chatAvatar = document.getElementById('chatAvatar');
  els.chatName = document.getElementById('chatName');
  els.chatBody = document.getElementById('chatBody');
  els.chatInput = document.getElementById('chatInput');
  els.chatComposer = document.getElementById('chatComposer');
  els.starConversation = document.getElementById('starConversation');
  els.backToDashboard = document.getElementById('backToDashboard');
  els.logoutButton = document.getElementById('logoutButton');
}

async function loadReviews(){
  const stored = localStorage.getItem(STORAGE_KEY);
  if(stored){
    state.reviews = JSON.parse(stored);
    normalizeReviewAssets();
    saveReviews();
    return;
  }
  try{
    const response = await fetch('../../data/admin/reviews.json', { cache:'no-store' });
    if(!response.ok) throw new Error('Không đọc được dữ liệu đánh giá');
    state.reviews = await response.json();
  }catch(error){
    state.reviews = buildFallbackReviews();
  }
  normalizeReviewAssets();
  saveReviews();
}

function saveReviews(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.reviews));
}

function productImageFor(name){
  const text = String(name || '').toLowerCase();
  if(text.includes('nệm') || text.includes('nem')) return PRODUCT_IMAGES.mattress;
  if(text.includes('ghế') || text.includes('ghe') || text.includes('sofa')) return PRODUCT_IMAGES.sofa;
  return PRODUCT_IMAGES.table;
}

function normalizeReviewAssets(){
  state.reviews.forEach((review, index)=>{
    if(!review.khach_hang) review.khach_hang = {};
    if(!review.san_pham) review.san_pham = {};
    review.khach_hang.avatar = PLAYER_AVATARS[index % PLAYER_AVATARS.length];
    review.san_pham.thumbnail = productImageFor(review.san_pham.ten_san_pham || review.san_pham.loai);
    review.hinh_anh_minh_chung = [review.san_pham.thumbnail];
  });
}

function bindEvents(){
  document.querySelectorAll('.page-tab').forEach(button=>{
    button.addEventListener('click',()=> switchView(button.dataset.view));
  });
  els.backToDashboard.addEventListener('click',()=> switchView('dashboard'));
  els.prevPage.addEventListener('click',()=> changePage(-1));
  els.nextPage.addEventListener('click',()=> changePage(1));
  els.conversationSearch.addEventListener('input', renderInbox);
  els.chatComposer.addEventListener('submit', sendChatMessage);
  els.starConversation.addEventListener('click', toggleStarConversation);
  if(els.logoutButton){
    els.logoutButton.addEventListener('click',()=> showToast('Đã bấm đăng xuất. Bạn có thể liên kết nút này sang trang đăng nhập.'));
  }

  document.addEventListener('click', event=>{
    if(!event.target.closest('.custom-select')) closeAllSelects();
  });
}

function buildSelectOptions(){
  const productOptions = ['Tất cả','Bàn ăn','Ghế Sofa','Nệm','Tủ quần áo','Giường'];
  const starOptions = ['Tất cả','5','4','3','2','1'];
  const timeOptions = ['Tất cả','Hôm nay','Hôm qua','28 Jun','30 Jun','01 Jul'];
  buildCustomSelect('product', productOptions, value=> escapeHtml(value));
  buildCustomSelect('stars', starOptions, value=> value === 'Tất cả' ? 'Tất cả' : renderStarsText(Number(value)));
  buildCustomSelect('time', timeOptions, value=> escapeHtml(value));
}

function buildCustomSelect(filterName, options, labelRenderer){
  const root = document.querySelector(`.custom-select[data-filter="${filterName}"]`);
  const toggle = root.querySelector('.select-toggle');
  const label = toggle.querySelector('span:first-child');
  const menu = root.querySelector('.select-menu');

  menu.innerHTML = options.map(option=>{
    const starClass = filterName === 'stars' && option !== 'Tất cả' ? ' option-stars' : '';
    return `<button class="select-option${starClass}" type="button" data-value="${escapeHtml(option)}">${labelRenderer(option)}</button>`;
  }).join('');

  toggle.addEventListener('click', event=>{
    event.stopPropagation();
    const isOpen = root.classList.contains('open');
    closeAllSelects();
    root.classList.toggle('open', !isOpen);
    toggle.classList.toggle('open', !isOpen);
  });

  menu.querySelectorAll('.select-option').forEach(optionButton=>{
    optionButton.addEventListener('click',()=>{
      const value = optionButton.dataset.value;
      state.filters[filterName] = value;
      label.textContent = value === 'Tất cả' ? 'Tất cả' : (filterName === 'stars' ? `${value} sao` : value);
      menu.querySelectorAll('.select-option').forEach(btn=> btn.classList.toggle('selected', btn === optionButton));
      state.currentPage = 1;
      closeAllSelects();
      applyFilters();
    });
  });
}

function closeAllSelects(){
  document.querySelectorAll('.custom-select').forEach(select=> select.classList.remove('open'));
  document.querySelectorAll('.select-toggle').forEach(toggle=> toggle.classList.remove('open'));
}

function applyFilters(){
  state.filteredReviews = state.reviews.filter(review=>{
    const category = review.san_pham.loai || review.san_pham.ten_san_pham;
    const byProduct = state.filters.product === 'Tất cả' || category.includes(state.filters.product) || review.san_pham.ten_san_pham.includes(state.filters.product);
    const byStars = state.filters.stars === 'Tất cả' || review.so_sao === Number(state.filters.stars);
    const byTime = state.filters.time === 'Tất cả' || review.thoi_gian.includes(state.filters.time);
    return byProduct && byStars && byTime;
  });
  updateCounters();
  renderTable();
}

function updateCounters(){
  const data = state.filteredReviews;
  els.metricTotal.textContent = data.length.toLocaleString('vi-VN');
  els.metricFiveStar.textContent = data.filter(item=>item.so_sao===5).length.toLocaleString('vi-VN');
  els.metricNegative.textContent = data.filter(item=>item.so_sao<=3).length.toLocaleString('vi-VN');
  els.metricPending.textContent = data.filter(item=>item.trang_thai==='Chưa phản hồi').length.toLocaleString('vi-VN');
}

function renderTable(){
  const total = state.filteredReviews.length;
  const maxPage = Math.max(1, Math.ceil(total / PAGE_SIZE));
  state.currentPage = Math.min(state.currentPage, maxPage);
  const startIndex = (state.currentPage - 1) * PAGE_SIZE;
  const pageItems = state.filteredReviews.slice(startIndex, startIndex + PAGE_SIZE);

  els.reviewTableBody.innerHTML = pageItems.length ? pageItems.map(review=> renderReviewRow(review)).join('') : `<div class="empty-state">Không tìm thấy đánh giá phù hợp.</div>`;
  const start = total === 0 ? 0 : startIndex + 1;
  const end = Math.min(startIndex + PAGE_SIZE, total);
  els.pageInfo.textContent = `Hiển thị ${start}-${end} trong tổng ${total}`;
  els.prevPage.disabled = state.currentPage === 1;
  els.nextPage.disabled = state.currentPage === maxPage;

  els.reviewTableBody.querySelectorAll('[data-action="open-reply"]').forEach(button=>{
    button.addEventListener('click', event=>{
      event.stopPropagation();
      state.expandedReplyId = button.dataset.id;
      renderTable();
    });
  });
  els.reviewTableBody.querySelectorAll('[data-action="cancel-reply"]').forEach(button=>{
    button.addEventListener('click',()=>{
      state.expandedReplyId = null;
      renderTable();
    });
  });
  els.reviewTableBody.querySelectorAll('[data-action="send-reply"]').forEach(button=>{
    button.addEventListener('click',()=> handleReply(button.dataset.id));
  });
}

function renderReviewRow(review){
  const isExpanded = state.expandedReplyId === review.id;
  const actionHtml = review.trang_thai === 'Chưa phản hồi'
    ? `<button class="reply-button" type="button" data-action="open-reply" data-id="${review.id}">Phản hồi</button>`
    : `<span class="status-pill status-replied">Đã phản hồi</span>`;
  return `
    <article class="review-row ${isExpanded ? 'focused' : ''}">
      <div class="review-row-main">
        <div class="product-cell">
          <img src="${review.san_pham.thumbnail || PRODUCT_IMAGES.sofa}" alt="${escapeHtml(review.san_pham.ten_san_pham)}">
          <div class="product-info">
            <strong>${escapeHtml(review.san_pham.ten_san_pham)}</strong>
            <small>Đơn hàng: #H000249668</small>
          </div>
        </div>
        <div>
          <div class="stars">${renderStarsText(review.so_sao)}</div>
          <div class="review-text">${escapeHtml(review.noi_dung_danh_gia)}</div>
        </div>
        <div class="time-cell">${escapeHtml(review.thoi_gian).replace(', ', ',<br>')}</div>
        <div class="customer-cell">
          <img src="${review.khach_hang.avatar}" alt="${escapeHtml(review.khach_hang.ho_ten)}">
          <strong>${escapeHtml(review.khach_hang.ho_ten)}</strong>
        </div>
        <div>${actionHtml}</div>
      </div>
      ${isExpanded ? renderReplyPanel(review) : ''}
    </article>`;
}

function renderReplyPanel(review){
  return `
    <div class="reply-panel">
      <div class="reply-box">
        <strong>Phản hồi đến ${escapeHtml(review.khach_hang.ho_ten)}</strong>
        <textarea id="reply-${safeDomId(review.id)}" placeholder="Nhập nội dung phản hồi cho khách hàng...">Cảm ơn anh/chị đã gửi đánh giá. CaraVeso đã ghi nhận phản hồi và sẽ hỗ trợ kiểm tra ngay ạ.</textarea>
        <div class="reply-actions">
          <button type="button" data-action="cancel-reply">Hủy</button>
          <button class="send-reply" type="button" data-action="send-reply" data-id="${review.id}">Gửi phản hồi</button>
        </div>
      </div>
    </div>`;
}

function handleReply(reviewId){
  const review = state.reviews.find(item=> item.id === reviewId);
  if(!review) return;
  const textarea = document.getElementById(`reply-${safeDomId(reviewId)}`);
  const content = textarea.value.trim();
  if(!content){
    showToast('Vui lòng nhập nội dung phản hồi trước khi gửi.');
    textarea.focus();
    return;
  }
  review.trang_thai = 'Đã phản hồi';
  review.phan_hoi_cua_he_thong = content;
  saveReviews();
  state.expandedReplyId = null;
  state.selectedConversationId = makeReviewConversationId(review.id);
  applyFilters();
  renderInbox();
  switchView('inbox');
  showToast('Đã gửi phản hồi và cập nhật trạng thái đánh giá.');
}

function changePage(delta){
  const maxPage = Math.max(1, Math.ceil(state.filteredReviews.length / PAGE_SIZE));
  state.currentPage = Math.min(maxPage, Math.max(1, state.currentPage + delta));
  renderTable();
}

function switchView(viewName){
  state.currentView = viewName;
  document.querySelectorAll('.view').forEach(view=> view.classList.remove('active-view'));
  document.getElementById(viewName === 'inbox' ? 'inboxView' : 'dashboardView').classList.add('active-view');
  document.querySelectorAll('.page-tab').forEach(tab=> tab.classList.toggle('active', tab.dataset.view === viewName));
  if(viewName === 'inbox') renderInbox();
}

function renderInbox(){
  const query = (els.conversationSearch?.value || '').trim().toLowerCase();
  const conversations = buildConversations()
    .filter(item=> !query || item.name.toLowerCase().includes(query) || item.snippet.toLowerCase().includes(query));

  if(!conversations.some(item=> item.id === state.selectedConversationId) && conversations.length){
    state.selectedConversationId = conversations[0].id;
  }

  const grouped = {
    'Đã đánh dấu': conversations.filter(item=> state.starredConversations.has(item.id)).slice(0,3),
    'Chưa đọc': conversations.filter(item=> item.group === 'unread' && !state.starredConversations.has(item.id)).slice(0,3),
    'Đã đọc': conversations.filter(item=> item.group === 'read' && !state.starredConversations.has(item.id)).slice(0,2)
  };

  els.conversationList.innerHTML = renderConversationGroups(grouped);
  els.conversationInfo.textContent = `Hiển thị 1-${Math.min(8, conversations.length)} trong tổng 108`;

  els.conversationList.querySelectorAll('.conversation-item').forEach(item=>{
    item.addEventListener('click',()=>{
      state.selectedConversationId = item.dataset.id;
      renderInbox();
    });
  });

  const selected = conversations.find(item=> item.id === state.selectedConversationId) || conversations[0];
  renderChat(selected);
}

function buildConversations(){
  const base = [
    { id:'conv-thanh', name:'Nguyễn Tiến Thành', avatar:'../shared/Image/z8035902214819_031ff1a69d59b3b3287ba9a5e278fef0.jpg', time:'10:30 AM', snippet:'Cái bàn ăn hôm nay em nhận bên mình...', group:'read', review:createVirtualReview('Nguyễn Tiến Thành','../shared/Image/z8035902214819_031ff1a69d59b3b3287ba9a5e278fef0.jpg','Bàn ăn Signature Walnut','Mẫu gỗ rất đẹp. Bộ bàn chắc chắn, phù hợp căn hộ 2 phòng ngủ.',5) },
    { id:'conv-dat', name:'Nguyễn Tiến Đạt', avatar:'../shared/Image/z8035902384682_68d785f2e177f72491431b8f891ecf80.jpg', time:'10:15 AM', snippet:'Bạn: Dạ shop đã tiến hành gửi thông tin...', group:'read', review:createVirtualReview('Nguyễn Tiến Đạt','../shared/Image/z8035902384682_68d785f2e177f72491431b8f891ecf80.jpg','Ghế Sofa CaraVeso','Bạn: Dạ shop đã tiến hành gửi thông tin hỗ trợ.',4) },
    { id:'conv-hoang', name:'Hoàng Huy Tiến', avatar:'../shared/Image/z8035902036779_91f5c3755db42487914a1f8d431c1122.jpg', time:'7:00 PM', snippet:'Đã gửi 3 ảnh.', group:'unread', unread:0, review:createVirtualReview('Hoàng Huy Tiến','../shared/Image/z8035902036779_91f5c3755db42487914a1f8d431c1122.jpg','Ghế Sofa Milano','Nhưng khi mình ngồi thử thì thấy nó bị lún và phát ra tiếng kêu khá khó chịu á',4,true) },
    { id:'conv-tra-my', name:'Trà My Lê', avatar:'../shared/Image/z8035902036779_91f5c3755db42487914a1f8d431c1122.jpg', time:'6:45 PM', snippet:'Dạ Nguyễn Tiến Đạt á shop.', group:'unread', unread:2, review:createVirtualReview('Trà My Lê','../shared/Image/z8035902036779_91f5c3755db42487914a1f8d431c1122.jpg','Ghế Sofa CaraVeso','Dạ Nguyễn Tiến Đạt á shop.',4) },
    { id:'conv-vinh', name:'Nguyễn Quang Vinh', avatar:'../shared/Image/z8035902036779_91f5c3755db42487914a1f8d431c1122.jpg', time:'6:40 PM', snippet:'Shop nhanh nhanh giúp tôi cái nha chứ...', group:'unread', unread:2, review:createVirtualReview('Nguyễn Quang Vinh','../shared/Image/z8035902036779_91f5c3755db42487914a1f8d431c1122.jpg','Nệm Kymdan','Shop nhanh nhanh giúp tôi cái nha chứ sản phẩm bị lỗi khá bất tiện.',3) },
    { id:'conv-duy', name:'Trần Phước Duy', avatar:'../shared/Image/z8035902036779_91f5c3755db42487914a1f8d431c1122.jpg', time:'6:35 PM', snippet:'Có 2,5cm á shop.', group:'unread', unread:3, review:createVirtualReview('Trần Phước Duy','../shared/Image/z8035902036779_91f5c3755db42487914a1f8d431c1122.jpg','Tủ quần áo','Có 2,5cm á shop.',3) },
    { id:'conv-khoa', name:'Trần Anh Khoa', avatar:'../shared/Image/z8035902546352_17d1c6a379de5f5a97e86ed7da01083d.jpg', time:'10:20 AM', snippet:'Ok shop nhé.', group:'read', review:createVirtualReview('Trần Anh Khoa','../shared/Image/z8035902546352_17d1c6a379de5f5a97e86ed7da01083d.jpg','Bàn ăn Signature Walnut','Ok shop nhé.',5) },
    { id:'conv-thao', name:'Huỳnh Thất Thảo', avatar:'../shared/Image/z8035902881534_7461087ca3f33524f700b10a1c49ee3e.jpg', time:'9:53 AM', snippet:'Ý là bị vấp á shop ơi...', group:'read', review:createVirtualReview('Huỳnh Thất Thảo','../shared/Image/z8035902881534_7461087ca3f33524f700b10a1c49ee3e.jpg','Ghế Sofa CaraVeso','Ý là bị vấp á shop ơi...',3) }
  ];

  const selectedReview = state.reviews.find(item=> makeReviewConversationId(item.id) === state.selectedConversationId);
  if(selectedReview && !base.some(item=> item.id === state.selectedConversationId)){
    base.unshift({
      id: makeReviewConversationId(selectedReview.id),
      name: selectedReview.khach_hang.ho_ten,
      avatar: selectedReview.khach_hang.avatar,
      time: getConversationTime(selectedReview.thoi_gian),
      snippet: selectedReview.hinh_anh_minh_chung.length ? `Đã gửi ${selectedReview.hinh_anh_minh_chung.length} ảnh.` : selectedReview.noi_dung_danh_gia,
      group: selectedReview.trang_thai === 'Chưa phản hồi' ? 'unread' : 'read',
      review: selectedReview
    });
    state.starredConversations.add(makeReviewConversationId(selectedReview.id));
  }
  return base;
}

function createVirtualReview(name, avatar, productName, content, stars, hasProof=false){
  return {
    id: 'virtual-' + name,
    thoi_gian: 'Hôm nay, 7:00 PM',
    khach_hang:{ ho_ten:name, avatar, email:'khachhang@example.com', so_dien_thoai:'0919120176' },
    san_pham:{ ten_san_pham:productName, phan_loai:'Ghế 2 chỗ, Trắng Kem', thumbnail:productImageFor(productName) },
    so_sao:stars,
    noi_dung_danh_gia:content,
    hinh_anh_minh_chung: hasProof ? [productImageFor(productName)] : [],
    trang_thai:'Chưa phản hồi',
    phan_hoi_cua_he_thong:'Rất tiếc cho trải nghiệm lần này. Anh Tiến vui lòng gửi thêm hình ảnh hoặc video về sản phẩm để bên em có thể hỗ trợ tốt hơn nhé!'
  };
}

function renderConversationGroups(groups){
  return Object.entries(groups).map(([title,items])=>{
    if(!items.length) return '';
    return `<div class="conversation-section-title">${title}${title !== 'Đã đọc' ? ` (${items.length})` : ''}</div>` + items.map(renderConversationItem).join('');
  }).join('');
}

function renderConversationItem(conversation){
  const unread = conversation.unread ? `<span class="unread-badge">${conversation.unread}</span>` : '';
  return `
    <button class="conversation-item ${conversation.id === state.selectedConversationId ? 'active' : ''}" type="button" data-id="${conversation.id}">
      <img src="${conversation.avatar}" alt="${escapeHtml(conversation.name)}">
      <span class="conversation-main">
        <strong class="conversation-name">${escapeHtml(conversation.name)}</strong>
        <span class="conversation-snippet">${escapeHtml(conversation.snippet)}</span>
      </span>
      <span class="conversation-meta"><span>${escapeHtml(conversation.time)}</span>${unread}</span>
    </button>`;
}

function renderChat(conversation){
  if(!conversation){
    els.chatBody.innerHTML = '<p class="empty-state">Chưa có hội thoại.</p>';
    return;
  }
  const review = conversation.review;
  els.chatAvatar.src = conversation.avatar;
  els.chatName.textContent = conversation.name;
  els.starConversation.classList.toggle('active', state.starredConversations.has(conversation.id));
  els.starConversation.textContent = state.starredConversations.has(conversation.id) ? '★' : '☆';

  const reply = review.phan_hoi_cua_he_thong || 'Rất tiếc cho trải nghiệm lần này. Anh/chị vui lòng gửi thêm hình ảnh hoặc video về sản phẩm để bên em có thể hỗ trợ tốt hơn nhé!';
  els.chatBody.innerHTML = `
    <div class="message-row customer"><img class="avatar" src="${conversation.avatar}" alt=""><div class="bubble">Alo Admin ơi, mình có nhận được hàng ${escapeHtml(review.san_pham.ten_san_pham)} bên mình rồi.</div></div>
    <div class="message-row customer"><img class="avatar" src="${conversation.avatar}" alt=""><div class="bubble">${escapeHtml(review.noi_dung_danh_gia)}</div></div>
    <div class="chat-time">6:53 PM</div>
    <div class="message-row admin"><div class="bubble">Dạ chào anh!</div></div>
    <div class="message-row admin"><div class="bubble">${escapeHtml(reply)}</div></div>
    <div class="chat-time admin-time">6:54 PM</div>
    ${renderProofMessage(conversation)}
  `;
}

function renderProofMessage(conversation){
  const review = conversation.review;
  const images = review.hinh_anh_minh_chung.length ? review.hinh_anh_minh_chung : [review.san_pham.thumbnail || PRODUCT_IMAGES.sofa];
  return `
    <div class="message-row customer">
      <img class="avatar" src="${conversation.avatar}" alt="">
      <div class="bubble">Đây shop. Xem qua ảnh nhé<div class="proof-strip">${images.slice(0,3).map(src=>`<img src="${src}" alt="Ảnh minh chứng">`).join('')}</div></div>
    </div>
    <div class="chat-time">7:00 PM</div>`;
}

function sendChatMessage(event){
  event.preventDefault();
  const content = els.chatInput.value.trim();
  if(!content) return;
  const review = state.reviews.find(item=> makeReviewConversationId(item.id) === state.selectedConversationId);
  if(review){
    review.phan_hoi_cua_he_thong = content;
    review.trang_thai = 'Đã phản hồi';
    saveReviews();
    applyFilters();
  }
  els.chatInput.value = '';
  showToast('Tin nhắn đã được gửi.');
  renderInbox();
}

function toggleStarConversation(){
  if(!state.selectedConversationId) return;
  if(state.starredConversations.has(state.selectedConversationId)) state.starredConversations.delete(state.selectedConversationId);
  else state.starredConversations.add(state.selectedConversationId);
  renderInbox();
}

function renderStarsText(count){
  let html = '';
  for(let i=1;i<=5;i++) html += i <= count ? '★' : '<span class="empty">★</span>';
  return html;
}

function getConversationTime(timeString){
  if(timeString.includes('Hôm nay')) return '7:00 PM';
  if(timeString.includes('30 Jun')) return '10:15 AM';
  if(timeString.includes('28 Jun')) return '10:30 AM';
  return '6:45 PM';
}

function showToast(message){
  els.toast.textContent = message;
  els.toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(()=> els.toast.classList.remove('show'), 2400);
}

function safeDomId(value){
  return String(value).replace(/[^a-zA-Z0-9_-]/g,'');
}
function makeReviewConversationId(reviewId){
  return 'review-' + safeDomId(reviewId);
}
function escapeHtml(value){
  return String(value ?? '').replace(/[&<>'"]/g, char=>({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#039;', '"':'&quot;' }[char]));
}

function buildFallbackReviews(){
  const products = [
    ['Bàn ăn Signature Walnut','Bàn ăn','Gỗ óc chó, 4 ghế',PRODUCT_IMAGES.table],
    ['Ghế Sofa CaraVeso','Ghế Sofa','Ghế 2 chỗ, Trắng Kem',PRODUCT_IMAGES.sofa],
    ['Ghế Sofa Milano Shape U','Ghế Sofa','Sofa chữ U, Trắng Kem',PRODUCT_IMAGES.sofa],
    ['Nệm Kymdan','Nệm','1m8 x 2m, Cao su tự nhiên',PRODUCT_IMAGES.mattress],
    ['Bộ bàn học trẻ em','Bàn ăn','Gỗ sáng, 4 ghế',PRODUCT_IMAGES.table]
  ];
  const customers = [
    ['Hoàng Huy Tiến',PLAYER_AVATARS[0]],['Nguyễn Tiến Thành',PLAYER_AVATARS[1]],['Nguyễn Tiến Đạt',PLAYER_AVATARS[2]],['Trần Anh Khoa',PLAYER_AVATARS[3]],['Huỳnh Thất Thảo',PLAYER_AVATARS[4]]
  ];
  const comments = [
    'Mẫu gỗ rất đẹp. Bộ bàn chắc chắn, phù hợp căn hộ 2 phòng ngủ.',
    'Sofa êm, màu đẹp. Nhưng thời gian giao hàng hơi chậm',
    'Thiết kế rất hiện đại, ưa nhìn. Sẽ ủng hộ CaraVeso lâu dài hơn !',
    'Mẫu mã đẹp nhưng đệm nằm lại không êm như mong đợi',
    'Màu gỗ sáng, rất ưa mắt. Có điều mặt bàn có xây xước 1 chút.'
  ];
  return Array.from({length:50},(_,i)=>{
    const p = products[i%products.length];
    const c = customers[i%customers.length];
    return {
      id:`#REV-${1024+i}`,
      thoi_gian:['28 Jun, 6:50 PM','30 Jun, 9:53 AM','Hôm nay, 11:00 AM','30 Jun, 6:51 AM','Hôm qua, 6:51 PM'][i%5],
      khach_hang:{ho_ten:c[0], avatar:c[1], email:`user${i}@example.com`, so_dien_thoai:'0919120176'},
      san_pham:{ten_san_pham:p[0], loai:p[1], phan_loai:p[2], thumbnail:p[3]},
      so_sao:[5,4,5,3,4][i%5],
      noi_dung_danh_gia:comments[i%5],
      hinh_anh_minh_chung:i%2===0?[p[3]]:[],
      trang_thai:i%3===0?'Đã phản hồi':'Chưa phản hồi',
      phan_hoi_cua_he_thong:i%3===0?'Cảm ơn anh/chị đã phản hồi. CaraVeso đã ghi nhận thông tin và sẽ tiếp tục hỗ trợ.':null
    };
  });
}




