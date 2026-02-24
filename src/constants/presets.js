export const PRESETS = {
  fifo: [
    { id: 'P1', arrival: 0, burst: 8, priority: 2, weight: 5 },
    { id: 'P2', arrival: 1, burst: 4, priority: 1, weight: 7 },
    { id: 'P3', arrival: 2, burst: 9, priority: 3, weight: 3 },
    { id: 'P4', arrival: 3, burst: 5, priority: 2, weight: 6 },
  ],
  sjf: [
    { id: 'P1', arrival: 0, burst: 6, priority: 2, weight: 5 },
    { id: 'P2', arrival: 2, burst: 2, priority: 1, weight: 8 },
    { id: 'P3', arrival: 4, burst: 8, priority: 3, weight: 3 },
    { id: 'P4', arrival: 6, burst: 3, priority: 1, weight: 6 },
  ],
  priority: [
    { id: 'P1', arrival: 0, burst: 4, priority: 3, weight: 5 },
    { id: 'P2', arrival: 0, burst: 3, priority: 1, weight: 7 },
    { id: 'P3', arrival: 0, burst: 5, priority: 2, weight: 4 },
    { id: 'P4', arrival: 2, burst: 2, priority: 1, weight: 8 },
  ],
  rr: [
    { id: 'P1', arrival: 0, burst: 10, priority: 1, weight: 5 },
    { id: 'P2', arrival: 1, burst: 6,  priority: 2, weight: 5 },
    { id: 'P3', arrival: 2, burst: 4,  priority: 1, weight: 5 },
    { id: 'P4', arrival: 4, burst: 8,  priority: 2, weight: 5 },
  ],
  policy: [
    { id: 'P1', arrival: 0, burst: 8, priority: 1, weight: 8 },
    { id: 'P2', arrival: 0, burst: 6, priority: 2, weight: 5 },
    { id: 'P3', arrival: 2, burst: 4, priority: 2, weight: 3 },
    { id: 'P4', arrival: 3, burst: 5, priority: 3, weight: 6 },
  ],
};