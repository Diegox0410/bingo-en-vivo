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

    // Título
    doc.setFontSize(18);
    doc.text("COMPROBANTE DE RIFA", 20, 20);

    // Imagen
    doc.addImage(img, "PNG", 140, 10, 50, 50);

    // Datos
    doc.setFontSize(12);
    doc.text(`Nombre: ${nombre}`, 20, 40);
    doc.text(`Telefono: ${telefono}`, 20, 50);

    // Mensaje
    doc.setFontSize(12);
    doc.text(
      "Te agradecemos por ayudar a nuestro emilioso.",
      20,
      70
    );

    doc.text(
      "A continuacion se muestran tus numeros reservados:",
      20,
      78
    );

    // -------------------------
    // CUADROS DE NUMEROS
    // -------------------------

    let x = 20;
    let y = 90;

    const anchoCuadro = 20;
    const altoCuadro = 12;

    const columnas = 8;

    seleccionados.forEach((numero, index) => {

      const columna = index % columnas;
      const fila = Math.floor(index / columnas);

      const posX =
        x + columna * (anchoCuadro + 3);

      const posY =
        y + fila * (altoCuadro + 3);

      // Nueva página si se llena
      if (posY > 260) {
        doc.addPage();
        y = 20;

        const nuevaFila =
          Math.floor(
            (index % (columnas * 16)) /
            columnas
          );

        doc.rect(
          posX,
          y + nuevaFila * (altoCuadro + 3),
          anchoCuadro,
          altoCuadro
        );

        doc.text(
          numero.toString(),
          posX + 5,
          y + nuevaFila * (altoCuadro + 3) + 8
        );

        return;
      }

      doc.rect(
        posX,
        posY,
        anchoCuadro,
        altoCuadro
      );

      doc.text(
        numero.toString(),
        posX + 5,
        posY + 8
      );
    });

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