// Small helper that builds list/create/update/delete routes for a model.
const router = require('express').Router;
const { protect, admin } = require('../middleware/auth');
module.exports = (Model) => {
  const r = router();
  r.get('/', async (req, res, next) => { try { res.json(await Model.find().sort('name')); } catch (e) { next(e); } });
  r.post('/', protect, admin, async (req, res, next) => { try { res.status(201).json(await Model.create(req.body)); } catch (e) { next(e); } });
  r.put('/:id', protect, admin, async (req, res, next) => {
    try { const d = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      d ? res.json(d) : res.status(404).json({ message: 'Not found' }); } catch (e) { next(e); } });
  r.delete('/:id', protect, admin, async (req, res, next) => {
    try { const d = await Model.findByIdAndDelete(req.params.id); d ? res.json({ message: 'Deleted' }) : res.status(404).json({ message: 'Not found' }); } catch (e) { next(e); } });
  return r;
};
