import { useState, useEffect } from 'react'
import * as api from '../../api/client'
import UserForm from './UserForm'
import './UsersSection.css'

function userLabel(u) {
  return u.email || u.username || u.name || u.login || `User #${u.id}`
}

export default function UsersSection({ setError }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  async function loadUsers() {
    setLoading(true)
    setError('')
    try {
      const list = await api.getUsers()
      setUsers(Array.isArray(list) ? list : [])
    } catch (err) {
      setError(err.message || 'Failed to load users')
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  async function handleDelete(id) {
    if (!confirm('Delete this user?')) return
    try {
      await api.deleteUser(id)
      loadUsers()
    } catch (err) {
      setError(err.message || 'Failed to delete user')
    }
  }

  return (
    <>
      <div className="section-toolbar">
        <button type="button" className="btn btn-primary" onClick={() => setShowForm(true)}>
          New user
        </button>
      </div>
      {showForm && (
        <UserForm
          onClose={() => setShowForm(false)}
          onSuccess={(created) => {
            setShowForm(false)
            if (created && typeof created === 'object' && (created.id != null || created.email)) {
              setUsers((prev) => [...prev, created])
            } else {
              loadUsers()
            }
          }}
        />
      )}
      {loading ? (
        <div className="admin-loading">Loading users…</div>
      ) : users.length === 0 ? (
        <div className="users-empty">No users yet.</div>
      ) : (
        <div className="users-table-wrap">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Email / name</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id ?? u.email ?? JSON.stringify(u)}>
                  <td className="users-td-id">{u.id ?? '—'}</td>
                  <td>{userLabel(u)}</td>
                  <td className="users-td-actions">
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => handleDelete(u.id)}
                      disabled={u.id == null}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
