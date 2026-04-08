import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { legalNavigation } from '../lib/legalContent.js'

function LegalPage({ content }) {
  useEffect(() => {
    const previousTitle = document.title

    document.title = `${content.title} | SOFTMAXX`
    window.scrollTo({ top: 0, behavior: 'auto' })

    return () => {
      document.title = previousTitle
    }
  }, [content.title])

  return (
    <main className="legal-shell">
      <div className="legal-layout">
        <section className="community-card legal-card legal-card--hero" aria-labelledby={`${content.slug}-title`}>
          <div className="legal-top-row">
            <Link className="back-link legal-back-link" to="/">
              Back to Home
            </Link>
            <nav className="legal-nav" aria-label="Legal pages">
              {legalNavigation.map((item) => {
                const isActive = item.href === `/${content.slug}`

                return (
                  <Link
                    aria-current={isActive ? 'page' : undefined}
                    className={`legal-nav-link${isActive ? ' legal-nav-link--active' : ''}`}
                    key={item.href}
                    to={item.href}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="legal-hero-copy">
            <p className="legal-kicker">Legal</p>
            <h1 className="legal-title" id={`${content.slug}-title`}>
              {content.title}
            </h1>
            <div className="legal-meta">
              <span>Effective Date</span>
              <span>{content.effectiveDate}</span>
            </div>
            <p className="legal-lead">{content.lead}</p>
            <div className="legal-intro-stack">
              {content.intro.map((paragraph) => (
                <p className="legal-copy" key={paragraph}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section className="legal-sections" aria-label={`${content.title} sections`}>
          {content.sections.map((section) => (
            <article
              className="community-card legal-card legal-section-card"
              key={`${content.slug}-${section.number}`}
            >
              <div className="legal-section-heading">
                <span className="legal-section-number">{section.number}</span>
                <h2 className="legal-section-title">{section.title}</h2>
              </div>

              {section.paragraphs?.map((paragraph) => {
                const isEmail = paragraph.includes('@')
                const isSite = paragraph === 'softmaxx.org'

                if (isEmail) {
                  return (
                    <a className="legal-contact-link" href={`mailto:${paragraph}`} key={paragraph}>
                      {paragraph}
                    </a>
                  )
                }

                if (isSite) {
                  return (
                    <Link className="legal-contact-link" key={paragraph} to="/">
                      {paragraph}
                    </Link>
                  )
                }

                return (
                  <p className="legal-copy" key={paragraph}>
                    {paragraph}
                  </p>
                )
              })}

              {section.groups?.length ? (
                <div className="legal-group-grid">
                  {section.groups.map((group) => (
                    <section className="legal-group-card" key={group.title}>
                      <h3 className="legal-group-title">{group.title}</h3>
                      <ul className="legal-list">
                        {group.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
              ) : null}

              {section.items?.length ? (
                <ul className="legal-list">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}

              {section.note ? <p className="legal-note">{section.note}</p> : null}
            </article>
          ))}
        </section>

        <footer className="community-card legal-card legal-footer-card">
          <p className="legal-footer-copy">
            Questions, deletion requests, or legal support can be sent to{' '}
            <a className="legal-inline-link" href="mailto:support@softmaxx.org">
              support@softmaxx.org
            </a>
            .
          </p>
          <div className="legal-footer-links">
            <Link className="legal-nav-link" to="/">
              softmaxx.org
            </Link>
            {legalNavigation.map((item) => (
              <Link className="legal-nav-link" key={`footer-${item.href}`} to={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </footer>
      </div>
    </main>
  )
}

export default LegalPage
