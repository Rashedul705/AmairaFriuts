const mongoose = require('mongoose');

const successfulCustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true, index: true },
  district: { type: String },
  shippingAddress: { type: String },
  total_orders: { type: Number, default: 0 },
  total_spent: { type: Number, default: 0 },
  first_order_at: { type: Date, default: Date.now },
  last_order_at: { type: Date, default: Date.now }
}, {
  timestamps: true
});

module.exports = mongoose.model('SuccessfulCustomer', successfulCustomerSchema);
