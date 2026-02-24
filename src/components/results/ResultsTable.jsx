import { COLORS } from '../../constants/colors';
import EmptyState from './EmptyState';

export default function ResultsTable({ procResults, processes, currentAlgo }) {
  if (!procResults) {
    return <EmptyState message="Sin datos todavía" />;
  }

  const showPriority = currentAlgo === 'priority';
  const showWeight   = currentAlgo === 'policy';

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="proc-table">
        <thead>
          <tr>
            <th>Proceso</th>
            <th>Llegada</th>
            <th>Ráfaga</th>
            {showPriority && <th>Prioridad</th>}
            {showWeight   && <th>Peso</th>}
            <th>Inicio</th>
            <th>Fin</th>
            <th>Turnaround</th>
            <th>Espera</th>
          </tr>
        </thead>
        <tbody>
          {procResults.map(p => {
            const proc = processes.find(x => x.id === p.id);
            const [fg] = COLORS[proc ? proc.colorIdx : 0];
            const waitColor = p.waiting === 0
              ? 'var(--success)'
              : p.waiting > 8 ? 'var(--danger)' : 'var(--text)';
            return (
              <tr key={p.id}>
                <td><span className="badge" style={{ borderColor: fg, color: fg }}>{p.id}</span></td>
                <td>{p.arrival}</td>
                <td>{p.burst}</td>
                {showPriority && <td>{p.priority}</td>}
                {showWeight   && <td>{p.weight}</td>}
                <td>{p.start}</td>
                <td>{p.finish}</td>
                <td style={{ color: 'var(--accent)' }}>{p.turnaround}</td>
                <td style={{ color: waitColor, fontWeight: 700 }}>{p.waiting}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}