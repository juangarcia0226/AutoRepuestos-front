import { useState } from "react";
import { obtenerVehiculos, eliminarVehiculo } from "../services/inventarioApi";
import { useCarga } from "../hooks/useCarga";
import TablaVehiculos from "../components/TablaVehiculos";
import ModalVehiculo from "../components/ModalVehiculo";
import EstadoCarga from "../components/EstadoCarga";
import Aviso from "../components/Aviso";

export default function CatalogoVehiculos() {
  const {
    datos: vehiculos,
    cargando,
    error,
    recargar,
  } = useCarga(obtenerVehiculos);
  const [modal, setModal] = useState(null); // null | { vehiculo: objeto | null }
  const [aviso, setAviso] = useState(null);

  async function eliminar(vehiculo) {
    const nombre = `${vehiculo.marca} ${vehiculo.modelo}`;
    if (!window.confirm(`¿Eliminar ${nombre} del catálogo?`)) return;

    try {
      await eliminarVehiculo(vehiculo.id);
      setAviso(`Vehículo eliminado: ${nombre}.`);
      recargar();
    } catch (e) {
      setAviso(e.message);
    }
  }

  return (
    <>
      <EstadoCarga cargando={cargando} error={error} onReintentar={recargar}>
        {vehiculos && (
          <TablaVehiculos
            vehiculos={vehiculos}
            onAgregar={() => setModal({ vehiculo: null })}
            onEditar={(vehiculo) => setModal({ vehiculo })}
            onEliminar={eliminar}
          />
        )}
      </EstadoCarga>

      {modal && (
        <ModalVehiculo
          vehiculo={modal.vehiculo}
          vehiculos={vehiculos ?? []}
          onCerrar={() => setModal(null)}
          onGuardado={(guardado) => {
            setModal(null);

            let texto = `Vehículo ${modal.vehiculo ? "actualizado" : "agregado"}: ${guardado.marca} ${guardado.modelo}.`;
            const { productosAjustados = 0, compatibilidadesQuitadas = 0 } =
              guardado.ajuste ?? {};
            if (productosAjustados > 0) {
              texto += ` Se ajustó la compatibilidad de ${productosAjustados} ${productosAjustados === 1 ? "producto" : "productos"}`;
              texto +=
                compatibilidadesQuitadas > 0
                  ? `; en ${compatibilidadesQuitadas} se quitó el vehículo por quedar sin años válidos.`
                  : ".";
            }

            setAviso(texto);
            recargar();
          }}
        />
      )}

      <Aviso
        mensaje={aviso}
        visible={aviso !== null}
        onCerrar={() => setAviso(null)}
        duracion={6000}
      />
    </>
  );
}
