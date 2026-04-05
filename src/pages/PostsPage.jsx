import { useAuth, useUser } from '@clerk/clerk-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BellIcon,
  CommentIcon,
  GoldBadgeIcon,
  HeartIcon,
  ImageIcon,
  RankIcon,
  SearchIcon,
  ShareIcon,
} from '../components/FeedIcons.jsx'
import { authPagePath, hasClerk } from '../lib/auth.js'
import {
  createPost,
  fetchPosts,
  fetchProfileById,
  fetchUnreadNotificationsCount,
  formatRelativePostTimestamp,
} from '../lib/posts.js'
import {
  buildOfficialPostPath,
  buildOfficialPostUrl,
  formatOfficialPostUrl,
  shareOfficialPost,
} from '../lib/share.js'
import { createClerkSupabaseClient, hasSupabaseConfig } from '../lib/supabase.js'

const FEATURED_SOFTMAXX_ACCOUNT = {
  username: 'softmaxx',
  displayName: 'SOFTMAXX',
  initials: 'S',
  avatarUrl: '',
  bio: 'Official SOFTMAXX account',
  postId: null,
}

function isOfficialAccount(account) {
  return String(account?.username ?? '').trim().toLowerCase() === 'softmaxx'
}

function ProfileAvatar({ avatarUrl, initials, alt, large = false }) {
  return (
    <div className={`profile-avatar${large ? ' profile-avatar--large' : ''}`}>
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

function createSuggestedAccounts(posts, viewerProfile) {
  const suggestions = [
    {
      ...FEATURED_SOFTMAXX_ACCOUNT,
      isOfficial: true,
    },
  ]
  const seenUsernames = new Set([FEATURED_SOFTMAXX_ACCOUNT.username])
  const viewerUsername = String(viewerProfile?.username ?? '').trim().toLowerCase()

  for (const post of posts) {
    const normalizedUsername = String(post?.username ?? '').trim().toLowerCase()

    if (!normalizedUsername || normalizedUsername === viewerUsername || seenUsernames.has(normalizedUsername)) {
      continue
    }

    suggestions.push({
      username: post.username,
      displayName: post.displayName || post.username,
      initials: post.initials,
      avatarUrl: post.avatarUrl,
      bio: isOfficialAccount(post) ? 'Official SOFTMAXX account' : 'Community account',
      postId: post.id,
      isOfficial: isOfficialAccount(post),
    })

    seenUsernames.add(normalizedUsername)

    if (suggestions.length >= 5) {
      break
    }
  }

  return suggestions
}

function FeedHeaderActions({ isSignedIn, notificationCount, onNotificationsClick, viewerProfile }) {
  if (!hasClerk) {
    return <p className="header-auth-copy">Clerk is not configured in this environment.</p>
  }

  if (!isSignedIn) {
    return (
      <div className="feed-auth-actions">
        <Link className="feed-auth-button" to={authPagePath}>
          Log In
        </Link>
        <Link
          className="feed-auth-button feed-auth-button--primary"
          to={`${authPagePath}?mode=sign-up`}
        >
          Sign Up
        </Link>
      </div>
    )
  }

  return (
    <>
      <button
        className="header-icon-button"
        type="button"
        onClick={onNotificationsClick}
        aria-label="Notifications"
      >
        <BellIcon className="feed-icon" />
        {notificationCount > 0 ? (
          <span className="notification-badge">{notificationCount}</span>
        ) : null}
      </button>
      <Link className="header-profile-link" to={authPagePath} aria-label="Account">
        <ProfileAvatar
          avatarUrl={viewerProfile?.avatarUrl}
          initials={viewerProfile?.initials}
          alt={viewerProfile?.displayName || viewerProfile?.username || 'Account'}
        />
      </Link>
    </>
  )
}

function FeedPostCard({ post, onShare }) {
  const postUrl = buildOfficialPostUrl(post.username, post.id)
  const postUrlLabel = formatOfficialPostUrl(postUrl)
  const postLink = buildOfficialPostPath(post.username, post.id) || '/posts'
  const isOfficial = isOfficialAccount(post)

  return (
    <article className={`community-card post-feed-card${isOfficial ? ' post-feed-card--official' : ''}`}>
      <header className="post-feed-header">
        <ProfileAvatar
          avatarUrl={post.avatarUrl}
          initials={post.initials}
          alt={post.displayName || post.username || 'SOFTMAXX user'}
        />
        <div className="post-feed-meta">
          <div className="post-feed-title-row">
            <h2 className="post-feed-display-name">{post.displayName || 'Unknown user'}</h2>
            {isOfficial ? <GoldBadge /> : post.isVerified ? <span className="verified-dot" aria-label="Verified" /> : null}
          </div>
          <p className="post-feed-handle">
            @{post.username || 'unknown'} <span className="feed-meta-separator">·</span>{' '}
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
          <Link className="post-stat post-stat--link" to={postLink}>
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

function SuggestedAccountRow({ account }) {
  const targetPath =
    account.postId && account.username
      ? buildOfficialPostPath(account.username, account.postId) || '/posts'
      : '/posts'

  return (
    <article className="suggested-account-row">
      <div className="suggested-account-main">
        <ProfileAvatar
          avatarUrl={account.avatarUrl}
          initials={account.initials}
          alt={account.displayName || account.username || 'SOFTMAXX account'}
        />
        <div className="suggested-account-meta">
          <div className="suggested-account-name-row">
            <Link className="suggested-account-name" to={targetPath}>
              {account.displayName || account.username}
            </Link>
            {account.isOfficial ? <GoldBadge /> : null}
          </div>
          <p className="suggested-account-handle">@{account.username}</p>
          {account.bio ? <p className="suggested-account-bio">{account.bio}</p> : null}
        </div>
      </div>
      <Link className="suggested-account-button" to={targetPath}>
        View
      </Link>
    </article>
  )
}

function SuggestedAccountsRail({ posts, viewerProfile }) {
  const suggestedAccounts = useMemo(
    () => createSuggestedAccounts(posts, viewerProfile),
    [posts, viewerProfile],
  )

  return (
    <aside className="community-sidebar">
      <section className="sidebar-card">
        <p className="sidebar-title">Accounts To Follow</p>
        <div className="suggested-account-list">
          {suggestedAccounts.map((account) => (
            <SuggestedAccountRow
              key={`${account.username}-${account.postId ?? 'featured'}`}
              account={account}
            />
          ))}
        </div>
      </section>
    </aside>
  )
}

function PostsPageContent({
  authReady,
  isSignedIn,
  userId,
  viewerProfile,
  notificationCount,
  supabaseClient,
  authUnavailable = false,
}) {
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [shareMessage, setShareMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [draftContent, setDraftContent] = useState('')
  const [draftImageUrl, setDraftImageUrl] = useState('')
  const [showImageField, setShowImageField] = useState(false)
  const [composerMessage, setComposerMessage] = useState('')
  const [notificationMessage, setNotificationMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const filteredPosts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    if (!normalizedQuery) {
      return posts
    }

    return posts.filter((post) => {
      const haystack = `${post.displayName ?? ''} ${post.username ?? ''}`.toLowerCase()
      return haystack.includes(normalizedQuery)
    })
  }, [posts, searchQuery])

  async function handleShare(post) {
    const result = await shareOfficialPost({
      username: post?.username,
      postId: post?.id,
      title: post?.displayName ? `${post.displayName} on SOFTMAXX` : 'SOFTMAXX post',
      text: post?.content || 'View this SOFTMAXX post.',
    })

    setShareMessage(result.message)
  }

  async function handleSubmitPost(event) {
    event.preventDefault()

    if (!isSignedIn) {
      setComposerMessage('Sign up or log in to publish a post.')
      return
    }

    if (!viewerProfile) {
      setComposerMessage('We could not find your profile yet. Open the app and finish profile setup first.')
      return
    }

    setIsSubmitting(true)
    setComposerMessage('')

    const { data, error } = await createPost({
      userId,
      profile: viewerProfile,
      content: draftContent,
      imageUrl: draftImageUrl,
      client: supabaseClient,
    })

    if (error) {
      setComposerMessage(error.message || 'Unable to publish your post right now.')
      setIsSubmitting(false)
      return
    }

    if (data) {
      setPosts((currentPosts) => [data, ...currentPosts])
      setDraftContent('')
      setDraftImageUrl('')
      setShowImageField(false)
      setComposerMessage('Post published.')
    }

    setIsSubmitting(false)
  }

  function handleNotificationsClick() {
    if (!isSignedIn) {
      setNotificationMessage('Sign in to view notifications.')
      return
    }

    setNotificationMessage(
      notificationCount > 0
        ? `You have ${notificationCount} unread notifications in the app.`
        : 'No unread notifications right now.',
    )
  }

  const viewerName = viewerProfile?.displayName || viewerProfile?.username || 'P'
  const composerDisabled = !isSignedIn || !authReady || !supabaseClient || isSubmitting

  return (
    <main className="community-shell">
      <section className="community-frame">
        <div className="community-page-grid">
          <div className="community-main-column">
            <header className="community-header">
              <div>
                <p className="community-title">Community</p>
                <p className="community-subtitle">Public posts from SOFTMAXX</p>
              </div>

              <div className="community-header-actions">
                <FeedHeaderActions
                  isSignedIn={isSignedIn}
                  notificationCount={notificationCount}
                  onNotificationsClick={handleNotificationsClick}
                  viewerProfile={viewerProfile}
                />
              </div>
            </header>

            <section className="community-search-row">
              <label className="community-search" htmlFor="usernameSearch">
                <SearchIcon className="feed-icon" />
                <input
                  id="usernameSearch"
                  type="search"
                  placeholder="Search username"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
              </label>
            </section>

            <section className="community-tabs" aria-label="Feed tabs">
              <button className="community-tab community-tab--active" type="button">
                For You
              </button>
              <button className="community-tab" type="button" disabled>
                Following
              </button>
            </section>

            <section className="community-feed">
              <form className="community-card composer-card" onSubmit={handleSubmitPost}>
                <div className="composer-top">
                  <ProfileAvatar
                    avatarUrl={viewerProfile?.avatarUrl}
                    initials={viewerProfile?.initials || viewerName}
                    alt={viewerName}
                    large
                  />
                  <div className="composer-main">
                    <textarea
                      className="composer-textarea"
                      placeholder="Share your progress, thoughts, wins..."
                      value={draftContent}
                      onChange={(event) => setDraftContent(event.target.value)}
                      disabled={composerDisabled}
                      rows={4}
                    />

                    {showImageField ? (
                      <input
                        className="composer-image-input"
                        type="url"
                        placeholder="Paste image URL"
                        value={draftImageUrl}
                        onChange={(event) => setDraftImageUrl(event.target.value)}
                        disabled={composerDisabled}
                      />
                    ) : null}
                  </div>
                </div>

                <div className="composer-actions">
                  <button
                    className="photo-button"
                    type="button"
                    onClick={() => setShowImageField((value) => !value)}
                    disabled={composerDisabled}
                  >
                    <ImageIcon className="feed-icon" />
                    <span>Photo</span>
                  </button>
                  <button className="post-submit-button" type="submit" disabled={composerDisabled}>
                    {isSubmitting ? 'Posting...' : 'Post'}
                  </button>
                </div>

                {!isSignedIn && hasClerk ? (
                  <div className="composer-auth-row">
                    <Link className="feed-auth-button" to={authPagePath}>
                      Log In
                    </Link>
                    <Link
                      className="feed-auth-button feed-auth-button--primary"
                      to={`${authPagePath}?mode=sign-up`}
                    >
                      Sign Up
                    </Link>
                  </div>
                ) : null}

                {authUnavailable ? (
                  <p className="feed-info-message">
                    Clerk is not configured here yet, so posting is disabled in this environment.
                  </p>
                ) : null}

                {composerMessage ? <p className="feed-info-message">{composerMessage}</p> : null}
              </form>

              {notificationMessage ? <p className="feed-info-message">{notificationMessage}</p> : null}
              {shareMessage ? <p className="feed-info-message">{shareMessage}</p> : null}

              {isLoading ? (
                <div className="community-card empty-state-card">
                  <p className="empty-state-title">Loading posts</p>
                  <p className="empty-state-copy">Fetching the latest posts from Supabase.</p>
                </div>
              ) : null}

              {!isLoading && errorMessage ? (
                <div className="community-card empty-state-card">
                  <p className="empty-state-title">Posts unavailable</p>
                  <p className="empty-state-copy">{errorMessage}</p>
                </div>
              ) : null}

              {!isLoading && !errorMessage && filteredPosts.length === 0 ? (
                <div className="community-card empty-state-card">
                  <p className="empty-state-title">No posts found</p>
                  <p className="empty-state-copy">
                    {searchQuery ? 'Try a different username search.' : 'There are no public posts yet.'}
                  </p>
                </div>
              ) : null}

              {!isLoading && !errorMessage
                ? filteredPosts.map((post, index) => (
                    <FeedPostCard
                      key={post.id ?? `${post.username ?? 'post'}-${index}`}
                      post={post}
                      onShare={handleShare}
                    />
                  ))
                : null}
            </section>
          </div>

          <SuggestedAccountsRail posts={filteredPosts} viewerProfile={viewerProfile} />
        </div>
      </section>
    </main>
  )
}

function ClerkPostsPage() {
  const { isLoaded, isSignedIn, getToken } = useAuth()
  const { user } = useUser()
  const [viewerProfile, setViewerProfile] = useState(null)
  const [notificationCount, setNotificationCount] = useState(0)
  const supabaseClient = useMemo(() => {
    return createClerkSupabaseClient(async () => {
      return (await getToken()) ?? null
    })
  }, [getToken])

  useEffect(() => {
    let isMounted = true

    async function loadViewerState() {
      if (!isLoaded || !isSignedIn || !user?.id) {
        if (isMounted) {
          setViewerProfile(null)
          setNotificationCount(0)
        }

        return
      }

      const [{ data: profile }, { data: unreadCount }] = await Promise.all([
        fetchProfileById(user.id, supabaseClient),
        fetchUnreadNotificationsCount(user.id, supabaseClient),
      ])

      if (!isMounted) {
        return
      }

      setViewerProfile(profile)
      setNotificationCount(unreadCount ?? 0)
    }

    loadViewerState()

    return () => {
      isMounted = false
    }
  }, [isLoaded, isSignedIn, supabaseClient, user?.id])

  return (
    <PostsPageContent
      authReady={isLoaded}
      isSignedIn={Boolean(isSignedIn)}
      userId={user?.id ?? null}
      viewerProfile={viewerProfile}
      notificationCount={notificationCount}
      supabaseClient={supabaseClient}
    />
  )
}

function PostsPage() {
  if (hasClerk) {
    return <ClerkPostsPage />
  }

  return (
    <PostsPageContent
      authReady={true}
      isSignedIn={false}
      userId={null}
      viewerProfile={null}
      notificationCount={0}
      supabaseClient={null}
      authUnavailable
    />
  )
}

export default PostsPage
