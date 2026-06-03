const navbar = document.querySelector('.navbar');
const menuToggle = document.querySelector('.navbar__toggle');
const navbarLinks = document.querySelectorAll('.navbar__link, .navbar__logo');
const countdownDays = document.querySelector('[data-countdown-days]');
const countdownHours = document.querySelector('[data-countdown-hours]');
const countdownMinutes = document.querySelector('[data-countdown-minutes]');
const agendaFilterButtons = document.querySelectorAll('[data-agenda-sort]');
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

  const selectedSession = ticketSession.selectedOptions[0];
  const price = Number(selectedSession.dataset.price || 0);
  const quantity = Math.min(10, Math.max(1, Number(ticketQuantity.value || 1)));

  ticketQuantity.value = String(quantity);

  setText('[data-summary-show]', ticketShow.value);
  setText('[data-summary-date]', selectedSession.dataset.date || '');
  setText('[data-summary-time]', selectedSession.dataset.time || '');
  setText('[data-summary-place]', selectedSession.dataset.place || '');
  setText('[data-summary-price]', formatEuro(price));
  setText('[data-summary-quantity]', String(quantity));
  setText('[data-summary-total]', formatEuro(price * quantity));
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

agendaFilterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    agendaFilterButtons.forEach((filterButton) => {
      filterButton.classList.remove('is-active');
    });

    button.classList.add('is-active');
    sortAgenda(button.dataset.agendaSort);
  });
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

eventoAccordionTriggers.forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const item = trigger.closest('.evento-accordion__item');
    const icon = item?.querySelector('.evento-accordion__icon');
    const isOpen = item?.classList.contains('evento-accordion__item--open');

    if (!item || !icon) return;

    eventoAccordionTriggers.forEach((otherTrigger) => {
      const otherItem = otherTrigger.closest('.evento-accordion__item');
      const otherIcon = otherItem?.querySelector('.evento-accordion__icon');

      otherItem?.classList.remove('evento-accordion__item--open');
      otherTrigger.setAttribute('aria-expanded', 'false');
      if (otherIcon) otherIcon.textContent = '+';
    });

    if (!isOpen) {
      item.classList.add('evento-accordion__item--open');
      trigger.setAttribute('aria-expanded', 'true');
      icon.textContent = '−';
    }
  });
});

if (ticketForm) {
  updateTicketSummary();

  [ticketShow, ticketSession, ticketQuantity].forEach((field) => {
    field?.addEventListener('input', updateTicketSummary);
    field?.addEventListener('change', updateTicketSummary);
  });

  ticketForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const requiredFields = ticketForm.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach((field) => {
      const fieldIsValid = field.checkValidity();
      field.classList.toggle('is-invalid', !fieldIsValid);
      if (!fieldIsValid) isValid = false;
    });

    if (!ticketMessage) return;

    ticketMessage.classList.toggle('is-success', isValid);
    ticketMessage.textContent = isValid
      ? 'Pedido de reserva registado. A equipa FIATO entrará em contacto.'
      : 'Preenche todos os campos obrigatórios antes de submeter.';
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
