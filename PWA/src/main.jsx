import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// registerSW comes from vite-plugin-pwa's virtual module.
// It's "virtual" because it doesn't exist as a real file — the plugin
// generates it at build time.
import { registerSW } from 'virtual:pwa-register'

// This actually activates the service worker.
// { immediate: true } means: register it as soon as the app loads,
// don't wait for any user interaction.
registerSW({ immediate: true })
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
