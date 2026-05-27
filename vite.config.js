import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo.webp'],
      manifest: {
        name: 'Ludora Hub - Game Hub',
        short_name: 'Ludora Hub',
        description: 'Tổ hợp Mini Games giải trí đỉnh cao',
        theme_color: '#0B1020',
        background_color: '#0B1020',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'logo.webp',
            sizes: '192x192 512x512',
            type: 'image/webp',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  server: {
    port: 3333,
    strictPort: false
  }
})
