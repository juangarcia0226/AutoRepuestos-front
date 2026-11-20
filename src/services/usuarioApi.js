import { peticion } from './api'

// La API usa _id (MongoDB); la interfaz trabaja con id
const aUsuario = (u) => ({ ...u, id: u._id })

export async function obtenerUsuarios() {
  const usuarios = await peticion('/usuarios')
  return usuarios.map(aUsuario)
}

export async function crearUsuario(datos) {
  const usuario = await peticion('/usuarios', { method: 'POST', body: datos })
  return aUsuario(usuario)
}

export async function actualizarUsuario(id, datos) {
  const usuario = await peticion(`/usuarios/${encodeURIComponent(id)}`, { method: 'PUT', body: datos })
  return aUsuario(usuario)
}

export function eliminarUsuario(id) {
  return peticion(`/usuarios/${encodeURIComponent(id)}`, { method: 'DELETE' })
}