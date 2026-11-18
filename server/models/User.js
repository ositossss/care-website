const m = require('mongoose');
module.exports = m.model('User', new m.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phone: String,
  emergencyContact: { name: String, phone: String },
  role: { type: String, enum: ['patient', 'admin'], default: 'patient' },
}, { timestamps: { createdAt: true, updatedAt: false } }));
