import './footer.css';

function Footer() {
  return (
    <footer className="footer" data-navbar-theme="orange">
      <div className="footer__brand">
        FIATO
      </div>

      <div className="footer__links">
        <nav>
          <a href="/">Página inicial</a>
          <a href="/agenda">Agenda</a>
          <a href="/edicoes">Edições</a>
          <a href="/sobre-nos">Sobre nós</a>
        </nav>

        <nav>
          <a href="/contactos">Contactos / Apoios</a>
          <a href="/informacoes">Informações</a>
          <a href="mailto:info@fiato.pt">E-mail</a>
          <a href="/imprensa">Imprensa & Institucional</a>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;