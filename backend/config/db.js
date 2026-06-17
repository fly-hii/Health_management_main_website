const mongoose = require('mongoose')

let isConnected = false

const connectDB = async () => {
  if (isConnected) return

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    })
    isConnected = true
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`)
    console.log('⚠️  Running without database connection. Some features will be unavailable.')
    // Don't exit – allow server to run in degraded mode
  }
}

module.exports = connectDB
