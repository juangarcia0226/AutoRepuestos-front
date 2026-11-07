export default function TablaCompatibles({ vehiculos }) {
  const ordenados = [...vehiculos].sort(
    (a, b) => a.marca.localeCompare(b.marca) || a.modelo.localeCompare(b.modelo),
  )

  return (
    <section className="prod-panel">
      <div className="prod-panel-cabecera">
        <h2 className="prod-panel-titulo">Vehículos compatibles</h2>
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
              </tr>
            </thead>
            <tbody>
              {ordenados.map((v) => (
                <tr key={`${v.marca}-${v.modelo}`}>
                  <td>{v.marca}</td>
                  <td>{v.modelo}</td>
                  <td>{v.desde}–{v.hasta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}