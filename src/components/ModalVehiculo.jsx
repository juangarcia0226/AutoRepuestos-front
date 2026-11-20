import { useEffect, useState } from "react";
import { crearVehiculo, actualizarVehiculo } from "../services/inventarioApi";
import { ErrorApi } from "../services/api";

const ANIO_MINIMO = 1900;
const ANIO_MAXIMO = new Date().getFullYear() + 1;

// Ventana para crear (vehiculo = null) o editar un vehículo del catálogo
export default function ModalVehiculo({
  vehiculo = null,
  vehiculos,
  onCerrar,
  onGuardado,
}) {
  const editando = vehiculo !== null;
  const [valores, setValores] = useState(() =>
    editando
      ? {
          marca: vehiculo.marca,
          modelo: vehiculo.modelo,
          desde: String(vehiculo.desde),
          hasta: String(vehiculo.hasta),
        }
      : { marca: "", modelo: "", desde: "", hasta: "" },
  );
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");
  const [enviando, setEnviando] = useState(false);

  // Escape cierra la ventana, y mientras está abierta no se desplaza la página de fondo
  useEffect(() => {
    function alPulsar(e) {
      if (e.key === "Escape") onCerrar();
    }
    document.addEventListener("keydown", alPulsar);
    document.body.classList.add("modal-open");
    return () => {
      document.removeEventListener("keydown", alPulsar);
      document.body.classList.remove("modal-open");
    };
  }, [onCerrar]);

  const marcas = [...new Set(vehiculos.map((v) => v.marca))].sort();

  // Avisa cuando el nuevo rango es más estrecho y hay productos que dependen de él
  const reduceRango =
    editando &&
    vehiculo.productos > 0 &&
    valores.desde.trim() !== "" &&
    valores.hasta.trim() !== "" &&
    (Number(valores.desde) > vehiculo.desde ||
      Number(valores.hasta) < vehiculo.hasta);

  // Propiedades comunes de cada input
  const campo = (nombre) => ({
    id: `vehiculo-${nombre}`,
    className: `form-control ${errores[nombre] ? "is-invalid" : ""}`,
    value: valores[nombre],
    onChange: (e) => {
      setValores((previo) => ({ ...previo, [nombre]: e.target.value }));
      setErrores((previo) => ({
        ...previo,
        [nombre]: undefined,
        ...(nombre === "desde" || nombre === "hasta"
          ? { hasta: undefined }
          : {}),
      }));
    },
  });

  function validar() {
    const e = {};
    const marca = valores.marca.trim();
    const modelo = valores.modelo.trim();

    if (!editando) {
      if (!marca) e.marca = "Ingresa la marca.";
      if (!modelo) e.modelo = "Ingresa el modelo.";
      else if (
        marca &&
        vehiculos.some(
          (v) =>
            v.marca.toLowerCase() === marca.toLowerCase() &&
            v.modelo.toLowerCase() === modelo.toLowerCase(),
        )
      ) {
        e.modelo = "Ya existe un vehículo con esa marca y modelo.";
      }
    }

    const d = Number(valores.desde);
    const h = Number(valores.hasta);

    if (valores.desde.trim() === "" || !Number.isInteger(d))
      e.desde = "Ingresa un año válido.";
    else if (d < ANIO_MINIMO || d > ANIO_MAXIMO)
      e.desde = `Debe estar entre ${ANIO_MINIMO} y ${ANIO_MAXIMO}.`;

    if (valores.hasta.trim() === "" || !Number.isInteger(h))
      e.hasta = "Ingresa un año válido.";
    else if (h < ANIO_MINIMO || h > ANIO_MAXIMO)
      e.hasta = `Debe estar entre ${ANIO_MINIMO} y ${ANIO_MAXIMO}.`;

    if (!e.desde && !e.hasta && d > h)
      e.hasta = "El año final no puede ser menor al inicial.";

    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorGeneral("");

    const nuevos = validar();
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;

    const anios = {
      desde: Number(valores.desde),
      hasta: Number(valores.hasta),
    };

    setEnviando(true);
    try {
      const guardado = editando
        ? await actualizarVehiculo(vehiculo.id, anios)
        : await crearVehiculo({
            marca: valores.marca.trim(),
            modelo: valores.modelo.trim(),
            ...anios,
          });
      onGuardado(guardado);
    } catch (err) {
      // 409: ya existe la combinación marca + modelo, se muestra junto a su campo
      if (err instanceof ErrorApi && err.status === 409) {
        setErrores({ modelo: err.message });
      } else {
        setErrorGeneral(err.message);
      }
      setEnviando(false);
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
        aria-labelledby="tituloModalVehiculo"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onCerrar();
        }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <form onSubmit={handleSubmit} noValidate>
              <div className="modal-header">
                <h2 className="modal-title fs-4" id="tituloModalVehiculo">
                  {editando ? "Editar vehículo" : "Agregar vehículo"}
                </h2>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Cerrar"
                  onClick={onCerrar}
                ></button>
              </div>

              <div className="modal-body">
                {errorGeneral && (
                  <div className="alert alert-danger" role="alert">
                    {errorGeneral}
                  </div>
                )}

                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label htmlFor="vehiculo-marca" className="form-label">
                      Marca
                    </label>
                    <input
                      type="text"
                      list="marcasVehiculo"
                      autoFocus={!editando}
                      disabled={editando}
                      {...campo("marca")}
                    />
                    <datalist id="marcasVehiculo">
                      {marcas.map((m) => (
                        <option key={m} value={m} />
                      ))}
                    </datalist>
                    <div className="invalid-feedback">{errores.marca}</div>
                  </div>

                  <div className="col-12 col-md-6">
                    <label htmlFor="vehiculo-modelo" className="form-label">
                      Modelo
                    </label>
                    <input
                      type="text"
                      disabled={editando}
                      {...campo("modelo")}
                    />
                    <div className="invalid-feedback">{errores.modelo}</div>
                  </div>

                  <div className="col-12 col-md-6">
                    <label htmlFor="vehiculo-desde" className="form-label">
                      Año inicial
                    </label>
                    <input
                      type="number"
                      step="1"
                      autoFocus={editando}
                      {...campo("desde")}
                    />
                    <div className="invalid-feedback">{errores.desde}</div>
                  </div>

                  <div className="col-12 col-md-6">
                    <label htmlFor="vehiculo-hasta" className="form-label">
                      Año final
                    </label>
                    <input type="number" step="1" {...campo("hasta")} />
                    <div className="invalid-feedback">{errores.hasta}</div>
                  </div>
                </div>

                {editando && (
                  <p className="form-text mt-3 mb-0">
                    La marca y el modelo no se pueden cambiar.
                  </p>
                )}

                {reduceRango && (
                  <div className="alert alert-warning mt-3 mb-0" role="status">
                    Al reducir el rango se recortarán los años de los productos
                    que tienen este vehículo como compatible (hay{" "}
                    {vehiculo.productos}). Si alguno se queda sin ningún año
                    válido, se quitará el vehículo de ese producto. Si amplías
                    el rango, los productos no cambian.
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={onCerrar}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-señal"
                  disabled={enviando}
                >
                  {enviando
                    ? "Guardando..."
                    : editando
                      ? "Guardar cambios"
                      : "Agregar vehículo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
