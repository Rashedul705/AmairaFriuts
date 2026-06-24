const mongoose = require('mongoose');

const abandonedCustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true, index: true },
  district: { type: String },
  shippingAddress: { type: String },
  abandoned_cart_count: { type: Number, default: 1 },
  last_abandoned_at: { type: Date, default: Date.now }
}, {
  timestamps: true
});

module.exports = mongoose.model('AbandonedCustomer', abandonedCustomerSchema);
