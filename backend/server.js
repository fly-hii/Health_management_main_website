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

// Build allowed origins list from env
const allowedOrigins = (process.env.ALLOWED_ORIGINS || process.env.CLIENT_URL || 'http://localhost:3000')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean)

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, server-to-server, mobile apps)
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin)) return callback(null, true)
    callback(new Error(`CORS: origin "${origin}" not allowed`))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}

const app = express()
const server = http.createServer(app)

// Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
})

// Attach io to app to use in routes
app.set('io', io)

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors(corsOptions))
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

  const mem = process.memoryUsage();
  const memUsedMb = (mem.rss / 1024 / 1024).toFixed(1);
  const memTotalMb = (mem.heapTotal / 1024 / 1024).toFixed(1);

  const health = {
    database: {
      status: dbStatus,
      responseTime: '12ms' // Mocked response time for now
    },
    api: {
      status: 'online',
      uptime: `${Math.floor(process.uptime())}s`,
      responseTime: '45ms'
    },
    socket: {
      status: 'online',
      connections: liveUsers
    },
    server: {
      status: 'online',
      memory: `${memUsedMb}MB / ${memTotalMb}MB`,
      node: process.version
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
