/**
 * ==============================================================================
 * Leather Queen Footwear - Full-Stack Server
 * ==============================================================================
 * - Serves the storefront (public/) and the REST API from one Node process.
 * - Storage: MongoDB Atlas when MONGODB_URI is set (required for Render/free
 *   hosting, whose disk is wiped on every restart). Without MONGODB_URI it
 *   falls back to local JSON files in ./data (fine for local testing only).
 * - All prices, discounts, Elite charges and stock are computed on the server.
 *
 * Environment variables:
 *   MONGODB_URI     MongoDB Atlas connection string (production)
 *   ADMIN_USER      Admin username (default: admin)
 *   ADMIN_PASSWORD  Initial admin password (default: LEATHER QUEEN2026 - change it!)
 *   SESSION_SECRET  Random string used to sign admin login tokens
 *   PORT            Port (Render sets this automatically)
 * ==============================================================================
 */
'use strict';

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const PORT = process.env.PORT || 5000;
// Railway's MongoDB service provides MONGO_URL automatically; MONGODB_URI (Atlas etc.) also works
const MONGODB_URI = (process.env.MONGODB_URI || process.env.MONGO_URL || '').trim();
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'LEATHER QUEEN2026';
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.createHash('sha256').update('leatherqueen-session:' + ADMIN_PASSWORD).digest('hex');
const DATA_DIR = path.join(__dirname, 'data');
const PUBLIC_DIR = path.join(__dirname, 'public');
const SEED_FILE = path.join(__dirname, 'seed', 'products.json');
const POSTS_SEED_FILE = path.join(__dirname, 'seed', 'posts.json');
const UPLOAD_DIR = path.join(PUBLIC_DIR, 'images', 'uploads');

const ORDER_STATUSES = ['pending', 'confirmed', 'packed', 'dispatched', 'delivered', 'cancelled'];
const MEMBERSHIP_TYPES = ['Standard', 'Founding', 'ManualVIP'];
const ELITE_TYPES = ['Founding', 'ManualVIP'];

const DEFAULT_SETTINGS = {
  whatsappNumber: '923001234567',
  freeDeliveryThreshold: 4999,
  deliveryCharge: 250,
  advanceDeposit: 200,
  highValueThreshold: 15000,
  bankDiscountPercent: 5,
  remoteCities: [
    'Quetta', 'Gwadar', 'Turbat', 'Khuzdar', 'Dalbandin', 'Nushki', 'Hub', 'Chaman',
    'Zhob', 'Loralai', 'Sibi', 'Kalat', 'Panjgur', 'Washuk', 'Chitral', 'Upper Dir',
    'Dir', 'Kohistan', 'Gilgit', 'Skardu', 'Chilas', 'Hunza', 'Ghizer', 'Neelum'
  ],
  bank: {
    bankName: 'HBL',
    accountName: 'Leather Queen Footwear',
    accountNumber: '0012345678901',
    iban: 'PK36HABB0012345678901',
    easyPaisa: '',
    jazzCash: ''
  },
  coupons: {
    QUEEN10: { type: 'percent', value: 10, label: '10% off - Launch Offer' },
    FLAT1000: { type: 'flat', value: 1000, label: 'Rs. 1,000 off' },
    FIRST500: { type: 'flat', value: 500, label: 'Rs. 500 off - First Order' },
    EXEC15: { type: 'percent', value: 15, label: '15% off - Executive VIP' }
  },
  countdown: { active: false, label: 'Limited Drop Ends In', endTime: null },
  drop: { active: true, title: 'Only 15 Executive Pairs Available.', pairs: 15 },
  elite: {
    foundingLimit: 20,          // first N new customers get free Founding Elite membership
    foundingActive: true,       // turn automatic Founding membership on/off
    chargeEnabled: true,        // charge non-members extra on Executive items
    chargePerItem: 500,         // Rs. per Executive pair (product can override)
    label: 'Elite Access Charge'
  },
  website: '',
  seeded: false,
  adminAuth: null               // { salt, hash } once the password is changed from the panel
};

/* ------------------------------------------------------------------------------
 * Storage layer: in-memory cache + MongoDB (production) or JSON files (local)
 * ------------------------------------------------------------------------------ */
const COLLECTIONS = ['products', 'orders', 'customers', 'images', 'posts', 'comments'];
const DOCS = ['settings', 'rto'];
const cache = { products: new Map(), orders: new Map(), customers: new Map(), images: new Map(), posts: new Map(), comments: new Map(), settings: null, rto: null };
let mongoDb = null;

function readFileJson(name, fallback) {
  const p = path.join(DATA_DIR, name);
  try {
    if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (err) {
    console.error(`Could not read ${name}:`, err.message);
  }
  return fallback;
}

function writeFileJson(name, data) {
  const p = path.join(DATA_DIR, name);
  const tmp = p + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf8');
  fs.renameSync(tmp, p);
}

const db = {
  all(c) { return [...cache[c].values()]; },
  get(c, id) { return cache[c].get(String(id)) || null; },
  async put(c, item) {
    const id = String(item.id);
    cache[c].set(id, item);
    if (mongoDb) await mongoDb.collection(c).replaceOne({ _id: id }, { ...item, _id: id }, { upsert: true });
    else writeFileJson(c + '.json', this.all(c));
  },
  async del(c, id) {
    id = String(id);
    cache[c].delete(id);
    if (mongoDb) await mongoDb.collection(c).deleteOne({ _id: id });
    else writeFileJson(c + '.json', this.all(c));
  },
  doc(k) { return cache[k]; },
  async setDoc(k, data) {
    cache[k] = data;
    if (mongoDb) await mongoDb.collection('kv').replaceOne({ _id: k }, { _id: k, data }, { upsert: true });
    else writeFileJson(k + '.json', data);
  }
};

async function initStorage() {
  if (MONGODB_URI) {
    const mongoose = require('mongoose');
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 15000, dbName: process.env.MONGODB_DB || 'leatherqueen' });
    mongoDb = mongoose.connection.db;
    for (const c of COLLECTIONS) {
      const docs = await mongoDb.collection(c).find({}).toArray();
      docs.forEach(d => { const id = String(d._id); delete d._id; cache[c].set(id, d); });
    }
    const kv = await mongoDb.collection('kv').find({}).toArray();
    kv.forEach(d => { if (DOCS.includes(d._id)) cache[d._id] = d.data; });
    console.log('>> Storage: MongoDB connected (data is permanent).');
  } else {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    for (const c of COLLECTIONS) {
      readFileJson(c + '.json', []).forEach(item => cache[c].set(String(item.id), item));
    }
    for (const d of DOCS) cache[d] = readFileJson(d + '.json', null);
    console.log('>> Storage: local JSON files in ./data');
    console.log('   WARNING: on Render/free hosting this data is wiped on restart. Set MONGODB_URI for production.');
  }

  // Settings: merge defaults so newly added keys always exist
  const stored = cache.settings || {};
  const merged = { ...DEFAULT_SETTINGS, ...stored };
  for (const key of ['bank', 'countdown', 'drop', 'elite']) {
    merged[key] = { ...DEFAULT_SETTINGS[key], ...(stored[key] || {}) };
  }
  if (!stored.coupons) merged.coupons = { ...DEFAULT_SETTINGS.coupons };
  await db.setDoc('settings', merged);
  if (!cache.rto) await db.setDoc('rto', {});

  // First run: seed the catalogue once (admin can then edit/delete freely)
  if (!merged.seeded) {
    if (cache.products.size === 0 && fs.existsSync(SEED_FILE)) {
      const seed = JSON.parse(fs.readFileSync(SEED_FILE, 'utf8'));
      let i = 0;
      for (const p of seed) await db.put('products', normalizeProduct({ ...p, sort: i++ }, null));
      console.log(`>> Seeded ${seed.length} products from seed/products.json`);
    }
    merged.seeded = true;
    await db.setDoc('settings', merged);
  }

  // Journal posts: seed once so the Journal is never empty (admin can edit/delete freely)
  if (!merged.postsSeeded) {
    if (cache.posts.size === 0 && fs.existsSync(POSTS_SEED_FILE)) {
      try {
        const seedPosts = JSON.parse(fs.readFileSync(POSTS_SEED_FILE, 'utf8'));
        for (const p of seedPosts) await db.put('posts', normalizePost(p, null));
        console.log(`>> Seeded ${seedPosts.length} journal posts from seed/posts.json`);
      } catch (err) { console.error('Could not seed posts:', err.message); }
    }
    merged.postsSeeded = true;
    await db.setDoc('settings', merged);
  }
}

/* ------------------------------------------------------------------------------
 * Helpers
 * ------------------------------------------------------------------------------ */
const settings = () => cache.settings;
const toInt = (v, def = 0) => { const n = parseInt(v, 10); return Number.isFinite(n) ? n : def; };
const toNum = (v, def = 0) => { const n = Number(v); return Number.isFinite(n) ? n : def; };
const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
const cleanText = (v, max = 300) => String(v == null ? '' : v).replace(/[<>]/g, '').trim().slice(0, max);
const normCode = c => String(c || '').toUpperCase().replace(/[^A-Z0-9_-]/g, '').slice(0, 30);

function normPhone(v) {
  let d = String(v || '').replace(/\D/g, '');
  if (d.startsWith('92') && d.length === 12) d = '0' + d.slice(2);
  if (d.length === 10 && d.startsWith('3')) d = '0' + d;
  return /^03\d{9}$/.test(d) ? d : '';
}

function slugify(s) {
  return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 50) || 'product';
}

function countFounding() {
  return db.all('customers').filter(c => c.membershipType === 'Founding').length;
}

function eliteChargeFor(product, s) {
  if (product.collection !== 'executive') return 0;
  const override = product.eliteCharge;
  if (override !== null && override !== undefined && override !== '') return Math.max(0, toInt(override));
  return Math.max(0, toInt(s.elite.chargePerItem));
}

function normalizeProduct(input, existing) {
  const base = existing || {};
  const stockIn = input.stock || base.stock || {};
  const stock = {};
  Object.entries(stockIn).forEach(([size, qty]) => {
    const sz = String(size).replace(/[^0-9.]/g, '').slice(0, 5);
    if (sz) stock[sz] = Math.max(0, toInt(qty));
  });
  const arr = v => (Array.isArray(v) ? v : String(v || '').split(',')).map(x => cleanText(x, 60)).filter(Boolean);
  const colors = (Array.isArray(input.colors) ? input.colors : base.colors || []).map(c => ({
    name: cleanText(c.name, 40),
    label: cleanText(c.label || c.name, 40),
    hex: /^#[0-9a-fA-F]{3,8}$/.test(c.hex || '') ? c.hex : '#1A1A1A',
    image: (() => { const v = String(c.image || '').trim(); return /^(images\/|\/api\/images\/|https:\/\/)/.test(v) ? v : ''; })()
  })).filter(c => c.name);
  const images = (Array.isArray(input.images) ? input.images : base.images || [])
    .map(x => String(x || '').trim()).filter(x => /^(images\/|\/api\/images\/|https:\/\/)/.test(x)).slice(0, 8);
  const collection = (input.collection ?? base.collection) === 'executive' ? 'executive' : 'regular';
  const eliteChargeRaw = input.eliteCharge !== undefined ? input.eliteCharge : base.eliteCharge;
  return {
    id: base.id || input.id,
    name: cleanText(input.name ?? base.name, 80) || 'Untitled Product',
    collection,
    category: arr(input.category ?? base.category ?? ['women']),
    badge: cleanText(input.badge ?? base.badge ?? '', 20),
    heelType: ['stiletto', 'block', 'kitten', 'flat'].includes(input.heelType) ? input.heelType : (base.heelType || 'flat'),
    heelHeight: cleanText(input.heelHeight ?? base.heelHeight ?? '', 20),
    occasions: arr(input.occasions ?? base.occasions ?? []),
    price: Math.max(0, toInt(input.price ?? base.price)),
    originalPrice: toInt(input.originalPrice ?? base.originalPrice, 0) || null,
    promise: cleanText(input.promise ?? base.promise ?? '', 200),
    fitIndicator: ['tts', 'small', 'large'].includes(input.fitIndicator) ? input.fitIndicator : (base.fitIndicator || 'tts'),
    fitLabel: cleanText(input.fitLabel ?? base.fitLabel ?? 'True to Size', 40),
    recommended: !!(input.recommended ?? base.recommended),
    active: input.active === undefined ? (base.active !== false) : !!input.active,
    colors: colors.length ? colors : [{ name: 'Black', label: 'Black', hex: '#1A1A1A' }],
    stock,
    images,
    video: (() => { const v = String(input.video !== undefined ? input.video : (base.video || '')).trim(); return /^(images\/|\/api\/images\/|https:\/\/)/.test(v) ? v.slice(0, 500) : ''; })(),
    material: cleanText(input.material ?? base.material ?? '', 1000),
    care: cleanText(input.care ?? base.care ?? '', 1000),
    reviews: Array.isArray(input.reviews) ? input.reviews : (base.reviews || []),
    eliteCharge: eliteChargeRaw === '' || eliteChargeRaw === null || eliteChargeRaw === undefined ? null : Math.max(0, toInt(eliteChargeRaw)),
    sort: toInt(input.sort ?? base.sort, 999),
    createdAt: base.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

function publicSettings() {
  const s = settings();
  return {
    whatsappNumber: s.whatsappNumber,
    freeDeliveryThreshold: s.freeDeliveryThreshold,
    deliveryCharge: s.deliveryCharge,
    advanceDeposit: s.advanceDeposit,
    highValueThreshold: s.highValueThreshold,
    bankDiscountPercent: s.bankDiscountPercent,
    remoteCities: s.remoteCities,
    bank: s.bank,
    countdown: s.countdown,
    drop: s.drop,
    elite: {
      chargeEnabled: s.elite.chargeEnabled,
      chargePerItem: s.elite.chargePerItem,
      label: s.elite.label,
      foundingActive: s.elite.foundingActive,
      foundingSlotsLeft: Math.max(0, s.elite.foundingLimit - countFounding())
    },
    website: s.website
  };
}

function publicProducts() {
  const s = settings();
  return db.all('products')
    .filter(p => p.active !== false)
    .sort((a, b) => (a.sort - b.sort) || String(a.createdAt).localeCompare(String(b.createdAt)))
    .map(p => ({ ...p, eliteChargeEffective: eliteChargeFor(p, s) }));
}

/**
 * Single source of truth for pricing. Used by both /quote and /orders.
 * Order of operations: subtotal -> coupon -> bank discount -> Elite charge -> delivery.
 */
function computeQuote({ phone, city, paymentMethod, items, coupon }) {
  const s = settings();
  const errors = [];
  const lines = [];

  (Array.isArray(items) ? items : []).slice(0, 30).forEach(it => {
    const p = db.get('products', it.productId);
    if (!p || p.active === false) { errors.push(`"${cleanText(it.name || it.productId, 60)}" is no longer available`); return; }
    const size = String(it.size);
    const qty = clamp(toInt(it.qty, 1), 1, 10);
    const inStock = p.stock ? p.stock[size] : undefined;
    if (inStock === undefined) { errors.push(`${p.name}: size EU ${size} is not available`); return; }
    if (inStock < qty) { errors.push(`${p.name} (EU ${size}): only ${inStock} pair(s) left in stock`); return; }
    lines.push({
      productId: p.id,
      name: p.name,
      size,
      color: cleanText(it.color, 40),
      qty,
      price: p.price,
      image: (p.images && p.images[0]) || '',
      collection: p.collection,
      eliteCharge: eliteChargeFor(p, s)
    });
  });

  const cleanPhone = normPhone(phone);
  const customer = cleanPhone ? db.get('customers', cleanPhone) : null;
  const foundingSlotsLeft = Math.max(0, s.elite.foundingLimit - countFounding());
  const isEliteExisting = !!(customer && ELITE_TYPES.includes(customer.membershipType));
  const willBecomeFounding = !!(cleanPhone && !customer && s.elite.foundingActive && foundingSlotsLeft > 0);
  const isElite = isEliteExisting || willBecomeFounding;

  const subtotal = lines.reduce((sum, l) => sum + l.price * l.qty, 0);
  const hasExecutive = lines.some(l => l.collection === 'executive');

  let couponDiscount = 0;
  let couponInfo = null;
  const code = normCode(coupon);
  if (code) {
    const c = s.coupons[code];
    if (c) {
      couponDiscount = c.type === 'percent' ? Math.round(subtotal * toNum(c.value) / 100) : Math.min(toInt(c.value), subtotal);
      couponInfo = { code, label: c.label };
    } else {
      errors.push(`Coupon "${code}" is not valid`);
    }
  }
  const afterCoupon = Math.max(0, subtotal - couponDiscount);
  const bankDiscount = paymentMethod === 'bank' ? Math.round(afterCoupon * toNum(s.bankDiscountPercent) / 100) : 0;

  const eliteChargeFull = s.elite.chargeEnabled ? lines.reduce((sum, l) => sum + l.eliteCharge * l.qty, 0) : 0;
  const eliteCharge = isElite ? 0 : eliteChargeFull;
  const eliteSaved = isElite ? eliteChargeFull : 0;

  const delivery = lines.length === 0 ? 0 : (afterCoupon >= s.freeDeliveryThreshold ? 0 : toInt(s.deliveryCharge));
  const total = Math.max(0, afterCoupon - bankDiscount + eliteCharge + delivery);

  const rtoRecord = cleanPhone ? (db.doc('rto') || {})[cleanPhone] : null;
  const isRemote = !!city && s.remoteCities.some(c => c.toLowerCase() === String(city).trim().toLowerCase());
  const isHighValue = total > s.highValueThreshold;
  const advanceReasons = [];
  if (paymentMethod !== 'bank') {
    if (rtoRecord) advanceReasons.push('rto');
    if (isRemote) advanceReasons.push('remote');
    if (isHighValue) advanceReasons.push('highValue');
  }
  const advanceRequired = advanceReasons.length > 0;

  return {
    lines, errors,
    subtotal, couponDiscount, coupon: couponInfo, bankDiscount,
    eliteCharge, eliteChargeFull, eliteSaved, eliteLabel: s.elite.label,
    delivery, total,
    advanceRequired, advanceAmount: advanceRequired ? toInt(s.advanceDeposit) : 0, advanceReasons,
    hasExecutive,
    membership: {
      isElite,
      type: isEliteExisting ? customer.membershipType : (willBecomeFounding ? 'Founding' : 'Standard'),
      willBecomeFounding,
      foundingSlotsLeft
    }
  };
}

function trackingView(o) {
  return {
    id: o.id, date: o.date, status: o.status,
    customer: { name: o.customer.name, city: o.customer.city },
    items: o.items.map(i => ({ name: i.name, size: i.size, qty: i.qty, color: i.color })),
    total: o.total, paymentMethod: o.paymentMethod,
    courier: o.courier, trackingId: o.trackingId, timeline: o.timeline,
    advanceRequired: o.advanceRequired, advanceAmount: o.advanceAmount
  };
}

/* ------------------------------------------------------------------------------
 * Admin authentication (signed bearer tokens, password stored as scrypt hash)
 * ------------------------------------------------------------------------------ */
function hashPassword(pass, salt) {
  return crypto.scryptSync(String(pass), salt, 32).toString('hex');
}

function checkPassword(user, pass) {
  if (String(user) !== ADMIN_USER) return false;
  const auth = settings().adminAuth;
  if (auth && auth.salt && auth.hash) {
    const h = hashPassword(pass, auth.salt);
    return crypto.timingSafeEqual(Buffer.from(h, 'hex'), Buffer.from(auth.hash, 'hex'));
  }
  const a = Buffer.from(String(pass));
  const b = Buffer.from(ADMIN_PASSWORD);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function tokenSecret() {
  const auth = settings().adminAuth;
  return SESSION_SECRET + ':' + (auth ? auth.hash : 'env');
}

function signToken() {
  const payload = Buffer.from(JSON.stringify({ u: ADMIN_USER, exp: Date.now() + 7 * 24 * 3600 * 1000 })).toString('base64url');
  const sig = crypto.createHmac('sha256', tokenSecret()).update(payload).digest('base64url');
  return payload + '.' + sig;
}

function verifyToken(token) {
  const [payload, sig] = String(token || '').split('.');
  if (!payload || !sig) return false;
  const expected = crypto.createHmac('sha256', tokenSecret()).update(payload).digest('base64url');
  if (sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return data.exp > Date.now();
  } catch { return false; }
}

function requireAdmin(req, res, next) {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!verifyToken(token)) return res.status(401).json({ success: false, error: 'Login required' });
  next();
}

const loginAttempts = new Map();
function loginRateLimited(ip) {
  const now = Date.now();
  const rec = loginAttempts.get(ip) || { count: 0, first: now };
  if (now - rec.first > 15 * 60 * 1000) { rec.count = 0; rec.first = now; }
  loginAttempts.set(ip, rec);
  return rec;
}

/* ------------------------------------------------------------------------------
 * App
 * ------------------------------------------------------------------------------ */
const app = express();
app.set('trust proxy', 1);
app.use(cors());
app.use(express.json({ limit: '9mb' }));
app.use((req, res, next) => { res.setHeader('X-Content-Type-Options', 'nosniff'); next(); });

const wrap = fn => (req, res) => Promise.resolve(fn(req, res)).catch(err => {
  console.error(err);
  res.status(500).json({ success: false, error: 'Server error, please try again.' });
});

/* ---------- Public API ---------- */
app.get('/api/health', (req, res) => {
  res.json({ status: 'online', storage: mongoDb ? 'mongodb' : 'local-files', products: cache.products.size, orders: cache.orders.size, time: new Date().toISOString() });
});

app.get('/api/bootstrap', (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.json({ success: true, products: publicProducts(), settings: publicSettings() });
});

app.get('/api/images/:id', (req, res) => {
  const img = db.get('images', req.params.id);
  if (!img) return res.status(404).end();
  res.setHeader('Content-Type', img.mime);
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  const buf = Buffer.from(img.data, 'base64');
  res.setHeader('Accept-Ranges', 'bytes');
  // Range support is required so videos play (and seek) on iPhone/Safari
  const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
  if (range && (range[1] || range[2])) {
    let start = range[1] ? parseInt(range[1], 10) : buf.length - parseInt(range[2], 10);
    let end = range[1] && range[2] ? parseInt(range[2], 10) : buf.length - 1;
    start = Math.max(0, start); end = Math.min(buf.length - 1, end);
    if (start > end) { res.setHeader('Content-Range', `bytes */${buf.length}`); return res.status(416).end(); }
    res.status(206);
    res.setHeader('Content-Range', `bytes ${start}-${end}/${buf.length}`);
    res.setHeader('Content-Length', end - start + 1);
    return res.end(buf.subarray(start, end + 1));
  }
  res.setHeader('Content-Length', buf.length);
  res.end(buf);
});

app.post('/api/coupons/check', (req, res) => {
  const code = normCode(req.body.code);
  const c = settings().coupons[code];
  if (!c) return res.json({ ok: false });
  res.json({ ok: true, code, type: c.type, value: c.value, label: c.label });
});

app.post('/api/checkout/quote', (req, res) => {
  const q = computeQuote(req.body || {});
  res.json({ success: true, ...q });
});

app.post('/api/orders', wrap(async (req, res) => {
  const b = req.body || {};
  const phone = normPhone(b.phone);
  const name = cleanText(b.name, 80);
  const address = cleanText(b.address, 300);
  const city = cleanText(b.city, 60);
  const paymentMethod = b.paymentMethod === 'bank' ? 'bank' : 'cod';
  const fieldErrors = [];
  if (!name) fieldErrors.push('Name is required');
  if (!phone) fieldErrors.push('Please enter a valid phone number (03xx-xxxxxxx)');
  if (!address) fieldErrors.push('Address is required');
  if (!city) fieldErrors.push('City is required');
  if (fieldErrors.length) return res.status(400).json({ success: false, errors: fieldErrors });

  // Everything below until the first await runs synchronously, so two orders
  // can never oversell the same stock or take the same Founding slot.
  const q = computeQuote({ phone, city, paymentMethod, items: b.items, coupon: b.coupon });
  if (q.errors.length) return res.status(409).json({ success: false, errors: q.errors });
  if (!q.lines.length) return res.status(400).json({ success: false, errors: ['Your cart is empty'] });

  const now = new Date().toISOString();
  const s = settings();

  const touchedProducts = new Map();
  for (const l of q.lines) {
    const p = touchedProducts.get(l.productId) || { ...db.get('products', l.productId), stock: { ...db.get('products', l.productId).stock } };
    p.stock[l.size] = Math.max(0, (p.stock[l.size] || 0) - l.qty);
    touchedProducts.set(l.productId, p);
  }
  for (const p of touchedProducts.values()) cache.products.set(p.id, p);

  let customer = db.get('customers', phone);
  let becameFounding = false;
  if (!customer) {
    customer = {
      id: phone, phone, name, email: cleanText(b.email, 120), city,
      membershipType: 'Standard', foundingNumber: null, eliteSince: null,
      ordersCount: 0, totalSpend: 0, firstOrderAt: now, lastOrderAt: now
    };
    if (q.membership.willBecomeFounding) {
      customer.membershipType = 'Founding';
      customer.foundingNumber = countFounding() + 1;
      customer.eliteSince = now;
      becameFounding = true;
    }
  } else {
    customer = { ...customer, name, city };
  }
  customer.ordersCount += 1;
  customer.totalSpend += q.total;
  customer.lastOrderAt = now;
  cache.customers.set(phone, customer);

  let id;
  do { id = 'RW-' + crypto.randomInt(100000, 1000000); } while (cache.orders.has(id));

  const order = {
    id, date: now, status: 'pending',
    customer: {
      name, phone, email: cleanText(b.email, 120), address, city,
      province: cleanText(b.province, 40), notes: cleanText(b.notes, 300)
    },
    items: q.lines,
    subtotal: q.subtotal,
    couponDiscount: q.couponDiscount, coupon: q.coupon,
    bankDiscount: q.bankDiscount,
    discount: q.couponDiscount + q.bankDiscount,
    eliteCharge: q.eliteCharge, eliteSaved: q.eliteSaved,
    delivery: q.delivery, total: q.total,
    paymentMethod,
    advanceRequired: q.advanceRequired, advanceAmount: q.advanceAmount, advanceReasons: q.advanceReasons,
    membershipAtOrder: customer.membershipType, becameFounding,
    courier: null, trackingId: null, restocked: false,
    timeline: { pending: now }
  };
  cache.orders.set(id, order);

  const execPairs = q.lines.filter(l => l.collection === 'executive').reduce((n, l) => n + l.qty, 0);
  let settingsChanged = false;
  if (execPairs && s.drop.pairs > 0) {
    s.drop = { ...s.drop, pairs: Math.max(0, s.drop.pairs - execPairs) };
    settingsChanged = true;
  }

  // Persist
  for (const p of touchedProducts.values()) await db.put('products', p);
  await db.put('customers', customer);
  await db.put('orders', order);
  if (settingsChanged) await db.setDoc('settings', s);

  res.status(201).json({ success: true, order, becameFounding, membership: customer.membershipType });
}));

app.get('/api/track', (req, res) => {
  const q = String(req.query.q || '').trim().toUpperCase();
  if (!q) return res.status(400).json({ success: false });
  let order = db.get('orders', q);
  if (!order) {
    const phone = normPhone(q);
    if (phone) {
      order = db.all('orders').filter(o => o.customer.phone === phone).sort((a, b) => b.date.localeCompare(a.date))[0] || null;
    }
  }
  if (!order) return res.status(404).json({ success: false });
  res.json({ success: true, order: trackingView(order) });
});

/* ---------- Admin API ---------- */
app.post('/api/admin/login', (req, res) => {
  const rec = loginRateLimited(req.ip);
  if (rec.count >= 8) return res.status(429).json({ success: false, error: 'Too many attempts, please try again after 15 minutes' });
  if (!checkPassword(req.body.user, req.body.pass)) {
    rec.count += 1;
    return res.status(401).json({ success: false, error: 'Wrong username or password' });
  }
  rec.count = 0;
  res.json({ success: true, token: signToken(), usingDefaultPassword: !settings().adminAuth && !process.env.ADMIN_PASSWORD });
});

app.get('/api/admin/data', requireAdmin, (req, res) => {
  const s = settings();
  const { adminAuth, ...safeSettings } = s;
  res.json({
    success: true,
    storage: mongoDb ? 'mongodb' : 'local-files',
    products: db.all('products').sort((a, b) => a.sort - b.sort),
    orders: db.all('orders').sort((a, b) => b.date.localeCompare(a.date)),
    customers: db.all('customers').sort((a, b) => String(b.lastOrderAt).localeCompare(String(a.lastOrderAt))),
    rto: db.doc('rto') || {},
    settings: { ...safeSettings, foundingTaken: countFounding() }
  });
});

app.post('/api/admin/products', requireAdmin, wrap(async (req, res) => {
  let id = slugify(req.body.name);
  while (cache.products.has(id)) id = slugify(req.body.name) + '-' + crypto.randomInt(100, 1000);
  const product = normalizeProduct({ ...req.body, id }, null);
  product.id = id;
  await db.put('products', product);
  res.status(201).json({ success: true, product });
}));

app.put('/api/admin/products/:id', requireAdmin, wrap(async (req, res) => {
  const existing = db.get('products', req.params.id);
  if (!existing) return res.status(404).json({ success: false, error: 'Product not found' });
  const product = normalizeProduct(req.body, existing);
  await db.put('products', product);
  res.json({ success: true, product });
}));

app.delete('/api/admin/products/:id', requireAdmin, wrap(async (req, res) => {
  const existing = db.get('products', req.params.id);
  if (!existing) return res.status(404).json({ success: false });
  for (const url of existing.images || []) {
    const m = /^\/api\/images\/([\w-]+)$/.exec(url);
    if (m) await db.del('images', m[1]);
  }
  await db.del('products', existing.id);
  res.json({ success: true });
}));

app.post('/api/admin/images', requireAdmin, wrap(async (req, res) => {
  const m = /^data:((?:image|video)\/(jpeg|png|webp|gif|mp4|webm));base64,([A-Za-z0-9+/=]+)$/.exec(String(req.body.dataUrl || ''));
  const isVideo = !!m && m[1].startsWith('video/');
  if (!m) return res.status(400).json({ success: false, error: 'Only JPG, PNG, WEBP, GIF images or MP4/WEBM videos are allowed' });
  const bytes = Buffer.byteLength(m[3], 'base64');
  if (isVideo ? bytes > 6 * 1024 * 1024 : bytes > 4.5 * 1024 * 1024) return res.status(413).json({ success: false, error: isVideo ? 'Video must be smaller than 6 MB (use a short 5-10 second clip)' : 'Image must be smaller than 4.5 MB' });
  const id = crypto.randomBytes(10).toString('hex');
  // With MongoDB (live site) images are stored in the database: permanent, and visible to everyone.
  // Without MongoDB (local testing) they are saved as real files in public/images/uploads.
  if (mongoDb) {
    await db.put('images', { id, mime: m[1], data: m[3], createdAt: new Date().toISOString() });
    return res.status(201).json({ success: true, url: '/api/images/' + id });
  }
  const ext = m[2] === 'jpeg' ? 'jpg' : m[2];
  if (isVideo && ext === 'gif') return res.status(400).json({ success: false, error: 'Invalid video type' });
  const fileName = `upload-${Date.now()}-${id.slice(0, 6)}.${ext}`;
  try {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    fs.writeFileSync(path.join(UPLOAD_DIR, fileName), Buffer.from(m[3], 'base64'));
    return res.status(201).json({ success: true, url: 'images/uploads/' + fileName });
  } catch (err) {
    console.error('Upload folder not writable, saving image in database instead:', err.message);
    await db.put('images', { id, mime: m[1], data: m[3], createdAt: new Date().toISOString() });
    return res.status(201).json({ success: true, url: '/api/images/' + id });
  }
}));

/* ---------- Blog: posts and comments ---------- */
const publicPost = p => ({ id: p.id, title: p.title, category: p.category, excerpt: p.excerpt, body: p.body, image: p.image, emoji: p.emoji, readTime: p.readTime, createdAt: p.createdAt });
const commentsOf = postId => db.all('comments').filter(c => c.postId === postId).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
const commentView = c => ({ id: c.id, name: c.name, text: c.text, createdAt: c.createdAt, reply: c.reply || null, repliedAt: c.repliedAt || null });

function normalizePost(input, existing) {
  const base = existing || {};
  return {
    id: base.id || input.id,
    title: cleanText(input.title ?? base.title, 140) || 'Untitled Post',
    category: ['craft', 'style', 'care', 'brand'].includes(input.category) ? input.category : (base.category || 'style'),
    excerpt: cleanText(input.excerpt ?? base.excerpt ?? '', 300),
    body: String(input.body ?? base.body ?? '').replace(/[<>]/g, '').trim().slice(0, 12000),
    image: (() => { const v = String(input.image ?? base.image ?? '').trim(); return /^(images\/|\/api\/images\/|https:\/\/)/.test(v) ? v : ''; })(),
    emoji: cleanText(input.emoji ?? base.emoji ?? '', 8),
    readTime: Math.max(1, toInt(input.readTime ?? base.readTime, 3)),
    active: input.active === undefined ? (base.active !== false) : !!input.active,
    createdAt: base.createdAt || (input.createdAt && !isNaN(Date.parse(input.createdAt)) ? new Date(input.createdAt).toISOString() : new Date().toISOString()),
    updatedAt: new Date().toISOString()
  };
}

app.get('/api/posts', (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const posts = db.all('posts').filter(p => p.active !== false).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  res.json({ success: true, posts: posts.map(p => ({ ...publicPost(p), commentCount: commentsOf(p.id).length })) });
});

app.get('/api/posts/:id', (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const p = db.get('posts', req.params.id);
  if (!p || p.active === false) return res.status(404).json({ success: false, error: 'Post not found' });
  res.json({ success: true, post: publicPost(p), comments: commentsOf(p.id).map(commentView) });
});

// Customers can comment right away, no approval needed
const commentTimes = new Map();
app.post('/api/posts/:id/comments', wrap(async (req, res) => {
  const p = db.get('posts', req.params.id);
  if (!p || p.active === false) return res.status(404).json({ success: false, error: 'Post not found' });
  const name = cleanText(req.body.name, 60);
  const text = cleanText(req.body.text, 1000);
  if (!name || !text) return res.status(400).json({ success: false, error: 'Please enter your name and comment' });
  const last = commentTimes.get(req.ip) || 0;
  if (Date.now() - last < 3000) return res.status(429).json({ success: false, error: 'Please wait a few seconds before commenting again' });
  commentTimes.set(req.ip, Date.now());
  const comment = { id: 'c' + Date.now().toString(36) + crypto.randomBytes(3).toString('hex'), postId: p.id, name, text, createdAt: new Date().toISOString(), reply: null, repliedAt: null };
  await db.put('comments', comment);
  res.status(201).json({ success: true, comment: commentView(comment) });
}));

app.get('/api/admin/posts', requireAdmin, (req, res) => {
  const posts = db.all('posts').sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  res.json({ success: true, posts, comments: db.all('comments').sort((a, b) => b.createdAt.localeCompare(a.createdAt)) });
});

app.post('/api/admin/posts', requireAdmin, wrap(async (req, res) => {
  let id = slugify(req.body.title);
  while (cache.posts.has(id)) id = slugify(req.body.title) + '-' + crypto.randomInt(100, 1000);
  const post = normalizePost({ ...req.body, id }, null);
  post.id = id;
  await db.put('posts', post);
  res.status(201).json({ success: true, post });
}));

app.put('/api/admin/posts/:id', requireAdmin, wrap(async (req, res) => {
  const existing = db.get('posts', req.params.id);
  if (!existing) return res.status(404).json({ success: false, error: 'Post not found' });
  const post = normalizePost(req.body, existing);
  await db.put('posts', post);
  res.json({ success: true, post });
}));

app.delete('/api/admin/posts/:id', requireAdmin, wrap(async (req, res) => {
  const existing = db.get('posts', req.params.id);
  if (!existing) return res.status(404).json({ success: false });
  for (const c of commentsOf(existing.id)) await db.del('comments', c.id);
  await db.del('posts', existing.id);
  res.json({ success: true });
}));

app.post('/api/admin/comments/:id/reply', requireAdmin, wrap(async (req, res) => {
  const c = db.get('comments', req.params.id);
  if (!c) return res.status(404).json({ success: false, error: 'Comment not found' });
  const reply = cleanText(req.body.reply, 1000);
  const updated = { ...c, reply: reply || null, repliedAt: reply ? new Date().toISOString() : null };
  await db.put('comments', updated);
  res.json({ success: true, comment: updated });
}));

app.delete('/api/admin/comments/:id', requireAdmin, wrap(async (req, res) => {
  if (!db.get('comments', req.params.id)) return res.status(404).json({ success: false });
  await db.del('comments', req.params.id);
  res.json({ success: true });
}));

app.patch('/api/admin/orders/:id', requireAdmin, wrap(async (req, res) => {
  const existing = db.get('orders', req.params.id);
  if (!existing) return res.status(404).json({ success: false, error: 'Order not found' });
  const order = { ...existing, timeline: { ...(existing.timeline || {}) } };
  const now = new Date().toISOString();
  const changedProducts = [];

  if (req.body.status !== undefined) {
    const status = String(req.body.status).toLowerCase();
    if (!ORDER_STATUSES.includes(status)) return res.status(400).json({ success: false, error: 'Invalid status' });
    order.status = status;
    order.timeline[status] = now;
    // Put stock back once when an order is cancelled
    if (status === 'cancelled' && !order.restocked) {
      for (const l of order.items) {
        const p = db.get('products', l.productId);
        if (p) {
          const upd = { ...p, stock: { ...p.stock, [l.size]: (p.stock[l.size] || 0) + l.qty } };
          cache.products.set(p.id, upd);
          changedProducts.push(upd);
        }
      }
      order.restocked = true;
    }
  }
  if (req.body.courier !== undefined) order.courier = cleanText(req.body.courier, 30) || null;
  if (req.body.trackingId !== undefined) {
    order.trackingId = cleanText(req.body.trackingId, 60) || null;
    if (order.trackingId && ['confirmed', 'packed'].includes(order.status)) {
      order.status = 'dispatched';
      order.timeline.dispatched = now;
    }
  }
  for (const p of changedProducts) await db.put('products', p);
  await db.put('orders', order);
  res.json({ success: true, order });
}));

app.put('/api/admin/settings', requireAdmin, wrap(async (req, res) => {
  const s = { ...settings() };
  const b = req.body || {};
  const numKeys = ['freeDeliveryThreshold', 'deliveryCharge', 'advanceDeposit', 'highValueThreshold', 'bankDiscountPercent'];
  numKeys.forEach(k => { if (b[k] !== undefined) s[k] = Math.max(0, toNum(b[k], s[k])); });
  if (b.whatsappNumber !== undefined) s.whatsappNumber = String(b.whatsappNumber).replace(/\D/g, '').slice(0, 15) || s.whatsappNumber;
  if (b.website !== undefined) s.website = cleanText(b.website, 200);
  if (Array.isArray(b.remoteCities)) s.remoteCities = b.remoteCities.map(c => cleanText(c, 40)).filter(Boolean);
  if (b.bank) s.bank = { ...s.bank, ...Object.fromEntries(Object.entries(b.bank).map(([k, v]) => [k, cleanText(v, 60)])) };
  if (b.countdown) {
    s.countdown = {
      active: !!b.countdown.active,
      label: cleanText(b.countdown.label, 60),
      endTime: b.countdown.endTime && !isNaN(Date.parse(b.countdown.endTime)) ? new Date(b.countdown.endTime).toISOString() : null
    };
  }
  if (b.drop) s.drop = { active: !!b.drop.active, title: cleanText(b.drop.title, 100), pairs: Math.max(0, toInt(b.drop.pairs)) };
  if (b.elite) {
    s.elite = {
      ...s.elite,
      foundingLimit: b.elite.foundingLimit !== undefined ? Math.max(0, toInt(b.elite.foundingLimit)) : s.elite.foundingLimit,
      foundingActive: b.elite.foundingActive !== undefined ? !!b.elite.foundingActive : s.elite.foundingActive,
      chargeEnabled: b.elite.chargeEnabled !== undefined ? !!b.elite.chargeEnabled : s.elite.chargeEnabled,
      chargePerItem: b.elite.chargePerItem !== undefined ? Math.max(0, toInt(b.elite.chargePerItem)) : s.elite.chargePerItem,
      label: b.elite.label !== undefined ? (cleanText(b.elite.label, 40) || s.elite.label) : s.elite.label
    };
  }
  if (b.coupons && typeof b.coupons === 'object') {
    const coupons = {};
    Object.entries(b.coupons).forEach(([code, c]) => {
      const k = normCode(code);
      if (!k || !c) return;
      coupons[k] = { type: c.type === 'flat' ? 'flat' : 'percent', value: Math.max(0, toNum(c.value)), label: cleanText(c.label, 60) };
    });
    s.coupons = coupons;
  }
  await db.setDoc('settings', s);
  const { adminAuth, ...safe } = s;
  res.json({ success: true, settings: { ...safe, foundingTaken: countFounding() } });
}));

app.post('/api/admin/password', requireAdmin, wrap(async (req, res) => {
  const pass = String(req.body.newPassword || '');
  if (pass.length < 8) return res.status(400).json({ success: false, error: 'Password must be at least 8 characters' });
  const salt = crypto.randomBytes(16).toString('hex');
  await db.setDoc('settings', { ...settings(), adminAuth: { salt, hash: hashPassword(pass, salt) } });
  res.json({ success: true, token: signToken() });
}));

app.post('/api/admin/rto', requireAdmin, wrap(async (req, res) => {
  const phone = normPhone(req.body.phone);
  if (!phone) return res.status(400).json({ success: false, error: 'Please enter a valid phone number' });
  const rto = { ...(db.doc('rto') || {}) };
  if (req.body.action === 'clear') {
    delete rto[phone];
  } else {
    const rec = rto[phone] || { count: 0, dates: [], reason: '' };
    rto[phone] = { count: rec.count + 1, dates: [...rec.dates, new Date().toISOString()], reason: cleanText(req.body.reason, 120) || rec.reason || 'Delivery refused' };
  }
  await db.setDoc('rto', rto);
  res.json({ success: true, rto });
}));

app.patch('/api/admin/customers/:phone', requireAdmin, wrap(async (req, res) => {
  const existing = db.get('customers', req.params.phone);
  if (!existing) return res.status(404).json({ success: false, error: 'Customer not found' });
  const type = req.body.membershipType;
  if (!MEMBERSHIP_TYPES.includes(type)) return res.status(400).json({ success: false, error: 'Invalid membership' });
  const customer = { ...existing, membershipType: type };
  if (ELITE_TYPES.includes(type) && !existing.eliteSince) customer.eliteSince = new Date().toISOString();
  if (!ELITE_TYPES.includes(type)) customer.eliteSince = null;
  if (type !== 'Founding') customer.foundingNumber = null;
  await db.put('customers', customer);
  res.json({ success: true, customer });
}));

app.use('/api', (req, res) => res.status(404).json({ success: false, error: 'API endpoint not found' }));

/* ---------- Static storefront ---------- */
app.use(express.static(PUBLIC_DIR, { extensions: ['html'] }));
app.get('*', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'index.html')));

/* ---------- Start ---------- */
initStorage()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log('====================================================');
      console.log(' Leather Queen Footwear server running');
      console.log(` Store:  http://localhost:${PORT}`);
      console.log(` Admin:  http://localhost:${PORT}/admin.html`);
      if (!process.env.ADMIN_PASSWORD && !settings().adminAuth) {
        console.log(' WARNING: default admin password in use. Change it from Admin > Store Settings.');
      }
      console.log('====================================================');
    });
  })
  .catch(err => {
    console.error('FATAL: storage could not start:', err.message);
    process.exit(1);
  });
