import {
  AuthenticateWithRedirectCallback,
  ClerkDegraded,
  ClerkFailed,
  ClerkLoaded,
  ClerkLoading,
  useClerk,
} from '@clerk/clerk-react'
import { useEffect, useState } from 'react'
import { authPagePath, defaultAfterAuthUrl, hasClerk } from '../lib/auth.js'

const callbackLoadTimeoutMs = 12000

function goHome() {
  window.location.assign('/')
}

function retrySignIn() {
  window.location.assign(authPagePath)
}

function AuthShell({ children }) {
  return (
    <main className="auth-shell">
      <section className="auth-column">
        <div className="auth-brand">
          <p className="auth-kicker">SOFTMAXX</p>
          <h1 className="auth-logo">SOFTMAXX</h1>
          <p className="auth-tagline">The Ascension System</p>
        </div>
        {children}
      </section>
    </main>
  )
}

function CallbackStatusCard({
  sectionLabel,
  title,
  copy,
  centered = false,
  showSpinner = false,
  children,
}) {
  return (
    <section className={centered ? 'auth-card auth-card--loading' : 'auth-card'}>
      <p className="auth-section-label">{sectionLabel}</p>
      {showSpinner ? <div className="auth-spinner" aria-hidden="true" /> : null}
      <h2 className="auth-title">{title}</h2>
      <p className="auth-copy">{copy}</p>
      {children}
    </section>
  )
}

function CallbackRecoveryCard({ title, copy }) {
  return (
    <CallbackStatusCard sectionLabel="Sign In" title={title} copy={copy} centered>
      <div className="auth-action-stack">
        <button className="auth-primary-button" type="button" onClick={retrySignIn}>
          Retry Sign-In
        </button>
        <button className="auth-secondary-button" type="button" onClick={goHome}>
          Back to Home
        </button>
      </div>
    </CallbackStatusCard>
  )
}

function CallbackUnavailablePage() {
  return (
    <AuthShell>
      <CallbackRecoveryCard
        title="Sign-in is temporarily unavailable."
        copy="Please try again shortly."
      />
    </AuthShell>
  )
}

function LoadedAuthCallbackPage() {
  const clerk = useClerk()
  const [callbackTimedOut, setCallbackTimedOut] = useState(false)
  const isStableLoaded =
    Boolean(clerk.loaded) &&
    clerk.status !== 'loading' &&
    clerk.status !== 'error' &&
    clerk.status !== 'degraded'

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setCallbackTimedOut(true)
    }, callbackLoadTimeoutMs)

    return () => {
      window.clearTimeout(timer)
    }
  }, [])

  return (
    <AuthShell>
      <ClerkLoading>
        {callbackTimedOut ? (
          <CallbackRecoveryCard
            title="Finishing sign-in is taking longer than expected."
            copy="Please try signing in again."
          />
        ) : (
          <CallbackStatusCard
            sectionLabel="Secure Sign In"
            title="Finishing secure sign-in..."
            copy="Preparing your account."
            centered
            showSpinner
          />
        )}
      </ClerkLoading>

      <ClerkFailed>
        <CallbackRecoveryCard
          title="Sign-in is temporarily unavailable."
          copy="Please try signing in again."
        />
      </ClerkFailed>

      <ClerkDegraded>
        <CallbackRecoveryCard
          title="Sign-in is temporarily unavailable."
          copy="Please try signing in again."
        />
      </ClerkDegraded>

      <ClerkLoaded>
        {isStableLoaded ? (
          callbackTimedOut ? (
            <CallbackRecoveryCard
              title="Finishing sign-in is taking longer than expected."
              copy="Please try signing in again."
            />
          ) : (
            <CallbackStatusCard
              sectionLabel="Secure Sign In"
              title="Finishing secure sign-in..."
              copy="Preparing your account."
              centered
              showSpinner
            >
              <AuthenticateWithRedirectCallback
                continueSignUpUrl={`${authPagePath}?mode=complete-profile`}
                signInUrl={authPagePath}
                signUpUrl={`${authPagePath}?mode=sign-up`}
                signInForceRedirectUrl={defaultAfterAuthUrl}
                signInFallbackRedirectUrl={defaultAfterAuthUrl}
                signUpForceRedirectUrl={defaultAfterAuthUrl}
                signUpFallbackRedirectUrl={defaultAfterAuthUrl}
              />
            </CallbackStatusCard>
          )
        ) : null}
      </ClerkLoaded>
    </AuthShell>
  )
}

function AuthCallbackPage() {
  if (!hasClerk) {
    return <CallbackUnavailablePage />
  }

  return <LoadedAuthCallbackPage />
}

export default AuthCallbackPage
