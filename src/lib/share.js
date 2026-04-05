import { normalizePostIdForUrl } from './postIds.js'

export const OFFICIAL_APP_ORIGIN = 'https://softmaxx.org'

function cleanSegment(value) {
  if (value === null || value === undefined) {
    return ''
  }

  const normalizedValue = String(value).trim()

  if (!normalizedValue) {
    return ''
  }

  return encodeURIComponent(normalizedValue)
}

export function buildOfficialPostPath(username, postId) {
  const safeUsername = cleanSegment(username)
  const safePostId = cleanSegment(normalizePostIdForUrl(postId))

  if (!safeUsername || !safePostId) {
    return ''
  }

  return `/${safeUsername}/${safePostId}`
}

export function buildOfficialPostUrl(username, postId) {
  const path = buildOfficialPostPath(username, postId)

  if (!path) {
    return ''
  }

  return `${OFFICIAL_APP_ORIGIN}${path}`
}

export function formatOfficialPostUrl(url) {
  if (!url) {
    return ''
  }

  return url.replace(/^https?:\/\//, '')
}

export async function shareOfficialPost({ username, postId, title, text }) {
  const url = buildOfficialPostUrl(username, postId)

  if (!url) {
    return {
      ok: false,
      message: 'This post link is not available yet.',
    }
  }

  try {
    if (navigator.share) {
      await navigator.share({ title, text, url })

      return {
        ok: true,
        message: 'Post link shared.',
      }
    }

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url)

      return {
        ok: true,
        message: 'Post link copied.',
      }
    }

    return {
      ok: false,
      message: url,
    }
  } catch (error) {
    const wasCancelled = error instanceof DOMException && error.name === 'AbortError'

    return {
      ok: false,
      message: wasCancelled ? '' : 'Unable to share this post right now.',
    }
  }
}
