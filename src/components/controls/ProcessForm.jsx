import { useState } from 'react';
import { COLORS } from '../../constants/colors';
import { PRESETS } from '../../constants/presets';

export default function ProcessForm({ processes, currentAlgo, onAdd, onLoadPreset, onClear }) {
  const [id, setId]           = useState('P1');
  const [arrival, setArrival] = useState(0);
  const [burst, setBurst]     = useState(5);
  const [priority, setPriority] = useState(1);
  const [weight, setWeight]   = useState(5);

  function handleAdd() {
    const trimId = id.trim().toUpperCase();
    if (!trimId)                          return alert('El ID no puede estar vacío.');
    if (processes.find(p => p.id === trimId)) return alert(`Ya existe el proceso "${trimId}".`);
    if (burst < 1)                        return alert('La ráfaga debe ser ≥ 1.');
    if (arrival < 0)                      return alert('La llegada debe ser ≥ 0.');

    const colorIdx = processes.length % COLORS.length;
    onAdd({ id: trimId, arrival, burst, priority, weight, colorIdx });
    setId('P' + (processes.length + 2));
    setArrival(0);
  }

  return (
    <>
      <div className="form-row">
        <div className="form-group">
          <label>Proceso ID</label>
          <input type="text" value={id} maxLength={4}
            onChange={e => setId(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Llegada (ms)</label>
          <input type="number" value={arrival} min="0"
            onChange={e => setArrival(parseInt(e.target.value) || 0)} />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Ráfaga (ms)</label>
          <input type="number" value={burst} min="1"
            onChange={e => setBurst(parseInt(e.target.value) || 1)} />
        </div>

        {currentAlgo !== 'policy' && (
          <div className="form-group">
            <label>{currentAlgo === 'priority' ? 'Prioridad (1=alta)' : 'Prioridad'}</label>
            <input type="number" value={priority} min="1" max="10"
              onChange={e => setPriority(parseInt(e.target.value) || 1)} />
          </div>
        )}
      </div>

      {currentAlgo === 'policy' && (
        <div className="form-group">
          <label>Peso (1–10) — para política CFS</label>
          <input type="number" value={weight} min="1" max="10"
            onChange={e => setWeight(parseInt(e.target.value) || 5)} />
        </div>
      )}

      <div className="btn-group">
        <button className="btn btn-primary" onClick={handleAdd}>+ Agregar</button>
        <button className="btn btn-ghost"   onClick={onLoadPreset}>Cargar Ejemplo</button>
        <button className="btn btn-danger"  onClick={onClear}>Limpiar</button>
      </div>
    </>
  );
}