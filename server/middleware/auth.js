const jwt = require('jsonwebtoken');
const User = require('../models/User');
const load = async (req) => {
  const t = (req.headers.authorization || '').split(' ')[1];
  if (!t) return null;
  return User.findById(jwt.verify(t, process.env.JWT_SECRET).id).select('-password');
};
exports.protect = async (req, res, next) => {
  try { req.user = await load(req); if (!req.user) return res.status(401).json({ message: 'Please log in' }); next(); }
  catch { res.status(401).json({ message: 'Session expired, please log in again' }); }
};
exports.optionalAuth = async (req, res, next) => { try { req.user = await load(req); } catch {} next(); };
exports.admin = (req, res, next) => req.user?.role === 'admin' ? next() : res.status(403).json({ message: 'Admin access only' });
exports.notFound = (req, res) => res.status(404).json({ message: 'Route not found' });
exports.errorHandler = (err, req, res, next) => {
  const code = err.name === 'ValidationError' || err.name === 'CastError' ? 400 : err.code === 11000 ? 409 : 500;
  res.status(code).json({ message: code === 409 ? 'Already exists' : err.message });
};
