const r = require('express').Router();
const Doctor = require('../models/Doctor');
const { protect, admin } = require('../middleware/auth');
r.get('/', async (req, res, next) => {
  try {
    const q = { isActive: true };
    if (req.query.department) q.department = req.query.department;
    if (req.query.search) q.name = new RegExp(req.query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    res.json(await Doctor.find(q).populate('department', 'name slug').sort('name'));
  } catch (e) { next(e); }
});
r.get('/:id', async (req, res, next) => {
  try { const d = await Doctor.findById(req.params.id).populate('department', 'name slug'); d ? res.json(d) : res.status(404).json({ message: 'Doctor not found' }); } catch (e) { next(e); }
});
r.post('/', protect, admin, async (req, res, next) => { try { res.status(201).json(await Doctor.create(req.body)); } catch (e) { next(e); } });
r.put('/:id', protect, admin, async (req, res, next) => { try { res.json(await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })); } catch (e) { next(e); } });
r.delete('/:id', protect, admin, async (req, res, next) => { try { await Doctor.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); } catch (e) { next(e); } });
module.exports = r;
