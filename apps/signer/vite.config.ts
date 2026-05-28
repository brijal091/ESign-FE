import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// In dev the signer app reaches the Spring Boot backend through this proxy, mirroring the web
// app's `/api/be` convention so signing-token requests avoid cross-origin/CORS concerns.
const BE_ORIGIN = process.env.BE_ORIGIN ?? 'http://localhost:8080/esign'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api/be': {
        target: BE_ORIGIN,
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/be/, ''),
        // Strip browser-set Origin/Referer so the backend treats this as a same-origin server call
        // (matches the web app's Next proxy). Otherwise the browser's Origin on POST/PUT/DELETE
        // trips the backend CORS allow-list and returns 403.
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.removeHeader('origin')
            proxyReq.removeHeader('referer')
          })
        },
      },
    },
  },
})
