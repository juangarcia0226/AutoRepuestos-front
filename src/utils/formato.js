const formatoPrecio = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
})

const formatoFecha = new Intl.DateTimeFormat('es-CO', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export function formatearPrecio(valor) {
  return formatoPrecio.format(valor)
}

export function formatearFecha(valor) {
  return formatoFecha.format(new Date(valor))
}