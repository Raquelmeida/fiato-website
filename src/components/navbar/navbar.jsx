import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
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
        <NavLink to="/" className="navbar__logo">
          FIATO
        </NavLink>

        <nav className="navbar__menu">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
            }
          >
            FIATO
          </NavLink>

          <NavLink
            to="/agenda"
            className={({ isActive }) =>
              isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
            }
          >
            AGENDA
          </NavLink>

          <NavLink
            to="/edicoes"
            className={({ isActive }) =>
              isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
            }
          >
            EDIÇÕES
          </NavLink>

          <NavLink
            to="/sobre-nos"
            className={({ isActive }) =>
              isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
            }
          >
            SOBRE NÓS
          </NavLink>

          <NavLink
            to="/apoios"
            className={({ isActive }) =>
              isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
            }
          >
            APOIOS
          </NavLink>

          <NavLink
            to="/contactos"
            className={({ isActive }) =>
              isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
            }
          >
            CONTACTOS
          </NavLink>
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