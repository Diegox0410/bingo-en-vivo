export default function NumeroGrid({
  participantes,
  onSeleccionar,
}) {
  const numerosOcupados = participantes.map(
    (p) => Number(p.numero)
  );

  return (
    <div className="numero-grid">
      {[...Array(1000)].map((_, i) => {
        const numero = i + 1;

        const ocupado =
          numerosOcupados.includes(numero);

        return (
          <button
            key={numero}
            disabled={ocupado}
            className={
              ocupado
                ? "numero-ocupado"
                : "numero-disponible"
            }
            onClick={() =>
              onSeleccionar(numero)
            }
          >
            {numero}
          </button>
        );
      })}
    </div>
  );
}