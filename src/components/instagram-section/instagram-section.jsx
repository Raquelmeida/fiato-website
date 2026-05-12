import './instagram-section.css';

function InstagramSection() {
  return (
    <section className="instagram" data-navbar-theme="light">
      <div className="instagram__inner">
        <header className="instagram__header">
          <span className="instagram__label">Instagram</span>
          <h2 className="instagram__handle">@fiato.opera</h2>
        </header>

        <div className="instagram__stage">
          <button
            type="button"
            className="instagram__nav instagram__nav--prev"
            aria-label="Anterior"
          >
            <span aria-hidden="true">‹</span>
          </button>

          <div className="instagram__phones">
            <article className="instagram__phone instagram__phone--side instagram__phone--coral">
              <div className="instagram__phone-header">
                <span className="instagram__phone-handle">@fiato.opera</span>
                <span className="instagram__phone-icon" aria-hidden="true">▶</span>
              </div>
              <div className="instagram__phone-media ph" aria-hidden="true"></div>
              <p className="instagram__phone-caption">
                <span className="instagram__hashtag">#FIATO</span> You and your family
                will love this refreshing salad that is perfect for warm days or
                summer time!
              </p>
            </article>

            <article className="instagram__phone instagram__phone--center instagram__phone--navy">
              <div className="instagram__phone-header">
                <span className="instagram__phone-handle">@fiato.opera</span>
                <span className="instagram__phone-icon" aria-hidden="true">▶</span>
              </div>
              <div className="instagram__phone-media ph" aria-hidden="true">
                <span className="instagram__visit">Visit Us</span>
              </div>
              <p className="instagram__phone-caption">
                <span className="instagram__hashtag">#FIATO</span> You and your family
                will love this refreshing salad that is perfect for warm days or
                summer time!
              </p>
            </article>

            <article className="instagram__phone instagram__phone--side instagram__phone--coral">
              <div className="instagram__phone-header">
                <span className="instagram__phone-handle">@fiato.opera</span>
                <span className="instagram__phone-icon" aria-hidden="true">▶</span>
              </div>
              <div className="instagram__phone-media ph" aria-hidden="true">
                <span className="instagram__visit">Visit Us</span>
              </div>
              <p className="instagram__phone-caption">
                <span className="instagram__hashtag">#FIATO</span> You and your family
                will love this refreshing salad that is perfect for warm days or
                summer time!
              </p>
            </article>
          </div>

          <button
            type="button"
            className="instagram__nav instagram__nav--next"
            aria-label="Próximo"
          >
            <span aria-hidden="true">›</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default InstagramSection;
