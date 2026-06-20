require('dotenv').config();
const mongoose = require('mongoose');

async function fix() {
  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection.db;
  const products = await db.collection('products').find({}).toArray();
  
  for (const p of products) {
    if (p.stock_kg === 0 || p.stock_kg === undefined) {
      await db.collection('products').updateOne({ _id: p._id }, { $set: { stock_kg: 50, is_available: true } });
      console.log(`Fixed stock for: ${p.title}`);
    }
  }
  console.log("Fix complete.");
  process.exit(0);
}
fix().catch(console.error);
