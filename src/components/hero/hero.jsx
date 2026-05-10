import './hero.css';

function Hero({ title, subtitle, description, image, buttonText, buttonLink }) {
  return (
    <section
      className="hero"
      data-navbar-theme="navy"
      style={{
        backgroundImage: image
          ? `linear-gradient(rgba(6, 11, 29, 0.72), rgba(6, 11, 29, 0.78)), url(${image})`
          : undefined,
      }}
    >
      <div className="hero__content">
        <h1 className="hero__title">
          {title}
          {subtitle && <span>{subtitle}</span>}
        </h1>

        {description && (
          <p className="hero__description">
            {description}
          </p>
        )}
      </div>

      {buttonText && (
        <a href={buttonLink || '#'} className="hero__button">
          {buttonText} <span>↗</span>
        </a>
      )}
    </section>
  );
}

export default Hero;