const navbar = document.querySelector('.navbar');
const menuToggle = document.querySelector('.navbar__toggle');
const navbarLinks = document.querySelectorAll('.navbar__link, .navbar__logo');
const countdownDays = document.querySelector('[data-countdown-days]');
const countdownHours = document.querySelector('[data-countdown-hours]');
const countdownMinutes = document.querySelector('[data-countdown-minutes]');
const agendaList = document.querySelector('[data-agenda-list]');
const agendaFilterButtons = document.querySelectorAll('[data-agenda-sort]');
const agendaMonthNames = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const editionToggleButtons = document.querySelectorAll('[data-edition-toggle]');
const faqTriggers = document.querySelectorAll('[data-faq-trigger]');
const eventoAccordionTriggers = document.querySelectorAll('[data-evento-accordion-trigger]');
const ticketForm = document.querySelector('[data-ticket-form]');
const ticketShow = document.querySelector('[data-ticket-show]');
const ticketSession = document.querySelector('[data-ticket-session]');
const ticketQuantity = document.querySelector('[data-ticket-quantity]');
const ticketMessage = document.querySelector('[data-ticket-message]');

let countdownTarget = Date.now()
  + (14 * 24 * 60 * 60 * 1000)
  + (8 * 60 * 60 * 1000)
  + (32 * 60 * 1000);

function pad(value) {
  return String(value).padStart(2, '0');
}

function updateCountdown() {
  if (!countdownDays || !countdownHours || !countdownMinutes) return;

  const diff = Math.max(0, countdownTarget - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  countdownDays.textContent = pad(days);
  countdownHours.textContent = pad(hours);
  countdownMinutes.textContent = pad(minutes);
}

function updateNavbarTheme() {
  if (!navbar) return;

  const sections = document.querySelectorAll('[data-navbar-theme]');
  const navbarHeight = 120;
  let currentTheme = 'transparent';

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();

    if (rect.top <= navbarHeight && rect.bottom >= navbarHeight) {
      currentTheme = section.getAttribute('data-navbar-theme');
    }
  });

  navbar.className = navbar.className
    .replace(/\bnavbar--\S+/g, '')
    .trim();
  navbar.classList.add(`navbar--${currentTheme}`);
}

function compareAgendaCards(sortKey) {
  return (first, second) => {
    if (sortKey === 'date') {
      return Number(first.dataset.order) - Number(second.dataset.order);
    }

    const firstValue = first.dataset[sortKey] || '';
    const secondValue = second.dataset[sortKey] || '';
    const compared = firstValue.localeCompare(secondValue, 'pt', {
      sensitivity: 'base',
    });

    if (compared !== 0) return compared;

    return Number(first.dataset.order) - Number(second.dataset.order);
  };
}

function sortAgenda(sortKey) {
  document.querySelectorAll('[data-agenda-events]').forEach((list) => {
    const cards = Array.from(list.querySelectorAll('.agenda-event-card'));
    cards.sort(compareAgendaCards(sortKey));
    cards.forEach((card) => list.appendChild(card));
  });

  updateNavbarTheme();
}

function formatEuro(value) {
  return `${value.toFixed(2).replace('.', ',')}€`;
}

function setText(selector, text) {
  const element = document.querySelector(selector);
  if (element) element.textContent = text;
}

function updateTicketSummary() {
  if (!ticketShow || !ticketSession || !ticketQuantity) return;

  var selectedSession = ticketSession.selectedOptions[0];
  var price = selectedSession ? Number(selectedSession.dataset.price || 0) : 0;
  var quantity = Math.min(10, Math.max(1, Number(ticketQuantity.value || 1)));

  ticketQuantity.value = String(quantity);

  setText('[data-summary-show]', ticketShow.value || ticketShow.selectedOptions[0]?.textContent || '');
  setText('[data-summary-date]', selectedSession?.dataset?.date || '');
  setText('[data-summary-time]', selectedSession?.dataset?.time || '');
  setText('[data-summary-place]', selectedSession?.dataset?.place || '');
  setText('[data-summary-price]', selectedSession ? formatEuro(price) : '');
  setText('[data-summary-quantity]', String(quantity));
  setText('[data-summary-total]', selectedSession ? formatEuro(price * quantity) : '');
}

if (menuToggle && navbar) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navbar.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
  });
}

navbarLinks.forEach((link) => {
  link.addEventListener('click', () => {
    if (!navbar || !menuToggle) return;

    navbar.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menu');
  });
});

document.getElementById('novidades')?.addEventListener('click', function (event) {
  var button = event.target.closest('[data-agenda-sort]');
  if (!button) return;

  document.querySelectorAll('[data-agenda-sort]').forEach(function (b) {
    b.classList.remove('is-active');
  });
  button.classList.add('is-active');
  sortAgenda(button.dataset.agendaSort);
});

editionToggleButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const year = button.dataset.editionToggle;

    if (year === '2026') return;

    const isOpen = button.classList.contains('edition-section__button--open');

    editionToggleButtons.forEach((toggleButton) => {
      toggleButton.classList.remove('edition-section__button--open');
    });

    if (!isOpen) {
      button.classList.add('edition-section__button--open');
    }
  });
});

faqTriggers.forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const item = trigger.closest('.faq-list__item');
    const answer = item?.querySelector('.faq-list__answer-wrap');
    const icon = item?.querySelector('.faq-list__icon');
    const isOpen = item?.classList.contains('faq-list__item--open');

    if (!item || !answer || !icon) return;

    faqTriggers.forEach((otherTrigger) => {
      const otherItem = otherTrigger.closest('.faq-list__item');
      const otherAnswer = otherItem?.querySelector('.faq-list__answer-wrap');
      const otherIcon = otherItem?.querySelector('.faq-list__icon');

      otherItem?.classList.remove('faq-list__item--open');
      otherTrigger.setAttribute('aria-expanded', 'false');

      if (otherAnswer) otherAnswer.hidden = true;
      if (otherIcon) otherIcon.textContent = '+';
    });

    if (!isOpen) {
      item.classList.add('faq-list__item--open');
      trigger.setAttribute('aria-expanded', 'true');
      answer.hidden = false;
      icon.textContent = '–';
    }
  });
});

document.querySelector('.evento-accordion')?.addEventListener('click', function (event) {
  var trigger = event.target.closest('[data-evento-accordion-trigger]');
  if (!trigger) return;

  var item = trigger.closest('.evento-accordion__item');
  var list = item?.closest('.evento-accordion__list');
  var icon = item?.querySelector('.evento-accordion__icon');
  var isOpen = item?.classList.contains('evento-accordion__item--open');

  if (!item || !icon || !list) return;

  list.querySelectorAll('.evento-accordion__item').forEach(function (otherItem) {
    var otherTrigger = otherItem.querySelector('[data-evento-accordion-trigger]');
    var otherIcon = otherItem.querySelector('.evento-accordion__icon');

    otherItem.classList.remove('evento-accordion__item--open');
    if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
    if (otherIcon) otherIcon.textContent = '+';
  });

  if (!isOpen) {
    item.classList.add('evento-accordion__item--open');
    trigger.setAttribute('aria-expanded', 'true');
    icon.textContent = '−';
  }
});

var ticketEventsMap = {};

if (ticketForm) {
  updateTicketSummary();

  [ticketShow, ticketSession, ticketQuantity].forEach(function (field) {
    if (field) {
      field.addEventListener('input', updateTicketSummary);
      field.addEventListener('change', updateTicketSummary);
    }
  });

  ticketForm.addEventListener('submit', function (event) {
    event.preventDefault();

    var requiredFields = ticketForm.querySelectorAll('[required]');
    var isValid = true;

    requiredFields.forEach(function (field) {
      var fieldIsValid = field.checkValidity();
      field.classList.toggle('is-invalid', !fieldIsValid);
      if (!fieldIsValid) isValid = false;
    });

    if (!ticketMessage) return;

    if (!isValid) {
      ticketMessage.className = 'ticket-form__message';
      ticketMessage.textContent = 'Preenche todos os campos obrigatórios antes de submeter.';
      return;
    }

    var eventId = ticketShow?.value;
    var sessionId = ticketSession?.value;

    if (!eventId || !sessionId) {
      ticketMessage.className = 'ticket-form__message';
      ticketMessage.textContent = 'Seleciona um espetáculo e uma sessão.';
      return;
    }

    var formData = new FormData(ticketForm);

    var body = {
      eventId: eventId,
      sessionId: sessionId,
      firstName: formData.get('nome') || '',
      lastName: formData.get('apelido') || '',
      email: formData.get('email') || '',
      phone: formData.get('telefone') || '',
      quantity: Number(formData.get('quantidade') || 1),
      observations: formData.get('observacoes') || ''
    };

    fetch('/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
      .then(function (response) {
        if (!response.ok) throw new Error('Erro na rede');
        return response.json();
      })
      .then(function (result) {
        if (!result.success) throw new Error(result.error || 'Erro da API');
        ticketMessage.className = 'ticket-form__message is-success';
        ticketMessage.textContent = 'Pedido de reserva registado. A equipa FIATO entrará em contacto.';
        ticketForm.reset();
        updateTicketSummary();
      })
      .catch(function () {
        ticketMessage.className = 'ticket-form__message';
        ticketMessage.textContent = 'Ocorreu um erro ao processar a reserva. Tenta novamente.';
      });
  });
}

// Contact forms
var contactForm = document.querySelector('[data-contact-form]');
var contactMessage = document.querySelector('[data-contact-message]');

if (contactForm) {
  contactForm.addEventListener('submit', function (event) {
    event.preventDefault();

    var requiredFields = contactForm.querySelectorAll('[required]');
    var isValid = true;

    requiredFields.forEach(function (field) {
      var fieldIsValid = field.checkValidity();
      field.classList.toggle('is-invalid', !fieldIsValid);
      if (!fieldIsValid) isValid = false;
    });

    if (!contactMessage) return;

    if (!isValid) {
      contactMessage.className = 'contactos-form__message';
      contactMessage.textContent = 'Preenche todos os campos obrigatórios.';
      return;
    }

    var formData = new FormData(contactForm);

    var body = {
      name: (formData.get('nome') || '') + ' ' + (formData.get('apelido') || ''),
      email: formData.get('email') || '',
      message: formData.get('mensagem') || '',
      type: 'contact'
    };

    fetch('/api/contact-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
      .then(function (response) {
        if (!response.ok) throw new Error('Erro na rede');
        return response.json();
      })
      .then(function (result) {
        if (!result.success) throw new Error(result.error || 'Erro da API');
        contactMessage.className = 'contactos-form__message is-success';
        contactMessage.textContent = 'Mensagem enviada com sucesso. Entraremos em contacto brevemente.';
        contactForm.reset();
      })
      .catch(function () {
        contactMessage.className = 'contactos-form__message';
        contactMessage.textContent = 'Ocorreu um erro ao enviar a mensagem. Tenta novamente.';
      });
  });
}

var memberForm = document.querySelector('[data-member-form]');
var memberMessage = document.querySelector('[data-member-message]');

if (memberForm) {
  memberForm.addEventListener('submit', function (event) {
    event.preventDefault();

    var requiredFields = memberForm.querySelectorAll('[required]');
    var isValid = true;

    requiredFields.forEach(function (field) {
      var fieldIsValid = field.checkValidity();
      field.classList.toggle('is-invalid', !fieldIsValid);
      if (!fieldIsValid) isValid = false;
    });

    if (!memberMessage) return;

    if (!isValid) {
      memberMessage.className = 'member-form__message';
      memberMessage.textContent = 'Preenche todos os campos obrigatórios.';
      return;
    }

    var formData = new FormData(memberForm);

    var body = {
      name: '',
      email: formData.get('email') || '',
      message: 'Pedido de adesão como membro.',
      type: 'membership'
    };

    fetch('/api/contact-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
      .then(function (response) {
        if (!response.ok) throw new Error('Erro na rede');
        return response.json();
      })
      .then(function (result) {
        if (!result.success) throw new Error(result.error || 'Erro da API');
        memberMessage.className = 'member-form__message is-success';
        memberMessage.textContent = 'Pedido de adesão enviado com sucesso. Entraremos em contacto brevemente.';
        memberForm.reset();
      })
      .catch(function () {
        memberMessage.className = 'member-form__message';
        memberMessage.textContent = 'Ocorreu um erro ao enviar o pedido. Tenta novamente.';
      });
  });
}

// Schedule - dynamic loading for Home page
const scheduleGrid = document.querySelector('[data-schedule-grid]');
const scheduleWeekdayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const scheduleMonthAbbrevs = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

function getFirstSessionDate(event) {
  if (event.sessions && event.sessions.length > 0) {
    return new Date(event.sessions[0].date);
  }
  return null;
}

function formatSchedulePrice(price) {
  var num = Number(price);
  if (Number.isInteger(num)) return num + '€';
  return num.toFixed(2).replace('.', ',') + '€';
}

function createScheduleCard(event) {
  const card = document.createElement('article');
  card.className = 'schedule__card';
  const dateObj = getFirstSessionDate(event);

  // Badge
  const badge = document.createElement('div');
  badge.className = 'schedule__badge';
  const icon = document.createElement('span');
  icon.setAttribute('aria-hidden', 'true');

  var rawPrice = event.price;
  var numericPrice = Number(rawPrice);
  var hasPrice = rawPrice !== undefined && rawPrice !== null && rawPrice !== '' && rawPrice !== 'Grátis' && !isNaN(numericPrice) && numericPrice > 0;

  if (hasPrice) {
    icon.className = 'schedule__badge-icon';
    icon.textContent = '€';
    badge.appendChild(icon);
    badge.appendChild(document.createTextNode(' ' + formatSchedulePrice(numericPrice)));
  } else {
    icon.className = 'schedule__badge-dot';
    badge.appendChild(icon);
    badge.appendChild(document.createTextNode(' Grátis'));
  }
  card.appendChild(badge);

  // Weekday
  const weekday = document.createElement('span');
  weekday.className = 'schedule__weekday';
  if (dateObj) weekday.textContent = scheduleWeekdayNames[dateObj.getDay()].toUpperCase();
  card.appendChild(weekday);

  // Date (day + month)
  const dateEl = document.createElement('strong');
  dateEl.className = 'schedule__date';
  if (dateObj) {
    dateEl.appendChild(document.createTextNode(String(dateObj.getDate())));
    dateEl.appendChild(document.createElement('br'));
    const small = document.createElement('small');
    small.textContent = scheduleMonthAbbrevs[dateObj.getMonth()];
    dateEl.appendChild(small);
  }
  card.appendChild(dateEl);

  // Image
  const imageEl = document.createElement('div');
  imageEl.className = 'schedule__image' + (event.imageUrl ? '' : ' ph');
  if (event.imageUrl) {
    imageEl.style.backgroundImage = 'url(' + event.imageUrl.replace(/'/g, '%27') + ')';
  }
  imageEl.setAttribute('role', 'img');
  imageEl.setAttribute('aria-label', event.title || '');
  card.appendChild(imageEl);

  // Title
  const title = document.createElement('h3');
  title.className = 'schedule__card-title';
  title.textContent = event.title || '';
  card.appendChild(title);

  // Location
  const location = document.createElement('span');
  location.className = 'schedule__location';
  location.textContent = event.locationSummary || '';
  card.appendChild(location);

  // Description
  const desc = document.createElement('p');
  desc.className = 'schedule__description';
  desc.textContent = event.description || '';
  card.appendChild(desc);

  // Tickets link
  const link = document.createElement('a');
  link.className = 'schedule__tickets';
  link.href = 'bilhetes.html';
  link.textContent = 'Comprar Bilhetes';
  card.appendChild(link);

  return card;
}

function renderScheduleCards(events) {
  scheduleGrid.innerHTML = '';

  if (events.length === 0) {
    var msg = document.createElement('p');
    msg.className = 'schedule__loading';
    msg.textContent = 'Não existem eventos de momento.';
    scheduleGrid.appendChild(msg);
    return;
  }

  var fragment = document.createDocumentFragment();
  events.forEach(function (event) {
    fragment.appendChild(createScheduleCard(event));
  });
  scheduleGrid.appendChild(fragment);
}

function loadHomeEvents() {
  if (!scheduleGrid) return;

  fetch('/api/events?featured=true&limit=3')
    .then(function (response) {
      if (!response.ok) throw new Error('Erro na rede');
      return response.json();
    })
    .then(function (featuredResult) {
      if (!featuredResult.success) throw new Error(featuredResult.error || 'Erro da API');

      var featured = featuredResult.data || [];

      if (featured.length >= 3) {
        renderScheduleCards(featured.slice(0, 3));
        return;
      }

      return fetch('/api/events?limit=6')
        .then(function (res) { return res.json(); })
        .then(function (allResult) {
          if (!allResult.success) throw new Error(allResult.error || 'Erro da API');

          var allEvents = allResult.data || [];
          var featuredIds = featured.map(function (e) { return e._id; });
          var additional = allEvents.filter(function (e) {
            return featuredIds.indexOf(e._id) === -1;
          });

          renderScheduleCards(featured.concat(additional).slice(0, 3));
        })
        .catch(function () {
          renderScheduleCards(featured);
        });
    })
    .catch(function () {
      scheduleGrid.innerHTML = '';
      var msg = document.createElement('p');
      msg.className = 'schedule__loading';
      msg.textContent = 'Não foi possível carregar os eventos.';
      scheduleGrid.appendChild(msg);
    });
}

// Hero - dynamic loading for Home page
function splitHeroTitle(title) {
  var idx = title.indexOf(' — ');
  if (idx > 0) return [title.substring(0, idx), title.substring(idx + 3)];
  idx = title.indexOf(' - ');
  if (idx > 0) return [title.substring(0, idx), title.substring(idx + 3)];
  var connectors = [' do ', ' da ', ' de ', ' dos ', ' das '];
  var bestIdx = -1;
  var bestLen = 0;
  connectors.forEach(function (conn) {
    var pos = title.lastIndexOf(conn);
    if (pos > bestIdx) {
      bestIdx = pos;
      bestLen = conn.length;
    }
  });
  if (bestIdx > 0) return [title.substring(0, bestIdx + bestLen), title.substring(bestIdx + bestLen)];
  var words = title.split(' ');
  if (words.length <= 2) return [words[0] || '', words.slice(1).join(' ') || ''];
  var mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
}

function loadHomeHeroEvent() {
  var heroTitleLight = document.querySelector('[data-hero-title-light]');
  var heroTitleBold = document.querySelector('[data-hero-title-bold]');
  var heroImage = document.querySelector('[data-hero-image]');
  var heroBadge = document.querySelector('[data-hero-badge]');
  var heroTime = document.querySelector('[data-hero-time]');
  var heroDate = document.querySelector('[data-hero-date]');
  var heroLocation = document.querySelector('[data-hero-location]');
  var heroDescription = document.querySelector('[data-hero-description]');
  var heroLink = document.querySelector('[data-hero-link]');

  if (!heroTitleLight) return;

  fetch('/api/events?featured=true&limit=1')
    .then(function (response) {
      if (!response.ok) throw new Error('Erro na rede');
      return response.json();
    })
    .then(function (result) {
      if (!result.success) throw new Error(result.error || 'Erro da API');
      var events = result.data || [];
      if (events.length === 0) return;

      var event = events[0];

      // Title
      if (event.title) {
        var parts = splitHeroTitle(event.title);
        heroTitleLight.textContent = parts[0];
        if (heroTitleBold) heroTitleBold.textContent = parts[1];
      }

      // Image
      if (event.imageUrl && heroImage) {
        heroImage.style.backgroundImage = 'url(' + event.imageUrl.replace(/'/g, '%27') + ')';
        heroImage.setAttribute('aria-label', event.title || '');
      }

      // Badge
      if (heroBadge && event.quote) heroBadge.textContent = event.quote;

      // Sessions
      if (event.sessions && event.sessions.length > 0) {
        var session = event.sessions[0];

        if (heroTime && session.time) heroTime.textContent = session.time;

        if (heroDate && session.date) {
          var d = new Date(session.date);
          var day = String(d.getDate()).padStart(2, '0');
          var month = String(d.getMonth() + 1).padStart(2, '0');
          var year = String(d.getFullYear()).slice(-2);
          heroDate.textContent = day + '/' + month + '/' + year;
        }

        if (heroLocation) {
          heroLocation.textContent = session.specificLocation || event.locationSummary || '';
        }

        // Countdown target from first session date
        if (session.date) {
          countdownTarget = new Date(session.date).getTime();
        }
      }

      // Description
      if (heroDescription && event.description) heroDescription.textContent = event.description;

      // Event link
      if (heroLink && event._id) heroLink.href = 'evento.html?id=' + event._id;
    })
    .catch(function () {
      // Keep fallback content
    });
}

// Press - dynamic loading for Home page
function extractData(result) {
  if (Array.isArray(result)) return result;
  if (result.data && Array.isArray(result.data)) return result.data;
  if (result.items && Array.isArray(result.items)) return result.items;
  if (result.news && Array.isArray(result.news)) return result.news;
  if (result.events && Array.isArray(result.events)) return result.events;
  return null;
}

function showPressFallback(container) {
  container.innerHTML = '';
  var msg = document.createElement('p');
  msg.className = 'press__loading';
  msg.textContent = 'Não existem notícias de momento.';
  container.appendChild(msg);
}

function createPressRow(item) {
  var li = document.createElement('li');
  li.className = 'press__row';

  var link = document.createElement('div');
  link.className = 'press__link';

  var dateDiv = document.createElement('div');
  dateDiv.className = 'press__date';

  var daySpan = document.createElement('span');
  daySpan.className = 'press__day';

  var monthSpan = document.createElement('span');
  monthSpan.className = 'press__month';

  if (item.publishDate) {
    var d = new Date(item.publishDate);
    daySpan.textContent = String(d.getDate());
    var monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    monthSpan.textContent = monthNames[d.getMonth()] + ', ' + d.getFullYear();
  } else {
    daySpan.textContent = '--';
    monthSpan.textContent = '---';
  }

  dateDiv.appendChild(daySpan);
  dateDiv.appendChild(monthSpan);
  link.appendChild(dateDiv);

  var thumb = document.createElement('div');
  thumb.className = 'press__thumb' + (item.imageUrl ? '' : ' ph');
  if (item.imageUrl) {
    thumb.style.backgroundImage = 'url(' + item.imageUrl.replace(/'/g, '%27') + ')';
    thumb.style.backgroundSize = 'cover';
    thumb.style.backgroundPosition = 'center';
  }
  thumb.setAttribute('aria-hidden', 'true');
  link.appendChild(thumb);

  var title = document.createElement('h3');
  title.className = 'press__title';
  title.textContent = item.title || '';
  link.appendChild(title);

  var arrowLink = document.createElement('a');
  arrowLink.className = 'press__arrow-btn';
  arrowLink.href = item.articleUrl || '#';
  arrowLink.setAttribute('aria-label', 'Ler notícia');
  arrowLink.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>';
  if (item.articleUrl) {
    arrowLink.target = '_blank';
    arrowLink.rel = 'noopener';
  }
  link.appendChild(arrowLink);

  li.appendChild(link);
  return li;
}

function loadHomePress() {
  var pressList = document.querySelector('[data-press-list]');
  if (!pressList) return;

  fetch('/api/news?limit=4')
    .then(function (response) {
      if (!response.ok) throw new Error('Erro na rede');
      return response.json();
    })
    .then(function (result) {
      var news = extractData(result);
      if (!news || news.length === 0) {
        showPressFallback(pressList);
        return;
      }

      pressList.innerHTML = '';
      var fragment = document.createDocumentFragment();

      news.slice(0, 4).forEach(function (item) {
        fragment.appendChild(createPressRow(item));
      });

      pressList.appendChild(fragment);
    })
    .catch(function () {
      showPressFallback(pressList);
    });
}

// Agenda - dynamic loading
function createAgendaCard(event, index) {
  var card = document.createElement('article');
  card.className = 'agenda-event-card';

  var sessions = event.sessions || [];
  var firstSession = sessions[0] || {};
  var sessionDate = firstSession.date ? new Date(firstSession.date) : null;

  var monthName = sessionDate ? agendaMonthNames[sessionDate.getMonth()] : '';
  var day = sessionDate ? String(sessionDate.getDate()).padStart(2, '0') : '--';

  var specificLocation = firstSession.specificLocation || '';
  var location = specificLocation || event.locationSummary || '';

  var rawPrice = event.price;
  var numericPrice = Number(rawPrice);
  var hasPrice = rawPrice !== undefined && rawPrice !== null && rawPrice !== '' && rawPrice !== 'Grátis' && !isNaN(numericPrice) && numericPrice > 0;
  var priceFormatted = hasPrice ? formatSchedulePrice(numericPrice) : 'Grátis';

  card.dataset.title = (event.title || '').toLowerCase();
  card.dataset.place = location.toLowerCase();
  card.dataset.month = monthName;
  card.dataset.day = day;
  card.dataset.order = String(index);

  var mainDiv = document.createElement('div');
  mainDiv.className = 'agenda-event-card__main';

  var dateDiv = document.createElement('div');
  dateDiv.className = 'agenda-event-card__date';
  var daySpan = document.createElement('span');
  daySpan.textContent = day;
  var monthSmall = document.createElement('small');
  monthSmall.textContent = monthName;
  dateDiv.appendChild(daySpan);
  dateDiv.appendChild(monthSmall);
  mainDiv.appendChild(dateDiv);

  var titleH3 = document.createElement('h3');
  titleH3.className = 'agenda-event-card__title';
  titleH3.textContent = event.title || '';
  mainDiv.appendChild(titleH3);

  card.appendChild(mainDiv);

  var infoDiv = document.createElement('div');
  infoDiv.className = 'agenda-event-card__info';

  var timeP = document.createElement('p');
  timeP.textContent = firstSession.time || '';
  infoDiv.appendChild(timeP);

  var locationP = document.createElement('p');
  locationP.textContent = location;
  infoDiv.appendChild(locationP);

  var priceP = document.createElement('p');
  priceP.textContent = priceFormatted;
  infoDiv.appendChild(priceP);

  card.appendChild(infoDiv);

  var actionsDiv = document.createElement('div');
  actionsDiv.className = 'agenda-event-card__actions';

  var saberMais = document.createElement('a');
  saberMais.className = 'agenda-event-card__button agenda-event-card__button--outline';
  saberMais.href = 'evento.html?id=' + (event._id || '');
  saberMais.textContent = 'Saber mais';
  actionsDiv.appendChild(saberMais);

  var comprar = document.createElement('a');
  comprar.className = 'agenda-event-card__button agenda-event-card__button--filled';
  comprar.href = 'bilhetes.html';
  comprar.textContent = 'Comprar';
  actionsDiv.appendChild(comprar);

  card.appendChild(actionsDiv);

  return card;
}

function loadAgendaEvents() {
  if (!agendaList) return;

  fetch('/api/events?limit=50')
    .then(function (response) {
      if (!response.ok) throw new Error('Erro na rede');
      return response.json();
    })
    .then(function (result) {
      var events = extractData(result);
      if (!events || events.length === 0) {
        agendaList.innerHTML = '<p class="agenda-list__empty">Não existem eventos de momento.</p>';
        return;
      }

      var validEvents = events.filter(function (e) {
        return e.sessions && e.sessions.length > 0 && e.sessions[0].date;
      });

      if (validEvents.length === 0) {
        agendaList.innerHTML = '<p class="agenda-list__empty">Não existem eventos de momento.</p>';
        return;
      }

      validEvents.sort(function (a, b) {
        return new Date(a.sessions[0].date) - new Date(b.sessions[0].date);
      });

      validEvents.forEach(function (e, i) {
        e._agendaOrder = i;
      });

      var groups = {};
      validEvents.forEach(function (e) {
        var d = new Date(e.sessions[0].date);
        var key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
        if (!groups[key]) {
          groups[key] = {
            year: d.getFullYear(),
            month: d.getMonth(),
            monthName: agendaMonthNames[d.getMonth()],
            events: []
          };
        }
        groups[key].events.push(e);
      });

      var keys = Object.keys(groups).sort();
      agendaList.innerHTML = '';
      var fragment = document.createDocumentFragment();

      keys.forEach(function (key, idx) {
        var group = groups[key];
        var monthClass = idx % 2 === 0 ? 'blue' : 'light';

        var monthSection = document.createElement('section');
        monthSection.className = 'agenda-list__month agenda-list__month--' + monthClass;
        monthSection.setAttribute('data-navbar-theme', monthClass);

        var header = document.createElement('div');
        header.className = 'agenda-list__month-header';

        var monthH2 = document.createElement('h2');
        monthH2.textContent = group.monthName;
        header.appendChild(monthH2);

        if (idx === 0) {
          var filters = document.createElement('div');
          filters.className = 'agenda-filters';
          filters.setAttribute('aria-label', 'Filtros da agenda');

          var filterConfigs = [
            { sort: 'title', value: 'Título' },
            { sort: 'place', value: 'Local' },
            { sort: 'date', value: 'Data', active: true }
          ];

          filterConfigs.forEach(function (cfg) {
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'agenda-filters__button' + (cfg.active ? ' is-active' : '');
            btn.dataset.agendaSort = cfg.sort;

            var label = document.createElement('span');
            label.className = 'agenda-filters__label';
            label.textContent = 'Filtrar por';
            btn.appendChild(label);

            var val = document.createElement('span');
            val.className = 'agenda-filters__value';
            val.textContent = cfg.value;
            btn.appendChild(val);

            filters.appendChild(btn);
          });

          header.appendChild(filters);
        }

        monthSection.appendChild(header);

        var eventsContainer = document.createElement('div');
        eventsContainer.className = 'agenda-list__events';
        eventsContainer.setAttribute('data-agenda-events', '');

        group.events.forEach(function (e) {
          eventsContainer.appendChild(createAgendaCard(e, e._agendaOrder));
        });

        monthSection.appendChild(eventsContainer);
        fragment.appendChild(monthSection);
      });

      agendaList.appendChild(fragment);
      updateNavbarTheme();
    })
    .catch(function () {
      agendaList.innerHTML = '<p class="agenda-list__empty">Não foi possível carregar a agenda.</p>';
    });
}

// Bilhetes page - dynamic loading
function loadTicketEvents() {
  if (!ticketShow) return;

  fetch('/api/events?limit=50')
    .then(function (response) {
      if (!response.ok) throw new Error('Erro na rede');
      return response.json();
    })
    .then(function (result) {
      var events = extractData(result);
      if (!events || events.length === 0) return;

      ticketEventsMap = {};
      var fragment = document.createDocumentFragment();

      events.forEach(function (event) {
        if (!event.sessions || event.sessions.length === 0) return;
        ticketEventsMap[event._id] = event;

        var option = document.createElement('option');
        option.value = event._id;
        option.textContent = event.title || '';
        fragment.appendChild(option);
      });

      ticketShow.innerHTML = '<option value="">Seleciona...</option>';
      ticketShow.appendChild(fragment);

      if (ticketShow.value) {
        ticketShow.dispatchEvent(new Event('change'));
      }

      updateTicketSummary();
    })
    .catch(function () {
      // Keep fallback
    });
}

ticketShow?.addEventListener('change', function () {
  var eventId = ticketShow.value;
  var event = ticketEventsMap[eventId];

  ticketSession.innerHTML = '<option value="">Seleciona...</option>';

  if (!event || !event.sessions || event.sessions.length === 0) {
    updateTicketSummary();
    return;
  }

  var frag = document.createDocumentFragment();
  var monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  event.sessions.forEach(function (session) {
    var option = document.createElement('option');
    option.value = session._id || '';

    var sessionDate = session.date ? new Date(session.date) : null;
    var dateStr = sessionDate ? sessionDate.getDate() + ' ' + monthNames[sessionDate.getMonth()] + ' ' + sessionDate.getFullYear() : '';

    option.textContent = dateStr + ' — ' + (session.time || '');
    option.dataset.date = dateStr;
    option.dataset.time = session.time || '';
    option.dataset.place = session.specificLocation || event.locationSummary || '';
    option.dataset.price = event.price || '0';

    if (session.availableTickets === 0 || session.status === 'soldout' || session.status === 'esgotado') {
      option.disabled = true;
      option.textContent += ' (Esgotado)';
    }

    frag.appendChild(option);
  });

  ticketSession.appendChild(frag);

  if (event.sessions.length === 1) {
    ticketSession.selectedIndex = 1;
  }

  updateTicketSummary();
});

// Evento page - dynamic loading
function createEventSessionEl(session) {
  var article = document.createElement('article');
  article.className = 'evento-sessoes__item';

  var div = document.createElement('div');

  var h3 = document.createElement('h3');
  if (session.date) {
    var d = new Date(session.date);
    var monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    h3.textContent = d.getDate() + ' ' + monthNames[d.getMonth()] + ' ' + d.getFullYear();
  }
  div.appendChild(h3);

  var p = document.createElement('p');
  p.textContent = session.specificLocation || '';
  div.appendChild(p);

  article.appendChild(div);

  var strong = document.createElement('strong');
  strong.textContent = session.time || '';
  article.appendChild(strong);

  var isSoldOut = session.status === 'soldout' || session.status === 'esgotado' || session.availableTickets === 0;

  if (isSoldOut) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'is-disabled';
    btn.disabled = true;
    btn.textContent = 'Esgotado';
    article.appendChild(btn);
  } else {
    var a = document.createElement('a');
    a.href = 'bilhetes.html';
    a.className = 'evento-sessoes__button';
    a.textContent = 'Reservar';
    article.appendChild(a);
  }

  return article;
}

function createEventFaqItem(faq, index) {
  var item = document.createElement('div');
  item.className = 'evento-accordion__item';

  var trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'evento-accordion__trigger';
  trigger.setAttribute('aria-expanded', 'false');
  trigger.dataset.eventoAccordionTrigger = '';

  var number = document.createElement('span');
  number.className = 'evento-accordion__number';
  number.textContent = String(index + 1).padStart(2, '0');
  trigger.appendChild(number);

  var title = document.createElement('span');
  title.className = 'evento-accordion__title';
  title.textContent = faq.question || '';
  trigger.appendChild(title);

  var icon = document.createElement('span');
  icon.className = 'evento-accordion__icon';
  icon.textContent = '+';
  trigger.appendChild(icon);

  item.appendChild(trigger);

  var content = document.createElement('div');
  content.className = 'evento-accordion__content';

  var contentP = document.createElement('p');
  contentP.textContent = faq.answer || '';
  content.appendChild(contentP);

  item.appendChild(content);

  return item;
}

function createProximoEventoCard(event) {
  var article = document.createElement('article');
  article.className = 'proximos-eventos__card';

  var sessions = event.sessions || [];
  var firstSession = sessions[0] || {};

  var dateObj = firstSession.date ? new Date(firstSession.date) : null;

  var small = document.createElement('small');
  small.textContent = dateObj ? scheduleWeekdayNames[dateObj.getDay()] : '';
  article.appendChild(small);

  var strong = document.createElement('strong');
  strong.textContent = dateObj ? String(dateObj.getDate()).padStart(2, '0') + ' ' + scheduleMonthAbbrevs[dateObj.getMonth()] : '';
  article.appendChild(strong);

  var img = document.createElement('img');
  img.src = event.imageUrl || 'assets/img-contactos.png';
  img.alt = event.title || '';
  article.appendChild(img);

  var h3 = document.createElement('h3');
  h3.textContent = event.title || '';
  article.appendChild(h3);

  var span = document.createElement('span');
  span.textContent = firstSession.specificLocation || event.locationSummary || '';
  article.appendChild(span);

  var a = document.createElement('a');
  a.href = 'bilhetes.html';
  a.textContent = 'Comprar bilhetes';
  article.appendChild(a);

  return article;
}

function loadProximosEventos(grid, excludeId) {
  fetch('/api/events?limit=4')
    .then(function (response) {
      if (!response.ok) throw new Error('Erro na rede');
      return response.json();
    })
    .then(function (result) {
      var events = extractData(result);
      if (!events || events.length === 0) return;

      var filtered = events.filter(function (e) {
        return e._id !== excludeId && e.sessions && e.sessions.length > 0 && e.sessions[0].date;
      });

      var toShow = filtered.slice(0, 3);
      if (toShow.length === 0) return;

      grid.innerHTML = '';
      var fragment = document.createDocumentFragment();
      toShow.forEach(function (event) {
        fragment.appendChild(createProximoEventoCard(event));
      });
      grid.appendChild(fragment);
    })
    .catch(function () {
      // Keep fallback content
    });
}

function loadEventoPage() {
  var params = new URLSearchParams(window.location.search);
  var eventId = params.get('id');
  if (!eventId) return;

  var heroTitle = document.querySelector('[data-evento-hero-title]');
  var heroTags = document.querySelector('[data-evento-hero-tags]');
  var quoteEl = document.querySelector('[data-evento-quote] h2');
  var directionEl = document.querySelector('[data-evento-direction]');
  var locationEl = document.querySelector('[data-evento-location]');
  var durationEl = document.querySelector('[data-evento-duration]');
  var infoImage = document.querySelector('[data-evento-image]');
  var descriptionEl = document.querySelector('[data-evento-description]');
  var sessionsList = document.querySelector('[data-evento-sessoes-list]');
  var faqsList = document.querySelector('[data-evento-faqs-list]');
  var proximosGrid = document.querySelector('[data-proximos-eventos-grid]');

  if (!heroTitle) return;

  fetch('/api/events/' + eventId)
    .then(function (response) {
      if (!response.ok) throw new Error('Erro na rede');
      return response.json();
    })
    .then(function (result) {
      if (!result.success) throw new Error(result.error || 'Erro da API');

      var event = result.data || result.event || null;
      if (!event) return;

      if (event.title) {
        var parts = splitHeroTitle(event.title);
        heroTitle.innerHTML = parts[0] + ' <span>' + parts[1] + '</span>';
      }

      if (heroTags && event.direction) {
        heroTags.innerHTML = '<span>' + event.direction + '</span>';
      }

      if (quoteEl && event.quote) {
        quoteEl.textContent = '“' + event.quote + '”';
      }

      if (directionEl && event.direction) {
        directionEl.textContent = event.direction;
      }

      if (locationEl) {
        var loc = event.locationSummary || '';
        if (event.sessions && event.sessions.length > 0 && event.sessions[0].specificLocation) {
          loc = event.sessions[0].specificLocation;
        }
        locationEl.textContent = loc;
      }

      if (durationEl && event.duration) {
        durationEl.textContent = event.duration;
      }

      if (infoImage && event.imageUrl) {
        infoImage.src = event.imageUrl;
        infoImage.alt = event.title || '';
      }

      if (descriptionEl && event.description) {
        var parts = event.description.split('\n').filter(function (p) { return p.trim(); });
        descriptionEl.innerHTML = '';
        parts.forEach(function (pText) {
          var pEl = document.createElement('p');
          pEl.textContent = pText;
          descriptionEl.appendChild(pEl);
        });
      }

      if (sessionsList && event.sessions && event.sessions.length > 0) {
        sessionsList.innerHTML = '';
        var sessFragment = document.createDocumentFragment();
        event.sessions.forEach(function (session) {
          sessFragment.appendChild(createEventSessionEl(session));
        });
        sessionsList.appendChild(sessFragment);
      }

      if (faqsList && event.faqs && event.faqs.length > 0) {
        faqsList.innerHTML = '';
        var faqFragment = document.createDocumentFragment();
        event.faqs.forEach(function (faq, i) {
          faqFragment.appendChild(createEventFaqItem(faq, i));
        });
        faqsList.appendChild(faqFragment);
      }

      if (proximosGrid) {
        loadProximosEventos(proximosGrid, eventId);
      }
    })
    .catch(function () {
      // Keep fallback content
    });
}

// Instagram carousel
var instagramPosts = [];
var instagramIndex = 0;
var instagramContainer = document.querySelector('[data-instagram-phones]');
var instagramPrev = document.querySelector('[data-instagram-prev]');
var instagramNext = document.querySelector('[data-instagram-next]');

function createInstagramCard(post, position) {
  var card = document.createElement('article');
  card.className = 'instagram__phone';

  if (position === 'center') {
    card.classList.add('instagram__phone--center', 'instagram__phone--navy');
  } else {
    card.classList.add('instagram__phone--side', 'instagram__phone--coral');
  }

  var header = document.createElement('div');
  header.className = 'instagram__phone-header';

  var handle = document.createElement('span');
  handle.textContent = '@fiato.opera';
  header.appendChild(handle);

  var icon = document.createElement('span');
  icon.className = 'instagram__phone-icon';
  icon.setAttribute('aria-hidden', 'true');
  icon.textContent = '▶';
  header.appendChild(icon);

  card.appendChild(header);

  var media = document.createElement('div');
  media.className = 'instagram__phone-media';

  if (post.mediaType === 'video') {
    var video = document.createElement('video');
    video.src = post.mediaUrl;
    video.muted = true;
    video.playsInline = true;
    video.loop = true;
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.objectFit = 'cover';
    video.style.position = 'absolute';
    video.style.top = '0';
    video.style.left = '0';
    media.appendChild(video);
    media.style.position = 'relative';

    video.addEventListener('mouseenter', function () { video.play(); });
    video.addEventListener('mouseleave', function () { video.pause(); });
  } else {
    var img = document.createElement('img');
    img.src = post.mediaUrl;
    img.alt = post.caption || '';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    img.style.position = 'absolute';
    img.style.top = '0';
    img.style.left = '0';
    media.appendChild(img);
    media.style.position = 'relative';
  }

  if (post.postUrl) {
    var visitLink = document.createElement('a');
    visitLink.href = post.postUrl;
    visitLink.className = 'instagram__visit';
    visitLink.target = '_blank';
    visitLink.rel = 'noopener';
    visitLink.textContent = 'Visit Us';
    media.appendChild(visitLink);
  } else {
    var visitSpan = document.createElement('span');
    visitSpan.className = 'instagram__visit';
    visitSpan.textContent = 'Visit Us';
    media.appendChild(visitSpan);
  }

  card.appendChild(media);

  if (post.caption) {
    var caption = document.createElement('p');
    caption.className = 'instagram__phone-caption';
    caption.textContent = post.caption;
    card.appendChild(caption);
  }

  return card;
}

function renderInstagram() {
  if (!instagramContainer) return;
  if (instagramPosts.length === 0) {
    var msg = document.createElement('p');
    msg.className = 'instagram__phone-caption';
    msg.textContent = 'Em breve...';
    msg.style.textAlign = 'center';
    msg.style.padding = '40px';
    instagramContainer.innerHTML = '';
    instagramContainer.appendChild(msg);
    return;
  }

  var total = instagramPosts.length;
  var prevIndex = ((instagramIndex - 1) % total + total) % total;
  var nextIndex = (instagramIndex + 1) % total;

  var fragment = document.createDocumentFragment();

  if (total === 1) {
    fragment.appendChild(createInstagramCard(instagramPosts[0], 'center'));
  } else {
    fragment.appendChild(createInstagramCard(instagramPosts[prevIndex], 'side'));
    fragment.appendChild(createInstagramCard(instagramPosts[instagramIndex], 'center'));
    fragment.appendChild(createInstagramCard(instagramPosts[nextIndex], 'side'));
  }

  instagramContainer.innerHTML = '';
  instagramContainer.appendChild(fragment);
}

function loadInstagramPosts() {
  if (!instagramContainer) return;

  fetch('/api/instagram')
    .then(function (response) {
      if (!response.ok) throw new Error('Erro na rede');
      return response.json();
    })
    .then(function (result) {
      var posts = extractData(result);
      if (!posts || posts.length === 0) {
        renderInstagram();
        return;
      }
      instagramPosts = posts;
      instagramIndex = 0;
      renderInstagram();
    })
    .catch(function () {
      if (!instagramContainer) return;
      var msg = document.createElement('p');
      msg.className = 'instagram__phone-caption';
      msg.textContent = 'Em breve...';
      msg.style.textAlign = 'center';
      msg.style.padding = '40px';
      instagramContainer.innerHTML = '';
      instagramContainer.appendChild(msg);
    });
}

if (instagramPrev) {
  instagramPrev.addEventListener('click', function () {
    if (instagramPosts.length <= 1) return;
    instagramIndex = ((instagramIndex - 1) % instagramPosts.length + instagramPosts.length) % instagramPosts.length;
    renderInstagram();
  });
}

if (instagramNext) {
  instagramNext.addEventListener('click', function () {
    if (instagramPosts.length <= 1) return;
    instagramIndex = (instagramIndex + 1) % instagramPosts.length;
    renderInstagram();
  });
}

window.addEventListener('scroll', updateNavbarTheme);
window.addEventListener('resize', () => {
  updateNavbarTheme();

  if (window.innerWidth > 768 && navbar && menuToggle) {
    navbar.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menu');
  }
});

updateNavbarTheme();

if (countdownDays && countdownHours && countdownMinutes) {
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

loadHomeEvents();
loadHomeHeroEvent();
loadHomePress();
loadAgendaEvents();
loadEventoPage();
loadTicketEvents();
loadInstagramPosts();
