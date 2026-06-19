const mongoose = require('mongoose');

const abandonedCartItemSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  product_name: { type: String, required: true },
  quantity_kg: { type: Number, required: true },
  price_per_kg: { type: Number, required: true }
}, { _id: false });

const abandonedCartSchema = new mongoose.Schema({
  session_id: { type: String, required: true, index: true },
  name: { type: String },
  phone: { type: String, index: true },
  items: [abandonedCartItemSchema],
  cart_total: { type: Number, required: true },
  last_step: { 
    type: String, 
    enum: ['cart', 'details', 'payment'],
    required: true
  },
  recovery_attempted: { type: Boolean, default: false },
  recovery_sent_at: { type: Date },
  last_seen_at: { type: Date, default: Date.now },
  converted_to_order: { type: Boolean, default: false },
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false }
});

// Index on created_at
abandonedCartSchema.index({ created_at: -1 });

module.exports = mongoose.model('AbandonedCart', abandonedCartSchema);
