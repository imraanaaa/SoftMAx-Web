import { mkdir, readFile, writeFile } from 'node:fs/promises'

const WAITLIST_TABLE = 'waitlist_signups'
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const LOCAL_JSON_STORAGE_MODE = 'local_json'
const SUPABASE_STORAGE_MODE = 'supabase'
const LOCAL_WAITLIST_DIRECTORY_URL = new URL('../data/', import.meta.url)
const LOCAL_WAITLIST_FILE_URL = new URL('../data/waitlist.local.json', import.meta.url)

function normalizeString(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function normalizeEmail(value) {
  return normalizeString(value).toLowerCase()
}

function readRequestBody(request) {
  if (!request.body) {
    return {}
  }

  if (typeof request.body === 'string') {
    try {
      return JSON.parse(request.body)
    } catch {
      return {}
    }
  }

  return request.body
}

function getSupabaseCredentials() {
  const supabaseUrl =
    process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_SERVICE_KEY ??
    process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ??
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

function getWaitlistStorageMode() {
  return normalizeString(process.env.WAITLIST_STORAGE).toLowerCase()
}

function getVercelEnvironment() {
  return normalizeString(process.env.VERCEL_ENV).toLowerCase()
}

function isProductionLikeRuntime() {
  return (
    normalizeString(process.env.NODE_ENV).toLowerCase() === 'production' ||
    ['preview', 'production'].includes(getVercelEnvironment())
  )
}

function shouldUseLocalJsonStorage(supabaseCredentials) {
  const storageMode = getWaitlistStorageMode()

  if (storageMode && ![LOCAL_JSON_STORAGE_MODE, SUPABASE_STORAGE_MODE].includes(storageMode)) {
    throw new Error('Unknown waitlist storage mode.')
  }

  if (storageMode === LOCAL_JSON_STORAGE_MODE) {
    if (isProductionLikeRuntime()) {
      throw new Error('Local JSON waitlist storage is only supported in local development.')
    }

    return true
  }

  if (storageMode === SUPABASE_STORAGE_MODE) {
    return false
  }

  return !isProductionLikeRuntime() && (!supabaseCredentials.supabaseUrl || !supabaseCredentials.supabaseKey)
}

function createSupabaseHeaders(supabaseKey) {
  return {
    apikey: supabaseKey,
    Authorization: `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json',
    Prefer: 'resolution=merge-duplicates,return=minimal',
  }
}

async function readLocalWaitlistSignups() {
  try {
    const fileContents = await readFile(LOCAL_WAITLIST_FILE_URL, 'utf8')
    const parsedContents = JSON.parse(fileContents)

    if (!Array.isArray(parsedContents)) {
      throw new Error('Local waitlist file must contain an array.')
    }

    return parsedContents
  } catch (error) {
    if (error?.code === 'ENOENT') {
      return []
    }

    throw error
  }
}

async function writeLocalWaitlistSignups(signups) {
  await mkdir(LOCAL_WAITLIST_DIRECTORY_URL, { recursive: true })
  await writeFile(LOCAL_WAITLIST_FILE_URL, `${JSON.stringify(signups, null, 2)}\n`, 'utf8')
}

async function saveWaitlistSignupToLocalJson({ email, source, wantsTestingAccess }) {
  const now = new Date().toISOString()
  const normalizedSource = normalizeString(source) || 'landing_page'
  const signups = await readLocalWaitlistSignups()
  const existingIndex = signups.findIndex((signup) => normalizeEmail(signup?.email) === email)

  if (existingIndex >= 0) {
    const existingSignup = signups[existingIndex]

    signups[existingIndex] = {
      ...existingSignup,
      email,
      source: normalizedSource,
      wantsTestingAccess: wantsTestingAccess !== false,
      createdAt: normalizeString(existingSignup?.createdAt) || now,
      lastRequestedAt: now,
    }
  } else {
    signups.unshift({
      email,
      source: normalizedSource,
      wantsTestingAccess: wantsTestingAccess !== false,
      createdAt: now,
      lastRequestedAt: now,
    })
  }

  await writeLocalWaitlistSignups(signups)
}

async function saveWaitlistSignupToSupabase({ email, source, wantsTestingAccess }, supabaseCredentials) {
  const { supabaseUrl, supabaseKey } = supabaseCredentials

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Waitlist storage is not configured yet.')
  }

  const searchParams = new URLSearchParams({
    on_conflict: 'email',
  })

  const payload = {
    email,
    source: normalizeString(source) || 'landing_page',
    wants_testing_access: wantsTestingAccess !== false,
    last_requested_at: new Date().toISOString(),
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/${WAITLIST_TABLE}?${searchParams.toString()}`, {
    method: 'POST',
    headers: createSupabaseHeaders(supabaseKey),
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('We could not store this email right now.')
  }
}

async function saveWaitlistSignup(signup) {
  const supabaseCredentials = getSupabaseCredentials()

  if (shouldUseLocalJsonStorage(supabaseCredentials)) {
    await saveWaitlistSignupToLocalJson(signup)
    return {
      storage: LOCAL_JSON_STORAGE_MODE,
    }
  }

  await saveWaitlistSignupToSupabase(signup, supabaseCredentials)

  return {
    storage: SUPABASE_STORAGE_MODE,
  }
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return response.status(405).json({ error: 'Method not allowed.' })
  }

  const body = readRequestBody(request)
  const email = normalizeEmail(body.email)

  if (!EMAIL_PATTERN.test(email)) {
    return response.status(400).json({ error: 'Enter a valid email address.' })
  }

  try {
    const result = await saveWaitlistSignup({
      email,
      source: body.source,
      wantsTestingAccess: body.wantsTestingAccess,
    })

    return response.status(200).json({
      ok: true,
      email,
      storage: result.storage,
    })
  } catch (error) {
    return response.status(500).json({
      error: error instanceof Error ? error.message : 'We could not save your email right now.',
    })
  }
}
