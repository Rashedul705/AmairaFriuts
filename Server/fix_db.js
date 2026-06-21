const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB');
    const result = await Product.updateMany(
      { price_validity_days: { $exists: false } },
      { $set: { price_validity_days: 5, price_updated_at: new Date() } }
    );
    console.log('Updated products:', result.modifiedCount);
    mongoose.disconnect();
  })
  .catch(err => console.error(err));
