import './evento-info.css';

function EventoInfo({ image }) {
  return (
    <section className="evento-info" data-navbar-theme="light">
      <div className="evento-info__quote">
        <h2>
          “Quebrando as <span>fronteiras</span> tradicionais da música clássica,
          realocamos a grandiosidade acústica para a arquitectura crua da cidade.”
        </h2>
      </div>

      <div className="evento-info__details">
        <dl>
          <div>
            <dt>Ideia e curadoria</dt>
            <dd>Camilo Castelo Branco</dd>
          </div>

          <div>
            <dt>Direção</dt>
            <dd>Camilo Castelo Branco</dd>
          </div>

          <div>
            <dt>Local</dt>
            <dd>R. Santa Catarina, 148</dd>
          </div>

          <div>
            <dt>Duração</dt>
            <dd>1H30M</dd>
          </div>
        </dl>

        <img src={image} alt="Ópera à Moda do Porto" />
      </div>

      <div className="evento-info__text">
        <p>
          <strong>Ópera à moda do Porto</strong> é um projeto que surgiu em 2024
          no âmbito do FIATO — Festival Internacional de Artes e Ópera do Porto,
          trabalhando a aproximação dos públicos à ópera.
        </p>

        <p>
          Na primeira edição, o tema foram as figuras atuais da cidade do Porto.
          Neste novo ano, será <strong>Camilo Castelo Branco</strong>. A OMP permite
          levar esta forma de arte até às pessoas e a locais não convencionais.
        </p>
      </div>
    </section>
  );
}

export default EventoInfo;