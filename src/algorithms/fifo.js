export function scheduleFIFO(procs) {
  const log = [];
  const timeline = [];
  const sorted = [...procs].sort((a, b) => a.arrival - b.arrival || procs.indexOf(a) - procs.indexOf(b));
  let time = 0;
  const results = {};
  procs.forEach(p => results[p.id] = { ...p, start: -1, finish: 0, waiting: 0, turnaround: 0 });

  log.push(`<span class="hl">FIFO:</span> Los procesos se ejecutan en orden de llegada. No hay interrupciones.`);
  log.push(`Orden de llegada: <span class="hl">${sorted.map(p => p.id).join(' → ')}</span>`);
  log.push(`---`);

  for (const p of sorted) {
    if (time < p.arrival) {
      log.push(`t=${time}: CPU inactiva. Esperando llegada de <span class="hl2">${p.id}</span> en t=${p.arrival}.`);
      time = p.arrival;
    }
    results[p.id].start = time;
    log.push(`t=${time}: Iniciando <span class="hl">${p.id}</span> (ráfaga=${p.burst}ms). No puede ser interrumpido.`);
    timeline.push({ pid: p.id, start: time, end: time + p.burst });
    time += p.burst;
    results[p.id].finish = time;
    results[p.id].turnaround = time - p.arrival;
    results[p.id].waiting = results[p.id].turnaround - p.burst;
    log.push(`t=${time}: <span class="hl2">${p.id}</span> terminó. Turnaround=${results[p.id].turnaround}ms, Espera=${results[p.id].waiting}ms.`);
  }
  return { timeline, log, procResults: Object.values(results) };
}