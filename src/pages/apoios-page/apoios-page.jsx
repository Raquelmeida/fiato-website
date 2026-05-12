import './apoios-page.css';

import PartnersSection from '../../components/partners-section/partners-section';
import SupportContact from '../../components/support-contact/support-contact';
import EventoMarquee from '../../components/evento-marquee/evento-marquee';
import Footer from '../../components/footer/footer';

import backgroundImage from '../../assets/images/img-contactos.png';
import logoWhite from '../../assets/images/logo-republica-white.png';
import logoDark from '../../assets/images/logo-republica-dark.png';

function ApoiosPage() {
  return (
    <main className="apoios-page navbar_height">
      <section
        className="apoios-hero"
        data-navbar-theme="navy"
        style={{
          backgroundImage: `linear-gradient(rgba(18, 34, 86, 0.78), rgba(18, 34, 86, 0.84)), url(${backgroundImage})`,
        }}
      >
        <div className="apoios-hero__inner">
          <h1>
            Quer tornar-se
            <span>
              parte do <em>espetáculo?</em>
            </span>
          </h1>

          <p className="apoios-hero__subtitle">Entre em palco connosco</p>

          <div className="apoios-hero__texts">
            <p>
              Desde 2014, transformando a cidade do Porto num palco cultural vivo
              através de performances inovadoras em espaços não convencionais.
            </p>

            <p>
              Desde 2014, transformando a cidade do Porto num palco cultural vivo
              através de performances inovadoras em espaços não convencionais.
            </p>
          </div>
        </div>
      </section>

      <PartnersSection
        title="Financiado por"
        variant="light"
        logo={logoDark}
        repetitions={3}
      />

      <PartnersSection
        title="Parceria Comunicação"
        variant="blue"
        logo={logoWhite}
        repetitions={3}
      />

      <PartnersSection
        title="Parceria Local"
        variant="light"
        logo={logoDark}
        repetitions={4}
      />

      <EventoMarquee />

      <SupportContact image={backgroundImage} />


    </main>
  );
}

export default ApoiosPage;