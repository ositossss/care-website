const r = require('express').Router();
const Appointment = require('../models/Appointment'); const Doctor = require('../models/Doctor');
const { protect, admin, optionalAuth } = require('../middleware/auth');
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const pop = (q) => q.populate('doctor', 'name specialty').populate('department', 'name').sort('-date -createdAt');
// Slots already taken for a doctor on a date (used by the booking page)
r.get('/booked', async (req, res, next) => {
  try { const a = await Appointment.find({ doctor: req.query.doctor, date: req.query.date, status: { $ne: 'cancelled' } });
    res.json(a.map((x) => x.timeSlot)); } catch (e) { next(e); }
});
r.post('/', optionalAuth, async (req, res, next) => {
  try {
    const { doctor, date, timeSlot, reason, patientName, patientEmail, patientPhone } = req.body;
    if (![doctor, date, timeSlot, patientName, patientEmail, patientPhone].every(Boolean)) return res.status(400).json({ message: 'Please fill in all required fields' });
    const doc = await Doctor.findById(doctor);
    if (!doc || !doc.isActive) return res.status(404).json({ message: 'Doctor not found' });
    if (new Date(date + 'T23:59:59') < new Date()) return res.status(400).json({ message: 'Date must be today or later' });
    if (!doc.availableDays.includes(DAYS[new Date(date + 'T12:00:00').getDay()])) return res.status(400).json({ message: 'Doctor is not available that day' });
    if (!doc.timeSlots.includes(timeSlot)) return res.status(400).json({ message: 'Invalid time slot' });
    if (await Appointment.findOne({ doctor, date, timeSlot, status: { $ne: 'cancelled' } })) return res.status(409).json({ message: 'That slot was just booked. Please pick another time.' });
    const a = await Appointment.create({ referenceId: 'CF-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase(),
      patient: req.user?._id, patientName, patientEmail, patientPhone, doctor, department: doc.department, date, timeSlot, reason });
    res.status(201).json(a);
  } catch (e) { next(e); }
});
r.get('/my', protect, async (req, res, next) => { try { res.json(await pop(Appointment.find({ patient: req.user._id }))); } catch (e) { next(e); } });
r.get('/', protect, admin, async (req, res, next) => {
  try { const q = {}; if (req.query.status) q.status = req.query.status; if (req.query.date) q.date = req.query.date;
    res.json(await pop(Appointment.find(q))); } catch (e) { next(e); }
});
r.patch('/:id/status', protect, async (req, res, next) => {
  try {
    const { status } = req.body; const a = await Appointment.findById(req.params.id);
    if (!a) return res.status(404).json({ message: 'Appointment not found' });
    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) return res.status(400).json({ message: 'Invalid status' });
    if (req.user.role !== 'admin' && (String(a.patient) !== String(req.user._id) || status !== 'cancelled'))
      return res.status(403).json({ message: 'You can only cancel your own appointments' });
    a.status = status; await a.save(); res.json(a);
  } catch (e) { next(e); }
});
module.exports = r;
