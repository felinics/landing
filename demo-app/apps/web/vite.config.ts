import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  base: '/memoh-demo/',
  plugins: [vue(), tailwindcss()],
  resolve: {
    dedupe: ['vue', 'vee-validate'],
    alias: {
      '#': fileURLToPath(new URL('../../packages/ui/src', import.meta.url)),
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // Keep prior hashed chunks available to already-open iframes during rebuilds.
  // Clearing this served directory briefly routes the iframe to the host's 404.
  build: { outDir: '../../../public/memoh-demo', emptyOutDir: false },
  server: { host: '127.0.0.1', port: 5181 },
})
