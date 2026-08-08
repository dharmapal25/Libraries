import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),

    // Auto-generates manifest.json and service worker
    VitePWA({
      // Automatically update the service worker when a new version is deployed
      registerType: "autoUpdate",

      manifest: {
        name: "Flash Notes - Quick Notes App",
        short_name: "Notes",
        description: "Offline-first notes app built with React + PWA",

        start_url: "/",
        scope: "/",

        // App opens without browser address bar
        display: "standalone",

        orientation: "portrait",

        // Mobile status bar / browser UI color
        theme_color: "#c2c2c2a1",

        // Splash screen background
        background_color: "#9ae260",

        icons: [
          {
            src: "/Flash.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/Flash.png",
            sizes: "512x512",
            type: "image/png",
            // purpose: "maskable",
          },
        ],
      },

      // Workbox generates the service worker
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,svg}"],
      },

      // Allows PWA testing during development
      devOptions: {
        enabled: true,
      },
    }),
  ],
});

