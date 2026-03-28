import { useState, useEffect } from 'react'
import * as api from '../../api/client'
import VersusList from '../VersusList'
import VersusForm from '../VersusForm'

export default function VersusSection({ setError }) {
  const [versusList, setVersusList] = useState([])
  const [loading, setLoading] = useState(true)
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
    <>
      <div className="section-toolbar">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => { setEditingId(null); setShowForm(true) }}
        >
          New Versus
        </button>
      </div>
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
          onEdit={(id) => { setEditingId(id); setShowForm(true) }}
          onDelete={handleDelete}
        />
      )}
    </>
  )
}
