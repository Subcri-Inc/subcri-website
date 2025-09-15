const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, default: 'Admin' },
  email: { type: String, unique: true },
  passwordHash: String,
  role: { type: String, default: 'admin' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
