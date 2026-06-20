const fs = require('fs');

const path = './Dashboard_UI/app/admin/dashboard/page.js';
let content = fs.readFileSync(path, 'utf8');

// Replace order table mappings
content = content.replace(/o\.orderID/g, 'o.order_number');
content = content.replace(/o\.createdAt/g, 'o.created_at');
content = content.replace(/o\.customerName/g, 'o.customer_snapshot?.name');
content = content.replace(/o\.phone/g, 'o.customer_snapshot?.phone');
content = content.replace(/o\.shippingAddress/g, 'o.customer_snapshot?.address');
content = content.replace(/o\.district/g, 'o.customer_snapshot?.division');
content = content.replace(/item\.productTitle/g, 'item.product_name');
content = content.replace(/item\.variant/g, 'item.variant_name');
content = content.replace(/item\.quantity/g, 'item.quantity_kg');
content = content.replace(/item\.price/g, 'item.price_per_kg');
content = content.replace(/o\.totalAmount/g, 'o.total');
content = content.replace(/o\.orderStatus/g, 'o.order_status');
content = content.replace(/'Delivered'/g, "'delivered'");
content = content.replace(/'Cancelled'/g, "'cancelled'");

// Replace selectedOrder usages
content = content.replace(/selectedOrder\.orderID/g, 'selectedOrder.order_number');
content = content.replace(/selectedOrder\.createdAt/g, 'selectedOrder.created_at');
content = content.replace(/selectedOrder\.customerName/g, 'selectedOrder.customer_snapshot?.name');
content = content.replace(/selectedOrder\.phone/g, 'selectedOrder.customer_snapshot?.phone');
content = content.replace(/selectedOrder\.shippingAddress/g, 'selectedOrder.customer_snapshot?.address');
content = content.replace(/selectedOrder\.district/g, 'selectedOrder.customer_snapshot?.division');
content = content.replace(/selectedOrder\.totalAmount/g, 'selectedOrder.total');
content = content.replace(/selectedOrder\.shippingFee/g, 'selectedOrder.delivery_charge');
content = content.replace(/selectedOrder\.paymentMethod/g, 'selectedOrder.payment_method');
content = content.replace(/selectedOrder\.orderStatus/g, 'selectedOrder.order_status');

// Fix options to be lowercase like the backend expects
content = content.replace(/<option value="Pending">Pending<\/option>/g, '<option value="pending">Pending</option>');
content = content.replace(/<option value="Confirmed">Confirmed<\/option>/g, '<option value="confirmed">Confirmed</option>');
content = content.replace(/<option value="Shipped">Shipped<\/option>/g, '<option value="shipped">Shipped</option>');
content = content.replace(/<option value="Delivered">Delivered<\/option>/g, '<option value="delivered">Delivered</option>');
content = content.replace(/<option value="Cancelled">Cancelled<\/option>/g, '<option value="cancelled">Cancelled</option>');

fs.writeFileSync(path, content);
console.log('Fixed admin orders table');
