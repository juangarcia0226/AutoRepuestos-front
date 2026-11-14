import { useEffect, useState } from 'react'
import { crearProducto, actualizarProducto } from '../services/inventarioApi'
import { ErrorApi } from '../services/api'

// Sugerencias para el campo categoría (se puede escribir otra)
const CATEGORIAS = ['Accesorios', 'Eléctrico', 'Encendido', 'Filtros', 'Frenos', 'Motor', 'Suspensión', 'Transmisión']

const VACIO = {
  nombre: '',
  referencia: '',
  marca: '',
  categoria: '',
  stock: '0',
  stockMinimo: '0',
  precio: '',
  ubicacion: '',
}

function aFormulario(p) {
  return {
    nombre: p.nombre,
    referencia: p.referencia,
    marca: p.marca,
    categoria: p.categoria,
    stock: String(p.stock),
    stockMinimo: String(p.stockMinimo),
    precio: String(p.precio),
    ubicacion: p.ubicacion ?? '',
  }
}

function validar(v) {
  const e = {}

  const nombre = v.nombre.trim()
  if (!nombre) e.nombre = 'Ingresa el nombre.'
  else if (nombre.length < 2) e.nombre = 'El nombre debe tener al menos 2 caracteres.'

  if (!v.referencia.trim()) e.referencia = 'Ingresa la referencia.'
  if (!v.marca.trim()) e.marca = 'Ingresa la marca.'
  if (!v.categoria.trim()) e.categoria = 'Ingresa la categoría.'

  const precio = Number(v.precio)
  if (v.precio.trim() === '') e.precio = 'Ingresa el precio.'
  else if (!Number.isFinite(precio) || precio < 0) e.precio = 'El precio debe ser un número mayor o igual a 0.'

  for (const [clave, texto] of [['stock', 'El stock'], ['stockMinimo', 'El stock mínimo']]) {
    const n = Number(v[clave])
    if (v[clave].trim() === '' || !Number.isInteger(n) || n < 0) {
      e[clave] = `${texto} debe ser un entero mayor o igual a 0.`
    }
  }

  return e
}

function Campo({ id, etiqueta, error, columnas = 'col-12 col-md-6', children }) {
  return (
    <div className={columnas}>
      <label htmlFor={id} className="form-label">{etiqueta}</label>
      {children}
      <div className="invalid-feedback">{error}</div>
    </div>
  )
}

// Ventana para crear (producto = null) o editar un producto
export default function ModalProducto({ producto = null, onCerrar, onGuardado }) {
  const editando = producto !== null
  const [valores, setValores] = useState(() => (editando ? aFormulario(producto) : { ...VACIO }))
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

  // Propiedades comunes de cada input
  const campo = (nombre) => ({
    id: `producto-${nombre}`,
    className: `form-control ${errores[nombre] ? 'is-invalid' : ''}`,
    value: valores[nombre],
    onChange: (e) => {
      setValores((previo) => ({ ...previo, [nombre]: e.target.value }))
      setErrores((previo) => ({ ...previo, [nombre]: undefined }))
    },
  })

  async function handleSubmit(e) {
    e.preventDefault()
    setErrorGeneral('')

    const nuevos = validar(valores)
    setErrores(nuevos)
    if (Object.keys(nuevos).length > 0) return

    const datos = {
      nombre: valores.nombre.trim(),
      referencia: valores.referencia.trim(),
      marca: valores.marca.trim(),
      categoria: valores.categoria.trim(),
      stock: Number(valores.stock),
      stockMinimo: Number(valores.stockMinimo),
      precio: Number(valores.precio),
      ubicacion: valores.ubicacion.trim(),
    }

    setEnviando(true)
    try {
      const guardado = editando
        ? await actualizarProducto(producto.id, datos)
        : await crearProducto(datos)
      onGuardado(guardado)
    } catch (err) {
      // 409: la referencia ya existe, se muestra junto a su campo
      if (err instanceof ErrorApi && err.status === 409) {
        setErrores({ referencia: err.message })
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
        aria-labelledby="tituloModalProducto"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onCerrar()
        }}
      >
        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <form onSubmit={handleSubmit} noValidate className="d-flex flex-column overflow-hidden">
              <div className="modal-header">
                <h2 className="modal-title fs-4" id="tituloModalProducto">
                  {editando ? 'Editar producto' : 'Agregar producto'}
                </h2>
                <button type="button" className="btn-close" aria-label="Cerrar" onClick={onCerrar}></button>
              </div>

              <div className="modal-body">
                {errorGeneral && <div className="alert alert-danger" role="alert">{errorGeneral}</div>}

                <div className="row g-3">
                  <Campo id="producto-nombre" etiqueta="Nombre" error={errores.nombre} columnas="col-12">
                    <input type="text" autoFocus {...campo('nombre')} />
                  </Campo>

                  <Campo id="producto-referencia" etiqueta="Referencia" error={errores.referencia}>
                    <input type="text" {...campo('referencia')} />
                  </Campo>

                  <Campo id="producto-marca" etiqueta="Marca" error={errores.marca}>
                    <input type="text" {...campo('marca')} />
                  </Campo>

                  <Campo id="producto-categoria" etiqueta="Categoría" error={errores.categoria}>
                    <input type="text" list="categoriasProducto" {...campo('categoria')} />
                    <datalist id="categoriasProducto">
                      {CATEGORIAS.map((c) => <option key={c} value={c} />)}
                    </datalist>
                  </Campo>

                  <Campo id="producto-precio" etiqueta="Precio (COP)" error={errores.precio}>
                    <input type="number" min="0" {...campo('precio')} />
                  </Campo>

                  <Campo id="producto-stock" etiqueta="Stock" error={errores.stock}>
                    <input type="number" min="0" step="1" {...campo('stock')} />
                  </Campo>

                  <Campo id="producto-stockMinimo" etiqueta="Stock mínimo" error={errores.stockMinimo}>
                    <input type="number" min="0" step="1" {...campo('stockMinimo')} />
                  </Campo>

                  <Campo id="producto-ubicacion" etiqueta="Ubicación en la tienda" error={errores.ubicacion} columnas="col-12">
                    <input type="text" placeholder="Pasillo A · Estante 2" {...campo('ubicacion')} />
                  </Campo>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline-secondary" onClick={onCerrar}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-señal" disabled={enviando}>
                  {enviando ? 'Guardando...' : editando ? 'Guardar cambios' : 'Agregar producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}