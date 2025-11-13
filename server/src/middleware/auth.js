const jwt = require('jsonwebtoken');
const { User, Organization } = require('../models');
const dotenv = require('dotenv');
dotenv.config();

const secret = process.env.JWT_SECRET || 'secret-dev';

async function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Unauthorized' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, secret);
    const user = await User.findByPk(payload.userId, { include: Organization });
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    req.user = { id: user.id, username: user.username, orgId: user.OrganizationId };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = { authMiddleware };
