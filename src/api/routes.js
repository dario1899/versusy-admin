/**
 * Central API URLs (base is dev proxy `/api` or VITE_API_BASE in production).
 * Change paths here only; `client.js` builds requests from these.
 */
export const API_BASE = import.meta.env.VITE_API_BASE || '/api'

export const apiRoutes = {
  authLogin: () => `${API_BASE}/v1/auth/login`,
  authLogout: () => `${API_BASE}/v1/auth/logout`,
  versusList: ({ page = 0, size = 4 } = {}) => {
    const params = new URLSearchParams({
      page: String(page),
      size: String(size),
    })
    return `${API_BASE}/versus?${params}`
  },
  versusCreate: () => `${API_BASE}/versus`,
  versusById: (id) => `${API_BASE}/versus/${encodeURIComponent(id)}`,
  versusPicture: (imageId) =>
    `${API_BASE}/versus/picture/${encodeURIComponent(imageId)}`,
  /** GET – list users */
  users: () => `${API_BASE}/user/all`,
  /** POST – create user (distinct name avoids clashing with client `createUser` export) */
  userCreate: () => `${API_BASE}/user`,
  userDelete: (id) => `${API_BASE}/user/${encodeURIComponent(id)}`,
}
