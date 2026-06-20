const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  description: { type: String },
  meta_title: { type: String },
  pricePerKg: { type: Number, required: true },
  daysLeftForPrice: { type: Number },
  price_per_kg: { type: Number },
  min_order_kg: { type: Number, default: 1 },
  stock_kg: { type: Number, default: 0 },
  images: [{ type: String }],
  is_available: { type: Boolean, default: true },
  season_note: { type: String },
  category: { type: String },
  variants: { type: Array },
  freeDelivery: { type: Boolean },
  inStock: { type: Boolean }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('Product', productSchema);
