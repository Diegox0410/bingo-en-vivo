export default function NumeroGrid({
  participantes,
  seleccionados,
  onSeleccionar,
  numeroDestacado,
}) {
  const ocupados = participantes.map((p) => Number(p.numero));

  return (
    <div className="numero-grid">
      {[...Array(1000)].map((_, i) => {
        const numero = i + 1;

        const ocupado = ocupados.includes(numero);
        const seleccionado = seleccionados.includes(numero);
        const destacado = numeroDestacado === numero;

        return (
          <button
            id={`num-${numero}`}   // 🔥 importante para scroll
            key={numero}
            disabled={ocupado}
            onClick={() => !ocupado && onSeleccionar(numero)}
            style={{
              padding: "5px",
              margin: "2px",
              border: "1px solid #ccc",
              cursor: ocupado ? "not-allowed" : "pointer",

              background: ocupado
                ? "red"
                : seleccionado
                ? "green"
                : destacado
                ? "yellow"
                : "white",

              color: ocupado ? "white" : "black",
            }}
          >
            {numero}
          </button>
        );
      })}
    </div>
  );
}