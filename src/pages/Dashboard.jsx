import { useState } from 'react'
import { obtenerProductos, obtenerMovimientos } from '../services/inventarioService'
import { estadoStock } from '../utils/estadoStock'
import TarjetaResumen from '../components/TarjetaResumen'
import TablaInventario from '../components/TablaInventario'
import ListaAlertas from '../components/ListaAlertas'
import ListaMovimientos from '../components/ListaMovimientos'
import Aviso from '../components/Aviso'

export default function Dashboard() {
  // Se leen de LocalStorage una sola vez al montar la página
  const [productos] = useState(obtenerProductos)
  const [movimientos] = useState(obtenerMovimientos)
  const [avisoVisible, setAvisoVisible] = useState(false)

  const totalBajo = productos.filter((p) => estadoStock(p).clave === 'bajo').length
  const totalAgotados = productos.filter((p) => estadoStock(p).clave === 'agotado').length

  return (
    <>
      <section className="row g-3 mb-4" aria-label="Resumen del inventario">
        <div className="col-12 col-md-4">
          <TarjetaResumen valor={productos.length} texto="Total de productos" icono="bi-box-seam" />
        </div>
        <div className="col-12 col-md-4">
          <TarjetaResumen valor={totalBajo} texto="Con stock bajo" icono="bi-exclamation-triangle" variante="bajo" />
        </div>
        <div className="col-12 col-md-4">
          <TarjetaResumen valor={totalAgotados} texto="Agotados" icono="bi-x-octagon" variante="agotado" />
        </div>
      </section>

      <div className="row g-4">
        <section className="col-12 col-xl-8">
          <TablaInventario productos={productos} onAgregar={() => setAvisoVisible(true)} />
        </section>

        <div className="col-12 col-xl-4 d-flex flex-column gap-4">
          <ListaAlertas productos={productos} />
          <ListaMovimientos movimientos={movimientos} productos={productos} />
        </div>
      </div>

      <Aviso
        mensaje="Agregar productos estará disponible en una próxima versión."
        visible={avisoVisible}
        onCerrar={() => setAvisoVisible(false)}
      />
    </>
  )
}