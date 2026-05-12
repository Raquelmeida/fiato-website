import './contactos-page.css';

import Footer from '../../components/footer/footer';
import contactosImage from '../../assets/images/img-contactos.png';

function ContactosPage() {
  return (
    <main className="contactos-page">
      <section
        className="contactos-hero"
        data-navbar-theme="navy"
        style={{
          backgroundImage: `linear-gradient(rgba(18, 34, 86, 0.78), rgba(18, 34, 86, 0.82)), url(${contactosImage})`,
        }}
      >
        <div className="contactos-hero__content">
          <div className="contactos-hero__text">
            <h1>
              Estamos
              <span>à escuta</span>
            </h1>

            <p>
              Fala connosco. Para dúvidas, sugestões, parcerias, candidaturas ou
              questões sobre a programação, entra em contacto — respondemos com a
              maior brevidade possível.
            </p>
          </div>

          <form className="contactos-form">
            <div className="contactos-form__row">
              <input type="text" placeholder="Nome" />
              <input type="text" placeholder="Apelido" />
            </div>

            <input type="email" placeholder="Email" />

            <textarea placeholder="Mensagem"></textarea>

            <button type="submit">Enviar</button>
          </form>
        </div>
      </section>

      <section className="member-section" data-navbar-theme="light">
        <div className="member-section__inner">
          <p className="member-section__eyebrow">
            Um encontro singular entre tradição e inovação
          </p>

          <h2>Como me tornar membro da Fiato?</h2>

          <p className="member-section__description">
            Ao longo das suas edições, o Fiato reuniu artistas nacionais e
            internacionais em palcos icónicos do Porto, celebrando a riqueza
            cultural da cidade e do país. Uma experiência imersiva que convida o
            público a descobrir, sentir e partilhar a força da ópera.
          </p>

          <form className="member-form">
            <input type="email" placeholder="E-mail" />
            <button type="button" className="member-form__upload">
              Upload Documentos
            </button>
            <button type="submit" className="member-form__submit">
              Enviar
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default ContactosPage;