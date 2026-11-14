import { peticion } from './api'
import { formatearFecha } from '../utils/formato'

// La API usa _id (MongoDB); la interfaz trabaja con id
const aProducto = (p) => ({ ...p, id: p._id })

export async function obtenerProductos() {
  const productos = await peticion('/productos')
  return productos.map(aProducto)
}

export async function obtenerProducto(id) {
  const producto = await peticion(`/productos/${encodeURIComponent(id)}`)
  return aProducto(producto)
}

export async function obtenerResumen() {
  const resumen = await peticion('/resumen')
  return { ...resumen, alertas: resumen.alertas.map(aProducto) }
}

export async function obtenerMovimientos(limite = 6) {
  const movimientos = await peticion(`/movimientos?limite=${limite}`)
  return movimientos.map((m) => ({
    id: m._id,
    tipo: m.tipo,
    cantidad: m.cantidad,
    usuario: m.usuario,
    producto: m.producto?.nombre ?? 'Producto eliminado',
    fecha: formatearFecha(m.fechaCreacion),
  }))
}

export function obtenerVehiculos() {
  return peticion('/vehiculos')
}

// Devuelve [{ producto, compat }]; los agotados vienen al final
export async function buscarCompatibles(marca, modelo, anio) {
  const params = new URLSearchParams({ marca, modelo, anio })
  const resultados = await peticion(`/productos/compatibles?${params}`)
  return resultados.map(({ producto, compat }) => ({ producto: aProducto(producto), compat }))
}