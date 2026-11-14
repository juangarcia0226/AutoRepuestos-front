import { useEffect, useState } from 'react'
import { obtenerVehiculos, actualizarProducto } from '../services/inventarioApi'
import { useCarga } from '../hooks/useCarga'

// Ventana para agregar un vehículo compatible a un producto
export default function ModalCompatibilidad({ producto, onCerrar, onGuardado }) {
  const { datos: vehiculos, cargando, error: errorCarga, recargar } = useCarga(obtenerVehiculos)
  const [marca, setMarca] = useState('')
  const [modelo, setModelo] = useState('')
  const [desde, setDesde] = useState('')
  const [hasta, setHasta] = useState('')
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')
  const [enviando, setEnviando] = useState(false)

  // Escape cierra la ventana, y mientras está abierta no se desplaza la página de fondo
  useEffect(() => {
    function alPulsar(e) {
      if (e.key === 'Escape') onCerrar()
    }
    document.addEventListener('keydown', alPulsar)
    document.body.classList.add('modal-open')
    return () => {
      document.removeEventListener('keydown', alPulsar)
      document.body.classList.remove('modal-open')
    }
  }, [onCerrar])

  const catalogo = vehiculos ?? []
  const marcas = [...new Set(catalogo.map((v) => v.marca))].sort()
  const modelos = catalogo.filter((v) => v.marca === marca).map((v) => v.modelo)
  const vehiculo = catalogo.find((v) => v.marca === marca && v.modelo === modelo)
  const existentes = producto.compatibilidad ?? []

  function limpiarError(...campos) {
    setErrores((previo) => {
      const nuevo = { ...previo }
      campos.forEach((c) => delete nuevo[c])
      return nuevo
    })
  }

  function cambiarMarca(e) {
    setMarca(e.target.value)
    setModelo('')
    setDesde('')
    setHasta('')
    limpiarError('marca', 'modelo', 'desde', 'hasta')
  }

  // Al elegir el modelo, los años se rellenan con el rango completo del catálogo
  function cambiarModelo(e) {
    const valor = e.target.value
    const elegido = catalogo.find((v) => v.marca === marca && v.modelo === valor)
    setModelo(valor)
    setDesde(elegido ? String(elegido.desde) : '')
    setHasta(elegido ? String(elegido.hasta) : '')
    limpiarError('modelo', 'desde', 'hasta')
  }

  function validar() {
    const e = {}

    if (!marca) e.marca = 'Selecciona la marca.'
    if (!modelo) e.modelo = 'Selecciona el modelo.'
    else if (existentes.some((c) => c.marca === marca && c.modelo === modelo)) {
      e.modelo = 'Este vehículo ya está en la lista. Quítalo primero si quieres cambiar sus años.'
    }

    if (vehiculo) {
      const d = Number(desde)
      const h = Number(hasta)

      if (desde.trim() === '' || !Number.isInteger(d)) e.desde = 'Ingresa un año válido.'
      else if (d < vehiculo.desde || d > vehiculo.hasta) e.desde = `Debe estar entre ${vehiculo.desde} y ${vehiculo.hasta}.`

      if (hasta.trim() === '' || !Number.isInteger(h)) e.hasta = 'Ingresa un año válido.'
      else if (h < vehiculo.desde || h > vehiculo.hasta) e.hasta = `Debe estar entre ${vehiculo.desde} y ${vehiculo.hasta}.`
      else if (!e.desde && d > h) e.hasta = 'El año final no puede ser menor al inicial.'
    }

    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErrorGeneral('')

    const nuevos = validar()
    setErrores(nuevos)
    if (Object.keys(nuevos).length > 0) return

    const compatibilidad = [
      ...existentes,
      { marca, modelo, desde: Number(desde), hasta: Number(hasta) },
    ]

    setEnviando(true)
    try {
      await actualizarProducto(producto.id, { compatibilidad })
      onGuardado(`${marca} ${modelo}`)
    } catch (err) {
      setErrorGeneral(err.message)
      setEnviando(false)
    }
  }

  return (
    <>
      <div className="modal-backdrop show"></div>
      <div
        className="modal d-block"
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tituloModalCompatibilidad"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onCerrar()
        }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <form onSubmit={handleSubmit} noValidate>
              <div className="modal-header">
                <h2 className="modal-title fs-4" id="tituloModalCompatibilidad">Agregar vehículo compatible</h2>
                <button type="button" className="btn-close" aria-label="Cerrar" onClick={onCerrar}></button>
              </div>

              <div className="modal-body">
                <p className="mb-3">
                  <strong>{producto.nombre}</strong>
                  <br />
                  <span className="text-secondary">Ref. {producto.referencia}</span>
                </p>

                {cargando && (
                  <div className="text-center py-4" role="status">
                    <div className="spinner-border text-secondary" aria-hidden="true"></div>
                    <div className="mt-2 text-secondary">Cargando vehículos...</div>
                  </div>
                )}

                {errorCarga && (
                  <div className="alert alert-danger" role="alert">
                    {errorCarga}
                    <div className="mt-2">
                      <button type="button" className="btn btn-sm btn-outline-dark" onClick={recargar}>
                        <i className="bi bi-arrow-clockwise"></i> Reintentar
                      </button>
                    </div>
                  </div>
                )}

                {vehiculos && (
                  <>
                    {errorGeneral && <div className="alert alert-danger" role="alert">{errorGeneral}</div>}

                    <div className="row g-3">
                      <div className="col-12 col-md-6">
                        <label htmlFor="compat-marca" className="form-label">Marca</label>
                        <select
                          id="compat-marca"
                          className={`form-select ${errores.marca ? 'is-invalid' : ''}`}
                          value={marca}
                          onChange={cambiarMarca}
                        >
                          <option value="">Selecciona la marca</option>
                          {marcas.map((m) => <option key={m} value={m}>{m}</option>)}
                        </select>
                        <div className="invalid-feedback">{errores.marca}</div>
                      </div>

                      <div className="col-12 col-md-6">
                        <label htmlFor="compat-modelo" className="form-label">Modelo</label>
                        <select
                          id="compat-modelo"
                          className={`form-select ${errores.modelo ? 'is-invalid' : ''}`}
                          value={modelo}
                          onChange={cambiarModelo}
                          disabled={!marca}
                        >
                          <option value="">Selecciona el modelo</option>
                          {modelos.map((m) => <option key={m} value={m}>{m}</option>)}
                        </select>
                        <div className="invalid-feedback">{errores.modelo}</div>
                      </div>

                      <div className="col-12 col-md-6">
                        <label htmlFor="compat-desde" className="form-label">Año inicial</label>
                        <input
                          type="number"
                          id="compat-desde"
                          className={`form-control ${errores.desde ? 'is-invalid' : ''}`}
                          step="1"
                          value={desde}
                          disabled={!modelo}
                          onChange={(e) => {
                            setDesde(e.target.value)
                            limpiarError('desde', 'hasta')
                          }}
                        />
                        <div className="invalid-feedback">{errores.desde}</div>
                      </div>

                      <div className="col-12 col-md-6">
                        <label htmlFor="compat-hasta" className="form-label">Año final</label>
                        <input
                          type="number"
                          id="compat-hasta"
                          className={`form-control ${errores.hasta ? 'is-invalid' : ''}`}
                          step="1"
                          value={hasta}
                          disabled={!modelo}
                          onChange={(e) => {
                            setHasta(e.target.value)
                            limpiarError('desde', 'hasta')
                          }}
                        />
                        <div className="invalid-feedback">{errores.hasta}</div>
                      </div>
                    </div>

                    {vehiculo && (
                      <p className="form-text mt-2 mb-0">
                        Años disponibles para {vehiculo.marca} {vehiculo.modelo}: {vehiculo.desde}–{vehiculo.hasta}.
                      </p>
                    )}
                  </>
                )}
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline-secondary" onClick={onCerrar}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-señal" disabled={!vehiculos || enviando}>
                  {enviando ? 'Guardando...' : 'Agregar vehículo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}