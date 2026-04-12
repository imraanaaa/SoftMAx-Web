import { Link } from 'react-router-dom'

const MARK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="240" height="240">
  <defs>
    <linearGradient id="ascend1" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#3a2a14"/>
      <stop offset="35%" stop-color="#8a6f3a"/>
      <stop offset="65%" stop-color="#c9a96e"/>
      <stop offset="100%" stop-color="#fffbe6"/>
    </linearGradient>
    <linearGradient id="ascend2" x1="100%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#3a2a14"/>
      <stop offset="35%" stop-color="#8a6f3a"/>
      <stop offset="65%" stop-color="#c9a96e"/>
      <stop offset="100%" stop-color="#fffbe6"/>
    </linearGradient>
    <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f0d080" stop-opacity="0.7"/>
      <stop offset="50%" stop-color="#c9a96e" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#8a6f3a" stop-opacity="0.5"/>
    </linearGradient>
  </defs>
  <circle cx="120" cy="120" r="116" fill="none" stroke="url(#ringGrad)" stroke-width="1.5"/>
  <circle cx="120" cy="120" r="106" fill="none" stroke="url(#ringGrad)" stroke-width="0.6" opacity="0.55"/>
  <path d="M 56 184 L 184 56" stroke="url(#ascend1)" stroke-width="22" stroke-linecap="round" fill="none"/>
  <path d="M 184 184 L 56 56" stroke="url(#ascend2)" stroke-width="22" stroke-linecap="round" fill="none"/>
  <circle cx="120" cy="120" r="5" fill="#fffbe6"/>
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

const LOCKUP_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520" width="800" height="520">
  <defs>
    <linearGradient id="lockAscend1" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#3a2a14"/>
      <stop offset="35%" stop-color="#8a6f3a"/>
      <stop offset="65%" stop-color="#c9a96e"/>
      <stop offset="100%" stop-color="#fffbe6"/>
    </linearGradient>
    <linearGradient id="lockAscend2" x1="100%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#3a2a14"/>
      <stop offset="35%" stop-color="#8a6f3a"/>
      <stop offset="65%" stop-color="#c9a96e"/>
      <stop offset="100%" stop-color="#fffbe6"/>
    </linearGradient>
    <linearGradient id="lockRing" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f0d080" stop-opacity="0.7"/>
      <stop offset="50%" stop-color="#c9a96e" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#8a6f3a" stop-opacity="0.5"/>
    </linearGradient>
    <linearGradient id="lockWord" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8a6f3a"/>
      <stop offset="35%" stop-color="#c9a96e"/>
      <stop offset="55%" stop-color="#fffbe6"/>
      <stop offset="75%" stop-color="#c9a96e"/>
      <stop offset="100%" stop-color="#8a6f3a"/>
    </linearGradient>
  </defs>
  <rect width="800" height="520" fill="#080604"/>
  <g transform="translate(280, 30)">
    <circle cx="120" cy="120" r="116" fill="none" stroke="url(#lockRing)" stroke-width="1.5"/>
    <circle cx="120" cy="120" r="106" fill="none" stroke="url(#lockRing)" stroke-width="0.6" opacity="0.55"/>
    <path d="M 56 184 L 184 56" stroke="url(#lockAscend1)" stroke-width="22" stroke-linecap="round" fill="none"/>
    <path d="M 184 184 L 56 56" stroke="url(#lockAscend2)" stroke-width="22" stroke-linecap="round" fill="none"/>
    <circle cx="120" cy="120" r="5" fill="#fffbe6"/>
  </g>
  <text x="400" y="380" font-family="'Bebas Neue', Impact, 'Arial Black', sans-serif" font-size="92" font-weight="400" text-anchor="middle" fill="url(#lockWord)" letter-spacing="5">SOFTMAXX</text>
  <text x="400" y="430" font-family="'DM Mono', 'Courier New', monospace" font-size="14" font-weight="400" text-anchor="middle" fill="#a89070" letter-spacing="6">THE ASCENSION SYSTEM</text>
  <text x="400" y="465" font-family="'DM Mono', 'Courier New', monospace" font-size="12" font-weight="400" text-anchor="middle" fill="#cdb188" letter-spacing="2">Level up your body. Every day. No excuses.</text>
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
          <h1 className="logo-hero-title">The Ascension Mark</h1>
          <p className="logo-hero-subtitle">
            Two diagonals rising from darkness into light. The X of SoftmaXX,
            redrawn as the climb itself.
          </p>
        </header>

        <section className="logo-meaning">
          <div className="logo-meaning-card">
            <span className="logo-meaning-label">Meaning</span>
            <p className="logo-meaning-copy">
              Each stroke ascends from deep bronze to bright gold &mdash; the
              journey from where you are to your peak. The two diagonals are
              <strong> discipline </strong>and<strong> consistency</strong>, the
              twin pillars of ascension. They cross at the present moment: a
              still point, a choice. The thin medallion ring frames it like a
              seal of commitment.
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
