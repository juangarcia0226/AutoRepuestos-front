import { useState } from 'react'
import { AuthContext } from './AuthContext'
import { leer, guardar, eliminar } from '../services/storage'
import { USUARIO_DEMO } from '../data/usuarios'

export function AuthProvider({ children }) {
  // La sesión se recupera de LocalStorage
  const [usuario, setUsuario] = useState(() => leer('sesion'))

  function iniciarSesion(correo, clave) {
    const correoOk = correo.trim().toLowerCase() === USUARIO_DEMO.correo
    if (correoOk && clave === USUARIO_DEMO.clave) {
      const sesion = { correo: USUARIO_DEMO.correo, nombre: USUARIO_DEMO.nombre }
      guardar('sesion', sesion)
      setUsuario(sesion)
      return { ok: true }
    }
    return { ok: false, error: 'Correo o contraseña incorrectos. Revisa tus datos e inténtalo de nuevo.' }
  }

  function cerrarSesion() {
    eliminar('sesion')
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  )
}