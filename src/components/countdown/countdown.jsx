import { useEffect, useState } from 'react';
import './countdown.css';

function getRemaining(targetMs) {
  const diff = Math.max(0, targetMs - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return { days, hours, minutes };
}

function pad(n) {
  return String(n).padStart(2, '0');
}

function Countdown({ targetMs }) {
  const [time, setTime] = useState(() => getRemaining(targetMs));

  useEffect(() => {
    const id = setInterval(() => setTime(getRemaining(targetMs)), 1000);
    return () => clearInterval(id);
  }, [targetMs]);

  return (
    <div className="countdown" aria-label="Contagem decrescente">
      <div className="countdown__cell">
        <span className="countdown__value">{pad(time.days)}</span>
        <span className="countdown__label">Dias</span>
      </div>

      <span className="countdown__sep" aria-hidden="true">:</span>

      <div className="countdown__cell">
        <span className="countdown__value">{pad(time.hours)}</span>
        <span className="countdown__label">Horas</span>
      </div>

      <span className="countdown__sep" aria-hidden="true">:</span>

      <div className="countdown__cell">
        <span className="countdown__value">{pad(time.minutes)}</span>
        <span className="countdown__label">Min</span>
      </div>
    </div>
  );
}

export default Countdown;
