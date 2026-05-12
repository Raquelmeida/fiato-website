import { Link } from 'react-router-dom';
import './agenda-event-card.css';

function AgendaEventCard({ event }) {
  return (
    <article className="agenda-event-card">
      <div className="agenda-event-card__main">
        <div className="agenda-event-card__date">
          <span>{event.day}</span>
          <small>{event.month}</small>
        </div>

        <h3 className="agenda-event-card__title">{event.title}</h3>
      </div>

      <div className="agenda-event-card__info">
        <p>{event.time}</p>
        <p>{event.place}</p>
        <p>{event.price}</p>
      </div>

      <div className="agenda-event-card__actions">
        <Link
          to="/evento"
          className="agenda-event-card__button agenda-event-card__button--outline"
        >
          Saber mais
        </Link>

        <Link
          to="/bilhetes"
          className="agenda-event-card__button agenda-event-card__button--filled"
        >
          Comprar
        </Link>
      </div>
    </article>
  );
}

export default AgendaEventCard;