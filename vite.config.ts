import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  // Configure for SPA routing
  preview: {
    port: 4173,
    strictPort: true,
  },
  // This ensures that all routes fallback to index.html for client-side routing
  appType: 'spa'
})
