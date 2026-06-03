const adminEventForm = document.querySelector('[data-admin-event-form]');
const adminEventsList = document.querySelector('[data-admin-events-list]');
const adminEmptyState = document.querySelector('[data-admin-empty]');
const adminStatus = document.querySelector('[data-admin-status]');

function getFormValue(formData, key) {
  return String(formData.get(key) || '').trim();
}

function setAdminStatus(message) {
  if (!adminStatus) return;
  adminStatus.textContent = message;
}

function createEventItem(eventData) {
  const item = document.createElement('article');
  item.className = 'admin-events__item';

  const title = document.createElement('h3');
  title.textContent = eventData.title;

  const meta = document.createElement('div');
  meta.className = 'admin-events__meta';

  const date = document.createElement('span');
  date.textContent = `${eventData.day} ${eventData.month}`;

  const time = document.createElement('span');
  time.textContent = eventData.time;

  const place = document.createElement('span');
  place.textContent = eventData.place;

  const status = document.createElement('span');
  status.textContent = eventData.published ? 'Publicado' : 'Rascunho';

  meta.append(date, time, place, status);
  item.append(title, meta);

  return item;
}

if (adminEventForm && adminEventsList) {
  adminEventForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(adminEventForm);
    const eventData = {
      title: getFormValue(formData, 'title'),
      date: getFormValue(formData, 'date'),
      month: getFormValue(formData, 'month'),
      day: getFormValue(formData, 'day'),
      time: getFormValue(formData, 'time'),
      place: getFormValue(formData, 'place'),
      price: getFormValue(formData, 'price'),
      status: getFormValue(formData, 'status'),
      description: getFormValue(formData, 'description'),
      eventUrl: getFormValue(formData, 'eventUrl'),
      ticketUrl: getFormValue(formData, 'ticketUrl'),
      published: formData.has('published'),
    };

    adminEventsList.prepend(createEventItem(eventData));
    adminEmptyState?.setAttribute('hidden', '');
    setAdminStatus('Evento adicionado temporariamente nesta página.');
    adminEventForm.reset();
  });

  adminEventForm.addEventListener('reset', () => {
    setAdminStatus('Formulário limpo.');
  });
}
