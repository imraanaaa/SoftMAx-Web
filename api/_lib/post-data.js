import { decodePostIdFromUrl, normalizePostIdForUrl } from '../../src/lib/postIds.js'

const POST_COLUMNS = [
  'id',
  'user_id',
  'profile_id',
  'content',
  'image_url',
  'created_at',
  'rank_name',
  'post_type',
  'likes_count',
  'comments_count',
].join(',')

const PROFILE_COLUMNS = [
  'id',
  'username',
  'display_name',
  'avatar_url',
  'rank_name',
  'is_verified',
].join(',')

function firstDefinedValue(...values) {
  return values.find((value) => value !== null && value !== undefined) ?? null
}

function firstNonEmptyString(...values) {
  const selectedValue = values.find(
    (value) => typeof value === 'string' && value.trim().length > 0,
  )

  return selectedValue?.trim() ?? ''
}

function createInitials(value) {
  const normalizedValue = firstNonEmptyString(value).replace(/[^a-z0-9 ]/gi, '')

  if (!normalizedValue) {
    return 'S'
  }

  return normalizedValue.charAt(0).toUpperCase()
}

function getSupabaseCredentials() {
  const supabaseUrl =
    process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const supabaseKey =
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
    process.env.VITE_SUPABASE_ANON_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    ''

  return {
    supabaseUrl,
    supabaseKey,
  }
}

function createSupabaseHeaders(supabaseKey) {
  return {
    apikey: supabaseKey,
    Authorization: `Bearer ${supabaseKey}`,
  }
}

async function fetchSupabaseRows(pathname, searchParams) {
  const { supabaseUrl, supabaseKey } = getSupabaseCredentials()

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase environment variables are missing.')
  }

  const requestUrl = `${supabaseUrl}/rest/v1/${pathname}?${searchParams.toString()}`
  const response = await fetch(requestUrl, {
    headers: createSupabaseHeaders(supabaseKey),
  })

  if (!response.ok) {
    throw new Error(`Supabase request failed with ${response.status}.`)
  }

  return response.json()
}

function normalizeProfile(profileRecord) {
  if (!profileRecord) {
    return null
  }

  const username = firstNonEmptyString(profileRecord.username)
  const displayName = firstNonEmptyString(profileRecord.display_name, username)

  return {
    id: profileRecord.id ?? null,
    username,
    displayName,
    avatarUrl: firstNonEmptyString(profileRecord.avatar_url),
    rankName: firstNonEmptyString(profileRecord.rank_name),
    isVerified: Boolean(profileRecord.is_verified),
    initials: createInitials(displayName || username),
  }
}

function normalizePost(postRecord, profileRecord, fallbackUsername = '') {
  if (!postRecord) {
    return null
  }

  const profile = normalizeProfile(profileRecord)
  const username = firstNonEmptyString(profile?.username, fallbackUsername)
  const displayName = firstNonEmptyString(profile?.displayName, username)
  const content = firstNonEmptyString(postRecord.content)
  const imageUrl = firstNonEmptyString(postRecord.image_url)

  return {
    id: firstDefinedValue(postRecord.id),
    publicId: normalizePostIdForUrl(postRecord.id),
    username,
    displayName: displayName || 'Unknown user',
    avatarUrl: profile?.avatarUrl ?? '',
    initials: profile?.initials ?? createInitials(displayName || username),
    imageUrl,
    content,
    timestamp: firstDefinedValue(postRecord.created_at),
    likesCount: Number(firstDefinedValue(postRecord.likes_count, 0)) || 0,
    commentsCount: Number(firstDefinedValue(postRecord.comments_count, 0)) || 0,
    rankName: firstNonEmptyString(postRecord.rank_name, profile?.rankName),
    postType: firstNonEmptyString(postRecord.post_type, imageUrl && content ? 'mixed' : imageUrl ? 'image' : 'text'),
    isVerified: Boolean(profile?.isVerified),
  }
}

async function fetchProfile(profileId) {
  if (!profileId) {
    return null
  }

  const searchParams = new URLSearchParams({
    select: PROFILE_COLUMNS,
    id: `eq.${profileId}`,
    limit: '1',
  })

  const rows = await fetchSupabaseRows('profiles', searchParams)

  return rows?.[0] ?? null
}

export async function fetchServerPost(publicPostId, fallbackUsername = '') {
  const databasePostId = decodePostIdFromUrl(publicPostId)

  if (!databasePostId) {
    return null
  }

  const searchParams = new URLSearchParams({
    select: POST_COLUMNS,
    id: `eq.${databasePostId}`,
    limit: '1',
  })

  const postRows = await fetchSupabaseRows('posts', searchParams)
  const postRecord = postRows?.[0] ?? null

  if (!postRecord) {
    return null
  }

  const profileId = firstDefinedValue(postRecord.profile_id, postRecord.user_id)
  const profileRecord = await fetchProfile(profileId)

  return normalizePost(postRecord, profileRecord, fallbackUsername)
}

export function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

export function createPostSummary(post) {
  if (!post) {
    return {
      title: 'SOFTMAXX post',
      description: 'View this SOFTMAXX post.',
    }
  }

  const title = post.displayName
    ? `${post.displayName} (@${post.username || 'softmaxx'}) on SOFTMAXX`
    : 'SOFTMAXX post'

  const description = firstNonEmptyString(post.content) || 'View this SOFTMAXX post.'

  return {
    title,
    description: description.length > 180 ? `${description.slice(0, 177)}...` : description,
  }
}
