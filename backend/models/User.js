const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: {
    type: String,
    enum: ['admin', 'doctor', 'nurse', 'pharmacy', 'laboratory', 'patient'],
    required: true,
  },
  phone: { type: String },
  avatar: { type: String },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  refreshToken: { type: String },
  otp: { type: String },
  otpExpiry: { type: Date },
  passwordResetToken: { type: String },
  passwordResetExpiry: { type: Date },
  permissions: [{ type: String }],
}, {
  timestamps: true,
})

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  const salt = await bcrypt.genSalt(12)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

userSchema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.password
  delete obj.refreshToken
  delete obj.otp
  delete obj.otpExpiry
  delete obj.passwordResetToken
  delete obj.passwordResetExpiry
  return obj
}

module.exports = mongoose.model('User', userSchema)
