import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import { buildHelpTextFiles } from './src/lib/helpText'

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

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), helpText()],
  server: {
    host: true
  }
})
