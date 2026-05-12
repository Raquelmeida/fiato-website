import { Link } from 'react-router-dom';
import './ticket-reservation.css';

function TicketReservation() {
  return (
    <section className="ticket-reservation" data-navbar-theme="navy">
      <Link to="/agenda" className="ticket-reservation__back">
        ← Voltar à agenda
      </Link>

      <div className="ticket-reservation__intro">
        <p>Reserva de bilhete</p>

        <h1>
          Garante
          <span>o teu lugar.</span>
        </h1>

        <p className="ticket-reservation__description">
          Preenche os dados da reserva e escolhe a sessão pretendida. A equipa
          FIATO entrará em contacto para confirmar a disponibilidade e os próximos
          passos.
        </p>
      </div>

      <div className="ticket-reservation__content">
        <form className="ticket-form">
          <div className="ticket-form__row">
            <label>
              Nome
              <input type="text" placeholder="Nome" />
            </label>

            <label>
              Apelido
              <input type="text" placeholder="Apelido" />
            </label>
          </div>

          <div className="ticket-form__row">
            <label>
              E-mail
              <input type="email" placeholder="email@exemplo.pt" />
            </label>

            <label>
              Telefone
              <input type="tel" placeholder="+351 000 000 000" />
            </label>
          </div>

          <label>
            Espetáculo
            <select defaultValue="opera-moda-porto">
              <option value="opera-moda-porto">Ópera à Moda do Porto</option>
              <option value="opera-corpos-refugiados">
                Ópera sobre (corpos) refugiados
              </option>
              <option value="opera-e-o-porto">Ópera e o Porto</option>
            </select>
          </label>

          <div className="ticket-form__row">
            <label>
              Sessão
              <select defaultValue="20-marco-19h">
                <option value="20-marco-19h">20 Março 2026 — 19:00</option>
                <option value="21-marco-17h">21 Março 2026 — 17:00</option>
                <option value="21-marco-21h30">21 Março 2026 — 21:30</option>
                <option value="22-marco-16h">22 Março 2026 — 16:00</option>
              </select>
            </label>

            <label>
              Nº de bilhetes
              <input type="number" min="1" max="10" defaultValue="1" />
            </label>
          </div>

          <label>
            Observações
            <textarea placeholder="Indica aqui alguma informação adicional sobre a tua reserva." />
          </label>

          <button type="submit">Reservar bilhete</button>
        </form>

        <aside className="ticket-summary">
          <p>Resumo</p>

          <h2>Ópera à Moda do Porto</h2>

          <ul>
            <li>
              <span>Data</span>
              <strong>20 Março 2026</strong>
            </li>

            <li>
              <span>Hora</span>
              <strong>19:00</strong>
            </li>

            <li>
              <span>Local</span>
              <strong>Avenida dos Aliados, Porto</strong>
            </li>

            <li>
              <span>Preço</span>
              <strong>15,00€</strong>
            </li>
          </ul>

          <div className="ticket-summary__note">
            A reserva só fica confirmada após validação da equipa FIATO.
          </div>
        </aside>
      </div>
    </section>
  );
}

export default TicketReservation;