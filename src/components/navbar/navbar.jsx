import { useEffect, useState } from 'react';
import './navbar.css';

function Navbar() {
  const [navbarTheme, setNavbarTheme] = useState('transparent');

  useEffect(() => {
    function handleScroll() {
      const sections = document.querySelectorAll('[data-navbar-theme]');
      const navbarHeight = 120;

      let currentTheme = 'transparent';

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();

        if (rect.top <= navbarHeight && rect.bottom >= navbarHeight) {
          currentTheme = section.getAttribute('data-navbar-theme');
        }
      });

      setNavbarTheme(currentTheme);
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`navbar navbar--${navbarTheme}`}>
      <div className="navbar__inner">
        <a href="/" className="navbar__logo">
          FIATO
        </a>

        <nav className="navbar__menu">
          <a href="/" className="navbar__link navbar__link--active">
            FIATO
          </a>
          <a href="/agenda" className="navbar__link">
            AGENDA
          </a>
          <a href="/edicoes" className="navbar__link">
            EDIÇÕES
          </a>
          <a href="/sobre-nos" className="navbar__link">
            SOBRE NÓS
          </a>
          <a href="/contactos" className="navbar__link">
            CONTACTOS
          </a>
        </nav>

        <div className="navbar__right">
          <div className="navbar__language">
            <button type="button" className="navbar__language-option">
              EN
            </button>

            <button
              type="button"
              className="navbar__language-option navbar__language-option--active"
            >
              PT
            </button>
          </div>

          <button type="button" className="navbar__toggle" aria-label="Abrir menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;