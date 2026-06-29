const express = require('express')
const router = express.Router()
const { SupportTicket } = require('../models')

router.post('/ticket', async (req, res) => {
  try {
    const { name, email, portal, priority, subject, description } = req.body
    
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

module.exports = router
