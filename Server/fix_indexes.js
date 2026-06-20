require('dotenv').config();
const mongoose = require('mongoose');

async function fixIndexes() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;
    const collection = db.collection('orders');
    
    const indexes = await collection.indexes();
    console.log('Current indexes:', indexes.map(i => i.name));
    
    // Find the old orderID_1 index
    const hasOldIndex = indexes.find(i => i.name === 'orderID_1');
    if (hasOldIndex) {
      console.log('Dropping old index: orderID_1');
      await collection.dropIndex('orderID_1');
      console.log('Dropped successfully');
    } else {
      console.log('Index orderID_1 not found');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixIndexes();
