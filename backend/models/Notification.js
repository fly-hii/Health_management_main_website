const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('system', 'maintenance', 'security', 'update', 'info'),
    defaultValue: 'info'
  },
  targetRoles: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'target_roles',
    get() {
      const val = this.getDataValue('targetRoles')
      return val ? JSON.parse(val) : []
    },
    set(val) {
      this.setDataValue('targetRoles', val ? JSON.stringify(val) : null)
    }
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_read'
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'expires_at'
  }
}, {
  tableName: 'main_notifications'
})

module.exports = Notification
