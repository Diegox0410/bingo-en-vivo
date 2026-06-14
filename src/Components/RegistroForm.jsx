import { useState } from "react";
import jsPDF from "jspdf";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../services/Firebase";

export default function RegistroForm({ onRegistrado }) {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");

  // 🔥 cantidad libre de números
  const [cantidad, setCantidad] = useState(1);

  // 🔥 números seleccionados
  const [seleccionados, setSeleccionados] = useState([]);

  // ===============================
  // TOGGLE DE NÚMEROS
  // ===============================
  const toggleNumero = (num) => {
    setSeleccionados((prev) => {
      if (prev.includes(num)) {
        return prev.filter((n) => n !== num);
      }

      // limitar cantidad seleccionada
      if (prev.length < cantidad) {
        return [...prev, num];
      }

      return prev;
    });
  };

  // ===============================
  // PDF
  // ===============================
  const generarPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("🎟 Comprobante de Rifa", 20, 20);

    doc.setFontSize(12);
    doc.text(`Nombre: ${nombre}`, 20, 35);
    doc.text(`Teléfono: ${telefono}`, 20, 45);

    doc.text("Números seleccionados:", 20, 60);

    doc.text(seleccionados.join(", "), 20, 75);

    doc.text("Gracias por participar 🙌", 20, 100);

    doc.save("comprobante-rifa.pdf");
  };

  // ===============================
  // GUARDAR EN FIREBASE
  // ===============================
  const guardar = async () => {
    if (!nombre || !telefono) {
      alert("Complete todos los campos");
      return;
    }

    if (seleccionados.length !== Number(cantidad)) {
      alert(`Debes seleccionar ${cantidad} números`);
      return;
    }

    try {
      await addDoc(collection(db, "participantes"), {
        nombre,
        telefono,
        estado: "reservado",

        // 🔥 IMPORTANTE: guardado como string
        numero: seleccionados.join(","),
      });

      alert("Reserva guardada correctamente");

      setNombre("");
      setTelefono("");
      setCantidad(1);
      setSeleccionados([]);

      onRegistrado();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="registro-form">

      <h2>🎟 Reservar números</h2>

      {/* ===================== */}
      {/* DATOS */}
      {/* ===================== */}
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

      {/* ===================== */}
      {/* CANTIDAD LIBRE */}
      {/* ===================== */}
      <input
        type="number"
        placeholder="¿Cuántos números quieres?"
        min={1}
        max={1000}
        value={cantidad}
        onChange={(e) => {
          setCantidad(Number(e.target.value));
          setSeleccionados([]); // reset al cambiar cantidad
        }}
      />

      <p>
        Seleccionados: {seleccionados.length} / {cantidad}
      </p>

      {/* ===================== */}
      {/* GRID 1 - 1000 */}
      {/* ===================== */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(10, 1fr)",
          gap: "5px",
          maxHeight: "300px",
          overflowY: "scroll",
        }}
      >
        {[...Array(1000)].map((_, i) => {
          const num = i + 1;

          const selected = seleccionados.includes(num);

          return (
            <button
              key={num}
              onClick={() => toggleNumero(num)}
              style={{
                padding: "5px",
                background: selected ? "green" : "white",
                color: selected ? "white" : "black",
                border: "1px solid #ccc",
                cursor: "pointer",
              }}
            >
              {num}
            </button>
          );
        })}
      </div>

      {/* ===================== */}
      {/* BOTONES */}
      {/* ===================== */}
      <button onClick={guardar} style={{ marginTop: "10px" }}>
        Confirmar reserva
      </button>

      {seleccionados.length > 0 && (
        <button onClick={generarPDF} style={{ marginLeft: "10px" }}>
          Descargar comprobante PDF
        </button>
      )}

    </div>
  );
}