import { useState } from 'react'
import { obtenerVehiculos, buscarCompatibles } from '../services/inventarioService'
import FormularioVehiculo from '../components/FormularioVehiculo'
import TarjetaRepuesto from '../components/TarjetaRepuesto'

export default function Vehiculos() {
  const [vehiculos] = useState(obtenerVehiculos)
  // null = aún no se ha buscado; si no, { descripcion, resultados }
  const [busqueda, setBusqueda] = useState(null)

  function buscar(marca, modelo, anio) {
    setBusqueda({
      descripcion: `${marca} ${modelo} ${anio}`,
      resultados: buscarCompatibles(marca, modelo, anio),
    })
  }

  return (
    <>
      <FormularioVehiculo
        vehiculos={vehiculos}
        onBuscar={buscar}
        onCambio={() => setBusqueda(null)}
      />

      <section aria-live="polite">
        {busqueda === null && (
          <div className="veh-vacio">
            <i className="bi bi-car-front"></i>
            Elige la marca, el modelo y el año del vehículo para ver los repuestos compatibles.
          </div>
        )}

        {busqueda !== null && busqueda.resultados.length === 0 && (
          <div className="veh-vacio">
            <i className="bi bi-search"></i>
            No encontramos repuestos compatibles con {busqueda.descripcion}. Prueba con otro año o modelo.
          </div>
        )}

        {busqueda !== null && busqueda.resultados.length > 0 && (
          <>
            <h2 className="veh-resumen">
              {busqueda.resultados.length}{' '}
              {busqueda.resultados.length === 1 ? 'repuesto compatible' : 'repuestos compatibles'} con {busqueda.descripcion}
            </h2>
            <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-3">
              {busqueda.resultados.map(({ producto, compat }) => (
                <TarjetaRepuesto key={producto.id} producto={producto} compat={compat} />
              ))}
            </div>
          </>
        )}
      </section>
    </>
  )
}