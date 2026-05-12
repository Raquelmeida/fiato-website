import './edition-section.css';

function EditionSection({ edition, image, isOpen, onToggle }) {
  const hasImage = Boolean(image);

  return (
    <section
      className={`edition-section edition-section--${edition.theme}`}
      data-navbar-theme={edition.theme}
      style={
        hasImage
          ? {
              backgroundImage: `linear-gradient(rgba(6, 11, 29, 0.72), rgba(6, 11, 29, 0.78)), url(${image})`,
            }
          : undefined
      }
    >
      <button
        type="button"
        className={`edition-section__button ${isOpen ? 'edition-section__button--open' : ''}`}
        aria-label={`Ver edição ${edition.year}`}
        onClick={onToggle}
      >
        ↓
      </button>

      <div className="edition-section__content">
        <h2 className="edition-section__year">{edition.year}</h2>
        <p className="edition-section__subtitle">{edition.subtitle}</p>
      </div>
    </section>
  );
}

export default EditionSection;