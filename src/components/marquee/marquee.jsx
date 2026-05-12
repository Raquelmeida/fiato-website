import './marquee.css';

function Marquee({ items = [], variant = 'accent', repeat = 3 }) {
  // Duplicate the item list so the translateX(-50%) animation loops seamlessly.
  // We repeat the user-supplied items `repeat` times, then double the whole
  // sequence for the looping half.
  const sequence = Array.from({ length: repeat }).flatMap(() => items);

  return (
    <div className={`marquee marquee--${variant}`} data-navbar-theme={variant === 'accent' ? 'orange' : 'navy'}>
      <div className="marquee__track">
        {[...sequence, ...sequence].map((item, index) => (
          <span key={index} className="marquee__item">
            <span className="marquee__text">{item}</span>
            <span className="marquee__dot" aria-hidden="true">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default Marquee;
