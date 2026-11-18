const m = require('mongoose');
const ref = (r, req) => ({ type: m.Schema.Types.ObjectId, ref: r, required: req });
module.exports = m.model('Appointment', new m.Schema({
  referenceId: { type: String, unique: true }, patient: ref('User', false),
  patientName: { type: String, required: true }, patientEmail: { type: String, required: true }, patientPhone: { type: String, required: true },
  doctor: ref('Doctor', true), department: ref('Department', true),
  date: { type: String, required: true }, // YYYY-MM-DD
  timeSlot: { type: String, required: true }, reason: String,
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
}, { timestamps: { createdAt: true, updatedAt: false } }));
