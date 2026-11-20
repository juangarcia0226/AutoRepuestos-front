import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

function obtenerMenu() {
  const menu = document.getElementById('menu')
  const instancia = menu ? window.bootstrap?.Offcanvas.getInstance(menu) : null
  return { menu, instancia }
}

// Cierra el menú lateral en móvil. Si no está abierto (escritorio), no hace nada.
function cerrarMenu() {
  obtenerMenu().instancia?.hide()
}

const ROLES = { admin: 'Administrador', operador: 'Operador' }

export default function MenuLateral({ onCambiarClave }) {
  const { usuario, esAdmin, cerrarSesion } = useAuth()
  const { pathname } = useLocation()

  // El detalle de un repuesto pertenece a la sección de inventario
  const inventarioActivo = (isActive) => isActive || pathname.startsWith('/producto/')

  // Si el menú está abierto (móvil), espera a que termine de cerrarse antes de salir.
  // Así Bootstrap no deja el fondo oscuro sobre la pantalla de login.
  function salir() {
    const { menu, instancia } = obtenerMenu()
    if (instancia && menu.classList.contains('show')) {
      menu.addEventListener('hidden.bs.offcanvas', cerrarSesion, { once: true })
      instancia.hide()
    } else {
      cerrarSesion()
    }
  }

  return (
    <aside className="menu-lateral">
      <div className="offcanvas-lg offcanvas-start" tabIndex="-1" id="menu" aria-label="Menú principal">
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
              className={({ isActive }) => `menu-enlace ${inventarioActivo(isActive) ? 'activo' : ''}`}
              onClick={cerrarMenu}
            >
              <i className="bi bi-box-seam"></i> Inventario
            </NavLink>
            <NavLink
              to="/vehiculos"
              className={({ isActive }) => `menu-enlace ${isActive ? 'activo' : ''}`}
              onClick={cerrarMenu}
            >
              <i className="bi bi-car-front"></i> Buscar por vehículo
            </NavLink>
            <NavLink
              to="/catalogo"
              className={({ isActive }) => `menu-enlace ${isActive ? 'activo' : ''}`}
              onClick={cerrarMenu}
            >
              <i className="bi bi-card-list"></i> Catálogo de vehículos
            </NavLink>
            {esAdmin && (
              <NavLink
                to="/usuarios"
                className={({ isActive }) => `menu-enlace ${isActive ? 'activo' : ''}`}
                onClick={cerrarMenu}
              >
                <i className="bi bi-people"></i> Usuarios
              </NavLink>
            )}
          </nav>

          <div className="menu-usuario">
            <div className="menu-usuario-nombre">
              <i className="bi bi-person-circle"></i> {usuario?.nombre}
              <div className="small text-white-50">{ROLES[usuario?.rol] ?? usuario?.rol}</div>
            </div>
            <button
              className="btn btn-sm btn-outline-light w-100 mb-2"
              onClick={() => {
                cerrarMenu()
                onCambiarClave()
              }}
            >
              <i className="bi bi-key"></i> Cambiar contraseña
            </button>
            <button className="btn btn-sm btn-outline-light w-100" onClick={salir}>
              <i className="bi bi-box-arrow-left"></i> Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}