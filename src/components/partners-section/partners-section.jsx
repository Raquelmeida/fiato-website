import './partners-section.css';

function PartnersSection({ title, variant = 'light', logo, repetitions = 3 }) {
  const logos = Array.from({ length: repetitions });

  return (
    <section
      className={`partners-section partners-section--${variant}`}
      data-navbar-theme={variant === 'blue' ? 'blue' : 'light'}
    >
      <div className="partners-section__inner">
        <h2>{title}</h2>

        <div className="partners-section__grid">
          {logos.map((_, index) => (
            <article className="partners-section__card" key={index}>
              <img src={logo} alt="República Portuguesa" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PartnersSection;