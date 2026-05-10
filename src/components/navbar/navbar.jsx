import './navbar.css';

function Navbar() {
  return (
    <header className="navbar">
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