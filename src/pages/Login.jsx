import { useState } from 'react'
import { useAuth } from '../context/useAuth'

const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Login() {
  const { iniciarSesion } = useAuth()

  const [correo, setCorreo] = useState('')
  const [clave, setClave] = useState('')
  const [verClave, setVerClave] = useState(false)
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')

  function validar() {
    const nuevos = {}

    if (!correo.trim()) nuevos.correo = 'Ingresa tu correo electrónico.'
    else if (!REGEX_CORREO.test(correo.trim())) nuevos.correo = 'Escribe un correo válido, por ejemplo nombre@correo.com.'

    if (!clave) nuevos.clave = 'Ingresa tu contraseña.'
    else if (clave.length < 6) nuevos.clave = 'La contraseña debe tener al menos 6 caracteres.'

    setErrores(nuevos)
    return Object.keys(nuevos).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    setErrorGeneral('')
    if (!validar()) return

    // Si las credenciales son correctas, RutaPublica redirige al dashboard
    const resultado = iniciarSesion(correo, clave)
    if (!resultado.ok) setErrorGeneral(resultado.error)
  }

  function cambiarCorreo(e) {
    setCorreo(e.target.value)
    setErrores((prev) => ({ ...prev, correo: undefined }))
  }

  function cambiarClave(e) {
    setClave(e.target.value)
    setErrores((prev) => ({ ...prev, clave: undefined }))
  }

  return (
    <main className="login-layout">
      {/* Panel de marca */}
      <section className="login-marca d-none d-lg-flex">
        <div className="marca-logo">
          <i className="bi bi-gear-wide-connected"></i> AutoRepuestos
        </div>
        <div>
          <h1 className="marca-titulo">
            El repuesto correcto,<br />para el vehículo correcto.
          </h1>
          <p className="marca-texto">
            Controla tu inventario y encuentra piezas compatibles por marca, modelo y año.
          </p>
        </div>
        <div className="placa-referencia" aria-hidden="true">
          <span>REF</span> 96 536 090
          <small>Filtro de aceite · Chevrolet Spark GT</small>
        </div>
      </section>

      {/* Formulario */}
      <section className="login-form-area">
        <div className="login-card">
          <div className="marca-logo marca-logo-oscuro d-lg-none mb-4">
            <i className="bi bi-gear-wide-connected"></i> AutoRepuestos
          </div>
          <h2 className="login-titulo">Iniciar sesión</h2>
          <p className="text-secondary mb-4">Ingresa con tu cuenta para gestionar el inventario.</p>

          {errorGeneral && (
            <div className="alert alert-danger" role="alert">{errorGeneral}</div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="correo" className="form-label">Correo electrónico</label>
              <input
                type="email"
                id="correo"
                className={`form-control form-control-lg ${errores.correo ? 'is-invalid' : ''}`}
                placeholder="nombre@correo.com"
                autoComplete="username"
                value={correo}
                onChange={cambiarCorreo}
              />
              <div className="invalid-feedback">{errores.correo}</div>
            </div>

            <div className="mb-4">
              <label htmlFor="clave" className="form-label">Contraseña</label>
              <div className="input-group has-validation">
                <input
                  type={verClave ? 'text' : 'password'}
                  id="clave"
                  className={`form-control form-control-lg ${errores.clave ? 'is-invalid' : ''}`}
                  placeholder="Mínimo 6 caracteres"
                  autoComplete="current-password"
                  value={clave}
                  onChange={cambiarClave}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  aria-label="Mostrar u ocultar contraseña"
                  onClick={() => setVerClave((v) => !v)}
                >
                  <i className={`bi ${verClave ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
                <div className="invalid-feedback">{errores.clave}</div>
              </div>
            </div>

            <button type="submit" className="btn btn-señal btn-lg w-100">Iniciar sesión</button>
          </form>

          <p className="credenciales-demo">
            <i className="bi bi-info-circle"></i> Cuenta de prueba:{' '}
            <strong>admin@autorepuestos.com</strong> / <strong>123456</strong>
          </p>
        </div>
      </section>
    </main>
  )
}