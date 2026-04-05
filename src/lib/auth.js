export const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ?? ''

export const hasClerk = Boolean(clerkPublishableKey)
export const isDevelopmentClerkKey = clerkPublishableKey.startsWith('pk_test_')
export const defaultAfterAuthUrl = '/posts'
export const authPagePath = '/auth'
export const authCallbackPath = '/auth/sso-callback'
