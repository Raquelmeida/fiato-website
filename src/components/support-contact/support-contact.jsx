import './support-contact.css';

function SupportContact({ image }) {
  return (
    <section className="support-contact" data-navbar-theme="navy">
      <div
        className="support-contact__image"
        style={{
          backgroundImage: `linear-gradient(rgba(18, 34, 86, 0.72), rgba(18, 34, 86, 0.82)), url(${image})`,
        }}
      >
        <div>
          <h2>
            Fale
            <span>Connosco</span>
          </h2>

          <p>
            Pretende tornar-se patrono? Junte-se à nossa missão de democratizar
            a ópera e apoie a transformação cultural da cidade do Porto.
          </p>

          <div className="support-contact__buttons">
            <a href="mailto:info@fiato.pt">Inserir Email</a>
            <a href="/contactos" className="support-contact__button--filled">
              Contactar
            </a>
          </div>
        </div>
      </div>

      <div className="support-contact__info">
        <div>
          <h3>Localização</h3>
          <p>
            Teatro Municipal
            <br />
            Rua das Artes, 123
            <br />
            4000-089 Porto
          </p>
        </div>

        <div>
          <h3>Contacto</h3>
          <p>
            info@fiato.pt
            <br />
            +351 912 345 678
            <br />
            +351 912 545 678
          </p>
        </div>

        <div>
          <h3>Horários</h3>
          <p>
            Seg - Sex &nbsp;&nbsp; 10:00 - 18:00
            <br />
            Sáb &nbsp;&nbsp; 10:00 - 12:00
            <br />
            Dom &nbsp;&nbsp; Encerrado
            <br />
            Feriados &nbsp;&nbsp; Encerrado
          </p>
        </div>

        <div>
          <h3>Siga-nos</h3>
          <p>
            Facebook
            <br />
            Instagram
            <br />
            Twitter
            <br />
            YouTube
          </p>
        </div>
      </div>
    </section>
  );
}

export default SupportContact;