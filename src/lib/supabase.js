import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? import.meta.env.VITE_SUPABASE_ANON_KEY

export const hasSupabaseConfig = Boolean(supabaseUrl && supabasePublishableKey)

export function createSupabaseClient(options = {}) {
  if (!hasSupabaseConfig) {
    return null
  }

  return createClient(supabaseUrl, supabasePublishableKey, options)
}

export function createClerkSupabaseClient(getToken) {
  if (!hasSupabaseConfig) {
    return null
  }

  return createClient(supabaseUrl, supabasePublishableKey, {
    async accessToken() {
      if (!getToken) {
        return null
      }

      try {
        const templateToken = await getToken({ template: 'supabase' })

        if (templateToken) {
          return templateToken
        }
      } catch {
        // Fall back to the default Clerk session token for projects using
        // Supabase's third-party auth integration instead of a JWT template.
      }

      try {
        return (await getToken()) ?? null
      } catch {
        return null
      }
    },
  })
}

export const supabase = createSupabaseClient()
