const mongoose = require('mongoose');

// ── Product Model ────────────────────────────
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: null },
    price: { type: Number, required: true },
    discountPrice: { type: Number, default: null },
category: {
  type: String,
  enum: ['supplements', 'equipment', 'accessories', 'apparel', 'footwear'],
  required: true
},

subCategory: {
  type: String,
  enum: ['men', 'women', 'both', 'Weighing_scale', null],
  default: null
},

productType: {
  type: String,
  enum: [
    "tshirt",
    "shorts",
    "joggers",
    "set",
    "compression",
    "Sport Bra",
    "shoes",
    "bag",
    "shaker",
    "gloves",
    "gym_mat",
    "cap",
    "creatine",
    "protein",
    "socks",
    "grip-strengthener",
    null
  ],
  default: null
},
variants: [
  {
    color: { type: String },              // e.g. Black, White
    style: { type: String },              // e.g. T-shirt, Set
    size: [{ type: String }],             // S, M, L
    price: { type: Number },              // optional per variant
    stock: { type: Number, default: 0 },  // stock per variant

    image: {
      url: String,
      public_id: String
    }
  }
],

    images: [
  {
    url: String,
    public_id: String
  }
],
    isAvailable: { type: Boolean, default: true },
    ratings: {
        average: { type: Number, default: 0 },
        count: { type: Number, default: 0 }
    },
    tags: [{ type: String }],
    weight: { type: String, default: null },
    brand: { type: String, default: null }
}, { timestamps: true });

// ── Cart Model ───────────────────────────────
const cartSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true        // ← one cart per user
    },
    items: [
        {
            product_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: { type: Number, default: 1 },
            size: { type: String, default: null },
            color: { type: String, default: null },
            price: { type: Number, required: true }
        }
    ],
    totalAmount: { type: Number, default: 0 }
}, { timestamps: true });

// Auto calculate total
cartSchema.pre('save', function () {
    if (!this.items.length) {
        this.totalAmount = 0;
        return;
    }

    this.totalAmount = this.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
});
const addressSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: { type: String, required: true },
    mobile: { type: String, required: true },

    pincode: { type: String, required: true },
    house: { type: String, required: true }, // house / flat
    area: { type: String, required: true },  // street / building
    locality: { type: String, required: true },

    city: { type: String, required: true },
    state: { type: String, required: true },
    isDefault: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// ── Order Model ──────────────────────────────
const orderSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
   razorpay_order_id: {
  type: String,
},
    items: [
        {
            product_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            name: String,
            quantity: Number,
            size: String,
            price: Number
        }
    ],
    totalAmount: { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    payment: {
        razorpay_order_id: { type: String, default: null },
        razorpay_payment_id: { type: String, default: null },
        razorpay_signature: { type: String, default: null },
        status: {
            type: String,
            enum: ['pending', 'paid', 'failed'],
            default: 'pending'
        }
    },
    deliveryAddress: {
       name: String,
  house: String,     // 🔥 ADD
  area: String,      // 🔥 ADD
  city: String,
  state: String,
  pincode: String,
  mobile: String 
    }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
const Cart = mongoose.model('Cart', cartSchema);
const Order = mongoose.model('Order', orderSchema);
const Address = mongoose.model('Address', addressSchema);

module.exports = { Product, Cart, Order, Address };