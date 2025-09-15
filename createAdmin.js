// JavaScript Document
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

(async () => {
  const MONGOURI = process.env.MONGODB_URI;
  if (!MONGOURI) { console.error('MONGODB_URI missing'); process.exit(1); }

  await mongoose.connect(MONGOURI, { useNewUrlParser: true, useUnifiedTopology: true });
  const email = process.env.ADMIN_EMAIL || 'admin@subcri.local';
  const password = process.env.ADMIN_PASS || 'admin123';

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    console.log('Admin already exists:', existing.email);
    process.exit(0);
  }

  const hash = await bcrypt.hash(password, 10);
  const user = new User({ name: 'Admin', email: email.toLowerCase(), passwordHash: hash, role: 'admin' });
  await user.save();
  console.log('Admin created:', email);
  process.exit(0);
})();
