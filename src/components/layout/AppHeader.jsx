import { useClock } from '../../hooks/useClock';
import logo from '../../assets/logo.svg';

export default function AppHeader() {
  const time = useClock();

  return (
    <header>
      <div className="logo">
        <div className="logo-icon">
          <img src={logo} alt="logo" width="58" height="58"/>
        </div>
        <div className="logo-text">
          <h1>Algoritmos de Planificación </h1>
        </div>
      </div>
      <div className="status-bar">
        <span>
          <span className="status-dot"></span>Sistema en línea
        </span>
        <span>{time}</span>
      </div>
    </header>
  );
}