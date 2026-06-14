import { useState } from "react";
import jsPDF from "jspdf";

import {
  addDoc,
  collection,
} from "firebase/firestore";

import { db } from "../services/Firebase";

export default function RegistroForm({
  numero,
  onRegistrado,
}) {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");

  // 🔥 NUEVO: cantidad de rifas
  const [cantidad, setCantidad] = useState(1);

  // 🔥 NUEVO: números generados
  const [numerosReservados, setNumerosReservados] = useState([]);

  // 🧾 PDF
  const generarPDF = (nums) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("🎟 Comprobante de Rifa", 20, 20);

    doc.setFontSize(12);
    doc.text(`Nombre: ${nombre}`, 20, 35);
    doc.text(`Teléfono: ${telefono}`, 20, 45);

    doc.text("Números reservados:", 20, 60);

    nums.forEach((n, i) => {
      doc.text(`- ${n}`, 20, 75 + i * 10);
    });

    doc.text("Gracias por participar 🙌", 20, 140);

    doc.save("comprobante-rifa.pdf");
  };

  const guardar = async () => {
    if (!nombre || !telefono) {
      alert("Complete todos los campos");
      return;
    }

    try {
      const nuevosNumeros = [];

      // 🔥 GENERA múltiples números consecutivos desde el seleccionado
      for (let i = 0; i < cantidad; i++) {
        nuevosNumeros.push(numero + i);
      }

      // 🔥 guarda cada número en Firebase
      for (let num of nuevosNumeros) {
        await addDoc(collection(db, "participantes"), {
          nombre,
          telefono,
          numero: num,
          estado: "reservado",
          fecha: new Date(),
        });
      }

      setNumerosReservados(nuevosNumeros);

      alert("Números reservados correctamente");

      setNombre("");
      setTelefono("");

      onRegistrado();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="registro-form">

      <h2>Número seleccionado: {numero}</h2>

      {/* 🔥 MULTISELECTOR */}
      <div>
        <label>Cantidad de rifas:</label>
        <select
          value={cantidad}
          onChange={(e) => setCantidad(Number(e.target.value))}
        >
          <option value={1}>1 número</option>
          <option value={2}>2 números</option>
          <option value={5}>5 números</option>
          <option value={10}>10 números</option>
        </select>
      </div>

      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />

      <input
        type="text"
        placeholder="Teléfono"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
      />

      <button onClick={guardar}>
        Reservar Número(s)
      </button>

      {/* 🔥 BOTÓN PDF (solo aparece si ya reservó) */}
      {numerosReservados.length > 0 && (
        <button
          onClick={() => generarPDF(numerosReservados)}
          style={{ marginTop: "10px" }}
        >
          Descargar comprobante PDF
        </button>
      )}

    </div>
  );
}