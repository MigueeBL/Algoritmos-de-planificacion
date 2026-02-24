export default function SimulateControls({ onSimulate }) {
  return (
    <button className="btn-simulate" onClick={onSimulate}>
      ▶ Ejecutar Simulación
    </button>
  );
}