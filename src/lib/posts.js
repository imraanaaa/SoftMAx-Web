import { supabase } from './supabase.js'

const PROFILE_COLUMNS = 'id, username, display_name, avatar_url, rank_name, is_verified'

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

async function fetchProfilesMap(records) {
  if (!supabase) {
    return new Map()
  }

  const uniqueIds = [...new Set(records.flatMap((record) => getProfileLookupKeys(record)))]

  if (!uniqueIds.length) {
    return new Map()
  }

  const { data } = await supabase.from('profiles').select(PROFILE_COLUMNS).in('id', uniqueIds)

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

async function normalizePostsWithProfiles(records, fallbackUsername = '') {
  const profilesMap = await fetchProfilesMap(records)

  return records
    .map((record) => normalizePostRecord(record, fallbackUsername, resolveProfileForRecord(record, profilesMap)))
    .filter(Boolean)
}

export async function fetchProfileById(profileId) {
  if (!supabase || !profileId) {
    return {
      data: null,
      error: new Error('Profile lookup is unavailable.'),
    }
  }

  const { data, error } = await supabase
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

export async function fetchPostById(postId, fallbackUsername = '') {
  if (!supabase) {
    return {
      data: null,
      error: new Error('Supabase is not configured.'),
    }
  }

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', postId)
    .maybeSingle()

  if (error) {
    return {
      data: null,
      error,
    }
  }

  const normalizedPosts = await normalizePostsWithProfiles(data ? [data] : [], fallbackUsername)

  return {
    data: normalizedPosts[0] ?? null,
    error: null,
  }
}

export async function fetchPosts() {
  if (!supabase) {
    return {
      data: [],
      error: new Error('Supabase is not configured.'),
    }
  }

  const queries = [
    supabase.from('posts').select('*').order('created_at', { ascending: false }),
    supabase.from('posts').select('*').order('createdAt', { ascending: false }),
    supabase.from('posts').select('*'),
  ]

  for (const query of queries) {
    const { data, error } = await query

    if (error) {
      continue
    }

    const normalizedPosts = await normalizePostsWithProfiles(data ?? [])

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

export async function createPost({ userId, profile, content, imageUrl }) {
  if (!supabase) {
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

  const { data, error } = await supabase.from('posts').insert(insertPayload).select('*').single()

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

export async function fetchUnreadNotificationsCount(userId) {
  if (!supabase || !userId) {
    return {
      data: 0,
      error: null,
    }
  }

  const { count, error } = await supabase
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
