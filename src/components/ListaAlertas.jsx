import { Link } from 'react-router-dom'

export default function ListaAlertas({ alertas }) {
  return (
    <section className="dash-panel">
      <div className="dash-panel-cabecera">
        <h2 className="dash-panel-titulo">Alertas de inventario</h2>
      </div>

      {alertas.length === 0 ? (
        <p className="dash-vacio">Sin alertas. Todo el stock está en orden.</p>
      ) : (
        <ul className="dash-lista">
          {alertas.map((p) => {
            const agotado = p.stock === 0
            return (
              <li key={p.id}>
                <i className={`bi ${agotado ? 'bi-x-octagon-fill text-danger' : 'bi-exclamation-triangle-fill text-warning'}`}></i>
                <div>
                  <Link className="text-decoration-none fw-semibold text-dark" to={`/producto/${p.id}`}>
                    {p.nombre}
                  </Link>
                  <small>
                    {agotado ? 'Agotado' : `Quedan ${p.stock} (mínimo ${p.stockMinimo})`} · {p.marca}
                  </small>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}