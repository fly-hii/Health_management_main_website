const mongoose = require('mongoose')

const supportTicketSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  portal: { type: String, enum: ['admin', 'doctor', 'nurse', 'pharmacy', 'laboratory', 'patient'] },
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['open', 'in_progress', 'resolved', 'closed'], default: 'open' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resolvedAt: { type: Date },
  ticketId: { type: String, unique: true },
}, { timestamps: true })

supportTicketSchema.pre('save', function (next) {
  if (!this.ticketId) {
    this.ticketId = `CP-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`
  }
  next()
})

module.exports = mongoose.model('SupportTicket', supportTicketSchema)
