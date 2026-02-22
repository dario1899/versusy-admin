/**
 * Returns a value suitable for <img src="">.
 * - If the backend sends byte[] in JSON, Jackson serializes as Base64 string.
 * - We also support URL strings (image1Url/image2Url) and existing data URLs.
 */
export function toImageSrc(value, contentType = 'image/jpeg') {
  if (value == null || value === '') return null
  if (typeof value !== 'string') return null
  // Already a full URL or data URL
  if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:')) {
    return value
  }
  // Assume Base64-encoded image (e.g. from Spring byte[] in JSON)
  return `data:${contentType};base64,${value}`
}

export function getImageSrc(item, side) {
  const sideNum = side === 1 ? 1 : 2
  const urlKey = sideNum === 1 ? 'image1Url' : 'image2Url'
  const bytesKey = sideNum === 1 ? 'image1' : 'image2'
  const typeKey = sideNum === 1 ? 'image1ContentType' : 'image2ContentType'

  const url = item[urlKey] ?? item[`image${sideNum}Url`]
  if (url) return toImageSrc(url)

  const base64 = item[bytesKey] ?? item[`image${sideNum}`]
  const contentType = item[typeKey] ?? item[`image${sideNum}ContentType`] ?? 'image/jpeg'
  return toImageSrc(base64, contentType)
}
