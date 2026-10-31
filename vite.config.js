import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    // In dev, send /api/v1/* to the Functions emulator (npm run emulators), like the Hosting rewrite does in production.
    proxy: {
      '/api/v1': {
        target: 'http://127.0.0.1:5001',
        rewrite: (path) => `/goatislop/europe-west1/api${path}`,
      },
    },
  },
  build: {
    outDir: 'dist',
  },
})
