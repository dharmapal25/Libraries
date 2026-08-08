import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),

    // This plugin auto-generates manifest.json AND the service worker
    // at build time. We don't have to hand-write either file.
    VitePWA({
      // 'autoUpdate' = when a new version is deployed, the service worker
      // silently updates itself in the background (no popup asking the user).
      registerType: 'autoUpdate',

      // These files get copied as-is into the build output (not processed).
      includeAssets: ['FlashGPT.png', 'Flash.png'],

      manifest: {
        name: 'Flash Notes - Quick Notes App',
        short_name: 'Notes',
        description: 'Offline-first notes app built with React + PWA',

        // Where the app opens when launched from the home screen icon
        start_url: '/',

        // Which URLs are considered "inside" this app (standalone mode).
        // Links outside this scope open in a normal browser tab.
        scope: '/',

        // 'standalone' = no browser address bar, looks like a native app
        display: 'standalone',

        orientation: 'portrait',

        // Color of the mobile status bar + browser task-switcher card
        theme_color: '#6366f1',

        // Color shown on the splash screen while the app is loading
        background_color: '#9ae260',

        icons: [
          {
            src: 'FlashGPT.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'Flash.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },

      // Workbox = Google's library that generates the actual service worker
      // code (the fetch handler, caching logic, etc.) for us.
      workbox: {
        // Cache-first strategy is applied automatically to all built assets
        // (JS, CSS, HTML, images) listed here — this is what makes the
        // app load instantly and work offline.
        globPatterns: ['**/*.{js,css,html,png,svg,ico}']
      },

      // Lets us test the PWA behavior in dev mode too (optional but handy)
      devOptions: {
        enabled: true
      }
    })
  ]
})
