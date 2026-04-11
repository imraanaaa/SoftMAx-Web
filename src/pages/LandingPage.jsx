import { useState } from 'react'
import { Link } from 'react-router-dom'
import BlurText from '../components/BlurText.jsx'
import { InstagramLogoIcon, XLogoIcon } from '../components/FeedIcons.jsx'

const WAITLIST_EMAIL_KEY = 'softmaxx_waitlist_email'
const WAITLIST_SUBMITTED_KEY = 'softmaxx_waitlist_submitted'
const LEGACY_EMAIL_KEY = 'softmaxx_email'

function GoogleIcon() {
  return (
    <svg
      className="store-icon store-icon-google"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fill="#EA4335"
        d="M12.22 10.18v3.78h5.24a4.49 4.49 0 0 1-1.95 2.95l3.16 2.45c1.84-1.69 2.9-4.18 2.9-7.14 0-.69-.06-1.36-.18-2.01h-9.15Z"
      />
      <path
        fill="#4285F4"
        d="M12.22 21.5c2.62 0 4.82-.87 6.43-2.36l-3.16-2.45c-.88.59-2 1-3.27 1-2.51 0-4.64-1.69-5.4-3.96H3.56v2.52a9.7 9.7 0 0 0 8.66 5.25Z"
      />
      <path
        fill="#FBBC05"
        d="M6.82 13.73a5.82 5.82 0 0 1 0-3.69V7.52H3.56a9.7 9.7 0 0 0 0 8.73l3.26-2.52Z"
      />
      <path
        fill="#34A853"
        d="M12.22 6.08c1.42 0 2.69.49 3.7 1.45l2.77-2.77C17.03 3.2 14.83 2.3 12.22 2.3a9.7 9.7 0 0 0-8.66 5.22l3.26 2.52c.76-2.28 2.89-3.96 5.4-3.96Z"
      />
    </svg>
  )
}

function AppStoreIcon() {
  return (
    <svg
      className="store-icon"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11Z" />
    </svg>
  )
}

const storeBadges = [
  {
    label: 'Play Store',
    icon: <GoogleIcon />,
  },
  {
    label: 'App Store',
    icon: <AppStoreIcon />,
  },
]

const socialBadges = [
  {
    label: 'X',
    icon: <XLogoIcon className="social-link-icon" />,
  },
  {
    label: 'Instagram',
    icon: <InstagramLogoIcon className="social-link-icon" />,
  },
]

function readStoredWaitlistEmail() {
  if (typeof window === 'undefined') {
    return ''
  }

  return (
    window.localStorage.getItem(WAITLIST_EMAIL_KEY) ??
    window.localStorage.getItem(LEGACY_EMAIL_KEY) ??
    ''
  )
}

function hasSubmittedWaitlist() {
  if (typeof window === 'undefined') {
    return false
  }

  return window.localStorage.getItem(WAITLIST_SUBMITTED_KEY) === 'true'
}

function LandingPage() {
  const [email, setEmail] = useState(() => readStoredWaitlistEmail())
  const [isSubmitted, setIsSubmitted] = useState(() => hasSubmittedWaitlist())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()

    if (isSubmitting) {
      return
    }

    const submittedEmail = email.trim().toLowerCase()

    if (!submittedEmail) {
      return
    }

    setIsSubmitting(true)
    setFormError('')

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: submittedEmail,
          source: 'landing_page',
          wantsTestingAccess: true,
        }),
      })

      const payload = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(payload.error || 'We could not save your email right now.')
      }

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(WAITLIST_EMAIL_KEY, submittedEmail)
        window.localStorage.setItem(WAITLIST_SUBMITTED_KEY, 'true')
      }

      setEmail(submittedEmail)
      setIsSubmitted(true)
    } catch (error) {
      console.error('Waitlist signup failed.', error)
      setFormError('We could not save your email right now. Please try again in a few minutes.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="page-shell">
      <nav className="landing-nav">
        <span className="landing-nav-brand">SOFTMAXX</span>
        <div className="landing-nav-links">
          <a className="landing-nav-link" href="#emailForm">Join Waitlist</a>
        </div>
      </nav>
      <div className="ambient-orbs" aria-hidden="true">
        <div className="ambient-orb ambient-orb--1" />
        <div className="ambient-orb ambient-orb--2" />
        <div className="ambient-orb ambient-orb--3" />
        <div className="ambient-orb ambient-orb--4" />
      </div>
      <div className="ambient-particles" aria-hidden="true">
        <div className="ambient-particle" />
        <div className="ambient-particle" />
        <div className="ambient-particle" />
        <div className="ambient-particle" />
        <div className="ambient-particle" />
        <div className="ambient-particle" />
        <div className="ambient-particle" />
        <div className="ambient-particle" />
      </div>
      <section className="container" aria-labelledby="softmaxx-title">
        <h1 className="logo" id="softmaxx-title">
          <BlurText
            text="SOFTMAXX"
            delay={120}
            animateBy="characters"
            direction="top"
            className="logo-blur-text"
          />
        </h1>
        <p className="tagline">The Ascension System</p>
        <hr className="gold-line" />
        <p className="oneliner">Level up your body. Every day. No excuses.</p>

        <div className="store-badges" aria-label="Store availability">
          {storeBadges.map((badge) => (
            <div
              className="store-badge"
              key={badge.label}
              aria-disabled="true"
              title="Coming Soon"
            >
              {badge.icon}
              <span>{badge.label}</span>
              <span className="tooltip">Coming Soon</span>
            </div>
          ))}
        </div>

        {!isSubmitted ? (
          <form className="email-form" id="emailForm" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="emailInput">
              Email address
            </label>
            <div className="form-group">
              <input
                id="emailInput"
                type="email"
                className="email-input"
                placeholder="Enter your email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={isSubmitting}
                required
              />
              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Notify Me'}
              </button>
            </div>
            <p className="email-helper">Join the list for launch emails and beta testing invites.</p>
            {formError ? (
              <p className="form-feedback form-feedback--error" role="alert">
                {formError}
              </p>
            ) : null}
          </form>
        ) : (
          <div className="confirmation show" id="confirmation" role="status">
            You&apos;re on the list for launch emails and beta testing invites.
          </div>
        )}

        <footer className="footer">
          <div className="footer-site">softmaxx.org</div>
          <div className="footer-meta">
            <div className="social-links" aria-label="Social links">
              {socialBadges.map((badge) => (
                <button
                  className="footer-link social-link social-link--soon"
                  key={badge.label}
                  type="button"
                  title="Coming Soon"
                  disabled
                  aria-label={`${badge.label} coming soon`}
                >
                  {badge.icon}
                  <span>{badge.label}</span>
                  <span className="social-link-status">Coming Soon</span>
                </button>
              ))}
            </div>
            <div className="footer-aux-links" aria-label="Site links">
              <Link className="footer-link contact-link" to="/policy">
                Privacy Policy
              </Link>
              <Link className="footer-link contact-link" to="/terms">
                Terms of Service
              </Link>
              <a className="footer-link contact-link" href="mailto:business@softmaxx.org">
                business@softmaxx.org
              </a>
            </div>
          </div>
        </footer>
      </section>
    </main>
  )
}

export default LandingPage
