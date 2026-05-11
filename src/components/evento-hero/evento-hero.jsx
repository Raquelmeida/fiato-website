import './evento-hero.css';

function EventoHero({ image, edition = '2026' }) {
  return (
    <section
      className="evento-hero"
      data-navbar-theme="navy"
      style={{
        backgroundImage: `linear-gradient(rgba(18, 34, 86, 0.72), rgba(18, 34, 86, 0.78)), url(${image})`,
      }}
    >
      <div className="evento-hero__tags">
        <span>Música clássica</span>
        <span>Vanguarda</span>
      </div>

      <div className="evento-hero__content">
        <h1>
          Ópera à moda
          <span>do Porto</span>
        </h1>
      </div>

      <div className="evento-hero__counter" aria-label={`Edição FIATO ${edition}`}>
        <span>FIATO</span>
        <strong>{edition}</strong>
      </div>
    </section>
  );
}

export default EventoHero;