const express = require('express');
const { Team, Employee } = require('../models');
const { authMiddleware } = require('../middleware/auth');
const { writeLog } = require('../logger');

const router = express.Router();
router.use(authMiddleware);

router.get('/', async (req, res) => {
  const orgId = req.user.orgId;
  const teams = await Team.findAll({ where: { OrganizationId: orgId }, include: Employee });
  res.json(teams);
});

router.post('/', async (req, res) => {
  const orgId = req.user.orgId;
  const { name } = req.body;
  try {
    const t = await Team.create({ name, OrganizationId: orgId });
    await writeLog({ userId: req.user.id, orgId, action: 'added_team', message: `Added team ${t.id}` });
    res.json(t);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  const orgId = req.user.orgId;
  const t = await Team.findByPk(req.params.id, { include: Employee });
  if (!t || t.OrganizationId !== orgId) return res.status(404).json({ error: 'Not found' });
  res.json(t);
});

router.put('/:id', async (req, res) => {
  const orgId = req.user.orgId;
  const t = await Team.findByPk(req.params.id);
  if (!t || t.OrganizationId !== orgId) return res.status(404).json({ error: 'Not found' });
  try {
    await t.update(req.body);
    await writeLog({ userId: req.user.id, orgId, action: 'updated_team', message: `Updated team ${t.id}` });
    res.json(t);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const orgId = req.user.orgId;
  const t = await Team.findByPk(req.params.id);
  if (!t || t.OrganizationId !== orgId) return res.status(404).json({ error: 'Not found' });
  try {
    await t.destroy();
    await writeLog({ userId: req.user.id, orgId, action: 'deleted_team', message: `Deleted team ${t.id}` });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add or set employees in a team: body { employeeIds: [1,2] }
router.post('/:id/employees', async (req, res) => {
  const orgId = req.user.orgId;
  const t = await Team.findByPk(req.params.id);
  if (!t || t.OrganizationId !== orgId) return res.status(404).json({ error: 'Not found' });
  const { employeeIds } = req.body;
  try {
    const employees = await Employee.findAll({ where: { id: employeeIds, OrganizationId: orgId } });
    await t.setEmployees(employees);
    await writeLog({ userId: req.user.id, orgId, action: 'updated_team_members', message: `Updated members for team ${t.id}`, meta: { employeeIds } });
    const updated = await Team.findByPk(t.id, { include: Employee });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
