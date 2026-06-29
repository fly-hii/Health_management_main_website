const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const { protect, authorize } = require('../middleware/auth')

router.post('/login', authController.login)
router.post('/send-otp', authController.sendOTP)
router.post('/verify-otp', authController.verifyOTP)
router.post('/forgot-password', authController.forgotPassword)
router.post('/reset-password', authController.resetPassword)
router.post('/refresh', authController.refreshToken)
router.post('/logout', protect, authController.logout)
router.post('/register', protect, authorize('admin'), authController.register)
router.post('/subscribe', authController.subscribePublic)
router.post('/test-db-connection', authController.testDbConnectionPublic)

module.exports = router
