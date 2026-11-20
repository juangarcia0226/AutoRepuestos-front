import { useEffect } from 'react'

// Ventana de confirmación para acciones que no se pueden deshacer
export default function ModalConfirmar({
  titulo,
  mensaje,
  textoConfirmar = 'Confirmar',
  enviando = false,
  error = '',
  onConfirmar,
  onCerrar,
}) {
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

  return (
    <>
      <div className="modal-backdrop show"></div>
      <div
        className="modal d-block"
        tabIndex="-1"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="tituloModalConfirmar"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onCerrar()
        }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title fs-4" id="tituloModalConfirmar">{titulo}</h2>
              <button type="button" className="btn-close" aria-label="Cerrar" onClick={onCerrar}></button>
            </div>

            <div className="modal-body">
              {error && <div className="alert alert-danger" role="alert">{error}</div>}
              {mensaje}
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={onCerrar}>
                Cancelar
              </button>
              <button type="button" className="btn btn-danger" disabled={enviando} onClick={onConfirmar}>
                {enviando ? 'Eliminando...' : textoConfirmar}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}