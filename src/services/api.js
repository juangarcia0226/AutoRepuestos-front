import { leer, eliminar } from './storage'

export const API_URL = import.meta.env.VITE_API_URL

// Error de la API: conserva el código HTTP y el mensaje que envía el backend
export class ErrorApi extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

// Hace una petición a la API. Envía el token si existe y lanza ErrorApi si algo falla.
export async function peticion(ruta, { method = 'GET', body } = {}) {
  if (!API_URL) throw new Error('Falta VITE_API_URL en el archivo .env')

  const headers = {}
  const token = leer('token')
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  let respuesta
  try {
    respuesta = await fetch(`${API_URL}${ruta}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ErrorApi(0, 'No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.')
  }

  const datos = await respuesta.json().catch(() => null)
  if (!respuesta.ok) {
    // Token vencido o inválido: se cierra la sesión y se vuelve al login
    if (respuesta.status === 401 && token && ruta !== '/auth/login') {
      eliminar('token')
      eliminar('sesion')
      window.location.assign('/')
    }
    throw new ErrorApi(respuesta.status, datos?.message ?? 'Error inesperado del servidor')
  }
  return datos
}