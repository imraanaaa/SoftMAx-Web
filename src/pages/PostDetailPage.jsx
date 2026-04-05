import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CommentIcon, GoldBadgeIcon, HeartIcon, ShareIcon } from '../components/FeedIcons.jsx'
import { fetchPostById, formatPostTimestamp } from '../lib/posts.js'
import {
  buildOfficialProfilePath,
  buildOfficialPostUrl,
  formatOfficialPostUrl,
  shareOfficialPost,
} from '../lib/share.js'
import { hasSupabaseConfig } from '../lib/supabase.js'

function isOfficialAccount(account) {
  return String(account?.username ?? '').trim().toLowerCase() === 'softmaxx'
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
    <main className="page-shell page-shell--post">
      <section className="post-layout">
        <Link className="back-link" to="/">
          Back to SOFTMAXX
        </Link>
        <div className="post-card">
          <p className="post-state-title">{title}</p>
          <p className="post-state-copy">{message}</p>
        </div>
      </section>
    </main>
  )
}

function PostDetailPage() {
  const { username, postId } = useParams()
  const [post, setPost] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [shareMessage, setShareMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadPost() {
      if (!username || !postId) {
        if (isMounted) {
          setErrorMessage('This post link is incomplete.')
          setIsLoading(false)
        }

        return
      }

      if (!hasSupabaseConfig) {
        if (isMounted) {
          setErrorMessage('Supabase configuration is missing for post lookups.')
          setIsLoading(false)
        }

        return
      }

      setIsLoading(true)
      setErrorMessage('')

      const { data, error } = await fetchPostById(postId, username)

      if (!isMounted) {
        return
      }

      if (error) {
        setErrorMessage('We could not load this post right now.')
        setPost(null)
        setIsLoading(false)
        return
      }

      if (!data) {
        setErrorMessage('This post could not be found.')
        setPost(null)
        setIsLoading(false)
        return
      }

      setPost(data)
      setIsLoading(false)
    }

    loadPost()

    return () => {
      isMounted = false
    }
  }, [postId, username])

  const shareUrl = useMemo(
    () => buildOfficialPostUrl(post?.username || username, post?.id || postId),
    [post?.id, post?.username, postId, username],
  )
  const shareUrlLabel = formatOfficialPostUrl(shareUrl)

  async function handleShare() {
    const result = await shareOfficialPost({
      username: post?.username || username,
      postId: post?.id || postId,
      title: post?.displayName ? `${post.displayName} on SOFTMAXX` : 'SOFTMAXX post',
      text: post?.content || 'View this SOFTMAXX post.',
    })

    setShareMessage(result.message)
  }

  if (!username || !postId) {
    return (
      <PageMessage
        title="Post unavailable"
        message="This link is missing the username or post ID."
      />
    )
  }

  if (isLoading) {
    return <PageMessage title="Loading post" message="Fetching the latest post details." />
  }

  if (errorMessage) {
    return <PageMessage title="Post unavailable" message={errorMessage} />
  }

  const displayUsername = post?.username || username || 'unknown'
  const displayName = post?.displayName || displayUsername
  const displayContent = post?.content || 'This post does not have any text yet.'
  const displayTimestamp = formatPostTimestamp(post?.timestamp)
  const profilePath = buildOfficialProfilePath(displayUsername) || '/posts'
  const isOfficial = isOfficialAccount(post)

  return (
    <main className="page-shell page-shell--post">
      <section className="post-layout">
        <Link className="back-link" to="/">
          Back to SOFTMAXX
        </Link>

        <article className="community-card post-detail-card" aria-labelledby="post-author">
          <header className="post-header">
            <div className="post-detail-author">
              <Link className="post-author-link" to={profilePath} aria-label={`Open ${displayName} profile`}>
                <div className="profile-avatar profile-avatar--large">
                  {post?.avatarUrl ? (
                    <img src={post.avatarUrl} alt={displayName} />
                  ) : (
                    <span>{post?.initials || displayName.charAt(0).toUpperCase()}</span>
                  )}
                </div>
              </Link>
              <div>
                <p className="post-kicker">Shared post</p>
                <h1 className="post-detail-display-name" id="post-author">
                  <Link className="post-author-link post-author-link--name" to={profilePath}>
                    {displayName}
                  </Link>
                </h1>
                <p className="post-feed-handle">
                  <Link className="post-author-link post-author-link--handle" to={profilePath}>
                    @{displayUsername}
                  </Link>{' '}
                  {isOfficial ? <GoldBadge /> : null}
                </p>
              </div>
            </div>
            <time className="post-time" dateTime={post?.timestamp ?? undefined}>
              {displayTimestamp}
            </time>
          </header>

          <p className={`post-feed-content${post?.content ? '' : ' post-content--empty'}`}>
            {displayContent}
          </p>

          {post?.imageUrl ? (
            <img
              className="post-feed-image"
              src={post.imageUrl}
              alt={`Post by ${displayUsername}`}
              loading="lazy"
            />
          ) : null}

          <footer className="post-actions">
            <div className="post-stats-row">
              <div className="post-stat">
                <CommentIcon className="feed-icon" />
                <span>{post?.commentsCount ?? 0}</span>
              </div>
              <div className="post-stat">
                <HeartIcon className="feed-icon" />
                <span>{post?.likesCount ?? 0}</span>
              </div>
              <button className="post-stat post-stat--button" type="button" onClick={handleShare}>
                <ShareIcon className="feed-icon" />
                <span>Share</span>
              </button>
            </div>
            {shareUrl ? (
              <a className="share-link" href={shareUrl}>
                {shareUrlLabel}
              </a>
            ) : (
              <span className="post-state-copy">Share link unavailable</span>
            )}
            {shareMessage ? <p className="share-message">{shareMessage}</p> : null}
          </footer>
        </article>
      </section>
    </main>
  )
}

export default PostDetailPage
