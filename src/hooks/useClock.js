import { useState, useEffect } from 'react';

export function useClock() {
  const [time, setTime] = useState('--:--:--');

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString('es-MX', { hour12: false }));
    }, 1000);

    return () => clearInterval(interval); // limpia al desmontar
  }, []);

  return time;
}