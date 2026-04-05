import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react'
import { authPagePath, defaultAfterAuthUrl, hasClerk } from '../lib/auth.js'

function AuthCallbackPage() {
  if (!hasClerk) {
    return (
      <main className="auth-shell">
        <section className="auth-column">
          <div className="auth-brand">
            <p className="auth-kicker">SOFTMAXX</p>
            <h1 className="auth-logo">SOFTMAXX</h1>
            <p className="auth-tagline">The Ascension System</p>
          </div>

          <section className="auth-card">
            <p className="auth-section-label">Auth Unavailable</p>
            <h2 className="auth-title">Clerk is not configured here.</h2>
            <p className="auth-copy">
              Add <code>VITE_CLERK_PUBLISHABLE_KEY</code> and redeploy this environment.
            </p>
          </section>
        </section>
      </main>
    )
  }

  return (
    <main className="auth-shell">
      <section className="auth-column">
        <div className="auth-brand">
          <p className="auth-kicker">SOFTMAXX</p>
          <h1 className="auth-logo">SOFTMAXX</h1>
          <p className="auth-tagline">The Ascension System</p>
        </div>

        <section className="auth-card auth-card--loading">
          <div className="auth-spinner" aria-hidden="true" />
          <p className="auth-loading-copy">Finishing secure sign-in...</p>
          <AuthenticateWithRedirectCallback
            continueSignUpUrl={`${authPagePath}?mode=complete-profile`}
            signInUrl={authPagePath}
            signUpUrl={`${authPagePath}?mode=sign-up`}
            signInForceRedirectUrl={defaultAfterAuthUrl}
            signInFallbackRedirectUrl={defaultAfterAuthUrl}
            signUpForceRedirectUrl={defaultAfterAuthUrl}
            signUpFallbackRedirectUrl={defaultAfterAuthUrl}
          />
        </section>
      </section>
    </main>
  )
}

export default AuthCallbackPage
