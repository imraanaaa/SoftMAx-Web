const WAITLIST_TABLE = 'waitlist_signups'
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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

function createSupabaseHeaders(supabaseKey) {
  return {
    apikey: supabaseKey,
    Authorization: `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json',
    Prefer: 'resolution=merge-duplicates,return=minimal',
  }
}

async function saveWaitlistSignup({ email, source, wantsTestingAccess }) {
  const { supabaseUrl, supabaseKey } = getSupabaseCredentials()

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
    await saveWaitlistSignup({
      email,
      source: body.source,
      wantsTestingAccess: body.wantsTestingAccess,
    })

    return response.status(200).json({
      ok: true,
      email,
    })
  } catch (error) {
    return response.status(500).json({
      error: error instanceof Error ? error.message : 'We could not save your email right now.',
    })
  }
}
