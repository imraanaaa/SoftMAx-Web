import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

const SECTIONS = [
  {
    group: 'Getting Started',
    items: [
      { id: 'introduction', title: 'Introduction' },
      { id: 'overview', title: 'Platform Overview' },
    ],
  },
  {
    group: 'Core Systems',
    items: [
      { id: 'onboarding', title: 'Onboarding Flow' },
      { id: 'ai-task-engine', title: 'AI Task Engine' },
      { id: 'ai-insights', title: 'AI Daily Insights' },
      { id: 'progression', title: 'Progression & XP' },
      { id: 'rank-system', title: 'Rank Identity System' },
      { id: 'daily-quests', title: 'Daily Quest System' },
    ],
  },
  {
    group: 'Activity Tracking',
    items: [
      { id: 'step-tracking', title: 'Step Tracking' },
      { id: 'health-connect', title: 'Health Connect Integration' },
    ],
  },
  {
    group: 'Social Platform',
    items: [
      { id: 'feed', title: 'Feed & Posts' },
      { id: 'content-creation', title: 'Content Creation' },
      { id: 'comments', title: 'Comments & Discussion' },
      { id: 'sharing', title: 'Share & Distribution' },
      { id: 'direct-messaging', title: 'Direct Messaging' },
    ],
  },
  {
    group: 'User System',
    items: [
      { id: 'profiles', title: 'Profiles & Identity' },
      { id: 'search', title: 'Search & Discovery' },
      { id: 'notifications', title: 'Notifications' },
    ],
  },
  {
    group: 'Competition',
    items: [
      { id: 'leaderboards', title: 'Leaderboards' },
    ],
  },
  {
    group: 'Platform',
    items: [
      { id: 'session-persistence', title: 'Session Persistence' },
      { id: 'design-philosophy', title: 'Design Philosophy' },
      { id: 'supported-platforms', title: 'Supported Platforms' },
    ],
  },
]

const ALL_ITEMS = SECTIONS.flatMap((s) => s.items)

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

function BookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  )
}

function InfoCallout({ children }) {
  return (
    <div className="docs-callout docs-callout--info">
      <div className="docs-callout-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      </div>
      <div className="docs-callout-body">{children}</div>
    </div>
  )
}

function NoteCallout({ children }) {
  return (
    <div className="docs-callout docs-callout--note">
      <div className="docs-callout-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      </div>
      <div className="docs-callout-body">{children}</div>
    </div>
  )
}

function DocsSidebar({ activeId, onNavigate, searchQuery, onSearchChange }) {
  return (
    <aside className="docs-sidebar">
      <div className="docs-sidebar-header">
        <Link to="/" className="docs-sidebar-brand">
          <span className="docs-sidebar-logo">S</span>
          <span className="docs-sidebar-title">SOFTMAXX Docs</span>
        </Link>
      </div>
      <div className="docs-sidebar-search">
        <SearchIcon />
        <input
          type="text"
          placeholder="Search docs..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="docs-sidebar-search-input"
        />
        <kbd className="docs-sidebar-search-kbd">/</kbd>
      </div>
      <nav className="docs-sidebar-nav">
        {SECTIONS.map((section) => {
          const filtered = searchQuery
            ? section.items.filter((item) =>
                item.title.toLowerCase().includes(searchQuery.toLowerCase()),
              )
            : section.items

          if (filtered.length === 0) return null

          return (
            <div className="docs-sidebar-group" key={section.group}>
              <div className="docs-sidebar-group-label">{section.group}</div>
              {filtered.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`docs-sidebar-link${activeId === item.id ? ' docs-sidebar-link--active' : ''}`}
                  onClick={() => onNavigate(item.id)}
                >
                  <ChevronIcon />
                  <span>{item.title}</span>
                </button>
              ))}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}

function DocsContent() {
  return (
    <div className="docs-content">
      {/* -------- Introduction -------- */}
      <section id="introduction" className="docs-section">
        <div className="docs-section-badge">Getting Started</div>
        <h1>Introduction</h1>
        <p className="docs-hero-subtitle">
          Welcome to SOFTMAXX &mdash; the discipline-focused ascension system for structured
          self-improvement, measurable progress, and community-driven accountability.
        </p>
        <div className="docs-hero-banner">
          <div className="docs-hero-banner-inner">
            <span className="docs-hero-banner-mark">S</span>
            <div className="docs-hero-banner-text">
              <span className="docs-hero-banner-name">SOFTMAXX</span>
              <span className="docs-hero-banner-tag">The Ascension System</span>
            </div>
          </div>
        </div>
        <p>
          SOFTMAXX is not a basic habit tracker or a simple social app. It is a complete system where
          users set goals, receive guided tasks, complete routines, track real-life activity, earn
          progression-based rewards, and share that journey publicly with other users.
        </p>
        <InfoCallout>
          This documentation covers every major feature and system built into the SOFTMAXX platform.
          Use the sidebar to navigate to any section.
        </InfoCallout>
      </section>

      {/* -------- Overview -------- */}
      <section id="overview" className="docs-section">
        <h2>Platform Overview</h2>
        <p>
          SOFTMAXX is a gamified self-improvement and social accountability platform that enables
          users to build disciplined routines, complete AI-guided tasks, track real-world progress,
          earn visible status through XP and rank systems, and share that progress within an
          interactive community.
        </p>
        <div className="docs-feature-grid">
          <div className="docs-feature-card">
            <div className="docs-feature-card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
            </div>
            <h4>AI-Guided Tasks</h4>
            <p>Personalized daily missions generated from your current goals and challenges.</p>
          </div>
          <div className="docs-feature-card">
            <div className="docs-feature-card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
            </div>
            <h4>XP &amp; Rank System</h4>
            <p>Earn experience, climb ranks, and build a visible identity around your progress.</p>
          </div>
          <div className="docs-feature-card">
            <div className="docs-feature-card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
            </div>
            <h4>Social Community</h4>
            <p>Share progress, discuss strategies, and stay accountable with other users.</p>
          </div>
          <div className="docs-feature-card">
            <div className="docs-feature-card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
            </div>
            <h4>Activity Tracking</h4>
            <p>Step counting, Health Connect integration, and real-world movement verification.</p>
          </div>
          <div className="docs-feature-card">
            <div className="docs-feature-card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
            </div>
            <h4>Direct Messaging</h4>
            <p>Private conversations, accountability check-ins, and media sharing.</p>
          </div>
          <div className="docs-feature-card">
            <div className="docs-feature-card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" /></svg>
            </div>
            <h4>Leaderboards</h4>
            <p>Global, state, and regional competitive ranking by XP and streak.</p>
          </div>
        </div>
        <h3>Core Product Thesis</h3>
        <p>
          Personal improvement becomes more effective when it is <strong>structured</strong>,{' '}
          <strong>measurable</strong>, <strong>competitive</strong>, and{' '}
          <strong>socially visible</strong>. SOFTMAXX combines AI guidance, daily routines,
          behavior tracking, XP and ranks, public posting, direct messaging, notifications,
          searchable user profiles, and multi-scope leaderboards into one experience.
        </p>
        <NoteCallout>
          In business terms, SOFTMAXX is best understood as a discipline-centered social platform
          rather than a single-purpose productivity tool.
        </NoteCallout>
      </section>

      <hr className="docs-divider" />

      {/* -------- Onboarding -------- */}
      <section id="onboarding" className="docs-section">
        <div className="docs-section-badge">Core Systems</div>
        <h2>Onboarding Flow</h2>
        <p>
          The product begins with an onboarding flow that establishes identity, intent, and user
          direction. The onboarding is a multi-step structure with branded screens, progress
          indicators, input fields, and goal-selection buttons.
        </p>
        <p>
          The app first understands what the user wants to improve before shaping the rest of the
          experience around those objectives. This onboarding is not only visual &mdash; it is
          foundational to how the app positions itself as a <strong>guided system</strong> rather
          than an open-ended feed product.
        </p>
        <h3>Onboarding Steps</h3>
        <ul>
          <li>Identity setup &mdash; username, display name, avatar selection</li>
          <li>Goal selection &mdash; choose improvement categories and focus areas</li>
          <li>Baseline assessment &mdash; current activity levels and commitment intent</li>
          <li>Progress indicator &mdash; visual stepper showing onboarding completion</li>
          <li>Personalization lock-in &mdash; the app tailors its task generation based on these inputs</li>
        </ul>
        <InfoCallout>
          Onboarding directly shapes the AI task generation, daily quest system, and content
          recommendations for each user.
        </InfoCallout>
      </section>

      {/* -------- AI Task Engine -------- */}
      <section id="ai-task-engine" className="docs-section">
        <h2>AI Task Engine</h2>
        <p>
          At the center of the platform is the self-improvement engine. SOFTMAXX includes AI task
          generation and a task-management layer that loads personalized tasks with structured
          attributes.
        </p>
        <h3>Task Attributes</h3>
        <div className="docs-table-wrap">
          <table className="docs-table">
            <thead>
              <tr>
                <th>Field</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr><td><code>title</code></td><td>The name of the task displayed to the user</td></tr>
              <tr><td><code>description</code></td><td>Detailed instructions and context</td></tr>
              <tr><td><code>category</code></td><td>Improvement domain (fitness, mindset, nutrition, etc.)</td></tr>
              <tr><td><code>stepTarget</code></td><td>Measurable goal count attached to the task</td></tr>
              <tr><td><code>duration</code></td><td>Expected time to complete the task</td></tr>
              <tr><td><code>difficulty</code></td><td>Task difficulty rating</td></tr>
              <tr><td><code>xpReward</code></td><td>Experience points earned on completion</td></tr>
              <tr><td><code>status</code></td><td>Current state: pending, active, completed</td></tr>
              <tr><td><code>createdAt</code></td><td>Timestamp of task generation</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Tasks are not generic reminders. They are <strong>structured units of progress</strong>{' '}
          with measurable attributes and reward logic attached to them. This is one of the clearest
          indicators that the app is designed around guided improvement and not passive content
          consumption.
        </p>
      </section>

      {/* -------- AI Insights -------- */}
      <section id="ai-insights" className="docs-section">
        <h2>AI Daily Insights</h2>
        <p>
          The app includes an AI insight layer. The interface contains an &ldquo;AI Daily
          Insight&rdquo; area that invites the user to generate personalized tasks based on their
          current issue.
        </p>
        <p>
          The AI component functions as a <strong>motivation and task-generation system</strong>{' '}
          that turns user problems into actionable daily missions. The product adapts its guidance to
          the user&rsquo;s current state rather than offering a static checklist.
        </p>
        <h3>How It Works</h3>
        <ol>
          <li>User describes their current challenge or focus area</li>
          <li>AI analyzes the input against the user&rsquo;s profile and history</li>
          <li>Personalized tasks are generated with appropriate difficulty and XP values</li>
          <li>Tasks are added to the user&rsquo;s daily queue</li>
          <li>Completion feeds back into the progression system</li>
        </ol>
      </section>

      {/* -------- Progression -------- */}
      <section id="progression" className="docs-section">
        <h2>Progression &amp; XP</h2>
        <p>
          Progression inside SOFTMAXX is deeply gamified. The platform includes a full XP system,
          streak tracking, progress bars, task completion metrics, and rank synchronization to the
          user profile.
        </p>
        <p>
          Users are not only checking off tasks. They are moving through an{' '}
          <strong>advancement loop</strong> in which consistent action increases XP, improves
          streaks, and changes rank identity. The system syncs these values to the backend profile,
          meaning progression is persistent and visible across the platform.
        </p>
        <h3>Progression Mechanics</h3>
        <ul>
          <li><strong>XP Accumulation</strong> &mdash; every completed task awards experience points based on difficulty and category</li>
          <li><strong>Streak Tracking</strong> &mdash; consecutive days of activity build streak multipliers and unlock bonuses</li>
          <li><strong>Progress Bars</strong> &mdash; visual indicators show proximity to next rank or milestone</li>
          <li><strong>Task Completion Metrics</strong> &mdash; lifetime stats on tasks completed, categories mastered, and consistency</li>
          <li><strong>Profile Sync</strong> &mdash; XP, rank, and streak values are synced to the user&rsquo;s public profile in real time</li>
        </ul>
        <NoteCallout>
          This makes the product feel closer to a progression-based game or status system than a
          normal planner.
        </NoteCallout>
      </section>

      {/* -------- Rank System -------- */}
      <section id="rank-system" className="docs-section">
        <h2>Rank Identity System</h2>
        <p>
          Rank identity is a major part of the product. The system references rank names, leaderboard
          rendering, streak-based labels, and profile rank display. There is also evidence of rank
          tiers and competitive sorting by XP.
        </p>
        <p>
          Users are meant to build not just habits, but a <strong>visible reputation</strong> inside
          the product. Rank is both a progress marker and a public identity signal.
        </p>
        <h3>Rank Features</h3>
        <ul>
          <li>Named rank tiers that evolve as XP accumulates</li>
          <li>Rank displayed on profile, leaderboard, and social posts</li>
          <li>Streak-based labels that add context to rank identity</li>
          <li>Competitive sorting by XP on the leaderboard</li>
          <li>Rank progression as a core motivational driver</li>
        </ul>
      </section>

      {/* -------- Daily Quests -------- */}
      <section id="daily-quests" className="docs-section">
        <h2>Daily Quest System</h2>
        <p>
          The product includes daily quest logic and time-sensitive engagement systems. The
          notification code shows specific timed reminders throughout the day, reinforcing
          consistency and urgency.
        </p>
        <h3>Daily Engagement Cycle</h3>
        <div className="docs-table-wrap">
          <table className="docs-table">
            <thead>
              <tr>
                <th>Time Window</th>
                <th>Notification Type</th>
                <th>Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Morning</td><td>Quest Reminder</td><td>Start the day with your assigned tasks</td></tr>
              <tr><td>Midday</td><td>Lag Warning</td><td>Alert if task progress has stalled</td></tr>
              <tr><td>Evening</td><td>Routine Window</td><td>Complete remaining daily routines</td></tr>
              <tr><td>End of Day</td><td>Reward Claim</td><td>Collect XP and close the day&rsquo;s cycle</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          The app is not passive. It actively pulls the user back into the discipline loop
          throughout the day. These reminders are{' '}
          <strong>behavior-shaping mechanics</strong> designed to increase completion rates and
          reduce drop-off.
        </p>
      </section>

      <hr className="docs-divider" />

      {/* -------- Step Tracking -------- */}
      <section id="step-tracking" className="docs-section">
        <div className="docs-section-badge">Activity Tracking</div>
        <h2>Step Tracking</h2>
        <p>
          SOFTMAXX connects digital progress to real-life movement through a step-tracking system.
          The platform supports both manual step entry and native step integration, including Health
          Connect support, permission handling, step count state, refresh flows, and fallback
          messaging.
        </p>
        <p>
          The app is not only about self-reported effort. It measures{' '}
          <strong>real-world action</strong> directly from the phone. This allows the platform to
          tie discipline and improvement claims to actual physical behavior.
        </p>
        <h3>Tracking Modes</h3>
        <ul>
          <li><strong>Manual Entry</strong> &mdash; users can input step counts directly via quick-add or manual entry fields</li>
          <li><strong>Native Integration</strong> &mdash; automatic step sync from device sensors and health APIs</li>
          <li><strong>Quick Add</strong> &mdash; fast step entry for lower-friction logging</li>
          <li><strong>Refresh Flow</strong> &mdash; pull-to-refresh or manual refresh to sync latest step data</li>
        </ul>
      </section>

      {/* -------- Health Connect -------- */}
      <section id="health-connect" className="docs-section">
        <h2>Health Connect Integration</h2>
        <p>
          The step system is designed with flexibility. Users can stay in manual mode, connect native
          step data via Health Connect, refresh step counts, and still use quick-add or manual entry
          if needed.
        </p>
        <p>
          This reduces barriers for new users while still allowing more serious users to sync real
          activity data. The integration handles:
        </p>
        <ul>
          <li>Health Connect permission requests and status handling</li>
          <li>Step count state management and refresh flows</li>
          <li>Fallback messaging when native data is unavailable</li>
          <li>Graceful degradation to manual mode</li>
        </ul>
        <InfoCallout>
          Health Connect integration is available on supported Android devices. iOS users can
          connect via HealthKit when available.
        </InfoCallout>
      </section>

      <hr className="docs-divider" />

      {/* -------- Feed & Posts -------- */}
      <section id="feed" className="docs-section">
        <div className="docs-section-badge">Social Platform</div>
        <h2>Feed &amp; Posts</h2>
        <p>
          SOFTMAXX includes a feed with post cards, compose flows, media support, likes, comments,
          shares, views, and reply structures. The styling and interaction model function as a
          micro-social platform, with actions placed directly under posts and comments organized
          into threaded interactions.
        </p>
        <p>
          Users are not improving in isolation. They are doing it in a{' '}
          <strong>social environment</strong> where self-improvement can be made visible, reacted
          to, and discussed by others.
        </p>
        <h3>Post Features</h3>
        <ul>
          <li>Rich post cards with author info, timestamp, and content</li>
          <li>Image and media attachments</li>
          <li>Like, comment, share, and view counts</li>
          <li>Threaded reply structures</li>
          <li>Progress summary cards that showcase XP, streak, and task completion</li>
        </ul>
      </section>

      {/* -------- Content Creation -------- */}
      <section id="content-creation" className="docs-section">
        <h2>Content Creation</h2>
        <p>
          Posting is not limited to plain text. The compose system includes image previews, image
          removal, post submission controls, character counting, and mobile-first composer behavior.
        </p>
        <p>
          There is also a &ldquo;Share Your Progress&rdquo; card that creates a social summary of
          the user&rsquo;s XP, streak, and completed tasks. This strongly suggests that{' '}
          <strong>sharing progress is a core loop</strong>, not an extra feature.
        </p>
        <h3>Compose Features</h3>
        <ul>
          <li>Text composition with character limit indicator</li>
          <li>Image attachment with preview and removal</li>
          <li>Post submission controls (submit, cancel, draft)</li>
          <li>Mobile-first responsive composer</li>
          <li>Progress card generation for social sharing</li>
        </ul>
      </section>

      {/* -------- Comments -------- */}
      <section id="comments" className="docs-section">
        <h2>Comments &amp; Discussion</h2>
        <p>
          The platform includes dedicated comment cards, nested child comments, reply structures, and
          per-comment action areas. Posts can become discussion threads which supports
          accountability, feedback, and community participation.
        </p>
        <p>
          The product is not just a leaderboard plus feed. It is a{' '}
          <strong>full interaction surface</strong> around progress.
        </p>
        <ul>
          <li>Top-level comments on any post</li>
          <li>Nested reply threads for deeper discussion</li>
          <li>Per-comment actions (like, reply, report)</li>
          <li>Author badges showing rank and streak</li>
        </ul>
      </section>

      {/* -------- Sharing -------- */}
      <section id="sharing" className="docs-section">
        <h2>Share &amp; Distribution</h2>
        <p>
          The share layer extends beyond the public feed into private distribution. Content can
          circulate both publicly and privately, allowing progress posts, updates, or motivational
          content to spread through social relationships inside the app.
        </p>
        <h3>Share Channels</h3>
        <ul>
          <li><strong>Share to DM</strong> &mdash; overlay for sending posts directly to other users</li>
          <li><strong>Direct Message Share List</strong> &mdash; quick-select recent DM contacts</li>
          <li><strong>Copy Link</strong> &mdash; generate a shareable URL for any post</li>
          <li><strong>System Share</strong> &mdash; native OS share sheet for external distribution</li>
        </ul>
      </section>

      {/* -------- Direct Messaging -------- */}
      <section id="direct-messaging" className="docs-section">
        <h2>Direct Messaging</h2>
        <p>
          Direct messaging is a major product pillar. The system includes conversation restoration,
          DM thread state persistence, message sending, attachments, image and video rendering, file
          cards, edit/copy/delete message actions, and a thread-specific composer.
        </p>
        <p>
          SOFTMAXX is not only a public performance layer. It also supports{' '}
          <strong>private relationships</strong> within the ecosystem for accountability, private
          check-ins, and one-to-one communication.
        </p>
        <h3>Messaging Features</h3>
        <ul>
          <li>Persistent conversation threads with state restoration</li>
          <li>Text, image, video, and file message types</li>
          <li>Edit, copy, and delete message actions</li>
          <li>Thread-specific composer with attachment support</li>
          <li>Conversation list with recent activity sorting</li>
          <li>Read receipts and typing indicators</li>
        </ul>
      </section>

      <hr className="docs-divider" />

      {/* -------- Profiles -------- */}
      <section id="profiles" className="docs-section">
        <div className="docs-section-badge">User System</div>
        <h2>Profiles &amp; Identity</h2>
        <p>
          User identity is treated as a core feature. Profiles include username, display name, bio,
          avatar, banner, rank, XP, streak, and follower/following counts. There is profile editing
          support, media preview for avatar and banner uploads, and view-profile flows.
        </p>
        <p>
          Each user has a persistent public identity that functions like a{' '}
          <strong>personal brand page</strong> inside the app. In a discipline product, this matters
          because identity reinforces behavior. Users are not completing tasks anonymously &mdash;
          they are building a visible persona associated with progress and consistency.
        </p>
        <h3>Profile Fields</h3>
        <div className="docs-table-wrap">
          <table className="docs-table">
            <thead>
              <tr>
                <th>Field</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr><td><code>username</code></td><td>Unique handle for the user</td></tr>
              <tr><td><code>displayName</code></td><td>Public-facing name</td></tr>
              <tr><td><code>bio</code></td><td>Short profile description</td></tr>
              <tr><td><code>avatar</code></td><td>Profile picture with upload and preview</td></tr>
              <tr><td><code>banner</code></td><td>Profile header image</td></tr>
              <tr><td><code>rank</code></td><td>Current rank tier and name</td></tr>
              <tr><td><code>xp</code></td><td>Total experience points earned</td></tr>
              <tr><td><code>streak</code></td><td>Current consecutive-day activity streak</td></tr>
              <tr><td><code>followers / following</code></td><td>Social graph counts</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* -------- Search -------- */}
      <section id="search" className="docs-section">
        <h2>Search &amp; Discovery</h2>
        <p>
          Search is built around people discovery. The search logic is specifically designed to search
          usernames and display names, return profile cards, and offer direct actions such as
          visiting a profile or messaging someone.
        </p>
        <p>
          The product supports <strong>community discovery and relationship formation</strong>, not
          just content browsing. Users can find other &ldquo;hunters,&rdquo; explore their profiles,
          and start interacting directly.
        </p>
        <h3>Search Capabilities</h3>
        <ul>
          <li>Username and display name search</li>
          <li>Profile card results with avatar, rank, and streak</li>
          <li>Direct action buttons (view profile, send message)</li>
          <li>Real-time search suggestions</li>
        </ul>
      </section>

      {/* -------- Notifications -------- */}
      <section id="notifications" className="docs-section">
        <h2>Notifications</h2>
        <p>
          Notifications play a significant role in retention and interaction. There are two broad
          forms: <strong>local behavior reminders</strong> and{' '}
          <strong>social notifications</strong>.
        </p>
        <h3>Notification Types</h3>
        <div className="docs-table-wrap">
          <table className="docs-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Type</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Behavior</td><td>Morning Quest</td><td>Start your daily quest sequence</td></tr>
              <tr><td>Behavior</td><td>Midday Lag</td><td>Alert when task progress has stalled</td></tr>
              <tr><td>Behavior</td><td>Evening Routine</td><td>Complete remaining daily tasks</td></tr>
              <tr><td>Behavior</td><td>Reward Claim</td><td>Claim end-of-day XP rewards</td></tr>
              <tr><td>Social</td><td>Like</td><td>Someone liked your post</td></tr>
              <tr><td>Social</td><td>Comment</td><td>Someone replied to your post</td></tr>
              <tr><td>Social</td><td>Follow</td><td>Someone started following you</td></tr>
              <tr><td>Social</td><td>Mention</td><td>You were mentioned in a post</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          This creates a <strong>dual engagement model</strong> where the user returns both for
          self-improvement and for social feedback &mdash; a strong retention mechanic.
        </p>
      </section>

      <hr className="docs-divider" />

      {/* -------- Leaderboards -------- */}
      <section id="leaderboards" className="docs-section">
        <div className="docs-section-badge">Competition</div>
        <h2>Leaderboards</h2>
        <p>
          Competition is a core part of the product. Users are ranked by XP, shown with position
          markers, avatars, streak labels, and rank names. The system includes scope switching between
          global, state, and regional views with fallbacks when local data is unavailable.
        </p>
        <p>
          The competitive model is not just broad and anonymous. It can become{' '}
          <strong>locally relevant</strong>, which increases emotional investment and rivalry.
        </p>
        <h3>Leaderboard Scopes</h3>
        <ul>
          <li><strong>Global</strong> &mdash; all users ranked by total XP</li>
          <li><strong>State</strong> &mdash; regional ranking within the user&rsquo;s state</li>
          <li><strong>Local</strong> &mdash; city or area-level competition</li>
        </ul>
        <h3>Leaderboard Display</h3>
        <ul>
          <li>Position rank number with top-3 special styling</li>
          <li>User avatar, display name, and username</li>
          <li>XP total and current streak</li>
          <li>Rank tier badge</li>
          <li>Scope switcher tabs (Global / State / Local)</li>
        </ul>
      </section>

      <hr className="docs-divider" />

      {/* -------- Session Persistence -------- */}
      <section id="session-persistence" className="docs-section">
        <div className="docs-section-badge">Platform</div>
        <h2>Session Persistence</h2>
        <p>
          The app includes session restoration and local state persistence. UI session data, current
          tab state, DM thread restoration, and notification read timestamps are stored locally.
        </p>
        <p>
          The experience is designed to feel <strong>continuous</strong>. Users can leave and return
          without losing context, which is especially important in social and progress-tracking
          products where interruption is common.
        </p>
        <h3>Persisted State</h3>
        <ul>
          <li>Current tab and navigation position</li>
          <li>DM thread scroll position and draft messages</li>
          <li>Notification read timestamps</li>
          <li>Onboarding progress</li>
          <li>Local step count cache</li>
        </ul>
      </section>

      {/* -------- Design Philosophy -------- */}
      <section id="design-philosophy" className="docs-section">
        <h2>Design Philosophy</h2>
        <p>
          Design is a product feature, not just decoration. The interface uses dark obsidian tones,
          molten-gold accents, premium typography, glass panels, and high-contrast rank and progress
          styling.
        </p>
        <p>
          The branding language and UI structure suggest a deliberate positioning around{' '}
          <strong>intensity, discipline, status, and performance</strong>. It does not read like a
          casual wellness app. It reads like a premium, serious, identity-driven improvement
          environment.
        </p>
        <h3>Design Principles</h3>
        <ul>
          <li><strong>Dark Obsidian Foundation</strong> &mdash; deep, almost black backgrounds that communicate seriousness</li>
          <li><strong>Molten-Gold Accents</strong> &mdash; warm gold gradients that signal progression, value, and status</li>
          <li><strong>Premium Typography</strong> &mdash; Bebas Neue for display, DM Mono for data, creating a high-end identity</li>
          <li><strong>Glassmorphism</strong> &mdash; blurred glass panels for depth and modern luxury</li>
          <li><strong>High-Contrast Hierarchy</strong> &mdash; clear visual ranking between primary actions and supporting content</li>
        </ul>
        <NoteCallout>
          The aesthetic targets users who respond to ambition, progression, and visible status rather
          than soft encouragement.
        </NoteCallout>
      </section>

      {/* -------- Supported Platforms -------- */}
      <section id="supported-platforms" className="docs-section">
        <h2>Supported Platforms</h2>
        <div className="docs-table-wrap">
          <table className="docs-table">
            <thead>
              <tr>
                <th>Platform</th>
                <th>Status</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Web</td><td><span className="docs-status docs-status--live">Live</span></td><td>softmaxx.org &mdash; full web experience</td></tr>
              <tr><td>Android</td><td><span className="docs-status docs-status--soon">Coming Soon</span></td><td>Play Store &mdash; includes Health Connect</td></tr>
              <tr><td>iOS</td><td><span className="docs-status docs-status--soon">Coming Soon</span></td><td>App Store &mdash; includes HealthKit</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* -------- Footer -------- */}
      <footer className="docs-content-footer">
        <div className="docs-content-footer-line" />
        <div className="docs-content-footer-row">
          <span>Built by SOFTMAXX</span>
          <span>softmaxx.org</span>
        </div>
      </footer>
    </div>
  )
}

function DocsPage() {
  const [activeId, setActiveId] = useState('introduction')
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const mainRef = useRef(null)

  useEffect(() => {
    const main = mainRef.current
    if (!main) return

    const handleScroll = () => {
      const sections = ALL_ITEMS.map((item) => ({
        id: item.id,
        el: document.getElementById(item.id),
      })).filter((s) => s.el)

      let current = sections[0]?.id ?? 'introduction'

      for (const section of sections) {
        const rect = section.el.getBoundingClientRect()
        if (rect.top <= 120) {
          current = section.id
        }
      }

      setActiveId(current)
    }

    main.addEventListener('scroll', handleScroll, { passive: true })
    return () => main.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    function handleKey(e) {
      if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        const active = document.activeElement
        if (active?.tagName === 'INPUT' || active?.tagName === 'TEXTAREA') return
        e.preventDefault()
        document.querySelector('.docs-sidebar-search-input')?.focus()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  function handleNavigate(id) {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveId(id)
      setSidebarOpen(false)
    }
  }

  return (
    <div className="docs-page">
      <header className="docs-topbar">
        <button
          type="button"
          className="docs-topbar-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle sidebar"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <Link to="/" className="docs-topbar-brand">
          <span className="docs-topbar-logo">S</span>
          <span>SOFTMAXX</span>
        </Link>
        <div className="docs-topbar-actions">
          <BookIcon />
          <span>Documentation</span>
        </div>
      </header>

      {sidebarOpen && (
        <div
          className="docs-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          role="presentation"
        />
      )}

      <div className={`docs-sidebar-wrap${sidebarOpen ? ' docs-sidebar-wrap--open' : ''}`}>
        <DocsSidebar
          activeId={activeId}
          onNavigate={handleNavigate}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      <main className="docs-main" ref={mainRef}>
        <DocsContent />
      </main>
    </div>
  )
}

export default DocsPage
