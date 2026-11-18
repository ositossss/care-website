const m = require('mongoose');
module.exports = m.model('Department', new m.Schema({
  name: { type: String, required: true }, slug: { type: String, required: true, unique: true },
  description: String, services: [String], iconName: { type: String, default: 'Stethoscope' },
}, { timestamps: { createdAt: true, updatedAt: false } }));
