import './evento-sessoes.css';

const sessions = [
  {
    date: '20 Março 2026',
    time: '19:00',
    place: 'Avenida dos Aliados, Porto',
    status: 'Reservar',
  },
  {
    date: '21 Março 2026',
    time: '17:00',
    place: 'Praça do Município, Porto',
    status: 'Esgotado',
  },
  {
    date: '21 Março 2026',
    time: '21:30',
    place: 'Praça do Município, Porto',
    status: 'Reservar',
  },
  {
    date: '22 Março 2026',
    time: '16:00',
    place: 'Jardins do Palácio de Cristal, Porto',
    status: 'Reservar',
  },
];

function EventoSessoes() {
  return (
    <section className="evento-sessoes" data-navbar-theme="blue">
      <div className="evento-sessoes__intro">
        <p>Bilheteira e sessões</p>
        <h2>Garanta o seu lugar.</h2>
        <span>
          Apesar do evento decorrer no espaço público, existem zonas sentadas e
          de visibilidade premium que exigem reserva prévia.
        </span>
      </div>

      <div className="evento-sessoes__list">
        {sessions.map((session, index) => (
          <article className="evento-sessoes__item" key={index}>
            <div>
              <h3>{session.date}</h3>
              <p>{session.place}</p>
            </div>

            <strong>{session.time}</strong>

            <button
              type="button"
              className={session.status === 'Esgotado' ? 'is-disabled' : ''}
            >
              {session.status}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

export default EventoSessoes;