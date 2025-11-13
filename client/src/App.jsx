import React, { useState } from 'react'
import {
  login,
  register,
  fetchEmployees,
  fetchTeams,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  assignEmployeeTeams,
  createTeam,
  updateTeam,
  deleteTeam,
  assignTeamEmployees,
  logoutRequest,
} from './api'

export default function App() {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [orgId, setOrgId] = useState(null)
  const [employees, setEmployees] = useState([])
  const [teams, setTeams] = useState([])
  const [newEmployee, setNewEmployee] = useState({ firstName: '', lastName: '', email: '', position: '', teamIds: [] })
  const [newTeam, setNewTeam] = useState({ name: '' })
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [editingTeam, setEditingTeam] = useState(null)
  const [showRegister, setShowRegister] = useState(false)
  const [form, setForm] = useState({ email: '', password: '', organizationName: '', username: '' })

  async function doRegister(e) {
    e.preventDefault()
    if (!form.organizationName || !form.username || !form.email || !form.password) {
      alert('All fields required')
      return
    }
    const res = await register(form.organizationName, form.username, form.email, form.password)
    if (res?.ok) {
      alert('Registration successful! Now login with your credentials.')
      setShowRegister(false)
      setForm({ email: '', password: '', organizationName: '', username: '' })
    } else alert('Registration failed: ' + (res?.error || 'Unknown error'))
  }

  async function doLogin(e) {
    e.preventDefault()
    const res = await login(form.email, form.password)
    if (res?.token) {
      setToken(res.token)
      setUser(res.user)
      setOrgId(res.orgId)
      await loadData(res.token)
    } else alert('Login failed: ' + (res?.error || 'Invalid credentials'))
  }

  async function loadData(t) {
    const emps = await fetchEmployees(t)
    const tms = await fetchTeams(t)
    setEmployees(emps || [])
    setTeams(tms || [])
  }

  async function addEmployee(e) {
    e.preventDefault()
    const emp = await createEmployee(token, {
      firstName: newEmployee.firstName,
      lastName: newEmployee.lastName,
      email: newEmployee.email,
      position: newEmployee.position,
    })
    if (emp) {
      // assign teams if any selected
      if ((newEmployee.teamIds || []).length) {
        await assignEmployeeTeams(token, emp.id, newEmployee.teamIds)
      }
      setNewEmployee({ firstName: '', lastName: '', email: '', position: '', teamIds: [] })
      await loadData(token)
    } else alert('Failed to add employee')
  }

  async function addTeam(e) {
    e.preventDefault()
    const t = await createTeam(token, { name: newTeam.name })
    if (t) {
      setNewTeam({ name: '' })
      await loadData(token)
    } else alert('Failed to add team')
  }

  async function doDeleteEmployee(id) {
    if (!confirm('Delete employee?')) return
    const ok = await deleteEmployee(token, id)
    if (ok) await loadData(token)
    else alert('Delete failed')
  }

  async function doDeleteTeam(id) {
    if (!confirm('Delete team?')) return
    const ok = await deleteTeam(token, id)
    if (ok) await loadData(token)
    else alert('Delete failed')
  }

  async function startEditEmployee(emp) {
    setEditingEmployee({ ...emp, teamIds: (emp.Teams || []).map(t => t.id) })
  }

  async function saveEditEmployee(e) {
    e.preventDefault()
    const id = editingEmployee.id
    const payload = { firstName: editingEmployee.firstName, lastName: editingEmployee.lastName, email: editingEmployee.email, position: editingEmployee.position }
    const updated = await updateEmployee(token, id, payload)
    if (updated) {
      await assignEmployeeTeams(token, id, editingEmployee.teamIds || [])
      setEditingEmployee(null)
      await loadData(token)
    } else alert('Update failed')
  }

  async function startEditTeam(t) {
    setEditingTeam({ ...t, employeeIds: (t.Employees || []).map(e => e.id) })
  }

  async function saveEditTeam(e) {
    e.preventDefault()
    const id = editingTeam.id
    const updated = await updateTeam(token, id, { name: editingTeam.name })
    if (updated) {
      await assignTeamEmployees(token, id, editingTeam.employeeIds || [])
      setEditingTeam(null)
      await loadData(token)
    } else alert('Update failed')
  }

  async function doLogout() {
    try {
      await logoutRequest(token, user?.id, orgId)
    } catch (err) {
      // ignore
    }
    setToken(null)
    setUser(null)
    setOrgId(null)
    setEmployees([])
    setTeams([])
    setForm({ email: '', password: '', organizationName: '', username: '' })
  }

  if (!token) {
    return (
      <div style={{ padding: 20, maxWidth: 400 }}>
        {showRegister ? (
          <>
            <h2>HRMS - Register</h2>
            <form onSubmit={doRegister}>
              <div style={{ marginBottom: 10 }}>
                <label>Organization Name</label>
                <input 
                  style={{ width: '100%', padding: 8, marginTop: 4 }}
                  value={form.organizationName} 
                  onChange={e => setForm({ ...form, organizationName: e.target.value })} 
                  placeholder="Your company name"
                />
              </div>
              <div style={{ marginBottom: 10 }}>
                <label>Username</label>
                <input 
                  style={{ width: '100%', padding: 8, marginTop: 4 }}
                  autoComplete="username"
                  value={form.username} 
                  onChange={e => setForm({ ...form, username: e.target.value })} 
                  placeholder="Your username"
                />
              </div>
              <div style={{ marginBottom: 10 }}>
                <label>Email</label>
                <input 
                  style={{ width: '100%', padding: 8, marginTop: 4 }}
                  type="email"
                  autoComplete="email"
                  value={form.email} 
                  onChange={e => setForm({ ...form, email: e.target.value })} 
                  placeholder="your@email.com"
                />
              </div>
              <div style={{ marginBottom: 10 }}>
                <label>Password</label>
                <input 
                  style={{ width: '100%', padding: 8, marginTop: 4 }}
                  type="password" 
                  autoComplete="new-password"
                  value={form.password} 
                  onChange={e => setForm({ ...form, password: e.target.value })} 
                  placeholder="Your password"
                />
              </div>
              <button type="submit" style={{ width: '100%', padding: 10, marginBottom: 10, cursor: 'pointer' }}>Register</button>
              <button type="button" onClick={() => { setShowRegister(false); setForm({ email: '', password: '', organizationName: '', username: '' }); }} style={{ width: '100%', padding: 10, cursor: 'pointer' }}>Back to Login</button>
            </form>
          </>
        ) : (
          <>
            <h2>HRMS - Login</h2>
            <form onSubmit={doLogin}>
              <div style={{ marginBottom: 10 }}>
                <label>Email</label>
                <input 
                  style={{ width: '100%', padding: 8, marginTop: 4 }}
                  type="email"
                  autoComplete="email"
                  value={form.email} 
                  onChange={e => setForm({ ...form, email: e.target.value })} 
                  placeholder="your@email.com"
                />
              </div>
              <div style={{ marginBottom: 10 }}>
                <label>Password</label>
                <input 
                  style={{ width: '100%', padding: 8, marginTop: 4 }}
                  type="password" 
                  autoComplete="current-password"
                  value={form.password} 
                  onChange={e => setForm({ ...form, password: e.target.value })} 
                  placeholder="Your password"
                />
              </div>
              <button type="submit" style={{ width: '100%', padding: 10, marginBottom: 10, cursor: 'pointer' }}>Login</button>
              <button type="button" onClick={() => setShowRegister(true)} style={{ width: '100%', padding: 10, cursor: 'pointer' }}>Don't have an account? Register</button>
            </form>
          </>
        )}
      </div>
    )
  }

  return (
  <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2>HRMS Dashboard</h2>
          <p>Welcome, {user?.username} (Org: {orgId})</p>
        </div>
        <button 
          onClick={() => {
            setToken(null)
            setUser(null)
            setOrgId(null)
            setEmployees([])
            setTeams([])
            setForm({ email: '', password: '', organizationName: '', username: '' })
          }}
          style={{ padding: '8px 16px', cursor: 'pointer', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: 4 }}
        >
          Logout
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div>
          <h3>Employees</h3>

          <form onSubmit={editingEmployee ? saveEditEmployee : addEmployee} style={{ marginBottom: 12, padding: 8, border: '1px solid #eee' }}>
            <h4>{editingEmployee ? 'Edit Employee' : 'Add Employee'}</h4>
            <input placeholder="First name" value={(editingEmployee ? editingEmployee.firstName : newEmployee.firstName) || ''} onChange={e => editingEmployee ? setEditingEmployee({ ...editingEmployee, firstName: e.target.value }) : setNewEmployee({ ...newEmployee, firstName: e.target.value })} style={{ width: '100%', marginBottom: 6 }} />
            <input placeholder="Last name" value={(editingEmployee ? editingEmployee.lastName : newEmployee.lastName) || ''} onChange={e => editingEmployee ? setEditingEmployee({ ...editingEmployee, lastName: e.target.value }) : setNewEmployee({ ...newEmployee, lastName: e.target.value })} style={{ width: '100%', marginBottom: 6 }} />
            <input placeholder="Email" value={(editingEmployee ? editingEmployee.email : newEmployee.email) || ''} onChange={e => editingEmployee ? setEditingEmployee({ ...editingEmployee, email: e.target.value }) : setNewEmployee({ ...newEmployee, email: e.target.value })} style={{ width: '100%', marginBottom: 6 }} />
            <input placeholder="Position" value={(editingEmployee ? editingEmployee.position : newEmployee.position) || ''} onChange={e => editingEmployee ? setEditingEmployee({ ...editingEmployee, position: e.target.value }) : setNewEmployee({ ...newEmployee, position: e.target.value })} style={{ width: '100%', marginBottom: 6 }} />
            <div style={{ marginBottom: 6 }}>
              <label>Teams (hold ctrl/cmd to multi-select)</label>
              <select multiple value={(editingEmployee ? editingEmployee.teamIds : newEmployee.teamIds) || []} onChange={e => {
                const vals = Array.from(e.target.selectedOptions).map(o => Number(o.value))
                editingEmployee ? setEditingEmployee({ ...editingEmployee, teamIds: vals }) : setNewEmployee({ ...newEmployee, teamIds: vals })
              }} style={{ width: '100%', height: 80 }}>
                {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" style={{ padding: 8 }}>{editingEmployee ? 'Save' : 'Add'}</button>
              {editingEmployee && <button type="button" onClick={() => setEditingEmployee(null)} style={{ padding: 8 }}>Cancel</button>}
            </div>
          </form>

          <ul>
            {employees.map(e => (
              <li key={e.id} style={{ marginBottom: 6 }}>
                <strong>{e.firstName} {e.lastName}</strong> — {e.position} — Teams: {(e.Teams||[]).map(t=>t.name).join(', ')}
                <div style={{ marginTop: 6 }}>
                  <button onClick={() => startEditEmployee(e)} style={{ marginRight: 6 }}>Edit</button>
                  <button onClick={() => doDeleteEmployee(e.id)} style={{ marginRight: 6 }}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3>Teams</h3>

          <form onSubmit={editingTeam ? saveEditTeam : addTeam} style={{ marginBottom: 12, padding: 8, border: '1px solid #eee' }}>
            <h4>{editingTeam ? 'Edit Team' : 'Add Team'}</h4>
            <input placeholder="Team name" value={(editingTeam ? editingTeam.name : newTeam.name) || ''} onChange={e => editingTeam ? setEditingTeam({ ...editingTeam, name: e.target.value }) : setNewTeam({ ...newTeam, name: e.target.value })} style={{ width: '100%', marginBottom: 6 }} />
            <div style={{ marginBottom: 6 }}>
              <label>Members (hold ctrl/cmd to multi-select)</label>
              <select multiple value={(editingTeam ? editingTeam.employeeIds : []) || []} onChange={e => {
                const vals = Array.from(e.target.selectedOptions).map(o => Number(o.value))
                editingTeam ? setEditingTeam({ ...editingTeam, employeeIds: vals }) : null
              }} style={{ width: '100%', height: 80 }}>
                {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" style={{ padding: 8 }}>{editingTeam ? 'Save' : 'Add'}</button>
              {editingTeam && <button type="button" onClick={() => setEditingTeam(null)} style={{ padding: 8 }}>Cancel</button>}
            </div>
          </form>

          <ul>
            {teams.map(t => (
              <li key={t.id} style={{ marginBottom: 6 }}>
                <strong>{t.name}</strong> — Members: {(t.Employees||[]).map(e=>e.firstName).join(', ')}
                <div style={{ marginTop: 6 }}>
                  <button onClick={() => startEditTeam(t)} style={{ marginRight: 6 }}>Edit</button>
                  <button onClick={() => doDeleteTeam(t.id)} style={{ marginRight: 6 }}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
