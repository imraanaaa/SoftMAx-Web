import { supabase } from './supabase.js'

function firstDefinedValue(...values) {
  return values.find((value) => value !== null && value !== undefined) ?? null
}

function firstNonEmptyString(...values) {
  const selectedValue = values.find(
    (value) => typeof value === 'string' && value.trim().length > 0,
  )

  return selectedValue?.trim() ?? ''
}

export function normalizePostRecord(record, fallbackUsername = '') {
  if (!record) {
    return null
  }

  const username = firstNonEmptyString(
    record.username,
    record.user_name,
    record.handle,
    record.author_username,
    record.profile?.username,
    record.profiles?.username,
    record.user?.username,
    record.author?.username,
    fallbackUsername,
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
    username,
    content,
    imageUrl,
    timestamp,
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

  return {
    data: normalizePostRecord(data, fallbackUsername),
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
