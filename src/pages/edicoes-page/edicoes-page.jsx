import { useState } from 'react';

import './edicoes-page.css';

import EditionSection from '../../components/edition-section/edition-section';
import AgendaFilters from '../../components/agenda-filters/agenda-filters';
import AgendaList from '../../components/agenda-list/agenda-list';
import Footer from '../../components/footer/footer';

import editions from '../../data/editions';
import events from '../../data/events';
import heroEdicoes from '../../assets/images/hero-agenda.png';

function EdicoesPage() {
  const [openEdition, setOpenEdition] = useState(null);

  function handleToggleEdition(year) {
    setOpenEdition((currentEdition) =>
      currentEdition === year ? null : year
    );
  }

  return (
    <main className="edicoes-page">
      {editions.map((edition) => (
        <div key={edition.id}>
          <EditionSection
            edition={edition}
            image={edition.hasImage ? heroEdicoes : null}
            isOpen={openEdition === edition.year}
            onToggle={() => handleToggleEdition(edition.year)}
          />

          {openEdition === edition.year && (
            <section className="edicoes-page__archive" data-navbar-theme="light">
              <div className="edicoes-page__archive-header">
                <h2>Junho</h2>
                <AgendaFilters />
              </div>

              <AgendaList events={events} />
            </section>
          )}
        </div>
      ))}

      <Footer />
    </main>
  );
}

export default EdicoesPage;