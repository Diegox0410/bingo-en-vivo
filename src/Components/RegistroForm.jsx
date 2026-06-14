import { useState } from "react";
import confetti from "canvas-confetti";
confetti({

  particleCount: 200,

  spread: 120,

  origin: {
    y: 0.6
  }

});
import {
  addDoc,
  collection,
} from "firebase/firestore";

import { db } from "../services/firebase";

export default function RegistroForm({
  numero,
  onRegistrado,
}) {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] =
    useState("");

  const guardar = async () => {
    if (!nombre || !telefono) {
      alert("Complete todos los campos");
      return;
    }

    try {
      await addDoc(
        collection(
          db,
          "participantes"
        ),
        {
          nombre,
          telefono,
          numero,
          estado: "reservado",
          fecha: new Date()
        }
      );

      alert(
        "Número reservado correctamente"
      );

      setNombre("");
      setTelefono("");

      onRegistrado();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="registro-form">

      <h2>
        Número seleccionado:
        {numero}
      </h2>

      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) =>
          setNombre(e.target.value)
        }
      />

      <input
        type="text"
        placeholder="Teléfono"
        value={telefono}
        onChange={(e) =>
          setTelefono(e.target.value)
        }
      />

      <button onClick={guardar}>
        Reservar Número
      </button>

    </div>
  );
}