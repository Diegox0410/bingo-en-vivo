import { useEffect, useState } from "react";
import RegistroForm from "../Components/RegistroForm";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../services/Firebase";

export default function Publico() {
  const [participantes, setParticipantes] = useState([]);

  const [busqueda, setBusqueda] = useState("");
  const [numeroEncontrado, setNumeroEncontrado] = useState(null);
  const [ocupado, setOcupado] = useState(false);

  const [seleccionados, setSeleccionados] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "participantes"), (snapshot) => {
      const datos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setParticipantes(datos);
    });

    return () => unsubscribe();
  }, []);

  // 🔥 BUSQUEDA AUTOMÁTICA
  useEffect(() => {
    const num = Number(busqueda);

    if (!num || num < 1 || num > 1000) {
      setNumeroEncontrado(null);
      setOcupado(false);
      return;
    }

    const estaOcupado = participantes.some((p) =>
      String(p.numero).split(",").includes(String(num))
    );

    setNumeroEncontrado(num);
    setOcupado(estaOcupado);
  }, [busqueda, participantes]);

  // ➕ agregar número
  const agregarNumero = () => {
    if (ocupado) return;

    if (!seleccionados.includes(numeroEncontrado)) {
      setSeleccionados([...seleccionados, numeroEncontrado]);
    }
  };

  // ❌ eliminar número
  const eliminarNumero = (num) => {
    setSeleccionados(seleccionados.filter((n) => n !== num));
  };

  return (
    <div className="publico-container">

      <h1>🎟️ GRAN RIFA BENÉFICA</h1>

      {/* 🔵 BUSCADOR */}
      <div className="buscador-card">

        <h2>🔍 Buscar número</h2>

        <input
          className="buscador-input"
          type="number"
          min="1"
          max="1000"
          placeholder="Escribe un número..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        {numeroEncontrado && (
          <div style={{ marginTop: 15 }}>

            <p>
              Número: <b>{numeroEncontrado}</b>
            </p>

            {ocupado ? (
              <h3 style={{ color: "red" }}>🔴 Ocupado</h3>
            ) : (
              <>
                <h3 style={{ color: "green" }}>🟢 Disponible</h3>

                <button
                  className="btn btn-agregar"
                  onClick={agregarNumero}
                >
                  Agregar número
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* 🟡 SELECCIONADOS */}
      <div className="seleccionados-box">
        <h3>Números seleccionados</h3>

        {seleccionados.length === 0 ? (
          <p>Ninguno seleccionado</p>
        ) : (
          seleccionados.map((n) => (
            <div key={n}>
              {n}
              <button onClick={() => eliminarNumero(n)}>❌</button>
            </div>
          ))
        )}
      </div>

      {/* 🟢 FORMULARIO */}
      <RegistroForm
        seleccionados={seleccionados}
        setSeleccionados={setSeleccionados}
        participantes={participantes}
      />
    </div>
  );
}