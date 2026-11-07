// Devuelve { clave, texto, clase } según el stock del producto
export function estadoStock(producto) {
  if (producto.stock === 0) {
    return { clave: 'agotado', texto: 'Agotado', clase: 'text-bg-danger' }
  }
  if (producto.stock <= producto.stockMinimo) {
    return { clave: 'bajo', texto: 'Stock bajo', clase: 'text-bg-warning' }
  }
  return { clave: 'disponible', texto: 'Disponible', clase: 'text-bg-success' }
}