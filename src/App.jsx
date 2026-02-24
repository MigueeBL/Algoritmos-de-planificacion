import { useState } from "react";
import AppHeader from "./components/layout/AppHeader";
import Panel from "./components/layout/Panel";
import AlgoSelector from "./components/controls/AlgoSelector";
import ProcessForm from "./components/controls/ProcessForm";
import ProcessList from "./components/controls/ProcessList";
import SimulateControls from "./components/controls/SimulateControls";
import GanttChart from "./components/results/GanttChart";
import MarvelPanel from "./components/results/MarvelPanel";
import MetricsGrid from "./components/results/MetricsGrid";
import ResultsTable from "./components/results/ResultsTable";
import StepLog from "./components/results/StepLog";
import { scheduleFIFO } from "./algorithms/fifo";
import { scheduleSJF } from "./algorithms/sjf";
import { schedulePriority } from "./algorithms/priority";
import { scheduleRR } from "./algorithms/roundRobin";
import { schedulePolicy } from "./algorithms/policy";
import { COLORS } from "./constants/colors";
import { ALGO_INFO } from "./constants/algoInfo";
import { PRESETS } from "./constants/presets";

export default function App() {
  const [processes, setProcesses] = useState([]);
  const [currentAlgo, setCurrentAlgo] = useState("fifo");
  const [quantum, setQuantum] = useState(4);
  const [results, setResults] = useState(null);
  const [notif, setNotif] = useState({ msg: "", error: false, show: false });

  function showNotif(msg, error = false) {
    setNotif({ msg, error, show: true });
    setTimeout(() => setNotif((n) => ({ ...n, show: false })), 2800);
  }

  function handleAdd(proc) {
    setProcesses((prev) => [...prev, proc]);
    showNotif(`Proceso ${proc.id} agregado.`);
  }

  function handleRemove(id) {
    setProcesses((prev) => prev.filter((p) => p.id !== id));
  }

  function handleClear() {
    setProcesses([]);
    setResults(null);
    showNotif("Cola limpiada.");
  }

  function handleLoadPreset() {
    const data = PRESETS[currentAlgo] || PRESETS.fifo;
    setProcesses(data.map((p, i) => ({ ...p, colorIdx: i % COLORS.length })));
    showNotif("Ejemplo cargado para " + ALGO_INFO[currentAlgo].name);
  }

  function handleAlgoChange(algo) {
    setCurrentAlgo(algo);
    setResults(null);
  }

  function handleSimulate() {
    if (!processes.length)
      return showNotif("Agrega al menos un proceso primero.", true);

    let result;
    if (currentAlgo === "fifo") result = scheduleFIFO(processes);
    else if (currentAlgo === "sjf") result = scheduleSJF(processes);
    else if (currentAlgo === "priority") result = schedulePriority(processes);
    else if (currentAlgo === "rr") result = scheduleRR(processes, quantum);
    else result = schedulePolicy(processes);

    setResults(result);
    showNotif("¡Simulación completada!");
  }

  return (
    <>
      <div
        className={`notification ${notif.show ? "show" : ""} ${notif.error ? "error" : ""}`}
      >
        {notif.error ? "⚠ " : "✓ "}
        {notif.msg}
      </div>

      <div className="container">
        <AppHeader />

        {/* ── FILA SUPERIOR: 3 columnas ── */}
        <div className="main-grid" style={{ marginBottom: "16px" }}>
          {/* COLUMNA IZQUIERDA */}
          <div>
            <Panel
              title="01 - Selección de Algoritmo"
              className="top-row-panel"
            >
              <AlgoSelector
                currentAlgo={currentAlgo}
                quantum={quantum}
                onAlgoChange={handleAlgoChange}
                onQuantumChange={setQuantum}
              />
            </Panel>
          </div>

          {/* COLUMNA CENTRO */}
          <div>
            <Panel
              title="Visualización de Procesos" style={{textAlign: "center"}}
              className="top-row-panel"
            >
              <MarvelPanel processes={processes} results={results} />
            </Panel>
          </div>

          {/* COLUMNA DERECHA */}
          <div>
            <Panel title="02 - Agregar Proceso">
              <div className="right-col-inner">
                <div className="right-col-content">
                  <ProcessForm
                    processes={processes}
                    currentAlgo={currentAlgo}
                    onAdd={handleAdd}
                    onLoadPreset={handleLoadPreset}
                    onClear={handleClear}
                  />
                  <div className="section-divider">
                    <span>Cola de Procesos</span>
                  </div>
                  <ProcessList
                    processes={processes}
                    currentAlgo={currentAlgo}
                    onRemove={handleRemove}
                  />
                </div>
                <div style={{ paddingTop: "16px" }}>
                  <SimulateControls onSimulate={handleSimulate} />
                </div>
              </div>
            </Panel>
          </div>
        </div>

        {/* ── FILA INFERIOR: 2 columnas ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
            alignItems: "stretch",
          }}
        >
          {/* IZQUIERDA */}
          {/* IZQUIERDA */}
          <div className="bottom-row-left">
            <Panel title="03 - Diagrama de Gantt">
              <GanttChart timeline={results?.timeline} processes={processes} />
            </Panel>
            <Panel title="04 - Métricas de Rendimiento">
              <MetricsGrid procResults={results?.procResults} />
            </Panel>
          </div>

          {/* DERECHA */}
          {/* DERECHA */}
          <div className="bottom-row-right">
            <Panel title="05 - Tabla de Resultados" style={{ padding: 0 }}>
              <ResultsTable
                procResults={results?.procResults}
                processes={processes}
                currentAlgo={currentAlgo}
              />
            </Panel>
            <Panel title="06 - Traza Paso a Paso" bodyClassName="panel-scrollable">
              <StepLog logEntries={results?.log} />
            </Panel>
          </div>
        </div>
      </div>
    </>
  );
}
