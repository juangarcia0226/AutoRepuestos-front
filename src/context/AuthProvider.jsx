import { useEffect, useState } from 'react'
import { AuthContext } from './AuthContext'
import { leer, guardar, eliminar } from '../services/storage'
import { login, obtenerPerfil } from '../services/authService'

export function AuthProvider({ children }) {
  // La sesión solo es válida si hay token y rol (descarta sesiones anteriores a los roles)
  const [usuario, setUsuario] = useState(() => {
    const sesion = leer('sesion')
    return leer('token') && sesion?.rol ? sesion : null
  })
  const hayUsuario = usuario !== null

  // Al abrir la app se consulta el perfil al servidor: así el rol y el nombre siempre están al día.
  // Si el usuario fue desactivado o eliminado, el cliente de la API cierra la sesión.
  useEffect(() => {
    if (!hayUsuario) return
    let cancelado = false

    obtenerPerfil()
      .then((perfil) => {
        if (cancelado) return
        guardar('sesion', perfil)
        setUsuario(perfil)
      })
      .catch(() => {})

    return () => {
      cancelado = true
    }
  }, [hayUsuario])

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

  function actualizarSesion(datos) {
    guardar('sesion', datos)
    setUsuario(datos)
  }

  function cerrarSesion() {
    eliminar('token')
    eliminar('sesion')
    setUsuario(null)
  }

  const esAdmin = usuario?.rol === 'admin'

  return (
    <AuthContext.Provider value={{ usuario, esAdmin, iniciarSesion, actualizarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  )
}