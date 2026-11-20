import { peticion } from './api'

// Devuelve { token, usuario } o lanza ErrorApi si las credenciales no son válidas
export function login(correo, clave) {
  return peticion('/auth/login', {
    method: 'POST',
    body: { correo: correo.trim(), clave },
  })
}

// Datos actuales del usuario de la sesión (incluye el rol vigente)
export function obtenerPerfil() {
  return peticion('/auth/perfil')
}

export function cambiarClave(claveActual, claveNueva) {
  return peticion('/auth/clave', {
    method: 'PUT',
    body: { claveActual, claveNueva },
  })
}