/* ============================================================
   Leather Queen Footwear — Store Core Logic
   Products · Cart · Checkout · Orders · RTO Engine
   Two-Tier Collections: Executive (Emerald) + Regular (Terracotta)
   ============================================================ */

'use strict';

/* ============================================================
   1. PRODUCT DATA — Ladies Footwear (Heels, Sandals, Party Wear)
   ============================================================ */
/* Products, prices, stock and store settings come from the server
   (managed in the Admin Panel). Loaded synchronously so every page script
   can use PRODUCTS immediately, exactly like before. */
function leatherqueenApiBase() {
  if (location.protocol === 'file:') return 'http://localhost:5000';
  return '';
}
const LEATHER_QUEEN_BOOT = (function () {
  try {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', leatherqueenApiBase() + '/api/bootstrap', false);
    xhr.send(null);
    if (xhr.status === 200) return JSON.parse(xhr.responseText);
  } catch (e) { /* server unreachable */ }
  return null;
})();
const LEATHER_QUEEN_SETTINGS = (LEATHER_QUEEN_BOOT && LEATHER_QUEEN_BOOT.settings) || null;
const PRODUCTS = (LEATHER_QUEEN_BOOT && LEATHER_QUEEN_BOOT.products) || [];
if (!LEATHER_QUEEN_BOOT) console.error('LEATHER QUEEN: store server se connect nahi ho saka.');

/* ============================================================
   2. PAKISTAN CITIES (250+)
   ============================================================ */
const PK_CITIES = [
  'Karachi','Lahore','Islamabad','Rawalpindi','Faisalabad','Multan','Peshawar','Quetta',
  'Gujranwala','Sialkot','Bahawalpur','Sargodha','Sukkur','Larkana','Sheikhupura',
  'Rahim Yar Khan','Jhang','Gujrat','Mardan','Kasur','Dera Ghazi Khan','Nawabshah',
  'Mingora','Sahiwal','Mirpur Khas','Okara','Mandi Bahauddin','Hyderabad',
  'Attock','Bahawalnagar','Chakwal','Chiniot','Daska','Hafizabad','Jhelum',
  'Khanewal','Khushab','Lodhran','Mianwali','Muzaffargarh','Narowal','Nankana Sahib',
  'Pakpattan','Rajanpur','Toba Tek Singh','Vehari','Wah Cantonment','Wazirabad',
  'Ahmadpur East','Burewala','Chichawatni','Chistian','Dina','Dinga','Ferozewala',
  'Fort Abbas','Gojra','Gujar Khan','Hasilpur','Kamalia','Kamoke',
  'Kot Addu','Layyah','Mailsi','Minchinabad','Murree','Nankana',
  'Pindi Bhattian','Pir Mahal','Sambrial','Shorkot','Shujaabad','Talagang',
  'Tandlianwala','Taxila','Uch Sharif','Yazman','Zafarwal',
  'Badin','Dadu','Ghotki','Jacobabad','Jamshoro','Kandhkot','Kashmore',
  'Khairpur','Korangi','Kotri','Matiari','Mithi','Naushahro Feroze','Sanghar',
  'Shahdadkot','Shahdadpur','Sehwan','Tando Adam','Tando Allah Yar','Tando Muhammad Khan',
  'Thatta','Umerkot','Hyderabad Cantt','Malir','Orangi','Site Area',
  'Abbottabad','Bannu','Battagram','Buner','Chitral','Dera Ismail Khan','Dir',
  'Hangu','Haripur','Karak','Kohat','Kohistan','Lakki Marwat','Lower Dir',
  'Malakand','Mansehra','Nowshera','Shangla','Swabi','Swat','Tank',
  'Timergara','Upper Dir','Charsadda',
  'Chaman','Dalbandin','Gwadar','Hub','Khuzdar','Loralai','Mastung',
  'Nushki','Pishin','Sibi','Turbat','Zhob','Dera Murad Jamali','Kharan',
  'Kalat','Lasbela','Panjgur','Washuk',
  'Mirpur','Muzaffarabad','Rawalakot','Bagh','Bhimber','Kotli','Neelum',
  'Gilgit','Skardu','Chilas','Hunza','Ghizer',
  'Arifwala','Bhalwal','Bhera','Chunian','Dipalpur','Ferozwala','Gakhar',
  'Gondal','Jaranwala','Khanpur','Kharian','Lalian','Liaquat Pur',
  'Mian Channun','Phalia','Pattoki','Renala Khurd','Samundri','Shakargarh'
].sort();

const _S = LEATHER_QUEEN_SETTINGS || {};
const REMOTE_CITIES = _S.remoteCities || [];
const ADVANCE_DEPOSIT = _S.advanceDeposit ?? 200;
const HIGH_VALUE_THRESHOLD = _S.highValueThreshold ?? 15000;
const FREE_DELIVERY_THRESHOLD = _S.freeDeliveryThreshold ?? 4999;
const DELIVERY_CHARGE = _S.deliveryCharge ?? 250;
const LEATHER_QUEEN_WA = _S.whatsappNumber || '923001234567';
const ELITE = _S.elite || { chargeEnabled: false, chargePerItem: 0, label: 'Elite Access Charge', foundingActive: false, foundingSlotsLeft: 0 };

/* ============================================================
   3. STORE STATE
   ============================================================ */
const Store = {
  cart: JSON.parse(localStorage.getItem('leatherqueen_cart') || '[]'),
  wishlist: JSON.parse(localStorage.getItem('leatherqueen_wishlist') || '[]'),
  // Customer's own orders on this device (the real record lives on the server)
  orders: JSON.parse(localStorage.getItem('leatherqueen_orders') || '[]'),
  rtoLedger: {},
  // { code, type, value, label } after the server confirms a coupon
  appliedCoupon: JSON.parse(sessionStorage.getItem('leatherqueen_coupon') || 'null'),
  countdownConfig: _S.countdown || null,
  productSettings: {},

  save() {
    localStorage.setItem('leatherqueen_cart', JSON.stringify(this.cart));
    localStorage.setItem('leatherqueen_wishlist', JSON.stringify(this.wishlist));
    localStorage.setItem('leatherqueen_orders', JSON.stringify(this.orders.slice(0, 20)));
    if (this.appliedCoupon) sessionStorage.setItem('leatherqueen_coupon', JSON.stringify(this.appliedCoupon));
    else sessionStorage.removeItem('leatherqueen_coupon');
  },

  // Collection / recommended flags are stored on the product itself (server)
  getProductSetting(id, key, defaultVal) {
    const p = PRODUCTS.find(x => x.id === id);
    return p && p[key] !== undefined ? p[key] : defaultVal;
  },

  updateProductSetting(id, key, val) {
    if (!this.productSettings[id]) this.productSettings[id] = {};
    this.productSettings[id][key] = val;
    this.save();
  }
};

// Keep the saved cart in sync with the live catalogue (price changes, removed products)
if (LEATHER_QUEEN_BOOT) {
  Store.cart = Store.cart.filter(i => PRODUCTS.some(p => p.id === i.productId)).map(i => {
    const p = PRODUCTS.find(x => x.id === i.productId);
    return { ...i, price: p.price, name: p.name, image: p.images[0] || i.image, collection: p.collection, eliteCharge: p.eliteChargeEffective || 0 };
  });
  Store.save();
}

/* ============================================================
   4. CART LOGIC
   ============================================================ */
const Cart = {
  add(productId, size, color, qty = 1) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const existing = Store.cart.find(i => i.productId === productId && i.size === size && i.color === color);
    if (existing) {
      existing.qty = Math.min(existing.qty + qty, 10);
    } else {
      Store.cart.push({ productId, size, color, qty, price: product.price, name: product.name, image: product.images[0], collection: product.collection, eliteCharge: product.eliteChargeEffective || 0 });
    }
    Store.save();
    this.updateUI();
    Toast.show(`${product.name} (Size ${size}) added to bag`, 'success');
  },

  remove(productId, size, color) {
    Store.cart = Store.cart.filter(i => !(i.productId === productId && i.size === size && i.color === color));
    Store.save();
    this.updateUI();
    this.renderItems();
  },

  updateQty(productId, size, color, qty) {
    const item = Store.cart.find(i => i.productId === productId && i.size === size && i.color === color);
    if (item) {
      if (qty <= 0) { this.remove(productId, size, color); return; }
      item.qty = Math.min(qty, 10);
      Store.save();
      this.updateUI();
      this.renderItems();
    }
  },

  getSubtotal() { return Store.cart.reduce((sum, i) => sum + i.price * i.qty, 0); },

  getDiscount() {
    const c = Store.appliedCoupon;
    if (!c) return 0;
    if (c.type === 'percent') return Math.round(this.getSubtotal() * c.value / 100);
    return Math.min(c.value, this.getSubtotal());
  },

  // Elite charge a non-member would pay (members pay 0 - confirmed at checkout)
  getEliteChargeEstimate() {
    if (!ELITE.chargeEnabled) return 0;
    return Store.cart.reduce((sum, i) => sum + (i.collection === 'executive' ? (i.eliteCharge || 0) * i.qty : 0), 0);
  },

  getDelivery() {
    const sub = this.getSubtotal() - this.getDiscount();
    return sub >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;
  },

  getTotal() { return this.getSubtotal() - this.getDiscount() + this.getDelivery(); },
  getCount() { return Store.cart.reduce((sum, i) => sum + i.qty, 0); },

  async applyCoupon(code) {
    const res = await StoreAPI.post('/api/coupons/check', { code });
    if (res && res.ok) {
      Store.appliedCoupon = { code: res.code, type: res.type, value: res.value, label: res.label };
      Store.save();
      this.updateUI();
      this.renderItems();
      return { ok: true, label: res.label };
    }
    return { ok: false };
  },

  updateUI() {
    const count = this.getCount();
    document.querySelectorAll('.cart-badge').forEach(el => {
      el.textContent = count;
      el.classList.toggle('on', count > 0);
    });
    document.querySelectorAll('.cart-hd-count').forEach(el => {
      el.textContent = `${count} item${count !== 1 ? 's' : ''}`;
    });
    this.updateDeliveryBar();
  },

  updateDeliveryBar() {
    const subtotal = this.getSubtotal();
    const remaining = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
    const pct = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100);
    document.querySelectorAll('.del-prog-fill').forEach(el => el.style.width = pct + '%');
    document.querySelectorAll('.cart-del-txt').forEach(el => {
      el.innerHTML = remaining > 0
        ? `<strong>Rs. ${remaining.toLocaleString()}</strong> aur add karein — Free Delivery payen!`
        : `🎉 <strong>Free Delivery</strong> qualified hai!`;
    });
  },

  renderItems() {
    const container = document.getElementById('cart-items-list');
    const emptyState = document.getElementById('cart-empty-state');
    if (!container) return;

    if (Store.cart.length === 0) {
      container.innerHTML = '';
      if (emptyState) emptyState.style.display = 'flex';
      this.renderTotals();
      return;
    }
    if (emptyState) emptyState.style.display = 'none';

    container.innerHTML = Store.cart.map(item => `
      <div class="cart-item">
        <img class="cart-item-img" src="${item.image}" alt="${item.name}" onerror="this.style.background='var(--bone)';this.removeAttribute('src')">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-meta">Size EU ${item.size} · ${item.color}${item.collection === 'executive' ? ' · <span style="color:var(--emerald);font-size:.7rem;font-weight:700">✦ Executive</span>' : ''}</div>
          <div class="cart-item-foot">
            <div class="cart-item-price">Rs. ${(item.price * item.qty).toLocaleString()}</div>
            <div class="qty-ctrl">
              <button class="qty-btn" onclick="Cart.updateQty('${item.productId}','${item.size}','${item.color}',${item.qty - 1})">−</button>
              <span class="qty-num">${item.qty}</span>
              <button class="qty-btn" onclick="Cart.updateQty('${item.productId}','${item.size}','${item.color}',${item.qty + 1})">+</button>
            </div>
          </div>
          <button class="rm-btn" onclick="Cart.remove('${item.productId}','${item.size}','${item.color}')">Remove</button>
        </div>
      </div>
    `).join('');
    this.renderTotals();
  },

  renderTotals() {
    const totalsEl = document.getElementById('cart-totals');
    if (!totalsEl) return;
    const sub = this.getSubtotal();
    const disc = this.getDiscount();
    const del = this.getDelivery();
    const total = this.getTotal();
    const elite = this.getEliteChargeEstimate();
    totalsEl.innerHTML = `
      <div class="cart-tot-row"><span>Subtotal</span><span>Rs. ${sub.toLocaleString()}</span></div>
      ${disc > 0 ? `<div class="cart-tot-row save"><span>Discount (${Store.appliedCoupon.code})</span><span>− Rs. ${disc.toLocaleString()}</span></div>` : ''}
      <div class="cart-tot-row"><span>Delivery</span><span>${del === 0 ? '🎉 Free' : 'Rs. ' + del.toLocaleString()}</span></div>
      ${elite > 0 ? `<div class="cart-tot-row" style="font-size:.75rem;color:var(--emerald)"><span>✦ ${ELITE.label}</span><span>+ Rs. ${elite.toLocaleString()}*</span></div>
      <div style="font-size:.68rem;color:var(--warm-grey);line-height:1.5;margin-top:-4px">*Elite members ke liye free. Checkout par aapka number check hoga.</div>` : ''}
      <div class="cart-tot-row grand"><span>Total</span><span>Rs. ${(total + elite).toLocaleString()}${elite > 0 ? '*' : ''}</span></div>
    `;
  },

  open() {
    this.renderItems();
    document.getElementById('cart-drawer')?.classList.add('on');
    document.getElementById('cart-overlay')?.classList.add('on');
    document.body.style.overflow = 'hidden';
  },

  close() {
    document.getElementById('cart-drawer')?.classList.remove('on');
    document.getElementById('cart-overlay')?.classList.remove('on');
    document.body.style.overflow = '';
  }
};

/* ============================================================
   5. WISHLIST
   ============================================================ */
const Wishlist = {
  toggle(productId) {
    const idx = Store.wishlist.indexOf(productId);
    if (idx > -1) { Store.wishlist.splice(idx, 1); }
    else { Store.wishlist.push(productId); }
    Store.save();
    document.querySelectorAll(`[data-wish="${productId}"]`).forEach(btn => {
      btn.classList.toggle('on', Store.wishlist.includes(productId));
    });
    Toast.show(Store.wishlist.includes(productId) ? 'Added to wishlist ♡' : 'Removed from wishlist', 'info');
  },
  isWished(productId) { return Store.wishlist.includes(productId); }
};

/* ============================================================
   6. CHECKOUT LOGIC
   ============================================================ */
const Checkout = {
  validatePhone(phone) {
    return /^03[0-9]{2}[-\s]?[0-9]{7}$/.test(phone.trim());
  },

  requiresAdvanceDeposit(city, totalAmount) {
    return REMOTE_CITIES.includes(city) || totalAmount > HIGH_VALUE_THRESHOLD;
  },

  // Places the order on the server. Returns { order } or { errors }.
  async placeOrderAsync(formData) {
    const payload = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      city: formData.city,
      province: formData.province,
      notes: formData.notes,
      paymentMethod: formData.payment,
      coupon: Store.appliedCoupon ? Store.appliedCoupon.code : '',
      items: Store.cart.map(i => ({ productId: i.productId, size: i.size, color: i.color, qty: i.qty, name: i.name }))
    };
    const res = await StoreAPI.post('/api/orders', payload);
    if (!res || !res.success) {
      return { errors: (res && res.errors) || ['Server se connection nahi ho saka. Internet check kar ke dobara try karein.'] };
    }
    Store.orders.unshift(res.order);
    Store.cart = [];
    Store.appliedCoupon = null;
    Store.save();
    Cart.updateUI();
    return { order: res.order, becameFounding: res.becameFounding };
  },

  generateWhatsAppVerification(order) {
    const items = order.items.map(i => `• ${i.name} (Size ${i.size}) x${i.qty}${i.collection === 'executive' ? ' [Executive]' : ''}`).join('\n');
    const elite = order.eliteCharge > 0 ? `\n*${ELITE.label}:* Rs. ${order.eliteCharge.toLocaleString()}` : (order.eliteSaved > 0 ? `\n✦ *Elite Member* - ${ELITE.label} waived (Rs. ${order.eliteSaved.toLocaleString()})` : '');
    const msg = `Assalam-o-Alaikum ${order.customer.name}! 🌹\n\nAapka *Leather Queen Footwear* order receive hua:\n\n*Order ID:* ${order.id}\n*Items:*\n${items}\n\n*Delivery Address:*\n${order.customer.address}, ${order.customer.city}\n*Phone:* ${order.customer.phone}\n${elite}\n*Total Amount:* Rs. ${order.total.toLocaleString()}\n*Payment:* ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'}\n${order.advanceRequired ? `\n⚠️ *Advance Deposit Required:* Rs. ${order.advanceAmount || ADVANCE_DEPOSIT} via EasyPaisa/JazzCash\n` : ''}\nKya hum yeh order *dispatch confirm* kar dein? ✅`;
    return `https://wa.me/${LEATHER_QUEEN_WA}?text=${encodeURIComponent(msg)}`;
  }
};

/* ============================================================
   7. RTO ENGINE (ledger is kept on the server, managed in Admin)
   ============================================================ */
const RTO = {
  getRiskLevel() { return 'safe'; },
  isHighRisk() { return false; }
};

/* ============================================================
   8. ORDER TRACKING
   ============================================================ */
const Tracking = {
  find(query) {
    const q = query.trim().toUpperCase();
    const digits = q.replace(/\D/g, '');
    return Store.orders.find(o =>
      o.id.toUpperCase() === q ||
      (digits.length >= 10 && o.customer.phone.replace(/\D/g, '').endsWith(digits.slice(-10)))
    );
  },

  async findAsync(query) {
    const res = await StoreAPI.get('/api/track?q=' + encodeURIComponent(query.trim()));
    if (res && res.success) return res.order;
    return null;
  },

  getSteps(order) {
    const t = order.timeline || {};
    const steps = [
      { key: 'placed',     label: 'Order Placed',    icon: 'check', date: order.date },
      { key: 'confirmed',  label: 'COD Verified',    icon: 'phone', date: t.confirmed || null },
      { key: 'packed',     label: 'Packed & Ready',  icon: 'box',   date: t.packed || null },
      { key: 'dispatched', label: 'Dispatched',      icon: 'truck', date: t.dispatched || null },
      { key: 'delivered',  label: 'Delivered',       icon: 'home',  date: t.delivered || null }
    ];
    const statusMap = { pending: 0, confirmed: 1, packed: 2, dispatched: 3, delivered: 4, cancelled: 0 };
    const currentIdx = statusMap[order.status] ?? 0;
    return steps.map((s, i) => ({
      ...s,
      state: i < currentIdx ? 'done' : i === currentIdx ? 'active' : 'pending'
    }));
  }
};

/* ============================================================
   9. COUNTDOWN TIMER
   ============================================================ */
const Countdown = {
  interval: null,

  init() {
    const config = Store.countdownConfig || JSON.parse(localStorage.getItem('leatherqueen_countdown') || 'null');
    if (!config || !config.active || !config.endTime) return;
    this.start(new Date(config.endTime), config.label);
  },

  start(endDate, label) {
    if (this.interval) clearInterval(this.interval);
    const updateAll = () => {
      const now = new Date();
      const diff = endDate - now;
      if (diff <= 0) {
        this.clear();
        document.querySelectorAll('.ann-countdown').forEach(el => el.innerHTML = label ? `${label} — Ended` : 'Offer Ended');
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      const fmt = n => String(n).padStart(2, '0');
      const html = (prefix) => `${prefix ? prefix + ' — ' : ''}<span class="ann-cd-num">${d > 0 ? d + 'd ' : ''}${fmt(h)}</span><span class="ann-cd-sep">:</span><span class="ann-cd-num">${fmt(m)}</span><span class="ann-cd-sep">:</span><span class="ann-cd-num">${fmt(s)}</span>`;
      document.querySelectorAll('.ann-countdown').forEach(el => el.innerHTML = html(label));
      document.querySelectorAll('[id^="drop-cd-"]').forEach(el => {
        const unit = el.id.split('-')[2];
        if (unit === 'd') el.textContent = fmt(d);
        if (unit === 'h') el.textContent = fmt(h);
        if (unit === 'm') el.textContent = fmt(m);
        if (unit === 's') el.textContent = fmt(s);
      });
    };
    updateAll();
    this.interval = setInterval(updateAll, 1000);
  },

  clear() {
    if (this.interval) clearInterval(this.interval);
    this.interval = null;
  }
};

/* ============================================================
   10. TOAST NOTIFICATIONS
   ============================================================ */
const Toast = {
  show(message, type = 'success', duration = 3500) {
    const container = document.getElementById('toast-container') || (() => {
      const el = document.createElement('div');
      el.id = 'toast-container';
      el.className = 'toast-wrap';
      document.body.appendChild(el);
      return el;
    })();

    const icons = {
      success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>',
      error:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
      info:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r="0.5" fill="currentColor"/></svg>'
    };

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `${icons[type] || icons.info}${message}`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('out');
      setTimeout(() => toast.remove(), 350);
    }, duration);
  }
};

/* ============================================================
   11. PRODUCT RENDERING HELPERS
   ============================================================ */
function getHeelTagClass(heelType) {
  const map = { stiletto: 'stiletto', block: 'block', kitten: 'kitten', flat: 'flat' };
  return map[heelType] || 'flat';
}

function getOccasionTagClass(occ) {
  if (occ.includes('Wedding')) return 'wedding';
  if (occ.includes('Party')) return 'party';
  return 'elegant';
}

function renderProductCard(product, delay = 0) {
  const wished = Wishlist.isWished(product.id);
  const isExec = product.collection === 'executive';
  const isRecommended = Store.getProductSetting(product.id, 'recommended', product.recommended);

  const colors = product.colors.map(c =>
    `<span class="cs-dot" title="${c.label}" style="background:${c.hex};width:10px;height:10px;border-radius:50%;display:inline-block;"></span>`
  ).join('');

  const sizes = Object.entries(product.stock).map(([sz, qty]) =>
    `<span class="cs-dot${qty === 0 ? ' oos' : ''}" title="EU ${sz}${qty === 0 ? ' — Out of Stock' : ''}">${sz}</span>`
  ).join('');

  let badge = '';
  if (product.badge) {
    const badgeMap = { exec: ['badge-exec', '✦ Executive'], bestseller: ['badge-best', 'Bestseller'], new: ['badge-new', 'New'], limited: ['badge-ltd', 'Limited'] };
    const [cls, lbl] = badgeMap[product.badge] || ['badge-new', product.badge];
    badge = `<span class="p-badge ${cls}">${lbl}</span>`;
  }

  const recommendBadge = isRecommended
    ? `<span class="badge-recommend${!isExec ? ' regular-rec' : ''}">⭐ Highly Recommended</span>`
    : '';

  const saleTag = product.originalPrice ? `<span class="p-price-orig">Rs. ${product.originalPrice.toLocaleString()}</span>` : '';

  const heelTag = `<span class="heel-tag ${getHeelTagClass(product.heelType)}">👠 ${product.heelHeight}</span>`;

  const occasionTags = (product.occasions || []).map(occ =>
    `<span class="occ-tag ${getOccasionTagClass(occ)}">${occ}</span>`
  ).join('');

  return `
    <div class="p-card${isExec ? ' exec-card' : ''} reveal d${(delay % 4) + 1}" onclick="window.location='product.html?id=${product.id}'" style="cursor:pointer">
      <div class="p-card-img">
        ${badge}
        ${recommendBadge}
        <button class="wish-btn${wished ? ' on' : ''}" data-wish="${product.id}" onclick="event.stopPropagation();Wishlist.toggle('${product.id}')" title="Add to Wishlist">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>
        <img src="${product.images[0]}" alt="${product.name}" onerror="this.src='';this.style.background='var(--bone)'">
        ${product.images[1] ? `<img class="img2" src="${product.images[1]}" alt="${product.name} alt view" onerror="this.remove()">` : ''}
        <div class="occasion-tags">${occasionTags}</div>
        <div class="card-video-wrap">
          <div class="card-video-inner">
            <div style="width:30px;height:30px;border-radius:50%;background:rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;">▶</div>
            <span>5s Walk Preview</span>
          </div>
        </div>
      </div>
      <div class="p-card-body">
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px;">${heelTag}</div>
        <div class="p-card-name">${product.name}</div>
        <div class="p-card-promise">${product.promise}</div>
        <div class="p-card-foot">
          <div><span class="p-price">Rs. ${product.price.toLocaleString()}</span>${saleTag}</div>
        </div>
        <div class="card-sizes">${sizes}</div>
      </div>
    </div>
  `;
}

/* ============================================================
   12. MOBILE NAV
   ============================================================ */
function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const mobNav = document.getElementById('mob-nav');
  const mobClose = document.getElementById('mob-nav-close');
  if (!hamburger || !mobNav) return;

  hamburger.addEventListener('click', () => {
    mobNav.classList.add('on');
    document.body.style.overflow = 'hidden';
  });
  mobClose?.addEventListener('click', () => {
    mobNav.classList.remove('on');
    document.body.style.overflow = '';
  });
}

/* ============================================================
   13. SHARED COMPONENTS
   ============================================================ */
function injectSharedComponents() {
  document.getElementById('cart-overlay')?.addEventListener('click', () => Cart.close());
  document.getElementById('cart-close')?.addEventListener('click', () => Cart.close());
  document.querySelectorAll('.cart-trigger').forEach(el => {
    el.addEventListener('click', () => Cart.open());
  });

  document.getElementById('apply-coupon')?.addEventListener('click', async () => {
    const input = document.getElementById('coupon-inp');
    if (!input) return;
    const result = await Cart.applyCoupon(input.value);
    const msg = document.getElementById('coupon-msg');
    if (msg) {
      msg.textContent = result.ok ? `✓ ${result.label}` : 'Invalid code — please try again';
      msg.className = 'coupon-msg ' + (result.ok ? 'ok' : 'err');
    }
  });

  document.getElementById('cart-checkout-btn')?.addEventListener('click', () => {
    if (Store.cart.length === 0) { Toast.show('Your bag is empty', 'error'); return; }
    window.location.href = 'cart.html';
  });

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === currentPage) link.classList.add('active');
  });

  Cart.updateUI();
  initMobileNav();

  // Sticky nav shadow
  window.addEventListener('scroll', () => {
    document.querySelector('.nav-wrap')?.classList.toggle('scrolled', window.scrollY > 50);
  });
}

/* ============================================================
   14. CITIES DROPDOWN
   ============================================================ */
function populateCities(selectId) {
  const sel = document.getElementById(selectId);
  if (!sel || sel.dataset.citiesLoaded) return;
  sel.dataset.citiesLoaded = '1';
  PK_CITIES.forEach(city => {
    const opt = document.createElement('option');
    opt.value = city;
    opt.textContent = city;
    sel.appendChild(opt);
  });
}

/* ============================================================
   15. ADVANCE DEPOSIT DETECTOR
   (checkout page now asks the server for an exact quote; kept for compatibility)
   ============================================================ */
function checkAdvanceDeposit() {}

/* ============================================================
   16. API CLIENT
   ============================================================ */
const StoreAPI = {
  async request(method, url, body) {
    try {
      const res = await fetch(leatherqueenApiBase() + url, {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : {},
        body: body ? JSON.stringify(body) : undefined
      });
      const data = await res.json().catch(() => null);
      return data;
    } catch (err) {
      console.warn('LEATHER QUEEN API error:', url, err.message);
      return null;
    }
  },
  get(url) { return this.request('GET', url); },
  post(url, body) { return this.request('POST', url, body); }
};

/* ============================================================
   17. ELITE MEMBERSHIP HELPERS
   ============================================================ */
function eliteNoticeHTML(product) {
  if (!product || product.collection !== 'executive' || !ELITE.chargeEnabled || !product.eliteChargeEffective) return '';
  const founding = ELITE.foundingActive && ELITE.foundingSlotsLeft > 0
    ? `<br><strong>Founding offer:</strong> pehle customers ko Elite membership FREE \u2014 sirf ${ELITE.foundingSlotsLeft} spots baqi!`
    : '';
  return `<div class="elite-notice" style="margin-top:10px;padding:10px 12px;border-radius:10px;background:rgba(10,58,47,.07);border:1px solid rgba(10,58,47,.18);font-size:.78rem;line-height:1.6;color:var(--emerald)">
    \u2726 <strong>Elite Members:</strong> koi extra charge nahi.<br>
    Non-members: + Rs. ${product.eliteChargeEffective.toLocaleString()} ${ELITE.label} per pair.${founding}
  </div>`;
}

/* ============================================================
   18. LIVE SETTINGS ON EVERY PAGE (WhatsApp, drop, bank details)
   ============================================================ */
function applyLiveSettings() {
  if (!LEATHER_QUEEN_SETTINGS) return;
  const DEFAULT_WA = '923001234567';
  if (LEATHER_QUEEN_WA !== DEFAULT_WA) {
    const fix = url => typeof url === 'string' ? url.split('wa.me/' + DEFAULT_WA).join('wa.me/' + LEATHER_QUEEN_WA) : url;
    document.querySelectorAll(`a[href*="wa.me/${DEFAULT_WA}"]`).forEach(a => { a.href = fix(a.getAttribute('href')); });
    // Links created later by page scripts
    document.addEventListener('click', e => {
      const a = e.target.closest && e.target.closest('a[href*="wa.me/"]');
      if (a) a.href = fix(a.getAttribute('href'));
    }, true);
    const origOpen = window.open;
    window.open = function (url, ...rest) { return origOpen.call(window, fix(url), ...rest); };
  }

  // Homepage drop section
  const drop = LEATHER_QUEEN_SETTINGS.drop;
  const dropSection = document.getElementById('drop-section');
  if (dropSection && drop) {
    if (!drop.active) dropSection.style.display = 'none';
    const title = dropSection.querySelector('h2');
    if (title && drop.title) title.textContent = drop.title;
  }

  // Checkout bank panel
  const bank = LEATHER_QUEEN_SETTINGS.bank;
  const panel = document.getElementById('bank-panel');
  if (panel && bank) {
    const rows = panel.querySelectorAll('.bank-row .bank-v');
    const values = [bank.bankName, bank.accountName, bank.accountNumber, bank.iban, bank.easyPaisa || '\u2014', bank.jazzCash || '\u2014'];
    rows.forEach((el, i) => { if (values[i] !== undefined) el.textContent = values[i]; });
    const waStrong = panel.querySelector('p strong');
    if (waStrong) waStrong.textContent = '+' + LEATHER_QUEEN_WA;
  }
}

/* ============================================================
   19. INIT ON EVERY PAGE
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  applyLiveSettings();
  injectSharedComponents();
  Countdown.init();
  populateCities('checkout-city');

  if (!LEATHER_QUEEN_BOOT) Toast.show('Store abhi load nahi ho saka. Page refresh karein.', 'error', 6000);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); observer.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});

// Global exports
window.Cart = Cart;
window.Wishlist = Wishlist;
window.Checkout = Checkout;
window.RTO = RTO;
window.Tracking = Tracking;
window.Toast = Toast;
window.Store = Store;
window.PRODUCTS = PRODUCTS;
window.PK_CITIES = PK_CITIES;
window.renderProductCard = renderProductCard;
window.StoreAPI = StoreAPI;
window.eliteNoticeHTML = eliteNoticeHTML;
