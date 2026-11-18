const m = require('mongoose');
module.exports = m.model('ContactMessage', new m.Schema({
  name: { type: String, required: true }, email: { type: String, required: true }, phone: String,
  subject: String, message: { type: String, required: true }, isRead: { type: Boolean, default: false },
}, { timestamps: { createdAt: true, updatedAt: false } }));
