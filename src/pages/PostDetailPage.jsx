import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchPostById, formatPostTimestamp } from '../lib/posts.js'
import { buildOfficialPostUrl, shareOfficialPost } from '../lib/share.js'
import { hasSupabaseConfig } from '../lib/supabase.js'

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

  async function handleShare() {
    const result = await shareOfficialPost({
      username: post?.username || username,
      postId: post?.id || postId,
      title: post?.username ? `${post.username}'s post on SOFTMAXX` : 'SOFTMAXX post',
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
  const displayContent = post?.content || 'This post does not have any text yet.'
  const displayTimestamp = formatPostTimestamp(post?.timestamp)

  return (
    <main className="page-shell page-shell--post">
      <section className="post-layout">
        <Link className="back-link" to="/">
          Back to SOFTMAXX
        </Link>

        <article className="post-card" aria-labelledby="post-author">
          <header className="post-header">
            <div>
              <p className="post-kicker">Shared post</p>
              <h1 className="post-username" id="post-author">
                @{displayUsername}
              </h1>
            </div>
            <time className="post-time" dateTime={post?.timestamp ?? undefined}>
              {displayTimestamp}
            </time>
          </header>

          <p className={`post-content${post?.content ? '' : ' post-content--empty'}`}>
            {displayContent}
          </p>

          {post?.imageUrl ? (
            <img
              className="post-image"
              src={post.imageUrl}
              alt={`Post by ${displayUsername}`}
              loading="lazy"
            />
          ) : null}

          <footer className="post-actions">
            <button className="share-btn" type="button" onClick={handleShare}>
              Share Post
            </button>
            {shareUrl ? (
              <a className="share-link" href={shareUrl}>
                {shareUrl}
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
