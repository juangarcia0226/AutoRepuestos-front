import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/base.css'
import './styles/layout.css'
import './styles/login.css'
import './styles/dashboard.css'
import './styles/vehiculos.css'
import './styles/producto.css'
import { inicializarDatos } from './services/inventarioService'
import App from './App.jsx'

inicializarDatos()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)