import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchPosts, formatPostTimestamp } from '../lib/posts.js'
import { buildOfficialPostUrl, shareOfficialPost } from '../lib/share.js'
import { hasSupabaseConfig } from '../lib/supabase.js'

function PostsPage() {
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [shareMessage, setShareMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadPosts() {
      if (!hasSupabaseConfig) {
        if (isMounted) {
          setErrorMessage('Supabase configuration is missing for posts.')
          setIsLoading(false)
        }

        return
      }

      setIsLoading(true)
      setErrorMessage('')

      const { data, error } = await fetchPosts()

      if (!isMounted) {
        return
      }

      if (error) {
        setPosts([])
        setErrorMessage('We could not load posts right now.')
        setIsLoading(false)
        return
      }

      setPosts(data ?? [])
      setIsLoading(false)
    }

    loadPosts()

    return () => {
      isMounted = false
    }
  }, [])

  async function handleShare(post) {
    const result = await shareOfficialPost({
      username: post?.username,
      postId: post?.id,
      title: post?.username ? `${post.username}'s post on SOFTMAXX` : 'SOFTMAXX post',
      text: post?.content || 'View this SOFTMAXX post.',
    })

    setShareMessage(result.message)
  }

  return (
    <main className="page-shell page-shell--post">
      <section className="post-layout">
        <div className="posts-page-header">
          <div>
            <p className="post-kicker">SOFTMAXX feed</p>
            <h1 className="posts-title">Posts</h1>
            <p className="post-state-copy">
              Every public post currently available from Supabase.
            </p>
          </div>
          <Link className="back-link" to="/">
            Back to SOFTMAXX
          </Link>
        </div>

        {isLoading ? (
          <div className="post-card">
            <p className="post-state-title">Loading posts</p>
            <p className="post-state-copy">Fetching the latest posts from Supabase.</p>
          </div>
        ) : null}

        {!isLoading && errorMessage ? (
          <div className="post-card">
            <p className="post-state-title">Posts unavailable</p>
            <p className="post-state-copy">{errorMessage}</p>
          </div>
        ) : null}

        {!isLoading && !errorMessage && posts.length === 0 ? (
          <div className="post-card">
            <p className="post-state-title">No posts yet</p>
            <p className="post-state-copy">Supabase returned an empty posts list.</p>
          </div>
        ) : null}

        {!isLoading && !errorMessage && posts.length > 0 ? (
          <div className="posts-grid">
            {posts.map((post, index) => {
              const postUrl = buildOfficialPostUrl(post.username, post.id)
              const postLink = postUrl ? `/${post.username}/${post.id}` : '/posts'

              return (
                <article
                  className="post-card post-card--feed"
                  key={post.id ?? postUrl ?? `${post.username ?? 'post'}-${index}`}
                >
                  <header className="post-header">
                    <div>
                      <p className="post-kicker">Post</p>
                      <h2 className="post-username post-username--card">@{post.username || 'unknown'}</h2>
                    </div>
                    <time className="post-time" dateTime={post.timestamp ?? undefined}>
                      {formatPostTimestamp(post.timestamp)}
                    </time>
                  </header>

                  <p className={`post-content${post.content ? '' : ' post-content--empty'}`}>
                    {post.content || 'This post does not have any text yet.'}
                  </p>

                  {post.imageUrl ? (
                    <img
                      className="post-image"
                      src={post.imageUrl}
                      alt={`Post by ${post.username || 'unknown'}`}
                      loading="lazy"
                    />
                  ) : null}

                  <footer className="post-actions">
                    <div className="post-action-row">
                      <Link className="share-btn share-btn--link" to={postLink}>
                        Open Post
                      </Link>
                      <button className="share-btn" type="button" onClick={() => handleShare(post)}>
                        Share
                      </button>
                    </div>
                    {postUrl ? (
                      <a className="share-link" href={postUrl}>
                        {postUrl}
                      </a>
                    ) : (
                      <span className="post-state-copy">Share link unavailable</span>
                    )}
                  </footer>
                </article>
              )
            })}
          </div>
        ) : null}

        {shareMessage ? <p className="share-message share-message--page">{shareMessage}</p> : null}
      </section>
    </main>
  )
}

export default PostsPage
