const mongoose = require('mongoose');

const abandonedCartItemSchema = new mongoose.Schema({
  productId: { type: String },
  productTitle: { type: String, required: true },
  product_name: { type: String }, // For backwards compatibility
  variant: { type: String },
  variant_name: { type: String }, // For backwards compatibility
  quantity: { type: Number },
  quantity_kg: { type: Number }, // For backwards compatibility
  price: { type: Number }
}, { _id: false });

const abandonedCartSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  phone: { type: String, required: true, index: true },
  district: { type: String },
  shippingAddress: { type: String },
  items: [abandonedCartItemSchema],
  cartTotal: { type: Number },
  cartValue: { type: Number }, // For admin UI mapping
  shippingFee: { type: Number },
  deliveryCharge: { type: Number }, // For admin UI mapping
  status: { type: String, default: 'Abandoned' },
  lastAttemptedAt: { type: Date, default: Date.now },
  lastUpdatedAt: { type: Date, default: Date.now } // For admin UI mapping
}, {
  timestamps: true
});

// Pre-save hook to ensure duplicate mappings for Admin UI
abandonedCartSchema.pre('save', function(next) {
  this.cartValue = this.cartTotal;
  this.deliveryCharge = this.shippingFee;
  this.lastUpdatedAt = this.lastAttemptedAt;
  if (this.items && this.items.length > 0) {
    this.items.forEach(item => {
      item.product_name = item.productTitle;
      item.variant_name = item.variant;
      item.quantity_kg = item.quantity;
    });
  }
  next();
});

module.exports = mongoose.model('AbandonedCart', abandonedCartSchema);
