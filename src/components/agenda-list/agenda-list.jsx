import './agenda-list.css';

import AgendaFilters from '../agenda-filters/agenda-filters';
import AgendaEventCard from '../agenda-event-card/agenda-event-card';

function groupEventsByMonth(events) {
  return events.reduce((groups, event) => {
    if (!groups[event.month]) {
      groups[event.month] = [];
    }

    groups[event.month].push(event);
    return groups;
  }, {});
}

function AgendaList({ events, showMonthHeaders = true, variant = 'default' }) {
  if (!showMonthHeaders) {
    return (
      <section className={`agenda-list agenda-list--${variant}`}>
        <div className="agenda-list__events">
          {events.map((event) => (
            <AgendaEventCard key={event.id} event={event} />
          ))}
        </div>
      </section>
    );
  }

  const groupedEvents = groupEventsByMonth(events);

  return (
    <section className="agenda-list">
      {Object.entries(groupedEvents).map(([month, monthEvents], index) => {
        const isLight = index % 2 !== 0;

        return (
          <section
            className={`agenda-list__month ${
              isLight ? 'agenda-list__month--light' : 'agenda-list__month--blue'
            }`}
            data-navbar-theme={isLight ? 'light' : 'blue'}
            key={month}
          >
            <div className="agenda-list__month-header">
              <h2>{month}</h2>

              {index === 0 && <AgendaFilters />}
            </div>

            <div className="agenda-list__events">
              {monthEvents.map((event) => (
                <AgendaEventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        );
      })}
    </section>
  );
}

export default AgendaList;