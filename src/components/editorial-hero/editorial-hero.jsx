import { Link } from 'react-router-dom';
import './editorial-hero.css';

/**
 * EditorialHero
 * Magazine-style hero where image rectangles sit inline with the title.
 * Used on the Sobre Nós page.
 *
 * Each line is a flex row so the images can sit inline with the text,
 * vertically aligned to the line's baseline (visually centered).
 */
function EditorialHero({
  lines,        // [{ words: [{ text, accent?, italic?, faded?, image?, icon? }] }]
  description,
  actions = [], // [{ label, to }]
}) {
  return (
    <section className="editorial-hero" data-navbar-theme="navy">
      <div className="editorial-hero__inner">
        <h1 className="editorial-hero__title">
          {lines.map((line, lineIndex) => (
            <span className="editorial-hero__line" key={lineIndex}>
              {line.words.map((word, wordIndex) => {
                if (word.image) {
                  return (
                    <span
                      key={wordIndex}
                      className="editorial-hero__image ph"
                      style={
                        word.image && typeof word.image === 'string' && word.image !== 'ph'
                          ? { backgroundImage: `url(${word.image})` }
                          : undefined
                      }
                      aria-hidden="true"
                    />
                  );
                }
                if (word.icon === 'star') {
                  return (
                    <span key={wordIndex} className="editorial-hero__icon" aria-hidden="true">
                      <svg viewBox="0 0 32 32" width="36" height="36">
                        <path
                          d="M16 0 L19 13 L32 16 L19 19 L16 32 L13 19 L0 16 L13 13 Z"
                          fill="currentColor"
                        />
                      </svg>
                    </span>
                  );
                }
                if (word.icon === 'circle') {
                  return (
                    <span key={wordIndex} className="editorial-hero__icon editorial-hero__icon--circle" aria-hidden="true">
                      <svg viewBox="0 0 32 32" width="40" height="40">
                        <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="2" />
                        <circle cx="16" cy="16" r="5" fill="currentColor" />
                      </svg>
                    </span>
                  );
                }
                if (word.icon === 'arrow') {
                  return (
                    <span key={wordIndex} className="editorial-hero__icon editorial-hero__icon--arrow" aria-hidden="true">
                      <svg viewBox="0 0 40 24" width="48" height="28">
                        <path
                          d="M0 12 L34 12 M24 2 L34 12 L24 22"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  );
                }
                const classes = ['editorial-hero__word'];
                if (word.accent) classes.push('editorial-hero__word--accent');
                if (word.italic) classes.push('editorial-hero__word--italic');
                if (word.faded) classes.push('editorial-hero__word--faded');
                return (
                  <span key={wordIndex} className={classes.join(' ')}>
                    {word.text}
                  </span>
                );
              })}
            </span>
          ))}
        </h1>

        <div className="editorial-hero__footer">
          <p className="editorial-hero__description">{description}</p>

          {actions.length > 0 && (
            <nav className="editorial-hero__actions">
              {actions.map((action) => (
                <Link key={action.label} to={action.to} className="editorial-hero__action">
                  {action.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </div>
    </section>
  );
}

export default EditorialHero;
