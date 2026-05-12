import './evento-page.css';

import EventoHero from '../../components/evento-hero/evento-hero';
import EventoMarquee from '../../components/evento-marquee/evento-marquee';
import EventoInfo from '../../components/evento-info/evento-info';
import EventoSessoes from '../../components/evento-sessoes/evento-sessoes';
import EventoAccordion from '../../components/evento-accordion/evento-accordion';
import ProximosEventos from '../../components/proximos-eventos/proximos-eventos';

import eventoImage from '../../assets/images/img-contactos.png';

function EventoPage() {
  return (
    <main className="evento-page">
      <EventoHero image={eventoImage} edition="2026" />

      <EventoMarquee />

      <EventoInfo image={eventoImage} />

      <EventoSessoes />

      <EventoMarquee />

      <EventoAccordion />

      <ProximosEventos image={eventoImage} />
    </main>
  );
}

export default EventoPage;