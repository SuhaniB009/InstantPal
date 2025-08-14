import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss(), ],
  server: {
    port: 5173,
    proxy: {
      // Forward any request starting with /api to your backend on port 5000
      '/api': 'https://instantpal-server.onrender.com'
    }
  }
})
