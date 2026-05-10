import './agenda-filters.css';

function AgendaFilters() {
  return (
    <div className="agenda-filters">
      <button type="button" className="agenda-filters__button">
        Título
      </button>

      <button type="button" className="agenda-filters__button">
        Local
      </button>

      <button type="button" className="agenda-filters__button">
        Data
      </button>
    </div>
  );
}

export default AgendaFilters;