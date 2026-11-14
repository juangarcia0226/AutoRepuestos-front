import { peticion } from './api'

// Devuelve { token, usuario } o lanza ErrorApi si las credenciales no son válidas
export function login(correo, clave) {
  return peticion('/auth/login', {
    method: 'POST',
    body: { correo: correo.trim(), clave },
  })
}