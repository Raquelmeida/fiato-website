import './event-card.css';

function EventCard({
  variant = 'cream', // 'coral' | 'cream' | 'navy'
  status,            // e.g. 'Últimos lugares'
  statusTone,        // 'red' | 'blue' | 'half'
  date,
  place,
  title,
  description,
  image,
}) {
  return (
    <article className={`event-card event-card--${variant}`}>
      <div className="event-card__status-row">
        <span className={`event-card__status event-card__status--${statusTone || 'blue'}`}>
          <span className="event-card__status-dot" aria-hidden="true"></span>
          {status}
        </span>
      </div>

      <div
        className="event-card__media"
        style={image ? { backgroundImage: `url(${image})` } : undefined}
        role="img"
        aria-label={title}
      >
        {!image && <div className="event-card__placeholder ph" />}
      </div>

      <div className="event-card__meta">
        <span>{date}</span>
        <span className="event-card__sep" aria-hidden="true">·</span>
        <span>{place}</span>
      </div>

      <h3 className="event-card__title">{title}</h3>

      <p className="event-card__description">{description}</p>
    </article>
  );
}

export default EventCard;
