import { useEffect, useState } from 'react'

// Ejecuta una función asíncrona al montar y controla los estados de carga y error.
// La función debe ser estable (definida fuera del componente o con useCallback).
export function useCarga(funcion) {
  const [estado, setEstado] = useState({ datos: null, cargando: true, error: null })
  const [intento, setIntento] = useState(0)

  useEffect(() => {
    let cancelado = false

    funcion()
      .then((datos) => {
        if (!cancelado) setEstado({ datos, cargando: false, error: null })
      })
      .catch((e) => {
        if (!cancelado) setEstado({ datos: null, cargando: false, error: e.message })
      })

    return () => {
      cancelado = true
    }
  }, [funcion, intento])

  function recargar() {
    setEstado((previo) => ({ ...previo, cargando: true, error: null }))
    setIntento((n) => n + 1)
  }

  return { ...estado, recargar }
}