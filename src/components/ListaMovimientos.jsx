export default function ListaMovimientos({ movimientos, productos }) {
  return (
    <section className="dash-panel">
      <div className="dash-panel-cabecera">
        <h2 className="dash-panel-titulo">Últimos movimientos</h2>
      </div>

      {movimientos.length === 0 ? (
        <p className="dash-vacio">Aún no hay movimientos registrados.</p>
      ) : (
        <ul className="dash-lista">
          {movimientos.map((m) => {
            const producto = productos.find((p) => p.id === m.productoId)
            const entrada = m.tipo === 'entrada'
            return (
              <li key={m.id}>
                <i className={`bi ${entrada ? 'bi-arrow-down-circle-fill text-success' : 'bi-arrow-up-circle-fill text-danger'}`}></i>
                <div>
                  <span className="fw-semibold">
                    {entrada ? 'Entrada' : 'Salida'}: {m.cantidad} × {producto?.nombre ?? 'Producto eliminado'}
                  </span>
                  <small>{m.fecha} · {m.usuario}</small>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}