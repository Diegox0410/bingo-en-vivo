import { useState } from "react";
import jsPDF from "jspdf";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../services/Firebase";
import userImg from "../assets/User.png"; // 🔥 IMPORTANTE

export default function RegistroForm({
  seleccionados = [],
  setSeleccionados = () => {},
}) {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");

  const generarPDF = () => {
    const img = new Image();
    img.src = userImg;

    img.onload = () => {
      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.text("COMPROBANTE DE RIFA", 20, 20);

      // 📷 imagen
      doc.addImage(img, "PNG", 140, 10, 50, 50);

      doc.setFontSize(12);
      doc.text(`Nombre: ${nombre}`, 20, 40);
      doc.text(`Telefono: ${telefono}`, 20, 50);

      doc.text("Numeros:", 20, 65);
      doc.text(seleccionados.join(", "), 20, 75);

      doc.text(
        "Te agradecemos por ayudar a nuestro emprendimiento",
        20,
        95
      );

      doc.save("comprobante-rifa.pdf");
    };
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

      generarPDF(); // 🔥 aquí se genera
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