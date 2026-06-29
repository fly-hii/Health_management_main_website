const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const { Op } = require('sequelize')
const { User, AuditLog } = require('../models')
const { isValidEmail, getPasswordComplexityError } = require('../utils/validators')
const { sendOtpEmail, sendPasswordResetEmail } = require('../utils/emailService')

const VALID_ROLES = ['admin', 'doctor', 'nurse', 'pharmacy', 'laboratory', 'patient']

const generateTokens = (userId, role) => {
  const token = jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  )
  const refreshToken = jwt.sign(
    { id: userId, role },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  )
  return { token, refreshToken }
}

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' })
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' })
    }

    const query = role ? { email, role } : { email }
    const user = await User.findOne({ where: query })

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials or incorrect portal' })
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account is deactivated. Contact admin.' })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      await AuditLog.create({ user_id: user.id, action: 'LOGIN_FAILED', status: 'failure', ipAddress: req.ip })
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }

    const { token, refreshToken } = generateTokens(user.id, user.role)
    user.refreshToken = refreshToken
    user.lastLogin = new Date()
    await user.save()

    await AuditLog.create({ user_id: user.id, action: 'LOGIN_SUCCESS', status: 'success', ipAddress: req.ip })

    res.json({
      success: true,
      token,
      refreshToken,
      data: user.toJSON(),
      message: 'Login successful',
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ success: false, message: 'Server error. Please try again.' })
  }
}

// POST /api/auth/send-otp
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ where: { email } })

    if (!user) {
      // Don't reveal if email exists
      return res.json({ success: true, message: 'If this email is registered, OTP will be sent.' })
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    user.otp = otp
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 min
    await user.save()

    // Send OTP email (non-blocking — email failure won't break the API)
    sendOtpEmail(user.email, user.name, otp, 'login')
      .catch(err => console.error('⚠️  OTP email failed:', err.message))

    res.json({ success: true, message: 'OTP sent to your email address.' })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send OTP' })
  }
}

// POST /api/auth/verify-otp
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp, role } = req.body
    const user = await User.findOne({ where: { email } })

    if (!user || user.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' })
    }
    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' })
    }
    if (role && user.role !== role) {
      return res.status(401).json({ success: false, message: 'Incorrect portal for this account' })
    }

    user.otp = null
    user.otpExpiry = null
    user.lastLogin = new Date()
    const { token, refreshToken } = generateTokens(user.id, user.role)
    user.refreshToken = refreshToken
    await user.save()

    res.json({ success: true, token, refreshToken, data: user.toJSON() })
  } catch (error) {
    res.status(500).json({ success: false, message: 'OTP verification failed' })
  }
}

// POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ where: { email } })

    if (user) {
      const resetToken = crypto.randomBytes(32).toString('hex')
      user.passwordResetToken = resetToken
      user.passwordResetExpiry = new Date(Date.now() + 30 * 60 * 1000) // 30 min
      await user.save()

      // Send password reset email (non-blocking)
      sendPasswordResetEmail(user.email, user.name, resetToken)
        .catch(err => console.error('⚠️  Password reset email failed:', err.message))
    }

    res.json({ success: true, message: 'If this email is registered, a reset link has been sent.' })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to process request' })
  }
}

// POST /api/auth/reset-password
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body
    if (!token || !password) {
      return res.status(400).json({ success: false, message: 'Reset token and new password are required' })
    }
    const pwdError = getPasswordComplexityError(password)
    if (pwdError) {
      return res.status(400).json({ success: false, message: pwdError })
    }

    const user = await User.findOne({
      where: {
        passwordResetToken: token,
        passwordResetExpiry: { [Op.gt]: new Date() }
      }
    })

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' })
    }

    user.password = password
    user.passwordResetToken = null
    user.passwordResetExpiry = null
    await user.save()

    res.json({ success: true, message: 'Password reset successfully. You can now log in.' })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to reset password' })
  }
}

// POST /api/auth/refresh
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) return res.status(401).json({ success: false, message: 'No refresh token' })

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
    const user = await User.findByPk(decoded.id)

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' })
    }

    const tokens = generateTokens(user.id, user.role)
    user.refreshToken = tokens.refreshToken
    await user.save()

    res.json({ success: true, ...tokens })
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid or expired refresh token' })
  }
}

// POST /api/auth/logout
exports.logout = async (req, res) => {
  try {
    if (req.user) {
      await User.update({ refreshToken: null }, { where: { id: req.user.id } })
    }
    res.json({ success: true, message: 'Logged out successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Logout failed' })
  }
}

// POST /api/auth/register (admin only)
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body

    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: 'name, email, password, and role are required' })
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' })
    }
    if (!VALID_ROLES.includes(role)) {
      return res.status(400).json({ success: false, message: `Invalid role. Allowed: ${VALID_ROLES.join(', ')}` })
    }
    const pwdError = getPasswordComplexityError(password)
    if (pwdError) {
      return res.status(400).json({ success: false, message: pwdError })
    }

    const existing = await User.findOne({ where: { email } })
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already registered' })
    }
    const user = await User.create({ name, email, password, role, phone })
    res.status(201).json({ success: true, data: user.toJSON(), message: 'User registered successfully' })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ success: false, message: 'Registration failed' })
  }
}

// POST /api/auth/subscribe (proxies to super-admin backend)
exports.subscribePublic = async (req, res) => {
  try {
    const superAdminUrl = process.env.SUPER_ADMIN_API_URL || 'http://localhost:5000'
    const response = await fetch(`${superAdminUrl}/api/auth/register-hospital`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    })

    const data = await response.json()
    if (!response.ok) {
      return res.status(response.status).json(data)
    }

    res.status(response.status).json(data)
  } catch (error) {
    console.error('subscribePublic error:', error)
    res.status(500).json({ success: false, message: 'Failed to communicate with provisioning service: ' + error.message })
  }
}

// POST /api/auth/test-db-connection (proxies to super-admin backend)
exports.testDbConnectionPublic = async (req, res) => {
  try {
    const superAdminUrl = process.env.SUPER_ADMIN_API_URL || 'http://localhost:5000'
    const response = await fetch(`${superAdminUrl}/api/auth/test-db-connection`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    })

    const data = await response.json()
    res.status(response.status).json(data)
  } catch (error) {
    console.error('testDbConnectionPublic proxy error:', error)
    res.status(500).json({ success: false, message: 'Failed to communicate with DB validation service: ' + error.message })
  }
}
