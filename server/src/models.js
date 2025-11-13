const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

// Allow flexible DB for local development. Use DATABASE_URL if provided.
// Otherwise support DB_DIALECT (e.g., 'sqlite' for easy local dev) or fallback to Postgres.
const connectionString = process.env.DATABASE_URL;
let sequelize;
if (connectionString) {
  sequelize = new Sequelize(connectionString, { logging: false });
} else {
  // Default to a simple file-based SQLite DB for local development when DATABASE_URL is not provided.
  const storage = process.env.SQLITE_STORAGE || path.join(__dirname, '..', 'data', 'dev.sqlite');
  sequelize = new Sequelize({ dialect: 'sqlite', storage, logging: false });
}

const Organization = sequelize.define('Organization', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
});

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  passwordHash: { type: DataTypes.STRING, allowNull: false },
});

const Employee = sequelize.define('Employee', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: true },
  email: { type: DataTypes.STRING, allowNull: true },
  position: { type: DataTypes.STRING, allowNull: true },
});

const Team = sequelize.define('Team', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
});

const EmployeeTeam = sequelize.define('EmployeeTeam', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const Log = sequelize.define('Log', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  userId: { type: DataTypes.STRING },
  orgId: { type: DataTypes.INTEGER },
  action: { type: DataTypes.STRING },
  message: { type: DataTypes.TEXT },
  meta: { type: DataTypes.JSONB, allowNull: true },
});

// Associations
Organization.hasMany(User);
User.belongsTo(Organization);

Organization.hasMany(Employee);
Employee.belongsTo(Organization);

Organization.hasMany(Team);
Team.belongsTo(Organization);

Employee.belongsToMany(Team, { through: EmployeeTeam });
Team.belongsToMany(Employee, { through: EmployeeTeam });

module.exports = {
  sequelize,
  Organization,
  User,
  Employee,
  Team,
  EmployeeTeam,
  Log,
};
