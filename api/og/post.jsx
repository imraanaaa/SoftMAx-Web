import { ImageResponse } from '@vercel/og'
import { createPostSummary, fetchServerPost } from '../_lib/post-data.js'

export const config = {
  runtime: 'edge',
}

export default async function handler(request) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get('username') ?? ''
  const postId = searchParams.get('postId') ?? ''

  let post = null

  try {
    post = await fetchServerPost(postId, username)
  } catch {
    post = null
  }

  const { title, description } = createPostSummary(post)
  const showImage = Boolean(post?.imageUrl)

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          background: '#080604',
          color: '#f0e8dc',
          position: 'relative',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 20% 20%, rgba(240,208,128,0.10), transparent 40%), radial-gradient(circle at 80% 80%, rgba(201,169,110,0.08), transparent 45%)',
          }}
        />
        <div
          style={{
            position: 'relative',
            display: 'flex',
            width: '100%',
            padding: '48px',
            gap: '32px',
          }}
        >
          <div
            style={{
              flex: showImage ? '0 0 58%' : '1 1 auto',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderRadius: '28px',
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(16,12,10,0.92)',
              padding: '36px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '18px',
                }}
              >
                <div
                  style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '999px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(240,208,128,0.16)',
                    color: '#f0d080',
                    fontSize: '34px',
                    fontWeight: 700,
                  }}
                >
                  {post?.avatarUrl ? (
                    <img
                      src={post.avatarUrl}
                      width="72"
                      height="72"
                      style={{ width: '72px', height: '72px', borderRadius: '999px' }}
                    />
                  ) : (
                    <span>{post?.initials ?? 'S'}</span>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ color: '#f0d080', fontSize: '18px', letterSpacing: '0.22em', textTransform: 'uppercase' }}>
                    Softmaxx Post
                  </div>
                  <div style={{ fontSize: '42px', fontWeight: 700 }}>{post?.displayName ?? 'SOFTMAXX'}</div>
                  <div style={{ color: 'rgba(240,232,220,0.66)', fontSize: '22px' }}>
                    @{post?.username ?? 'softmaxx'}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  fontSize: showImage ? '34px' : '42px',
                  lineHeight: 1.35,
                  color: '#f7f1e8',
                }}
              >
                {description}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '18px',
                color: 'rgba(240,232,220,0.58)',
              }}
            >
              <div>softmaxx.org</div>
              <div>{title}</div>
            </div>
          </div>

          {showImage ? (
            <div
              style={{
                flex: '0 0 42%',
                display: 'flex',
                borderRadius: '28px',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(16,12,10,0.92)',
              }}
            >
              <img
                src={post.imageUrl}
                width="420"
                height="534"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          ) : null}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}
