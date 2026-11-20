import { useState } from 'react'

const ROLES = {
  admin: { texto: 'Administrador', clase: 'text-bg-dark' },
  operador: { texto: 'Operador', clase: 'text-bg-secondary' },
}

export default function TablaUsuarios({ usuarios, idActual, onAgregar, onEditar, onEliminar }) {
  const [busqueda, setBusqueda] = useState('')

  const texto = busqueda.trim().toLowerCase()
  const filtrados = usuarios.filter((u) =>
    [u.nombre, u.correo].some((campo) => campo.toLowerCase().includes(texto)),
  )

  return (
    <div className="dash-panel">
      <div className="dash-panel-cabecera d-flex flex-wrap gap-2 justify-content-between align-items-center">
        <h2 className="dash-panel-titulo">Usuarios</h2>
        <div className="d-flex flex-wrap gap-2 flex-grow-1 flex-md-grow-0">
          <div className="input-group" style={{ minWidth: '15rem' }}>
            <span className="input-group-text"><i className="bi bi-search"></i></span>
            <input
              type="search"
              className="form-control"
              placeholder="Buscar nombre o correo"
              aria-label="Buscar usuarios"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <button type="button" className="btn btn-señal" onClick={onAgregar}>
            <i className="bi bi-plus-lg"></i> Agregar usuario
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-hover dash-tabla mb-0">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Estado</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((u) => {
              const esPropio = u.id === idActual
              const rol = ROLES[u.rol] ?? { texto: u.rol, clase: 'text-bg-light border' }
              return (
                <tr key={u.id}>
                  <td>
                    {u.nombre}
                    {esPropio && <span className="text-secondary"> (tú)</span>}
                  </td>
                  <td>{u.correo}</td>
                  <td><span className={`badge ${rol.clase}`}>{rol.texto}</span></td>
                  <td>
                    <span className={`badge ${u.activo ? 'text-bg-success' : 'text-bg-secondary'}`}>
                      {u.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="text-end text-nowrap">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-dark me-1"
                      aria-label={`Editar ${u.nombre}`}
                      onClick={() => onEditar(u)}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      aria-label={`Eliminar ${u.nombre}`}
                      title={esPropio ? 'No puedes eliminar tu propia cuenta' : 'Eliminar'}
                      disabled={esPropio}
                      onClick={() => onEliminar(u)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {filtrados.length === 0 && (
        <p className="dash-vacio">No hay usuarios que coincidan con la búsqueda. Prueba con otro nombre o correo.</p>
      )}
    </div>
  )
}