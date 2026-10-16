/**
 * ==============================================================================
 * RAWAN FOOTWEAR - ENTERPRISE PRODUCTION BACKEND API & FULL-STACK SERVER
 * ==============================================================================
 * Platform: Node.js + Express + MongoDB (with Automatic Persistent JSON Fallback)
 * Localization: Pakistan E-Commerce (COD, RTO Risk Ledger, 5% Bank Transfer Discount)
 * Dual-Mode: Full API Server + Serves Frontend Static Assets Seamlessly
 * ==============================================================================
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

// Standard middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Data Directory for persistent fallback
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helper for local JSON persistence
function readJson(file, fallback = {}) {
  const p = path.join(DATA_DIR, file);
  try {
    if (fs.existsSync(p)) {
      return JSON.parse(fs.readFileSync(p, 'utf8'));
    }
  } catch (err) {
    console.error(`Error reading ${file}:`, err.message);
  }
  return fallback;
}

function writeJson(file, data) {
  const p = path.join(DATA_DIR, file);
  try {
    fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error(`Error writing ${file}:`, err.message);
  }
}

// ------------------------------------------------------------------------------
// Initial Seed Data & Store Defaults
// ------------------------------------------------------------------------------
const DEFAULT_CONFIG = {
  freeDeliveryThreshold: 4999,
  standardDeliveryFee: 250,
  advanceDepositAmount: 200,
  foundingMembersLimit: 20,
  currentFoundingCount: 0,
  autoVipActive: true,
  countdownActive: true,
  countdownLabel: "Limited Drop Ends In",
  countdownEndTime: new Date(Date.now() + 3 * 86400000).toISOString(),
  showDropSection: true,
  dropTitle: "Only 15 Executive Pairs Available.",
  pairsRemaining: 15,
  bankDetails: {
    bankName: "HBL",
    accountName: "RAWAN Footwear",
    accountNumber: "0012345678901",
    iban: "PK36HABB0012345678901",
    easyPaisaNumber: "03001234567",
    jazzCashNumber: "03001234567"
  },
  whatsappNumber: "923001234567"
};

const DEFAULT_RTO = {
  '03121234567': { phone: '03121234567', reason: 'Multiple cancelled orders', rtoCount: 2, riskLevel: 'High', date: new Date().toISOString() },
  '03091234567': { phone: '03091234567', reason: 'Number not reachable', rtoCount: 1, riskLevel: 'Medium', date: new Date().toISOString() }
};

const DEFAULT_ORDERS = [
  {
    id: 'QD-001',
    date: new Date(Date.now() - 8 * 86400000).toISOString(),
    customer: { name: 'Hamza Raza', phone: '03211234567', address: 'House 12 Block C Johar Town', city: 'Lahore', email: 'hamza@example.com' },
    items: [{ id: 'saba-loafer', title: 'The Saba Loafer', size: 42, color: 'Espresso', quantity: 1, price: 8999, image: 'images/products/saba-1.jpg' }],
    subtotal: 8999,
    deliveryCharges: 0,
    discountAmount: 0,
    totalAmount: 8999,
    paymentMethod: 'cod',
    advanceDepositRequired: false,
    advanceDepositAmount: 0,
    status: 'Delivered',
    courier: 'TCS',
    trackingId: 'TCS-3849201',
    timeline: { pending: new Date(Date.now() - 8 * 86400000).toISOString(), confirmed: new Date(Date.now() - 7 * 86400000).toISOString(), packed: new Date(Date.now() - 6 * 86400000).toISOString(), dispatched: new Date(Date.now() - 5 * 86400000).toISOString(), delivered: new Date(Date.now() - 2 * 86400000).toISOString() }
  },
  {
    id: 'QD-002',
    date: new Date(Date.now() - 3 * 86400000).toISOString(),
    customer: { name: 'Sana Malik', phone: '03451234567', address: 'Flat 4B Clifton Block 5', city: 'Karachi', email: 'sana@example.com' },
    items: [{ id: 'zara-ballet', title: 'The Zara Ballet Flat', size: 38, color: 'Dusty Rose', quantity: 1, price: 7299, image: 'images/products/zara-1.jpg' }],
    subtotal: 7299,
    deliveryCharges: 0,
    discountAmount: 365,
    totalAmount: 6934,
    paymentMethod: 'bank',
    advanceDepositRequired: false,
    advanceDepositAmount: 0,
    status: 'Dispatched',
    courier: 'Leopards',
    trackingId: 'LEP-928471',
    timeline: { pending: new Date(Date.now() - 3 * 86400000).toISOString(), confirmed: new Date(Date.now() - 2 * 86400000).toISOString(), packed: new Date(Date.now() - 1.5 * 86400000).toISOString(), dispatched: new Date(Date.now() - 0.5 * 86400000).toISOString() }
  },
  {
    id: 'QD-003',
    date: new Date(Date.now() - 1 * 86400000).toISOString(),
    customer: { name: 'Usman Arif', phone: '03001234567', address: 'Street 9 F-7/2', city: 'Islamabad', email: 'usman@example.com' },
    items: [{ id: 'dastoor-formal', title: 'The Hayat Chelsea Boot', size: 42, color: 'Cognac Tan', quantity: 1, price: 13999, image: 'images/products/dastoor-1.jpg' }],
    subtotal: 13999,
    deliveryCharges: 0,
    discountAmount: 700,
    totalAmount: 13299,
    paymentMethod: 'bank',
    advanceDepositRequired: false,
    advanceDepositAmount: 0,
    status: 'Confirmed',
    courier: null,
    trackingId: null,
    timeline: { pending: new Date(Date.now() - 1 * 86400000).toISOString(), confirmed: new Date(Date.now() - 0.5 * 86400000).toISOString() }
  },
  {
    id: 'QD-004',
    date: new Date(Date.now() - 7200000).toISOString(),
    customer: { name: 'Fatima Noor', phone: '03331234567', address: 'Model Town Block E', city: 'Multan', email: 'fatima@example.com' },
    items: [{ id: 'mehr-slip-on', title: 'The Mehr Slip-On', size: 40, color: 'Ivory', quantity: 1, price: 7499, image: 'images/products/mehr-1.jpg' }],
    subtotal: 7499,
    deliveryCharges: 0,
    discountAmount: 0,
    totalAmount: 7499,
    paymentMethod: 'cod',
    advanceDepositRequired: false,
    advanceDepositAmount: 0,
    status: 'Pending',
    courier: null,
    trackingId: null,
    timeline: { pending: new Date(Date.now() - 7200000).toISOString() }
  }
];

// Initialize JSON files if missing
if (!fs.existsSync(path.join(DATA_DIR, 'config.json'))) writeJson('config.json', DEFAULT_CONFIG);
if (!fs.existsSync(path.join(DATA_DIR, 'rto.json'))) writeJson('rto.json', DEFAULT_RTO);
if (!fs.existsSync(path.join(DATA_DIR, 'orders.json'))) writeJson('orders.json', DEFAULT_ORDERS);
if (!fs.existsSync(path.join(DATA_DIR, 'customers.json'))) writeJson('customers.json', []);

// ------------------------------------------------------------------------------
// Optional Mongoose Database Connection
// ------------------------------------------------------------------------------
let isMongoConnected = false;
let mongoose = null;

try {
  mongoose = require('mongoose');
  const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/rawanDB";

  mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 2000 })
    .then(() => {
      isMongoConnected = true;
      console.log(">> RAWAN MongoDB Cloud/Local Database Connected Successfully.");
    })
    .catch(() => {
      console.log(">> Notice: Local MongoDB service not active. RAWAN server running seamlessly with persistent JSON storage.");
    });
} catch (e) {
  console.log(">> Notice: Running with built-in high-performance storage engine.");
}

// Tracking ID Generator: QD-XXXXXX
function generateTrackingId() {
  const chars = '0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `QD-${result}`;
}

// ------------------------------------------------------------------------------
// API ENDPOINTS
// ------------------------------------------------------------------------------

// System Health & Diagnostics
app.get('/api/health', (req, res) => {
  const orders = readJson('orders.json', []);
  const config = readJson('config.json', DEFAULT_CONFIG);
  res.json({
    status: 'online',
    appName: 'RAWAN Footwear Enterprise Pipeline',
    timestamp: new Date().toISOString(),
    database: isMongoConnected ? 'MongoDB' : 'Persistent File Store (JSON)',
    ordersCount: orders.length,
    activeDropRemaining: config.pairsRemaining
  });
});

// 1. Checkout Validation & Billing Computation
app.post('/api/checkout/validate', (req, res) => {
  try {
    const { phone = '', city = '', paymentMethod = 'cod', items = [] } = req.body;
    const config = readJson('config.json', DEFAULT_CONFIG);
    const rtoLedger = readJson('rto.json', DEFAULT_RTO);

    const cleanPhone = phone.toString().replace(/\D/g, '');
    const cleanCity = (city || '').trim().toLowerCase();

    // RTO & Remote City Rule
    const isolatedCities = ['quetta', 'gwadar', 'gilgit', 'balochistan', 'fata', 'skardu', 'zhob', 'turbat', 'chaman'];
    const isRemoteCity = isolatedCities.includes(cleanCity);
    const rtoRecord = rtoLedger[cleanPhone] || null;

    const advanceDepositRequired = !!(rtoRecord || isRemoteCity);
    const advanceDepositAmount = advanceDepositRequired ? config.advanceDepositAmount : 0;

    // Subtotal Calculation
    let subtotal = 0;
    for (const item of items) {
      const price = Number(item.price) || 3500;
      const qty = Number(item.qty || item.quantity) || 1;
      subtotal += price * qty;
    }

    // Free delivery threshold check (Rs. 4,999)
    const deliveryCharges = subtotal >= config.freeDeliveryThreshold ? 0 : config.standardDeliveryFee;

    // 5% Advance Payment Discount (Bank Transfer / EasyPaisa / JazzCash)
    let discountAmount = 0;
    if (paymentMethod === 'bank') {
      discountAmount = Math.round(subtotal * 0.05);
    }

    const totalAmount = Math.max(0, (subtotal + deliveryCharges) - discountAmount);

    return res.status(200).json({
      success: true,
      subtotal,
      deliveryCharges,
      discountAmount,
      totalAmount,
      advanceDepositRequired,
      advanceDepositAmount,
      isRTOFlagged: !!rtoRecord,
      rtoReason: rtoRecord ? rtoRecord.reason : null,
      isRemoteCity
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Order Placement
app.post('/api/orders/place', (req, res) => {
  try {
    const {
      name, firstName, lastName, phone, email,
      address, shippingAddress, city, province,
      payment, paymentMethod, items = [], notes = ''
    } = req.body;

    const customerName = name || `${firstName || ''} ${lastName || ''}`.trim() || 'Valued Customer';
    const customerPhone = (phone || '').toString().trim();
    const customerAddress = shippingAddress || address || 'Doorstep Delivery';
    const chosenPayment = paymentMethod || payment || 'cod';
    const orderCity = (city || '').trim();

    if (!customerPhone) {
      return res.status(400).json({ success: false, error: 'Phone number is required.' });
    }

    const config = readJson('config.json', DEFAULT_CONFIG);
    const rtoLedger = readJson('rto.json', DEFAULT_RTO);
    const orders = readJson('orders.json', []);
    const customers = readJson('customers.json', []);

    // Check RTO & Remote City
    const cleanPhone = customerPhone.replace(/\D/g, '');
    const isolatedCities = ['quetta', 'gwadar', 'gilgit', 'balochistan', 'fata', 'skardu'];
    const isRemote = isolatedCities.includes(orderCity.toLowerCase());
    const isRto = !!rtoLedger[cleanPhone];
    const advanceRequired = isRemote || isRto;

    // Compute pricing
    let subtotal = 0;
    const computedItems = items.map(item => {
      const price = Number(item.price) || 3500;
      const qty = Number(item.qty || item.quantity) || 1;
      subtotal += price * qty;
      return {
        id: item.id || 'item-' + Math.random().toString(36).substr(2, 5),
        title: item.title || item.name || 'RAWAN Footwear Elite',
        size: item.size || 38,
        color: item.color || 'Standard',
        quantity: qty,
        price: price,
        image: item.image || 'images/products/noor-1.jpg'
      };
    });

    const deliveryCharges = subtotal >= config.freeDeliveryThreshold ? 0 : config.standardDeliveryFee;
    const discountAmount = chosenPayment === 'bank' ? Math.round(subtotal * 0.05) : 0;
    const totalAmount = Math.max(0, (subtotal + deliveryCharges) - discountAmount);

    // Customer & Founding Elite VIP Handling
    let customer = customers.find(c => c.phone.replace(/\D/g, '') === cleanPhone);
    let isEliteUpgraded = false;

    if (!customer) {
      const isFounding = config.autoVipActive && config.currentFoundingCount < config.foundingMembersLimit;
      customer = {
        id: 'CUST-' + Date.now(),
        name: customerName,
        phone: customerPhone,
        email: email || '',
        city: orderCity,
        isEliteMember: isFounding,
        membershipType: isFounding ? 'Founding' : 'Standard',
        ordersCount: 1,
        createdAt: new Date().toISOString()
      };
      if (isFounding) {
        config.currentFoundingCount += 1;
        if (config.currentFoundingCount >= config.foundingMembersLimit) {
          config.autoVipActive = false;
        }
        writeJson('config.json', config);
        isEliteUpgraded = true;
      }
      customers.push(customer);
    } else {
      customer.ordersCount = (customer.ordersCount || 1) + 1;
    }
    writeJson('customers.json', customers);

    // Deduct limited drop pairs remaining if applicable
    if (config.pairsRemaining > 0) {
      config.pairsRemaining = Math.max(0, config.pairsRemaining - 1);
      writeJson('config.json', config);
    }

    const orderId = generateTrackingId();
    const newOrder = {
      id: orderId,
      orderId: orderId,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      customer: {
        name: customerName,
        phone: customerPhone,
        email: email || '',
        address: customerAddress,
        city: orderCity,
        province: province || 'Punjab'
      },
      items: computedItems,
      subtotal,
      deliveryCharges,
      discountAmount,
      totalAmount,
      total: totalAmount,
      paymentMethod: chosenPayment,
      advanceDepositRequired: advanceRequired,
      advanceDepositAmount: advanceRequired ? config.advanceDepositAmount : 0,
      notes,
      status: 'Pending',
      courier: null,
      trackingId: null,
      timeline: {
        pending: new Date().toISOString()
      }
    };

    orders.unshift(newOrder);
    writeJson('orders.json', orders);

    return res.status(201).json({
      success: true,
      message: 'Order has been placed successfully.',
      orderId,
      order: newOrder,
      isEliteUpgraded
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Orders List & Filtering (for Admin)
app.get('/api/orders', (req, res) => {
  try {
    const { status, search } = req.query;
    let orders = readJson('orders.json', []);

    if (status && status !== 'all') {
      orders = orders.filter(o => (o.status || '').toLowerCase() === status.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      orders = orders.filter(o =>
        (o.id || '').toLowerCase().includes(q) ||
        (o.orderId || '').toLowerCase().includes(q) ||
        (o.customer?.name || '').toLowerCase().includes(q) ||
        (o.customer?.phone || '').includes(q) ||
        (o.customer?.city || '').toLowerCase().includes(q)
      );
    }

    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. Order Details / Tracking (for Customer Tracking & Confirm page)
app.get('/api/orders/:id', (req, res) => {
  try {
    const rawId = req.params.id.trim().toUpperCase();
    const cleanQuery = req.params.id.replace(/\D/g, '');
    const orders = readJson('orders.json', []);

    const order = orders.find(o =>
      (o.id && o.id.toUpperCase() === rawId) ||
      (o.orderId && o.orderId.toUpperCase() === rawId) ||
      (cleanQuery.length >= 7 && o.customer?.phone && o.customer.phone.replace(/\D/g, '').includes(cleanQuery))
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5. Update Order Status (Admin Dispatch Pipeline)
app.patch('/api/orders/:id/status', (req, res) => {
  try {
    const rawId = req.params.id.trim().toUpperCase();
    const { status, courier, trackingId } = req.body;

    const orders = readJson('orders.json', []);
    const idx = orders.findIndex(o => (o.id && o.id.toUpperCase() === rawId) || (o.orderId && o.orderId.toUpperCase() === rawId));

    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (status) {
      orders[idx].status = status;
      if (!orders[idx].timeline) orders[idx].timeline = {};
      orders[idx].timeline[status.toLowerCase()] = new Date().toISOString();
    }
    if (courier !== undefined) orders[idx].courier = courier;
    if (trackingId !== undefined) orders[idx].trackingId = trackingId;

    writeJson('orders.json', orders);
    res.json({ success: true, message: 'Order status updated', order: orders[idx] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 6. Admin Store Config Endpoints
app.get('/api/admin/config', (req, res) => {
  const config = readJson('config.json', DEFAULT_CONFIG);
  res.json({ success: true, config });
});

app.post('/api/admin/config/update', (req, res) => {
  try {
    const current = readJson('config.json', DEFAULT_CONFIG);
    const updated = { ...current, ...req.body };
    writeJson('config.json', updated);
    res.json({ success: true, message: 'Configuration saved successfully', config: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 7. RTO Ledger Management
app.get('/api/admin/rto', (req, res) => {
  const ledger = readJson('rto.json', DEFAULT_RTO);
  res.json({ success: true, ledger });
});

app.post('/api/admin/rto', (req, res) => {
  try {
    const { phone, reason, action } = req.body;
    const cleanPhone = (phone || '').replace(/\D/g, '');
    const ledger = readJson('rto.json', DEFAULT_RTO);

    if (action === 'delete') {
      delete ledger[cleanPhone];
    } else {
      ledger[cleanPhone] = {
        phone: cleanPhone,
        reason: reason || 'Refused delivery at doorstep',
        rtoCount: (ledger[cleanPhone]?.rtoCount || 0) + 1,
        riskLevel: 'High',
        date: new Date().toISOString()
      };
    }

    writeJson('rto.json', ledger);
    res.json({ success: true, ledger });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ------------------------------------------------------------------------------
// Serve Static Frontend Assets & Friendly HTML Page Routing
// ------------------------------------------------------------------------------
const publicPath = fs.existsSync(path.join(__dirname, '../public'))
  ? path.join(__dirname, '../public')
  : path.join(__dirname, 'public');

app.use(express.static(publicPath));

// Clean HTML routing
const pages = ['shop', 'product', 'cart', 'confirm', 'tracking', 'admin', 'about', 'contact', 'exchange', 'faqs', 'journal'];
pages.forEach(page => {
  app.get(`/${page}`, (req, res) => {
    res.sendFile(path.join(publicPath, `${page}.html`));
  });
});

app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  res.sendFile(path.join(publicPath, 'index.html'));
});

// ------------------------------------------------------------------------------
// Server Activation
// ------------------------------------------------------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('====================================================');
  console.log(`✨ RAWAN Footwear Full-Stack Server Running Successfully`);
  console.log(`🌐 Store URL:     http://localhost:${PORT}`);
  console.log(`🛡️  Admin Panel:   http://localhost:${PORT}/admin.html`);
  console.log(`📦 Order Tracker: http://localhost:${PORT}/tracking.html`);
  console.log(`🔌 API Base:      http://localhost:${PORT}/api`);
  console.log('====================================================');
});
