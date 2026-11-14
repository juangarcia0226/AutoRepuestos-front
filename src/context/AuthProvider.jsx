import { useState } from 'react'
import { AuthContext } from './AuthContext'
import { leer, guardar, eliminar } from '../services/storage'
import { login } from '../services/authService'

export function AuthProvider({ children }) {
  // La sesión solo es válida si también hay token (descarta sesiones del login simulado anterior)
  const [usuario, setUsuario] = useState(() => (leer('token') ? leer('sesion') : null))

  async function iniciarSesion(correo, clave) {
    try {
      const { token, usuario: datos } = await login(correo, clave)
      guardar('token', token)
      guardar('sesion', datos)
      setUsuario(datos)
      return { ok: true }
    } catch (e) {
      return { ok: false, error: e.message }
    }
  }

  function cerrarSesion() {
    eliminar('token')
    eliminar('sesion')
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  )
}