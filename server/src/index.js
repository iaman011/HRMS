const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const employeesRoutes = require('./routes/employees');
const teamsRoutes = require('./routes/teams');

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeesRoutes);
app.use('/api/teams', teamsRoutes);

app.get('/', (req, res) => res.json({ ok: true, msg: 'HRMS backend running' }));

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await sequelize.authenticate();
    // sync all models
    await sequelize.sync();
    app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();
