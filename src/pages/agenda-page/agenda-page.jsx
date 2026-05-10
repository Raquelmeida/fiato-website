import './agenda-page.css';

import Navbar from '../../components/navbar/navbar';
import Hero from '../../components/hero/hero';
import AgendaFilters from '../../components/agenda-filters/agenda-filters';
import AgendaList from '../../components/agenda-list/agenda-list';
import Footer from '../../components/footer/footer';

import events from '../../data/events';
import heroAgenda from '../../assets/images/hero-agenda.png';

function AgendaPage() {
  return (
    <>
      <Navbar />

      <main className="agenda-page">
        <Hero
          title="AGENDA"
          subtitle="2026"
          description="Uma experiência auditiva imersiva onde o ambiente se torna o fosso da orquestra. Sem cordões de veludo. Sem tetos dourados."
          image={heroAgenda}
          buttonText="Novidades"
        />

        <section className="agenda-page__content">
          <div className="agenda-page__header">
            <h2>Maio</h2>
            <AgendaFilters />
          </div>

          <AgendaList events={events} />
        </section>
      </main>

      <Footer />
    </>
  );
}

export default AgendaPage;