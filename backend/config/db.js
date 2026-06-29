const { Sequelize } = require('sequelize')

const dbName = process.env.DB_NAME || 'master_db'
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASSWORD
const dbHost = process.env.DB_HOST
const dbPort = process.env.DB_PORT || 3306

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: parseInt(dbPort),
  dialect: 'mysql',
  dialectModule: require('mysql2'),
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
  dialectOptions: {
    connectTimeout: 60000,
    ...(process.env.DB_SSL === 'true' ? { ssl: { require: true, rejectUnauthorized: false } } : {})
  },
  define: {
    timestamps: true,
    underscored: true
  }
})

const connectDB = async () => {
  try {
    await sequelize.authenticate()
    console.log('✅ MySQL Database Connected successfully (via Sequelize)')
    
    // Import models and relationships before syncing
    require('../models')
    
    await sequelize.sync({ force: false, alter: false })
    console.log('✅ Sequelize Models Synced successfully')
  } catch (error) {
    console.error(`❌ MySQL Connection Error: ${error.message}`)
    console.log('⚠️ Running without database connection. Some features will be unavailable.')
  }
}

module.exports = connectDB
module.exports.sequelize = sequelize
