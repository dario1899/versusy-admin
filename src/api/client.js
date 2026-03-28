import { apiRoutes } from './routes'

const STORAGE_ACCESS = 'accessToken'
const STORAGE_REFRESH = 'refreshToken'

export function getStoredAccessToken() {
  return localStorage.getItem(STORAGE_ACCESS) || localStorage.getItem('authToken')
}

export function getStoredRefreshToken() {
  return localStorage.getItem(STORAGE_REFRESH) || localStorage.getItem('refreshToken')
}

function authHeadersExtra() {
  const token = getStoredAccessToken()
  const headers = {}
  if (token) headers['Authorization'] = `Bearer ${token}`
  return headers
}

function getAuthHeaders() {
  return { 'Content-Type': 'application/json', ...authHeadersExtra() }
}

export function persistAuthTokens(data) {
  if (data?.accessToken) localStorage.setItem(STORAGE_ACCESS, data.accessToken)
  else localStorage.removeItem(STORAGE_ACCESS)
  if (data?.refreshToken) localStorage.setItem(STORAGE_REFRESH, data.refreshToken)
  else localStorage.removeItem(STORAGE_REFRESH)
}

export function clearAuthTokens() {
  localStorage.removeItem(STORAGE_ACCESS)
  localStorage.removeItem(STORAGE_REFRESH)
  localStorage.removeItem('authToken')
}

export async function login(email, password) {
  const res = await fetch(apiRoutes.authLogin(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || 'Login failed')
  }
  const data = await res.json().catch(() => ({}))
  persistAuthTokens(data)
  return data
}

export async function logout() {
  try {
    const refreshToken = getStoredRefreshToken()
    await fetch(apiRoutes.authLogout(), {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify({ refreshToken }),
    })
  } finally {
    clearAuthTokens()
  }
}

function normalizeList(data) {
  if (Array.isArray(data)) return data
  if (data?.content) return data.content
  const e = data?._embedded
  if (e?.versusList) return e.versusList
  if (e?.users) return e.users
  return []
}

export async function getVersusList() {
  const res = await fetch(apiRoutes.versusList(), {
    headers: getAuthHeaders(),
    credentials: 'include',
  })
  if (!res.ok) throw new Error('Failed to load versus list')
  const data = await res.json()
  return normalizeList(data)
}

export async function getVersus(id) {
  const res = await fetch(apiRoutes.versusById(id), {
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

  const headers = authHeadersExtra()

  const res = await fetch(apiRoutes.versusList(), {
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

  const headers = authHeadersExtra()

  const res = await fetch(apiRoutes.versusById(id), {
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
  const res = await fetch(apiRoutes.versusById(id), {
    method: 'DELETE',
    headers: getAuthHeaders(),
    credentials: 'include',
  })
  if (!res.ok) throw new Error('Failed to delete versus')
}

export async function getUsers() {
  const res = await fetch(apiRoutes.users(), {
    headers: getAuthHeaders(),
    credentials: 'include',
  })
  if (!res.ok) throw new Error('Failed to load users')
  const data = await res.json()
  return normalizeList(data)
}

export async function createUser({ email, password }) {
  const res = await fetch(apiRoutes.userCreate(), {
    method: 'POST',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || 'Failed to create user')
  }
  return res.json().catch(() => ({}))
}

export async function deleteUser(id) {
  const res = await fetch(apiRoutes.userDelete(id), {
    method: 'DELETE',
    headers: getAuthHeaders(),
    credentials: 'include',
  })
  if (!res.ok) throw new Error('Failed to delete user')
}
