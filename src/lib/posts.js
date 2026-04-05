import { supabase } from './supabase.js'
import { decodePostIdFromUrl, normalizePostIdForUrl } from './postIds.js'

const PROFILE_COLUMNS = 'id, username, display_name, avatar_url, rank_name, is_verified'
const USERNAME_PATTERN = /^[a-z0-9_]{3,20}$/

function resolveSupabaseClient(client) {
  return client ?? supabase
}

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

function normalizeProfileRecord(record) {
  if (!record) {
    return null
  }

  const username = firstNonEmptyString(record.username)
  const displayName = firstNonEmptyString(record.display_name, username)

  return {
    id: record.id ?? null,
    username,
    displayName,
    avatarUrl: firstNonEmptyString(record.avatar_url),
    rankName: firstNonEmptyString(record.rank_name),
    isVerified: Boolean(record.is_verified),
    initials: createInitials(displayName || username),
  }
}

function getProfileLookupKeys(record) {
  return [record?.profile_id, record?.user_id].filter(Boolean)
}

async function fetchProfilesMap(records, client = supabase) {
  const activeClient = resolveSupabaseClient(client)

  if (!activeClient) {
    return new Map()
  }

  const uniqueIds = [...new Set(records.flatMap((record) => getProfileLookupKeys(record)))]

  if (!uniqueIds.length) {
    return new Map()
  }

  const { data } = await activeClient.from('profiles').select(PROFILE_COLUMNS).in('id', uniqueIds)

  return new Map((data ?? []).map((record) => [record.id, normalizeProfileRecord(record)]))
}

function resolveProfileForRecord(record, profilesMap) {
  return (
    profilesMap.get(record?.profile_id) ??
    profilesMap.get(record?.user_id) ??
    normalizeProfileRecord(record?.profile) ??
    normalizeProfileRecord(record?.profiles) ??
    null
  )
}

export function normalizePostRecord(record, fallbackUsername = '', resolvedProfile = null) {
  if (!record) {
    return null
  }

  const profile = resolvedProfile ?? normalizeProfileRecord(record.profile) ?? normalizeProfileRecord(record.profiles)
  const username = firstNonEmptyString(
    profile?.username,
    record.username,
    record.user_name,
    record.handle,
    record.author_username,
    record.author?.username,
    fallbackUsername,
  )
  const displayName = firstNonEmptyString(
    profile?.displayName,
    record.display_name,
    record.author?.display_name,
    username,
  )
  const content = firstNonEmptyString(
    record.content,
    record.caption,
    record.text,
    record.body,
    record.description,
  )
  const imageUrl = firstNonEmptyString(
    record.image_url,
    record.imageUrl,
    record.image,
    record.media_url,
    record.mediaUrl,
    record.photo_url,
  )
  const timestamp = firstDefinedValue(
    record.created_at,
    record.createdAt,
    record.inserted_at,
    record.published_at,
    record.timestamp,
  )

  return {
    id: firstDefinedValue(record.id, record.post_id),
    publicId: normalizePostIdForUrl(firstDefinedValue(record.id, record.post_id)),
    userId: firstDefinedValue(record.user_id, record.userId, profile?.id),
    profileId: firstDefinedValue(record.profile_id, record.profileId, profile?.id),
    username,
    displayName: displayName || username || 'Unknown user',
    avatarUrl: firstNonEmptyString(profile?.avatarUrl, record.avatar_url),
    initials: createInitials(displayName || username),
    content,
    imageUrl,
    timestamp,
    rankName: firstNonEmptyString(record.rank_name, profile?.rankName),
    postType: firstNonEmptyString(record.post_type, imageUrl && content ? 'mixed' : imageUrl ? 'image' : 'text'),
    likesCount: Number(firstDefinedValue(record.likes_count, record.likesCount, 0)) || 0,
    commentsCount: Number(firstDefinedValue(record.comments_count, record.commentsCount, 0)) || 0,
    isVerified: Boolean(profile?.isVerified),
  }
}

async function normalizePostsWithProfiles(records, fallbackUsername = '', client = supabase) {
  const profilesMap = await fetchProfilesMap(records, client)

  return records
    .map((record) => normalizePostRecord(record, fallbackUsername, resolveProfileForRecord(record, profilesMap)))
    .filter(Boolean)
}

export function normalizeUsername(value) {
  return firstNonEmptyString(value).toLowerCase()
}

export function validateUsername(value) {
  const normalizedUsername = normalizeUsername(value)

  if (!normalizedUsername) {
    return 'Username is required.'
  }

  if (normalizedUsername.length < 3) {
    return 'Username needs at least 3 characters.'
  }

  if (normalizedUsername.length > 20) {
    return 'Username must stay under 20 characters.'
  }

  if (!USERNAME_PATTERN.test(normalizedUsername)) {
    return 'Use only lowercase letters, numbers, and underscores.'
  }

  return ''
}

export async function isUsernameAvailable(username, currentUserId = null, client = supabase) {
  const activeClient = resolveSupabaseClient(client)
  const normalizedUsername = normalizeUsername(username)

  if (!activeClient || !normalizedUsername) {
    return {
      data: false,
      error: new Error('Username lookup is unavailable.'),
    }
  }

  let query = activeClient.from('profiles').select('id').eq('username', normalizedUsername).limit(1)

  if (currentUserId) {
    query = query.neq('id', currentUserId)
  }

  const { data, error } = await query.maybeSingle()

  if (error) {
    return {
      data: false,
      error,
    }
  }

  return {
    data: !data,
    error: null,
  }
}

function createProfileUpsertPayloads({ userId, username, displayName, avatarUrl }) {
  const normalizedUsername = normalizeUsername(username)
  const normalizedDisplayName = firstNonEmptyString(displayName, normalizedUsername)
  const normalizedAvatarUrl = firstNonEmptyString(avatarUrl)

  return [
    {
      id: userId,
      username: normalizedUsername,
      display_name: normalizedDisplayName,
      avatar_url: normalizedAvatarUrl || null,
    },
    {
      id: userId,
      username: normalizedUsername,
      display_name: normalizedDisplayName,
    },
    {
      id: userId,
      username: normalizedUsername,
    },
  ]
}

export async function upsertProfile(
  { userId, username, displayName, avatarUrl },
  client = supabase,
) {
  const activeClient = resolveSupabaseClient(client)
  const usernameError = validateUsername(username)

  if (!activeClient || !userId) {
    return {
      data: null,
      error: new Error('Profile sync is unavailable.'),
    }
  }

  if (usernameError) {
    return {
      data: null,
      error: new Error(usernameError),
    }
  }

  const availabilityResult = await isUsernameAvailable(username, userId, activeClient)

  if (!availabilityResult.error && !availabilityResult.data) {
    return {
      data: null,
      error: new Error('That username is already taken.'),
    }
  }

  const payloads = createProfileUpsertPayloads({ userId, username, displayName, avatarUrl })
  let lastError = null

  for (const payload of payloads) {
    const { error } = await activeClient.from('profiles').upsert(payload, { onConflict: 'id' })

    if (!error) {
      const profileResult = await fetchProfileById(userId, activeClient)

      if (profileResult.data) {
        return profileResult
      }

      return {
        data: normalizeProfileRecord(payload),
        error: null,
      }
    }

    lastError = error

    if (String(error?.message ?? '').toLowerCase().includes('username')) {
      return {
        data: null,
        error: new Error('That username is already taken.'),
      }
    }
  }

  return {
    data: null,
    error: lastError ?? new Error('Unable to save profile right now.'),
  }
}

export async function fetchProfileById(profileId, client = supabase) {
  const activeClient = resolveSupabaseClient(client)

  if (!activeClient || !profileId) {
    return {
      data: null,
      error: new Error('Profile lookup is unavailable.'),
    }
  }

  const { data, error } = await activeClient
    .from('profiles')
    .select(PROFILE_COLUMNS)
    .eq('id', profileId)
    .maybeSingle()

  if (error) {
    return {
      data: null,
      error,
    }
  }

  return {
    data: normalizeProfileRecord(data),
    error: null,
  }
}

export async function fetchProfileByUsername(username, client = supabase) {
  const activeClient = resolveSupabaseClient(client)
  const normalizedUsername = normalizeUsername(username)

  if (!activeClient || !normalizedUsername) {
    return {
      data: null,
      error: new Error('Profile lookup is unavailable.'),
    }
  }

  const { data, error } = await activeClient
    .from('profiles')
    .select(PROFILE_COLUMNS)
    .eq('username', normalizedUsername)
    .maybeSingle()

  if (error) {
    return {
      data: null,
      error,
    }
  }

  return {
    data: normalizeProfileRecord(data),
    error: null,
  }
}

export async function fetchPostById(postId, fallbackUsername = '', client = supabase) {
  const activeClient = resolveSupabaseClient(client)

  if (!activeClient) {
    return {
      data: null,
      error: new Error('Supabase is not configured.'),
    }
  }

  const databasePostId = decodePostIdFromUrl(postId)

  const { data, error } = await activeClient
    .from('posts')
    .select('*')
    .eq('id', databasePostId)
    .maybeSingle()

  if (error) {
    return {
      data: null,
      error,
    }
  }

  const normalizedPosts = await normalizePostsWithProfiles(
    data ? [data] : [],
    fallbackUsername,
    activeClient,
  )

  return {
    data: normalizedPosts[0] ?? null,
    error: null,
  }
}

export async function fetchPosts(client = supabase) {
  const activeClient = resolveSupabaseClient(client)

  if (!activeClient) {
    return {
      data: [],
      error: new Error('Supabase is not configured.'),
    }
  }

  const queries = [
    activeClient.from('posts').select('*').order('created_at', { ascending: false }),
    activeClient.from('posts').select('*').order('createdAt', { ascending: false }),
    activeClient.from('posts').select('*'),
  ]

  for (const query of queries) {
    const { data, error } = await query

    if (error) {
      continue
    }

    const normalizedPosts = await normalizePostsWithProfiles(data ?? [], '', activeClient)

    normalizedPosts.sort((leftPost, rightPost) => {
      const leftTime = leftPost?.timestamp ? new Date(leftPost.timestamp).getTime() : 0
      const rightTime = rightPost?.timestamp ? new Date(rightPost.timestamp).getTime() : 0

      return rightTime - leftTime
    })

    return {
      data: normalizedPosts,
      error: null,
    }
  }

  return {
    data: [],
    error: new Error('Unable to fetch posts from Supabase.'),
  }
}

export async function fetchPostsByProfileUsername(username, client = supabase) {
  const activeClient = resolveSupabaseClient(client)
  const profileResult = await fetchProfileByUsername(username, activeClient)

  if (profileResult.error) {
    return {
      data: [],
      profile: null,
      error: profileResult.error,
    }
  }

  if (!profileResult.data?.id) {
    return {
      data: [],
      profile: null,
      error: new Error('Profile not found.'),
    }
  }

  const queries = [
    activeClient
      .from('posts')
      .select('*')
      .or(`profile_id.eq.${profileResult.data.id},user_id.eq.${profileResult.data.id}`)
      .order('created_at', { ascending: false }),
    activeClient
      .from('posts')
      .select('*')
      .or(`profile_id.eq.${profileResult.data.id},user_id.eq.${profileResult.data.id}`),
  ]

  for (const query of queries) {
    const { data, error } = await query

    if (error) {
      continue
    }

    const normalizedPosts = await normalizePostsWithProfiles(
      data ?? [],
      profileResult.data.username,
      activeClient,
    )

    normalizedPosts.sort((leftPost, rightPost) => {
      const leftTime = leftPost?.timestamp ? new Date(leftPost.timestamp).getTime() : 0
      const rightTime = rightPost?.timestamp ? new Date(rightPost.timestamp).getTime() : 0

      return rightTime - leftTime
    })

    return {
      data: normalizedPosts,
      profile: profileResult.data,
      error: null,
    }
  }

  return {
    data: [],
    profile: profileResult.data,
    error: new Error('Unable to fetch posts for this profile.'),
  }
}

export async function createPost({ userId, profile, content, imageUrl, client = supabase }) {
  const activeClient = resolveSupabaseClient(client)

  if (!activeClient) {
    return {
      data: null,
      error: new Error('Supabase is not configured.'),
    }
  }

  const normalizedContent = firstNonEmptyString(content)
  const normalizedImageUrl = firstNonEmptyString(imageUrl)

  if (!normalizedContent && !normalizedImageUrl) {
    return {
      data: null,
      error: new Error('A post needs text, an image, or both.'),
    }
  }

  if (!userId || !profile?.id) {
    return {
      data: null,
      error: new Error('You need a profile before you can post.'),
    }
  }

  const postType = normalizedContent && normalizedImageUrl ? 'mixed' : normalizedImageUrl ? 'image' : 'text'

  const insertPayload = {
    user_id: userId,
    profile_id: profile.id,
    content: normalizedContent || null,
    image_url: normalizedImageUrl || null,
    post_type: postType,
    likes_count: 0,
    comments_count: 0,
    rank_name: profile.rankName || null,
    xp_earned: 0,
    stats_snapshot: {},
  }

  const { data, error } = await activeClient.from('posts').insert(insertPayload).select('*').single()

  if (error) {
    return {
      data: null,
      error,
    }
  }

  return {
    data: normalizePostRecord(data, profile.username, profile),
    error: null,
  }
}

export async function fetchUnreadNotificationsCount(userId, client = supabase) {
  const activeClient = resolveSupabaseClient(client)

  if (!activeClient || !userId) {
    return {
      data: 0,
      error: null,
    }
  }

  const { count, error } = await activeClient
    .from('notifications')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false)

  if (error) {
    return {
      data: 0,
      error,
    }
  }

  return {
    data: count ?? 0,
    error: null,
  }
}

export function formatPostTimestamp(timestamp) {
  if (!timestamp) {
    return 'Timestamp unavailable'
  }

  const parsedDate = new Date(timestamp)

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Timestamp unavailable'
  }

  return parsedDate.toLocaleString()
}

export function formatRelativePostTimestamp(timestamp) {
  if (!timestamp) {
    return 'Just now'
  }

  const parsedDate = new Date(timestamp)

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Just now'
  }

  const diffMs = Date.now() - parsedDate.getTime()
  const diffMinutes = Math.max(1, Math.floor(diffMs / 60000))

  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`
  }

  const diffHours = Math.floor(diffMinutes / 60)

  if (diffHours < 24) {
    return `${diffHours}h ago`
  }

  const diffDays = Math.floor(diffHours / 24)

  if (diffDays < 7) {
    return `${diffDays}d ago`
  }

  return formatPostTimestamp(timestamp)
}
