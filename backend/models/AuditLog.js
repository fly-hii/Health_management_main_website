const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')

const AuditLog = sequelize.define('AuditLog', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false
  },
  resource: {
    type: DataTypes.STRING,
    allowNull: true
  },
  resourceId: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'resource_id'
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'ip_address'
  },
  userAgent: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'user_agent'
  },
  status: {
    type: DataTypes.ENUM('success', 'failure'),
    defaultValue: 'success'
  },
  metadata: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const val = this.getDataValue('metadata')
      return val ? JSON.parse(val) : null
    },
    set(val) {
      this.setDataValue('metadata', val ? JSON.stringify(val) : null)
    }
  }
}, {
  tableName: 'main_audit_logs'
})

module.exports = AuditLog
