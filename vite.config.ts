import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import { buildHelpTextFiles } from './src/lib/helpText'
import { LotteryError, draw, enter, memoryStore, poolStatus } from './events/1024/lottery.js'

const textContentType = (path: string) =>
  path.endsWith('.md') ? 'text/markdown; charset=utf-8' : 'text/plain; charset=utf-8'

// Emits the plain-text help center (help/llms.txt plus one .md per article)
// and serves the same paths from the dev server.
const helpText = (): Plugin => ({
  name: 'memoh-help-text',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const path = decodeURIComponent((req.url ?? '').split('?')[0]).replace(/^\//, '')
      const content = buildHelpTextFiles().get(path)
      if (content === undefined) return next()
      res.setHeader('Content-Type', textContentType(path))
      res.end(content)
    })
  },
  generateBundle() {
    for (const [fileName, source] of buildHelpTextFiles()) {
      this.emitFile({ type: 'asset', fileName, source })
    }
  },
})

// Dev-only stand-in for admin.memoh.net/api/events/1024 so the /1024 page can
// be exercised locally. State lives in memory and resets on restart.
// GET /__mock/1024/reset?soldout=1 pre-fills the pool to test the sold-out state;
// ?win=1 makes every draw a winner so the prize card is easy to reach;
// ?now=<ISO date> fakes the clock to test the not-started / ended states.
function event1024Mock(): Plugin {
  let store = memoryStore()
  let forceWin = false
  let now: number | undefined
  return {
    name: 'event-1024-mock',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url ?? '/', 'http://localhost')
        if (!url.pathname.startsWith('/__mock/1024/')) return next()
        const send = (status: number, body: unknown) => {
          res.statusCode = status
          res.setHeader('content-type', 'application/json')
          res.end(JSON.stringify(body))
        }
        const route = url.pathname.slice('/__mock/1024'.length)
        try {
          if (route === '/reset') {
            forceWin = Boolean(url.searchParams.get('win'))
            now = url.searchParams.get('now') ? Date.parse(url.searchParams.get('now')!) : undefined
            store = memoryStore(url.searchParams.get('soldout')
              ? [{ email: 'p@x', prize: 'pro' as const }, ...Array.from({ length: 24 }, (_, i) => ({ email: `g${i}@x`, prize: 'go' as const }))]
              : [])
            return send(200, poolStatus(await store.all(), now))
          }
          if (route === '/status') return send(200, poolStatus(await store.all(), now))
          let raw = ''
          for await (const chunk of req) raw += chunk
          const { email } = JSON.parse(raw || '{}')
          if (route === '/entry') return send(200, await enter(store, email, { ip: req.socket.remoteAddress, userAgent: req.headers['user-agent'] }, now))
          if (route === '/draw') return send(200, await draw(store, email, { now, ...(forceWin ? { rand: () => 0 } : {}) }))
          return send(404, { error: 'Not found' })
        } catch (e) {
          if (e instanceof LotteryError) return send(e.status, { error: e.message, ...e.body })
          return send(500, { error: String(e) })
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), helpText(), event1024Mock()],
  server: {
    host: true
  }
})
