import { Link } from 'react-router-dom'
import { formatearPrecio } from '../utils/formato'
import { estadoStock } from '../utils/estadoStock'

export default function TarjetaRepuesto({ producto, compat }) {
  const estado = estadoStock(producto)

  return (
    <div className="col">
      <article className={`veh-tarjeta ${producto.stock === 0 ? 'sin-stock' : ''}`}>
        <div className="veh-tarjeta-cuerpo">
          <div className="d-flex justify-content-between align-items-start gap-2">
            <h3 className="veh-nombre">{producto.nombre}</h3>
            <span className={`badge ${estado.clase}`}>{estado.texto}</span>
          </div>
          <div className="veh-dato">
            {producto.marca} · Ref. <span className="veh-referencia">{producto.referencia}</span>
          </div>
          <div className="veh-compat">
            <i className="bi bi-check-circle-fill"></i> Compatible con {compat.marca} {compat.modelo} {compat.desde}–{compat.hasta}
          </div>
        </div>
        <div className="veh-tarjeta-pie">
          <div>
            <div className="veh-precio">{formatearPrecio(producto.precio)}</div>
            <div className="veh-dato">Stock: {producto.stock}</div>
          </div>
          <Link className="btn btn-sm btn-outline-dark" to={`/producto/${producto.id}`}>
            Ver detalle
          </Link>
        </div>
      </article>
    </div>
  )
}