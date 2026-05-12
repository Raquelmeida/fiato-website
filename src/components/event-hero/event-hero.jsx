import './evento-hero.css';

function EventoHero({ image }) {
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

      <div className="evento-hero__badge">
        <span>FIATO</span>
        <small>2026</small>
      </div>
    </section>
  );
}

export default EventoHero;