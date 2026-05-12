import { Link } from 'react-router-dom';

import EditorialHero from '../../components/editorial-hero/editorial-hero';
import Marquee from '../../components/marquee/marquee';
import FaqList from '../../components/faq-list/faq-list';

import './sobre-nos-page.css';

/* ------------------------------------------------------------------ */
/* Hero composition — each word can be plain, accent, italic, faded,  */
/* an inline image, or an inline icon (star / circle / arrow).        */
/* ------------------------------------------------------------------ */
const heroLines = [
  {
    words: [
      { text: 'ÓPERA' },
      { image: 'ph' },
      { text: 'à', italic: true },
      { text: 'MODA' },
    ],
  },
  {
    words: [
      { text: 'do', italic: true },
      { text: 'PORTO', accent: true },
      { text: '2026', faded: true },
      { image: 'ph' },
    ],
  },
  {
    words: [
      { text: 'QUEBRAMOS' },
      { icon: 'star' },
      { text: 'FRONTEIRAS' },
    ],
  },
  {
    words: [
      { text: 'da', italic: true },
      { icon: 'circle' },
      { text: 'MÚSICA', accent: true },
      { text: 'CLÁSSICA' },
      { icon: 'arrow' },
    ],
  },
  {
    words: [
      { image: 'ph' },
      { text: 'Colocámo-la', italic: true },
      { text: 'na', italic: true },
      { text: 'RUA', accent: true },
    ],
  },
];

const heroActions = [
  { label: 'Programação', to: '/agenda' },
  { label: 'Edições', to: '/edicoes' },
  { label: 'Contactos', to: '/contactos' },
];

const marqueeItems = [
  'A Ópera Desce à Rua',
  'Ocupação Lírica',
  'A Ópera Desce à Rua',
  'Ocupação Lírica',
];

const teamMembers = Array.from({ length: 8 }, (_, i) => ({ id: i + 1 }));

const faqs = [
  {
    question: 'Os espectáculos são acessíveis a todos os públicos?',
    answer:
      'Sim, a nossa programação inclui propostas para diferentes idades e níveis de familiaridade com a ópera. Dos 6 meses aos 100 anos.',
  },
  {
    question: 'Onde decorrem os eventos?',
    answer:
      'Em espaços icónicos do Porto, desde teatros históricos a locais ao ar livre.',
  },
  {
    question: 'Como posso comprar bilhetes?',
    answer:
      'Através do nosso site oficial ou nas bilheteiras dos espaços parceiros.',
  },
  {
    question: 'É necessário conhecer ópera para assistir?',
    answer:
      'Não. Os nossos espectáculos são pensados para acolher tanto os mais experientes como quem descobre a ópera pela primeira vez.',
  },
];

function SobreNosPage() {
  return (
    <main className="sobre-nos">
      {/* 1. EDITORIAL HERO ------------------------------------------- */}
      <EditorialHero
        lines={heroLines}
        description="Desde 2014, transformando a cidade do Porto num palco cultural vivo através de performances inovadoras em espaços não convencionais."
        actions={heroActions}
      />

      {/* 2. MANIFESTO ------------------------------------------------ */}
      <section className="manifesto" data-navbar-theme="light">
        <div className="manifesto__inner">
          <span className="manifesto__eyebrow">
            Um encontro singular entre tradição e inovação.
          </span>

          <h2 className="manifesto__title">
            Nascemos da vontade de trazer a{' '}
            <em>arte&nbsp;lírica</em> e performativa para o coração da cidade.
          </h2>

          <div className="manifesto__columns">
            <p>
              Ao longo das suas edições, o Fiato reuniu artistas nacionais e
              internacionais em palcos icónicos do Porto, celebrando a riqueza
              cultural da cidade e do país. Uma experiência imersiva que convida
              o público a descobrir, sentir e partilhar a força da ópera.
            </p>
            <p>
              Com raízes profundas na identidade portuense, projecta-se para
              além fronteiras, colocando o Porto no mapa dos grandes festivais
              europeus de artes performativas. Uma celebração da voz humana, da
              música e do movimento — ano após ano, edição após edição.
            </p>
          </div>
        </div>
      </section>

      {/* 3. MARQUEE -------------------------------------------------- */}
      <Marquee items={marqueeItems} variant="accent" repeat={3} />

      {/* 4. EDIÇÃO 2026 SPLIT ---------------------------------------- */}
      <section className="edition-feature" data-navbar-theme="light">
        <div className="edition-feature__photo ph" aria-hidden="true"></div>

        <div className="edition-feature__content">
          <span className="edition-feature__eyebrow">O FIATO é para todos</span>

          <div className="edition-feature__year">
            <span className="edition-feature__year-top">20</span>
            <span className="edition-feature__year-bottom">26</span>
          </div>

          <p className="edition-feature__description">
            Uma edição revolucionária que transforma a cidade numa galeria viva
            de expressão operática contemporânea.
          </p>

          <Link to="/edicoes" className="edition-feature__cta">
            Consultar Arquivo
          </Link>
        </div>
      </section>

      {/* 5. EQUIPA --------------------------------------------------- */}
      <section className="team" data-navbar-theme="navy">
        <div className="team__inner">
          <header className="team__header">
            <div className="team__heading-wrap">
              <span className="team__eyebrow">A equipa por trás das cortinas</span>
              <h2 className="team__heading">
                Uma disrupção necessária ao serviço{' '}
                <br className="team__break" />
                da <em>democratização</em> cultural.
              </h2>
            </div>

            <div className="team__star" aria-hidden="true">
              <svg viewBox="0 0 200 200" width="100%" height="100%">
                <defs>
                  <filter id="brush">
                    <feTurbulence baseFrequency="0.9" numOctaves="2" seed="3" />
                    <feDisplacementMap in="SourceGraphic" scale="4" />
                  </filter>
                </defs>
                <g filter="url(#brush)" fill="var(--color-accent)">
                  <path d="M100 0 L112 88 L200 100 L112 112 L100 200 L88 112 L0 100 L88 88 Z" />
                </g>
              </svg>
            </div>
          </header>

          <div className="team__grid">
            {teamMembers.map((member) => (
              <div key={member.id} className="team__member">
                <div className="team__photo ph" role="img" aria-label="Membro da equipa"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. PERGUNTAS FREQUENTES ------------------------------------ */}
      <section className="faq" data-navbar-theme="light">
        <div className="faq__inner">
          <aside className="faq__aside">
            <span className="faq__eyebrow">O Fiato é para todos</span>
            <h2 className="faq__heading">
              Perguntas <br /> Frequentes
            </h2>
          </aside>

          <div className="faq__content">
            <FaqList items={faqs} />
          </div>
        </div>
      </section>
    </main>
  );
}

export default SobreNosPage;