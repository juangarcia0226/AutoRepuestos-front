import { useState } from 'react'
import { obtenerProductos, obtenerResumen, obtenerMovimientos } from '../services/inventarioApi'
import { useCarga } from '../hooks/useCarga'
import TarjetaResumen from '../components/TarjetaResumen'
import TablaInventario from '../components/TablaInventario'
import ListaAlertas from '../components/ListaAlertas'
import ListaMovimientos from '../components/ListaMovimientos'
import EstadoCarga from '../components/EstadoCarga'
import Aviso from '../components/Aviso'

// Definida fuera del componente para que useCarga reciba siempre la misma función
async function cargarDashboard() {
  const [productos, resumen, movimientos] = await Promise.all([
    obtenerProductos(),
    obtenerResumen(),
    obtenerMovimientos(6),
  ])
  return { productos, resumen, movimientos }
}

export default function Dashboard() {
  const { datos, cargando, error, recargar } = useCarga(cargarDashboard)
  const [avisoVisible, setAvisoVisible] = useState(false)

  return (
    <>
      <EstadoCarga cargando={cargando} error={error} onReintentar={recargar}>
        {datos && (
          <>
            <section className="row g-3 mb-4" aria-label="Resumen del inventario">
              <div className="col-12 col-md-4">
                <TarjetaResumen valor={datos.resumen.totalProductos} texto="Total de productos" icono="bi-box-seam" />
              </div>
              <div className="col-12 col-md-4">
                <TarjetaResumen valor={datos.resumen.totalBajo} texto="Con stock bajo" icono="bi-exclamation-triangle" variante="bajo" />
              </div>
              <div className="col-12 col-md-4">
                <TarjetaResumen valor={datos.resumen.totalAgotados} texto="Agotados" icono="bi-x-octagon" variante="agotado" />
              </div>
            </section>

            <div className="row g-4">
              <section className="col-12 col-xl-8">
                <TablaInventario productos={datos.productos} onAgregar={() => setAvisoVisible(true)} />
              </section>

              <div className="col-12 col-xl-4 d-flex flex-column gap-4">
                <ListaAlertas alertas={datos.resumen.alertas} />
                <ListaMovimientos movimientos={datos.movimientos} />
              </div>
            </div>
          </>
        )}
      </EstadoCarga>

      <Aviso
        mensaje="Agregar productos estará disponible en una próxima versión."
        visible={avisoVisible}
        onCerrar={() => setAvisoVisible(false)}
      />
    </>
  )
}