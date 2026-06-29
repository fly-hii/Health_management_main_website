const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')
const bcrypt = require('bcryptjs')

const User = sequelize.define('User', {
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
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('admin', 'doctor', 'nurse', 'pharmacy', 'laboratory', 'patient'),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'last_login'
  },
  refreshToken: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'refresh_token'
  },
  otp: {
    type: DataTypes.STRING,
    allowNull: true
  },
  otpExpiry: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'otp_expiry'
  },
  passwordResetToken: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'password_reset_token'
  },
  passwordResetExpiry: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'password_reset_expiry'
  },
  permissions: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const val = this.getDataValue('permissions')
      return val ? JSON.parse(val) : []
    },
    set(val) {
      this.setDataValue('permissions', val ? JSON.stringify(val) : null)
    }
  }
}, {
  tableName: 'main_users',
  hooks: {
    beforeSave: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(12)
        user.password = await bcrypt.hash(user.password, salt)
      }
    }
  }
})

User.prototype.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

User.prototype.toJSON = function () {
  const values = { ...this.get() }
  delete values.password
  delete values.refreshToken
  delete values.otp
  delete values.otpExpiry
  delete values.passwordResetToken
  delete values.passwordResetExpiry
  return values
}

module.exports = User
