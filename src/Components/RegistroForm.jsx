import { useState } from "react";
import jsPDF from "jspdf";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../services/Firebase";

export default function RegistroForm({
  seleccionados = [],
  setSeleccionados = () => {},
  participantes = [],
}) {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");

  const generarPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("🎟 Comprobante de Rifa", 20, 20);

    doc.setFontSize(12);
    doc.text(`Nombre: ${nombre}`, 20, 35);
    doc.text(`Teléfono: ${telefono}`, 20, 45);
    doc.text(`Números: ${seleccionados.join(", ")}`, 20, 60);

    doc.save("comprobante-rifa.pdf");
  };

  const guardar = async () => {
    if (!nombre || !telefono) {
      alert("Complete todos los campos");
      return;
    }

    if (seleccionados.length === 0) {
      alert("Selecciona números primero");
      return;
    }

    try {
      await addDoc(collection(db, "participantes"), {
        nombre,
        telefono,
        numero: seleccionados.join(","),
        estado: "reservado",
      });

      alert("Reserva guardada");

      setNombre("");
      setTelefono("");
      setSeleccionados([]);

      generarPDF(); // 🔥 SOLO AQUÍ
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="registro-form">

      <h2>📋 Datos de reserva</h2>

      <input
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />

      <input
        placeholder="Teléfono"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
      />

      <p>Seleccionados: {seleccionados.length}</p>

      <button className="btn btn-reservar" onClick={guardar}>
  Confirmar reserva
</button>

    </div>
  );
}