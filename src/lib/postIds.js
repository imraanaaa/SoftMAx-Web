const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const NUMERIC_ID_PATTERN = /^\d+$/

function normalizeUuidString(value) {
  if (value === null || value === undefined) {
    return ''
  }

  return String(value).trim().toLowerCase()
}

export function isUuid(value) {
  return UUID_PATTERN.test(normalizeUuidString(value))
}

export function isNumericPostId(value) {
  return NUMERIC_ID_PATTERN.test(String(value ?? '').trim())
}

export function uuidToNumericPostId(uuid) {
  const normalizedUuid = normalizeUuidString(uuid)

  if (!isUuid(normalizedUuid)) {
    return ''
  }

  const compactUuid = normalizedUuid.replaceAll('-', '')

  return BigInt(`0x${compactUuid}`).toString(10)
}

export function numericPostIdToUuid(postId) {
  const normalizedPostId = String(postId ?? '').trim()

  if (!isNumericPostId(normalizedPostId)) {
    return ''
  }

  const hexValue = BigInt(normalizedPostId).toString(16)

  if (hexValue.length > 32) {
    return ''
  }

  const paddedHex = hexValue.padStart(32, '0')

  return [
    paddedHex.slice(0, 8),
    paddedHex.slice(8, 12),
    paddedHex.slice(12, 16),
    paddedHex.slice(16, 20),
    paddedHex.slice(20, 32),
  ].join('-')
}

export function normalizePostIdForUrl(postId) {
  const normalizedPostId = String(postId ?? '').trim()

  if (!normalizedPostId) {
    return ''
  }

  if (isNumericPostId(normalizedPostId)) {
    return normalizedPostId
  }

  if (isUuid(normalizedPostId)) {
    return uuidToNumericPostId(normalizedPostId)
  }

  return normalizedPostId
}

export function decodePostIdFromUrl(postId) {
  const normalizedPostId = String(postId ?? '').trim()

  if (!normalizedPostId) {
    return ''
  }

  if (isUuid(normalizedPostId)) {
    return normalizedPostId
  }

  if (isNumericPostId(normalizedPostId)) {
    return numericPostIdToUuid(normalizedPostId) || normalizedPostId
  }

  return normalizedPostId
}
