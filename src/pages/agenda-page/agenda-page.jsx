import './agenda-page.css';

import Hero from '../../components/hero/hero';
import AgendaList from '../../components/agenda-list/agenda-list';
import Footer from '../../components/footer/footer';

import events from '../../data/events';
import heroAgenda from '../../assets/images/hero-agenda.png';

function AgendaPage() {
  return (
    <main className="agenda-page">
      <Hero
        title="AGENDA"
        subtitle="2026"
        description="Uma experiência auditiva imersiva onde o ambiente se torna o fosso da orquestra. Sem cordões de veludo. Sem tetos dourados."
        image={heroAgenda}
        buttonText="Novidades"
        buttonLink="#novidades"
      />

      <AgendaList events={events} />

      <Footer />
    </main>
  );
}

export default AgendaPage;