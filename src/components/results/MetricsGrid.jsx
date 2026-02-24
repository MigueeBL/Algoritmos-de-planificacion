import { useEffect, useRef } from 'react';
import EmptyState from './EmptyState';

export default function MetricsGrid({ procResults }) {
  const cardsRef = useRef([]);

  useEffect(() => {
    if (!procResults) return;
    setTimeout(() => {
      cardsRef.current.forEach(c => c && c.classList.add('loaded'));
    }, 100);
  }, [procResults]);

  if (!procResults) {
    return (
      <div className="metrics-grid">
        <EmptyState message="Ejecuta la simulación para ver métricas" />
      </div>
    );
  }

  const avgWaiting    = procResults.reduce((s, p) => s + p.waiting, 0) / procResults.length;
  const avgTurnaround = procResults.reduce((s, p) => s + p.turnaround, 0) / procResults.length;
  const totalTime     = Math.max(...procResults.map(p => p.finish)) - Math.min(...procResults.map(p => p.arrival));
  const busyCPU       = procResults.reduce((s, p) => s + p.burst, 0);
  const cpuUtil       = Math.min(100, Math.round((busyCPU / totalTime) * 100));
  const throughput    = (procResults.length / totalTime).toFixed(2);

  const metrics = [
    { label: 'Espera Promedio',  value: avgWaiting.toFixed(1),    unit: 'milisegundos' },
    { label: 'Turnaround Prom.', value: avgTurnaround.toFixed(1), unit: 'milisegundos' },
    { label: 'Uso de CPU',       value: cpuUtil,                   unit: 'porcentaje'   },
    { label: 'Throughput',       value: throughput,                unit: 'procesos / ms'},
    { label: 'Total Procesos',   value: procResults.length,        unit: 'completados'  },
    { label: 'Tiempo Total',     value: totalTime,                 unit: 'milisegundos' },
  ];

  return (
    <div className="metrics-grid">
      {metrics.map((m, i) => (
        <div key={i} className="metric-card" ref={el => cardsRef.current[i] = el}>
          <div className="metric-label">{m.label}</div>
          <div className="metric-value">{m.value}</div>
          <div className="metric-unit">{m.unit}</div>
        </div>
      ))}
    </div>
  );
}