import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import VersusSection from '../components/admin/VersusSection'
import UsersSection from '../components/admin/UsersSection'
import './Admin.css'

export default function Admin() {
  const { user, logout } = useAuth()
  const [tab, setTab] = useState('versus')
  const [error, setError] = useState('')

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <h1 className="admin-title">Versusy Admin</h1>
        <div className="admin-actions">
          <span className="admin-user">{user?.username}</span>
          <button type="button" className="btn btn-ghost" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <nav className="admin-tabs" role="tablist" aria-label="Admin sections">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'versus'}
          className={`admin-tab ${tab === 'versus' ? 'admin-tab-active' : ''}`}
          onClick={() => { setTab('versus'); setError('') }}
        >
          Versuses
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'users'}
          className={`admin-tab ${tab === 'users' ? 'admin-tab-active' : ''}`}
          onClick={() => { setTab('users'); setError('') }}
        >
          Users
        </button>
      </nav>

      <main className="admin-main">
        {error && (
          <div className="admin-error">
            {error}
            <button type="button" onClick={() => setError('')} aria-label="Dismiss">×</button>
          </div>
        )}

        <div role="tabpanel">
          {tab === 'versus' && (
            <VersusSection setError={setError} />
          )}
          {tab === 'users' && (
            <UsersSection setError={setError} />
          )}
        </div>
      </main>
    </div>
  )
}
