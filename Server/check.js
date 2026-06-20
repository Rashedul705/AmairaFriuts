require('dotenv').config();
const mongoose = require('mongoose');
async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection.db;
  const products = await db.collection('products').find({}).toArray();
  for (const p of products) {
    console.log(`Product: ${p.title}`);
    console.log(`  stock_kg: ${p.stock_kg} (${typeof p.stock_kg})`);
    console.log(`  inStock: ${p.inStock}`);
    console.log(`  is_available: ${p.is_available}`);
  }
  process.exit(0);
}
check();
