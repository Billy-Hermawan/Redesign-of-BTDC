/* Confirmation page — renders order summary from localStorage */

(function () {
  const FULL_MONTHS = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];

  const ORDER_PREFIXES = {
    'puppy-preschool':      'PP',
    'family-dog-training-1': 'FDT'
  };

  function generateOrderNum(courseKey) {
    const prefix = ORDER_PREFIXES[courseKey] || 'ORD';
    const num = Math.floor(1000 + Math.random() * 9000);
    return prefix + num;
  }

  function formatDate(date) {
    if (!date) return '';
    return `${FULL_MONTHS[date.month]} ${date.day}, ${date.year}`;
  }

  // ── Render ──────────────────────────────────────────────────────────
  const cardsEl = document.getElementById('confirmation-cards');
  const order   = JSON.parse(localStorage.getItem('lastOrder'));

  if (!order || !order.items || order.items.length === 0) {
    cardsEl.innerHTML = `
      <p class="confirmation-empty">
        No order found. <a href="../index.html">Go home →</a>
      </p>`;
    return;
  }

  order.items.forEach(item => {
    const orderNum   = generateOrderNum(item.course);
    const dateStr    = formatDate(item.date);
    const timeStr    = item.time  || '—';
    const courseName = item.name  || item.course;
    const image      = item.image || '../assets/images/training-1.png';

    const card = document.createElement('div');
    card.className = 'confirmation-card';
    card.innerHTML = `
      <p class="confirmation-card-title">Order Confirmed (${courseName}) x1</p>
      <div class="confirmation-card-divider"></div>
      <div class="confirmation-card-body">
        <img src="${image}" alt="${courseName}" class="confirmation-card-img">
        <div class="confirmation-card-details">
          <div class="confirmation-detail">
            <img src="../assets/icons/hash.png"       alt="" class="confirmation-detail-icon">
            <span>${orderNum}</span>
          </div>
          <div class="confirmation-detail">
            <img src="../assets/icons/location.png"   alt="" class="confirmation-detail-icon">
            <span>15 Englefield Rd,<br>Oxley QLD 4075</span>
          </div>
          <div class="confirmation-detail">
            <img src="../assets/icons/time-black.png" alt="" class="confirmation-detail-icon">
            <span>${timeStr}</span>
          </div>
          <div class="confirmation-detail">
            <img src="../assets/icons/calendar.png"   alt="" class="confirmation-detail-icon">
            <span>${dateStr}</span>
          </div>
        </div>
      </div>
    `;
    cardsEl.appendChild(card);
  });
})();
