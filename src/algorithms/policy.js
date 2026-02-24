export function schedulePolicy(procs) {
  const log = [];
  const timeline = [];
  let time = 0;
  const totalWeight = procs.reduce((s, p) => s + p.weight, 0);
  const BASE_PERIOD = Math.max(procs.length * 4, 20);

  log.push(`<span class="hl">Por Política (CFS):</span> Planificador de Equidad Completa inspirado en Linux.`);
  log.push(`Período base: <span class="hl4">${BASE_PERIOD}ms</span>. Tiempo proporcional al peso.`);
  procs.forEach(p => {
    const slice = Math.max(1, Math.round((p.weight / totalWeight) * BASE_PERIOD));
    log.push(`  <span class="hl3">${p.id}</span>: peso=${p.weight} → time-slice ≈ ${slice}ms (${Math.round(p.weight / totalWeight * 100)}% del período).`);
  });
  log.push(`---`);

  const remaining = procs.map(p => ({ ...p, rem: p.burst, done: false, vruntime: 0 }));
  const results = {};
  procs.forEach(p => results[p.id] = { ...p, start: -1, finish: 0, waiting: 0, turnaround: 0 });

  while (remaining.some(p => !p.done)) {
    const available = remaining.filter(p => !p.done && p.arrival <= time);
    if (!available.length) {
      const nxt = remaining.filter(p => !p.done).sort((a, b) => a.arrival - b.arrival)[0];
      log.push(`t=${time}: Sin procesos listos. Saltando a t=${nxt.arrival}.`);
      time = nxt.arrival;
      continue;
    }

    const chosen = available.sort((a, b) => a.vruntime - b.vruntime)[0];
    const slice = Math.max(1, Math.round((chosen.weight / totalWeight) * BASE_PERIOD));
    const exec = Math.min(chosen.rem, slice);

    if (results[chosen.id].start === -1) results[chosen.id].start = time;

    log.push(`t=${time}: <span class="hl3">${chosen.id}</span> vruntime=${chosen.vruntime.toFixed(1)} → CPU por ${exec}ms (peso=${chosen.weight}).`);
    timeline.push({ pid: chosen.id, start: time, end: time + exec });
    time += exec;

    chosen.vruntime += exec * (10 / chosen.weight);
    chosen.rem -= exec;

    if (chosen.rem <= 0) {
      chosen.done = true;
      results[chosen.id].finish = time;
      results[chosen.id].turnaround = time - chosen.arrival;
      results[chosen.id].waiting = results[chosen.id].turnaround - chosen.burst;
      log.push(`t=${time}: <span class="hl2">${chosen.id}</span> completado. Espera=${results[chosen.id].waiting}ms.`);
    } else {
      log.push(`t=${time}: Quantum expirado. ${chosen.id} regresa (rem=${chosen.rem}ms, vruntime=${chosen.vruntime.toFixed(1)}).`);
    }
  }
  return { timeline, log, procResults: Object.values(results) };
}