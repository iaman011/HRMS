const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Organization, User } = require('../models');
const { writeLog } = require('../logger');
const dotenv = require('dotenv');
dotenv.config();

const router = express.Router();
const secret = process.env.JWT_SECRET || 'secret-dev';

router.post('/register', async (req, res) => {
  const { organizationName, username, email, password } = req.body;
  if (!organizationName || !username || !email || !password) return res.status(400).json({ error: 'Missing fields' });
  try {
    const org = await Organization.create({ name: organizationName });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, passwordHash: hash, OrganizationId: org.id });
    await writeLog({ userId: user.id, orgId: org.id, action: "created_organization", message: `User '${username}' created organization '${organizationName}'` });
    return res.json({ ok: true, user: { id: user.id, username: user.username }, orgId: org.id });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ userId: user.id, orgId: user.OrganizationId }, secret, { expiresIn: '8h' });
    await writeLog({ userId: user.id, orgId: user.OrganizationId, action: 'logged_in', message: `User '${user.id}' logged in.` });
    return res.json({ token, user: { id: user.id, username: user.username }, orgId: user.OrganizationId });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post('/logout', async (req, res) => {
  // Stateless JWT: client discards token. Log the action if possible.
  const { userId, orgId } = req.body;
  await writeLog({ userId, orgId, action: 'logged_out', message: `User '${userId}' logged out.` });
  return res.json({ ok: true });
});

module.exports = router;
