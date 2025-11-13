const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) return null
  return res.json()
}

export async function register(organizationName, username, email, password) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ organizationName, username, email, password }),
  })
  return res.json()
}

export async function fetchEmployees(token) {
  const res = await fetch(`${API_BASE}/employees`, { headers: { Authorization: `Bearer ${token}` } })
  if (!res.ok) return []
  return res.json()
}

export async function fetchTeams(token) {
  const res = await fetch(`${API_BASE}/teams`, { headers: { Authorization: `Bearer ${token}` } })
  if (!res.ok) return []
  return res.json()
}

export async function createEmployee(token, payload) {
  const res = await fetch(`${API_BASE}/employees`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  })
  return res.ok ? res.json() : null
}

export async function updateEmployee(token, id, payload) {
  const res = await fetch(`${API_BASE}/employees/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  })
  return res.ok ? res.json() : null
}

export async function deleteEmployee(token, id) {
  const res = await fetch(`${API_BASE}/employees/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.ok
}

export async function assignEmployeeTeams(token, id, teamIds) {
  const res = await fetch(`${API_BASE}/employees/${id}/teams`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ teamIds }),
  })
  return res.ok ? res.json() : null
}

export async function createTeam(token, payload) {
  const res = await fetch(`${API_BASE}/teams`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  })
  return res.ok ? res.json() : null
}

export async function updateTeam(token, id, payload) {
  const res = await fetch(`${API_BASE}/teams/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  })
  return res.ok ? res.json() : null
}

export async function deleteTeam(token, id) {
  const res = await fetch(`${API_BASE}/teams/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.ok
}

export async function assignTeamEmployees(token, id, employeeIds) {
  const res = await fetch(`${API_BASE}/teams/${id}/employees`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ employeeIds }),
  })
  return res.ok ? res.json() : null
}

export async function logoutRequest(token, userId, orgId) {
  // log out on server (stateless JWT) mainly for audit
  const res = await fetch(`${API_BASE}/auth/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ userId, orgId }),
  })
  return res.ok
}
