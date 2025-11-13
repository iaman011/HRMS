# HRMS Registration & Login - Step-by-Step Instructions

## ✅ Complete Setup Done!

Your app now has:
1. ✅ **Registration Form** - Create new organization + user account
2. ✅ **Login Form** - Login with credentials
3. ✅ **Dashboard** - View employees and teams
4. ✅ **Logout Button** - Securely logout

## 📋 Quick Start Instructions

### Step 1: Ensure Both Servers Are Running

**Terminal 1 - Start Backend (Port 4000)**
```powershell
cd d:\GitHub\HRMS\server
npm start
```
Expected output: `Server listening on 4000`

**Terminal 2 - Start Frontend (Port 5173)**
```powershell
cd d:\GitHub\HRMS\client
npm run dev
```
Expected output: `Local: http://localhost:5173`

### Step 2: Open Browser
- Go to `http://localhost:5173`
- You should see: **HRMS - Login**

### Step 3: Register New Account

**Screen 1:**
- Click button: **"Don't have an account? Register"**

**Screen 2 (Register Form):**
- **Organization Name**: `My Company` (or any name)
- **Username**: `johndoe` (or any username)
- **Email**: `john@example.com` (use valid format)
- **Password**: `SecurePass123` (minimum 1 character, case-sensitive)
- Click **Register** button

**Expected Result:**
- Alert: "Registration successful! Now login with your credentials."
- Back to login screen

### Step 4: Login with Credentials

**Back on Login Screen:**
- **Email**: `john@example.com` (same as registered)
- **Password**: `SecurePass123` (same as registered, case-sensitive)
- Click **Login** button

**Expected Result:**
- ✅ See Dashboard with welcome message
- ✅ Shows employees and teams (if any exist)
- ✅ Red "Logout" button in top right

### Step 5: Test Logout
- Click red **Logout** button
- Should return to Login screen
- All credentials cleared

## 🔍 Troubleshooting

### ❌ "Login failed: Invalid credentials"
**Causes:**
1. Email not registered → Register first
2. Wrong password → Password is case-sensitive
3. Typo in email → Check spelling

**Solution:**
- Go back to register
- Create new account with correct credentials

### ❌ "Registration failed: Missing fields"
**Cause:** One or more fields are empty

**Solution:**
- All 4 fields required:
  - Organization Name
  - Username
  - Email
  - Password

### ❌ Cannot connect to server
**Error:** API request fails / page blank

**Solutions:**
1. Check backend running: `npm start` in `/server`
2. Check frontend port: Should be `localhost:5173` (or port shown)
3. Check `.env` in `/client`:
   - Should have: `VITE_API_BASE=http://localhost:4000/api`

### ❌ Database connection error in server terminal
**Cause:** PostgreSQL not running

**Solution:**
1. Start PostgreSQL:
   - Windows: Services > PostgreSQL > Start
   - Or use: `pg_ctl -D "C:\Program Files\PostgreSQL\16\data" start`

2. Verify database exists:
   ```sql
   -- Connect to PostgreSQL (psql)
   \l  -- List databases
   -- Should see: hrms_db
   
   -- If not, create it:
   CREATE DATABASE hrms_db;
   ```

## 📊 Database Info

**Server `.env` Configuration:**
```properties
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=password
DB_NAME=hrms_db
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=4000
NODE_ENV=development
```

**Tables Created (auto by Sequelize):**
- Organizations
- Users (credentials)
- Employees
- Teams
- EmployeeTeams
- Logs

## 🔐 Security Notes

- ⚠️ Password is hashed with bcrypt
- ⚠️ JWT token valid for 8 hours
- ⚠️ Change JWT_SECRET in production
- ⚠️ Use HTTPS in production
- ⚠️ Add rate limiting on login/register endpoints

## 📝 Example Test Flow

```
1. User: john@example.com
2. Password: MyPass123
3. Organization: Tech Corp

Register → Success → Login → Dashboard → See employees/teams → Logout
```

## 🆘 Additional Help

If you're still getting unauthorized after login:

1. **Check browser console** (F12):
   - Look for API errors
   - Check network tab for 401 responses

2. **Check server terminal**:
   - Look for error messages
   - Check database connection

3. **Test API directly** (in PowerShell):
```powershell
# Test registration
$body = @{
    organizationName = "Test Corp"
    username = "testuser"
    email = "test@example.com"
    password = "testpass123"
} | ConvertTo-Json

Invoke-WebRequest -Uri http://localhost:4000/api/auth/register -Method POST -Body $body -ContentType "application/json"

# Test login
$body = @{
    email = "test@example.com"
    password = "testpass123"
} | ConvertTo-Json

Invoke-WebRequest -Uri http://localhost:4000/api/auth/login -Method POST -Body $body -ContentType "application/json"
```

