import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "../services/Firebase";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ADMIN_PASSWORD = "EMILIOSO2026";

export default function Admin() {
  const [autenticado, setAutenticado] = useState(false);
  const [password, setPassword] = useState("");
  const [participantes, setParticipantes] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  // 🎯 TABS
  const [vista, setVista] = useState("tabla"); // tabla | numeros | sorteo

  // 🎲 sorteo
  const [ganador, setGanador] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "participantes"),
      (snapshot) => {
        const datos = snapshot.docs.map((docu) => ({
          id: docu.id,
          ...docu.data(),
        }));

        setParticipantes(datos);
      }
    );

    return () => unsubscribe();
  }, []);

  // 🔐 LOGIN
  if (!autenticado) {
    return (
      <div className="login-admin">
        <h1>🔐 Acceso Administrador</h1>

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={() => {
            if (password === ADMIN_PASSWORD) {
              setAutenticado(true);
            } else {
              alert("Contraseña incorrecta");
            }
          }}
        >
          Entrar
        </button>
      </div>
    );
  }

  // ❌ ELIMINAR
  const eliminar = async (id) => {
    const confirmar = window.confirm("¿Eliminar participante?");
    if (!confirmar) return;

    try {
      await deleteDoc(doc(db, "participantes", id));
    } catch (error) {
      console.error(error);
      alert("Error al eliminar");
    }
  };

  // 📥 EXPORTAR EXCEL
  const exportarExcel = () => {
    const datos = participantes.map((p) => ({
      Nombre: p.nombre || "",
      Telefono: p.telefono || "",
      Numero: p.numero || "",
      Fecha: p.fecha
        ? new Date(p.fecha.seconds * 1000).toLocaleString()
        : "",
    }));

    const hoja = XLSX.utils.json_to_sheet(datos);
    const libro = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(libro, hoja, "Participantes");

    const excelBuffer = XLSX.write(libro, {
      bookType: "xlsx",
      type: "array",
    });

    const archivo = new Blob([excelBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(archivo, `participantes_${Date.now()}.xlsx`);
  };

  // 🔍 FILTRO
  const filtrados = participantes.filter(
    (p) =>
      (p.nombre || "").toLowerCase().includes(busqueda.toLowerCase()) ||
      (p.telefono || "").toString().includes(busqueda) ||
      (p.numero || "").toString().includes(busqueda)
  );

  // =========================
  // 🔥 CONTEO SEGURO
  // =========================
  const TOTAL_NUMEROS = 1000;

  const numerosUnicos = new Set();

  participantes.forEach((p) => {
    if (!p.numero) return;

    String(p.numero)
      .split(",")
      .map((n) => n.trim())
      .filter(Boolean)
      .forEach((n) => numerosUnicos.add(Number(n)));
  });

  const ocupados = numerosUnicos.size;
  const disponibles = TOTAL_NUMEROS - ocupados;

  // 🎲 SORTEO
  const sortear = () => {
    const lista = Array.from(numerosUnicos);

    if (lista.length === 0) {
      alert("No hay números para sortear");
      return;
    }

    const random = lista[Math.floor(Math.random() * lista.length)];
    setGanador(random);
  };

  return (
    <div className="admin">

      <h1>🔐 Panel Administrador</h1>

      {/* 🧭 TABS */}
      <div style={{ display: "flex", gap: "10px", margin: "15px 0" }}>
        <button onClick={() => setVista("tabla")}>📋 Tabla</button>
        <button onClick={() => setVista("numeros")}>🎟️ Números</button>
        <button onClick={() => setVista("sorteo")}>🎲 Sorteo</button>
      </div>

      <h2>Participantes: {participantes.length}</h2>

      {/* 📊 ESTADÍSTICAS */}
      <div className="estadisticas">

        <div className="card-estadistica">
          <h3>🎟️ Total</h3>
          <p>{TOTAL_NUMEROS}</p>
        </div>

        <div className="card-estadistica">
          <h3>🔴 Ocupados</h3>
          <p>{ocupados}</p>
        </div>

        <div className="card-estadistica">
          <h3>🟢 Disponibles</h3>
          <p>{disponibles}</p>
        </div>

      </div>

      <button onClick={exportarExcel}>
        📥 Exportar Excel
      </button>

      {/* ========================= */}
      {/* 📋 TABLA */}
      {/* ========================= */}
      {vista === "tabla" && (
        <>
          <input
            type="text"
            placeholder="Buscar..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Teléfono</th>
                <th>Número</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody>
              {filtrados.map((p) => (
                <tr key={p.id}>
                  <td>{p.nombre}</td>
                  <td>{p.telefono}</td>
                  <td>{p.numero}</td>
                  <td>
                    <button onClick={() => eliminar(p.id)}>
                      ❌ Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* ========================= */}
      {/* 🎟️ MAPA CINE */}
      {/* ========================= */}
      {vista === "numeros" && (
        <div>
          <h2>🎟️ Mapa de Números</h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(20, 1fr)",
            gap: "5px"
          }}>
            {[...Array(1000)].map((_, i) => {
              const num = i + 1;
              const ocupado = numerosUnicos.has(num);

              return (
                <div
                  key={num}
                  style={{
                    padding: "6px",
                    textAlign: "center",
                    borderRadius: "5px",
                    fontSize: "12px",
                    background: ocupado ? "#e74c3c" : "#2ecc71",
                    color: "white"
                  }}
                >
                  {num}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================= */}
      {/* 🎲 SORTEO */}
      {/* ========================= */}
      {vista === "sorteo" && (
        <div style={{ textAlign: "center" }}>
          <h2>🎲 Sorteo en Vivo</h2>

          <button
            onClick={sortear}
            style={{
              padding: "15px",
              fontSize: "18px",
              background: "#f39c12",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer"
            }}
          >
            🎰 Sortear ganador
          </button>

          {ganador && (
            <h1 style={{ marginTop: "20px", color: "green" }}>
              🏆 Número ganador: {ganador}
            </h1>
          )}
        </div>
      )}

    </div>
  );
}