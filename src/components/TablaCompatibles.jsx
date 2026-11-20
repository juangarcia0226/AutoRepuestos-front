export default function TablaCompatibles({ vehiculos, onAgregar, onQuitar }) {
  const ordenados = [...vehiculos].sort(
    (a, b) => a.marca.localeCompare(b.marca) || a.modelo.localeCompare(b.modelo),
  )

  return (
    <section className="prod-panel">
      <div className="prod-panel-cabecera d-flex flex-wrap gap-2 justify-content-between align-items-center">
        <h2 className="prod-panel-titulo">Vehículos compatibles</h2>
        {onAgregar && (
          <button type="button" className="btn btn-sm btn-señal" onClick={onAgregar}>
            <i className="bi bi-plus-lg"></i> Agregar vehículo
          </button>
        )}
      </div>

      {ordenados.length === 0 ? (
        <p className="dash-vacio">Este repuesto aún no tiene vehículos compatibles registrados.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover dash-tabla mb-0">
            <thead>
              <tr>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Años</th>
                {onQuitar && <th className="text-end">Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {ordenados.map((v) => (
                <tr key={`${v.marca}-${v.modelo}`}>
                  <td>{v.marca}</td>
                  <td>{v.modelo}</td>
                  <td>{v.desde}–{v.hasta}</td>
                  {onQuitar && (
                    <td className="text-end">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        aria-label={`Quitar ${v.marca} ${v.modelo}`}
                        onClick={() => onQuitar(v)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}