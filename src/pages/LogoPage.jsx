import { Link } from 'react-router-dom'

const MARK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="240" height="240">
  <defs>
    <linearGradient id="profileGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#3a2a14"/>
      <stop offset="30%" stop-color="#8a6f3a"/>
      <stop offset="60%" stop-color="#c9a96e"/>
      <stop offset="85%" stop-color="#f0d080"/>
      <stop offset="100%" stop-color="#fffbe6"/>
    </linearGradient>
    <linearGradient id="profileHighlight" x1="50%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fffbe6" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#fffbe6" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <path d="M 78 42 C 102 28, 142 26, 164 44 C 178 56, 184 74, 186 94 L 188 102 L 206 144 L 178 152 L 190 162 L 178 170 L 192 178 L 175 184 L 198 214 L 102 204 C 70 200, 50 178, 52 138 C 54 92, 58 56, 78 42 Z" fill="url(#profileGrad)"/>
  <path d="M 78 42 C 102 28, 142 26, 164 44 C 178 56, 184 74, 186 94 L 188 102 L 206 144 L 178 152 L 190 162 L 178 170 L 192 178 L 175 184 L 198 214 L 102 204 C 70 200, 50 178, 52 138 C 54 92, 58 56, 78 42 Z" fill="url(#profileHighlight)"/>
</svg>`

const WORDMARK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 160" width="720" height="160">
  <defs>
    <linearGradient id="wordGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8a6f3a"/>
      <stop offset="35%" stop-color="#c9a96e"/>
      <stop offset="55%" stop-color="#fffbe6"/>
      <stop offset="75%" stop-color="#c9a96e"/>
      <stop offset="100%" stop-color="#8a6f3a"/>
    </linearGradient>
  </defs>
  <text x="360" y="118" font-family="'Bebas Neue', Impact, 'Arial Black', sans-serif" font-size="140" font-weight="400" text-anchor="middle" fill="url(#wordGrad)" letter-spacing="6">SOFTMAXX</text>
</svg>`

const LOCKUP_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 560" width="800" height="560">
  <defs>
    <linearGradient id="lockProfile" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#3a2a14"/>
      <stop offset="30%" stop-color="#8a6f3a"/>
      <stop offset="60%" stop-color="#c9a96e"/>
      <stop offset="85%" stop-color="#f0d080"/>
      <stop offset="100%" stop-color="#fffbe6"/>
    </linearGradient>
    <linearGradient id="lockProfileHL" x1="50%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fffbe6" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#fffbe6" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="lockWord" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8a6f3a"/>
      <stop offset="35%" stop-color="#c9a96e"/>
      <stop offset="55%" stop-color="#fffbe6"/>
      <stop offset="75%" stop-color="#c9a96e"/>
      <stop offset="100%" stop-color="#8a6f3a"/>
    </linearGradient>
    <radialGradient id="lockBg" cx="50%" cy="35%" r="70%">
      <stop offset="0%" stop-color="#1a120a"/>
      <stop offset="100%" stop-color="#080604"/>
    </radialGradient>
  </defs>
  <rect width="800" height="560" fill="url(#lockBg)"/>
  <g transform="translate(280, 40) scale(1)">
    <path d="M 78 42 C 102 28, 142 26, 164 44 C 178 56, 184 74, 186 94 L 188 102 L 206 144 L 178 152 L 190 162 L 178 170 L 192 178 L 175 184 L 198 214 L 102 204 C 70 200, 50 178, 52 138 C 54 92, 58 56, 78 42 Z" fill="url(#lockProfile)"/>
    <path d="M 78 42 C 102 28, 142 26, 164 44 C 178 56, 184 74, 186 94 L 188 102 L 206 144 L 178 152 L 190 162 L 178 170 L 192 178 L 175 184 L 198 214 L 102 204 C 70 200, 50 178, 52 138 C 54 92, 58 56, 78 42 Z" fill="url(#lockProfileHL)"/>
  </g>
  <text x="400" y="400" font-family="'Bebas Neue', Impact, 'Arial Black', sans-serif" font-size="92" font-weight="400" text-anchor="middle" fill="url(#lockWord)" letter-spacing="5">SOFTMAXX</text>
  <text x="400" y="450" font-family="'DM Mono', 'Courier New', monospace" font-size="14" font-weight="400" text-anchor="middle" fill="#a89070" letter-spacing="6">THE ASCENSION SYSTEM</text>
  <text x="400" y="488" font-family="'DM Mono', 'Courier New', monospace" font-size="12" font-weight="400" text-anchor="middle" fill="#cdb188" letter-spacing="2">Level up your body. Every day. No excuses.</text>
</svg>`

function downloadSvg(svgString, filename) {
  if (typeof window === 'undefined') return
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function downloadPng(svgString, filename, width, height, background = null) {
  if (typeof window === 'undefined') return
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.onload = () => {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (background) {
      ctx.fillStyle = background
      ctx.fillRect(0, 0, width, height)
    }
    ctx.drawImage(img, 0, 0, width, height)
    canvas.toBlob((pngBlob) => {
      if (!pngBlob) return
      const pngUrl = URL.createObjectURL(pngBlob)
      const link = document.createElement('a')
      link.href = pngUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(pngUrl)
      URL.revokeObjectURL(url)
    }, 'image/png')
  }
  img.onerror = () => URL.revokeObjectURL(url)
  img.src = url
}

function LogoVariant({ title, description, svgString, displayClassName, downloads }) {
  return (
    <article className="logo-variant">
      <header className="logo-variant-header">
        <h2 className="logo-variant-title">{title}</h2>
        <p className="logo-variant-description">{description}</p>
      </header>
      <div
        className={`logo-variant-display ${displayClassName ?? ''}`.trim()}
        dangerouslySetInnerHTML={{ __html: svgString }}
      />
      <div className="logo-variant-actions">
        {downloads.map((dl) => (
          <button
            key={dl.label}
            type="button"
            className="logo-download-btn"
            onClick={dl.onClick}
          >
            {dl.label}
          </button>
        ))}
      </div>
    </article>
  )
}

function LogoPage() {
  return (
    <main className="page-shell logo-shell">
      <div className="ambient-orbs" aria-hidden="true">
        <div className="ambient-orb ambient-orb--1" />
        <div className="ambient-orb ambient-orb--2" />
        <div className="ambient-orb ambient-orb--3" />
        <div className="ambient-orb ambient-orb--4" />
      </div>

      <section className="logo-layout">
        <Link className="logo-back-link" to="/">
          ← Back to Softmaxx
        </Link>

        <header className="logo-hero">
          <p className="logo-hero-kicker">Brand Identity</p>
          <h1 className="logo-hero-title">The Apollo</h1>
          <p className="logo-hero-subtitle">
            A classical profile, carved in gold. The strong brow, the straight
            Greek nose, the sharp jawline &mdash; the timeless silhouette of
            human aesthetic ideal.
          </p>
        </header>

        <section className="logo-meaning">
          <div className="logo-meaning-card">
            <span className="logo-meaning-label">Meaning</span>
            <p className="logo-meaning-copy">
              The Apollo is the destination. For two thousand years, the
              classical profile has been the human standard for beauty &mdash;
              a <strong>strong brow</strong>, a <strong>Greek nose</strong>, a
              <strong> sharp jaw</strong>, all in proportion. SOFTMAXX is the
              system that gets you there. The gradient rises from deep bronze
              at the base of the neck to bright gold at the crown of the head
              &mdash; the climb made visible. Discipline, sculpted into form.
            </p>
          </div>
        </section>

        <div className="logo-variants">
          <LogoVariant
            title="The Mark"
            description="Standalone icon. Use for app icons, favicons, watermarks."
            svgString={MARK_SVG}
            displayClassName="logo-variant-display--mark"
            downloads={[
              {
                label: 'Download SVG',
                onClick: () => downloadSvg(MARK_SVG, 'softmaxx-mark.svg'),
              },
              {
                label: 'Download PNG',
                onClick: () =>
                  downloadPng(MARK_SVG, 'softmaxx-mark.png', 1024, 1024, '#080604'),
              },
              {
                label: 'PNG (transparent)',
                onClick: () =>
                  downloadPng(MARK_SVG, 'softmaxx-mark-transparent.png', 1024, 1024),
              },
            ]}
          />

          <LogoVariant
            title="The Wordmark"
            description="Display the name alone. For headers, titles, and signatures."
            svgString={WORDMARK_SVG}
            displayClassName="logo-variant-display--wordmark"
            downloads={[
              {
                label: 'Download SVG',
                onClick: () => downloadSvg(WORDMARK_SVG, 'softmaxx-wordmark.svg'),
              },
              {
                label: 'Download PNG',
                onClick: () =>
                  downloadPng(
                    WORDMARK_SVG,
                    'softmaxx-wordmark.png',
                    1440,
                    320,
                    '#080604'
                  ),
              },
            ]}
          />

          <LogoVariant
            title="Full Lockup"
            description="Mark + wordmark + tagline. The complete identity."
            svgString={LOCKUP_SVG}
            displayClassName="logo-variant-display--lockup"
            downloads={[
              {
                label: 'Download SVG',
                onClick: () => downloadSvg(LOCKUP_SVG, 'softmaxx-lockup.svg'),
              },
              {
                label: 'Download PNG',
                onClick: () =>
                  downloadPng(LOCKUP_SVG, 'softmaxx-lockup.png', 1600, 1040),
              },
            ]}
          />
        </div>

        <footer className="logo-footnote">
          <p>
            SVG files use the Bebas Neue font for the wordmark. If your design
            tool doesn&apos;t render it, install Bebas Neue free from Google Fonts.
          </p>
        </footer>
      </section>
    </main>
  )
}

export default LogoPage
