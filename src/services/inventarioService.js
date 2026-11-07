import { existe, leer, guardar } from './storage'
import { PRODUCTOS_INICIALES } from '../data/productos'
import { MOVIMIENTOS_INICIALES } from '../data/movimientos'
import { VEHICULOS_INICIALES } from '../data/vehiculos'
import { COMPATIBILIDAD_INICIAL } from '../data/compatibilidad'

const COLECCIONES = {
  productos: PRODUCTOS_INICIALES,
  movimientos: MOVIMIENTOS_INICIALES,
  vehiculos: VEHICULOS_INICIALES,
  compatibilidad: COMPATIBILIDAD_INICIAL,
}

/* ---------- Inicialización ---------- */

// Copia los datos iniciales a LocalStorage solo si aún no existen
export function inicializarDatos() {
  Object.entries(COLECCIONES).forEach(([clave, inicial]) => {
    if (!existe(clave)) guardar(clave, inicial)
  })
}

// Restaura todos los datos a su estado inicial
export function reiniciarDatos() {
  Object.entries(COLECCIONES).forEach(([clave, inicial]) => guardar(clave, inicial))
}

/* ---------- Lectura ---------- */

export function obtenerProductos() {
  return leer('productos', [])
}

export function obtenerProductoPorId(id) {
  return obtenerProductos().find((p) => p.id === Number(id)) ?? null
}

export function obtenerMovimientos() {
  return leer('movimientos', [])
}

export function obtenerVehiculos() {
  return leer('vehiculos', [])
}

export function obtenerVehiculosCompatibles(productoId) {
  return leer('compatibilidad', {})[productoId] ?? []
}

/* ---------- Búsqueda por vehículo ---------- */

// Devuelve [{ producto, compat }] con los repuestos compatibles; los agotados van al final
export function buscarCompatibles(marca, modelo, anio) {
  const compatibilidad = leer('compatibilidad', {})
  return obtenerProductos()
    .map((producto) => {
      const compat = (compatibilidad[producto.id] ?? []).find(
        (c) => c.marca === marca && c.modelo === modelo && anio >= c.desde && anio <= c.hasta,
      )
      return compat ? { producto, compat } : null
    })
    .filter(Boolean)
    .sort((a, b) => (a.producto.stock === 0) - (b.producto.stock === 0))
}