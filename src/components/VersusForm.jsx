import { useState, useEffect } from 'react'
import * as api from '../api/client'
import './VersusForm.css'

const initialForm = { name1: '', name2: '', image1: null, image2: null }

export default function VersusForm({ versusId, onClose, onSuccess }) {
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(!!versusId)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!versusId) return
    let cancelled = false
    api.getVersus(versusId).then((data) => {
      if (cancelled) return
      setForm({
        name1: data.name1 ?? data.name_1 ?? '',
        name2: data.name2 ?? data.name_2 ?? '',
        image1: null,
        image2: null,
      })
      setLoading(false)
    }).catch(() => setLoading(false))
    return () => { cancelled = true }
  }, [versusId])

  function update(fields) {
    setForm((prev) => ({ ...prev, ...fields }))
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      if (versusId) {
        await api.updateVersus(versusId, form)
      } else {
        await api.createVersus(form)
      }
      onSuccess()
    } catch (err) {
      setError(err.message || 'Request failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="versus-form-loading">Loading…</div>

  return (
    <div className="versus-form-overlay" onClick={onClose}>
      <div className="versus-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="versus-form-header">
          <h2>{versusId ? 'Edit Versus' : 'New Versus'}</h2>
          <button type="button" className="versus-form-close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <form onSubmit={handleSubmit} className="versus-form">
          {error && <div className="versus-form-error">{error}</div>}
          <div className="versus-form-row">
            <label>
              Name 1
              <input
                type="text"
                value={form.name1}
                onChange={(e) => update({ name1: e.target.value })}
                placeholder="First name"
                required
              />
            </label>
            <label>
              Image 1
              <input
                type="file"
                accept="image/*"
                onChange={(e) => update({ image1: e.target.files?.[0] || null })}
              />
            </label>
          </div>
          <div className="versus-form-row">
            <label>
              Name 2
              <input
                type="text"
                value={form.name2}
                onChange={(e) => update({ name2: e.target.value })}
                placeholder="Second name"
                required
              />
            </label>
            <label>
              Image 2
              <input
                type="file"
                accept="image/*"
                onChange={(e) => update({ image2: e.target.files?.[0] || null })}
              />
            </label>
          </div>
          <div className="versus-form-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving…' : versusId ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
