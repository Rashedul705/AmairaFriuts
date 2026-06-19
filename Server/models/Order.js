const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  product_name: { type: String, required: true },
  quantity_kg: { type: Number, required: true },
  price_per_kg: { type: Number, required: true },
  subtotal: { type: Number, required: true }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  order_number: { type: String, required: true, unique: true, index: true },
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
  customer_snapshot: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true }
  },
  items: [orderItemSchema],
  subtotal: { type: Number, required: true },
  delivery_charge: { type: Number, required: true },
  total: { type: Number, required: true },
  payment_method: { 
    type: String, 
    enum: ['cash_on_delivery', 'bkash', 'nagad'], 
    default: 'cash_on_delivery' 
  },
  payment_status: { 
    type: String, 
    enum: ['pending', 'paid', 'failed'], 
    default: 'pending' 
  },
  order_status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'], 
    default: 'pending',
    index: true
  },
  notes: { type: String }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Index on created_at
orderSchema.index({ created_at: -1 });

// Hook to update customer stats when an order is marked as delivered
orderSchema.pre('save', function(next) {
  // Check if order_status is being modified to 'delivered'
  if (this.isModified('order_status') && this.order_status === 'delivered') {
    this._justDelivered = true;
  }
  next();
});

orderSchema.post('save', async function(doc) {
  if (doc._justDelivered) {
    try {
      const Customer = mongoose.model('Customer');
      await Customer.findByIdAndUpdate(doc.customer_id, {
        $inc: { total_orders: 1, total_spent: doc.total },
        $set: { last_order_at: new Date() }
      });
      // Also update first_order_at if it's null
      const customer = await Customer.findById(doc.customer_id);
      if (customer && !customer.first_order_at) {
        customer.first_order_at = doc.created_at;
        await customer.save();
      }
    } catch (error) {
      console.error('Error updating customer stats on order delivery:', error);
    }
  }
});

// Also handle findOneAndUpdate for delivery status changes
orderSchema.post('findOneAndUpdate', async function(doc) {
  if (doc) {
    const update = this.getUpdate();
    // Check if the update set order_status to delivered
    if (update.$set && update.$set.order_status === 'delivered') {
      try {
        const Customer = mongoose.model('Customer');
        await Customer.findByIdAndUpdate(doc.customer_id, {
          $inc: { total_orders: 1, total_spent: doc.total },
          $set: { last_order_at: new Date() }
        });
      } catch (error) {
        console.error('Error updating customer stats on order findOneAndUpdate:', error);
      }
    }
  }
});

module.exports = mongoose.model('Order', orderSchema);
