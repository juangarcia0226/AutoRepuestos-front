// variante: '' | 'bajo' | 'agotado' (define el color del borde izquierdo)
export default function TarjetaResumen({ valor, texto, icono, variante = '' }) {
  return (
    <div className={`dash-tarjeta ${variante}`}>
      <div>
        <div className="dash-tarjeta-valor">{valor}</div>
        <div className="dash-tarjeta-texto">{texto}</div>
      </div>
      <i className={`bi ${icono}`}></i>
    </div>
  )
}