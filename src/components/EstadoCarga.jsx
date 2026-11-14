// Muestra un indicador de carga o el error; cuando todo está bien, muestra el contenido
export default function EstadoCarga({ cargando, error, onReintentar, children }) {
  if (cargando) {
    return (
      <div className="text-center py-5" role="status">
        <div className="spinner-border text-secondary" aria-hidden="true"></div>
        <div className="mt-2 text-secondary">Cargando...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="veh-vacio">
        <i className="bi bi-exclamation-triangle"></i>
        {error}
        <div className="mt-3">
          <button type="button" className="btn btn-outline-dark" onClick={onReintentar}>
            <i className="bi bi-arrow-clockwise"></i> Reintentar
          </button>
        </div>
      </div>
    )
  }

  return children
}