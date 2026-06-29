require('dotenv').config()
const express = require('express')
const http = require('http')
const cors = require('cors')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const { Server } = require('socket.io')
const connectDB = require('./config/db')
const { sequelize } = require('./config/db')

// Load environment variables if not loaded
if (!process.env.PORT) {
  process.env.PORT = 5000
}

// Connect to Database
connectDB()

const app = express()
const server = http.createServer(app)

// Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

// Attach io to app to use in routes
app.set('io', io)

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(morgan('dev'))

// Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window`
  message: 'Too many requests from this IP, please try again after 15 minutes'
})
app.use('/api/', apiLimiter)

// Socket Connections
let liveUsers = 0

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`)
  liveUsers++
  io.emit('live_user_count', liveUsers)

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`)
    liveUsers = Math.max(0, liveUsers - 1)
    io.emit('live_user_count', liveUsers)
  })
})

// System Health Broadcast (Every 30 seconds)
setInterval(async () => {
  let dbStatus = 'offline'
  try {
    await sequelize.authenticate()
    dbStatus = 'online'
  } catch (err) {
    console.error('Broadcast DB health check error:', err.message)
  }

  const health = {
    database: {
      status: dbStatus,
      responseTime: '12ms' // Mocked response time for now
    },
    api: {
      status: 'online',
      uptime: `${(process.uptime() / 3600).toFixed(2)}%`,
      responseTime: '45ms'
    },
    socket: {
      status: 'online',
      connections: liveUsers
    },
    server: {
      status: 'online',
      cpu: '23%',
      memory: '68%'
    }
  }
  io.emit('system_health', health)
}, 30000)

app.use('/api/auth', require('./routes/auth'))
app.use('/api/system', require('./routes/system'))
app.use('/api/support', require('./routes/support'))
app.use('/api/chat', require('./routes/chat'))

const PORT = process.env.PORT || 5009
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
