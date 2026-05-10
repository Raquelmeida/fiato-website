import './agenda-list.css';
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

function AgendaList({ events }) {
  const groupedEvents = groupEventsByMonth(events);

  return (
    <section className="agenda-list">
      {Object.entries(groupedEvents).map(([month, monthEvents], index) => (
        <div
          className={`agenda-list__month ${
            index % 2 === 0 ? 'agenda-list__month--blue' : 'agenda-list__month--light'
          }`}
          key={month}
        >
          <div className="agenda-list__month-header">
            <h2>{month}</h2>
          </div>

          <div className="agenda-list__events">
            {monthEvents.map((event) => (
              <AgendaEventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

export default AgendaList;