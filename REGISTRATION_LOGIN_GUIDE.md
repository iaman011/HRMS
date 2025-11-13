# HRMS Registration & Login Guide

## Current Setup Status
✅ Server configured with PostgreSQL on localhost:5432
✅ JWT secret configured
✅ Database tables ready (auto-created by Sequelize)

## Step-by-Step Guide

### Step 1: Verify Server is Running
- Server should be running on `http://localhost:4000`
- Check terminal for: "Server listening on 4000"

### Step 2: Verify Client is Running  
- Client should be running on `http://localhost:5173` (or port shown in terminal)
- Should see HRMS Login page

### Step 3: Register New Account
1. On the login page, look for a **Register** link/button (if not visible, see troubleshooting)
2. Fill in:
   - **Organization Name**: Your company name (e.g., "ACME Corp")
   - **Username**: Your username (e.g., "john_doe")
   - **Email**: Your email (e.g., "john@example.com")
   - **Password**: Your password (e.g., "SecurePass123")
3. Click **Register**
4. If successful, you'll see: `{ ok: true, user: {...}, orgId: 1 }`

### Step 4: Login with Registered Credentials
1. On the login page, enter:
   - **Email**: Same email you registered with
   - **Password**: Same password you registered with
2. Click **Login**
3. If successful, you should see the **HRMS Dashboard** with Employees and Teams

## Troubleshooting "Unauthorized" Error

### Issue 1: No Register Form in Frontend
**Solution**: Check `App.jsx` - it should have a register form on the login page
- Currently only has login form
- Need to add register functionality

### Issue 2: Registration Fails
**Check server logs for**:
- ❌ Database connection error → PostgreSQL not running
- ❌ "Missing fields" → All fields required
- ❌ Duplicate email → Use different email

### Issue 3: Login Returns Unauthorized (401)
**Possible causes**:
1. ✅ Email doesn't exist in database
2. ✅ Password is incorrect (case-sensitive)
3. ✅ Database not synced with Sequelize models

### Issue 4: Token Invalid Error
**Possible causes**:
1. ✅ JWT_SECRET mismatch
2. ✅ Token expired (8 hour limit)
3. ✅ Token corrupted in localStorage

## Testing Registration via API (cURL)

```bash
# Register endpoint
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "organizationName": "Test Corp",
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpass123"
  }'

# Expected response:
# {"ok":true,"user":{"id":1,"username":"testuser"},"orgId":1}
```

## Testing Login via API (cURL)

```bash
# Login endpoint
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123"
  }'

# Expected response:
# {"token":"eyJhbGc...","user":{"id":1,"username":"testuser"},"orgId":1}
```

## Frontend App Flow

### Current App.jsx Login Form:
```javascript
if (!token) {
  return (
    <form onSubmit={doLogin}>
      <input type="email" ... />
      <input type="password" ... />
      <button type="submit">Login</button>
    </form>
  )
}
```

### Missing: Register Form
The app needs a register form BEFORE or ALONGSIDE the login form.

## Next Steps

1. ✅ Ensure PostgreSQL is running
2. ✅ Start server: `npm start` in `/server`
3. ✅ Start client: `npm run dev` in `/client`
4. ✅ Test registration API (see cURL commands above)
5. ✅ Test login API with registered credentials
6. ✅ If frontend shows unauthorized, check browser console for API response

## Database Tables Created
- `Organizations`: Organization records
- `Users`: Login credentials (email, passwordHash)
- `Employees`: Employee data
- `Teams`: Team data
- `EmployeeTeams`: Many-to-many relationship
- `Logs`: Activity logging

