export function scheduleRR(procs, quantum) {
  const log = [];
  const timeline = [];
  let time = 0;
  const queue = [];
  const remaining = procs.map(p => ({ ...p, rem: p.burst, done: false, firstRun: -1 }));
  const results = {};
  procs.forEach(p => results[p.id] = { ...p, start: -1, finish: 0, waiting: 0, turnaround: 0 });

  log.push(`<span class="hl">Round Robin:</span> Quantum = <span class="hl4">${quantum}ms</span>.`);
  log.push(`---`);

  remaining.filter(p => p.arrival === 0).sort((a, b) => a.arrival - b.arrival).forEach(p => queue.push(p.id));

  while (remaining.some(p => !p.done)) {
    if (!queue.length) {
      const nxt = remaining.filter(p => !p.done).sort((a, b) => a.arrival - b.arrival)[0];
      log.push(`t=${time}: Cola vacía. CPU inactiva hasta t=${nxt.arrival}.`);
      time = nxt.arrival;
      remaining.filter(p => !p.done && p.arrival <= time && !queue.includes(p.id))
        .sort((a, b) => a.arrival - b.arrival)
        .forEach(p => queue.push(p.id));
      continue;
    }

    const pid = queue.shift();
    const proc = remaining.find(p => p.id === pid);
    if (proc.firstRun === -1) { proc.firstRun = time; results[pid].start = time; }

    const exec = Math.min(proc.rem, quantum);
    log.push(`t=${time}: Ejecutando <span class="hl">${pid}</span> por ${exec}ms (restante=${proc.rem}ms). Cola: [${queue.join(', ') || 'vacía'}]`);

    const arrivals = remaining.filter(p =>
      !p.done && !queue.includes(p.id) && p.id !== pid &&
      p.arrival > time && p.arrival <= time + exec
    ).sort((a, b) => a.arrival - b.arrival);

    timeline.push({ pid, start: time, end: time + exec });
    time += exec;
    proc.rem -= exec;

    arrivals.forEach(p => {
      queue.push(p.id);
      log.push(`  → t=${p.arrival}: Llega <span class="hl4">${p.id}</span>, se agrega a la cola.`);
    });

    if (proc.rem <= 0) {
      proc.done = true;
      results[pid].finish = time;
      results[pid].turnaround = time - proc.arrival;
      results[pid].waiting = results[pid].turnaround - proc.burst;
      log.push(`t=${time}: <span class="hl2">${pid}</span> terminó. Espera=${results[pid].waiting}ms, Turnaround=${results[pid].turnaround}ms.`);
    } else {
      queue.push(pid);
      log.push(`t=${time}: Quantum expirado para <span class="hl4">${pid}</span> (restante=${proc.rem}ms). Vuelve al final de la cola.`);
    }
  }
  return { timeline, log, procResults: Object.values(results) };
}