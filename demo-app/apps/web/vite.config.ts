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
  build: { outDir: '../../../public/memoh-demo', emptyOutDir: true },
  server: { host: '127.0.0.1', port: 5181 },
})
