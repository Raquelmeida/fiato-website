import './agenda-filters.css';

function AgendaFilters() {
  return (
    <div className="agenda-filters" aria-label="Filtros da agenda">
      <button type="button" className="agenda-filters__button">
        <span className="agenda-filters__label">Filtrar por</span>
        <span className="agenda-filters__value">Título</span>
      </button>

      <button type="button" className="agenda-filters__button">
        <span className="agenda-filters__label">Filtrar por</span>
        <span className="agenda-filters__value">Local</span>
      </button>

      <button type="button" className="agenda-filters__button">
        <span className="agenda-filters__label">Filtrar por</span>
        <span className="agenda-filters__value">Data</span>
      </button>
    </div>
  );
}

export default AgendaFilters;