import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/versusy-admin/',
  plugins: [react()],
  server: {
    port: 3001,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'https://v1-versusy-928473098122.europe-west1.run.app',
        changeOrigin: true,
      },
    },
  },
})
