import { useEffect, useRef, useState } from 'react';

import './edicoes-page.css';

import EditionSection from '../../components/edition-section/edition-section';
import Footer from '../../components/footer/footer';

import editions from '../../data/editions';
import heroImage from '../../assets/images/hero-agenda.png';
import pressImage from '../../assets/images/img-contactos.png';

function EdicoesPage() {
  const sectionRefs = useRef({});
  const [activeYear, setActiveYear] = useState('2025');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries.length > 0) {
          const year = visibleEntries[0].target.getAttribute('data-edition-year');

          if (year && year !== '2026') {
            setActiveYear(year);
          }
        }
      },
      {
        root: null,
        threshold: [0.35, 0.5, 0.65],
      }
    );

    Object.values(sectionRefs.current).forEach((section) => {
      if (section) {
        observer.observe(section);
      }
    });

    return () => observer.disconnect();
  }, []);

  function handleToggle(year) {
    if (year === '2026') return;

    setActiveYear((currentYear) => (currentYear === year ? null : year));
  }

  return (
    <main className="edicoes-page navbar_height">
      {editions.map((edition) => (
        <EditionSection
          key={edition.year}
          ref={(element) => {
            sectionRefs.current[edition.year] = element;
          }}
          edition={edition}
          heroImage={heroImage}
          pressImage={pressImage}
          isOpen={activeYear === edition.year}
          onToggle={() => handleToggle(edition.year)}
        />
      ))}

    </main>
  );
}

export default EdicoesPage;