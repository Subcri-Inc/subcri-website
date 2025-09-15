// JavaScript Document
const express = require('express');
const router = express.Router();
const Capability = require('../models/Capability');
const auth = require('../middleware/auth');

// GET capabilities (single doc)
router.get('/', async (req, res) => {
  let caps = await Capability.findOne();
  if (!caps) {
    caps = new Capability({ items: [] });
    await caps.save();
  }
  res.json(caps.items);
});

// POST replace capabilities array (protected)
router.post('/', auth, async (req, res) => {
  const { items } = req.body;
  if (!Array.isArray(items)) return res.status(400).json({ error: 'items must be an array' });
  let caps = await Capability.findOne();
  if (!caps) {
    caps = new Capability({ items });
  } else {
    caps.items = items;
  }
  await caps.save();
  res.json(caps.items);
});
module.exports = router;
