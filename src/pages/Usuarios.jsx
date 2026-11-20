import { useState } from 'react'
import { obtenerUsuarios, eliminarUsuario } from '../services/usuarioApi'
import { useAuth } from '../context/useAuth'
import { useCarga } from '../hooks/useCarga'
import TablaUsuarios from '../components/TablaUsuarios'
import ModalUsuario from '../components/ModalUsuario'
import ModalConfirmar from '../components/ModalConfirmar'
import EstadoCarga from '../components/EstadoCarga'
import Aviso from '../components/Aviso'

export default function Usuarios() {
  const { usuario, actualizarSesion } = useAuth()
  const { datos: usuarios, cargando, error, recargar } = useCarga(obtenerUsuarios)
  const [modal, setModal] = useState(null) // null | { usuario: objeto | null }
  const [porEliminar, setPorEliminar] = useState(null)
  const [eliminando, setEliminando] = useState(false)
  const [errorEliminar, setErrorEliminar] = useState('')
  const [aviso, setAviso] = useState(null)

  async function eliminar() {
    setEliminando(true)
    setErrorEliminar('')
    try {
      await eliminarUsuario(porEliminar.id)
      setAviso(`Usuario eliminado: ${porEliminar.nombre}.`)
      setPorEliminar(null)
      setEliminando(false)
      recargar()
    } catch (e) {
      setErrorEliminar(e.message)
      setEliminando(false)
    }
  }

  return (
    <>
      <EstadoCarga cargando={cargando} error={error} onReintentar={recargar}>
        {usuarios && (
          <TablaUsuarios
            usuarios={usuarios}
            idActual={usuario.id}
            onAgregar={() => setModal({ usuario: null })}
            onEditar={(u) => setModal({ usuario: u })}
            onEliminar={(u) => {
              setErrorEliminar('')
              setPorEliminar(u)
            }}
          />
        )}
      </EstadoCarga>

      {modal && (
        <ModalUsuario
          usuario={modal.usuario}
          esPropio={modal.usuario?.id === usuario.id}
          onCerrar={() => setModal(null)}
          onGuardado={(guardado) => {
            setModal(null)
            setAviso(`Usuario ${modal.usuario ? 'actualizado' : 'agregado'}: ${guardado.nombre}.`)
            // Si el administrador editó su propia cuenta, se actualiza el nombre del menú
            if (guardado.id === usuario.id) {
              actualizarSesion({ id: guardado.id, nombre: guardado.nombre, correo: guardado.correo, rol: guardado.rol })
            }
            recargar()
          }}
        />
      )}

      {porEliminar && (
        <ModalConfirmar
          titulo="Eliminar usuario"
          mensaje={
            <>
              <p>
                ¿Seguro que quieres eliminar a <strong>{porEliminar.nombre}</strong> ({porEliminar.correo})?
              </p>
              <p className="mb-0 text-secondary">
                Esta acción no se puede deshacer. Si solo quieres impedir que inicie sesión, es mejor desactivarlo.
              </p>
            </>
          }
          textoConfirmar="Eliminar usuario"
          enviando={eliminando}
          error={errorEliminar}
          onConfirmar={eliminar}
          onCerrar={() => setPorEliminar(null)}
        />
      )}

      <Aviso mensaje={aviso} visible={aviso !== null} onCerrar={() => setAviso(null)} />
    </>
  )
}