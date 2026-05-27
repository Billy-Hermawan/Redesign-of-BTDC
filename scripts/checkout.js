/* Checkout — cart display, payment, form validation */

(function () {
  // ── Course data ─────────────────────────────────────────────────────
  const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  const COURSES = {
    'puppy-preschool': {
      name: 'Puppy Preschool',
      price: 100,
      image: '../assets/images/training-1.png'
    },
    'family-dog-training-1': {
      name: 'Family Dog Training 1',
      price: 120,
      image: '../assets/images/training-2.png'
    }
  };

  // ── Elements ────────────────────────────────────────────────────────
  const itemsEl      = document.getElementById('checkout-items');
  const totalEl      = document.getElementById('checkout-total');
  const payAmountEl  = document.getElementById('pay-amount');
  const taxNoteEl    = document.getElementById('checkout-tax-note');
  const discountRow  = document.getElementById('checkout-discount-row');
  const totalDivider = document.getElementById('checkout-total-divider');
  const totalRow     = document.getElementById('checkout-total-row');
  const payBtn       = document.getElementById('checkout-pay-btn');

  // ── Cart ────────────────────────────────────────────────────────────
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let isFreeOrder = false;

  // ── Render cart items ───────────────────────────────────────────────
  function renderCart() {
    if (cart.length === 0) {
      itemsEl.innerHTML = `
        <div class="checkout-empty">
          <p>Your cart is empty.</p>
          <a href="../index.html#courses" class="checkout-browse-link">Browse Courses →</a>
        </div>
      `;
      if (discountRow)  discountRow.style.display  = 'none';
      if (totalDivider) totalDivider.style.display = 'none';
      if (totalRow)     totalRow.style.display     = 'none';
      if (payBtn)       payBtn.disabled = true;
      return;
    }

    let html = '';
    let subtotal = 0;

    cart.forEach((item, i) => {
      const data = COURSES[item.course] || {
        name: item.course,
        price: 0,
        image: '../assets/images/training-1.png'
      };
      subtotal += data.price;

      const dateStr = item.date
        ? `${item.date.day} ${MONTH_NAMES[item.date.month]} ${item.date.year}`
        : '';
      const timeStr = item.time || '';
      const dateDisplay = dateStr
        ? `<p class="checkout-item-date">${dateStr}${timeStr ? ' · ' + timeStr : ''}</p>`
        : '';

      html += `
        <div class="checkout-item">
          <img src="${data.image}" alt="${data.name}" class="checkout-item-img">
          <div class="checkout-item-info">
            <p class="checkout-item-name">${data.name}</p>
            ${dateDisplay}
            <p class="checkout-item-price">$${data.price}</p>
          </div>
          <button class="checkout-item-remove" data-index="${i}" aria-label="Remove">✕</button>
        </div>
      `;
    });

    itemsEl.innerHTML = html;
    updateTotals(subtotal);

    // Remove buttons
    itemsEl.querySelectorAll('.checkout-item-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        cart.splice(parseInt(btn.dataset.index), 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateBadge();
        renderCart();
      });
    });
  }

  function updateTotals(subtotal) {
    // Tax is included in course prices (5% of subtotal displayed separately)
    const tax = Math.round(subtotal * 0.05);
    if (totalEl)     totalEl.textContent    = `$${subtotal}`;
    if (payAmountEl) payAmountEl.textContent = subtotal;
    if (taxNoteEl)   taxNoteEl.textContent  = `Including $${tax} in taxes`;
  }

  function updateBadge() {
    const badge = document.getElementById('cart-badge');
    if (!badge) return;
    if (cart.length > 0) {
      badge.textContent = cart.length;
      badge.classList.add('visible');
    } else {
      badge.textContent = '';
      badge.classList.remove('visible');
    }
  }

  renderCart();

  // ── Payment method toggle ───────────────────────────────────────────
  const cardFields     = document.getElementById('card-fields');
  const bankFields     = document.getElementById('bank-fields');
  const transferFields = document.getElementById('transfer-fields');

  document.querySelectorAll('input[name="payment-method"]').forEach(radio => {
    radio.addEventListener('change', () => {
      if (cardFields)     cardFields.style.display     = radio.value === 'card'     ? '' : 'none';
      if (bankFields)     bankFields.style.display     = radio.value === 'bank'     ? '' : 'none';
      if (transferFields) transferFields.style.display = radio.value === 'transfer' ? '' : 'none';
    });
  });

  // ── Card number — auto-space every 4 digits ─────────────────────────
  const cardInput = document.getElementById('card-number');
  if (cardInput) {
    cardInput.addEventListener('input', () => {
      const raw = cardInput.value.replace(/\D/g, '').slice(0, 16);
      cardInput.value = raw.replace(/(.{4})/g, '$1 ').trim();
    });
  }

  // ── Expiry — auto-insert slash ──────────────────────────────────────
  const expiryInput = document.getElementById('expiry');
  if (expiryInput) {
    expiryInput.addEventListener('input', () => {
      let val = expiryInput.value.replace(/\D/g, '').slice(0, 4);
      if (val.length >= 3) val = val.slice(0, 2) + '/' + val.slice(2);
      expiryInput.value = val;
    });
  }

  // ── Discount code ───────────────────────────────────────────────────
  const discountBtn   = document.getElementById('discount-btn');
  const discountInput = document.getElementById('discount-input');
  if (discountBtn && discountInput) {
    discountBtn.addEventListener('click', () => {
      const code = discountInput.value.trim().toUpperCase();
      if (code === 'BDTC10') {
        discountBtn.textContent = 'Applied ✓';
        discountBtn.disabled    = true;
        discountInput.disabled  = true;
        discountInput.style.borderColor = 'var(--color-primary)';
      } else if (code === 'FREE') {
        isFreeOrder = true;
        discountBtn.textContent = 'Applied ✓';
        discountBtn.disabled    = true;
        discountInput.disabled  = true;
        discountInput.style.borderColor = 'var(--color-primary)';
        updateTotals(0);
      } else {
        discountInput.style.borderColor = '#e05a5a';
        setTimeout(() => { discountInput.style.borderColor = ''; }, 1800);
      }
    });
  }

  // ── Form submission ─────────────────────────────────────────────────
  function flagInvalid(id) {
    const el = document.getElementById(id);
    if (el && !el.value.trim()) {
      el.style.borderColor = '#e05a5a';
      setTimeout(() => { el.style.borderColor = ''; }, 2000);
      return true;
    }
    return false;
  }

  if (payBtn) {
    payBtn.addEventListener('click', () => {
      if (cart.length === 0) return;

      // FREE code — skip all validation and go straight to confirmation
      if (isFreeOrder) {
        localStorage.setItem('lastOrder', JSON.stringify({
          items: cart.map(item => ({ ...item, ...(COURSES[item.course] || {}) })),
          subtotal: 0,
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          paymentMethod: 'free',
          orderedAt: new Date().toISOString()
        }));
        localStorage.removeItem('cart');
        window.location.href = 'confirmation.html';
        return;
      }

      let hasError = false;
      ['first-name', 'last-name', 'email', 'phone'].forEach(id => {
        if (flagInvalid(id)) hasError = true;
      });

      const method = document.querySelector('input[name="payment-method"]:checked')?.value;
      if (method === 'card') {
        ['card-number', 'expiry', 'cvv'].forEach(id => {
          if (flagInvalid(id)) hasError = true;
        });
      } else if (method === 'bank') {
        ['bsb', 'account-number'].forEach(id => {
          if (flagInvalid(id)) hasError = true;
        });
      }

      if (hasError) return;

      // Save order and clear cart
      const subtotal = cart.reduce((sum, item) => {
        return sum + (COURSES[item.course]?.price || 0);
      }, 0);

      localStorage.setItem('lastOrder', JSON.stringify({
        items: cart.map(item => ({ ...item, ...(COURSES[item.course] || {}) })),
        subtotal,
        firstName: document.getElementById('first-name').value,
        lastName:  document.getElementById('last-name').value,
        email:     document.getElementById('email').value,
        phone:     document.getElementById('phone').value,
        paymentMethod: method,
        orderedAt: new Date().toISOString()
      }));

      localStorage.removeItem('cart');
      window.location.href = 'confirmation.html';
    });
  }

  // ── Left panel collapse toggle (desktop) ────────────────────────────
  const toggleBtn  = document.getElementById('checkout-toggle-btn');
  const toggleIcon = document.getElementById('checkout-toggle-icon');
  const leftPanel  = document.getElementById('checkout-left');

  if (toggleBtn && leftPanel) {
    toggleBtn.addEventListener('click', () => {
      leftPanel.classList.toggle('collapsed');
      if (toggleIcon) toggleIcon.classList.toggle('flipped');
    });
  }

})();
