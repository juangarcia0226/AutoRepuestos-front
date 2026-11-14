import { useCallback, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { obtenerProducto } from '../services/inventarioApi'
import { useCarga } from '../hooks/useCarga'
import { formatearPrecio } from '../utils/formato'
import { estadoStock } from '../utils/estadoStock'
import TablaCompatibles from '../components/TablaCompatibles'
import EstadoCarga from '../components/EstadoCarga'
import Aviso from '../components/Aviso'

// Ícono de marcador de posición según la categoría (mientras no haya fotos reales)
const ICONOS = {
  Filtros: 'bi-funnel',
  Frenos: 'bi-disc',
  Encendido: 'bi-lightning-charge',
  Suspensión: 'bi-arrows-vertical',
  Motor: 'bi-gear',
  Eléctrico: 'bi-battery-charging',
  Transmisión: 'bi-gear-wide',
  Accesorios: 'bi-tools',
}

export default function Producto() {
  const { id } = useParams()
  const cargar = useCallback(() => obtenerProducto(id), [id])
  const { datos: producto, cargando, error, recargar } = useCarga(cargar)
  const [aviso, setAviso] = useState(null)

  if (cargando) return <EstadoCarga cargando />

  if (error) {
    return (
      <div className="veh-vacio">
        <i className="bi bi-exclamation-circle"></i>
        {error}
        <div className="mt-3 d-flex justify-content-center gap-2">
          <button type="button" className="btn btn-outline-dark" onClick={recargar}>
            <i className="bi bi-arrow-clockwise"></i> Reintentar
          </button>
          <Link className="btn btn-outline-secondary" to="/dashboard">
            <i className="bi bi-arrow-left"></i> Volver al inventario
          </Link>
        </div>
      </div>
    )
  }

  const estado = estadoStock(producto)

  return (
    <>
      <nav aria-label="Ruta de navegación">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/dashboard">Inventario</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{producto.nombre}</li>
        </ol>
      </nav>

      <div className="row g-4 mb-4">
        <div className="col-12 col-lg-5">
          <div className="prod-panel">
            <div className="prod-imagen" role="img" aria-label={`Imagen de ${producto.nombre}`}>
              <i className={`bi ${ICONOS[producto.categoria] ?? 'bi-box-seam'}`}></i>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-7">
          <div className="prod-panel">
            <div className="prod-cuerpo">
              <div className="d-flex justify-content-between align-items-start gap-2">
                <h2 className="prod-nombre">{producto.nombre}</h2>
                <span className={`badge ${estado.clase}`}>{estado.texto}</span>
              </div>
              <div className="prod-precio">{formatearPrecio(producto.precio)}</div>

              <dl className="prod-datos">
                <dt>Marca</dt>
                <dd>{producto.marca}</dd>
                <dt>Referencia</dt>
                <dd className="prod-referencia">{producto.referencia}</dd>
                <dt>Categoría</dt>
                <dd>{producto.categoria}</dd>
                <dt>Stock</dt>
                <dd>{producto.stock} unidades (mínimo {producto.stockMinimo})</dd>
              </dl>

              <div className="prod-ubicacion">
                <i className="bi bi-geo-alt-fill"></i>
                <div>
                  <small>Ubicación en la tienda</small>
                  <strong>{producto.ubicacion}</strong>
                </div>
              </div>

              <div className="prod-acciones">
                <button
                  type="button"
                  className="btn btn-señal"
                  onClick={() => setAviso('Editar productos estará disponible en una próxima versión.')}
                >
                  <i className="bi bi-pencil-square"></i> Editar
                </button>
                <button
                  type="button"
                  className="btn btn-outline-dark"
                  disabled={producto.stock === 0}
                  onClick={() => setAviso('Registrar salidas estará disponible en una próxima versión.')}
                >
                  <i className="bi bi-box-arrow-up"></i> Registrar salida
                </button>
                <Link className="btn btn-outline-secondary ms-lg-auto" to="/dashboard">
                  <i className="bi bi-arrow-left"></i> Volver al inventario
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TablaCompatibles vehiculos={producto.compatibilidad ?? []} />

      <Aviso mensaje={aviso} visible={aviso !== null} onCerrar={() => setAviso(null)} />
    </>
  )
}