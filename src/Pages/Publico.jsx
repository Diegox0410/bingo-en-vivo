import { useEffect, useState } from "react";
import RegistroForm from "../Components/RegistroForm";

import {
  collection,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../services/Firebase";

export default function Publico() {
  const [participantes, setParticipantes] =
    useState([]);

  const [numeroBusqueda,
    setNumeroBusqueda] =
    useState("");

  useEffect(() => {
    const unsubscribe =
      onSnapshot(
        collection(
          db,
          "participantes"
        ),
        (snapshot) => {
          const datos =
            snapshot.docs.map(
              (doc) => ({
                id: doc.id,
                ...doc.data(),
              })
            );

          setParticipantes(datos);
        }
      );

    return () => unsubscribe();
  }, []);

  const numero =
    Number(numeroBusqueda);

  const ocupado =
    participantes.some(
      (p) =>
        Number(p.numero) === numero
    );

  return (
    <div className="publico-container">

      {/* Nubes */}
      <div className="nube nube1"></div>
      <div className="nube nube2"></div>
      <div className="nube nube3"></div>

      {/* Monedas */}
      <div className="moneda moneda1">🪙</div>
      <div className="moneda moneda2">🪙</div>
      <div className="moneda moneda3">🪙</div>

      {/* Bebé caminando */}
      <div className="bebe">
        👶
      </div>

      {/* Tubería */}
      <div className="tuberia"></div>

      <h1>
        🎟️ GRAN RIFA BENÉFICA
      </h1>

      <div className="plataformas">
        <div className="bloque-mario"></div>
        <div className="bloque-mario"></div>
        <div className="bloque-mario"></div>
      </div>

      <h2>
        Números ocupados:
        {" "}
        {participantes.length}
      </h2>

      <div className="buscador-card">

        <h2>
          🔍 Buscar Número
        </h2>

        <input
          type="number"
          min="1"
          max="1000"
          placeholder="Ingrese un número"
          value={numeroBusqueda}
          onChange={(e) =>
            setNumeroBusqueda(
              e.target.value
            )
          }
        />

        {numeroBusqueda &&
          numero >= 1 &&
          numero <= 1000 && (

          <div>

            {ocupado ? (
              <h2 className="ocupado">
                🔴 Número Ocupado
              </h2>
            ) : (
              <h2 className="disponible">
                🟢 Número Disponible
              </h2>
            )}

          </div>

        )}

      </div>

      {numeroBusqueda &&
        numero >= 1 &&
        numero <= 1000 &&
        !ocupado && (

        <RegistroForm
          numero={numero}
          onRegistrado={() =>
            setNumeroBusqueda("")
          }
        />

      )}

    </div>
  );
}