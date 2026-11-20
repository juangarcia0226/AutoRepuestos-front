import { useEffect, useState } from 'react'
import { crearUsuario, actualizarUsuario } from '../services/usuarioApi'
import { ErrorApi } from '../services/api'

const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const CLAVE_MINIMA = 6

// Ventana para crear (usuario = null) o editar un usuario
export default function ModalUsuario({ usuario = null, esPropio = false, onCerrar, onGuardado }) {
  const editando = usuario !== null
  const [valores, setValores] = useState(() =>
    editando
      ? { nombre: usuario.nombre, correo: usuario.correo, clave: '', rol: usuario.rol, activo: usuario.activo }
      : { nombre: '', correo: '', clave: '', rol: 'operador', activo: true },
  )
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

  function cambiar(nombre, valor) {
    setValores((previo) => ({ ...previo, [nombre]: valor }))
    setErrores((previo) => ({ ...previo, [nombre]: undefined }))
  }

  // Propiedades comunes de cada input de texto
  const campo = (nombre) => ({
    id: `usuario-${nombre}`,
    className: `form-control ${errores[nombre] ? 'is-invalid' : ''}`,
    value: valores[nombre],
    onChange: (e) => cambiar(nombre, e.target.value),
  })

  function validar() {
    const e = {}

    if (!valores.nombre.trim()) e.nombre = 'Ingresa el nombre.'

    if (!editando) {
      const correo = valores.correo.trim()
      if (!correo) e.correo = 'Ingresa el correo electrónico.'
      else if (!REGEX_CORREO.test(correo)) e.correo = 'Escribe un correo válido, por ejemplo nombre@correo.com.'

      if (!valores.clave) e.clave = 'Ingresa la contraseña.'
    }

    if (valores.clave && valores.clave.length < CLAVE_MINIMA) {
      e.clave = `La contraseña debe tener al menos ${CLAVE_MINIMA} caracteres.`
    }

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
      let guardado
      if (editando) {
        const datos = { nombre: valores.nombre.trim(), rol: valores.rol, activo: valores.activo }
        if (valores.clave) datos.clave = valores.clave
        guardado = await actualizarUsuario(usuario.id, datos)
      } else {
        guardado = await crearUsuario({
          nombre: valores.nombre.trim(),
          correo: valores.correo.trim(),
          clave: valores.clave,
          rol: valores.rol,
        })
      }
      onGuardado(guardado)
    } catch (err) {
      // 409: el correo ya existe, se muestra junto a su campo
      if (err instanceof ErrorApi && err.status === 409) {
        setErrores({ correo: err.message })
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
        aria-labelledby="tituloModalUsuario"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onCerrar()
        }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <form onSubmit={handleSubmit} noValidate>
              <div className="modal-header">
                <h2 className="modal-title fs-4" id="tituloModalUsuario">
                  {editando ? 'Editar usuario' : 'Agregar usuario'}
                </h2>
                <button type="button" className="btn-close" aria-label="Cerrar" onClick={onCerrar}></button>
              </div>

              <div className="modal-body">
                {errorGeneral && <div className="alert alert-danger" role="alert">{errorGeneral}</div>}

                <div className="row g-3">
                  <div className="col-12">
                    <label htmlFor="usuario-nombre" className="form-label">Nombre</label>
                    <input type="text" autoFocus {...campo('nombre')} />
                    <div className="invalid-feedback">{errores.nombre}</div>
                  </div>

                  <div className="col-12">
                    <label htmlFor="usuario-correo" className="form-label">Correo electrónico</label>
                    <input type="email" disabled={editando} autoComplete="off" {...campo('correo')} />
                    <div className="invalid-feedback">{errores.correo}</div>
                    {editando && <div className="form-text">El correo no se puede cambiar.</div>}
                  </div>

                  <div className="col-12 col-md-6">
                    <label htmlFor="usuario-clave" className="form-label">
                      {editando ? 'Nueva contraseña (opcional)' : 'Contraseña'}
                    </label>
                    <input type="password" autoComplete="new-password" {...campo('clave')} />
                    <div className="invalid-feedback">{errores.clave}</div>
                    {editando && <div className="form-text">Déjala vacía para conservar la actual.</div>}
                  </div>

                  <div className="col-12 col-md-6">
                    <label htmlFor="usuario-rol" className="form-label">Rol</label>
                    <select
                      id="usuario-rol"
                      className="form-select"
                      value={valores.rol}
                      disabled={esPropio}
                      onChange={(e) => cambiar('rol', e.target.value)}
                    >
                      <option value="operador">Operador</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </div>

                  {editando && (
                    <div className="col-12">
                      <div className="form-check form-switch">
                        <input
                          type="checkbox"
                          role="switch"
                          id="usuario-activo"
                          className="form-check-input"
                          checked={valores.activo}
                          disabled={esPropio}
                          onChange={(e) => cambiar('activo', e.target.checked)}
                        />
                        <label htmlFor="usuario-activo" className="form-check-label">Usuario activo</label>
                      </div>
                      <div className="form-text">Un usuario inactivo no puede iniciar sesión.</div>
                    </div>
                  )}
                </div>

                {esPropio && (
                  <p className="form-text mt-3 mb-0">
                    Es tu propia cuenta: no puedes cambiar tu rol ni desactivarla.
                  </p>
                )}
                <p className="form-text mt-3 mb-0">
                  El administrador puede gestionar usuarios, productos y vehículos. El operador puede consultar
                  y registrar entradas y salidas de stock.
                </p>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline-secondary" onClick={onCerrar}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-señal" disabled={enviando}>
                  {enviando ? 'Guardando...' : editando ? 'Guardar cambios' : 'Agregar usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}