const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');

dotenv.config();

const updateAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    const defaultUser = process.env.ADMIN_USERNAME || 'admin';
    const defaultPass = process.env.ADMIN_PASSWORD || 'amaira12345';
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(defaultPass, salt);
    
    const admin = await Admin.findOne({ username: defaultUser });
    if (admin) {
      admin.password = hashedPassword;
      await admin.save();
      console.log(`Admin ${defaultUser} password updated to match .env!`);
    } else {
      await Admin.create({
        username: defaultUser,
        password: hashedPassword
      });
      console.log(`Admin ${defaultUser} created successfully!`);
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    process.exit(0);
  }
};

updateAdmin();
