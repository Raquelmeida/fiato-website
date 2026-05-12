import { useState } from 'react';
import './evento-accordion.css';

const items = [
  {
    title: 'O que é a Ópera à Moda do Porto?',
    content:
      'A Ópera à Moda do Porto é uma proposta artística do FIATO que aproxima a ópera da cidade, levando a experiência lírica para contextos urbanos, espaços não convencionais e públicos mais diversos.',
  },
  {
    title: 'Os espetáculos têm custo de entrada?',
    content:
      'Alguns espetáculos podem ter entrada gratuita e outros podem exigir bilhete ou reserva prévia. A informação específica de cada sessão deve ser consultada na área de bilheteira e sessões.',
  },
  {
    title: 'Faixa etária, Acessibilidade e Duração',
    content:
      'A duração prevista é de aproximadamente 1h30. As recomendações de faixa etária e as condições de acessibilidade podem variar consoante o espaço e o formato de cada apresentação.',
  },
  {
    title: 'Ficha Técnica',
    content:
      'A ficha técnica reúne a equipa artística, direção, curadoria, produção, intérpretes e restantes elementos envolvidos na criação e apresentação do espetáculo.',
  },
];

function EventoAccordion() {
  const [openIndex, setOpenIndex] = useState(null);

  function handleToggle(index) {
    setOpenIndex((currentIndex) => (currentIndex === index ? null : index));
  }

  return (
    <section className="evento-accordion" data-navbar-theme="light">
      <h2>Sobre o espetáculo</h2>

      <div className="evento-accordion__list">
        {items.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              className={`evento-accordion__item ${isOpen ? 'evento-accordion__item--open' : ''}`}
              key={item.title}
            >
              <button
                type="button"
                className="evento-accordion__trigger"
                onClick={() => handleToggle(index)}
                aria-expanded={isOpen}
              >
                <span className="evento-accordion__number">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <span className="evento-accordion__title">
                  {item.title}
                </span>

                <span className="evento-accordion__icon">
                  {isOpen ? '−' : '+'}
                </span>
              </button>

              <div className="evento-accordion__content">
                <p>{item.content}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default EventoAccordion;