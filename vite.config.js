import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

function createJsonResponseBridge(nodeResponse) {
  return {
    setHeader(name, value) {
      nodeResponse.setHeader(name, value)
    },
    status(statusCode) {
      nodeResponse.statusCode = statusCode

      return {
        json(payload) {
          if (!nodeResponse.getHeader('Content-Type')) {
            nodeResponse.setHeader('Content-Type', 'application/json; charset=utf-8')
          }

          nodeResponse.end(JSON.stringify(payload))
        },
      }
    },
  }
}

async function readRequestBody(nodeRequest) {
  const chunks = []

  for await (const chunk of nodeRequest) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }

  if (!chunks.length) {
    return ''
  }

  return Buffer.concat(chunks).toString('utf8')
}

function devWaitlistApiPlugin() {
  return {
    name: 'softmaxx-dev-waitlist-api',
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        if (request.url !== '/api/waitlist') {
          next()
          return
        }

        if (request.method !== 'POST') {
          const waitlistModule = await import('./api/waitlist.js')
          await waitlistModule.default(
            {
              method: request.method,
              body: '',
            },
            createJsonResponseBridge(response),
          )
          return
        }

        try {
          const body = await readRequestBody(request)
          const waitlistModule = await import('./api/waitlist.js')

          await waitlistModule.default(
            {
              method: request.method,
              body,
            },
            createJsonResponseBridge(response),
          )
        } catch (error) {
          response.statusCode = 500
          response.setHeader('Content-Type', 'application/json; charset=utf-8')
          response.end(
            JSON.stringify({
              error: error instanceof Error ? error.message : 'Local waitlist request failed.',
            }),
          )
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  Object.assign(process.env, env)

  return {
    plugins: [react(), devWaitlistApiPlugin()],
  }
})
