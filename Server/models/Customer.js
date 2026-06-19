const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true, index: true },
  email: { type: String },
  address: {
    district: { type: String },
    upazila: { type: String },
    full_address: { type: String }
  },
  total_orders: { type: Number, default: 0 },
  total_spent: { type: Number, default: 0 },
  first_order_at: { type: Date },
  last_order_at: { type: Date }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false }
});

module.exports = mongoose.model('Customer', customerSchema);
