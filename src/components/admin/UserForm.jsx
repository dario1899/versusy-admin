import { useState } from 'react'
import * as api from '../../api/client'
import '../VersusForm.css'

export default function UserForm({ onClose, onSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    e.stopPropagation()
    setError('')
    setSubmitting(true)
    try {
      const created = await api.createUser({ email, password })
      onSuccess(created)
    } catch (err) {
      setError(err.message || 'Failed to create user')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="versus-form-overlay" onClick={onClose}>
      <div className="versus-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="versus-form-header">
          <h2>New user</h2>
          <button type="button" className="versus-form-close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <form onSubmit={handleSubmit} className="versus-form">
          {error && <div className="versus-form-error">{error}</div>}
          <label className="user-form-full">
            Email
            {/* Browser email validation was type="email"; use text to disable for now */}
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </label>
          <label className="user-form-full">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </label>
          <div className="versus-form-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Creating…' : 'Create user'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
