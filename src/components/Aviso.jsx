import { useEffect } from 'react'

// Aviso temporal (toast de Bootstrap controlado con estado de React)
export default function Aviso({ mensaje, visible, onCerrar, duracion = 2500 }) {
  useEffect(() => {
    if (!visible) return
    const temporizador = setTimeout(onCerrar, duracion)
    return () => clearTimeout(temporizador)
  }, [visible, onCerrar, duracion])

  if (!visible) return null

  return (
    <div className="toast-container position-fixed bottom-0 end-0 p-3">
      <div className="toast show" role="status" aria-live="polite">
        <div className="toast-body">{mensaje}</div>
      </div>
    </div>
  )
}