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
# HRMS — Minimal README

A tiny summary for the HRMS project.

- Stack: Node/Express (Sequelize) backend + React (Vite) frontend
- Quick start:
```powershell
cd server; npm install
cd ../client; npm install
cd server; npm run dev
cd ../client; npm run dev
```
- Main endpoints: auth (register/login), employees, teams
- Auth: JWT Bearer required for protected routes
- Logs: `server/logs/audit.log` and DB `Log` table

For a longer README with examples or deployment steps, tell me which section to expand.
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
