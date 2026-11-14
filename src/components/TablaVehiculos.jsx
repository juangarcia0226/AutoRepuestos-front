import { useState } from 'react'

export default function TablaVehiculos({ vehiculos, onAgregar, onEditar, onEliminar }) {
  const [busqueda, setBusqueda] = useState('')

  const texto = busqueda.trim().toLowerCase()
  const filtrados = vehiculos.filter((v) =>
    [v.marca, v.modelo].some((campo) => campo.toLowerCase().includes(texto)),
  )

  return (
    <div className="dash-panel">
      <div className="dash-panel-cabecera d-flex flex-wrap gap-2 justify-content-between align-items-center">
        <h2 className="dash-panel-titulo">Vehículos</h2>
        <div className="d-flex flex-wrap gap-2 flex-grow-1 flex-md-grow-0">
          <div className="input-group" style={{ minWidth: '15rem' }}>
            <span className="input-group-text"><i className="bi bi-search"></i></span>
            <input
              type="search"
              className="form-control"
              placeholder="Buscar marca o modelo"
              aria-label="Buscar vehículos"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <button type="button" className="btn btn-señal" onClick={onAgregar}>
            <i className="bi bi-plus-lg"></i> Agregar vehículo
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-hover dash-tabla mb-0">
          <thead>
            <tr>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Años</th>
              <th>Productos</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((v) => (
              <tr key={v.id}>
                <td>{v.marca}</td>
                <td>{v.modelo}</td>
                <td>{v.desde}–{v.hasta}</td>
                <td>
                  <span className={`badge ${v.productos > 0 ? 'text-bg-secondary' : 'text-bg-light border'}`}>
                    {v.productos}
                  </span>
                </td>
                <td className="text-end text-nowrap">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-dark me-1"
                    aria-label={`Editar ${v.marca} ${v.modelo}`}
                    onClick={() => onEditar(v)}
                  >
                    <i className="bi bi-pencil-square"></i>
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    aria-label={`Eliminar ${v.marca} ${v.modelo}`}
                    title={v.productos > 0 ? 'En uso: quítalo primero de los productos' : 'Eliminar'}
                    disabled={v.productos > 0}
                    onClick={() => onEliminar(v)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtrados.length === 0 && (
        <p className="dash-vacio">
          {vehiculos.length === 0
            ? 'Aún no hay vehículos en el catálogo.'
            : 'No hay vehículos que coincidan con la búsqueda. Prueba con otra marca o modelo.'}
        </p>
      )}
    </div>
  )
}