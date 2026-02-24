export const ALGO_INFO = {
  fifo: {
    name: 'First In, First Out (FIFO)',
    desc: 'Los procesos se ejecutan en el orden estricto en que llegan a la cola de listos. Es el algoritmo más simple y no preventivo.',
    pros: ['Fácil de implementar', 'Justo en orden de llegada', 'Sin inanición'],
    cons: ['Efecto convoy: procesos cortos esperan a los largos', 'Tiempo de espera promedio alto', 'No optimiza el uso de CPU'],
  },
  sjf: {
    name: 'Shortest Job First (SJF)',
    desc: 'Selecciona el proceso con el menor tiempo de ráfaga estimado. Versión no preventiva.',
    pros: ['Minimiza el tiempo de espera promedio', 'Óptimo estadísticamente', 'Útil en procesos batch'],
    cons: ['Requiere conocer ráfagas de antemano', 'Puede causar inanición en procesos largos', 'Difícil de predecir tiempos reales'],
  },
  priority: {
    name: 'Planificación por Prioridad',
    desc: 'Cada proceso tiene una prioridad asignada. El CPU siempre atiende al de mayor prioridad (menor número = mayor prioridad). Versión no preventiva.',
    pros: ['Ideal para tiempo real', 'Permite atender procesos críticos', 'Flexible en diseño'],
    cons: ['Inanición (starvation) en procesos de baja prioridad', 'Requiere mecanismo de aging', 'Asignación de prioridades es subjetiva'],
  },
  rr: {
    name: 'Round Robin',
    desc: 'Cada proceso recibe un tiempo fijo (quantum). Si no termina, va al final de la cola. Algoritmo preventivo para tiempo compartido.',
    pros: ['Equitativo — todos reciben CPU', 'Buen tiempo de respuesta', 'Sin inanición'],
    cons: ['Quantum muy pequeño = demasiado overhead', 'Quantum muy grande = comporta como FIFO', 'Mayor número de cambios de contexto'],
  },
  policy: {
    name: 'Por Política — CFS (Completely Fair Scheduler)',
    desc: 'Inspirado en el CFS de Linux. Asigna tiempo de CPU proporcional al peso de cada proceso.',
    pros: ['Muy flexible y adaptable', 'Equidad ponderada', 'Optimiza rendimiento y equidad'],
    cons: ['Más complejo de implementar', 'Difícil de analizar teóricamente', 'Requiere parámetros bien configurados'],
  },
};