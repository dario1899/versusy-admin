import VersusPicture from './VersusPicture'
import './VersusList.css'

function name(item, side) {
  const key = side === 1 ? 'name1' : 'name2'
  return item[key] || item[`name${side}`] || '—'
}

function imageId(item, side) {
  const key = side === 1 ? 'image1Id' : 'image2Id'
  return item[key] ?? item[`image${side}Id`] ?? null
}

export default function VersusList({ items, empty, onEdit, onDelete }) {
  if (empty) {
    return (
      <div className="versus-list-empty">
        No versus yet. Create one with “New Versus”.
      </div>
    )
  }

  return (
    <div className="versus-list">
      {items.map((item) => (
        <article key={item.id} className="versus-card">
          <div className="versus-card-images">
            <div className="versus-card-side">
              <div className="versus-card-image-wrap">
                <VersusPicture imageId={imageId(item, 1)} alt={name(item, 1)} />
              </div>
              <span className="versus-card-name">{name(item, 1)}</span>
            </div>
            <span className="versus-card-vs">VS</span>
            <div className="versus-card-side">
              <div className="versus-card-image-wrap">
                <VersusPicture imageId={imageId(item, 2)} alt={name(item, 2)} />
              </div>
              <span className="versus-card-name">{name(item, 2)}</span>
            </div>
          </div>
          <div className="versus-card-actions">
            <button type="button" className="btn btn-ghost" onClick={() => onEdit(item.id)}>
              Edit
            </button>
            <button type="button" className="btn btn-danger" onClick={() => onDelete(item.id)}>
              Delete
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}
