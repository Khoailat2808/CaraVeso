const fallbackVouchers = [
  {code:'WELCOME',program:'Khách hàng mới',discount:'10%',minOrder:'500.000đ',used:620,limit:1000,left:380,expiry:'31 Dec 2026',status:'Còn đủ',type:'percent',revenue:120000000},
  {code:'SUMMER20',program:'Bộ sưu tập mùa hè',discount:'15%',minOrder:'1.500.000đ',used:95,limit:100,left:5,expiry:'31 Aug 2026',status:'Sắp hết',type:'percent',revenue:95000000},
  {code:'FREESHIP',program:'Giao hàng miễn phí',discount:'Phí vận chuyển 0đ',minOrder:'0đ',used:1289,limit:null,left:null,expiry:'11 Nov 2026',status:'Còn nhiều',type:'shipping',revenue:88000000},
  {code:'VIP15',program:'VIP độc quyền',discount:'20%',minOrder:'2.000.000đ',used:210,limit:500,left:290,expiry:'25 Oct 2026',status:'Còn voucher',type:'percent',revenue:210000000},
  {code:'FLASH30',program:'Chớp nhoáng cuối tuần',discount:'25%',minOrder:'1.800.000đ',used:500,limit:500,left:0,expiry:'15 Jul 2026',status:'Hết voucher',type:'percent',revenue:180000000},
  {code:'BEDROOM10',program:'Phòng ngủ ấm áp',discount:'10%',minOrder:'650.000đ',used:121,limit:300,left:179,expiry:'30 Sept 2026',status:'Còn voucher',type:'percent',revenue:75000000},
  {code:'ZENSTYLE',program:'Zen Style',discount:'18%',minOrder:'1.000.000đ',used:80,limit:300,left:220,expiry:'30 Nov 2026',status:'Còn nhiều',type:'percent',revenue:62000000},
  {code:'ODACOLLECTION',program:'Oda Collection',discount:'12%',minOrder:'1.200.000đ',used:450,limit:1000,left:550,expiry:'20 Dec 2026',status:'Còn nhiều',type:'percent',revenue:135000000},
  {code:'SOFA50K',program:'Sofa ưu đãi',discount:'50.000đ',minOrder:'1.000.000đ',used:135,limit:500,left:365,expiry:'15 Sep 2026',status:'Còn nhiều',type:'fixed',revenue:43000000},
  {code:'CHAIRDAY',program:'Ngày hội ghế',discount:'8%',minOrder:'700.000đ',used:78,limit:120,left:42,expiry:'05 Aug 2026',status:'Còn voucher',type:'percent',revenue:28000000}
];
const fallbackPromotions = [
  {kind:'Category Discount',program:'Giảm giá mùa hè',discount:'20%',applies:'Sofa, bàn ăn, tủ quần áo',period:'01 Jun - 31 Jul 2026',status:'Diễn ra',revenue:400000000},
  {kind:'Flash Sale',program:'Khuyến mãi chớp nhoáng',discount:'35%',applies:'Tất cả sản phẩm',period:'01 Jul - 15 Jul 2026',status:'Đã lên lịch',revenue:190000000},
  {kind:'Buy X Get Y',program:'Mua 2 tặng 1',discount:'Mua 2 tặng 1',applies:'Ghế',period:'05 Jul - 20 Jul 2026',status:'Diễn ra',revenue:130000000},
  {kind:'Category Discount',program:'Xả hàng cuối mùa',discount:'50%',applies:'Các mặt hàng xả kho',period:'25 Jun - 25 Jul 2026',status:'Bản nháp',revenue:0},
  {kind:'Voucher Campaign',program:'Chào mừng khách hàng mới',discount:'15%',applies:'Khách hàng mới',period:'01 Jun - 31 Oct 2026',status:'Diễn ra',revenue:90000000}
];

let vouchers = [];
let promotions = [];
let activeTab = 'voucher';
let currentPage = 1;
let filters = { search:'', status:'Tất cả', benefit:'Tất cả', expiry:'Tất cả', promoStatus:'Tất cả', promoBenefit:'Tất cả' };
const perPage = 5;

const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

async function getJson(path, fallback){
  try{
    const res = await fetch(path, {cache:'no-store'});
    if(!res.ok) throw new Error('fetch failed');
    return await res.json();
  }catch(err){
    return fallback;
  }
}

function numberCompact(num){
  if(num >= 1_000_000_000) return (num/1_000_000_000).toFixed(num % 1_000_000_000 ? 1 : 0) + 'tỷ';
  if(num >= 1_000_000) return (num/1_000_000).toFixed(num % 1_000_000 ? 1 : 0) + 'tr';
  return String(num);
}
function formatUsed(item){ return item.limit ? `${item.used} / ${item.limit}` : `${item.used} / --`; }
function pct(item){ return item.limit ? Math.min(100, Math.round(item.used / item.limit * 100)) : 90; }
function statusColor(st){
  if(['Còn nhiều','Diễn ra'].includes(st)) return 'line-green';
  if(['Còn voucher'].includes(st)) return 'line-rose';
  if(['Còn đủ'].includes(st)) return 'line-brown';
  if(['Sắp hết','Đã lên lịch'].includes(st)) return 'line-orange';
  if(['Hết voucher'].includes(st)) return 'line-red';
  return 'line-green';
}
function promoTagClass(kind){
  if(kind.includes('Flash')) return 'tag-purple';
  if(kind.includes('Buy')) return 'tag-blue';
  if(kind.includes('Voucher')) return 'tag-green';
  return 'tag-orange';
}
function promoStatusClass(st){
  if(st === 'Diễn ra') return 'st-active';
  if(st === 'Đã lên lịch') return 'st-scheduled';
  return 'st-draft';
}

function calcStats(){
  const activeVoucher = vouchers.filter(v => v.left !== 0 && v.status !== 'Hết voucher').length;
  const activePromo = promotions.filter(p => p.status === 'Diễn ra').length;
  const exchanged = vouchers.reduce((s,v)=>s+(Number(v.used)||0),0);
  const revenue = vouchers.reduce((s,v)=>s+(Number(v.revenue)||0),0) + promotions.reduce((s,p)=>s+(Number(p.revenue)||0),0);
  return [
    {title:'Voucher hiện hành', value:activeVoucher, unit:'', growth:'+12% vs last month'},
    {title:'Khuyến mãi hiện hành', value:activePromo, unit:'', growth:'+8% vs last month'},
    {title:'Voucher được đổi', value:exchanged.toLocaleString('vi-VN').replace(/,/g,'.'), unit:'lượt', growth:''},
    {title:'Doanh thu từ khuyến mãi', value:numberCompact(revenue), unit:'', growth:'+15% vs last month'},
  ];
}
function renderStats(){
  $('#statsGrid').innerHTML = calcStats().map(s => `
    <article class="stat-card">
      <div class="stat-title">${s.title}</div>
      <div class="stat-row"><span class="stat-value">${s.value}</span>${s.unit ? `<span class="stat-unit">${s.unit}</span>` : ''}${s.growth ? `<span class="stat-growth">${s.growth}</span>` : ''}</div>
    </article>`).join('');
}

function makeSelect({label, key, value, options, colored=false, statusChips=false}){
  const opts = options.map(o => {
    if(colored && o !== 'Tất cả') return `<button class="select-option" data-value="${o}"><span class="color-line ${statusColor(o)}"></span><span>${o}</span></button>`;
    if(statusChips && o !== 'Tất cả') return `<button class="select-option" data-value="${o}"><span class="status-pill ${promoStatusClass(o)}">${o}</span></button>`;
    return `<button class="select-option ${o==='Tất cả' && colored ? 'all' : ''}" data-value="${o}">${o}</button>`;
  }).join('');
  return `<div class="filter-field custom-select" data-key="${key}">
    <span class="custom-select-label">${label}</span>
    <button type="button" class="select-btn"><span>${value}</span><i class="chev"></i></button>
    <div class="select-menu">${opts}</div>
  </div>`;
}

function renderFilters(){
  const wrap = $('#filters');
  wrap.className = 'filters ' + activeTab;
  if(activeTab === 'voucher'){
    wrap.innerHTML = `
      <div class="filter-field"><label>Tìm kiếm</label><input class="input" id="searchInput" placeholder="Tìm kiếm mã giảm giá hoặc chương trình..." value="${filters.search}"></div>
      ${makeSelect({label:'Trạng thái', key:'status', value:filters.status, colored:true, options:['Tất cả','Còn nhiều','Còn voucher','Còn đủ','Sắp hết','Hết voucher']})}
      ${makeSelect({label:'Ưu đãi', key:'benefit', value:filters.benefit, options:['Tất cả','10%','15%','20%','25%','Miễn phí vận chuyển']})}
      ${makeSelect({label:'Hạn dùng', key:'expiry', value:filters.expiry, options:['Tất cả','Tháng 7/2026','Tháng 8/2026','Tháng 9/2026','Quý IV/2026']})}
    `;
  }else{
    wrap.innerHTML = `
      <div class="filter-field"><label>Tìm kiếm</label><input class="input" id="searchInput" placeholder="Tìm kiếm khuyến mãi hoặc chương trình..." value="${filters.search}"></div>
      <div class="filter-field"><label>Thời gian diễn ra</label><div class="date-range"><span>01 Jun - 31 Nov 2026</span><span class="calendar">▣</span></div></div>
      ${makeSelect({label:'Ưu đãi', key:'promoBenefit', value:filters.promoBenefit, options:['Tất cả','15%','20%','35%','50%','Mua 2 tặng 1']})}
      ${makeSelect({label:'Trạng thái', key:'promoStatus', value:filters.promoStatus, statusChips:true, options:['Tất cả','Diễn ra','Đã lên lịch','Bản nháp']})}
    `;
  }
  bindFilters();
}

function bindFilters(){
  const search = $('#searchInput');
  if(search){
    search.addEventListener('input', e => {filters.search = e.target.value.trim().toLowerCase(); currentPage=1; renderTable();});
  }
  $$('.custom-select').forEach(sel => {
    const btn = $('.select-btn', sel);
    btn.addEventListener('click', () => {
      $$('.custom-select').forEach(s => { if(s !== sel) s.classList.remove('open'); });
      sel.classList.toggle('open');
    });
    $$('.select-option', sel).forEach(opt => {
      opt.addEventListener('click', () => {
        const val = opt.dataset.value || opt.textContent.trim();
        filters[sel.dataset.key] = val;
        $('.select-btn span', sel).textContent = val;
        sel.classList.remove('open');
        currentPage = 1;
        renderTable();
      });
    });
  });
}

document.addEventListener('click', e => {
  if(!e.target.closest('.custom-select')) $$('.custom-select').forEach(s => s.classList.remove('open'));
});

function filteredVouchers(){
  return vouchers.filter(v => {
    const q = filters.search;
    if(q && !`${v.code} ${v.program} ${v.discount}`.toLowerCase().includes(q)) return false;
    if(filters.status !== 'Tất cả' && v.status !== filters.status) return false;
    if(filters.benefit !== 'Tất cả'){
      if(filters.benefit === 'Miễn phí vận chuyển') { if(!String(v.discount).includes('Phí vận chuyển')) return false; }
      else if(String(v.discount) !== filters.benefit) return false;
    }
    if(filters.expiry !== 'Tất cả'){
      if(filters.expiry.includes('7') && !v.expiry.includes('Jul')) return false;
      if(filters.expiry.includes('8') && !v.expiry.includes('Aug')) return false;
      if(filters.expiry.includes('9') && !v.expiry.includes('Sept')) return false;
      if(filters.expiry.includes('IV') && !/(Oct|Nov|Dec)/.test(v.expiry)) return false;
    }
    return true;
  });
}
function filteredPromos(){
  return promotions.filter(p => {
    const q = filters.search;
    if(q && !`${p.kind} ${p.program} ${p.discount} ${p.applies}`.toLowerCase().includes(q)) return false;
    if(filters.promoStatus !== 'Tất cả' && p.status !== filters.promoStatus) return false;
    if(filters.promoBenefit !== 'Tất cả' && String(p.discount) !== filters.promoBenefit) return false;
    return true;
  });
}
function renderTable(){
  if(activeTab === 'voucher') renderVoucherTable(); else renderPromoTable();
}
function renderVoucherTable(){
  $('#tableHead').innerHTML = `<tr><th style="width:16%">Mã voucher</th><th style="width:18%">Chương trình</th><th style="width:12%">Giảm</th><th style="width:14%">Đơn tối thiểu</th><th style="width:20%">Đã được sử dụng</th><th style="width:10%">Còn lại</th><th style="width:10%">Hạn</th></tr>`;
  const rows = filteredVouchers();
  const pageRows = rows.slice((currentPage-1)*perPage, currentPage*perPage);
  $('#tableBody').innerHTML = pageRows.map(v => `<tr>
    <td><span class="voucher-code">${v.code}</span></td><td>${v.program}</td><td>${v.discount}</td><td>${v.minOrder}</td>
    <td>${formatUsed(v)}<div class="usage-line"><span class="${statusColor(v.status)}" style="width:${pct(v)}%"></span></div></td>
    <td>${v.left ?? '--'}</td><td>${v.expiry}</td>
  </tr>`).join('');
  renderPagination(rows.length);
}
function renderPromoTable(){
  $('#tableHead').innerHTML = `<tr><th style="width:17%">Loại khuyến mãi</th><th style="width:17%">Chương trình</th><th style="width:10%">Giảm</th><th style="width:18%">Áp dụng cho</th><th style="width:23%">Thời gian diễn ra</th><th style="width:15%">Trạng thái</th></tr>`;
  const rows = filteredPromos();
  const pageRows = rows.slice((currentPage-1)*perPage, currentPage*perPage);
  $('#tableBody').innerHTML = pageRows.map(p => `<tr>
    <td><span class="promo-tag ${promoTagClass(p.kind)}">${p.kind}</span></td><td>${p.program}</td><td>${p.discount}</td><td>${p.applies}</td><td>${p.period}</td><td><span class="status-pill ${promoStatusClass(p.status)}">${p.status}</span></td>
  </tr>`).join('');
  renderPagination(rows.length);
}
function renderPagination(total){
  const pages = Math.max(1, Math.ceil(total / perPage));
  if(currentPage > pages) currentPage = pages;
  let html = `<button class="page-btn arrow" data-p="prev">‹</button>`;
  for(let i=1;i<=pages;i++){
    if(i <= 2 || i === pages){ html += `<button class="page-btn ${i===currentPage?'active':''}" data-p="${i}">${i}</button>`; }
    else if(i===3){ html += `<span>...</span>`; }
  }
  html += `<button class="page-btn arrow" data-p="next">›</button>`;
  $('#pagination').innerHTML = html;
  $$('#pagination .page-btn').forEach(btn => btn.addEventListener('click', () => {
    const p = btn.dataset.p;
    if(p==='prev') currentPage = Math.max(1, currentPage-1);
    else if(p==='next') currentPage = Math.min(pages, currentPage+1);
    else currentPage = Number(p);
    renderTable();
  }));
}
function switchTab(tab){
  activeTab = tab;
  currentPage = 1;
  $$('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab===tab));
  renderStats(); renderFilters(); renderTable();
}
function showToast(msg){
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'), 1800);
}
function openModal(type){
  $('#modalOverlay').classList.remove('hidden');
  $('#voucherForm').classList.toggle('hidden', type !== 'voucher');
  $('#promotionForm').classList.toggle('hidden', type !== 'promotion');
  $('#modalOverlay').setAttribute('aria-hidden','false');
}
function closeModal(){
  $('#modalOverlay').classList.add('hidden');
  $('#modalOverlay').setAttribute('aria-hidden','true');
  $('#voucherForm').classList.add('hidden');
  $('#promotionForm').classList.add('hidden');
}
function bindModal(){
  $('#openVoucherModal').addEventListener('click', () => openModal('voucher'));
  $('#openPromoModal').addEventListener('click', () => openModal('promotion'));
  $$('[data-close]').forEach(b => b.addEventListener('click', closeModal));
  $('#modalOverlay').addEventListener('click', e => { if(e.target.id==='modalOverlay') closeModal(); });
  $('#voucherForm').addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const code = (fd.get('code') || 'NEWVOUCHER').toString().toUpperCase();
    vouchers.unshift({code,program:'Voucher mới',discount:(fd.get('discount') || 10)+'%',minOrder:(fd.get('minOrder') || 0)+'đ',used:0,limit:Number(fd.get('quantity'))||100,left:Number(fd.get('quantity'))||100,expiry:'31 Dec 2026',status:'Còn nhiều',type:'percent',revenue:0});
    switchTab('voucher'); closeModal(); showToast('Đã tạo voucher mới');
  });
  $('#promotionForm').addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    promotions.unshift({kind:fd.get('promoKind') || 'Category Discount',program:fd.get('name') || 'Khuyến mãi mới',discount:(fd.get('promoDiscount') || 10)+'%',applies:'Tất cả sản phẩm',period:'01 Aug - 31 Aug 2026',status:'Bản nháp',revenue:0});
    switchTab('promotion'); closeModal(); showToast('Đã tạo khuyến mãi mới');
  });
}
async function init(){
  [vouchers, promotions] = await Promise.all([
    getJson('vouchers.json', fallbackVouchers),
    getJson('promotions.json', fallbackPromotions)
  ]);
  $$('.tab').forEach(t => t.addEventListener('click', () => switchTab(t.dataset.tab)));
  bindModal();
  $('#logoutBtn').addEventListener('click', () => showToast('Đã bấm đăng xuất'));
  $('#notifyBtn').addEventListener('click', () => showToast('Bạn có 1 thông báo mới'));
  $$('#sideNav .side-item').forEach(item => item.addEventListener('click', () => {
    $$('#sideNav .side-item').forEach(x => x.classList.remove('active'));
    item.classList.add('active');
    if(item.dataset.page !== 'voucher') showToast('Demo chuyển sang: ' + item.textContent.trim());
  }));
  $('#editBtn').addEventListener('click', () => showToast('Chế độ chỉnh sửa demo'));
  switchTab('voucher');
}
init();
