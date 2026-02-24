import AlgoDescription from './AlgoDescription';

const ALGOS = [
  { key: 'fifo',     label: 'FIFO' },
  { key: 'sjf',      label: 'SJF' },
  { key: 'priority', label: 'Prioridad' },
  { key: 'rr',       label: 'Round Robin' },
  { key: 'policy',   label: 'Por Política (CFS)' },
];

export default function AlgoSelector({ currentAlgo, quantum, onAlgoChange, onQuantumChange }) {
  return (
    <>
      <div className="algo-tabs">
        {ALGOS.map(a => (
          <button
            key={a.key}
            className={`algo-tab ${currentAlgo === a.key ? 'active' : ''}`}
            style={a.key === 'policy' ? { gridColumn: '1/-1' } : {}}
            onClick={() => onAlgoChange(a.key)}
          >
            {a.label}
          </button>
        ))}
      </div>

      <AlgoDescription currentAlgo={currentAlgo} />

      {currentAlgo === 'rr' && (
        <div className="form-group" style={{ marginTop: '12px' }}>
          <label>Quantum (ms)</label>
          <input
            type="number"
            value={quantum}
            min="1"
            max="20"
            onChange={e => onQuantumChange(parseInt(e.target.value) || 4)}
          />
        </div>
      )}
    </>
  );
}