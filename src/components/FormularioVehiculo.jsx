import { useState } from 'react'

export default function FormularioVehiculo({ vehiculos, onBuscar, onCambio }) {
  const [marca, setMarca] = useState('')
  const [modelo, setModelo] = useState('')
  const [anio, setAnio] = useState('')
  const [errores, setErrores] = useState({})

  // Las listas se calculan a partir de lo que ya se eligió
  const marcas = [...new Set(vehiculos.map((v) => v.marca))].sort()
  const modelos = vehiculos.filter((v) => v.marca === marca).map((v) => v.modelo)
  const vehiculo = vehiculos.find((v) => v.marca === marca && v.modelo === modelo)
  const anios = []
  if (vehiculo) for (let a = vehiculo.hasta; a >= vehiculo.desde; a--) anios.push(a)

  function cambiarMarca(e) {
    setMarca(e.target.value)
    setModelo('')
    setAnio('')
    setErrores((prev) => ({ ...prev, marca: false }))
    onCambio()
  }

  function cambiarModelo(e) {
    setModelo(e.target.value)
    setAnio('')
    setErrores((prev) => ({ ...prev, modelo: false }))
    onCambio()
  }

  function cambiarAnio(e) {
    setAnio(e.target.value)
    setErrores((prev) => ({ ...prev, anio: false }))
    onCambio()
  }

  function handleSubmit(e) {
    e.preventDefault()
    const nuevos = { marca: !marca, modelo: !modelo, anio: !anio }
    setErrores(nuevos)
    if (nuevos.marca || nuevos.modelo || nuevos.anio) return
    onBuscar(marca, modelo, Number(anio))
  }

  return (
    <section className="veh-buscador" aria-label="Datos del vehículo">
      <h2 className="veh-buscador-titulo">¿Para qué vehículo es el repuesto?</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="row g-3 align-items-start">
          <div className="col-12 col-md-6 col-xl-3">
            <label htmlFor="selMarca" className="form-label">Marca</label>
            <select
              id="selMarca"
              className={`form-select ${errores.marca ? 'is-invalid' : ''}`}
              value={marca}
              onChange={cambiarMarca}
            >
              <option value="">Selecciona la marca</option>
              {marcas.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <div className="invalid-feedback">Selecciona la marca.</div>
          </div>

          <div className="col-12 col-md-6 col-xl-3">
            <label htmlFor="selModelo" className="form-label">Modelo</label>
            <select
              id="selModelo"
              className={`form-select ${errores.modelo ? 'is-invalid' : ''}`}
              value={modelo}
              onChange={cambiarModelo}
              disabled={!marca}
            >
              <option value="">Selecciona el modelo</option>
              {modelos.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <div className="invalid-feedback">Selecciona el modelo.</div>
          </div>

          <div className="col-12 col-md-6 col-xl-3">
            <label htmlFor="selAnio" className="form-label">Año</label>
            <select
              id="selAnio"
              className={`form-select ${errores.anio ? 'is-invalid' : ''}`}
              value={anio}
              onChange={cambiarAnio}
              disabled={!modelo}
            >
              <option value="">Selecciona el año</option>
              {anios.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
            <div className="invalid-feedback">Selecciona el año.</div>
          </div>

          <div className="col-12 col-md-6 col-xl-3">
            <label className="form-label d-none d-xl-block">&nbsp;</label>
            <button type="submit" className="btn btn-señal w-100">
              <i className="bi bi-search"></i> Buscar
            </button>
          </div>
        </div>
      </form>
    </section>
  )
}