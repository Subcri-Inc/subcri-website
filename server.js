// Load environment variables
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// App setup
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer + Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'subcri_projects',
    allowed_formats: ['jpg', 'jpeg', 'png']
  }
});
const upload = multer({ storage });

// MongoDB Schemas
const projectSchema = new mongoose.Schema({
  title: String,
  desc: String,
  image: String
});
const capabilitySchema = new mongoose.Schema({
  items: [String]
});
const Project = mongoose.model('Project', projectSchema);
const Capability = mongoose.model('Capability', capabilitySchema);

// Middleware: Auth check
function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'No token provided' });
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Unauthorized' });
    req.userId = decoded.id;
    next();
  });
}

// Auth: Login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASS) {
    const token = jwt.sign({ id: email }, process.env.JWT_SECRET, { expiresIn: '2h' });
    return res.json({ token });
  }
  res.status(401).json({ message: 'Invalid credentials' });
});

// Get all projects
app.get('/projects', async (req, res) => {
  const projects = await Project.find();
  res.json(projects);
});

// Add a new project (with image upload)
app.post('/projects', verifyToken, upload.single('image'), async (req, res) => {
  const { title, desc } = req.body;
  const imageUrl = req.file.path;
  const newProject = new Project({ title, desc, image: imageUrl });
  await newProject.save();
  res.json({ message: 'Project added successfully', project: newProject });
});

// Get capabilities
app.get('/capabilities', async (req, res) => {
  const caps = await Capability.findOne();
  res.json(caps || { items: [] });
});

// Update capabilities
app.post('/capabilities', verifyToken, async (req, res) => {
  const { items } = req.body;
  let caps = await Capability.findOne();
  if (!caps) {
    caps = new Capability({ items });
  } else {
    caps.items = items;
  }
  await caps.save();
  res.json({ message: 'Capabilities updated successfully', capabilities: caps });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

