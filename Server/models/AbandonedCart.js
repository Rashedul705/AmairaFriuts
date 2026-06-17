const mongoose = require('mongoose');

const abandonedCartSchema = new mongoose.Schema({
  customerName: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  district: { type: String, required: true, trim: true },
  shippingAddress: { type: String, required: true, trim: true },
  items: [
    {
      productId: { type: String, required: true },
      productTitle: { type: String, required: true },
      variant: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],
  cartTotal: { type: Number, required: true },
  shippingFee: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Abandoned', 'Recovered'],
    default: 'Abandoned'
  },
  lastAttemptedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AbandonedCart', abandonedCartSchema);
