import { COLORS } from '../../constants/colors';

export default function ProcessItem({ process, currentAlgo, onRemove }) {
  const [fg, bg] = COLORS[process.colorIdx];

  let meta = `Llegada: ${process.arrival}ms | Ráfaga: ${process.burst}ms`;
  if (currentAlgo === 'priority') meta += ` | Prioridad: ${process.priority}`;
  if (currentAlgo === 'policy')   meta += ` | Peso: ${process.weight}`;

  return (
    <div className="process-item">
      <div
        className="process-badge"
        style={{ background: bg, borderColor: fg, color: fg }}
      >
        {process.id}
      </div>
      <div className="process-info">
        <div className="process-name">{process.id}</div>
        <div className="process-meta">{meta}</div>
      </div>
      <button className="remove-btn" onClick={() => onRemove(process.id)}>✕</button>
    </div>
  );
}