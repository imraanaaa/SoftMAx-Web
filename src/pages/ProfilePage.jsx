import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CommentIcon, GoldBadgeIcon, HeartIcon, RankIcon, ShareIcon } from '../components/FeedIcons.jsx'
import {
  fetchPostsByProfileUsername,
  formatRelativePostTimestamp,
} from '../lib/posts.js'
import {
  buildOfficialPostPath,
  buildOfficialPostUrl,
  buildOfficialProfileUrl,
  formatOfficialPostUrl,
  shareOfficialPost,
} from '../lib/share.js'
import { hasSupabaseConfig } from '../lib/supabase.js'

function isOfficialAccount(account) {
  return String(account?.username ?? '').trim().toLowerCase() === 'softmaxx'
}

function ProfileAvatar({ avatarUrl, initials, alt }) {
  return (
    <div className="profile-avatar profile-avatar--hero">
      {avatarUrl ? <img src={avatarUrl} alt={alt} /> : <span>{initials || 'S'}</span>}
    </div>
  )
}

function GoldBadge({ title = 'Official SOFTMAXX account' }) {
  return (
    <span className="gold-badge" aria-label={title} title={title}>
      <GoldBadgeIcon className="gold-badge-icon" />
    </span>
  )
}

function PageMessage({ title, message }) {
  return (
    <main className="community-shell">
      <section className="community-frame community-frame--profile">
        <div className="post-layout post-layout--profile">
          <Link className="back-link" to="/posts">
            Back to Community
          </Link>
          <div className="community-card empty-state-card">
            <p className="empty-state-title">{title}</p>
            <p className="empty-state-copy">{message}</p>
          </div>
        </div>
      </section>
    </main>
  )
}

function ProfilePostCard({ post, onShare, official }) {
  const postPath = buildOfficialPostPath(post.username, post.id) || '/posts'
  const postUrl = buildOfficialPostUrl(post.username, post.id)
  const postUrlLabel = formatOfficialPostUrl(postUrl)

  return (
    <article className={`community-card post-feed-card${official ? ' post-feed-card--official' : ''}`}>
      <header className="post-feed-header">
        <div className="profile-avatar">
          {post.avatarUrl ? (
            <img src={post.avatarUrl} alt={post.displayName || post.username || 'SOFTMAXX user'} />
          ) : (
            <span>{post.initials || 'S'}</span>
          )}
        </div>
        <div className="post-feed-meta">
          <div className="post-feed-title-row">
            <h2 className="post-feed-display-name">{post.displayName || 'Unknown user'}</h2>
            {official ? (
              <GoldBadge />
            ) : post.isVerified ? (
              <span className="verified-dot" aria-label="Verified" />
            ) : null}
          </div>
          <p className="post-feed-handle">
            @{post.username || 'unknown'} <span className="feed-meta-separator">/</span>{' '}
            {formatRelativePostTimestamp(post.timestamp)}
          </p>
        </div>
      </header>

      {post.content ? <p className="post-feed-content">{post.content}</p> : null}

      {post.imageUrl ? (
        <img
          className="post-feed-image"
          src={post.imageUrl}
          alt={`Post by ${post.displayName || post.username || 'SOFTMAXX user'}`}
          loading="lazy"
        />
      ) : null}

      <footer className="post-feed-footer">
        <div className="post-stats-row">
          <div className="post-stat">
            <CommentIcon className="feed-icon" />
            <span>{post.commentsCount}</span>
          </div>
          <div className="post-stat">
            <HeartIcon className="feed-icon" />
            <span>{post.likesCount}</span>
          </div>
          <Link className="post-stat post-stat--link" to={postPath}>
            <RankIcon className="feed-icon" />
            <span>Open</span>
          </Link>
          <button className="post-stat post-stat--button" type="button" onClick={() => onShare(post)}>
            <ShareIcon className="feed-icon" />
            <span>Share</span>
          </button>
        </div>

        {postUrl ? (
          <a className="post-link-label" href={postUrl}>
            {postUrlLabel}
          </a>
        ) : (
          <p className="post-link-label post-link-label--muted">Share link unavailable</p>
        )}
      </footer>
    </article>
  )
}

function ProfilePage() {
  const { username } = useParams()
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [shareMessage, setShareMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadProfile() {
      if (!username) {
        if (isMounted) {
          setErrorMessage('This profile link is incomplete.')
          setIsLoading(false)
        }

        return
      }

      if (!hasSupabaseConfig) {
        if (isMounted) {
          setErrorMessage('Supabase configuration is missing for profiles.')
          setIsLoading(false)
        }

        return
      }

      setIsLoading(true)
      setErrorMessage('')

      const result = await fetchPostsByProfileUsername(username)

      if (!isMounted) {
        return
      }

      if (result.profile) {
        setProfile(result.profile)
      }

      if (result.error && !result.profile) {
        setProfile(null)
        setPosts([])
        setErrorMessage('This profile could not be found.')
        setIsLoading(false)
        return
      }

      if (result.error && result.profile) {
        setPosts([])
        setErrorMessage('We found this profile, but we could not load its posts right now.')
        setIsLoading(false)
        return
      }

      setPosts(result.data ?? [])
      setIsLoading(false)
    }

    loadProfile()

    return () => {
      isMounted = false
    }
  }, [username])

  const displayUsername = profile?.username || username || 'unknown'
  const displayName = profile?.displayName || displayUsername
  const isOfficial = isOfficialAccount(profile)
  const profileUrl = useMemo(
    () => buildOfficialProfileUrl(profile?.username || username),
    [profile?.username, username],
  )

  async function handleShare(post) {
    const result = await shareOfficialPost({
      username: post?.username,
      postId: post?.id,
      title: post?.displayName ? `${post.displayName} on SOFTMAXX` : 'SOFTMAXX post',
      text: post?.content || 'View this SOFTMAXX post.',
    })

    setShareMessage(result.message)
  }

  if (!username) {
    return (
      <PageMessage
        title="Profile unavailable"
        message="This link is missing the username."
      />
    )
  }

  if (isLoading) {
    return <PageMessage title="Loading profile" message="Fetching the latest profile details." />
  }

  if (!profile) {
    return <PageMessage title="Profile unavailable" message={errorMessage || 'This profile could not be found.'} />
  }

  return (
    <main className="community-shell">
      <section className="community-frame community-frame--profile">
        <div className="post-layout post-layout--profile">
          <Link className="back-link" to="/posts">
            Back to Community
          </Link>

          <article className={`community-card profile-hero-card${isOfficial ? ' profile-hero-card--official' : ''}`}>
            <div className="profile-hero-banner">
              <p className="profile-hero-kicker">Hunter Profile</p>
            </div>

            <div className="profile-hero-main">
              <div className="profile-hero-avatar-wrap">
                <ProfileAvatar
                  avatarUrl={profile.avatarUrl}
                  initials={profile.initials}
                  alt={displayName}
                />
              </div>

              <div className="profile-hero-copy">
                <div className="profile-hero-name-row">
                  <h1 className="profile-hero-name">{displayName}</h1>
                  {isOfficial ? (
                    <GoldBadge />
                  ) : profile.isVerified ? (
                    <span className="verified-dot" aria-label="Verified" />
                  ) : null}
                </div>

                <p className="profile-hero-handle">@{displayUsername}</p>

                <p className="profile-hero-bio">
                  {isOfficial
                    ? 'Official SOFTMAXX account.'
                    : 'Community member profile on SOFTMAXX.'}
                </p>

                <div className="profile-hero-meta">
                  <span>{posts.length} {posts.length === 1 ? 'post' : 'posts'}</span>
                  <span>{profile.rankName || 'SOFTMAXX member'}</span>
                </div>

                {profileUrl ? (
                  <a className="profile-hero-url" href={profileUrl}>
                    {profileUrl.replace(/^https?:\/\//, '')}
                  </a>
                ) : null}
              </div>
            </div>
          </article>

          {shareMessage ? <p className="feed-info-message">{shareMessage}</p> : null}
          {errorMessage ? <p className="feed-info-message">{errorMessage}</p> : null}

          <section className="community-feed profile-feed">
            {posts.length === 0 ? (
              <div className="community-card empty-state-card">
                <p className="empty-state-title">No posts yet</p>
                <p className="empty-state-copy">This profile has not published anything yet.</p>
              </div>
            ) : (
              posts.map((post, index) => (
                <ProfilePostCard
                  key={post.id ?? `${post.username ?? 'post'}-${index}`}
                  post={post}
                  onShare={handleShare}
                  official={isOfficialAccount(post)}
                />
              ))
            )}
          </section>
        </div>
      </section>
    </main>
  )
}

export default ProfilePage
