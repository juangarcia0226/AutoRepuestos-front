import { useRef, useState } from 'react'
import { obtenerVehiculos, buscarCompatibles } from '../services/inventarioApi'
import { useCarga } from '../hooks/useCarga'
import FormularioVehiculo from '../components/FormularioVehiculo'
import TarjetaRepuesto from '../components/TarjetaRepuesto'
import EstadoCarga from '../components/EstadoCarga'

export default function Vehiculos() {
  const { datos: vehiculos, cargando, error, recargar } = useCarga(obtenerVehiculos)
  // null = aún no se ha buscado; si no, { descripcion, resultados }
  const [busqueda, setBusqueda] = useState(null)
  const [buscando, setBuscando] = useState(false)
  const [errorBusqueda, setErrorBusqueda] = useState(null)
  // Identifica la búsqueda vigente para ignorar respuestas de búsquedas anteriores
  const busquedaVigente = useRef(0)

  async function buscar(marca, modelo, anio) {
    const numero = ++busquedaVigente.current
    setBuscando(true)
    setErrorBusqueda(null)
    try {
      const resultados = await buscarCompatibles(marca, modelo, anio)
      if (numero !== busquedaVigente.current) return
      setBusqueda({ descripcion: `${marca} ${modelo} ${anio}`, resultados })
    } catch (e) {
      if (numero !== busquedaVigente.current) return
      setBusqueda(null)
      setErrorBusqueda(e.message)
    } finally {
      if (numero === busquedaVigente.current) setBuscando(false)
    }
  }

  // Al cambiar un selector se descartan los resultados y cualquier búsqueda en curso
  function limpiar() {
    busquedaVigente.current++
    setBusqueda(null)
    setErrorBusqueda(null)
    setBuscando(false)
  }

  return (
    <EstadoCarga cargando={cargando} error={error} onReintentar={recargar}>
      {vehiculos && (
        <>
          <FormularioVehiculo
            vehiculos={vehiculos}
            onBuscar={buscar}
            onCambio={limpiar}
            buscando={buscando}
          />

          <section aria-live="polite">
            {errorBusqueda && (
              <div className="veh-vacio">
                <i className="bi bi-exclamation-triangle"></i>
                {errorBusqueda}
              </div>
            )}

            {busqueda === null && !errorBusqueda && (
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
      )}
    </EstadoCarga>
  )
}