import { useEffect, useRef } from 'react';
import { COLORS } from '../../constants/colors';
import EmptyState from './EmptyState';

export default function GanttChart({ timeline, processes }) {
  const delay = 50;
  const ganttRef = useRef(null);  // ← debe estar AQUÍ, fuera del useEffect

  useEffect(() => {
    if (!timeline || !timeline.length) return;

    const maxTime = Math.max(...timeline.map(b => b.end));
    const pidsOrdered = processes.map(p => p.id).filter(id =>
      timeline.some(b => b.pid === id)
    );
    const pixelsPerMs = Math.min(18, Math.max(4, 600 / maxTime));
    const container = ganttRef.current;
    container.innerHTML = '';

    const rows = {};
    pidsOrdered.forEach(pid => {
      const rowEl = document.createElement('div');
      rowEl.className = 'gantt-row';
      const label = document.createElement('div');
      label.className = 'gantt-label';
      label.textContent = pid;
      const track = document.createElement('div');
      track.className = 'gantt-track';
      track.style.minWidth = (maxTime * pixelsPerMs) + 'px';
      track.style.background = 'rgba(26,37,64,0.3)';
      rowEl.appendChild(label);
      rowEl.appendChild(track);
      container.appendChild(rowEl);
      rows[pid] = track;
    });

    const tickRow = document.createElement('div');
    tickRow.className = 'gantt-timeline';
    const tickStep = Math.ceil(maxTime / Math.min(maxTime, 50));
    for (let t = 0; t <= maxTime; t += tickStep) {
      const tick = document.createElement('div');
      tick.className = 'time-tick';
      tick.textContent = t;
      tick.style.width = (tickStep * pixelsPerMs) + 'px';
      tickRow.appendChild(tick);
    }
    container.appendChild(tickRow);

    timeline.forEach((block, i) => {
      setTimeout(() => {
        const proc = processes.find(p => p.id === block.pid);
        const [fg, bg] = COLORS[proc ? proc.colorIdx : 0];
        const blockEl = document.createElement('div');
        blockEl.className = 'gantt-block';
        blockEl.style.width = ((block.end - block.start) * pixelsPerMs) + 'px';
        blockEl.style.position = 'absolute';
        blockEl.style.left = (block.start * pixelsPerMs) + 'px';
        blockEl.style.background = `linear-gradient(135deg, ${fg}cc, ${fg}88)`;
        blockEl.style.color = bg === '#050810' ? fg : bg;
        const dur = block.end - block.start;
        if (dur * pixelsPerMs > 22) blockEl.textContent = block.pid;
        blockEl.innerHTML += `<div class="block-tooltip">${block.pid}: t=${block.start}→${block.end} (${dur}ms)</div>`;
        blockEl.style.opacity = '0';
        blockEl.style.transform = 'scaleY(0.3)';
        blockEl.style.transition = 'opacity 0.2s, transform 0.2s';
        rows[block.pid].appendChild(blockEl);
        requestAnimationFrame(() => {
          blockEl.style.opacity = '1';
          blockEl.style.transform = 'scaleY(1)';
        });
      }, i * delay);
    });
  }, [timeline, processes]);

  const pidsOrdered = processes
    .map(p => p.id)
    .filter(id => timeline?.some(b => b.pid === id));

  if (!timeline || !timeline.length) {
    return <EmptyState icon="▬▬▬" message="El diagrama aparecerá aquí después de ejecutar la simulación." />;
  }

  return (
    <>
      <div ref={ganttRef} style={{ overflowX: 'auto' }} />
      <div className="legend">
        {pidsOrdered.map(pid => {
          const proc = processes.find(p => p.id === pid);
          const [fg] = COLORS[proc ? proc.colorIdx : 0];
          return (
            <div key={pid} className="legend-item">
              <div className="legend-dot" style={{ background: fg }} />
              {pid}
            </div>
          );
        })}
      </div>
    </>
  );
}