import { useEffect, useState } from 'react'
import { registrarMovimiento } from '../services/inventarioApi'

// Ventana para registrar una entrada o una salida de stock de un producto
export default function ModalMovimiento({ tipo, producto, onCerrar, onRegistrado }) {
  const esSalida = tipo === 'salida'
  const [cantidad, setCantidad] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  // Escape cierra la ventana, y mientras está abierta no se desplaza la página de fondo
  useEffect(() => {
    function alPulsar(e) {
      if (e.key === 'Escape') onCerrar()
    }
    document.addEventListener('keydown', alPulsar)
    document.body.classList.add('modal-open')
    return () => {
      document.removeEventListener('keydown', alPulsar)
      document.body.classList.remove('modal-open')
    }
  }, [onCerrar])

  async function handleSubmit(e) {
    e.preventDefault()
    const unidades = Number(cantidad)

    if (!Number.isInteger(unidades) || unidades < 1) {
      setError('Ingresa una cantidad entera de al menos 1.')
      return
    }
    if (esSalida && unidades > producto.stock) {
      setError(`Solo hay ${producto.stock} unidades en stock.`)
      return
    }

    setEnviando(true)
    try {
      await registrarMovimiento(tipo, producto.id, unidades)
      onRegistrado(unidades)
    } catch (err) {
      setError(err.message)
      setEnviando(false)
    }
  }

  return (
    <>
      <div className="modal-backdrop show"></div>
      <div
        className="modal d-block"
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tituloModalMovimiento"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onCerrar()
        }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <form onSubmit={handleSubmit} noValidate>
              <div className="modal-header">
                <h2 className="modal-title fs-4" id="tituloModalMovimiento">
                  {esSalida ? 'Registrar salida' : 'Registrar entrada'}
                </h2>
                <button type="button" className="btn-close" aria-label="Cerrar" onClick={onCerrar}></button>
              </div>

              <div className="modal-body">
                <p className="mb-3">
                  <strong>{producto.nombre}</strong>
                  <br />
                  <span className="text-secondary">Stock actual: {producto.stock} unidades</span>
                </p>
                <label htmlFor="cantidadMovimiento" className="form-label">
                  {esSalida ? 'Unidades que salen' : 'Unidades que ingresan'}
                </label>
                <input
                  type="number"
                  id="cantidadMovimiento"
                  className={`form-control ${error ? 'is-invalid' : ''}`}
                  min="1"
                  step="1"
                  value={cantidad}
                  autoFocus
                  onChange={(e) => {
                    setCantidad(e.target.value)
                    setError('')
                  }}
                />
                <div className="invalid-feedback">{error}</div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline-secondary" onClick={onCerrar}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-señal" disabled={enviando}>
                  {enviando ? 'Registrando...' : esSalida ? 'Registrar salida' : 'Registrar entrada'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}