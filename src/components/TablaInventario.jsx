import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatearPrecio } from '../utils/formato'
import { estadoStock } from '../utils/estadoStock'

export default function TablaInventario({ productos, onAgregar }) {
  const [busqueda, setBusqueda] = useState('')

  const texto = busqueda.trim().toLowerCase()
  const filtrados = productos.filter((p) =>
    [p.nombre, p.referencia, p.marca].some((campo) => campo.toLowerCase().includes(texto)),
  )

  return (
    <div className="dash-panel">
      <div className="dash-panel-cabecera d-flex flex-wrap gap-2 justify-content-between align-items-center">
        <h2 className="dash-panel-titulo">Productos</h2>
        <div className="d-flex flex-wrap gap-2 flex-grow-1 flex-md-grow-0">
          <div className="input-group" style={{ minWidth: '15rem' }}>
            <span className="input-group-text"><i className="bi bi-search"></i></span>
            <input
              type="search"
              className="form-control"
              placeholder="Buscar repuesto, referencia o marca"
              aria-label="Buscar productos"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <button type="button" className="btn btn-señal" onClick={onAgregar}>
            <i className="bi bi-plus-lg"></i> Agregar producto
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-hover dash-tabla mb-0">
          <thead>
            <tr>
              <th>Repuesto</th>
              <th>Referencia</th>
              <th>Marca</th>
              <th>Stock</th>
              <th>Precio</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((p) => {
              const estado = estadoStock(p)
              return (
                <tr key={p.id}>
                  <td><Link className="producto-enlace" to={`/producto/${p.id}`}>{p.nombre}</Link></td>
                  <td className="dash-referencia">{p.referencia}</td>
                  <td>{p.marca}</td>
                  <td>{p.stock}</td>
                  <td>{formatearPrecio(p.precio)}</td>
                  <td><span className={`badge ${estado.clase}`}>{estado.texto}</span></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {filtrados.length === 0 && (
        <p className="dash-vacio">
          No hay productos que coincidan con la búsqueda. Prueba con otra referencia o marca.
        </p>
      )}
    </div>
  )
}