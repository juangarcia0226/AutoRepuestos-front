import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

// Cierra el menú lateral en móvil. Si el menú no está abierto (escritorio), no hace nada.
function cerrarMenu() {
  const menu = document.getElementById('menu')
  window.bootstrap?.Offcanvas.getInstance(menu)?.hide()
}

export default function MenuLateral() {
  const { usuario, cerrarSesion } = useAuth()
  const { pathname } = useLocation()

  // El detalle de un repuesto pertenece a la sección de inventario
  const inventarioActivo = (isActive) => isActive || pathname.startsWith('/producto/')

  return (
    <aside className="menu-lateral">
      <div
        className="offcanvas-lg offcanvas-start"
        tabIndex="-1"
        id="menu"
        aria-label="Menú principal"
      >
        <div className="offcanvas-header d-lg-none">
          <div className="marca-logo">
            <i className="bi bi-gear-wide-connected"></i> AutoRepuestos
          </div>
          <button
            type="button"
            className="btn-close btn-close-white"
            aria-label="Cerrar menú"
            data-bs-dismiss="offcanvas"
            data-bs-target="#menu"
          ></button>
        </div>

        <div className="menu-panel">
          <div className="marca-logo menu-logo d-none d-lg-flex">
            <i className="bi bi-gear-wide-connected"></i> AutoRepuestos
          </div>

          <nav className="menu-nav">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `menu-enlace ${inventarioActivo(isActive) ? "activo" : ""}`
              }
              onClick={cerrarMenu}
            >
              <i className="bi bi-box-seam"></i> Inventario
            </NavLink>
            <NavLink
              to="/vehiculos"
              className={({ isActive }) =>
                `menu-enlace ${isActive ? "activo" : ""}`
              }
              onClick={cerrarMenu}
            >
              <i className="bi bi-car-front"></i> Buscar por vehículo
            </NavLink>
          </nav>

          <div className="menu-usuario">
            <div className="menu-usuario-nombre">
              <i className="bi bi-person-circle"></i> {usuario?.nombre}
            </div>
            <button className="btn btn-sm btn-outline-light w-100" onClick={cerrarSesion}>
              <i className="bi bi-box-arrow-left"></i> Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}