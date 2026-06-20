const fs = require('fs');
const path = './Server/models/Order.js';
let content = fs.readFileSync(path, 'utf8');

// make customer_id optional
content = content.replace(
  "customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true, index: true }",
  "customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', index: true }"
);

// add variant to orderItemSchema
content = content.replace(
  "product_name: { type: String, required: true },",
  "product_name: { type: String, required: true },\n  variant_name: { type: String },"
);

fs.writeFileSync(path, content);
console.log('Order schema updated');
