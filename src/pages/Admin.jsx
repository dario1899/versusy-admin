import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import * as api from '../api/client'
import VersusList from '../components/VersusList'
import VersusForm from '../components/VersusForm'
import './Admin.css'

export default function Admin() {
  const { user, logout } = useAuth()
  const [versusList, setVersusList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)

  async function loadVersus() {
    setLoading(true)
    setError('')
    try {
      const list = await api.getVersusList()
      setVersusList(list)
    } catch (err) {
      setError(err.message || 'Failed to load versus')
      setVersusList([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadVersus()
  }, [])

  function handleCreate() {
    setEditingId(null)
    setShowForm(true)
  }

  function handleEdit(id) {
    setEditingId(id)
    setShowForm(true)
  }

  function handleFormClose() {
    setShowForm(false)
    setEditingId(null)
  }

  function handleFormSuccess() {
    handleFormClose()
    loadVersus()
  }

  async function handleDelete(id) {
    if (!confirm('Delete this versus?')) return
    try {
      await api.deleteVersus(id)
      loadVersus()
    } catch (err) {
      setError(err.message || 'Failed to delete')
    }
  }

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <h1 className="admin-title">Versusy Admin</h1>
        <div className="admin-actions">
          <span className="admin-user">{user?.username}</span>
          <button type="button" className="btn btn-ghost" onClick={logout}>
            Logout
          </button>
          <button type="button" className="btn btn-primary" onClick={handleCreate}>
            New Versus
          </button>
        </div>
      </header>

      <main className="admin-main">
        {error && (
          <div className="admin-error">
            {error}
            <button type="button" onClick={() => setError('')} aria-label="Dismiss">×</button>
          </div>
        )}

        {showForm && (
          <VersusForm
            versusId={editingId}
            onClose={handleFormClose}
            onSuccess={handleFormSuccess}
          />
        )}

        {loading ? (
          <div className="admin-loading">Loading versus…</div>
        ) : (
          <VersusList
            items={versusList}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </main>
    </div>
  )
}
