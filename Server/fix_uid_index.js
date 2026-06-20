require('dotenv').config();
const mongoose = require('mongoose');

async function fix() {
  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection.db;
  const collection = db.collection('orders');
  
  try {
    await collection.dropIndex('customerUID_1');
    console.log('Dropped customerUID_1');
  } catch (e) {
    console.log('Error or already dropped');
  }
  process.exit(0);
}
fix();
