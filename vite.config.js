import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  // three.js is lazy-loaded after first paint, so a large chunk there is expected
  build: { chunkSizeWarningLimit: 1000 },
})
