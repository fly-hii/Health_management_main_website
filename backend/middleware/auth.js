const jwt = require('jsonwebtoken')
const { User } = require('../models')

// Verify a Bearer JWT and attach the authenticated user to req.user.
const protect = async (req, res, next) => {
  const auth = req.headers.authorization
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' })
  }

  try {
    const decoded = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET)
    const user = await User.findByPk(decoded.id)
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' })
    }
    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account is deactivated' })
    }
    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized, token failed' })
  }
}

// Restrict a route to one or more roles. Must run after protect.
const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'Not authorized for this action' })
  }
  next()
}

module.exports = { protect, authorize }
