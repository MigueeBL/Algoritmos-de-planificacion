import { useEffect, useState } from "react";
import { CHARACTERS } from "../../constants/characters";

export default function MarvelPanel({ processes, results }) {
  const delay = 1000;
  const [execStates, setExecStates] = useState({});

  useEffect(() => {
    if (!results) {
      setExecStates({});
      return;
    }

    const { timeline, procResults } = results;

    const initial = {};
    processes.forEach((p) => {
      initial[p.id] = { pct: 0, state: "waiting", label: "EN COLA" };
    });
    setExecStates(initial);

    const burstByPid = {};
    processes.forEach((p) => {
      burstByPid[p.id] = { total: p.burst, done: 0 };
    });

    const steps = [];
    timeline.forEach((block) => {
      const dur = block.end - block.start;
      burstByPid[block.pid].done += dur;
      const pct = Math.round(
        (burstByPid[block.pid].done / burstByPid[block.pid].total) * 100,
      );
      const isDone = pct >= 100;
      const pr = procResults.find((r) => r.id === block.pid);
      steps.push({
        pid: block.pid,
        pct,
        done: isDone,
        wait: pr?.waiting,
        ta: pr?.turnaround,
        dur, // ← duración real del bloque
      });
    });

    // El tiempo acumulado usa la duración REAL de cada bloque
    let tiempoAcumulado = 0;
    steps.forEach((step) => {
      setTimeout(() => {
        setExecStates((prev) => {
          const next = { ...prev };
          Object.keys(next).forEach((pid) => {
            if (next[pid].state === "active") {
              next[pid] = { ...next[pid], state: "waiting", label: "EN COLA" };
            }
          });
          if (step.done) {
            next[step.pid] = {
              pct: 100,
              state: "done",
              label: "LISTO ✓",
              wait: step.wait,
              ta: step.ta,
              dur: step.dur,
            };
          } else {
            next[step.pid] = {
              pct: step.pct,
              state: "active",
              label: "EN CPU ⚡",
              dur: step.dur,
            };
          }
          return next;
        });
      }, tiempoAcumulado);

      // ← cada paso espera tantos segundos como unidades de tiempo dura el bloque
      tiempoAcumulado += step.dur * delay;
    });
  }, [results]);

  return (
    <div className="marvel-panel">
      <div className="marvel-queue-section">
        <div className="marvel-section-label" style={{ textAlign: "left" }}>
          Procesos en cola
        </div>
        <div className="marvel-cards-row">
          {processes.map((p) => {
            const char = CHARACTERS[p.colorIdx] || CHARACTERS[0];
            const state = execStates[p.id];
            const pct = state?.pct || 0;
            const st = state?.state || "waiting";
            return (
              <div key={p.id} className={`marvel-card ${st}`}>
                <div
                  className="marvel-card-strip"
                  style={{
                    background:
                      st === "active"
                        ? "var(--accent)"
                        : st === "done"
                          ? "var(--success)"
                          : "#ccc",
                  }}
                />
                <div
                  className={`marvel-card-img ${st === "active" ? "shimmer" : ""}`}
                >
                  <img src={char.img} alt={char.name} />
                  <div className="marvel-card-pid">{p.id}</div>
                  <div className="marvel-card-state">
                    {st === "active" ? "⚡" : st === "done" ? "✓" : "⏳"}
                  </div>
                </div>
                <div className="marvel-card-body">
                  <div className="marvel-card-name">{char.name}</div>
                  <div className="marvel-card-stat">
                    <span>Ráfaga</span>
                    <span className="val">{p.burst}ms</span>
                  </div>
                  <div className="marvel-card-stat">
                    <span>Llegada</span>
                    <span className="val">{p.arrival}ms</span>
                  </div>
                  <div className="marvel-card-stat">
                    <span>Prior.</span>
                    <span className="val accent">{p.priority}</span>
                  </div>
                  <div className="marvel-card-progress">
                    <div
                      className="marvel-card-progress-bar"
                      style={{
                        width: pct + "%",
                        transition: `width ${(state?.dur || 1) * 1}s linear`,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="marvel-exec-section">
        <div className="marvel-section-label" style={{ textAlign: "left" }}>
          Ejecución en tiempo real
        </div>
        <div className="marvel-exec-rows">
          {processes.map((p) => {
            const char = CHARACTERS[p.colorIdx] || CHARACTERS[0];
            const state = execStates[p.id];
            const pct = state?.pct || 0;
            const st = state?.state || "waiting";
            const label = state?.label || "EN COLA";
            const wait = state?.wait;
            const ta = state?.ta;
            return (
              <div key={p.id} className={`marvel-exec-row ${st}`}>
                <div className="marvel-exec-avatar">
                  <img src={char.img} alt={char.name} />
                </div>
                <div className="marvel-exec-info">
                  <div className="marvel-exec-name">
                    {char.name} — {p.id}
                    <span className={`marvel-exec-badge badge-${st}`}>
                      {label}
                    </span>
                  </div>
                  <div className="marvel-exec-bar-wrap">
                    <div className="marvel-exec-bar">
                      <div
                        className="marvel-exec-bar-fill"
                        style={{
                          width: pct + "%",
                          transition: `width ${(state?.dur || 1) * 1}s linear`,
                          background:
                            st === "done"
                              ? "linear-gradient(90deg, var(--success), #00f552)"
                              : "linear-gradient(90deg, var(--accent), #ff6b35)",
                        }}
                      />
                    </div>
                    <div className="marvel-exec-pct">{pct}%</div>
                  </div>
                  <div className="marvel-exec-meta">
                    Ráfaga: <span>{p.burst}ms</span>
                    &nbsp;&nbsp; Espera:{" "}
                    <span>{wait !== undefined ? wait + "ms" : "—"}</span>
                    &nbsp;&nbsp; Turnaround:{" "}
                    <span>{ta !== undefined ? ta + "ms" : "—"}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
