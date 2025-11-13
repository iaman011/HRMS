# Human Resource Management System (HRMS)

A full-stack application for managing employees, teams, and organizational data with secure authentication and comprehensive logging.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Installation & Setup](#installation--setup)
6. [Configuration](#configuration)
7. [Running the Application](#running-the-application)
8. [API Documentation](#api-documentation)
9. [Architecture & Design](#architecture--design)
10. [Database Schema](#database-schema)
11. [Security Features](#security-features)
12. [Logging System](#logging-system)
13. [Requirements Implementation](#requirements-implementation)
14. [Performance & Optimization](#performance--optimization)
15. [Contributing](#contributing)
16. [License](#license)

---

## Overview

The Human Resource Management System (HRMS) is a comprehensive FullStack solution designed to help organizations manage their employees and team structures efficiently. This system enforces proper authentication, maintains audit trails through detailed logging, and provides an intuitive interface for HR operations.

**Key Philosophy:**
- **Security First**: All operations require authentication and authorization
- **Audit Trail**: Every action is logged with timestamps and user information
- **Multi-Tenant**: Support for multiple organizations with isolated data
- **Scalable Design**: Built with best practices for maintainability and performance

---

## Features

### Core Functionality

✅ **Employee Management**
- Create, read, update, and delete employees
- Assign employees to multiple teams
- Track employee details (name, email, position)
- View team assignments for each employee

✅ **Team Management**
- Create, read, update, and delete teams
- Manage team members
- View all employees assigned to a team
- Support for employees in multiple teams

✅ **Organization Management**
- Support for multi-tenant architecture
- Organization account creation
- Isolated data per organization

✅ **Authentication & Authorization**
- User registration with organization account creation
- Secure login with JWT tokens
- Session management and logout
- Password hashing with bcrypt
- Bearer token-based API authentication

✅ **Comprehensive Logging**
- Track all user login/logout activities
- Log employee creation, updates, and deletions
- Log team creation, updates, and deletions
- Track employee-team assignment changes
- Audit trail with timestamps and user context
- Structured log entries with metadata

✅ **UI/UX**
- Clean, intuitive React-based interface
- Responsive design for various devices
- Real-time data updates
- Form validation and error handling
- Multi-select support for team assignments

---

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **ORM**: Sequelize
- **Database**: PostgreSQL
- **Authentication**: JSON Web Tokens (JWT)
- **Password Security**: bcrypt
- **Middleware**: CORS, Body Parser

### Frontend
- **Library**: React.js
- **Build Tool**: Vite
- **Styling**: CSS 
- **HTTP Client**: Fetch API

### Database
- **Primary**: PostgreSQL
- **Development**: SQLite (for easy local setup)
- **Connection**: Sequelize ORM

---

## Project Structure

```
HRMS/
├── client/                          # React frontend application
│   ├── index.html                  # HTML entry point
│   ├── package.json                # Client dependencies
│   ├── src/
│   │   ├── main.jsx               # React entry point
│   │   ├── App.jsx                # Main application component
│   │   ├── api.js                 # API client functions
│   │   └── styles.css             # Global styles
│   └── vite.config.js             # Vite configuration (implicit)
│
├── server/                          # Node.js backend application
│   ├── package.json                # Server dependencies
│   ├── README.md                   # Server-specific documentation
│   ├── .env.example                # Environment variables template
│   ├── .gitignore                  # Git ignore rules
│   ├── logs/                       # Application logs directory
│   └── src/
│       ├── index.js                # Server entry point
│       ├── logger.js               # Logging utilities
│       ├── models.js               # Sequelize models & associations
│       ├── middleware/
│       │   └── auth.js             # JWT authentication middleware
│       └── routes/
│           ├── auth.js             # Authentication routes
│           ├── employees.js        # Employee CRUD routes
│           └── teams.js            # Team CRUD routes
│
├── README.md                        # This file
└── .gitignore                       # Git ignore rules
```

---

## Installation & Setup

### Prerequisites

Ensure you have the following installed on your system:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download](https://git-scm.com/)
- **PostgreSQL** (for production) - [Download](https://www.postgresql.org/download/)
  - *Optional for development: SQLite is supported for local testing*

### Step 1: Clone the Repository

```bash
git clone https://github.com/iaman011/HRMS.git
cd HRMS
```

### Step 2: Backend Setup

```bash
cd server
npm install
```

### Step 3: Frontend Setup

```bash
cd ../client
npm install
```


## Configuration

### Backend Environment Variables

Create or update `server/.env`:

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Database Configuration (choose one approach)

# Option 1: PostgreSQL (Production Recommended)
DATABASE_URL=postgresql://username:password@localhost:5432/hrms_db

# Option 2: SQLite (Development Default)
SQLITE_STORAGE=./data/dev.sqlite

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRY=7d

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/app.log
```

**Important Security Notes:**
- Change `JWT_SECRET` to a strong, random string in production
- Use environment-specific secrets for each deployment
- Never commit `.env` files to version control
- Use `.env.example` as a template for team members

---

## Running the Application

### Development Mode

**Terminal 1 - Backend Server:**

```bash
cd server
npm run dev
```

The server will start on `http://localhost:4000` with hot-reload enabled via nodemon.

**Terminal 2 - Frontend Development Server:**

```bash
cd client
npm run dev
```

The frontend will start on `http://localhost:5173` (or another available port).

### Production Mode

**Build Frontend:**

```bash
cd client
npm run build
```

**Start Backend:**

```bash
cd server
npm start
```

### Verify Installation

- Backend Health: `curl http://localhost:4000/` → Should return `{"ok": true, "msg": "HRMS backend running"}`
- Frontend: Open `http://localhost:5173` in your browser

---

## API Documentation

### Base URL
```
http://localhost:4000/api
```

### Authentication Routes
**Prefix**: `/api/auth`

#### Register Organization & User
```http
POST /api/auth/register
Content-Type: application/json

{
  "organizationName": "Acme Corp",
  "username": "john_doe",
  "email": "john@acme.com",
  "password": "securePassword123"
}

Response: 201 Created
{
  "ok": true,
  "message": "Organization and user created successfully",
  "userId": 1,
  "orgId": 1
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@acme.com",
  "password": "securePassword123"
}

Response: 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@acme.com"
  },
  "orgId": 1
}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": 1,
  "orgId": 1
}

Response: 200 OK
{
  "ok": true,
  "message": "Logged out successfully"
}
```

### Employee Routes
**Prefix**: `/api/employees`
**Authentication**: Required (Bearer Token)

#### List All Employees (for Organization)
```http
GET /api/employees
Authorization: Bearer {token}

Response: 200 OK
[
  {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@acme.com",
    "position": "Manager",
    "Teams": [
      { "id": 1, "name": "Engineering" }
    ]
  }
]
```

#### Create Employee
```http
POST /api/employees
Authorization: Bearer {token}
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@acme.com",
  "position": "Developer"
}

Response: 201 Created
{
  "id": 2,
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@acme.com",
  "position": "Developer",
  "orgId": 1
}
```

#### Update Employee
```http
PUT /api/employees/:employeeId
Authorization: Bearer {token}
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith",
  "position": "Senior Developer"
}

Response: 200 OK
{
  "id": 2,
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@acme.com",
  "position": "Senior Developer",
  "orgId": 1
}
```

#### Delete Employee
```http
DELETE /api/employees/:employeeId
Authorization: Bearer {token}

Response: 200 OK
{
  "ok": true,
  "message": "Employee deleted successfully"
}
```

#### Assign Teams to Employee
```http
POST /api/employees/:employeeId/teams
Authorization: Bearer {token}
Content-Type: application/json

{
  "teamIds": [1, 2, 3]
}

Response: 200 OK
{
  "ok": true,
  "message": "Teams assigned successfully"
}
```

### Team Routes
**Prefix**: `/api/teams`
**Authentication**: Required (Bearer Token)

#### List All Teams (for Organization)
```http
GET /api/teams
Authorization: Bearer {token}

Response: 200 OK
[
  {
    "id": 1,
    "name": "Engineering",
    "Employees": [
      { "id": 1, "firstName": "John", "lastName": "Doe" }
    ]
  }
]
```

#### Create Team
```http
POST /api/teams
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Engineering"
}

Response: 201 Created
{
  "id": 1,
  "name": "Engineering",
  "orgId": 1
}
```

#### Update Team
```http
PUT /api/teams/:teamId
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Engineering & DevOps"
}

Response: 200 OK
{
  "id": 1,
  "name": "Engineering & DevOps",
  "orgId": 1
}
```

#### Delete Team
```http
DELETE /api/teams/:teamId
Authorization: Bearer {token}

Response: 200 OK
{
  "ok": true,
  "message": "Team deleted successfully"
}
```

#### Assign Employees to Team
```http
POST /api/teams/:teamId/employees
Authorization: Bearer {token}
Content-Type: application/json

{
  "employeeIds": [1, 2, 3]
}

Response: 200 OK
{
  "ok": true,
  "message": "Employees assigned successfully"
}
```

---

## Architecture & Design

### Design Patterns

#### 1. **Model-View-Controller (MVC) Backend**
- **Models** (`src/models.js`): Sequelize ORM models with associations
- **Routes** (`src/routes/`): Express route handlers
- **Middleware** (`src/middleware/`): Authentication and request processing

#### 2. **Component-Based Frontend**
- Single App component managing state
- API integration layer (`api.js`)
- Separation of concerns with utility functions

#### 3. **Multi-Tenant Architecture**
- Every resource (Employee, Team) belongs to an Organization
- Organization isolation at database level
- JWT tokens include user and organization context

### Key Design Decisions

#### Why Sequelize ORM?
- **Database Agnostic**: Easy to switch between PostgreSQL and SQLite
- **Type Safety**: Built-in validation and constraints
- **Relationships**: Powerful association management for complex queries
- **Migrations**: Structured schema changes (ready for future expansion)

#### Why JWT Authentication?
- **Stateless**: No session storage required
- **Scalable**: Works seamlessly with distributed systems
- **Standard**: Industry-standard for REST APIs
- **Secure**: Cryptographic signing prevents tampering

#### Why React.js?
- **Declarative**: UI automatically updates with state changes
- **Component Reusability**: Modular and maintainable code
- **Ecosystem**: Rich libraries for state management and routing
- **Developer Experience**: Hot module reloading with Vite

---

## Database Schema

### Entity Relationship Diagram

```
Organization (1) ──┬──> (N) User
                   ├──> (N) Employee
                   └──> (N) Team

Employee (1) ──<──> (N) Team  [through EmployeeTeam junction table]

User (1) ──> (N) Log
```

### Tables

#### `Organizations`
```sql
- id: INTEGER PRIMARY KEY AUTO_INCREMENT
- name: VARCHAR(255) NOT NULL
- createdAt: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- updatedAt: TIMESTAMP
```

#### `Users`
```sql
- id: INTEGER PRIMARY KEY AUTO_INCREMENT
- username: VARCHAR(255) NOT NULL UNIQUE
- email: VARCHAR(255) NOT NULL UNIQUE
- passwordHash: VARCHAR(255) NOT NULL [bcrypt hashed]
- organizationId: INTEGER NOT NULL (Foreign Key → Organizations)
- createdAt: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- updatedAt: TIMESTAMP
```

#### `Employees`
```sql
- id: INTEGER PRIMARY KEY AUTO_INCREMENT
- firstName: VARCHAR(255) NOT NULL
- lastName: VARCHAR(255)
- email: VARCHAR(255)
- position: VARCHAR(255)
- organizationId: INTEGER NOT NULL (Foreign Key → Organizations)
- createdAt: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- updatedAt: TIMESTAMP
```

#### `Teams`
```sql
- id: INTEGER PRIMARY KEY AUTO_INCREMENT
- name: VARCHAR(255) NOT NULL
- organizationId: INTEGER NOT NULL (Foreign Key → Organizations)
- createdAt: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- updatedAt: TIMESTAMP
```

#### `EmployeeTeams` (Junction Table)
```sql
- id: INTEGER PRIMARY KEY AUTO_INCREMENT
- employeeId: INTEGER NOT NULL (Foreign Key → Employees)
- teamId: INTEGER NOT NULL (Foreign Key → Teams)
- createdAt: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- updatedAt: TIMESTAMP

Unique Constraint: (employeeId, teamId)
```

#### `Logs`
```sql
- id: INTEGER PRIMARY KEY AUTO_INCREMENT
- timestamp: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- userId: INTEGER [Foreign Key → Users]
- orgId: INTEGER NOT NULL [Foreign Key → Organizations]
- action: VARCHAR(255) NOT NULL
- message: TEXT
- meta: JSONB [stores additional metadata]
- createdAt: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### Schema Normalization

- **First Normal Form (1NF)**: All tables have atomic values
- **Second Normal Form (2NF)**: All non-key attributes depend on the entire primary key
- **Third Normal Form (3NF)**: No transitive dependencies between non-key attributes
- **Many-to-Many**: Properly handled through `EmployeeTeams` junction table

---

## Security Features

### Authentication

✅ **Password Security**
- Passwords hashed with bcrypt (salt rounds: 10)
- Salts are unique per password
- Never store plaintext passwords

✅ **JWT Tokens**
- Signed with HS256 algorithm
- Configurable expiry (default: 7 days)
- Claims include: `userId`, `orgId`, `email`, `iat`, `exp`

✅ **Bearer Token Validation**
- All protected routes require valid JWT in Authorization header
- Tokens automatically validated by middleware
- Expired tokens rejected with 401 status

### Authorization

✅ **Organization Isolation**
- Each user belongs to one organization
- Users can only access their organization's data
- Resources filtered by `organizationId` in all queries

✅ **Role-Based Access Control** (Ready for expansion)
- Current: All authenticated users have same permissions
- Future: Admin, Manager, Employee roles can be added

### Input Validation

✅ **Data Validation**
- Email format validation
- Required field validation
- Type checking through Sequelize models
- SQL injection protection via parameterized queries (Sequelize)

✅ **Rate Limiting** (Ready for implementation)
- Can be added via `express-rate-limit` middleware

### CORS & Headers

✅ **Cross-Origin Resource Sharing**
- CORS enabled for frontend development
- Can be restricted to specific origins in production

---

## Logging System

### Logging Architecture

**File**: `server/src/logger.js`

#### Log Format
```
[TIMESTAMP] USER_ID | ORG_ID | ACTION | MESSAGE [META]
```

#### Example Log Entries

```
2025-01-15T10:30:45.123Z | User '1' logged in. | OrgId: 1
2025-01-15T10:31:20.456Z | User '1' added a new employee with ID 5. | OrgId: 1
2025-01-15T10:35:10.789Z | User '1' updated employee 5. | OrgId: 1 | Changes: {position: "Manager"}
2025-01-15T10:40:05.012Z | User '1' assigned employee 5 to team 3. | OrgId: 1
2025-01-15T10:45:30.345Z | User '1' created team 'DevOps' (ID: 3). | OrgId: 1
2025-01-15T10:50:15.678Z | User '1' deleted employee 5. | OrgId: 1
2025-01-15T10:55:22.901Z | User '1' logged out. | OrgId: 1
```

### Logged Events

| Event | Logged | Details |
|-------|--------|---------|
| User Registration | ✅ | Organization created, user created |
| User Login | ✅ | Timestamp, user ID, organization |
| User Logout | ✅ | Timestamp, user ID, organization |
| Employee Created | ✅ | Employee ID, name, position |
| Employee Updated | ✅ | Employee ID, changed fields |
| Employee Deleted | ✅ | Employee ID, name |
| Employee-Team Assignment | ✅ | Employee ID, team IDs |
| Team Created | ✅ | Team ID, team name |
| Team Updated | ✅ | Team ID, changed fields |
| Team Deleted | ✅ | Team ID, team name |

### Log Storage

- **Location**: `server/logs/` directory
- **Format**: JSON and text formats supported
- **Retention**: Can be configured (default: no automatic cleanup)
- **Access**: View via Prisma Studio or direct database query

### Querying Logs

Access logs via database:

```sql
SELECT * FROM "Logs" 
WHERE "orgId" = 1 
ORDER BY timestamp DESC 
LIMIT 100;
```

Or via the logs endpoint (future enhancement):

```http
GET /api/logs?orgId=1&limit=100
Authorization: Bearer {token}
```

---

## Requirements Implementation

### ✅ Functional Requirements

#### 1. Employee List
- **Status**: ✅ Implemented
- **Location**: Frontend: Employee list display | Backend: `GET /api/employees`
- **Features**: Shows all employees with their details and team assignments

#### 2. Teams List
- **Status**: ✅ Implemented
- **Location**: Frontend: Team list display | Backend: `GET /api/teams`
- **Features**: Shows all teams with member counts

#### 3. Team Assignment
- **Status**: ✅ Implemented
- **Location**: `POST /api/employees/:id/teams` | `POST /api/teams/:id/employees`
- **Features**: Supports many-to-many relationships; employees can be in multiple teams

#### 4. Forms
- **Status**: ✅ Implemented
- **Location**: Frontend `App.jsx` (Forms for create/edit)
- **Features**: 
  - Employee form: First/Last name, Email, Position, Team selection
  - Team form: Team name, Member selection
  - Validation and error handling

#### 5. CRUD Operations
- **Status**: ✅ Implemented
- **Features**:
  - **Create**: `POST /api/employees`, `POST /api/teams`
  - **Read**: `GET /api/employees`, `GET /api/teams`
  - **Update**: `PUT /api/employees/:id`, `PUT /api/teams/:id`
  - **Delete**: `DELETE /api/employees/:id`, `DELETE /api/teams/:id`

#### 6. Logging
- **Status**: ✅ Implemented
- **Coverage**:
  - ✅ User login/logout
  - ✅ Employee creation/update/deletion
  - ✅ Team creation/update/deletion
  - ✅ Employee-team assignment changes
  - ✅ Timestamps and user context

### ✅ Additional Requirements

#### 1. Multi-Team Support
- **Status**: ✅ Implemented
- **Implementation**: Many-to-many relationship via `EmployeeTeams` junction table
- **Database Design**: Normalized schema supporting unlimited team assignments

#### 2. Authentication Required
- **Status**: ✅ Implemented
- **Protection**: All data mutations require JWT authentication
- **Exception**: `/api/auth/login` and `/api/auth/register` are public

#### 3. Organization Management
- **Status**: ✅ Implemented
- **Features**: 
  - Users must create organization account during registration
  - All data isolated per organization
  - Multi-tenant architecture

### ✅ Technology Requirements

| Requirement | Implementation |
|------------|-----------------|
| Backend: Node.js | ✅ Express.js running on Node.js |
| Frontend: React.js | ✅ React 18.2 with Vite bundler |
| Database: SQL | ✅ PostgreSQL (primary) + SQLite (development) |

---

## Performance & Optimization

### Backend Optimization

#### 1. Database Query Optimization
- **Eager Loading**: Uses Sequelize `include` for related data
- **Query Example**: `Employee.findAll({ include: [Team] })`
- **Benefit**: Prevents N+1 query problems

#### 2. Connection Pooling
- **Pool Size**: Configurable in Sequelize (default: 5)
- **Reuse**: Connections are reused for multiple queries
- **Benefit**: Reduced connection overhead

#### 3. Authentication Middleware
- **Location**: `src/middleware/auth.js`
- **Strategy**: JWT verification before route processing
- **Benefit**: Unauthorized requests fail fast

#### 4. Logging Performance
- **Async Logging**: Non-blocking log writes
- **Batch Processing**: Can be configured for high-volume scenarios
- **Benefit**: Minimal impact on request latency

### Frontend Optimization

#### 1. Vite Build Tool
- **Fast Refresh**: Hot module replacement for development
- **Code Splitting**: Automatic optimization for production builds
- **Benefit**: Fast development cycle and small bundle size

#### 2. React Hooks
- **State Management**: Uses `useState` for local component state
- **Effect Handling**: Uses `useCallback` patterns (ready for optimization)
- **Benefit**: Efficient re-renders and memory usage

#### 3. Fetch API
- **Caching**: Ready for implementation via HTTP headers
- **Request Batching**: Can be implemented for bulk operations
- **Benefit**: Minimal network overhead

### Database Optimization

#### 1. Indexes
- **Primary Keys**: Auto-indexed on all tables
- **Foreign Keys**: Indexed for join performance
- **Ready for**: Additional indexes on frequently queried columns

#### 2. Connection Pooling
- **Default Pool Size**: 5 connections
- **Configurable**: Via `DATABASE_URL` or environment variables

#### 3. Query Patterns
- **Parameterized Queries**: Via Sequelize ORM (SQL injection prevention)
- **Lazy Loading**: Available for relationship data
- **Eager Loading**: Implemented for common access patterns

### Scalability Considerations

#### Horizontal Scaling
- ✅ Stateless backend (ready for load balancing)
- ✅ Centralized database (single source of truth)
- ⚠️ Session management: JWT enables horizontal scaling

#### Vertical Scaling
- ✅ Connection pooling configured
- ✅ Efficient query patterns
- ⚠️ Can increase pool size in high-load scenarios

#### Future Enhancements
- Redis caching for frequently accessed data
- Pagination for large result sets
- Rate limiting to prevent abuse
- Database read replicas for analytics queries

---

## Future Enhancements

### Phase 2 - Advanced Features

- [ ] **Role-Based Access Control (RBAC)**
  - Admin, Manager, Employee roles
  - Permission matrix for each role
  - Audit trail of permission changes

- [ ] **Advanced Search & Filtering**
  - Full-text search on employee names
  - Filter by position, team, date range
  - Sort by any column

- [ ] **Reporting & Analytics**
  - Team utilization reports
  - Employee distribution charts
  - Department-wise analytics

- [ ] **Bulk Operations**
  - Bulk employee import (CSV)
  - Bulk team assignments
  - Bulk deletion with confirmation

- [ ] **Email Notifications**
  - Employee assignment notifications
  - Team creation alerts
  - Weekly summary reports

- [ ] **Mobile Support**
  - Responsive design improvements
  - Mobile app (React Native)
  - Offline support

- [ ] **Integration**
  - LDAP/Active Directory sync
  - Slack integration
  - Calendar integration for team meetings

---

## Troubleshooting

### Common Issues

#### "Cannot connect to database"
```
Solution:
1. Check DATABASE_URL in .env
2. Verify PostgreSQL is running
3. For SQLite: Ensure data/ directory exists and is writable
4. Test connection: psql -c "SELECT version();"
```

#### "JWT token invalid or expired"
```
Solution:
1. Check JWT_SECRET matches between login and API calls
2. Verify token hasn't expired (JWT_EXPIRY)
3. Include Bearer prefix in Authorization header
4. Re-login to get fresh token
```

#### "Port already in use"
```
Solution:
Option 1: Change PORT in .env (default 4000)
Option 2: Kill process using port:
  Windows: netstat -ano | findstr :4000
           taskkill /PID <PID> /F
  Mac/Linux: lsof -i :4000
             kill -9 <PID>
```

#### "Module not found errors"
```
Solution:
1. Delete node_modules: rm -r node_modules
2. Clear npm cache: npm cache clean --force
3. Reinstall: npm install
4. Check package.json for syntax errors
```

#### "Frontend can't reach backend API"
```
Solution:
1. Verify backend is running on http://localhost:4000
2. Check CORS is enabled in server/src/index.js
3. Check API base URL in client/src/api.js
4. Browser DevTools → Network tab → Check request/response
```

---

## Contributing

### Development Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   ```bash
   # Backend
   cd server && npm run dev
   
   # Frontend (in another terminal)
   cd client && npm run dev
   ```

3. **Test Changes**
   ```bash
   # Manual testing via UI and API calls
   # Use Postman or curl for API testing
   ```

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "Description of changes"
   ```

5. **Push & Create Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Standards

- **Naming**: camelCase for variables/functions, PascalCase for classes/components
- **Comments**: Meaningful comments for complex logic
- **Error Handling**: Try-catch blocks for async operations
- **Logging**: Use logger for important events

---

## License

This project is licensed under the MIT License - see LICENSE file for details.

---

## Contact & Support

For questions or issues:
- **Repository**: [GitHub - iaman011/HRMS](https://github.com/iaman011/HRMS)
- **Issues**: Create an issue on GitHub for bugs/features
- **Email**: Contact project maintainers

---

## Changelog

### Version 0.1.0 (Current Release)

**Initial Release Features:**
- ✅ Full CRUD operations for employees and teams
- ✅ Multi-team support for employees
- ✅ JWT-based authentication
- ✅ Organization account management
- ✅ Comprehensive logging system
- ✅ React-based UI with Vite
- ✅ PostgreSQL/SQLite database support
- ✅ API documentation

**Known Limitations:**
- Single admin role (multiple roles coming soon)
- Basic UI (can be enhanced)
- No pagination for large datasets
- No email notifications

---

## Acknowledgments

Built with:
- [Express.js](https://expressjs.com/)
- [React.js](https://react.dev/)
- [Sequelize](https://sequelize.org/)
- [Vite](https://vitejs.dev/)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [JWT](https://jwt.io/)

---

**Last Updated**: November 13, 2025
**Project Status**: Active Development
