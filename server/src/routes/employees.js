const express = require('express');
const { Employee, Team } = require('../models');
const { authMiddleware } = require('../middleware/auth');
const { writeLog } = require('../logger');

const router = express.Router();

// protect all employee routes
router.use(authMiddleware);

// list employees for org
router.get('/', async (req, res) => {
  const orgId = req.user.orgId;
  const employees = await Employee.findAll({ where: { OrganizationId: orgId }, include: Team });
  res.json(employees);
});

router.post('/', async (req, res) => {
  const orgId = req.user.orgId;
  const { firstName, lastName, email, position } = req.body;
  try {
    const emp = await Employee.create({ firstName, lastName, email, position, OrganizationId: orgId });
    await writeLog({ userId: req.user.id, orgId, action: 'added_employee', message: `Added employee ${emp.id}` });
    res.json(emp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  const orgId = req.user.orgId;
  const emp = await Employee.findByPk(req.params.id, { include: Team });
  if (!emp || emp.OrganizationId !== orgId) return res.status(404).json({ error: 'Not found' });
  res.json(emp);
});

router.put('/:id', async (req, res) => {
  const orgId = req.user.orgId;
  const emp = await Employee.findByPk(req.params.id);
  if (!emp || emp.OrganizationId !== orgId) return res.status(404).json({ error: 'Not found' });
  try {
    await emp.update(req.body);
    await writeLog({ userId: req.user.id, orgId, action: 'updated_employee', message: `Updated employee ${emp.id}` });
    res.json(emp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const orgId = req.user.orgId;
  const emp = await Employee.findByPk(req.params.id);
  if (!emp || emp.OrganizationId !== orgId) return res.status(404).json({ error: 'Not found' });
  try {
    await emp.destroy();
    await writeLog({ userId: req.user.id, orgId, action: 'deleted_employee', message: `Deleted employee ${emp.id}` });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Assign teams to employee: body { teamIds: [1,2] }
router.post('/:id/teams', async (req, res) => {
  const orgId = req.user.orgId;
  const emp = await Employee.findByPk(req.params.id);
  if (!emp || emp.OrganizationId !== orgId) return res.status(404).json({ error: 'Not found' });
  const { teamIds } = req.body;
  try {
    // Only allow teams that belong to org
    const teams = await Team.findAll({ where: { id: teamIds, OrganizationId: orgId } });
    await emp.setTeams(teams);
    await writeLog({ userId: req.user.id, orgId, action: 'assigned_employee_teams', message: `Assigned teams to employee ${emp.id}`, meta: { teamIds } });
    const updated = await Employee.findByPk(emp.id, { include: Team });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
