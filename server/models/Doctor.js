const m = require('mongoose');
module.exports = m.model('Doctor', new m.Schema({
  name: { type: String, required: true }, email: String,
  department: { type: m.Schema.Types.ObjectId, ref: 'Department', required: true },
  specialty: String, qualifications: String, experienceYears: { type: Number, default: 0 }, bio: String,
  availableDays: [String], timeSlots: [String], imageUrl: String, isActive: { type: Boolean, default: true },
}));
