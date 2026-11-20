import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import MenuLateral from './MenuLateral'
import ModalClave from './ModalClave'
import Aviso from './Aviso'

const TITULOS = [
  { ruta: '/dashboard', titulo: 'Inventario' },
  { ruta: '/vehiculos', titulo: 'Buscar por vehículo' },
  { ruta: '/catalogo', titulo: 'Catálogo de vehículos' },
  { ruta: '/usuarios', titulo: 'Usuarios' },
  { ruta: '/producto', titulo: 'Detalle del repuesto' },
]

export default function LayoutPrivado() {
  const { pathname } = useLocation()
  const titulo = TITULOS.find((t) => pathname.startsWith(t.ruta))?.titulo ?? 'AutoRepuestos'
  const [cambiandoClave, setCambiandoClave] = useState(false)
  const [aviso, setAviso] = useState(null)

  // Título de la pestaña del navegador
  useEffect(() => {
    document.title = `${titulo} | AutoRepuestos`
    return () => { document.title = 'AutoRepuestos' }
  }, [titulo])

  return (
    <>
      <MenuLateral onCambiarClave={() => setCambiandoClave(true)} />

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

      {cambiandoClave && (
        <ModalClave
          onCerrar={() => setCambiandoClave(false)}
          onCambiada={() => {
            setCambiandoClave(false)
            setAviso('Contraseña actualizada.')
          }}
        />
      )}

      <Aviso mensaje={aviso} visible={aviso !== null} onCerrar={() => setAviso(null)} />
    </>
  )
}