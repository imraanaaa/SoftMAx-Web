import { Link } from 'react-router-dom'

const GOLD_STOPS = '<stop offset="0%" stop-color="#3a2a14"/><stop offset="30%" stop-color="#8a6f3a"/><stop offset="60%" stop-color="#c9a96e"/><stop offset="85%" stop-color="#f0d080"/><stop offset="100%" stop-color="#fffbe6"/>'

const grad = (id) =>
  `<linearGradient id="${id}" x1="0%" y1="100%" x2="100%" y2="0%">${GOLD_STOPS}</linearGradient>`

const LOGOS = [
  {
    id: 'apollo',
    name: 'The Apollo',
    tag: 'Looksmaxxing',
    meaning: 'Classical Greek profile. Strong brow, straight nose, sharp jaw — the timeless silhouette of aesthetic ideal.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><defs>${grad('sx_apollo')}</defs><path d="M 78 42 C 102 28, 142 26, 164 44 C 178 56, 184 74, 186 94 L 188 102 L 206 144 L 178 152 L 190 162 L 178 170 L 192 178 L 175 184 L 198 214 L 102 204 C 70 200, 50 178, 52 138 C 54 92, 58 56, 78 42 Z" fill="url(#sx_apollo)"/></svg>`,
  },
  {
    id: 'crown',
    name: 'Shadow Crown',
    tag: 'Solo Leveling',
    meaning: "The Monarch's crown. Three peaks of dominance ascending into light. Become the king of your own ascension.",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><defs>${grad('sx_crown')}</defs><path d="M 40 195 L 40 95 L 80 140 L 120 45 L 160 140 L 200 95 L 200 195 Z" fill="url(#sx_crown)"/><rect x="32" y="195" width="176" height="22" rx="3" fill="url(#sx_crown)"/><circle cx="120" cy="170" r="7" fill="#080604"/><circle cx="78" cy="170" r="5" fill="#080604"/><circle cx="162" cy="170" r="5" fill="#080604"/></svg>`,
  },
  {
    id: 'srank',
    name: 'S-Rank',
    tag: 'Solo Leveling',
    meaning: 'The hunter rank. A hexagonal seal containing the highest letter. You are the only S-rank of your own life.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><defs>${grad('sx_srank')}</defs><path d="M 120 25 L 198 70 L 198 170 L 120 215 L 42 170 L 42 70 Z" fill="none" stroke="url(#sx_srank)" stroke-width="10" stroke-linejoin="round"/><text x="120" y="170" font-family="'Bebas Neue', Impact, sans-serif" font-size="160" font-weight="400" text-anchor="middle" fill="url(#sx_srank)">S</text></svg>`,
  },
  {
    id: 'gate',
    name: 'The Gate',
    tag: 'Solo Leveling',
    meaning: 'The portal between weakness and strength. Walk through, leave your old self behind. You only level up by entering.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><defs>${grad('sx_gate')}</defs><path fill-rule="evenodd" d="M 50 215 L 50 105 Q 120 35 190 105 L 190 215 Z M 80 215 L 80 125 Q 120 70 160 125 L 160 215 Z" fill="url(#sx_gate)"/><rect x="38" y="215" width="164" height="14" rx="2" fill="url(#sx_gate)"/></svg>`,
  },
  {
    id: 'apex',
    name: 'The Apex',
    tag: 'Ascension',
    meaning: 'A single mountain peak. The summit you are climbing toward. Sun-lit on the right, shadow on the left — the climb is real.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><defs>${grad('sx_apex')}</defs><path d="M 120 28 L 222 212 L 18 212 Z" fill="url(#sx_apex)"/><path d="M 120 28 L 120 212 L 18 212 Z" fill="#080604" opacity="0.32"/></svg>`,
  },
  {
    id: 'sigil',
    name: 'The Sigil',
    tag: 'Solo Leveling',
    meaning: 'A magic circle, two triangles bound. Discipline and consistency. The system that summons your peak self.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><defs>${grad('sx_sigil')}</defs><circle cx="120" cy="120" r="105" fill="none" stroke="url(#sx_sigil)" stroke-width="4"/><circle cx="120" cy="120" r="82" fill="none" stroke="url(#sx_sigil)" stroke-width="1.5" opacity="0.55"/><path d="M 120 52 L 180 156 L 60 156 Z" fill="none" stroke="url(#sx_sigil)" stroke-width="6" stroke-linejoin="round"/><path d="M 120 188 L 60 84 L 180 84 Z" fill="none" stroke="url(#sx_sigil)" stroke-width="6" stroke-linejoin="round"/><circle cx="120" cy="120" r="6" fill="url(#sx_sigil)"/></svg>`,
  },
  {
    id: 'eye',
    name: 'The System',
    tag: 'Looksmaxxing',
    meaning: 'The all-seeing eye. The system that watches your reps, your meals, your sleep. Nothing is hidden from progress.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><defs>${grad('sx_eye')}</defs><path d="M 20 120 Q 120 32 220 120 Q 120 208 20 120 Z" fill="none" stroke="url(#sx_eye)" stroke-width="10" stroke-linejoin="round"/><circle cx="120" cy="120" r="40" fill="url(#sx_eye)"/><circle cx="135" cy="106" r="9" fill="#fffbe6"/></svg>`,
  },
  {
    id: 'excalibur',
    name: 'Excalibur',
    tag: 'Solo Leveling',
    meaning: 'A vertical blade pointing up. The weapon you become. Sharp, unyielding, climbing toward the sky.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><defs>${grad('sx_excalibur')}</defs><path d="M 120 22 L 132 56 L 132 166 L 108 166 L 108 56 Z" fill="url(#sx_excalibur)"/><rect x="74" y="163" width="92" height="14" rx="2" fill="url(#sx_excalibur)"/><rect x="113" y="177" width="14" height="34" fill="url(#sx_excalibur)"/><circle cx="120" cy="215" r="10" fill="url(#sx_excalibur)"/></svg>`,
  },
  {
    id: 'diamond',
    name: 'The Diamond',
    tag: 'Looksmaxxing',
    meaning: 'A cut gem. Your bone structure, polished. Pressure becomes brilliance. Chiseled facets catching the light.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><defs>${grad('sx_diamond')}</defs><path d="M 120 30 L 200 100 L 120 220 L 40 100 Z" fill="url(#sx_diamond)"/><path d="M 40 100 L 200 100" stroke="#080604" stroke-width="2.5" opacity="0.55"/><path d="M 80 100 L 120 30 L 160 100" fill="none" stroke="#080604" stroke-width="2" opacity="0.4"/><path d="M 80 100 L 120 220 L 160 100" fill="none" stroke="#080604" stroke-width="2" opacity="0.3"/></svg>`,
  },
  {
    id: 'monogram',
    name: 'The Mark',
    tag: 'Brand',
    meaning: 'A clean monogram. The S in a sealed frame — confident, minimal, instantly readable. The signature on your transformation.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><defs>${grad('sx_mono')}</defs><rect x="30" y="30" width="180" height="180" rx="22" fill="none" stroke="url(#sx_mono)" stroke-width="6"/><text x="120" y="184" font-family="'Bebas Neue', Impact, sans-serif" font-size="200" font-weight="400" text-anchor="middle" fill="url(#sx_mono)">S</text></svg>`,
  },
]

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

function downloadPng(svgString, filename, width = 1024, height = 1024, background = null) {
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

function LogoCard({ logo, index }) {
  return (
    <article
      className="logo-card"
      style={{ animationDelay: `${100 + index * 60}ms` }}
    >
      <div className="logo-card-number">{String(index + 1).padStart(2, '0')}</div>
      <div
        className="logo-card-display"
        dangerouslySetInnerHTML={{ __html: logo.svg }}
      />
      <div className="logo-card-text">
        <div className="logo-card-headline">
          <h3 className="logo-card-name">{logo.name}</h3>
          <span className="logo-card-tag">{logo.tag}</span>
        </div>
        <p className="logo-card-meaning">{logo.meaning}</p>
      </div>
      <div className="logo-card-actions">
        <button
          type="button"
          className="logo-download-btn"
          onClick={() => downloadSvg(logo.svg, `softmaxx-${logo.id}.svg`)}
        >
          SVG
        </button>
        <button
          type="button"
          className="logo-download-btn"
          onClick={() =>
            downloadPng(logo.svg, `softmaxx-${logo.id}.png`, 1024, 1024, '#080604')
          }
        >
          PNG · Dark
        </button>
        <button
          type="button"
          className="logo-download-btn"
          onClick={() =>
            downloadPng(logo.svg, `softmaxx-${logo.id}-transparent.png`, 1024, 1024)
          }
        >
          PNG · Trans
        </button>
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
          <p className="logo-hero-kicker">Brand Identity · 10 Concepts</p>
          <h1 className="logo-hero-title">Choose Your Mark</h1>
          <p className="logo-hero-subtitle">
            Ten logo concepts designed for SOFTMAXX &mdash; where looksmaxxing
            meets the system. Each carries the same gold ascension gradient.
            Pick the one that hits hardest. Tell me the number.
          </p>
        </header>

        <div className="logo-grid">
          {LOGOS.map((logo, index) => (
            <LogoCard key={logo.id} logo={logo} index={index} />
          ))}
        </div>

        <footer className="logo-footnote">
          <p>
            Every concept downloads as SVG (vector) or PNG (1024 × 1024) on
            dark or transparent background. SVGs that use Bebas Neue fall back
            to Impact in tools without the font installed.
          </p>
        </footer>
      </section>
    </main>
  )
}

export default LogoPage
