import { useEffect, useState } from 'react'
import { fetchVersusPicture } from '../api/client'

export default function VersusPicture({ imageId, alt }) {
  const [src, setSrc] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (imageId == null || imageId === '') {
      setSrc(null)
      setLoading(false)
      setError(false)
      return
    }

    let cancelled = false
    let objectUrl = null

    setLoading(true)
    setError(false)
    setSrc(null)

    fetchVersusPicture(imageId)
      .then((url) => {
        if (cancelled) {
          URL.revokeObjectURL(url)
          return
        }
        objectUrl = url
        setSrc(url)
        setLoading(false)
      })
      .catch(() => {
        if (!cancelled) {
          setError(true)
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [imageId])

  if (imageId == null || imageId === '') {
    return <div className="versus-card-placeholder">No image</div>
  }

  if (loading) {
    return (
      <div className="versus-card-image-loading" aria-busy="true" aria-label="Loading image">
        <span className="versus-card-spinner" />
      </div>
    )
  }

  if (error) {
    return <div className="versus-card-placeholder versus-card-placeholder-error">Unable to find image</div>
  }

  return <img src={src} alt={alt} />
}
