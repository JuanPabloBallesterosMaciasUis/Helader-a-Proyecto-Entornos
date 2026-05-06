import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Redirige /api/* al backend Spring Boot
      '/api': {
        target: 'http://localhost:8083',
        changeOrigin: true,
      }
    }
  }
})