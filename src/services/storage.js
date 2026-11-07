// Acceso básico a LocalStorage.
const PREFIJO = 'autorepuestos:'

export function existe(clave) {
  try {
    return localStorage.getItem(PREFIJO + clave) !== null
  } catch {
    return false
  }
}

export function leer(clave, valorPorDefecto = null) {
  try {
    const dato = localStorage.getItem(PREFIJO + clave)
    return dato !== null ? JSON.parse(dato) : valorPorDefecto
  } catch {
    return valorPorDefecto
  }
}

export function guardar(clave, valor) {
  try {
    localStorage.setItem(PREFIJO + clave, JSON.stringify(valor))
    return true
  } catch {
    return false
  }
}

export function eliminar(clave) {
  try {
    localStorage.removeItem(PREFIJO + clave)
  } catch {
    /* sin acceso a LocalStorage: no hay nada que eliminar */
  }
}