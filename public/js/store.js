/* ============================================================
   RAWAN FOOTWEAR — Store Core Logic
   Products · Cart · Checkout · Orders · RTO Engine
   Two-Tier Collections: Executive (Emerald) + Regular (Terracotta)
   ============================================================ */

'use strict';

/* ============================================================
   1. PRODUCT DATA — Ladies Footwear (Heels, Sandals, Party Wear)
   ============================================================ */
const PRODUCTS = [
  /* -------- RAWAN EXECUTIVE COLLECTION -------- */
  {
    id: 'noor-stiletto',
    name: 'Noor Stiletto Heel',
    collection: 'executive',
    category: ['women', 'executive', 'heels', 'party'],
    badge: 'exec',
    heelType: 'stiletto',
    heelHeight: '4.5 inch',
    occasions: ['Night Party Glam', 'Wedding Guest Look'],
    price: 22999,
    originalPrice: 27999,
    promise: 'Where craftsmanship meets royalty — every step a statement.',
    fitIndicator: 'tts',
    fitLabel: 'True to Size',
    recommended: true,
    colors: [
      { name: 'Midnight Black', hex: '#1A1A1A', label: 'Midnight' },
      { name: 'Deep Wine', hex: '#5C1E2E', label: 'Bordeaux' },
      { name: 'Rose Gold', hex: '#C8956C', label: 'Rose Gold' }
    ],
    stock: { 35: 4, 36: 6, 37: 8, 38: 5, 39: 3, 40: 2 },
    images: ['images/products/noor-1.jpg', 'images/products/noor-2.jpg'],
    material: 'Italian-grade suede upper. Swarovski crystal embellishments. Memory foam insole. Steel-reinforced 4.5-inch stiletto heel. Leather-lined interior.',
    care: 'Store in dust bag. Wipe with soft cloth. Avoid rough surfaces. Apply heel caps regularly.',
    reviews: [
      { author: 'Ayesha R.', city: 'Lahore', stars: 5, text: 'Mere wedding mein yeh heels ne sab ka dil jeet liya. Crystal detailing bilkul real lagti hai — queen feel mili.', verified: true },
      { author: 'Zara N.', city: 'Karachi', stars: 5, text: 'Quality itni premium hai ke main believe nahi kar sakti Pakistan mein milti hain. 10/10.', verified: true }
    ]
  },
  {
    id: 'layla-crystal-sandal',
    name: 'Layla Crystal Sandal',
    collection: 'executive',
    category: ['women', 'executive', 'sandals', 'party'],
    badge: 'exec',
    heelType: 'stiletto',
    heelHeight: '4 inch',
    occasions: ['Wedding Guest Look', 'Night Party Glam'],
    price: 18999,
    originalPrice: null,
    promise: 'Light as air, radiant as moonlight — your perfect celebration sandal.',
    fitIndicator: 'tts',
    fitLabel: 'True to Size',
    recommended: true,
    colors: [
      { name: 'Silver Crystal', hex: '#C0C0C0', label: 'Silver Crystal' },
      { name: 'Gold Pearl', hex: '#D4AF6A', label: 'Gold Pearl' },
      { name: 'Ivory', hex: '#F5F0E8', label: 'Ivory' }
    ],
    stock: { 35: 5, 36: 8, 37: 6, 38: 4, 39: 2, 40: 1 },
    images: ['images/products/mehr-1.jpg', 'images/products/mehr-2.jpg'],
    material: 'Hand-beaded crystal straps. Padded leather insole. 4-inch heel with geometric base for stability. Satin finish.',
    care: 'Handle crystals gently. Store flat in box. Avoid water. Polish leather heel with soft cloth.',
    reviews: [
      { author: 'Sana K.', city: 'Islamabad', stars: 5, text: 'Gold Pearl color meri engagement mein perfect tha. Itni comfortable hai ke raat bhar pain nahi hua!', verified: true },
      { author: 'Hira F.', city: 'Karachi', stars: 5, text: 'Layla Crystal ne mere look ko 10x upgrade kar diya. Premium packaging bhi bohat lovely tha.', verified: true }
    ]
  },
  {
    id: 'sultana-block-heel',
    name: 'Sultana Block Heel',
    collection: 'executive',
    category: ['women', 'executive', 'heels'],
    badge: 'exec',
    heelType: 'block',
    heelHeight: '3.5 inch',
    occasions: ['Elegant Day Wear', 'Wedding Guest Look'],
    price: 16999,
    originalPrice: null,
    promise: 'Authority in every stride — block heel grace redefined.',
    fitIndicator: 'tts',
    fitLabel: 'True to Size',
    recommended: false,
    colors: [
      { name: 'Emerald', hex: '#0A3A2F', label: 'Deep Emerald' },
      { name: 'Black', hex: '#1A1A1A', label: 'Midnight' },
      { name: 'Cognac', hex: '#8B4513', label: 'Cognac' }
    ],
    stock: { 35: 6, 36: 9, 37: 10, 38: 7, 39: 5, 40: 3 },
    images: ['images/products/dastoor-1.jpg', 'images/products/dastoor-2.jpg'],
    material: 'Full-grain leather upper. Padded footbed with arch support. 3.5-inch solid block heel. Rubber-tipped for grip.',
    care: 'Polish with matching cream. Use a soft brush on suede versions. Condition monthly.',
    reviews: [
      { author: 'Fatima A.', city: 'Lahore', stars: 5, text: 'Office aur dinner dono ke liye perfect. Deep Emerald color literally jaan hai.', verified: true }
    ]
  },
  /* -------- RAWAN REGULAR COLLECTION -------- */
  {
    id: 'rawa-kitten-heel',
    name: 'Rawa Kitten Heel',
    collection: 'regular',
    category: ['women', 'regular', 'heels', 'everyday'],
    badge: 'bestseller',
    heelType: 'kitten',
    heelHeight: '2 inch',
    occasions: ['Elegant Day Wear', 'Wedding Guest Look'],
    price: 4499,
    originalPrice: null,
    promise: 'Everyday elegance at a price that makes sense.',
    fitIndicator: 'tts',
    fitLabel: 'True to Size',
    recommended: true,
    colors: [
      { name: 'Blush', hex: '#D4A5A5', label: 'Dusty Rose' },
      { name: 'Nude', hex: '#C8A882', label: 'Nude' },
      { name: 'Black', hex: '#1A1A1A', label: 'Midnight' }
    ],
    stock: { 35: 12, 36: 18, 37: 20, 38: 15, 39: 10, 40: 6 },
    images: ['images/products/saba-1.jpg', 'images/products/saba-2.jpg'],
    material: 'Soft faux leather upper. Cushioned insole. 2-inch kitten heel. Non-slip rubber base.',
    care: 'Wipe with damp cloth. Air dry. Store in cool, dry place.',
    reviews: [
      { author: 'Mahnaz S.', city: 'Faisalabad', stars: 5, text: 'Office ke liye perfect! Comfortable aur stylish, price bhi bilkul sahi.', verified: true },
      { author: 'Nadia K.', city: 'Lahore', stars: 5, text: 'Dusty Rose color real mein aur bhi pyara hai. Koi pain nahi hota sara din.', verified: true }
    ]
  },
  {
    id: 'zara-party-sandal',
    name: 'Zara Party Sandal',
    collection: 'regular',
    category: ['women', 'regular', 'sandals', 'party'],
    badge: 'new',
    heelType: 'block',
    heelHeight: '2.5 inch',
    occasions: ['Night Party Glam', 'Wedding Guest Look'],
    price: 3999,
    originalPrice: 5499,
    promise: 'Party-ready on any budget — look expensive, feel amazing.',
    fitIndicator: 'tts',
    fitLabel: 'True to Size',
    recommended: false,
    colors: [
      { name: 'Shimmer Gold', hex: '#D4AF6A', label: 'Shimmer Gold' },
      { name: 'Silver', hex: '#C0C0C0', label: 'Silver' },
      { name: 'Rose Pink', hex: '#E8C5C0', label: 'Rose Pink' }
    ],
    stock: { 35: 10, 36: 14, 37: 16, 38: 12, 39: 8, 40: 4 },
    images: ['images/products/mehr-1.jpg', 'images/products/mehr-2.jpg'],
    material: 'Metallic faux leather straps. Cushioned block heel. Anti-slip sole. Adjustable ankle strap.',
    care: 'Wipe gently with soft cloth. Avoid water. Store away from direct sunlight.',
    reviews: [
      { author: 'Saba M.', city: 'Karachi', stars: 5, text: 'Gold wali itni khoobsurat hai ke sab pooch rahe the kahan se li. Aur price bohat affordable!', verified: true },
      { author: 'Rabia F.', city: 'Lahore', stars: 4, text: 'Comfortable hai aur size bilkul sahi. Shadi mein pehni, sab ne tarif ki.', verified: true }
    ]
  },
  {
    id: 'laila-flat-sandal',
    name: 'Laila Flat Sandal',
    collection: 'regular',
    category: ['women', 'regular', 'sandals', 'everyday'],
    badge: null,
    heelType: 'flat',
    heelHeight: 'Flat',
    occasions: ['Elegant Day Wear'],
    price: 2999,
    originalPrice: null,
    promise: 'Simple, comfortable, effortlessly chic — for every day.',
    fitIndicator: 'tts',
    fitLabel: 'True to Size',
    recommended: false,
    colors: [
      { name: 'Tan', hex: '#C8A882', label: 'Tan' },
      { name: 'White', hex: '#F5F0E8', label: 'Off-White' },
      { name: 'Black', hex: '#1A1A1A', label: 'Midnight' }
    ],
    stock: { 35: 15, 36: 20, 37: 22, 38: 18, 39: 12, 40: 8 },
    images: ['images/products/raah-1.jpg', 'images/products/raah-2.jpg'],
    material: 'Genuine leather straps. Soft cushioned footbed. Flat rubber sole with arch support.',
    care: 'Apply leather conditioner monthly. Wipe clean after use. Store flat.',
    reviews: [
      { author: 'Areeba T.', city: 'Islamabad', stars: 5, text: 'Summer ke liye best buy! Genuine leather lagti hai itni affordable price mein. Love it!', verified: true }
    ]
  },
  {
    id: 'mahira-stiletto',
    name: 'Mahira Stiletto',
    collection: 'regular',
    category: ['women', 'regular', 'heels', 'party'],
    badge: 'new',
    heelType: 'stiletto',
    heelHeight: '3.5 inch',
    occasions: ['Night Party Glam', 'Elegant Day Wear'],
    price: 5999,
    originalPrice: 7999,
    promise: 'High fashion at factory pricing — your dream heels are real.',
    fitIndicator: 'tts',
    fitLabel: 'True to Size',
    recommended: true,
    colors: [
      { name: 'Classic Red', hex: '#B22222', label: 'Classic Red' },
      { name: 'Black', hex: '#1A1A1A', label: 'Midnight' },
      { name: 'Nude', hex: '#C8A882', label: 'Nude' }
    ],
    stock: { 35: 8, 36: 12, 37: 14, 38: 10, 39: 7, 40: 3 },
    images: ['images/products/dastoor-1.jpg', 'images/products/dastoor-2.jpg'],
    material: 'Patent leather upper. Memory foam cushioned insole. 3.5-inch stiletto heel. Reinforced heel counter.',
    care: 'Polish patent leather with soft cloth. Avoid rain. Use heel caps.',
    reviews: [
      { author: 'Sadia H.', city: 'Lahore', stars: 5, text: 'Classic Red ne mere outfit ko transform kar diya. Stiletto hone ke bawajood itni comfortable hai.', verified: true },
      { author: 'Mariam A.', city: 'Karachi', stars: 5, text: 'Quality brand wali lagti hai lekin price regular wali! Highly recommended.', verified: true }
    ]
  },
  {
    id: 'amira-wedge',
    name: 'Amira Wedge Heel',
    collection: 'regular',
    category: ['women', 'regular', 'heels', 'everyday'],
    badge: 'bestseller',
    heelType: 'block',
    heelHeight: '2.5 inch',
    occasions: ['Elegant Day Wear', 'Wedding Guest Look'],
    price: 4999,
    originalPrice: null,
    promise: 'The comfort of a wedge, the beauty of a heel — perfectly balanced.',
    fitIndicator: 'tts',
    fitLabel: 'True to Size',
    recommended: false,
    colors: [
      { name: 'Camel', hex: '#C19A6B', label: 'Camel' },
      { name: 'White', hex: '#F5F0E8', label: 'Off-White' },
      { name: 'Brown', hex: '#6B4226', label: 'Chocolate' }
    ],
    stock: { 35: 10, 36: 16, 37: 18, 38: 14, 39: 9, 40: 5 },
    images: ['images/products/saba-2.jpg', 'images/products/saba-1.jpg'],
    material: 'Woven upper with leather trim. Cork wedge base. Cushioned footbed. Adjustable ankle strap.',
    care: 'Wipe with damp cloth. Avoid soaking. Store with shape inserts.',
    reviews: [
      { author: 'Uzma Q.', city: 'Rawalpindi', stars: 5, text: 'Wedge ki wajah se itni comfortable hai! Sari raat pehni without any pain. Amazing value.', verified: true }
    ]
  }
];

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

const REMOTE_CITIES = [
  'Quetta','Gwadar','Turbat','Khuzdar','Dalbandin','Nushki','Hub','Chaman',
  'Zhob','Loralai','Sibi','Kalat','Panjgur','Washuk','Chitral','Upper Dir',
  'Dir','Kohistan','Gilgit','Skardu','Chilas','Hunza','Ghizer','Neelum'
];

const ADVANCE_DEPOSIT = 200;
const HIGH_VALUE_THRESHOLD = 15000;
const FREE_DELIVERY_THRESHOLD = 4999;
const DELIVERY_CHARGE = 250;

/* ============================================================
   3. STORE STATE
   ============================================================ */
const Store = {
  cart: JSON.parse(localStorage.getItem('rawan_cart') || '[]'),
  wishlist: JSON.parse(localStorage.getItem('rawan_wishlist') || '[]'),
  orders: JSON.parse(localStorage.getItem('rawan_orders') || '[]'),
  rtoLedger: JSON.parse(localStorage.getItem('rawan_rto_ledger') || '{}'),
  appliedCoupon: null,
  coupons: {
    'RAWAN10':  { type: 'percent', value: 10,  label: '10% off — Launch Offer' },
    'FLAT1000': { type: 'flat',    value: 1000, label: 'Rs. 1,000 off' },
    'FIRST500': { type: 'flat',    value: 500,  label: 'Rs. 500 off — First Order' },
    'EXEC15':   { type: 'percent', value: 15,   label: '15% off — Executive VIP' }
  },
  countdownConfig: JSON.parse(localStorage.getItem('rawan_countdown') || 'null'),
  // Admin product settings: { [productId]: { collection: 'executive'|'regular', recommended: bool } }
  productSettings: JSON.parse(localStorage.getItem('rawan_product_settings') || '{}'),

  save() {
    localStorage.setItem('rawan_cart', JSON.stringify(this.cart));
    localStorage.setItem('rawan_wishlist', JSON.stringify(this.wishlist));
    localStorage.setItem('rawan_orders', JSON.stringify(this.orders));
    localStorage.setItem('rawan_rto_ledger', JSON.stringify(this.rtoLedger));
    localStorage.setItem('rawan_product_settings', JSON.stringify(this.productSettings));
  },

  getProductSetting(id, key, defaultVal) {
    return this.productSettings[id]?.[key] ?? defaultVal;
  },

  updateProductSetting(id, key, val) {
    if (!this.productSettings[id]) this.productSettings[id] = {};
    this.productSettings[id][key] = val;
    this.save();
  }
};

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
      Store.cart.push({ productId, size, color, qty, price: product.price, name: product.name, image: product.images[0], collection: product.collection });
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
    if (!Store.appliedCoupon) return 0;
    const coupon = Store.coupons[Store.appliedCoupon];
    if (!coupon) return 0;
    if (coupon.type === 'percent') return Math.round(this.getSubtotal() * coupon.value / 100);
    return Math.min(coupon.value, this.getSubtotal());
  },

  getDelivery() {
    const sub = this.getSubtotal() - this.getDiscount();
    return sub >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;
  },

  getTotal() { return this.getSubtotal() - this.getDiscount() + this.getDelivery(); },
  getCount() { return Store.cart.reduce((sum, i) => sum + i.qty, 0); },

  applyCoupon(code) {
    const coupon = Store.coupons[code.toUpperCase()];
    if (coupon) {
      Store.appliedCoupon = code.toUpperCase();
      this.updateUI();
      this.renderItems();
      return { ok: true, label: coupon.label };
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
    totalsEl.innerHTML = `
      <div class="cart-tot-row"><span>Subtotal</span><span>Rs. ${sub.toLocaleString()}</span></div>
      ${disc > 0 ? `<div class="cart-tot-row save"><span>Discount (${Store.appliedCoupon})</span><span>− Rs. ${disc.toLocaleString()}</span></div>` : ''}
      <div class="cart-tot-row"><span>Delivery</span><span>${del === 0 ? '🎉 Free' : 'Rs. ' + del.toLocaleString()}</span></div>
      <div class="cart-tot-row grand"><span>Total</span><span>Rs. ${total.toLocaleString()}</span></div>
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

  placeOrder(formData) {
    const orderId = 'RW-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 3).toUpperCase();
    const order = {
      id: orderId,
      date: new Date().toISOString(),
      customer: formData,
      items: [...Store.cart],
      subtotal: Cart.getSubtotal(),
      discount: Cart.getDiscount(),
      coupon: Store.appliedCoupon,
      delivery: Cart.getDelivery(),
      total: Cart.getTotal(),
      status: 'pending',
      paymentMethod: formData.payment,
      advanceRequired: this.requiresAdvanceDeposit(formData.city, Cart.getTotal()),
      trackingId: null,
      courier: null
    };
    Store.orders.push(order);
    Store.cart = [];
    Store.appliedCoupon = null;
    Store.save();
    Cart.updateUI();
    return order;
  },

  generateWhatsAppVerification(order) {
    const items = order.items.map(i => `• ${i.name} (Size ${i.size}) x${i.qty}${i.collection === 'executive' ? ' [Executive]' : ''}`).join('\n');
    const msg = `Assalam-o-Alaikum ${order.customer.name}! 🌹\n\nAapka *Rawan Footwear* order receive hua:\n\n*Order ID:* ${order.id}\n*Items:*\n${items}\n\n*Delivery Address:*\n${order.customer.address}, ${order.customer.city}\n*Phone:* ${order.customer.phone}\n\n*Total Amount:* Rs. ${order.total.toLocaleString()}\n*Payment:* ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'}\n${order.advanceRequired ? `\n⚠️ *Advance Deposit Required:* Rs. ${ADVANCE_DEPOSIT} via EasyPaisa/JazzCash\n` : ''}\nKya hum yeh order *dispatch confirm* kar dein? ✅`;
    return `https://wa.me/923001234567?text=${encodeURIComponent(msg)}`;
  }
};

/* ============================================================
   7. RTO ENGINE
   ============================================================ */
const RTO = {
  logRefusal(phone) {
    const key = phone.replace(/\D/g, '');
    if (!Store.rtoLedger[key]) Store.rtoLedger[key] = { count: 0, dates: [] };
    Store.rtoLedger[key].count++;
    Store.rtoLedger[key].dates.push(new Date().toISOString());
    Store.save();
  },

  getRiskLevel(phone) {
    const key = phone.replace(/\D/g, '');
    const record = Store.rtoLedger[key];
    if (!record) return 'safe';
    if (record.count >= 3) return 'high';
    if (record.count >= 1) return 'medium';
    return 'safe';
  },

  isHighRisk(phone) { return this.getRiskLevel(phone) === 'high'; }
};

/* ============================================================
   8. ORDER TRACKING
   ============================================================ */
const Tracking = {
  find(query) {
    const q = query.trim().toUpperCase();
    return Store.orders.find(o =>
      o.id.toUpperCase() === q ||
      o.customer.phone.replace(/\D/g, '').includes(q.replace(/\D/g, ''))
    );
  },

  getSteps(order) {
    const steps = [
      { key: 'placed',     label: 'Order Placed',    icon: 'check', date: order.date },
      { key: 'confirmed',  label: 'COD Verified',    icon: 'phone', date: null },
      { key: 'packed',     label: 'Packed & Ready',  icon: 'box',   date: null },
      { key: 'dispatched', label: 'Dispatched',      icon: 'truck', date: null },
      { key: 'delivered',  label: 'Delivered',       icon: 'home',  date: null }
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
    const config = Store.countdownConfig || JSON.parse(localStorage.getItem('rawan_countdown') || 'null');
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

  document.getElementById('apply-coupon')?.addEventListener('click', () => {
    const input = document.getElementById('coupon-inp');
    if (!input) return;
    const result = Cart.applyCoupon(input.value);
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
  if (!sel) return;
  PK_CITIES.forEach(city => {
    const opt = document.createElement('option');
    opt.value = city;
    opt.textContent = city;
    sel.appendChild(opt);
  });
}

/* ============================================================
   15. ADVANCE DEPOSIT DETECTOR
   ============================================================ */
function checkAdvanceDeposit() {
  const cityEl = document.getElementById('checkout-city');
  const notice = document.getElementById('advance-shipping-notice');
  if (!cityEl || !notice) return;

  const update = () => {
    const city = cityEl.value;
    const total = Cart.getTotal();
    const needs = Checkout.requiresAdvanceDeposit(city, total);
    notice.classList.toggle('on', needs);
    if (needs) {
      notice.innerHTML = `⚠️ <strong>Advance Security Deposit Required:</strong> Rs. ${ADVANCE_DEPOSIT} via EasyPaisa/JazzCash ke zariye bhejein. Baaki payment delivery par COD mein li jayegi.`;
    }
  };
  cityEl.addEventListener('change', update);
  update();
}

/* ============================================================
   16. INIT ON EVERY PAGE
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  injectSharedComponents();
  Countdown.init();
  populateCities('checkout-city');
  checkAdvanceDeposit();

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


/* ============================================================
   RAWAN API CLIENT BRIDGE (Full-Stack Backend Integration)
   ============================================================ */
const RawanAPI = {
  getBaseUrl() {
    if (typeof window !== 'undefined' && window.location) {
      if (window.location.protocol === 'file:') return 'http://localhost:5000';
      if (window.location.port === '5000' || window.location.port === '10000') return '';
      return 'http://localhost:5000';
    }
    return '';
  },

  async validateCheckout(payload) {
    try {
      const res = await fetch(`${this.getBaseUrl()}/api/checkout/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('API /api/checkout/validate fallback notice:', err.message);
    }
    return null;
  },

  async placeOrder(orderData) {
    try {
      const res = await fetch(`${this.getBaseUrl()}/api/orders/place`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('API /api/orders/place fallback notice:', err.message);
    }
    return null;
  },

  async getOrder(orderId) {
    try {
      const res = await fetch(`${this.getBaseUrl()}/api/orders/${encodeURIComponent(orderId)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.order) return data.order;
      }
    } catch (err) {
      console.warn('API /api/orders/:id fallback notice:', err.message);
    }
    return null;
  },

  async getOrders(status = 'all', search = '') {
    try {
      const params = new URLSearchParams();
      if (status && status !== 'all') params.append('status', status);
      if (search) params.append('search', search);
      const res = await fetch(`${this.getBaseUrl()}/api/orders?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.orders) return data.orders;
      }
    } catch (err) {
      console.warn('API /api/orders fallback notice:', err.message);
    }
    return null;
  },

  async updateOrderStatus(orderId, status, courier, trackingId) {
    try {
      const res = await fetch(`${this.getBaseUrl()}/api/orders/${encodeURIComponent(orderId)}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, courier, trackingId })
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('API /api/orders/:id/status notice:', err.message);
    }
    return null;
  },

  async getConfig() {
    try {
      const res = await fetch(`${this.getBaseUrl()}/api/admin/config`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.config) return data.config;
      }
    } catch (err) {
      console.warn('API /api/admin/config notice:', err.message);
    }
    return null;
  },

  async updateConfig(payload) {
    try {
      const res = await fetch(`${this.getBaseUrl()}/api/admin/config/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('API /api/admin/config/update notice:', err.message);
    }
    return null;
  }
};

window.RawanAPI = RawanAPI;


Checkout.placeOrderAsync = async function(formData) {
  const serverPayload = {
    name: formData.name,
    phone: formData.phone,
    email: formData.email,
    address: formData.address,
    city: formData.city,
    province: formData.province,
    paymentMethod: formData.payment,
    items: Store.cart.map(item => ({
      productId: item.id,
      id: item.id,
      title: item.name,
      size: item.size,
      color: item.color,
      quantity: item.qty,
      price: item.price,
      image: item.image
    })),
    notes: formData.notes
  };

  const serverResult = await RawanAPI.placeOrder(serverPayload);
  let order;
  if (serverResult && serverResult.success && serverResult.order) {
    order = serverResult.order;
    Store.orders.unshift(order);
  } else {
    order = Checkout.placeOrder(formData);
  }

  Store.cart = [];
  Store.appliedCoupon = null;
  Store.save();
  if (window.Cart && Cart.updateUI) Cart.updateUI();
  return order;
};

Tracking.findAsync = async function(query) {
  const serverOrder = await RawanAPI.getOrder(query);
  if (serverOrder) return serverOrder;
  return Tracking.find(query);
};
