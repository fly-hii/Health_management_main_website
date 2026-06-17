const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')

router.post('/login', authController.login)
router.post('/send-otp', authController.sendOTP)
router.post('/verify-otp', authController.verifyOTP)
router.post('/forgot-password', authController.forgotPassword)
router.post('/reset-password', authController.resetPassword)
router.post('/refresh', authController.refreshToken)
router.post('/logout', authController.logout)
router.post('/register', authController.register)

module.exports = router
