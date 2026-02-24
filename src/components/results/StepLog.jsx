import { useEffect, useRef } from 'react';
import EmptyState from './EmptyState';

export default function StepLog({ logEntries }) {
  const delay = 800;
  const containerRef = useRef(null);  // ← debe estar AQUÍ

  useEffect(() => {
    if (!logEntries || !logEntries.length) return;
    const el = containerRef.current;
    el.innerHTML = '';
    logEntries.forEach((msg, i) => {
      setTimeout(() => {
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        if (msg === '---') {
          entry.innerHTML = `<div style="width:100%;height:1px;background:var(--border)"></div>`;
        } else {
          entry.innerHTML = `
            <span class="log-time">[${String(i).padStart(3, '0')}]</span>
            <span class="log-msg">${msg}</span>
          `;
        }
        el.appendChild(entry);
        el.scrollTop = el.scrollHeight;
      }, i * delay * 1.5);
    });
  }, [logEntries]);

  if (!logEntries || !logEntries.length) {
    return <EmptyState message="Aquí se mostrará la explicación detallada de cada decisión del planificador." />;
  }

  return <div className="log-container" ref={containerRef} style={{ maxHeight: '360px', overflowY: 'auto' }} />;
}