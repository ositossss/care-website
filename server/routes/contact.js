const r = require('express').Router(); const C = require('../models/ContactMessage');
const { protect, admin } = require('../middleware/auth');
r.post('/', async (req, res, next) => {
  try { if (!req.body.name || !req.body.email || !req.body.message) return res.status(400).json({ message: 'Name, email and message are required' });
    await C.create(req.body); res.status(201).json({ message: 'Thanks, we will be in touch soon.' }); } catch (e) { next(e); }
});
r.get('/', protect, admin, async (req, res, next) => { try { res.json(await C.find().sort('-createdAt')); } catch (e) { next(e); } });
r.patch('/:id/read', protect, admin, async (req, res, next) => { try { res.json(await C.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true })); } catch (e) { next(e); } });
module.exports = r;
