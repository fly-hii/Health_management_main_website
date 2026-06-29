const { sequelize } = require('../config/db')
const User = require('./User')
const AuditLog = require('./AuditLog')
const Notification = require('./Notification')
const SupportTicket = require('./SupportTicket')

// Define relationships
User.hasMany(AuditLog, { foreignKey: 'user_id', as: 'auditLogs' })
AuditLog.belongsTo(User, { foreignKey: 'user_id', as: 'user' })

User.hasMany(SupportTicket, { foreignKey: 'assigned_to', as: 'assignedTickets' })
SupportTicket.belongsTo(User, { foreignKey: 'assigned_to', as: 'assignee' })

module.exports = {
  sequelize,
  User,
  AuditLog,
  Notification,
  SupportTicket
}
