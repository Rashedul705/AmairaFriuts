const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const AbandonedCart = require('../models/AbandonedCart');
const { protect } = require('../middleware/auth');

// Helper to generate unique human-readable tracking ID
const generateTrackingID = async () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let isUnique = false;
  let trackingID = '';

  while (!isUnique) {
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    trackingID = `AM-${result}`;
    
    const existing = await Order.findOne({ orderID: trackingID });
    if (!existing) {
      isUnique = true;
    }
  }

  return trackingID;
};

// @desc    Place a new order
// @route   POST /api/orders
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { 
      customerName, 
      phone, 
      district, 
      shippingAddress, 
      items, 
      paymentMethod,
      customerUID,
      abandonedCartId
    } = req.body;

    if (!customerName || !phone || !district || !shippingAddress || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Please provide all required fields and at least one item' });
    }

    let itemsTotal = 0;
    const orderItems = [];
    let freeDeliveryApplies = false;

    // Process each item
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }

      // Determine price of the variant
      let itemPrice = product.pricePerKg || product.price_per_kg || product.basePrice || 0;
      const selectedVariant = product.variants?.find(v => v.label === item.variant);
      if (selectedVariant) {
        itemPrice = selectedVariant.price;
      }

      if (product.freeDelivery) {
        freeDeliveryApplies = true;
      }

      itemsTotal += (itemPrice * item.quantity);
      
      orderItems.push({
        product_id: product._id,
        product_name: product.title,
        variant_name: item.variant || 'Default',
        quantity_kg: item.quantity,
        price_per_kg: itemPrice,
        subtotal: (itemPrice * item.quantity)
      });
    }

    // Determine shipping fee based on district
    // e.g. Dhaka: 80, Others: 150. If any product specifies free delivery, it's 0.
    let shippingFee = 150;
    if (freeDeliveryApplies) {
      shippingFee = 0;
    } else {
      const isDhaka = district.toLowerCase().includes('dhaka');
      shippingFee = isDhaka ? 80 : 150;
    }

    const totalAmount = itemsTotal + shippingFee;

    const orderID = await generateTrackingID();

    let mappedPaymentMethod = 'cash_on_delivery';
    if (paymentMethod === 'bKash') mappedPaymentMethod = 'bkash';
    if (paymentMethod === 'Nagad') mappedPaymentMethod = 'nagad';

    const order = new Order({
      order_number: orderID,
      customer_id: customerUID || undefined,
      customer_snapshot: {
        name: customerName,
        phone: phone,
        address: shippingAddress,
        division: district
      },
      items: orderItems,
      subtotal: itemsTotal,
      delivery_charge: shippingFee,
      total: totalAmount,
      payment_method: mappedPaymentMethod,
      payment_status: 'pending',
      order_status: 'pending'
    });

    const savedOrder = await order.save();
    
    if (abandonedCartId) {
      await AbandonedCart.findByIdAndUpdate(abandonedCartId, { status: 'Recovered' });
    }

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Track order by OrderID or Phone
// @route   GET /api/orders/track/:query
// @access  Public
router.get('/track/:query', async (req, res) => {
  try {
    const queryStr = req.params.query.trim();
    // Allow tracking by OrderID (e.g. AM-XXXXX) or exact Phone number
    const orders = await Order.find({
      $or: [
        { order_number: { $regex: new RegExp(`^${queryStr}$`, 'i') } },
        { 'customer_snapshot.phone': queryStr }
      ]
    }).populate('items.product_id', 'title images slug').sort({ created_at: -1 });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found matching the tracking details' });
    }

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private (Admin)
router.get('/', protect, async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('items.product_id', 'title images slug')
      .sort({ created_at: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private (Admin)
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status.toLowerCase())) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.order_status = status.toLowerCase();
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get logged in customer's order history
// @route   GET /api/orders/my-orders
// @access  Private (Customer)
router.get('/my-orders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ customer_id: req.adminId })
      .populate('items.product_id', 'title images slug')
      .sort({ created_at: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Log an abandoned cart
// @route   POST /api/orders/abandoned-carts
// @access  Public
router.post('/abandoned-carts', async (req, res) => {
  try {
    const { customerName, phone, district, shippingAddress, items, cartTotal, shippingFee } = req.body;
    
    let cart = await AbandonedCart.findOne({ phone, status: 'Abandoned' }).sort({ lastAttemptedAt: -1 });
    
    if (cart) {
      cart.customerName = customerName;
      cart.district = district;
      cart.shippingAddress = shippingAddress;
      cart.items = items;
      cart.cartTotal = cartTotal;
      cart.shippingFee = shippingFee;
      cart.lastAttemptedAt = Date.now();
      await cart.save();
    } else {
      cart = await AbandonedCart.create({
        customerName, phone, district, shippingAddress, items, cartTotal, shippingFee
      });
    }
    
    res.status(201).json({ abandonedCartId: cart._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all abandoned carts
// @route   GET /api/orders/admin/abandoned-carts
// @access  Private (Admin)
router.get('/admin/abandoned-carts', protect, async (req, res) => {
  try {
    const carts = await AbandonedCart.find({ status: 'Abandoned' }).sort({ lastAttemptedAt: -1 });
    res.json(carts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get aggregated successful customers from orders
// @route   GET /api/orders/admin/successful-customers
// @access  Private (Admin)
router.get('/admin/successful-customers', protect, async (req, res) => {
  try {
    const customers = await Order.aggregate([
      { $match: { order_status: { $nin: ['cancelled', 'abandoned'] } } },
      { $group: {
          _id: "$customer_snapshot.phone",
          customerName: { $last: "$customer_snapshot.name" },
          phone: { $first: "$customer_snapshot.phone" },
          district: { $last: "$customer_snapshot.division" },
          shippingAddress: { $last: "$customer_snapshot.address" },
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: "$total" },
          lastOrderDate: { $max: "$created_at" }
      }},
      { $sort: { lastOrderDate: -1 } }
    ]);
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
