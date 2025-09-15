const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: String,
  desc: String,
  image: String, // cloudinary URL
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema);
