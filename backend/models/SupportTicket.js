const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')

const SupportTicket = sequelize.define('SupportTicket', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  portal: {
    type: DataTypes.ENUM('admin', 'doctor', 'nurse', 'pharmacy', 'laboratory', 'patient'),
    allowNull: true
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium'
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('open', 'in_progress', 'resolved', 'closed'),
    defaultValue: 'open'
  },
  resolvedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'resolved_at'
  },
  ticketId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    field: 'ticket_id'
  }
}, {
  tableName: 'main_support_tickets',
  hooks: {
    beforeCreate: (ticket) => {
      if (!ticket.ticketId) {
        ticket.ticketId = `CP-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`
      }
    }
  }
})

module.exports = SupportTicket
