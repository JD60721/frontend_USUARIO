import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { pingBackend } from './services/health'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)

// Dispara un ping no bloqueante al cargar para "precalentar" el backend
pingBackend().then((res) => {
  // Opcional: log en consola para diagnóstico
  if (!res.ok) {
    console.warn('Ping backend fallido', res)
  }
}).catch((e) => console.warn('Ping backend error', e))
