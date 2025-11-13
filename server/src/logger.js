const fs = require('fs');
const path = require('path');
const { Log } = require('./models');

const logDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
const auditPath = path.join(logDir, 'audit.log');

async function writeLog({ userId, orgId, action, message, meta }) {
  const entry = `[${new Date().toISOString()}] User '${userId || 'system'}' ${action} - ${message || ''}`;
  fs.appendFileSync(auditPath, entry + '\n');
  try {
    await Log.create({ userId: userId?.toString(), orgId, action, message, meta });
  } catch (err) {
    // swallow DB logging errors but write to file
    fs.appendFileSync(auditPath, `[${new Date().toISOString()}] LOG_ERROR ${err.message}\n`);
  }
}

module.exports = { writeLog };
