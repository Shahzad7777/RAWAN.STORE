# ==============================================================================
#                 RAWAN FOOTWEAR - ENTERPRISE BACKEND ARCHITECTURE
# ==============================================================================
# Role: Senior Full-Stack Solution Architect & System Engineer
# Stack: Node.js (Express) + MongoDB (Mongoose Object Modeling)
# Localization: Pakistan E-commerce Framework (COD, RTO Risk Ledger, Bank 5% Disc)
# ==============================================================================

# === [File: models/StoreConfig.js] ===
const mongoose = require('mongoose');

const StoreConfigSchema = new mongoose.Schema({
  freeDeliveryThreshold: { type: Number, default: 4999 },
  standardDeliveryCharge: { type: Number, default: 250 },
  remoteAdvanceDepositAmount: { type: Number, default: 200 },
  highValueThreshold: { type: Number, default: 15000 },
  foundingMembersLimit: { type: Number, default: 20 },
  currentFoundingCount: { type: Number, default: 0 },
  autoVipActive: { type: Boolean, default: true },
  countdownActive: { type: Boolean, default: false },
  countdownLabel: { type: String, default: "Limited Drop Ends In" },
  countdownEndDate: { type: Date },
  countdownEndTime: { type: String, default: "23:59" },
  showDropSection: { type: Boolean, default: true },
  dropTitle: { type: String, default: "Only 15 Executive Pairs Available." },
  pairsRemaining: { type: Number, default: 15 },
  bankDetails: {
    bankName: { type: String, default: "HBL" },
    accountName: { type: String, default: "RAWAN Footwear" },
    accountNumber: { type: String, default: "0012345678901" },
    iban: { type: String, default: "PK36HABB0012345678901" },
    easyPaisaNumber: { type: String, default: "" },
    jazzCashNumber: { type: String, default: "" }
  },
  whatsappNumber: { type: String, default: "923001234567" }
}, { timestamps: true });

const StoreConfig = mongoose.model('StoreConfig', StoreConfigSchema);


# === [File: models/Product.js] ===
const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  sku: { type: String, unique: true, required: true },
  tier: { type: String, enum: ['Regular', 'Executive'], default: 'Regular' },
  heelHeightCategory: { type: String, enum: ['stiletto', 'block', 'kitten', 'flat'], required: true },
  heelHeightDetail: { type: String, default: "" }, 
  gender: { type: String, enum: ['Men', 'Women'], required: true },
  basePrice: { type: Number, required: true },
  salePrice: { type: Number },
  isLockedForNonMembers: { type: Boolean, default: false },
  fitIndicator: { type: String, default: "True to Size" },
  badges: [{ type: String, enum: ['new', 'bestseller'] }],
  occasions: [{ type: String }],
  description: { type: String },
  materials: { type: String, default: "Genuine Premium Materials" },
  images: [{ type: String }],
  walkingPreviewUrl: { type: String }, 
  sizeStock: [{
    sizeEU: { type: Number, required: true },
    stockCount: { type: Number, default: 0, min: 0 }
  }],
  reviews: [{
    customerName: { type: String, required: true },
    phoneOrEmail: { type: String, required: true },
    reviewText: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    isVerifiedBuyer: { type: Boolean, default: false },
    status: { type: String, enum: ['pending', 'approved'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

ProductSchema.index({ tier: 1, heelHeightCategory: 1, gender: 1 });
const Product = mongoose.model('Product', ProductSchema);


# === [File: models/Customer.js] ===
const CustomerSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, trim: true },
  phone: { type: String, unique: true, required: true, index: true }, 
  email: { type: String, trim: true, lowercase: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  province: { type: String, required: true },
  isEliteMember: { type: Boolean, default: false },
  membershipType: { type: String, enum: ['Standard', 'Founding', 'ManualVIP'], default: 'Standard' },
  orderCount: { type: Number, default: 0 }
}, { timestamps: true });

const Customer = mongoose.model('Customer', CustomerSchema);


# === [File: models/Order.js] ===
const OrderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true, required: true, index: true }, 
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    title: String,
    sku: String,
    sizeEU: { type: Number, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true }
  }],
  subtotal: { type: Number, required: true },
  discountAmount: { type: Number, default: 0 },
  shippingCharges: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['cod', 'bank'], required: true },
  isAdvanceDepositRequired: { type: Boolean, default: false }, 
  paymentStatus: { type: String, enum: ['unpaid', 'deposit_pending', 'deposit_received', 'fully_paid'], default: 'unpaid' },
  orderStatus: { type: String, enum: ['Pending', 'Confirmed', 'Dispatched', 'Delivered', 'Cancelled'], default: 'Pending' },
  courierName: { type: String, enum: ['TCS', 'Leopards', 'M&P', 'PostEx', 'Trax', ''] },
  trackingNumber: { type: String, default: "" },
  orderNotes: { type: String }
}, { timestamps: true });

const Order = mongoose.model('Order', OrderSchema);


# === [File: models/RTOLedger.js] ===
const RTOLedgerSchema = new mongoose.Schema({
  phone: { type: String, unique: true, required: true, index: true },
  rtoCount: { type: Number, default: 1 },
  riskLevel: { type: String, enum: ['Medium', 'High'], default: 'Medium' },
  lastFailedDate: { type: Date, default: Date.now },
  notes: { type: String, default: "Delivery refused at doorstep." }
}, { timestamps: true });

const RTOLedger = mongoose.model('RTOLedger', RTOLedgerSchema);
