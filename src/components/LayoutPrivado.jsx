import { Outlet, useLocation } from 'react-router-dom'
import MenuLateral from './MenuLateral'

const TITULOS = [
  { ruta: '/dashboard', titulo: 'Inventario' },
  { ruta: '/vehiculos', titulo: 'Buscar por vehículo' },
  { ruta: '/producto', titulo: 'Detalle del repuesto' },
]

export default function LayoutPrivado() {
  const { pathname } = useLocation()
  const titulo = TITULOS.find((t) => pathname.startsWith(t.ruta))?.titulo ?? 'AutoRepuestos'

  return (
    <>
      <MenuLateral />

      <div className="contenido-principal">
        <header className="barra-superior">
          <button
            className="btn btn-outline-dark d-lg-none"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#menu"
            aria-controls="menu"
            aria-label="Abrir menú"
          >
            <i className="bi bi-list"></i>
          </button>
          <h1 className="titulo-pagina">{titulo}</h1>
        </header>

        <main className="p-3 p-lg-4">
          <Outlet />
        </main>
      </div>
    </>
  )
}