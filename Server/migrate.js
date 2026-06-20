require('dotenv').config();
const mongoose = require('mongoose');

async function migrate() {
  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection.db;
  const products = await db.collection('products').find({}).toArray();
  
  for (const p of products) {
    let updates = {};
    
    // Set price_per_kg if missing
    if (p.price_per_kg === undefined) {
      if (p.pricePerKg) {
        updates.price_per_kg = p.pricePerKg;
      } else if (p.basePrice) {
        updates.price_per_kg = p.basePrice;
      } else if (p.variants && p.variants.length > 0) {
        updates.price_per_kg = p.variants[0].price;
      } else {
        updates.price_per_kg = 0;
      }
    }
    
    // Set stock_kg if missing
    if (p.stock_kg === undefined) {
      if (p.inStock) {
        updates.stock_kg = p.stockQuantity || 50;
      } else {
        updates.stock_kg = 0;
      }
    }

    // Set min_order_kg if missing
    if (p.min_order_kg === undefined) {
      updates.min_order_kg = 1;
    }
    
    // Set is_available if missing
    if (p.is_available === undefined) {
      updates.is_available = p.inStock !== false;
    }
    
    if (Object.keys(updates).length > 0) {
      await db.collection('products').updateOne({ _id: p._id }, { $set: updates });
      console.log(`Migrated product: ${p.title}`, updates);
    }
  }
  console.log("Migration complete.");
  process.exit(0);
}
migrate().catch(console.error);
