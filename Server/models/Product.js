const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  description: { type: String },
  meta_title: { type: String },
  price_per_kg: { type: Number, required: true },
  min_order_kg: { type: Number, default: 1 },
  stock_kg: { type: Number, default: 0 },
  images: [{ type: String }],
  is_available: { type: Boolean, default: true },
  season_note: { type: String },
  category: { type: String },
  variants: { type: Array },
  freeDelivery: { type: Boolean },
  inStock: { type: Boolean },
  price_validity_days: { type: Number },
  price_updated_at: { type: Date, default: Date.now }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});


productSchema.virtual('daysLeftForPrice').get(function() {
  if (this.price_validity_days == null) return null;
  const start = this.price_updated_at ? this.price_updated_at.getTime() : this.created_at.getTime();
  const msPassed = Date.now() - start;
  const daysPassed = Math.floor(msPassed / (1000 * 60 * 60 * 24));
  const left = this.price_validity_days - daysPassed;
  return left > 0 ? left : 0;
});

productSchema.virtual('price_expiry_date').get(function() {
  if (this.price_validity_days == null) return null;
  const start = this.price_updated_at ? this.price_updated_at.getTime() : this.created_at.getTime();
  const expiry = start + (this.price_validity_days * 24 * 60 * 60 * 1000);
  return new Date(expiry);
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);

