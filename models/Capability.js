const mongoose = require('mongoose');

const capSchema = new mongoose.Schema({
  items: [String]
}, { timestamps: true });

module.exports = mongoose.model('Capability', capSchema);
