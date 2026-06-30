import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5009',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'http://localhost:5009',
        changeOrigin: true,
        ws: true,
      },
    },
  },
  preview: {
    port: 3000,
  },
})
