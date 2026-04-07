import {
  ClerkDegraded,
  ClerkFailed,
  ClerkLoaded,
  ClerkLoading,
  useAuth,
  useClerk,
  useSignIn,
  useSignUp,
  useUser,
} from '@clerk/clerk-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  authCallbackPath,
  defaultAfterAuthUrl,
  hasClerk,
  isDevelopmentClerkKey,
} from '../lib/auth.js'
import {
  fetchProfileById,
  isUsernameAvailable,
  normalizeUsername,
  upsertProfile,
  validateUsername,
} from '../lib/posts.js'
import { createClerkSupabaseClient } from '../lib/supabase.js'

const pendingUsernameStorageKey = 'softmaxx_pending_username'
const authLoadTimeoutMs = 8000

function storePendingUsername(username) {
  const normalizedUsername = normalizeUsername(username)

  if (!normalizedUsername) {
    sessionStorage.removeItem(pendingUsernameStorageKey)
    return
  }

  sessionStorage.setItem(pendingUsernameStorageKey, normalizedUsername)
}

function readPendingUsername() {
  return sessionStorage.getItem(pendingUsernameStorageKey) ?? ''
}

function clearPendingUsername() {
  sessionStorage.removeItem(pendingUsernameStorageKey)
}

function goHome() {
  window.location.assign('/')
}

function reloadPage() {
  window.location.reload()
}

function hasInternalAuthMessage(message) {
  const normalizedMessage = String(message ?? '').toLowerCase()

  return [
    'publishable key',
    'api key',
    'pk_live',
    'pk_test',
    'development',
    'production',
    'environment',
    'origin',
    'domain',
    'clerk',
  ].some((keyword) => normalizedMessage.includes(keyword))
}

function getPublicAuthError(error, fallbackMessage) {
  const rawMessage =
    error?.errors?.[0]?.longMessage || error?.errors?.[0]?.message || error?.message || ''

  if (!rawMessage || hasInternalAuthMessage(rawMessage)) {
    if (import.meta.env.DEV && rawMessage) {
      console.error('Sanitized auth error:', rawMessage)
    }

    return fallbackMessage
  }

  return rawMessage
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

function AuthStatusCard({
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

function AuthRecoveryCard({
  sectionLabel,
  title,
  copy,
  primaryLabel,
  onPrimary,
  secondaryLabel = 'Back to home',
  onSecondary = goHome,
  tertiaryLabel,
  onTertiary,
}) {
  return (
    <AuthStatusCard sectionLabel={sectionLabel} title={title} copy={copy} centered>
      <div className="auth-action-stack">
        {primaryLabel && onPrimary ? (
          <button className="auth-primary-button" type="button" onClick={onPrimary}>
            {primaryLabel}
          </button>
        ) : null}
        {secondaryLabel && onSecondary ? (
          <button className="auth-secondary-button" type="button" onClick={onSecondary}>
            {secondaryLabel}
          </button>
        ) : null}
        {tertiaryLabel && onTertiary ? (
          <button className="auth-secondary-button" type="button" onClick={onTertiary}>
            {tertiaryLabel}
          </button>
        ) : null}
      </div>
    </AuthStatusCard>
  )
}

function AuthUnavailablePage() {
  return (
    <AuthShell>
      <AuthRecoveryCard
        sectionLabel="Sign In"
        title="Sign-in is temporarily unavailable."
        copy="Please try again shortly."
        primaryLabel="Try Again"
        onPrimary={reloadPage}
      />
    </AuthShell>
  )
}

function ProfileBadge({ imageUrl, initials }) {
  return (
    <div className="auth-avatar">
      {imageUrl ? <img src={imageUrl} alt="Profile" /> : <span>{initials || 'S'}</span>}
    </div>
  )
}

function ClerkAuthPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { isLoaded: authLoaded, isSignedIn, getToken } = useAuth()
  const { user } = useUser()
  const { signIn, setActive: setActiveSignIn, isLoaded: signInLoaded } = useSignIn()
  const { signUp, setActive: setActiveSignUp, isLoaded: signUpLoaded } = useSignUp()
  const clerk = useClerk()

  const authedSupabaseClient = useMemo(() => {
    return createClerkSupabaseClient(async () => {
      return (await getToken()) ?? null
    })
  }, [getToken])

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState(readPendingUsername())
  const [verificationCode, setVerificationCode] = useState('')
  const [formMessage, setFormMessage] = useState('')
  const [formError, setFormError] = useState('')
  const [usernameStatus, setUsernameStatus] = useState('')
  const [profile, setProfile] = useState(null)
  const [profileError, setProfileError] = useState('')
  const [isProfileLoading, setIsProfileLoading] = useState(false)
  const [isWorking, setIsWorking] = useState(false)
  const [pendingVerification, setPendingVerification] = useState(null)
  const [profileRefreshNonce, setProfileRefreshNonce] = useState(0)

  const requestedMode = searchParams.get('mode')
  const mode = requestedMode === 'sign-up' || requestedMode === 'complete-profile' ? 'sign-up' : 'sign-in'
  const signUpNeedsUsername =
    Boolean(signUpLoaded && signUp) &&
    signUp?.status === 'missing_requirements' &&
    Array.isArray(signUp.missingFields) &&
    signUp.missingFields.includes('username')
  const shouldCompleteSignedInProfile =
    authLoaded &&
    isSignedIn &&
    user?.id &&
    !isProfileLoading &&
    !profileError &&
    !profile?.username
  const shouldShowProfileCompletion = signUpNeedsUsername || shouldCompleteSignedInProfile
  const shouldShowSignedInIssue =
    authLoaded && isSignedIn && !isProfileLoading && Boolean(profileError)
  const showVerificationForm =
    pendingVerification === 'sign-in' || pendingVerification === 'sign-up'
  const showPrimarySignUpForm =
    !showVerificationForm && !shouldShowProfileCompletion && mode === 'sign-up'
  const showPrimarySignInForm =
    !showVerificationForm && !shouldShowProfileCompletion && mode === 'sign-in'
  const showUsernameField = showPrimarySignUpForm || shouldShowProfileCompletion
  const initials =
    user?.firstName?.charAt(0)?.toUpperCase() ||
    user?.username?.charAt(0)?.toUpperCase() ||
    profile?.initials ||
    'S'

  useEffect(() => {
    if (import.meta.env.DEV && isDevelopmentClerkKey) {
      console.warn('Clerk is using a test publishable key in this environment.')
    }
  }, [])

  useEffect(() => {
    if (!showUsernameField) {
      setUsernameStatus('')
      return
    }

    if (!username) {
      setUsernameStatus('')
      return
    }

    const usernameError = validateUsername(username)

    if (usernameError) {
      setUsernameStatus(usernameError)
      return
    }

    setUsernameStatus('Checking username...')

    const timer = window.setTimeout(async () => {
      const { data, error } = await isUsernameAvailable(
        username,
        shouldCompleteSignedInProfile ? user?.id : null,
        authedSupabaseClient,
      )

      if (error) {
        setUsernameStatus('Could not verify username yet.')
        return
      }

      setUsernameStatus(data ? 'Username available' : 'That username is already taken.')
    }, 320)

    return () => {
      window.clearTimeout(timer)
    }
  }, [
    authedSupabaseClient,
    shouldCompleteSignedInProfile,
    showUsernameField,
    user?.id,
    username,
  ])

  useEffect(() => {
    if (!showUsernameField) {
      return
    }

    if (username) {
      return
    }

    const preferredUsername =
      normalizeUsername(readPendingUsername()) ||
      normalizeUsername(profile?.username) ||
      normalizeUsername(user?.username) ||
      ''

    if (preferredUsername) {
      setUsername(preferredUsername)
    }
  }, [profile?.username, showUsernameField, user?.username, username])

  useEffect(() => {
    if (!authLoaded || !isSignedIn || !user?.id) {
      setProfile(null)
      setProfileError('')
      setIsProfileLoading(false)
      return
    }

    if (!authedSupabaseClient) {
      setProfile(null)
      setProfileError('We could not finish loading your account right now.')
      setIsProfileLoading(false)
      return
    }

    let isMounted = true

    async function loadProfile() {
      setIsProfileLoading(true)
      setProfileError('')

      const { data, error } = await fetchProfileById(user.id, authedSupabaseClient)

      if (!isMounted) {
        return
      }

      if (error && data === null) {
        setProfile(null)
        setProfileError('We could not finish loading your account right now.')
        setIsProfileLoading(false)
        return
      }

      setProfile(data)
      setIsProfileLoading(false)
    }

    loadProfile()

    return () => {
      isMounted = false
    }
  }, [authLoaded, authedSupabaseClient, isSignedIn, profileRefreshNonce, user?.id])

  function updateMode(nextMode) {
    const nextParams = new URLSearchParams(searchParams)

    if (nextMode === 'sign-in') {
      nextParams.delete('mode')
    } else {
      nextParams.set('mode', nextMode)
    }

    setSearchParams(nextParams, { replace: true })
    setFormMessage('')
    setFormError('')
    setVerificationCode('')
    setPendingVerification(null)
  }

  async function persistProfile(targetUserId, targetUsername) {
    if (!targetUserId) {
      setFormError('We could not finish setting up your account right now.')
      return false
    }

    const profileResult = await upsertProfile(
      {
        userId: targetUserId,
        username: targetUsername,
        displayName: targetUsername,
        avatarUrl: user?.imageUrl ?? '',
      },
      authedSupabaseClient,
    )

    if (profileResult.error) {
      setFormError(
        getPublicAuthError(
          profileResult.error,
          'We could not finish setting up your profile right now.',
        ),
      )
      return false
    }

    clearPendingUsername()
    setProfile(profileResult.data)
    return true
  }

  async function activateSession(setActive, sessionId) {
    if (!setActive || !sessionId) {
      return false
    }

    await setActive({ session: sessionId })
    return true
  }

  async function handleSignInSubmit(event) {
    event.preventDefault()

    if (!signInLoaded || !signIn) {
      return
    }

    setIsWorking(true)
    setFormMessage('')
    setFormError('')

    try {
      const result = await signIn.create({
        strategy: 'password',
        identifier: emailAddress.trim(),
        password,
      })

      if (result.status === 'complete' && result.createdSessionId) {
        await activateSession(setActiveSignIn, result.createdSessionId)
        navigate(defaultAfterAuthUrl, { replace: true })
        return
      }

      if (result.status === 'needs_second_factor') {
        const supportsEmailCode = result.supportedSecondFactors?.some(
          (factor) => factor.strategy === 'email_code',
        )

        if (supportsEmailCode) {
          await result.prepareSecondFactor({ strategy: 'email_code' })
          setPendingVerification('sign-in')
          setFormMessage(`Enter the code sent to ${emailAddress.trim()}.`)
          return
        }
      }

      setFormError('This sign-in needs another step. Please try again.')
    } catch (error) {
      setFormError(getPublicAuthError(error, 'We could not sign you in right now.'))
    } finally {
      setIsWorking(false)
    }
  }

  async function handleSignUpSubmit(event) {
    event.preventDefault()

    if (!signUpLoaded || !signUp) {
      return
    }

    const usernameError = validateUsername(username)

    if (usernameError) {
      setFormError(usernameError)
      return
    }

    setIsWorking(true)
    setFormMessage('')
    setFormError('')
    storePendingUsername(username)

    try {
      await signUp.create({
        emailAddress: emailAddress.trim(),
        password,
      })

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      setPendingVerification('sign-up')
      setFormMessage(`Enter the code sent to ${emailAddress.trim()}.`)
    } catch (error) {
      setFormError(getPublicAuthError(error, 'We could not create your account right now.'))
    } finally {
      setIsWorking(false)
    }
  }

  async function handleVerifySubmit(event) {
    event.preventDefault()

    if (!verificationCode.trim()) {
      setFormError('Enter the email code first.')
      return
    }

    setIsWorking(true)
    setFormMessage('')
    setFormError('')

    try {
      if (pendingVerification === 'sign-up' && signUpLoaded && signUp) {
        const result = await signUp.attemptEmailAddressVerification({
          code: verificationCode.trim(),
        })

        if (result.status === 'complete' && result.createdSessionId) {
          await activateSession(setActiveSignUp, result.createdSessionId)

          const didSaveProfile = await persistProfile(
            result.createdUserId ?? user?.id ?? null,
            normalizeUsername(username),
          )

          if (didSaveProfile) {
            navigate(defaultAfterAuthUrl, { replace: true })
            return
          }

          const nextParams = new URLSearchParams(searchParams)
          nextParams.set('mode', 'complete-profile')
          setSearchParams(nextParams, { replace: true })
          setPendingVerification(null)
          return
        }

        if (result.status === 'missing_requirements') {
          const nextParams = new URLSearchParams(searchParams)
          nextParams.set('mode', 'complete-profile')
          setSearchParams(nextParams, { replace: true })
          setPendingVerification(null)
          setFormMessage('We just need your username to finish the account.')
          return
        }

        setFormError('Your account still needs one more step.')
        return
      }

      if (pendingVerification === 'sign-in' && signInLoaded && signIn) {
        const result = await signIn.attemptSecondFactor({
          strategy: 'email_code',
          code: verificationCode.trim(),
        })

        if (result.status === 'complete' && result.createdSessionId) {
          await activateSession(setActiveSignIn, result.createdSessionId)
          navigate(defaultAfterAuthUrl, { replace: true })
          return
        }

        setFormError('That verification code did not finish sign-in.')
      }
    } catch (error) {
      setFormError(getPublicAuthError(error, 'We could not verify that code right now.'))
    } finally {
      setIsWorking(false)
    }
  }

  async function handleCompleteProfile(event) {
    event.preventDefault()

    const normalizedUsername = normalizeUsername(username)
    const usernameError = validateUsername(normalizedUsername)

    if (usernameError) {
      setFormError(usernameError)
      return
    }

    setIsWorking(true)
    setFormMessage('')
    setFormError('')
    storePendingUsername(normalizedUsername)

    try {
      if (signUpNeedsUsername && signUpLoaded && signUp) {
        const result = await signUp.update({ username: normalizedUsername })

        if (result.status === 'complete' && result.createdSessionId) {
          await activateSession(setActiveSignUp, result.createdSessionId)
          const didSaveProfile = await persistProfile(
            result.createdUserId ?? user?.id ?? null,
            normalizedUsername,
          )

          if (didSaveProfile) {
            navigate(defaultAfterAuthUrl, { replace: true })
            return
          }
        }

        if (result.status !== 'missing_requirements') {
          setFormError('Your sign-up still needs another required field.')
        }

        return
      }

      if (shouldCompleteSignedInProfile && user?.id) {
        const didSaveProfile = await persistProfile(user.id, normalizedUsername)

        if (didSaveProfile) {
          navigate(defaultAfterAuthUrl, { replace: true })
        }
      }
    } catch (error) {
      setFormError(
        getPublicAuthError(error, 'We could not finish setting up your profile right now.'),
      )
    } finally {
      setIsWorking(false)
    }
  }

  async function handleGoogleAuth() {
    if (!signInLoaded || !signIn) {
      return
    }

    setFormMessage('')
    setFormError('')
    storePendingUsername(username)

    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: authCallbackPath,
        redirectUrlComplete: defaultAfterAuthUrl,
        continueSignIn: true,
        continueSignUp: true,
      })
    } catch (error) {
      setFormError(getPublicAuthError(error, 'Google sign-in is unavailable right now.'))
    }
  }

  async function handleSignOut() {
    await clerk.signOut({ redirectUrl: '/auth' })
  }

  function handleRetryProfileLoad() {
    setFormMessage('')
    setFormError('')
    setProfileError('')
    setProfileRefreshNonce((value) => value + 1)
  }

  if (authLoaded && isSignedIn && isProfileLoading) {
    return (
      <AuthStatusCard
        sectionLabel="Account"
        title="Loading your account..."
        copy="Finishing your SOFTMAXX profile."
        centered
        showSpinner
      >
        <div className="auth-action-stack">
          <button className="auth-secondary-button" type="button" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </AuthStatusCard>
    )
  }

  if (shouldShowSignedInIssue) {
    return (
      <AuthRecoveryCard
        sectionLabel="Account"
        title="We could not finish loading your account."
        copy="Please try again. Your sign-in was successful."
        primaryLabel="Try Again"
        onPrimary={handleRetryProfileLoad}
        secondaryLabel="Sign Out"
        onSecondary={handleSignOut}
      />
    )
  }

  if (isSignedIn && profile?.username && !shouldShowProfileCompletion) {
    return (
      <section className="auth-card">
        <p className="auth-section-label">Account Ready</p>
        <div className="auth-account-header">
          <ProfileBadge imageUrl={user?.imageUrl || profile?.avatarUrl} initials={initials} />
          <div>
            <h2 className="auth-title">
              {profile.displayName || user?.firstName || profile.username || 'Hunter'}
            </h2>
            <p className="auth-copy">@{profile.username}</p>
            <p className="auth-copy auth-copy--muted">
              {user?.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </div>

        <div className="auth-action-stack">
          <button
            className="auth-primary-button"
            type="button"
            onClick={() => navigate(defaultAfterAuthUrl)}
          >
            Continue To Community
          </button>
          <button className="auth-secondary-button" type="button" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="auth-card">
      {!showVerificationForm && !shouldShowProfileCompletion ? (
        <div className="auth-tabs" role="tablist" aria-label="Authentication mode">
          <button
            className={`auth-tab${mode === 'sign-in' ? ' auth-tab--active' : ''}`}
            type="button"
            onClick={() => updateMode('sign-in')}
          >
            Sign In
          </button>
          <button
            className={`auth-tab${mode === 'sign-up' ? ' auth-tab--active' : ''}`}
            type="button"
            onClick={() => updateMode('sign-up')}
          >
            Sign Up
          </button>
        </div>
      ) : null}

      <p className="auth-section-label">
        {showVerificationForm
          ? 'Email Verification'
          : shouldShowProfileCompletion
            ? 'Choose Username'
            : mode === 'sign-up'
              ? 'Create Account'
              : 'Welcome Back'}
      </p>

      <h2 className="auth-title">
        {showVerificationForm
          ? 'Verify your email'
          : shouldShowProfileCompletion
            ? 'Finish your profile'
            : mode === 'sign-up'
              ? 'Create the same account your app will use.'
              : 'Sign in with your SOFTMAXX account.'}
      </h2>

      <p className="auth-copy">
        {showVerificationForm
          ? 'Enter the code we sent to your email.'
          : shouldShowProfileCompletion
            ? 'Pick the username that will appear in the community feed and inside the app.'
            : mode === 'sign-up'
              ? 'Website signup and Android login use the same account.'
              : 'Use email/password or Google. Your progress stays on the same account.'}
      </p>

      {showPrimarySignInForm ? (
        <form className="auth-form" onSubmit={handleSignInSubmit}>
          <label className="auth-field">
            <span>Email</span>
            <input
              autoComplete="email"
              className="auth-input"
              type="email"
              value={emailAddress}
              onChange={(event) => setEmailAddress(event.target.value)}
              placeholder="your@email.com"
              required
            />
          </label>

          <label className="auth-field">
            <span>Password</span>
            <input
              autoComplete="current-password"
              className="auth-input"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="********"
              required
            />
          </label>

          <button className="auth-primary-button" disabled={isWorking} type="submit">
            {isWorking ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      ) : null}

      {showPrimarySignUpForm ? (
        <form className="auth-form" onSubmit={handleSignUpSubmit}>
          <label className="auth-field">
            <span>Email</span>
            <input
              autoComplete="email"
              className="auth-input"
              type="email"
              value={emailAddress}
              onChange={(event) => setEmailAddress(event.target.value)}
              placeholder="your@email.com"
              required
            />
          </label>

          <label className="auth-field">
            <span>Password</span>
            <input
              autoComplete="new-password"
              className="auth-input"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 6 characters"
              required
            />
          </label>

          <label className="auth-field">
            <span>Username</span>
            <input
              autoComplete="username"
              className="auth-input"
              type="text"
              value={username}
              onChange={(event) => setUsername(normalizeUsername(event.target.value))}
              placeholder="hunter_name"
              required
            />
          </label>

          {usernameStatus ? (
            <p
              className={`auth-status-copy${
                usernameStatus === 'Username available'
                  ? ' auth-status-copy--success'
                  : usernameStatus === 'Checking username...'
                    ? ''
                    : ' auth-status-copy--error'
              }`}
            >
              {usernameStatus}
            </p>
          ) : null}

          <button className="auth-primary-button" disabled={isWorking} type="submit">
            {isWorking ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
      ) : null}

      {showVerificationForm ? (
        <form className="auth-form" onSubmit={handleVerifySubmit}>
          <label className="auth-field">
            <span>Email Code</span>
            <input
              autoComplete="one-time-code"
              className="auth-input"
              inputMode="numeric"
              type="text"
              value={verificationCode}
              onChange={(event) => setVerificationCode(event.target.value)}
              placeholder="123456"
              required
            />
          </label>

          <button className="auth-primary-button" disabled={isWorking} type="submit">
            {isWorking ? 'Verifying...' : 'Verify Email'}
          </button>

          <button
            className="auth-secondary-button"
            type="button"
            onClick={() => {
              setPendingVerification(null)
              setVerificationCode('')
            }}
          >
            Back
          </button>
        </form>
      ) : null}

      {shouldShowProfileCompletion ? (
        <form className="auth-form" onSubmit={handleCompleteProfile}>
          <label className="auth-field">
            <span>Username</span>
            <input
              autoComplete="username"
              className="auth-input"
              type="text"
              value={username}
              onChange={(event) => setUsername(normalizeUsername(event.target.value))}
              placeholder="hunter_name"
              required
            />
          </label>

          {usernameStatus ? (
            <p
              className={`auth-status-copy${
                usernameStatus === 'Username available'
                  ? ' auth-status-copy--success'
                  : usernameStatus === 'Checking username...'
                    ? ''
                    : ' auth-status-copy--error'
              }`}
            >
              {usernameStatus}
            </p>
          ) : null}

          <button className="auth-primary-button" disabled={isWorking} type="submit">
            {isWorking ? 'Saving Username...' : 'Enter The System'}
          </button>
        </form>
      ) : null}

      {!showVerificationForm && !shouldShowProfileCompletion ? (
        <>
          <div className="auth-divider">
            <span>Or</span>
          </div>

          <button className="auth-google-button" type="button" onClick={handleGoogleAuth}>
            Continue with Google
          </button>
        </>
      ) : null}

      {formMessage ? <p className="auth-message">{formMessage}</p> : null}
      {formError ? <p className="auth-error">{formError}</p> : null}

      <div className="auth-footer-links">
        <Link className="auth-secondary-link" to="/">
          Back to home
        </Link>
        {isSignedIn ? (
          <button className="auth-inline-button" type="button" onClick={handleSignOut}>
            Sign out
          </button>
        ) : null}
      </div>
    </section>
  )
}

function LoadedAuthPage() {
  const clerk = useClerk()
  const [loadTimedOut, setLoadTimedOut] = useState(false)
  const isStableLoaded =
    Boolean(clerk.loaded) &&
    clerk.status !== 'loading' &&
    clerk.status !== 'error' &&
    clerk.status !== 'degraded'

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoadTimedOut(true)
    }, authLoadTimeoutMs)

    return () => {
      window.clearTimeout(timer)
    }
  }, [])

  return (
    <AuthShell>
      <ClerkLoading>
        {loadTimedOut ? (
          <AuthRecoveryCard
            sectionLabel="Sign In"
            title="Sign-in is taking longer than expected."
            copy="Please refresh and try again."
            primaryLabel="Retry"
            onPrimary={reloadPage}
          />
        ) : (
          <AuthStatusCard
            sectionLabel="Secure Sign In"
            title="Loading secure sign-in..."
            copy="Preparing your account."
            centered
            showSpinner
          />
        )}
      </ClerkLoading>

      <ClerkFailed>
        <AuthRecoveryCard
          sectionLabel="Sign In"
          title="Sign-in is temporarily unavailable."
          copy="Please refresh and try again."
          primaryLabel="Retry"
          onPrimary={reloadPage}
        />
      </ClerkFailed>

      <ClerkDegraded>
        <AuthRecoveryCard
          sectionLabel="Sign In"
          title="Sign-in is temporarily unavailable."
          copy="Please refresh and try again."
          primaryLabel="Retry"
          onPrimary={reloadPage}
        />
      </ClerkDegraded>

      <ClerkLoaded>{isStableLoaded ? <ClerkAuthPage /> : null}</ClerkLoaded>
    </AuthShell>
  )
}

function AuthPage() {
  if (!hasClerk) {
    return <AuthUnavailablePage />
  }

  return <LoadedAuthPage />
}

export default AuthPage
