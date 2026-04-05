import { buildOfficialPostUrl } from '../src/lib/share.js'
import { createPostSummary, escapeHtml, fetchServerPost } from './_lib/post-data.js'

export default async function handler(request, response) {
  const username = String(request.query.username ?? '').trim()
  const postId = String(request.query.postId ?? '').trim()

  let post = null

  try {
    post = await fetchServerPost(postId, username)
  } catch {
    post = null
  }

  const canonicalUrl = buildOfficialPostUrl(post?.username || username, post?.id || postId) || 'https://softmaxx.org'
  const ogImageUrl = postId
    ? `https://softmaxx.org/api/og/post?username=${encodeURIComponent(username)}&postId=${encodeURIComponent(postId)}`
    : 'https://softmaxx.org'
  const { title, description } = createPostSummary(post)

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${escapeHtml(canonicalUrl)}" />
    <meta property="og:site_name" content="SOFTMAXX" />
    <meta property="og:image" content="${escapeHtml(ogImageUrl)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(ogImageUrl)}" />
    <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />
    <style>
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        background: #080604;
        color: #f0e8dc;
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      }
      a {
        color: #f0d080;
      }
      .shell {
        max-width: 42rem;
        padding: 2rem;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <main class="shell">
      <p>Open this post in the SOFTMAXX web app:</p>
      <p><a href="${escapeHtml(canonicalUrl)}">${escapeHtml(canonicalUrl)}</a></p>
    </main>
  </body>
</html>`

  response.setHeader('content-type', 'text/html; charset=utf-8')
  response.status(200).send(html)
}
