const API_BASE = '/api'

function getAuthHeaders() {
  const token = localStorage.getItem('authToken')
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  return headers
}

export async function login(username, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ username, password }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || 'Login failed')
  }
  const data = await res.json().catch(() => ({}))
  if (data.token) localStorage.setItem('authToken', data.token)
  return data
}

export async function logout() {
  try {
    await fetch(`${API_BASE}/auth/logout`, { method: 'POST', credentials: 'include' })
  } finally {
    localStorage.removeItem('authToken')
  }
}

export async function getVersusList() {
  const res = await fetch(`${API_BASE}/versus`, {
    headers: getAuthHeaders(),
    credentials: 'include',
  })
  if (!res.ok) throw new Error('Failed to load versus list')
  const data = await res.json()
  return Array.isArray(data) ? data : data.content ?? data._embedded?.versusList ?? []
}

export async function getVersus(id) {
  const res = await fetch(`${API_BASE}/versus/${id}`, {
    headers: getAuthHeaders(),
    credentials: 'include',
  })
  if (!res.ok) throw new Error('Failed to load versus')
  return res.json()
}

export async function createVersus(payload) {
  const formData = new FormData()
  formData.append('name1', payload.name1)
  formData.append('name2', payload.name2)
  if (payload.image1) formData.append('image1', payload.image1)
  if (payload.image2) formData.append('image2', payload.image2)

  const token = localStorage.getItem('authToken')
  const headers = {}
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API_BASE}/versus`, {
    method: 'POST',
    headers,
    credentials: 'include',
    body: formData,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || 'Failed to create versus')
  }
  return res.json()
}

export async function updateVersus(id, payload) {
  const formData = new FormData()
  formData.append('name1', payload.name1)
  formData.append('name2', payload.name2)
  if (payload.image1) formData.append('image1', payload.image1)
  if (payload.image2) formData.append('image2', payload.image2)

  const token = localStorage.getItem('authToken')
  const headers = {}
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API_BASE}/versus/${id}`, {
    method: 'PUT',
    headers,
    credentials: 'include',
    body: formData,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || 'Failed to update versus')
  }
  return res.json()
}

export async function deleteVersus(id) {
  const res = await fetch(`${API_BASE}/versus/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
    credentials: 'include',
  })
  if (!res.ok) throw new Error('Failed to delete versus')
}
