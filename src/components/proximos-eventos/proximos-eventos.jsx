import './proximos-eventos.css';

const proximos = [
  {
    day: '20 MAR',
    weekday: 'Sexta',
    title: 'A queda de um anjo',
    place: 'Rivoli, Porto',
  },
  {
    day: '21 MAR',
    weekday: 'Sábado',
    title: 'Amor de perdição',
    place: 'Estação de São Bento',
  },
  {
    day: '22 MAR',
    weekday: 'Domingo',
    title: 'Coração, cabeça e estômago',
    place: 'Mercado do Bolhão',
  },
];

function ProximosEventos({ image }) {
  return (
    <section className="proximos-eventos" data-navbar-theme="blue">
      <p>Agenda + Fiato</p>
      <h2>Próximos eventos</h2>

      <div className="proximos-eventos__grid">
        {proximos.map((evento) => (
          <article className="proximos-eventos__card" key={evento.title}>
            <small>{evento.weekday}</small>
            <strong>{evento.day}</strong>
            <img src={image} alt={evento.title} />
            <h3>{evento.title}</h3>
            <span>{evento.place}</span>
            <a href="#">Comprar bilhetes</a>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ProximosEventos;