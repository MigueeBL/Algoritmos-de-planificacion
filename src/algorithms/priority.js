export function schedulePriority(procs) {
  const log = [];
  const timeline = [];
  let time = 0;
  const remaining = procs.map(p => ({ ...p, done: false }));
  const results = {};
  procs.forEach(p => results[p.id] = { ...p, start: -1, finish: 0, waiting: 0, turnaround: 0 });

  log.push(`<span class="hl">Por Prioridad (no preventiva):</span> Menor número = mayor prioridad.`);
  log.push(`---`);

  while (remaining.some(p => !p.done)) {
    const available = remaining.filter(p => !p.done && p.arrival <= time);
    if (!available.length) {
      const next = remaining.filter(p => !p.done).sort((a, b) => a.arrival - b.arrival)[0];
      log.push(`t=${time}: CPU inactiva. Saltando a t=${next.arrival}.`);
      time = next.arrival;
      continue;
    }
    const chosen = available.sort((a, b) => a.priority - b.priority || a.arrival - b.arrival)[0];
    const avNames = available.map(p => `${p.id}(p=${p.priority})`).join(', ');
    log.push(`t=${time}: Disponibles: [${avNames}]. Mayor prioridad: <span class="hl3">${chosen.id}</span> (prioridad=${chosen.priority}).`);
    if (results[chosen.id].start === -1) results[chosen.id].start = time;
    timeline.push({ pid: chosen.id, start: time, end: time + chosen.burst });
    time += chosen.burst;
    chosen.done = true;
    results[chosen.id].finish = time;
    results[chosen.id].turnaround = time - chosen.arrival;
    results[chosen.id].waiting = results[chosen.id].turnaround - chosen.burst;
    log.push(`t=${time}: <span class="hl2">${chosen.id}</span> terminó. Espera=${results[chosen.id].waiting}ms, Turnaround=${results[chosen.id].turnaround}ms.`);
  }
  return { timeline, log, procResults: Object.values(results) };
}