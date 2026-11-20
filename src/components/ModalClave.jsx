import { useEffect, useState } from 'react'
import { cambiarClave } from '../services/authService'

const CLAVE_MINIMA = 6

// Ventana para que el usuario cambie su propia contraseña
export default function ModalClave({ onCerrar, onCambiada }) {
  const [valores, setValores] = useState({ claveActual: '', claveNueva: '', confirmar: '' })
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

  const campo = (nombre, autoComplete) => ({
    id: `clave-${nombre}`,
    type: 'password',
    autoComplete,
    className: `form-control ${errores[nombre] ? 'is-invalid' : ''}`,
    value: valores[nombre],
    onChange: (e) => {
      setValores((previo) => ({ ...previo, [nombre]: e.target.value }))
      setErrores((previo) => ({ ...previo, [nombre]: undefined }))
    },
  })

  function validar() {
    const e = {}

    if (!valores.claveActual) e.claveActual = 'Ingresa tu contraseña actual.'

    if (!valores.claveNueva) e.claveNueva = 'Ingresa la nueva contraseña.'
    else if (valores.claveNueva.length < CLAVE_MINIMA) e.claveNueva = `Debe tener al menos ${CLAVE_MINIMA} caracteres.`
    else if (valores.claveNueva === valores.claveActual) e.claveNueva = 'Debe ser distinta a la actual.'

    if (valores.confirmar !== valores.claveNueva) e.confirmar = 'Las contraseñas no coinciden.'

    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErrorGeneral('')

    const nuevos = validar()
    setErrores(nuevos)
    if (Object.keys(nuevos).length > 0) return

    setEnviando(true)
    try {
      await cambiarClave(valores.claveActual, valores.claveNueva)
      onCambiada()
    } catch (err) {
      // El backend responde 400 si la contraseña actual no coincide
      if (err.message.includes('actual es incorrecta')) {
        setErrores({ claveActual: err.message })
      } else {
        setErrorGeneral(err.message)
      }
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
        aria-labelledby="tituloModalClave"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onCerrar()
        }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <form onSubmit={handleSubmit} noValidate>
              <div className="modal-header">
                <h2 className="modal-title fs-4" id="tituloModalClave">Cambiar contraseña</h2>
                <button type="button" className="btn-close" aria-label="Cerrar" onClick={onCerrar}></button>
              </div>

              <div className="modal-body">
                {errorGeneral && <div className="alert alert-danger" role="alert">{errorGeneral}</div>}

                <div className="mb-3">
                  <label htmlFor="clave-claveActual" className="form-label">Contraseña actual</label>
                  <input autoFocus {...campo('claveActual', 'current-password')} />
                  <div className="invalid-feedback">{errores.claveActual}</div>
                </div>

                <div className="mb-3">
                  <label htmlFor="clave-claveNueva" className="form-label">Nueva contraseña</label>
                  <input {...campo('claveNueva', 'new-password')} />
                  <div className="invalid-feedback">{errores.claveNueva}</div>
                </div>

                <div>
                  <label htmlFor="clave-confirmar" className="form-label">Confirmar nueva contraseña</label>
                  <input {...campo('confirmar', 'new-password')} />
                  <div className="invalid-feedback">{errores.confirmar}</div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline-secondary" onClick={onCerrar}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-señal" disabled={enviando}>
                  {enviando ? 'Guardando...' : 'Cambiar contraseña'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}