import { useState, useEffect } from 'react'
import * as api from '../../api/client'
import VersusList from '../VersusList'
import VersusForm from '../VersusForm'
import './VersusSection.css'

const PAGE_SIZE_OPTIONS = [4, 6, 8, 10]

export default function VersusSection({ setError }) {
  const [versusList, setVersusList] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(4)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function loadVersus() {
      setLoading(true)
      setError('')
      try {
        const result = await api.getVersusList(page, pageSize)
        if (cancelled) return

        if (result.items.length === 0 && page > 0 && result.totalElements > 0) {
          setPage(page - 1)
          return
        }

        setVersusList(result.items)
        setTotalPages(result.totalPages)
        setTotalElements(result.totalElements)
      } catch (err) {
        if (cancelled) return
        setError(err.message || 'Failed to load versus')
        setVersusList([])
        setTotalPages(0)
        setTotalElements(0)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadVersus()
    return () => { cancelled = true }
  }, [page, pageSize])

  function handleFormClose() {
    setShowForm(false)
    setEditingId(null)
  }

  function handleFormSuccess() {
    handleFormClose()
    setPage(0)
  }

  function handlePageSizeChange(e) {
    setPageSize(Number(e.target.value))
    setPage(0)
  }

  async function handleDelete(id) {
    if (!confirm('Delete this versus?')) return
    try {
      await api.deleteVersus(id)
      if (versusList.length === 1 && page > 0) {
        setPage(page - 1)
        return
      }
      const result = await api.getVersusList(page, pageSize)
      if (result.items.length === 0 && page > 0 && result.totalElements > 0) {
        setPage(page - 1)
      } else {
        setVersusList(result.items)
        setTotalPages(result.totalPages)
        setTotalElements(result.totalElements)
      }
    } catch (err) {
      setError(err.message || 'Failed to delete')
    }
  }

  return (
    <>
      <div className="section-toolbar versus-section-toolbar">
        <label className="versus-page-size">
          <span>Per page</span>
          <select
            value={pageSize}
            onChange={handlePageSizeChange}
            aria-label="Items per page"
          >
            {PAGE_SIZE_OPTIONS.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>
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
        <>
          <VersusList
            items={versusList}
            empty={totalElements === 0}
            onEdit={(id) => { setEditingId(id); setShowForm(true) }}
            onDelete={handleDelete}
          />
          {totalPages > 0 && (
            <nav className="versus-pagination" aria-label="Versus list pagination">
              <button
                type="button"
                className="btn btn-ghost versus-pagination-nav"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </button>
              <div className="versus-pagination-pages" role="group" aria-label="Page numbers">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`versus-pagination-page${i === page ? ' versus-pagination-page-active' : ''}`}
                    aria-current={i === page ? 'page' : undefined}
                    onClick={() => setPage(i)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="btn btn-ghost versus-pagination-nav"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
              <p className="versus-pagination-summary">
                Page {page + 1} of {totalPages}
                {totalElements > 0 && (
                  <span className="versus-pagination-total"> · {totalElements} total</span>
                )}
              </p>
            </nav>
          )}
        </>
      )}
    </>
  )
}
