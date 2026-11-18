const r = require('express').Router();
const bcrypt = require('bcryptjs'); const jwt = require('jsonwebtoken');
const User = require('../models/User'); const { protect } = require('../middleware/auth');
const sign = (u) => ({ token: jwt.sign({ id: u._id }, process.env.JWT_SECRET, { expiresIn: '7d' }),
  user: { _id: u._id, name: u.name, email: u.email, phone: u.phone, role: u.role, emergencyContact: u.emergencyContact } });
r.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required' });
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
    if (await User.findOne({ email: email.toLowerCase() })) return res.status(409).json({ message: 'Email already registered' });
    res.status(201).json(sign(await User.create({ name, email, phone, password: await bcrypt.hash(password, 10), role: 'patient' })));
  } catch (e) { next(e); }
});
r.post('/login', async (req, res, next) => {
  try {
    const u = await User.findOne({ email: (req.body.email || '').toLowerCase() });
    if (!u || !(await bcrypt.compare(req.body.password || '', u.password))) return res.status(401).json({ message: 'Incorrect email or password' });
    res.json(sign(u));
  } catch (e) { next(e); }
});
r.get('/me', protect, (req, res) => res.json(req.user));
r.put('/me', protect, async (req, res, next) => {
  try { const { name, phone, emergencyContact } = req.body;
    res.json(await User.findByIdAndUpdate(req.user._id, { name, phone, emergencyContact }, { new: true }).select('-password')); } catch (e) { next(e); }
});
module.exports = r;
