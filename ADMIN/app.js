(function () {
  'use strict';

  const page = document.body.dataset.page || 'dashboard';

  function formatMoney(value) {
    return value.toLocaleString('vi-VN') + ' đ';
  }

  function statusLabel(status) {
    const labels = {
      success: 'Thành công',
      pending: 'Chờ thanh toán',
      processing: 'Chờ xử lý',
      refunded: 'Đã hoàn tiền',
      rejected: 'Từ chối'
    };
    return labels[status] || status;
  }

  function confirmDelete(message, onConfirm) {
    const dialog = document.createElement('div');
    dialog.className = 'confirm-dialog admin-delete-confirm';
    dialog.innerHTML = [
      '<section class="confirm-dialog__box" role="dialog" aria-modal="true">',
        '<h2><span>!</span>Thông báo</h2>',
        '<p>' + message + '</p>',
        '<div>',
          '<button class="btn-outline" type="button" data-confirm-action="cancel">Quay lại</button>',
          '<button class="btn-primary" type="button" data-confirm-action="confirm">Xác nhận</button>',
        '</div>',
      '</section>'
    ].join('');
    document.body.appendChild(dialog);
    dialog.addEventListener('click', function (event) {
      const action = event.target.closest('[data-confirm-action]');
      if (event.target === dialog || (action && action.dataset.confirmAction === 'cancel')) {
        dialog.remove();
        return;
      }
      if (action && action.dataset.confirmAction === 'confirm') {
        onConfirm();
        dialog.remove();
      }
    });
  }

  function initDashboard() {
    const chart = document.getElementById('revenueChart');
    const reviewList = document.getElementById('reviewList');
    const bestSellerRows = document.getElementById('bestSellerRows');
    if (!chart || !reviewList || !bestSellerRows) return;

    let bestPage = 1;
    const bestRowsPerPage = 3;

    function drawChart(range) {
      const ctx = chart.getContext('2d');
      const values = ADMIN_DATA.revenueSeries[range] || ADMIN_DATA.revenueSeries.today;
      const width = chart.width;
      const height = chart.height;
      const padding = { top: 34, right: 38, bottom: 54, left: 72 };
      const max = Math.max.apply(null, values);
      const min = Math.min.apply(null, values);
      const spread = Math.max(max - min, 1);
      const topValue = Math.ceil((max * 1.16) / 10) * 10;
      const bottomValue = Math.max(0, Math.floor((min * .72) / 10) * 10);
      const valueRange = Math.max(topValue - bottomValue, 1);
      const points = values.map(function (value, index) {
        const x = padding.left + (index * (width - padding.left - padding.right)) / Math.max(values.length - 1, 1);
        const y = height - padding.bottom - ((value - bottomValue) / valueRange) * (height - padding.top - padding.bottom);
        return { x: x, y: y, value: value };
      });

      ctx.clearRect(0, 0, width, height);
      ctx.font = '12px Inter, sans-serif';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const bg = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
      bg.addColorStop(0, 'rgba(11, 53, 94, .05)');
      bg.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = bg;
      ctx.fillRect(padding.left, padding.top, width - padding.left - padding.right, height - padding.top - padding.bottom);

      ctx.strokeStyle = '#edf1f5';
      ctx.lineWidth = 1;
      ctx.fillStyle = '#9aa3ad';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      for (let i = 0; i < 5; i += 1) {
        const y = padding.top + i * ((height - padding.top - padding.bottom) / 4);
        const labelValue = topValue - i * (valueRange / 4);
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();
        ctx.fillText(Math.round(labelValue) + 'tr', padding.left - 14, y);
      }

      const area = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
      area.addColorStop(0, 'rgba(11, 53, 94, .24)');
      area.addColorStop(.72, 'rgba(11, 53, 94, .04)');
      area.addColorStop(1, 'rgba(11, 53, 94, 0)');
      ctx.beginPath();
      points.forEach(function (point, index) {
        if (index === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.lineTo(points[points.length - 1].x, height - padding.bottom);
      ctx.lineTo(points[0].x, height - padding.bottom);
      ctx.closePath();
      ctx.fillStyle = area;
      ctx.fill();

      const line = ctx.createLinearGradient(padding.left, 0, width - padding.right, 0);
      line.addColorStop(0, '#0b355e');
      line.addColorStop(.55, '#1c6aa3');
      line.addColorStop(1, '#0b355e');
      ctx.strokeStyle = line;
      ctx.lineWidth = 4;
      ctx.beginPath();
      points.forEach(function (point, index) {
        if (index === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();

      points.forEach(function (point, index) {
        const isLast = index === points.length - 1;
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = isLast ? '#0b355e' : '#1c6aa3';
        ctx.lineWidth = isLast ? 4 : 3;
        ctx.beginPath();
        ctx.arc(point.x, point.y, isLast ? 6 : 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });

      ctx.fillStyle = '#616b75';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      const labels = range === '12months'
        ? ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12']
        : values.map(function (_, index) { return index + 1; });
      points.forEach(function (point, index) {
        ctx.fillText(labels[index], point.x, height - padding.bottom + 18);
      });

      const last = points[points.length - 1];
      const tooltipWidth = 86;
      const tooltipHeight = 34;
      const tooltipX = Math.min(last.x + 14, width - padding.right - tooltipWidth);
      const tooltipY = Math.max(last.y - 48, padding.top);
      ctx.fillStyle = '#0b355e';
      ctx.beginPath();
      ctx.roundRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight, 8);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = '700 13px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(last.value + ' triệu', tooltipX + tooltipWidth / 2, tooltipY + tooltipHeight / 2);
    }

    function renderReviews() {
      reviewList.innerHTML = ADMIN_DATA.reviews.map(function (review) {
        return [
          '<article class="review-item">',
            '<div class="review-avatar"></div>',
            '<div>',
              '<div class="stars">★★★★★</div>',
              '<h3>' + review.product + '</h3>',
              '<p class="review-meta">' + review.date + ' | Phân loại: ' + review.category + '</p>',
              '<p>' + review.content + '</p>',
              '<strong>' + review.customer + '</strong>',
            '</div>',
          '</article>'
        ].join('');
      }).join('');
    }

    function renderBestSellers() {
      const start = (bestPage - 1) * bestRowsPerPage;
      const rows = ADMIN_DATA.bestSellers.slice(start, start + bestRowsPerPage);
      bestSellerRows.innerHTML = rows.map(function (product) {
        return [
          '<tr>',
            '<td>' + product.name + '</td>',
            '<td>' + product.type + '</td>',
            '<td>' + product.sold + '</td>',
            '<td>' + formatMoney(product.revenue) + '</td>',
          '</tr>'
        ].join('');
      }).join('');
      document.getElementById('bestPrev').disabled = bestPage === 1;
      document.getElementById('bestNext').disabled = bestPage >= Math.ceil(ADMIN_DATA.bestSellers.length / bestRowsPerPage);
    }

    document.querySelectorAll('.segment-control button').forEach(function (button) {
      button.addEventListener('click', function () {
        document.querySelectorAll('.segment-control button').forEach(function (item) {
          item.classList.remove('is-active');
        });
        button.classList.add('is-active');
        drawChart(button.dataset.range);
      });
    });

    document.getElementById('bestPrev').addEventListener('click', function () {
      bestPage -= 1;
      renderBestSellers();
    });

    document.getElementById('bestNext').addEventListener('click', function () {
      bestPage += 1;
      renderBestSellers();
    });

    document.getElementById('replyReviews').addEventListener('click', function () {
      window.location.href = 'support.html';
    });

    drawChart('today');
    renderReviews();
    renderBestSellers();
  }

  function initPayment() {
    const rowsPerPage = 5;
    let currentPage = 1;
    let selectedRefundId = null;

    const els = {
      searchInput: document.getElementById('searchInput'),
      statusFilter: document.getElementById('statusFilter'),
      methodFilter: document.getElementById('methodFilter'),
      timeFilter: document.getElementById('timeFilter'),
      paymentRows: document.getElementById('paymentRows'),
      paymentCount: document.getElementById('paymentCount'),
      prevPage: document.getElementById('prevPage'),
      nextPage: document.getElementById('nextPage'),
      refundRows: document.getElementById('refundRows'),
      refundDetail: document.getElementById('refundDetail'),
      showAllRefunds: document.getElementById('showAllRefunds')
    };

    if (!els.paymentRows) return;

    function filteredPayments() {
      const query = els.searchInput.value.trim().toLowerCase();
      const status = els.statusFilter.value;
      const method = els.methodFilter.value;
      const time = els.timeFilter.value;

      return ADMIN_DATA.payments.filter(function (payment) {
        const matchesQuery = !query ||
          payment.id.toLowerCase().includes(query) ||
          payment.customer.toLowerCase().replace(/\n/g, ' ').includes(query);
        const matchesStatus = !status || payment.status === status;
        const matchesMethod = !method || payment.method === method;
        const matchesTime = !time || payment.timeKey === time;

        return matchesQuery && matchesStatus && matchesMethod && matchesTime;
      });
    }

    function renderPayments() {
      const rows = filteredPayments();
      const maxPage = Math.max(1, Math.ceil(rows.length / rowsPerPage));
      currentPage = Math.min(currentPage, maxPage);

      const start = (currentPage - 1) * rowsPerPage;
      const visible = rows.slice(start, start + rowsPerPage);

      els.paymentRows.innerHTML = visible.map(function (payment) {
        return [
          '<tr>',
            '<td><span class="payment-id ' + (payment.danger ? 'is-danger' : '') + '">' + payment.id + '</span></td>',
            '<td class="time-cell">' + payment.time + '</td>',
            '<td><div class="customer-wrap">' + (payment.avatar ? '<img class="avatar" src="' + payment.avatar + '" alt="' + payment.customer.replace(/\n/g, ' ') + '">' : '<span class="avatar" style="background:' + payment.avatarColor + '">' + payment.initials + '</span>') + '<span class="customer-cell">' + payment.customer + '</span></div></td>',
            '<td><span class="status-pill status-' + payment.status + '">' + statusLabel(payment.status) + '</span></td>',
            '<td>' + payment.method + '</td>',
            '<td class="money ' + (payment.danger ? 'is-danger' : '') + '">' + formatMoney(payment.total) + '</td>',
          '</tr>'
        ].join('');
      }).join('');

      const end = rows.length ? Math.min(start + visible.length, rows.length) : 0;
      const begin = rows.length ? start + 1 : 0;
      els.paymentCount.textContent = 'Hiển thị ' + begin + '-' + end + ' trong tổng ' + ADMIN_DATA.paymentsTotal;
      els.prevPage.disabled = currentPage === 1;
      els.nextPage.disabled = currentPage === maxPage;
    }

    function renderRefunds(limit) {
      const refunds = limit ? ADMIN_DATA.refunds.slice(0, limit) : ADMIN_DATA.refunds;
      els.refundRows.innerHTML = refunds.map(function (refund) {
        return [
          '<tr class="refund-row ' + (refund.id === selectedRefundId ? 'is-selected' : '') + '" data-id="' + refund.id + '">',
            '<td><strong class="refund-id">' + refund.id + '</strong></td>',
            '<td class="time-cell">' + refund.time + '</td>',
            '<td>' + refund.customer + '</td>',
            '<td>' + refund.reason + '</td>',
            '<td><span class="status-pill status-' + refund.status + '">' + statusLabel(refund.status) + '</span></td>',
            '<td><button class="detail-link" type="button" data-action="detail" data-id="' + refund.id + '">Xem chi tiết</button></td>',
          '</tr>'
        ].join('');
      }).join('');
    }

    function renderDetail(refundId) {
      const refund = ADMIN_DATA.refunds.find(function (item) { return item.id === refundId; });
      if (!refund) return;

      selectedRefundId = refund.id;
      els.refundDetail.hidden = false;
      els.refundDetail.innerHTML = [
        '<div class="detail-head">',
          '<h2>Chi tiết Hoàn tiền ' + refund.id + '</h2>',
          '<button class="close-detail" type="button" data-action="close" aria-label="Đóng chi tiết">',
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
          '</button>',
        '</div>',
        '<h3 class="detail-subtitle">Thông tin yêu cầu</h3>',
        '<dl class="request-grid">',
          '<dt>Khách hàng:</dt><dd>' + refund.customer + '</dd>',
          '<dt>Lý do hoàn tiền:</dt><dd>' + refund.reason + '</dd>',
          '<dt>Mô tả:</dt><dd>' + refund.description + '</dd>',
        '</dl>',
        '<div class="product-row">',
          '<img src="' + refund.product.image + '" alt="' + refund.product.name + '">',
          '<div>',
            '<h3>' + refund.product.name + '</h3>',
            '<p><strong>SKU:</strong> ' + refund.product.sku + '</p>',
            '<p>' + refund.product.desc + '</p>',
            '<p>Số lượng: ' + refund.product.quantity + '</p>',
          '</div>',
        '</div>',
        '<hr class="detail-divider">',
        '<h3 class="detail-subtitle">Thông tin hoàn tiền</h3>',
        '<dl class="refund-info">',
          '<dt>Phương thức thanh toán</dt><dd>' + refund.paymentMethod + '</dd>',
          '<dt>Số tiền hoàn</dt><dd>' + formatMoney(refund.amount) + '</dd>',
          '<dt>Phí hoàn tiền</dt><dd>' + refund.fee + '</dd>',
          '<dt class="total-label">Tổng tiền hoàn</dt><dd class="total-value">' + formatMoney(refund.amount) + '</dd>',
          '<dt>Ngày yêu cầu</dt><dd>' + refund.requestDate + '</dd>',
          '<dt>Thời gian dự kiến hoàn tiền</dt><dd>' + refund.eta + '</dd>',
        '</dl>',
        '<hr class="detail-divider">',
        '<h3 class="detail-subtitle">Phản hồi đến khách hàng</h3>',
        '<textarea class="response-box" id="adminResponse" placeholder="Để lại phản hồi cho khách hàng (nếu có)..."></textarea>',
        '<div class="detail-actions">',
          '<button class="action-btn btn-outline" type="button" data-action="reject" data-id="' + refund.id + '">Từ chối yêu cầu</button>',
          '<button class="action-btn btn-primary" type="button" data-action="approve" data-id="' + refund.id + '">Duyệt yêu cầu</button>',
        '</div>'
      ].join('');

      renderRefunds();
      els.refundDetail.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function updateRefundStatus(refundId, status) {
      const refund = ADMIN_DATA.refunds.find(function (item) { return item.id === refundId; });
      if (!refund) return;
      refund.status = status;
      renderRefunds();
      renderDetail(refundId);
    }

    [els.searchInput, els.statusFilter, els.methodFilter, els.timeFilter].forEach(function (input) {
      input.addEventListener('input', function () {
        currentPage = 1;
        renderPayments();
      });
      input.addEventListener('change', function () {
        currentPage = 1;
        renderPayments();
      });
    });

    els.prevPage.addEventListener('click', function () {
      currentPage -= 1;
      renderPayments();
    });

    els.nextPage.addEventListener('click', function () {
      currentPage += 1;
      renderPayments();
    });

    els.refundRows.addEventListener('click', function (event) {
      const button = event.target.closest('[data-action="detail"]');
      if (!button) return;
      renderDetail(button.dataset.id);
    });

    els.showAllRefunds.addEventListener('click', function () {
      renderRefunds();
    });

    els.refundDetail.addEventListener('click', function (event) {
      const control = event.target.closest('[data-action]');
      if (!control) return;

      if (control.dataset.action === 'close') {
        selectedRefundId = null;
        els.refundDetail.hidden = true;
        renderRefunds();
      }

      if (control.dataset.action === 'approve') {
        updateRefundStatus(control.dataset.id, 'refunded');
      }

      if (control.dataset.action === 'reject') {
        updateRefundStatus(control.dataset.id, 'rejected');
      }
    });

    renderPayments();
    renderRefunds();
  }

  function initOrders() {
    const rowsPerPage = 5;
    let currentPage = 1;
    let selectedOrderId = null;

    const els = {
      searchInput: document.getElementById('orderSearchInput'),
      statusFilter: document.getElementById('orderStatusFilter'),
      paymentFilter: document.getElementById('orderPaymentFilter'),
      orderRows: document.getElementById('orderRows'),
      orderCount: document.getElementById('orderCount'),
      prevPage: document.getElementById('orderPrevPage'),
      nextPage: document.getElementById('orderNextPage'),
      detailArea: document.getElementById('orderDetailArea'),
      detail: document.getElementById('orderDetail'),
      timeline: document.getElementById('orderTimeline')
    };

    if (!els.orderRows) return;

    function orderStatusLabel(status) {
      const labels = {
        new: 'Mới',
        confirmed: 'Đã xác nhận',
        preparing: 'Đang chuẩn bị',
        shipping: 'Đang vận chuyển',
        delivered: 'Đã giao',
        'cancel-request': 'Yêu cầu hủy',
        cancelled: 'Đã hủy'
      };
      return labels[status] || status;
    }

    function filteredOrders() {
      const query = els.searchInput.value.trim().toLowerCase();
      const status = els.statusFilter.value;
      const payment = els.paymentFilter.value;

      return ADMIN_DATA.orders.filter(function (order) {
        const matchesQuery = !query ||
          order.id.toLowerCase().includes(query) ||
          order.customer.toLowerCase().replace(/\n/g, ' ').includes(query);
        const matchesStatus = !status || order.status === status;
        const matchesPayment = !payment || order.payment === payment;
        return matchesQuery && matchesStatus && matchesPayment;
      });
    }

    function renderOrders() {
      const rows = filteredOrders();
      const maxPage = Math.max(1, Math.ceil(rows.length / rowsPerPage));
      currentPage = Math.min(currentPage, maxPage);

      const start = (currentPage - 1) * rowsPerPage;
      const visible = rows.slice(start, start + rowsPerPage);

      els.orderRows.innerHTML = visible.map(function (order) {
        return [
          '<tr class="clickable-row ' + (order.id === selectedOrderId ? 'is-selected' : '') + '" data-id="' + order.id + '">',
            '<td><span class="payment-id ' + (order.danger ? 'is-danger' : '') + '">' + order.id + '</span></td>',
            '<td class="time-cell">' + order.time + '</td>',
            '<td><div class="customer-wrap">' + (order.avatar ? '<img class="avatar" src="' + order.avatar + '" alt="' + order.customer.replace(/\n/g, ' ') + '">' : '<span class="avatar" style="background:' + order.avatarColor + '">' + order.initials + '</span>') + '<span class="customer-cell">' + order.customer + '</span></div></td>',
            '<td><span class="status-pill order-status status-' + order.status + '">' + orderStatusLabel(order.status) + '</span></td>',
            '<td>' + order.payment + '</td>',
            '<td class="money ' + (order.danger ? 'is-danger' : '') + '">' + formatMoney(order.total) + '</td>',
          '</tr>'
        ].join('');
      }).join('');

      const end = rows.length ? Math.min(start + visible.length, rows.length) : 0;
      const begin = rows.length ? start + 1 : 0;
      els.orderCount.textContent = 'Hiển thị ' + begin + '-' + end + ' trong tổng ' + ADMIN_DATA.ordersTotal;
      els.prevPage.disabled = currentPage === 1;
      els.nextPage.disabled = currentPage === maxPage;
    }

    function renderTimeline(order) {
      const steps = [
        { title: 'Đã xác nhận đơn', note: 'Hôm qua, 7:00 PM' },
        { title: 'Đang chuẩn bị hàng', note: 'Hôm qua, 7:30 PM' },
        { title: 'Xuất kho', note: 'Dự kiến: 01/07/2026' },
        { title: 'Vận chuyển', note: 'Dự kiến: 2 ngày' },
        { title: 'Hoàn thành', note: 'Dự kiến: 03/07/2026' }
      ];

      els.timeline.innerHTML = [
        '<h2>Tiến trình đơn hàng ' + order.id + '</h2>',
        '<ol class="order-timeline">',
          steps.map(function (step, index) {
            const state = index < order.timelineStep ? 'is-done' : index === order.timelineStep ? 'is-current' : '';
            return [
              '<li class="' + state + '">',
                '<span class="timeline-dot"></span>',
                '<div><strong>' + step.title + '</strong><small>' + step.note + '</small></div>',
              '</li>'
            ].join('');
          }).join(''),
        '</ol>'
      ].join('');
    }

    function renderDetail(orderId) {
      const order = ADMIN_DATA.orders.find(function (item) { return item.id === orderId; });
      if (!order) return;
      selectedOrderId = order.id;
      els.detailArea.hidden = false;

      els.detail.innerHTML = [
        '<div class="detail-head">',
          '<h2>Chi tiết đơn hàng ' + order.id + '</h2>',
          '<button class="close-detail" type="button" data-action="close-order" aria-label="Đóng chi tiết">',
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
          '</button>',
        '</div>',
        '<div class="order-detail-tools">',
          '<div><h3 class="detail-subtitle">Trạng thái đơn hàng:</h3><span class="status-pill order-status status-' + order.status + '">' + orderStatusLabel(order.status) + '</span></div>',
          '<label class="field order-update-field"><span>Cập nhật trạng thái:</span>',
            '<select id="orderUpdateStatus">',
              '<option value="new">Mới</option>',
              '<option value="confirmed">Đã xác nhận</option>',
              '<option value="preparing">Đang chuẩn bị</option>',
              '<option value="shipping">Đang vận chuyển</option>',
              '<option value="delivered">Đã giao</option>',
              '<option value="cancel-request">Yêu cầu hủy</option>',
              '<option value="cancelled">Đã hủy</option>',
            '</select>',
          '</label>',
          '<button class="order-confirm-btn" type="button" data-action="update-order" data-id="' + order.id + '">Xác nhận</button>',
        '</div>',
        '<div class="product-row order-product-row">',
          '<img src="' + order.product.image + '" alt="' + order.product.name + '">',
          '<div>',
            '<h3>' + order.product.name + '</h3>',
            '<p><strong>SKU:</strong> ' + order.product.sku + '</p>',
            '<p class="time-cell">' + order.product.desc + '</p>',
            '<p>Số lượng: ' + order.product.quantity + '</p>',
          '</div>',
        '</div>',
        '<hr class="detail-divider">',
        '<dl class="refund-info order-money-info">',
          '<dt>Tổng tiền hàng:</dt><dd>' + formatMoney(order.total) + '</dd>',
          '<dt>Phí vận chuyển:</dt><dd>0đ</dd>',
          '<dt class="total-label">Thành tiền:</dt><dd class="total-value">' + formatMoney(order.total) + '</dd>',
        '</dl>'
      ].join('');

      document.getElementById('orderUpdateStatus').value = order.status;
      renderTimeline(order);
      renderOrders();
      els.detailArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function updateOrderStatus(orderId) {
      const order = ADMIN_DATA.orders.find(function (item) { return item.id === orderId; });
      const nextStatus = document.getElementById('orderUpdateStatus').value;
      if (!order || !nextStatus) return;
      order.status = nextStatus;
      order.timelineStep = {
        new: 0,
        confirmed: 1,
        preparing: 2,
        shipping: 3,
        delivered: 4,
        'cancel-request': 1,
        cancelled: 1
      }[nextStatus];
      renderDetail(orderId);
    }

    [els.searchInput, els.statusFilter, els.paymentFilter].forEach(function (input) {
      input.addEventListener('input', function () {
        currentPage = 1;
        renderOrders();
      });
      input.addEventListener('change', function () {
        currentPage = 1;
        renderOrders();
      });
    });

    els.prevPage.addEventListener('click', function () {
      currentPage -= 1;
      renderOrders();
    });

    els.nextPage.addEventListener('click', function () {
      currentPage += 1;
      renderOrders();
    });

    els.orderRows.addEventListener('click', function (event) {
      const row = event.target.closest('[data-id]');
      if (!row) return;
      renderDetail(row.dataset.id);
    });

    els.detailArea.addEventListener('click', function (event) {
      const control = event.target.closest('[data-action]');
      if (!control) return;
      if (control.dataset.action === 'close-order') {
        selectedOrderId = null;
        els.detailArea.hidden = true;
        renderOrders();
      }
      if (control.dataset.action === 'update-order') {
        updateOrderStatus(control.dataset.id);
      }
    });

    renderOrders();
  }

  function initCustomers() {
    const rowsPerPage = 5;
    let currentPage = 1;
    let selectedCustomerId = null;
    let pendingLockCustomerId = null;

    const els = {
      searchInput: document.getElementById('customerSearchInput'),
      tierFilter: document.getElementById('customerTierFilter'),
      rows: document.getElementById('customerRows'),
      count: document.getElementById('customerCount'),
      total: document.getElementById('customerTotal'),
      prevPage: document.getElementById('customerPrevPage'),
      nextPage: document.getElementById('customerNextPage'),
      modal: document.getElementById('customerModal'),
      modalBody: document.getElementById('customerModalBody'),
      lockConfirm: document.getElementById('customerLockConfirm'),
      lockConfirmMessage: document.getElementById('customerLockConfirmMessage')
    };

    if (!els.rows) return;
    els.total.textContent = ADMIN_DATA.customersGrandTotal.toLocaleString('vi-VN') + ' Khách';

    function tierLabel(tier) {
      return { vip: 'VIP', loyal: 'Thân thiết', new: 'Mới' }[tier] || tier;
    }

    function filteredCustomers() {
      const query = els.searchInput.value.trim().toLowerCase();
      const tier = els.tierFilter.value;
      return ADMIN_DATA.customers.filter(function (customer) {
        const matchesQuery = !query ||
          customer.name.toLowerCase().includes(query) ||
          customer.email.toLowerCase().includes(query) ||
          customer.phone.includes(query);
        const matchesTier = !tier || customer.tier === tier;
        return matchesQuery && matchesTier;
      });
    }

    function renderCustomers() {
      const rows = filteredCustomers();
      const maxPage = Math.max(1, Math.ceil(rows.length / rowsPerPage));
      currentPage = Math.min(currentPage, maxPage);
      const start = (currentPage - 1) * rowsPerPage;
      const visible = rows.slice(start, start + rowsPerPage);

      els.rows.innerHTML = visible.map(function (customer) {
        return [
          '<tr class="clickable-row customer-row ' + (customer.locked ? 'is-locked' : '') + ' ' + (customer.id === selectedCustomerId ? 'is-selected' : '') + '" data-id="' + customer.id + '">',
            '<td><div class="customer-name"><img src="' + customer.avatar + '" alt="' + customer.name + '"><strong>' + customer.name + '</strong></div></td>',
            '<td>' + customer.email + '</td>',
            '<td>' + customer.phone + '</td>',
            '<td><span class="member-pill member-' + customer.tier + '">' + tierLabel(customer.tier) + '</span></td>',
            '<td><button class="lock-btn ' + (customer.locked ? 'is-locked' : '') + '" type="button" data-action="toggle-lock" data-id="' + customer.id + '" aria-label="Khóa hoặc mở khóa tài khoản"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg></button></td>',
          '</tr>'
        ].join('');
      }).join('');

      const end = rows.length ? Math.min(start + visible.length, rows.length) : 0;
      const begin = rows.length ? start + 1 : 0;
      els.count.textContent = 'Hiển thị ' + begin + '-' + end + ' trong tổng ' + ADMIN_DATA.customersTotal;
      els.prevPage.disabled = currentPage === 1;
      els.nextPage.disabled = currentPage === maxPage;
    }

    function renderModal(customerId) {
      const customer = ADMIN_DATA.customers.find(function (item) { return item.id === customerId; });
      if (!customer) return;
      selectedCustomerId = customer.id;
      els.modal.hidden = false;
      els.modalBody.innerHTML = [
        '<div class="customer-profile-card">',
          '<img src="' + customer.avatar + '" alt="' + customer.name + '">',
          '<div>',
            '<h3>' + customer.name + '</h3>',
            '<p>Thành viên: <span class="member-pill member-' + customer.tier + '">' + tierLabel(customer.tier) + '</span></p>',
            '<em>Tạo tài khoản từ ' + customer.createdAt + '</em>',
          '</div>',
        '</div>',
        '<dl class="customer-info-list">',
          '<dt>Email:</dt><dd>' + customer.email + '</dd>',
          '<dt>Số điện thoại:</dt><dd>' + customer.phone + '</dd>',
          '<dt>Giới tính:</dt><dd>' + customer.gender + '</dd>',
          '<dt>Ngày sinh:</dt><dd>' + customer.birthday + '</dd>',
          '<dt>Địa chỉ:</dt><dd class="time-cell">' + customer.address + '</dd>',
          '<dt>Tổng đơn hàng:</dt><dd>' + customer.totalOrders + '</dd>',
          '<dt>Tổng chi tiêu:</dt><dd>' + formatMoney(customer.totalSpent) + '</dd>',
        '</dl>',
        '<div class="customer-modal-actions">',
          '<button class="action-btn btn-outline" type="button" data-action="close-customer">Quay lại</button>',
          '<button class="action-btn btn-primary" type="button" data-action="message-customer">Nhắn tin</button>',
        '</div>'
      ].join('');
      renderCustomers();
    }

    function toggleLock(customerId) {
      const customer = ADMIN_DATA.customers.find(function (item) { return item.id === customerId; });
      if (!customer) return;
      customer.locked = !customer.locked;
      renderCustomers();
    }

    function openLockConfirm(customerId) {
      const customer = ADMIN_DATA.customers.find(function (item) { return item.id === customerId; });
      if (!customer) return;
      pendingLockCustomerId = customer.id;
      els.lockConfirmMessage.textContent = 'Bạn có chắc chắn muốn ' + (customer.locked ? 'mở khóa' : 'khóa') + ' tài khoản?';
      els.lockConfirm.hidden = false;
    }

    function closeLockConfirm() {
      pendingLockCustomerId = null;
      els.lockConfirm.hidden = true;
    }

    function closeModal() {
      selectedCustomerId = null;
      els.modal.hidden = true;
      renderCustomers();
    }

    [els.searchInput, els.tierFilter].forEach(function (input) {
      input.addEventListener('input', function () {
        currentPage = 1;
        renderCustomers();
      });
      input.addEventListener('change', function () {
        currentPage = 1;
        renderCustomers();
      });
    });

    els.prevPage.addEventListener('click', function () {
      currentPage -= 1;
      renderCustomers();
    });

    els.nextPage.addEventListener('click', function () {
      currentPage += 1;
      renderCustomers();
    });

    els.rows.addEventListener('click', function (event) {
      const lockButton = event.target.closest('[data-action="toggle-lock"]');
      if (lockButton) {
        event.stopPropagation();
        openLockConfirm(lockButton.dataset.id);
        return;
      }
      const row = event.target.closest('[data-id]');
      if (!row) return;
      renderModal(row.dataset.id);
    });

    els.modal.addEventListener('click', function (event) {
      const action = event.target.closest('[data-action]');
      if (event.target === els.modal || (action && action.dataset.action === 'close-customer')) closeModal();
      if (action && action.dataset.action === 'message-customer') {
        alert('Đã mở khung nhắn tin với khách hàng.');
      }
    });

    els.lockConfirm.addEventListener('click', function (event) {
      const action = event.target.closest('[data-action]');
      if (event.target === els.lockConfirm || (action && action.dataset.action === 'cancel-lock')) {
        closeLockConfirm();
        return;
      }
      if (action && action.dataset.action === 'confirm-lock') {
        toggleLock(pendingLockCustomerId);
        closeLockConfirm();
      }
    });

    renderCustomers();
  }

  function initProducts() {
    const rowsPerPage = 10;
    let currentPage = 1;
    let activeTab = 'all';
    let editingId = null;
    let mediaTab = 'main';
    const variants = [
      { name: 'Màu sắc', count: 5 },
      { name: 'Số ghế', count: 3 }
    ];

    const els = {
      listView: document.getElementById('productListView'),
      formView: document.getElementById('productFormView'),
      rows: document.getElementById('productRows'),
      search: document.getElementById('productSearchInput'),
      category: document.getElementById('productCategoryFilter'),
      room: document.getElementById('productRoomFilter'),
      page: document.getElementById('productPage'),
      maxPage: document.getElementById('productMaxPage'),
      prev: document.getElementById('productPrevPage'),
      next: document.getElementById('productNextPage'),
      showForm: document.getElementById('showProductForm'),
      back: document.getElementById('backToProducts'),
      form: document.getElementById('productForm'),
      variantRows: document.getElementById('variantRows'),
      mediaBody: document.getElementById('mediaBody')
    };
    if (!els.rows) return;

    function stockStatus(product) {
      if (product.stock <= 0) return 'out';
      if (product.stock <= 10) return 'low';
      return 'available';
    }

    function statusText(status) {
      return { available: 'Còn hàng', low: 'Sắp hết hàng', out: 'Hết hàng' }[status];
    }

    function filteredProducts() {
      const query = els.search.value.trim().toLowerCase();
      return ADMIN_DATA.adminProducts.filter(function (product) {
        const status = stockStatus(product);
        const matchesTab = activeTab === 'all' || activeTab === status;
        const matchesQuery = !query || product.name.toLowerCase().includes(query) || product.sku.toLowerCase().includes(query);
        const matchesCategory = !els.category.value || product.category === els.category.value;
        const matchesRoom = !els.room.value || product.room === els.room.value;
        return matchesTab && matchesQuery && matchesCategory && matchesRoom;
      });
    }

    function renderProducts() {
      const rows = filteredProducts();
      const maxPage = Math.max(1, Math.ceil(rows.length / rowsPerPage));
      currentPage = Math.min(currentPage, maxPage);
      const start = (currentPage - 1) * rowsPerPage;
      const visible = rows.slice(start, start + rowsPerPage);
      els.rows.innerHTML = visible.map(function (product) {
        const status = stockStatus(product);
        return [
          '<tr>',
            '<td>' + product.name + '</td>',
            '<td>' + product.sku + '</td>',
            '<td>' + product.stock + '</td>',
            '<td><span class="product-status product-' + status + '">' + statusText(status) + '</span></td>',
            '<td><button class="edit-icon" type="button" data-action="edit-product" data-id="' + product.id + '" aria-label="Sửa sản phẩm">✎</button><button class="delete-icon" type="button" data-action="delete-product" data-id="' + product.id + '" aria-label="Xóa sản phẩm">■</button></td>',
          '</tr>'
        ].join('');
      }).join('');
      els.page.textContent = currentPage;
      els.maxPage.textContent = activeTab === 'all' ? '55' : String(maxPage);
      els.prev.disabled = currentPage === 1;
      els.next.disabled = currentPage === maxPage;
    }

    function renderVariants() {
      els.variantRows.innerHTML = variants.map(function (variant, index) {
        return '<tr><td>' + variant.name + '</td><td>' + variant.count + '</td><td><button class="edit-icon" type="button">✎</button><button class="delete-icon" type="button" data-action="delete-variant" data-index="' + index + '">■</button></td></tr>';
      }).join('');
    }

    function renderMedia() {
      const labels = {
        main: 'Thêm hình ảnh',
        scene: 'Thêm hình ảnh',
        model: 'Thêm mô hình 3D (.glb)',
        material: 'Thêm hình ảnh',
        size: 'Thêm hình ảnh'
      };
      if (mediaTab === 'variant') {
        els.mediaBody.innerHTML = '<div class="variant-media"><button type="button" data-action="back-media">‹</button><strong>Màu sắc</strong><div>Xanh navy</div><div class="media-thumb"></div><div class="upload-box small">▧</div><div>Đỏ</div><div class="media-thumb"></div><div class="upload-box small">▧</div><div>Hồng phấn</div><div class="media-thumb"></div><div class="upload-box small">▧</div><div>Xám</div><div class="media-thumb"></div><div class="upload-box small">▧</div><div>Trắng</div><div class="media-thumb"></div><div class="upload-box small">▧</div></div>';
        return;
      }
      els.mediaBody.innerHTML = '<div class="media-preview"></div><button class="upload-box" type="button"><span>' + (mediaTab === 'model' ? '360' : '▧') + '</span><strong>' + labels[mediaTab] + '</strong></button>';
    }

    function openForm(product) {
      editingId = product ? product.id : null;
      els.listView.hidden = true;
      els.formView.hidden = false;
      document.querySelector('.product-form-title').textContent = product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới';
      document.getElementById('productName').value = product ? product.name : '';
      document.getElementById('productSku').value = product ? product.sku : '';
      document.getElementById('productStock').value = product ? product.stock : 0;
      document.getElementById('productCategory').value = product ? product.category : '';
      document.getElementById('productRoom').value = product ? product.room : '';
      renderVariants();
      renderMedia();
    }

    function closeForm() {
      editingId = null;
      els.formView.hidden = true;
      els.listView.hidden = false;
      els.form.reset();
      renderProducts();
    }

    document.querySelectorAll('[data-stock-tab]').forEach(function (button) {
      button.addEventListener('click', function () {
        document.querySelectorAll('[data-stock-tab]').forEach(function (item) { item.classList.remove('is-active'); });
        button.classList.add('is-active');
        activeTab = button.dataset.stockTab;
        currentPage = 1;
        renderProducts();
      });
    });

    [els.search, els.category, els.room].forEach(function (input) {
      input.addEventListener('input', function () { currentPage = 1; renderProducts(); });
      input.addEventListener('change', function () { currentPage = 1; renderProducts(); });
    });
    els.prev.addEventListener('click', function () { currentPage -= 1; renderProducts(); });
    els.next.addEventListener('click', function () { currentPage += 1; renderProducts(); });
    els.showForm.addEventListener('click', function () { openForm(); });
    els.back.addEventListener('click', closeForm);

    els.rows.addEventListener('click', function (event) {
      const action = event.target.closest('[data-action]');
      if (!action) return;
      const product = ADMIN_DATA.adminProducts.find(function (item) { return item.id === action.dataset.id; });
      if (action.dataset.action === 'edit-product') openForm(product);
      if (action.dataset.action === 'delete-product') {
        confirmDelete('Bạn có chắc chắn muốn xóa sản phẩm này?', function () {
          ADMIN_DATA.adminProducts = ADMIN_DATA.adminProducts.filter(function (item) { return item.id !== action.dataset.id; });
          renderProducts();
        });
      }
    });

    document.getElementById('addVariant').addEventListener('click', function () {
      variants.push({ name: 'Kích thước', count: 4 });
      renderVariants();
    });
    els.variantRows.addEventListener('click', function (event) {
      const action = event.target.closest('[data-action="delete-variant"]');
      if (!action) return;
      confirmDelete('Bạn có chắc chắn muốn xóa biến thể này?', function () {
        variants.splice(Number(action.dataset.index), 1);
        renderVariants();
      });
    });
    document.querySelectorAll('[data-media-tab]').forEach(function (button) {
      button.addEventListener('click', function () {
        document.querySelectorAll('[data-media-tab]').forEach(function (item) { item.classList.remove('is-active'); });
        button.classList.add('is-active');
        mediaTab = button.dataset.mediaTab;
        renderMedia();
      });
    });
    els.mediaBody.addEventListener('click', function (event) {
      if (event.target.closest('[data-action="back-media"]')) {
        mediaTab = 'main';
        document.querySelectorAll('[data-media-tab]').forEach(function (item) { item.classList.toggle('is-active', item.dataset.mediaTab === 'main'); });
        renderMedia();
      }
    });
    els.form.addEventListener('submit', function (event) {
      event.preventDefault();
      const payload = {
        id: editingId || 'SP' + String(Date.now()).slice(-5),
        name: document.getElementById('productName').value || 'Sản phẩm mới',
        sku: document.getElementById('productSku').value || 'SKU-NEW',
        stock: Number(document.getElementById('productStock').value || 0),
        category: document.getElementById('productCategory').value || 'sofa',
        room: document.getElementById('productRoom').value || 'phong-khach'
      };
      if (editingId) {
        const index = ADMIN_DATA.adminProducts.findIndex(function (item) { return item.id === editingId; });
        ADMIN_DATA.adminProducts[index] = payload;
      } else {
        ADMIN_DATA.adminProducts.unshift(payload);
      }
      closeForm();
    });

    renderProducts();
  }

  function initContent() {
    let section = 'home';
    let activeHomeTab = 'banner';
    const els = {
      subtitle: document.getElementById('contentSubtitle'),
      homeView: document.getElementById('homeContentView'),
      roomsView: document.getElementById('roomsContentView'),
      contentHead: document.getElementById('contentHead'),
      contentRows: document.getElementById('contentRows'),
      contentPreview: document.getElementById('contentPreview'),
      roomStrip: document.getElementById('roomStrip'),
      ideaRows: document.getElementById('ideaRows'),
      blogRows: document.getElementById('blogRows'),
      roomPreview: document.getElementById('roomPreview'),
      roomUpload: document.querySelector('.room-upload'),
      roomBannerChoose: document.getElementById('roomBannerChoose'),
      roomBannerInput: document.getElementById('roomBannerInput'),
      formScreen: document.getElementById('contentFormScreen'),
      formBody: document.getElementById('contentFormBody')
    };
    if (!els.contentRows) return;
    const contentNavItem = document.querySelector('.content-nav-item');
    const contentNavToggle = document.querySelector('.content-nav-toggle');

    const homeMeta = {
      banner: { label: 'Banner', button: 'Thêm Banner', form: 'banner', dateColumn: true },
      collections: { label: 'CaraVeso Collections', button: 'Thêm Collection', form: 'collection', dateColumn: false },
      inspirations: { label: 'Nguồn cảm hứng', button: 'Thêm', form: 'inspiration', dateColumn: true }
    };
    const defaultContentImage = 'Image/z8037729213517_6b733c4e3d23a5216813f493449279ae.jpg';

    function iconButtons(type, id) {
      if (type === 'attached') {
        return '<span class="attached-actions"><button class="edit-icon" type="button" aria-label="Sửa sản phẩm">✎</button><button class="delete-icon" type="button" aria-label="Xóa sản phẩm">■</button></span>';
      }
      return '<button class="edit-icon" type="button" data-action="open-content-form" data-form="' + type + '" data-id="' + id + '" aria-label="Sửa">✎</button><button class="delete-icon" type="button" data-action="delete-content" data-type="' + type + '" data-id="' + id + '" aria-label="Xóa">■</button>';
    }

    function productAttachedTable(extraClass, title, rows) {
      const productRows = rows || [
        '<div class="attached-row"><span>1</span><strong>Ghế sofa Milano Shape U</strong><span>#HHT080906</span><span>2 chỗ ngồi, trắng kem</span>' + iconButtons('attached', 'P01') + '</div>'
      ];
      return [
        '<section class="attached-card ' + (extraClass || '') + '">',
          '<div class="attached-head"><h3>' + (title || 'Sản phẩm đính kèm') + '</h3><input type="text" placeholder="Nhập mã sản phẩm"><button type="button">' + (title === 'Danh sách sản phẩm' ? 'Thêm' : 'Thêm sản phẩm') + '</button></div>',
          productRows.join(''),
          '<div class="attached-foot"></div>',
        '</section>'
      ].join('');
    }

    function imagePlaceholder(className, image, label) {
      return '<span class="' + className + '"' + (image ? ' style="background-image:url(' + image + ')"' : '') + '><button type="button" aria-label="Xóa ảnh">×</button>' + (label ? '<small>' + label + '</small>' : '') + '</span>';
    }

    function uploadBox(text, note, compact, image, heading) {
      return [
        '<div class="content-upload ' + (compact ? 'is-compact' : '') + '">',
          heading ? '<div class="current-media"><h3>' + heading + '</h3>' + imagePlaceholder('media-current', image, '') + '</div>' : '<strong>▧</strong>',
          '<div><b>' + text + '</b><small>' + note + '</small></div>',
          '<button type="button" data-action="choose-content-file">Chọn tệp</button>',
          '<input class="content-file-input" type="file" accept="image/png,image/jpeg,image/webp" hidden>',
        '</div>'
      ].join('');
    }

    function findContentItem(type, id) {
      const keyMap = { banner: 'banner', collection: 'collections', inspiration: 'inspirations', idea: 'ideas', blog: 'blogs' };
      if (!id) return null;
      if (type === 'idea' || type === 'blog') return ADMIN_DATA.contentRooms[keyMap[type]].find(function (item) { return item.id === id; }) || null;
      return ADMIN_DATA.contentHome[keyMap[type]].find(function (item) { return item.id === id; }) || null;
    }

    function contentImage(item, useFallback) {
      if (item && item.image) return item.image;
      return useFallback ? defaultContentImage : '';
    }

    function renderWebsitePreview(mode) {
      const inspiration = mode === 'inspirations';
      const collection = mode === 'collections';
      const rows = ADMIN_DATA.contentHome[mode] || [];
      const image = contentImage(rows[rows.length - 1], false);
      const imageStyle = image ? ' style="background-image:url(' + image + ')"' : '';
      return [
        '<div class="site-preview-frame">',
          '<div class="site-preview-top">Chỉ duy nhất 1 lần, tặng voucher 100.000 VNĐ cho khách hàng mới của CaraVeso</div>',
          '<div class="site-preview-nav"><strong>CaraVeso</strong></div>',
          inspiration ? '<h3>Nguồn cảm hứng</h3>' : '',
          '<div class="site-hero ' + (inspiration ? 'is-inspiration' : '') + '"' + imageStyle + '></div>',
          collection ? '<div class="site-hero is-collection"' + imageStyle + '></div>' : '',
          inspiration ? '<div class="site-tile-row"><span></span><span></span></div>' : '',
        '</div>'
      ].join('');
    }

    function renderHome() {
      const rows = ADMIN_DATA.contentHome[activeHomeTab];
      const meta = homeMeta[activeHomeTab];
      document.querySelectorAll('[data-home-tab]').forEach(function (button) {
        button.classList.toggle('is-active', button.dataset.homeTab === activeHomeTab);
      });
      els.contentHead.innerHTML = [
        '<tr>',
          '<th>Số thứ tự</th>',
          '<th>Hình ảnh</th>',
          '<th>' + (meta.dateColumn ? 'Ngày tạo' : 'Tên') + '</th>',
          '<th><button class="content-add-btn" type="button" data-action="open-content-form" data-form="' + meta.form + '">' + meta.button + '</button></th>',
        '</tr>'
      ].join('');
      els.contentRows.innerHTML = rows.map(function (item) {
        return [
          '<tr>',
            '<td>' + item.order + '</td>',
            '<td><span class="content-thumb"><img src="' + contentImage(item, true) + '" alt="' + meta.label + ' ' + item.order + '"></span></td>',
            '<td>' + (meta.dateColumn ? item.createdAt : item.name) + '</td>',
            '<td>' + iconButtons(meta.form, item.id) + '</td>',
          '</tr>'
        ].join('');
      }).join('');
      els.contentPreview.innerHTML = renderWebsitePreview(activeHomeTab);
    }

    function renderRooms() {
      const roomImages = [
        'Image/z8037741154588_26b826cdcfe77255681eae7d64d9a377.jpg',
        'Image/z8037741541942_92f7e62b519dd56098b68bcc8935925a.jpg',
        'Image/z8037741967697_3c18c047a31876f640e07af0b38112e7.jpg'
      ];
      const bannerImage = ADMIN_DATA.contentRooms.banner || roomImages[0];
      function roomImage(item, index) {
        return item && item.image ? item.image : roomImages[index % roomImages.length];
      }
      if (els.roomUpload) {
        els.roomUpload.classList.add('has-image');
        els.roomUpload.style.backgroundImage = 'url(' + bannerImage + ')';
      }
      els.roomStrip.innerHTML = ADMIN_DATA.contentRooms.rooms.map(function (room) {
        return '<button class="room-tile" type="button"><span><img src="' + roomImage(room, 0) + '" alt="' + room.name + '"></span><strong>' + room.name + '</strong></button>';
      }).join('');
      els.ideaRows.innerHTML = ADMIN_DATA.contentRooms.ideas.map(function (item) {
        return '<tr><td>' + item.order + '</td><td><span class="content-thumb small"><img src="' + roomImage(item, item.order - 1) + '" alt="' + item.name + '"></span></td><td><strong>' + item.name + '</strong></td><td>' + iconButtons('idea', item.id) + '</td></tr>';
      }).join('');
      els.blogRows.innerHTML = ADMIN_DATA.contentRooms.blogs.map(function (item) {
        return '<tr><td>' + item.order + '</td><td><strong>' + item.name + '</strong></td><td>' + item.date + '</td><td>' + item.status + '</td><td>' + iconButtons('blog', item.id) + '</td></tr>';
      }).join('');
      els.roomPreview.innerHTML = '<div class="site-preview-frame room-site"><div class="site-preview-top">Chỉ duy nhất 1 lần, tặng voucher 100.000 VNĐ cho khách hàng mới của CaraVeso</div><div class="site-preview-nav"><strong>CaraVeso</strong></div><div class="site-hero" style="background-image:url(' + bannerImage + ')"></div><div class="site-tile-row"><span style="background-image:url(' + roomImages[0] + ')"></span><span style="background-image:url(' + roomImages[1] + ')"></span><span style="background-image:url(' + roomImages[2] + ')"></span></div></div>';
    }

    function updateRoomBanner(file) {
      if (!file || !file.type || !file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.addEventListener('load', function () {
        ADMIN_DATA.contentRooms.banner = reader.result;
        renderRooms();
      });
      reader.readAsDataURL(file);
    }

    function updateContentFormImage(input) {
      const form = input.closest('.content-form');
      const file = input.files && input.files[0];
      if (!form || !file || !file.type || !file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.addEventListener('load', function () {
        const image = reader.result;
        const upload = input.closest('.content-upload');
        const preview = upload && upload.querySelector('.media-current');
        form.dataset.uploadedImage = image;
        if (preview) {
          preview.style.backgroundImage = 'url(' + image + ')';
        }
      });
      reader.readAsDataURL(file);
    }

    function saveContentForm(form) {
      const type = form.dataset.submitForm;
      const editId = form.dataset.editId;
      const uploadedImage = form.dataset.uploadedImage;
      const existingItem = findContentItem(type, editId);
      const image = uploadedImage || (existingItem && existingItem.image) || defaultContentImage;

      if (existingItem) {
        existingItem.image = image;
        if (type === 'collection') {
          existingItem.name = form.querySelector('[name="name"]').value || existingItem.name;
        }
        return;
      }

      if (type === 'banner') {
        ADMIN_DATA.contentHome.banner.push({ id: 'BN' + Date.now(), order: ADMIN_DATA.contentHome.banner.length + 1, createdAt: '09/07/2026', image: image });
        activeHomeTab = 'banner';
      }
      if (type === 'inspiration') {
        ADMIN_DATA.contentHome.inspirations.push({ id: 'IN' + Date.now(), order: ADMIN_DATA.contentHome.inspirations.length + 1, createdAt: '09/07/2026', image: image });
        activeHomeTab = 'inspirations';
      }
      if (type === 'collection') {
        ADMIN_DATA.contentHome.collections.push({ id: 'CL' + Date.now(), order: ADMIN_DATA.contentHome.collections.length + 1, name: form.querySelector('[name="name"]').value || 'Collection mới', image: image });
        activeHomeTab = 'collections';
      }
      if (type === 'idea') {
        ADMIN_DATA.contentRooms.ideas.push({ id: 'IDEA' + Date.now(), order: ADMIN_DATA.contentRooms.ideas.length + 1, name: 'Minimalist (Tối giản)', image: image });
      }
      if (type === 'blog') {
        ADMIN_DATA.contentRooms.blogs.push({ id: 'BLOG' + Date.now(), order: ADMIN_DATA.contentRooms.blogs.length + 1, name: 'CaraVeso hiểu và trân trọng giấc ngủ của bạn', date: '09/07/2026', status: 'Đã đăng' });
      }
    }

    function setSection(nextSection) {
      section = nextSection;
      els.homeView.hidden = section !== 'home';
      els.roomsView.hidden = section !== 'rooms';
      els.subtitle.textContent = section === 'home' ? 'Trang chủ' : 'Các phòng';
      document.querySelectorAll('[data-content-section]').forEach(function (link) {
        link.classList.toggle('is-sub-active', link.dataset.contentSection === section);
      });
      if (section === 'home') renderHome();
      else renderRooms();
    }

    function closeForm() {
      els.formScreen.hidden = true;
      els.formBody.innerHTML = '';
      if (section === 'home') renderHome();
      else renderRooms();
    }

    function formActions(label) {
      return '<div class="content-form-actions"><button class="action-btn secondary content-form-cancel" type="button">Quay lại</button><button class="action-btn" type="submit">' + label + '</button></div>';
    }

    function openForm(type, id) {
      els.formScreen.hidden = false;
      const item = findContentItem(type, id);
      const isEdit = Boolean(item);
      const itemImage = contentImage(item, true);
      const titleMap = {
        banner: isEdit ? 'Chỉnh sửa Banner' : 'Thêm Banner mới',
        inspiration: isEdit ? 'Chỉnh sửa Nguồn cảm hứng' : 'Thêm Nguồn cảm hứng',
        collection: isEdit ? 'Chỉnh sửa Collections' : 'Thêm Collections mới',
        idea: isEdit ? 'Chỉnh sửa ý tưởng' : 'Thêm ý tưởng',
        blog: isEdit ? 'Chỉnh sửa Blog' : 'Thêm Blog'
      };
      let html = '<form class="content-form content-form--' + type + '" data-submit-form="' + type + '" data-edit-id="' + (id || '') + '"><h2 class="content-form-title">' + titleMap[type] + '</h2>';
      if (type === 'banner') {
        html += uploadBox('Chọn ảnh mới (nếu muốn thay đổi)', '', false, itemImage, 'Banner hiện tại') + productAttachedTable('', 'Sản phẩm đính kèm') + formActions(isEdit ? 'Cập nhật' : 'Thêm');
      }
      if (type === 'inspiration') {
        html += '<div class="inspiration-edit-grid">' + uploadBox('', '', true, itemImage, 'Ảnh hiện tại') + productAttachedTable('', 'Sản phẩm đính kèm') + '</div>' + formActions(isEdit ? 'Cập nhật' : 'Thêm');
      }
      if (type === 'collection') {
        html += '<div class="collection-fields"><label>Tên Collections:<input type="text" name="name" value="' + (item ? item.name : '') + '" placeholder="Nhập tên Collection"></label><label>Slogan:<textarea maxlength="40" placeholder="Nhập Slogan cho Collection">Đa dạng lựa chọn, vẻ đẹp sang trọng</textarea><small>0/40</small></label></div>';
        html += uploadBox('Kéo thả hình ảnh vào đây (1440px x 679px)', 'Định dạng: JPG, PNG (tối đa 20MB/tệp)', false, itemImage, 'Ảnh hiện tại') + productAttachedTable('', 'Sản phẩm đính kèm');
        html += '<label class="wide-field">Mô tả:<textarea maxlength="500" placeholder="Nhập mô tả cho Collections">Bộ sưu tập nội thất phòng khách hiện đại và sang trọng.</textarea><small>0/500</small></label>';
        html += '<div class="collection-bottom"><section><h3>Sản phẩm trong Collections (2/3)<b>*</b></h3><div class="collection-images">' + imagePlaceholder('collection-shot', defaultContentImage, '') + imagePlaceholder('collection-shot', defaultContentImage, '') + '<button type="button">▧<small>Thêm hình ảnh</small></button></div></section>' + productAttachedTable('product-list', 'Danh sách sản phẩm', ['<div class="attached-row"><span>1</span><strong>Ghế sofa Milano Shape U</strong><span>#HHT080906</span>' + iconButtons('attached', 'P01') + '</div>', '<div class="attached-row"><span>2</span><strong>Ghế sofa Milano Shape U</strong><span>#HHT080906</span>' + iconButtons('attached', 'P02') + '</div>']) + '</div>' + formActions(isEdit ? 'Cập nhật' : 'Thêm');
      }
      if (type === 'idea') {
        html += '<div class="idea-form-grid"><label>Tên phong cách:<input type="text" value="' + (item ? item.name : 'Minimalist (Tối giản)') + '" placeholder="Nhập tên phong cách"></label><label>Slogan:<input type="text" value="Minimalist (Tối giản)" placeholder="Nhập slogan"></label><label class="wide-field">Mô tả đơn giản:<textarea maxlength="40" placeholder="Nhập mô tả">Minimalist (Tối giản)</textarea><small>0/40</small></label><section><h3>Hình ảnh mô tả</h3>' + imagePlaceholder('mini-upload has-image', itemImage, '') + '<button class="file-choice" type="button">Chọn tệp</button></section></div>';
        html += '<h3>Banner:</h3>' + imagePlaceholder('banner-upload has-image', itemImage, '') + '<h3>Hình ảnh về phong cách:</h3><div class="triple-upload">' + imagePlaceholder('style-shot', defaultContentImage, '') + imagePlaceholder('style-shot', defaultContentImage, '') + imagePlaceholder('style-shot', defaultContentImage, '') + '</div>' + productAttachedTable('', 'Sản phẩm đính kèm') + productAttachedTable('product-list narrow', 'Danh sách sản phẩm', ['<div class="attached-row"><span>1</span><strong>Ghế sofa Milano Shape U</strong><span>#HHT080906</span>' + iconButtons('attached', 'P01') + '</div>', '<div class="attached-row"><span>2</span><strong>Ghế sofa Milano Shape U</strong><span>#HHT080906</span>' + iconButtons('attached', 'P02') + '</div>']) + formActions(isEdit ? 'Cập nhật' : 'Thêm');
      }
      if (type === 'blog') {
        html += '<div class="blog-form-grid"><label>Tiêu đề:<input type="text" name="blogName" value="' + (item ? item.name : 'CaraVeso hiểu và trân trọng giấc ngủ của bạn') + '" placeholder="Nhập tiêu đề"></label><label class="wide-field">Mô tả:<textarea maxlength="500" placeholder="Nhập mô tả">CaraVeso hiểu và trân trọng giấc ngủ của bạn</textarea><small>0/500</small></label><fieldset><legend>Chọn bố cục:</legend><label><input type="radio" name="layout" checked> Bố cục 1</label><label><input type="radio" name="layout"> Bố cục 2</label></fieldset></div>';
        html += '<div class="blog-media-row"><div><h3>Hiện tại</h3><div class="blog-upload-grid">' + imagePlaceholder('blog-big', defaultContentImage, '') + '<div>' + imagePlaceholder('blog-small', defaultContentImage, '') + imagePlaceholder('blog-small', defaultContentImage, '') + '</div></div></div><div class="blog-new-media"><button type="button">Chọn tệp</button><strong>Chọn ảnh mới (nếu muốn thay đổi)</strong></div></div>' + productAttachedTable() + formActions(isEdit ? 'Cập nhật' : 'Thêm');
      }
      els.formBody.innerHTML = html + '</form>';
    }

    function deleteContent(type, id) {
      const keyMap = { banner: 'banner', collection: 'collections', inspiration: 'inspirations', idea: 'ideas', blog: 'blogs' };
      if (type === 'idea' || type === 'blog') {
        ADMIN_DATA.contentRooms[keyMap[type]] = ADMIN_DATA.contentRooms[keyMap[type]].filter(function (item) { return item.id !== id; });
        renderRooms();
      } else {
        ADMIN_DATA.contentHome[keyMap[type]] = ADMIN_DATA.contentHome[keyMap[type]].filter(function (item) { return item.id !== id; });
        renderHome();
      }
    }

    document.querySelectorAll('[data-content-section]').forEach(function (link) {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        setSection(link.dataset.contentSection);
      });
    });
    if (contentNavToggle && contentNavItem) {
      contentNavToggle.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        const isOpen = contentNavItem.classList.toggle('is-open');
        contentNavToggle.setAttribute('aria-expanded', String(isOpen));
      });
    }
    if (els.roomBannerChoose && els.roomBannerInput) {
      els.roomBannerChoose.addEventListener('click', function () {
        els.roomBannerInput.click();
      });
      els.roomBannerInput.addEventListener('change', function () {
        updateRoomBanner(els.roomBannerInput.files[0]);
      });
    }
    if (els.roomUpload) {
      els.roomUpload.addEventListener('dragover', function (event) {
        event.preventDefault();
        els.roomUpload.classList.add('is-dragging');
      });
      els.roomUpload.addEventListener('dragleave', function () {
        els.roomUpload.classList.remove('is-dragging');
      });
      els.roomUpload.addEventListener('drop', function (event) {
        event.preventDefault();
        els.roomUpload.classList.remove('is-dragging');
        updateRoomBanner(event.dataTransfer.files[0]);
      });
    }
    document.querySelectorAll('[data-home-tab]').forEach(function (button) {
      button.addEventListener('click', function () {
        activeHomeTab = button.dataset.homeTab;
        renderHome();
      });
    });
    document.addEventListener('click', function (event) {
      const action = event.target.closest('[data-action]');
      if (!action) return;
      if (action.dataset.action === 'open-content-form') openForm(action.dataset.form, action.dataset.id);
      if (action.dataset.action === 'close-content-form') closeForm();
      if (action.dataset.action === 'choose-content-file') {
        const upload = action.closest('.content-upload');
        const input = upload && upload.querySelector('.content-file-input');
        if (input) input.click();
      }
      if (action.dataset.action === 'delete-content') {
        confirmDelete('Bạn có chắc chắn muốn xóa nội dung này?', function () {
          deleteContent(action.dataset.type, action.dataset.id);
        });
      }
    });
    els.formScreen.addEventListener('click', function (event) {
      if (event.target.classList.contains('content-form-cancel')) closeForm();
    });
    els.formScreen.addEventListener('change', function (event) {
      if (event.target.classList.contains('content-file-input')) updateContentFormImage(event.target);
    });
    els.formScreen.addEventListener('submit', function (event) {
      event.preventDefault();
      saveContentForm(event.target);
      closeForm();
    });

    setSection('home');
  }

  function initCategories() {
    const rowsPerPage = 11;
    let currentPage = 1;
    let editingId = null;
    let deleteId = null;
    const expanded = new Set(['rooms', 'products-root', 'chairs']);
    const tableExpanded = new Set(['work-room']);
    const els = {
      tree: document.getElementById('categoryTree'), rows: document.getElementById('categoryRows'), pager: document.getElementById('categoryPager'),
      search: document.getElementById('categorySearchInput'), quantity: document.getElementById('categoryQuantityInput'), level: document.getElementById('categoryLevelFilter'),
      drawer: document.getElementById('categoryDrawer'), form: document.getElementById('categoryForm'), title: document.getElementById('categoryFormTitle'), submit: document.getElementById('categorySubmit'),
      showForm: document.getElementById('showCategoryForm'), closeForm: document.getElementById('closeCategoryForm'), editSummary: document.getElementById('categoryEditSummary'), editingName: document.getElementById('categoryEditingName'),
      name: document.getElementById('categoryName'), formLevel: document.getElementById('categoryLevel'), parent: document.getElementById('categoryParent'), formQuantity: document.getElementById('categoryQuantity'),
      confirm: document.getElementById('categoryConfirm'), cancelDelete: document.getElementById('cancelDeleteCategory'), confirmDelete: document.getElementById('confirmDeleteCategory')
    };
    if (!els.rows) return;
    function childrenOf(parentId) { return ADMIN_DATA.categories.filter(function (item) { return item.parentId === parentId; }); }
    function categoryById(id) { return ADMIN_DATA.categories.find(function (item) { return item.id === id; }); }
    function flatten(parentId, output) { childrenOf(parentId).forEach(function (item) { output.push(item); if (expanded.has(item.id)) flatten(item.id, output); }); return output; }
    function descendantIds(id) { return childrenOf(id).reduce(function (ids, child) { ids.push(child.id); return ids.concat(descendantIds(child.id)); }, []); }
    function renderTree() {
      function html(item) {
        const children = childrenOf(item.id);
        const open = expanded.has(item.id);
        if (!children.length) return '<div class="tree-row is-leaf" style="--depth:' + item.level + '">' + item.name + '</div>';
        return '<div class="tree-node"><button class="tree-row ' + (open ? 'is-open' : '') + '" type="button" data-action="toggle-tree" data-id="' + item.id + '" style="--depth:' + item.level + '"><span class="tree-toggle"></span><span class="folder-mark"></span>' + item.name + '</button>' + (open ? '<div class="tree-children" style="--depth:' + item.level + '">' + children.map(html).join('') + '</div>' : '') + '</div>';
      }
      els.tree.innerHTML = childrenOf(null).map(html).join('');
    }
    function filteredCategories() {
      const query = els.search.value.trim().toLowerCase();
      const quantity = els.quantity.value === '' ? null : Number(els.quantity.value);
      return flatten(null, []).filter(function (item) {
        return (!query || item.name.toLowerCase().includes(query)) && (quantity === null || item.quantity === quantity) && (!els.level.value || String(item.level) === els.level.value);
      });
    }
    function rowHtml(item, includeChildren) {
      const children = childrenOf(item.id);
      const open = tableExpanded.has(item.id);
      return '<tr><td><div class="category-name-cell ' + (item.level === 2 ? 'is-child' : '') + '">' +
        (children.length ? '<button class="category-expand ' + (open ? 'is-open' : '') + '" type="button" data-action="toggle-table" data-id="' + item.id + '"></button>' : '<span class="category-expand" style="visibility:hidden"></span>') +
        (item.level < 2 ? '<span class="folder-mark"></span>' : '') + '<span>' + item.name + '</span></div></td><td>Cấp ' + item.level + '</td><td>' + item.quantity + '</td><td class="category-actions-cell"><button class="edit-icon" type="button" data-action="edit-category" data-id="' + item.id + '" aria-label="Sửa">✎</button><button class="delete-icon" type="button" data-action="ask-delete-category" data-id="' + item.id + '" aria-label="Xóa">■</button></td></tr>' +
        (includeChildren && open ? children.map(function (child) { return rowHtml(child, true); }).join('') : '');
    }
    function renderTable() {
      const hasFilter = els.search.value.trim() || els.quantity.value !== '' || els.level.value;
      const rows = hasFilter ? filteredCategories() : ADMIN_DATA.categories.filter(function (item) { return item.level === 1; });
      const maxPage = Math.max(1, Math.ceil(rows.length / rowsPerPage));
      currentPage = Math.min(currentPage, maxPage);
      els.rows.innerHTML = rows.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage).map(function (item) { return rowHtml(item, !hasFilter); }).join('');
      let pager = '<button type="button" data-action="page-prev" ' + (currentPage === 1 ? 'disabled' : '') + '>‹</button>';
      for (let i = 1; i <= maxPage; i += 1) pager += '<button class="' + (i === currentPage ? 'is-active' : '') + '" type="button" data-action="page" data-page="' + i + '">' + i + '</button>';
      els.pager.innerHTML = pager + '<button type="button" data-action="page-next" ' + (currentPage === maxPage ? 'disabled' : '') + '>›</button>';
    }
    function renderParentOptions(selected) {
      const level = Number(els.formLevel.value);
      const blocked = editingId ? descendantIds(editingId).concat([editingId]) : [];
      const parents = ADMIN_DATA.categories.filter(function (item) { return item.level === level - 1 && !blocked.includes(item.id); });
      els.parent.innerHTML = level === 0 ? '<option value="">Không có danh mục cha</option>' : parents.map(function (item) { return '<option value="' + item.id + '">' + item.name + '</option>'; }).join('');
      els.parent.disabled = level === 0;
      els.parent.required = level !== 0;
      els.parent.value = level === 0 ? '' : (selected || (parents[0] && parents[0].id) || '');
    }
    function openForm(category) {
      editingId = category ? category.id : null;
      els.form.reset();
      els.title.textContent = category ? 'Chỉnh sửa danh mục' : 'Thêm danh mục';
      els.submit.textContent = category ? 'Cập nhật' : 'Thêm';
      els.editSummary.hidden = true;
      els.editingName.textContent = category ? category.name : '';
      els.formLevel.innerHTML = '<option value="0">Cấp 0</option><option value="1">Cấp 1</option><option value="2">Cấp 2</option>';
      els.name.value = category ? category.name : '';
      els.formLevel.value = category ? category.level : 0;
      els.formQuantity.value = category ? category.quantity : '';
      renderParentOptions(category ? category.parentId : 'rooms');
      els.drawer.hidden = false;
    }
    function closeForm() { editingId = null; els.drawer.hidden = true; }
    function syncAll() { renderTree(); renderTable(); }
    els.tree.addEventListener('click', function (event) { const action = event.target.closest('[data-action="toggle-tree"]'); if (!action) return; expanded.has(action.dataset.id) ? expanded.delete(action.dataset.id) : expanded.add(action.dataset.id); renderTree(); });
    els.rows.addEventListener('click', function (event) { const action = event.target.closest('[data-action]'); if (!action) return; if (action.dataset.action === 'toggle-table') { tableExpanded.has(action.dataset.id) ? tableExpanded.delete(action.dataset.id) : tableExpanded.add(action.dataset.id); renderTable(); } if (action.dataset.action === 'edit-category') openForm(categoryById(action.dataset.id)); if (action.dataset.action === 'ask-delete-category') { deleteId = action.dataset.id; els.confirm.hidden = false; } });
    els.pager.addEventListener('click', function (event) { const action = event.target.closest('[data-action]'); if (!action) return; if (action.dataset.action === 'page-prev') currentPage -= 1; if (action.dataset.action === 'page-next') currentPage += 1; if (action.dataset.action === 'page') currentPage = Number(action.dataset.page); renderTable(); });
    [els.search, els.quantity, els.level].forEach(function (input) { input.addEventListener('input', function () { currentPage = 1; renderTable(); }); input.addEventListener('change', function () { currentPage = 1; renderTable(); }); });
    els.showForm.addEventListener('click', function () { openForm(); });
    els.closeForm.addEventListener('click', closeForm);
    els.formLevel.addEventListener('change', function () { renderParentOptions(''); });
    els.form.addEventListener('submit', function (event) { event.preventDefault(); const level = Number(els.formLevel.value); const payload = { id: editingId || 'category-' + Date.now(), name: els.name.value.trim(), level: level, parentId: level === 0 ? null : els.parent.value, quantity: Number(els.formQuantity.value) }; if (!payload.name || Number.isNaN(payload.quantity) || payload.quantity < 0) return; if (editingId) ADMIN_DATA.categories[ADMIN_DATA.categories.findIndex(function (item) { return item.id === editingId; })] = payload; else ADMIN_DATA.categories.push(payload); if (payload.parentId) expanded.add(payload.parentId); closeForm(); syncAll(); });
    els.cancelDelete.addEventListener('click', function () { deleteId = null; els.confirm.hidden = true; });
    els.confirmDelete.addEventListener('click', function () { const ids = [deleteId].concat(descendantIds(deleteId)); ADMIN_DATA.categories = ADMIN_DATA.categories.filter(function (item) { return !ids.includes(item.id); }); deleteId = null; els.confirm.hidden = true; currentPage = 1; syncAll(); });
    syncAll();
  }

  if (page === 'payment') initPayment();
  else if (page === 'orders') initOrders();
  else if (page === 'customers') initCustomers();
  else if (page === 'products') initProducts();
  else if (page === 'categories') initCategories();
  else if (page === 'content') initContent();
  else initDashboard();
})();

