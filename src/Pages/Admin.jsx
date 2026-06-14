import { useEffect, useState } from "react";

import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "../services/firebase";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
const ADMIN_PASSWORD = "EMILIOSO2026";

export default function Admin() {
  const [autenticado, setAutenticado] = useState(false);
  const [password, setPassword] = useState("");

  const [participantes, setParticipantes] = useState([]);
  const [busqueda, setBusqueda] = useState("");

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

  if (!autenticado) {
    return (
      <div className="login-admin">
        <h1>🔐 Acceso Administrador</h1>

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
          onClick={() => {
            if (
              password === ADMIN_PASSWORD
            ) {
              setAutenticado(true);
            } else {
              alert(
                "Contraseña incorrecta"
              );
            }
          }}
        >
          Entrar
        </button>
      </div>
    );
  }

  const eliminar = async (id) => {
    const confirmar = window.confirm(
      "¿Eliminar participante?"
    );

    if (!confirmar) return;

    try {
      await deleteDoc(
        doc(
          db,
          "participantes",
          id
        )
      );
    } catch (error) {
      console.error(error);
      alert("Error al eliminar");
    }
  };
  const exportarExcel = () => {

  const datos = participantes.map((p) => ({

    Nombre: p.nombre || "",

    Telefono: p.telefono || "",

    Numero: p.numero || "",

    Fecha: p.fecha
      ? new Date(
          p.fecha.seconds * 1000
        ).toLocaleString()
      : "",

  }));

  const hoja =
    XLSX.utils.json_to_sheet(
      datos
    );

  const libro =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    libro,
    hoja,
    "Participantes"
  );

  const excelBuffer =
    XLSX.write(libro, {
      bookType: "xlsx",
      type: "array",
    });

  const archivo =
    new Blob(
      [excelBuffer],
      {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }
    );

  saveAs(
    archivo,
    `participantes_${Date.now()}.xlsx`
  );
};

  const filtrados = participantes.filter(
    (p) =>
      (p.nombre || "")
        .toLowerCase()
        .includes(
          busqueda.toLowerCase()
        ) ||
      (p.telefono || "")
        .toString()
        .includes(busqueda) ||
      (p.numero || "")
        .toString()
        .includes(busqueda)
  );
const TOTAL_NUMEROS = 1000;

const ocupados = participantes.length;

const disponibles =
  TOTAL_NUMEROS - ocupados;
  return (
    <div className="admin">

      <h1>
        🔐 Panel Administrador
      </h1>

      <h2>
        Participantes:
        {" "}
        {participantes.length}
      </h2>
      <div
  style={{
    marginBottom: "20px",
  }}
><div className="estadisticas">

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
  <button
    onClick={exportarExcel}
  >
    📥 Exportar Excel
  </button>
</div>

      <input
        type="text"
        placeholder="Buscar por nombre, teléfono o número..."
        value={busqueda}
        onChange={(e) =>
          setBusqueda(e.target.value)
        }
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
                <button
                  onClick={() =>
                    eliminar(p.id)
                  }
                >
                  ❌ Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}