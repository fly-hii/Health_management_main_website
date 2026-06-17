const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['system', 'maintenance', 'security', 'update', 'info'], default: 'info' },
  targetRoles: [{ type: String }],
  isRead: { type: Boolean, default: false },
  expiresAt: { type: Date },
}, { timestamps: true })

module.exports = mongoose.model('Notification', notificationSchema)
