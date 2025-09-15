const mongoose = require("mongoose");
require("dotenv").config();

async function testConnection() {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✅ MongoDB connected successfully!");
    await mongoose.disconnect();
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
  }
}

testConnection();
