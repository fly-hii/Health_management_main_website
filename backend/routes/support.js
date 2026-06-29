const express = require('express')
const router = express.Router()
const { SupportTicket } = require('../models')
const { isValidEmail } = require('../utils/validators')

router.post('/ticket', async (req, res) => {
  try {
    const { name, email, portal, priority, subject, description } = req.body

    if (!name || !email || !subject || !description) {
      return res.status(400).json({ success: false, message: 'name, email, subject, and description are required' })
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' })
    }
    if (String(subject).length > 200 || String(description).length > 5000) {
      return res.status(400).json({ success: false, message: 'Subject or description exceeds the allowed length' })
    }

    const ticket = await SupportTicket.create({
      name, email, portal, priority, subject, description,
      status: 'open'
    })

    res.status(201).json({ success: true, data: ticket, message: 'Ticket created' })
  } catch (error) {
    console.error('Support ticket creation error:', error)
    res.status(500).json({ success: false, message: 'Failed to create ticket', error: error.message })
  }
})

// POST /api/support/contact  (used by ContactPage.jsx)
router.post('/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'name, email, subject, and message are required' })
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' })
    }

    const ticket = await SupportTicket.create({
      name, email, portal: 'website', priority: 'medium',
      subject, description: message,
      status: 'open'
    })

    res.status(201).json({ success: true, data: ticket, message: 'Message received! We will get back to you soon.' })
  } catch (error) {
    console.error('Contact form error:', error)
    res.status(500).json({ success: false, message: 'Failed to send message', error: error.message })
  }
})

module.exports = router
