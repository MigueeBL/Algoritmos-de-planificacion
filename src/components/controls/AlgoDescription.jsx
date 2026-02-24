import { ALGO_INFO } from '../../constants/algoInfo';

export default function AlgoDescription({ currentAlgo }) {
  const info = ALGO_INFO[currentAlgo];

  return (
    <div className="algo-desc">
      <h3>{info.name}</h3>
      <p>{info.desc}</p>
      <div className="pros-cons">
        <div>
          <h4 className="pro">✓ Ventajas</h4>
          <ul>
            {info.pros.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </div>
        <div>
          <h4 className="con">✗ Desventajas</h4>
          <ul>
            {info.cons.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}