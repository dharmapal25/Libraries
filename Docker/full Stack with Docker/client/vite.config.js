import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",        // Docker ke bahar access
    port: 5173,
    watch: {
      usePolling: true,      // ← Yeh add karo
      interval: 1000,        // Har 1 second me check karo
    }
  }
})