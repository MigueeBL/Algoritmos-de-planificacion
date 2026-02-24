import ProcessItem from './ProcessItem';
import EmptyState from '../results/EmptyState';

export default function ProcessList({ processes, currentAlgo, onRemove }) {
  if (!processes.length) {
    return (
      <div className="empty-state" style={{ padding: '20px' }}>
        <div style={{ fontSize: '24px', opacity: 0.3, marginBottom: '8px' }}>▣</div>
        <div>Sin procesos. Agrega o carga un ejemplo.</div>
      </div>
    );
  }

  return (
    <div className="process-list">
      {processes.map(p => (
        <ProcessItem
          key={p.id}
          process={p}
          currentAlgo={currentAlgo}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}