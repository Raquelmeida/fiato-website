import { Link } from 'react-router-dom';

import heroImage from '../../assets/hero.png';
import Countdown from '../../components/countdown/countdown';
import Marquee from '../../components/marquee/marquee';
import EventCard from '../../components/event-card/event-card';
import PressList from '../../components/press-list/press-list';
import InstagramSection from '../../components/instagram-section/instagram-section';
import SponsorsSection from '../../components/sponsors-section/sponsors-section';

import './home-page.css';

// Countdown target: 14 days, 8 hours, 32 minutes from page load
// (Per the documentation. The component itself will continue ticking down.)
const targetMs = Date.now() + (14 * 24 * 60 * 60 * 1000)
                            + (8 * 60 * 60 * 1000)
                            + (32 * 60 * 1000);

const marqueeItems = [
  'A Ópera Desce à Rua',
  'Ocupação Lírica',
  'A Ópera Desce à Rua',
  'Ocupação Lírica',
];

function HomePage() {
  return (
    <main className="home page">
      {/* 1. HERO ------------------------------------------------------- */}
      <section className="home-hero" data-navbar-theme="navy">
        <div className="home-hero__left">
          <div
            className="home-hero__photo"
            style={{ backgroundImage: `url(${heroImage})` }}
            role="img"
            aria-label="Performer em palco"
          >
            <span className="home-hero__badge">Estreia Mundial</span>
          </div>
        </div>

        <div className="home-hero__right">
          {/* Band 1 — Countdown */}
          <div className="home-hero__band home-hero__band--cream">
            <div className="home-hero__band-inner">
              <div className="home-hero__countdown-meta">
                <span className="home-hero__eyebrow">Próximo Espetáculo</span>
                <span className="home-hero__countdown-title">
                  Contagem Decrescente
                </span>
              </div>
              <Countdown targetMs={targetMs} />
            </div>
          </div>

          {/* Band 2 — Title */}
          <div className="home-hero__band home-hero__band--navy" data-navbar-theme="navy">
            <h1 className="home-hero__title">
              <span>A VIDA DO</span>
              <span className="home-hero__title-accent">GRANDE</span>
              <span>CAMILO</span>
            </h1>
          </div>

          {/* Band 3 — Description + CTA */}
          <div className="home-hero__band home-hero__band--cream home-hero__band--cta">
            <p className="home-hero__description">
              A Ópera à Moda do Porto regressa às ruas. Uma adaptação imersiva
              que funde a música clássica com o tecido urbano contemporâneo.
            </p>
            <Link to="/agenda" className="home-hero__cta">
              VER EVENTO
              <span className="home-hero__cta-arrow" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. MARQUEE ---------------------------------------------------- */}
      <Marquee items={marqueeItems} variant="accent" repeat={3} />

      {/* 3. ÚLTIMOS EVENTOS ------------------------------------------- */}
      <section className="latest" data-navbar-theme="light">
        <div className="latest__inner">
          <header className="latest__header">
            <h2 className="latest__heading">
              <span className="latest__heading-eyebrow">Últimos</span>
              <span className="latest__heading-main">EVENTOS</span>
            </h2>
            <Link to="/agenda" className="latest__cta">
              VER AGENDA <span aria-hidden="true">↗</span>
            </Link>
          </header>

          <div className="latest__grid">
            <EventCard
              variant="coral"
              status="Últimos lugares"
              statusTone="red"
              date="24 mar 2026"
              place="Estação S. Bento"
              title="As bodas de Fígaro"
              description="A Ópera à Moda do Porto regressa às ruas. Uma adaptação imersiva que funde a música clássica com o tecido urbano contemporâneo."
            />

            <EventCard
              variant="cream"
              status="Grátis"
              statusTone="blue"
              date="05 mai 2026"
              place="Ribeira"
              title="La Traviata Portuense"
              description="A Ópera à Moda do Porto regressa às ruas. Uma adaptação imersiva que funde a música clássica com o tecido urbano contemporâneo."
            />

            <EventCard
              variant="navy"
              status="Lotação Baixa"
              statusTone="half"
              date="12 abr 2026"
              place="Mercado do Bolhão"
              title="Carmen no Mercado"
              description="A Ópera à Moda do Porto regressa às ruas. Uma adaptação imersiva que funde a música clássica com o tecido urbano contemporâneo."
            />
          </div>
        </div>
      </section>

      {/* 4. NA IMPRENSA ----------------------------------------------- */}
      <PressList />

      {/* 5. INSTAGRAM ------------------------------------------------- */}
      <InstagramSection />

      {/* 6. SPONSORS -------------------------------------------------- */}
      <SponsorsSection />
    </main>
  );
}

export default HomePage;