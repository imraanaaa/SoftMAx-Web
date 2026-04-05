import { useState } from 'react'
import './App.css'

function GooglePlayIcon() {
  return (
    <svg
      className="store-icon"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M3.609 1.814 13.792.041a.38.38 0 0 1 .453.307l2.719 15.661a.38.38 0 0 1-.307.453L6.474 18.235a.38.38 0 0 1-.453-.307L3.302 2.267a.38.38 0 0 1 .307-.453ZM17.5 7a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z" />
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
    label: 'Google Play',
    icon: <GooglePlayIcon />,
  },
  {
    label: 'App Store',
    icon: <AppStoreIcon />,
  },
]

function App() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()

    const submittedEmail = email.trim()

    if (!submittedEmail) {
      return
    }

    localStorage.setItem('softmaxx_email', submittedEmail)
    setIsSubmitted(true)
  }

  return (
    <main className="page-shell">
      <section className="container" aria-labelledby="softmaxx-title">
        <p className="eyebrow">Training app launch</p>
        <h1 className="logo" id="softmaxx-title">
          SOFTMAXX
        </h1>
        <p className="tagline">The Ascension System</p>
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
                required
              />
              <button type="submit" className="submit-btn">
                Notify Me
              </button>
            </div>
          </form>
        ) : (
          <div className="confirmation show" id="confirmation" role="status">
            You&apos;re on the list.
          </div>
        )}

        <footer className="footer">softmaxx.org</footer>
      </section>
    </main>
  )
}

export default App
