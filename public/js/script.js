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

// Anti-spam timestamp
const formLoadTime = Date.now();

function isAltchaVerified(form) {
  var widget = form.querySelector('altcha-widget');
  if (!widget) return true;

  var payload = new FormData(form).get('altcha');
  if (payload) return true;

  if (typeof widget.getState === 'function') {
    return widget.getState() === 'verified';
  }

  return widget.getAttribute('state') === 'verified';
}

function pad(value) {
  return String(value).padStart(2, '0');
}

function debounce(func, wait) {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      func.apply(context, args);
    }, wait);
  };
}
const mainNavbar = document.querySelector('.navbar');

if (mainNavbar) {
  const navbarObserver = new ResizeObserver(entries => {
    for (let entry of entries) {
      // Get the exact, real-time height of the navbar element
      const actualHeight = entry.target.offsetHeight;
      // Inject it dynamically into the document root
      document.documentElement.style.setProperty('--navbar-height', actualHeight + 'px');
    }
  });
  
  navbarObserver.observe(mainNavbar);
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
  const navbarHeight = navbar.getBoundingClientRect().height;
  // Set default theme: dark-blue for archive page to ensure contrast on load, transparent for others
  let currentTheme = document.querySelector('[data-arquivo-list]') ? 'dark-blue' : 'dark-blue';

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();

    if (rect.top <= navbarHeight && rect.bottom >= navbarHeight) {
      const theme = section.getAttribute('data-navbar-theme');
      if (theme) currentTheme = theme;
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

document.addEventListener('click', function (event) {
  var trigger = event.target.closest('[data-faq-trigger]');
  if (!trigger) return;

  var item = trigger.closest('.faq-list__item');
  var list = item?.closest('.faq-list, [data-sobre-faq-list]');
  var answer = item?.querySelector('.faq-list__answer-wrap');
  var icon = item?.querySelector('.faq-list__icon');
  var isOpen = item?.classList.contains('faq-list__item--open');

  if (!item || !answer || !icon || !list) return;

  list.querySelectorAll('.faq-list__item').forEach(function (otherItem) {
    var otherTrigger = otherItem.querySelector('[data-faq-trigger]');
    var otherAnswer = otherItem.querySelector('.faq-list__answer-wrap');
    var otherIcon = otherItem.querySelector('.faq-list__icon');

    otherItem.classList.remove('faq-list__item--open');
    if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
    if (otherAnswer) otherAnswer.hidden = true;
    if (otherIcon) otherIcon.innerHTML = '<i class="fas fa-plus"></i>';
  });

  if (!isOpen) {
    item.classList.add('faq-list__item--open');
    trigger.setAttribute('aria-expanded', 'true');
    answer.hidden = false;
    icon.innerHTML = '<i class="fas fa-minus"></i>';
  }
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
    if (otherIcon) otherIcon.innerHTML = '<i class="fas fa-plus"></i>';
  });

  if (!isOpen) {
    item.classList.add('evento-accordion__item--open');
    trigger.setAttribute('aria-expanded', 'true');
    icon.innerHTML = '<i class="fas fa-minus"></i>';
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

  ticketForm.addEventListener('submit', async function (event) {
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

    if (!isAltchaVerified(ticketForm)) {
      ticketMessage.className = 'ticket-form__message';
      ticketMessage.textContent = 'Por favor, complete a verificação de segurança.';
      return;
    }

    var formData = new FormData(ticketForm);

    var body = {
      eventId: eventId,
      sessionId: sessionId,
      altcha: formData.get('altcha') || '',
      firstName: formData.get('nome') || '',
      lastName: formData.get('apelido') || '',
      email: formData.get('email') || '',
      phone: formData.get('telefone') || '',
      quantity: Number(formData.get('quantidade') || 1),
      observations: formData.get('observacoes') || '',
      b_website: formData.get('b_website') || '',
      ts: formLoadTime
    };

    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }
        ticketMessage.className = 'ticket-form__message is-success';
        ticketMessage.textContent = 'Pedido de reserva registado. A equipa FIATO entrará em contacto.';
        ticketForm.reset();
        updateTicketSummary();
    } catch (err) {
        ticketMessage.className = 'ticket-form__message';
        ticketMessage.textContent = err.message || 'Ocorreu um erro ao processar a reserva. Tenta novamente.';
    }
  });
}

// Contact forms
var contactForm = document.querySelector('[data-contact-form]');
var contactMessage = document.querySelector('[data-contact-message]');

if (contactForm) {
  contactForm.addEventListener('submit', async function (event) {
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

    if (!isAltchaVerified(contactForm)) {
      contactMessage.className = 'contactos-form__message';
      contactMessage.textContent = 'Por favor, complete a verificação de segurança.';
      return;
    }

    var formData = new FormData(contactForm);

    var body = {
      altcha: formData.get('altcha') || '',
      firstName: formData.get('nome') || '',
      lastName: formData.get('apelido') || '',
      email: formData.get('email') || '',
      message: formData.get('mensagem') || '',
      type: 'general',
      b_website: formData.get('b_website') || '',
      ts: formLoadTime
    };

    try {
      const response = await fetch('/api/contact-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }
        contactMessage.className = 'contactos-form__message is-success';
        contactMessage.textContent = 'Recebemos a tua mensagem. Vamos responder com a maior brevidade possível.';
        var contactButton = contactForm.querySelector('button[type="submit"]');
        if (contactButton) {
          contactButton.textContent = 'Mensagem enviada';
          contactButton.disabled = true;
          contactButton.classList.add('is-complete');
        }
        contactForm.reset();
    } catch (err) {
        contactMessage.className = 'contactos-form__message';
        contactMessage.textContent = err.message || 'Ocorreu um erro ao enviar a mensagem.';
    }
  });
}

var memberForm = document.querySelector('[data-member-form]');
var memberMessage = document.querySelector('[data-member-message]');

if (memberForm) {
  memberForm.addEventListener('submit', async function (event) {
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

    if (!isAltchaVerified(memberForm)) {
      memberMessage.className = 'member-form__message';
      memberMessage.textContent = 'Por favor, complete a verificação de segurança.';
      return;
    }

    var formData = new FormData(memberForm);

    formData.set('firstName', formData.get('nome') || '');
    formData.set('lastName', formData.get('apelido') || '');
    formData.set('type', 'membership');
    formData.set('b_website', formData.get('b_website') || '');
    formData.set('ts', String(formLoadTime));

    try {
      const response = await fetch('/api/contact-requests', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }
        memberMessage.className = 'member-form__message is-success';
        memberMessage.textContent = 'Recebemos o teu pedido. Vamos analisar a candidatura e responder brevemente.';
        var memberButton = memberForm.querySelector('button[type="submit"]');
        if (memberButton) {
          memberButton.textContent = 'Pedido enviado';
          memberButton.disabled = true;
          memberButton.classList.add('is-complete');
        }
        memberForm.reset();
    } catch (err) {
        memberMessage.className = 'member-form__message';
        memberMessage.textContent = err.message || 'Ocorreu um erro ao enviar o pedido.';
    }
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
    icon.innerHTML = '<i class="fas fa-euro-sign"></i>';
    badge.appendChild(icon);
    badge.appendChild(document.createTextNode(' ' + formatSchedulePrice(numericPrice)));
  } else {
    icon.className = 'schedule__badge-dot';
    icon.innerHTML = '<i class="fas fa-circle"></i>';
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

  scheduleGrid.innerHTML = '<p class="schedule__loading">A carregar eventos...</p>';

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
      if (heroBadge) heroBadge.textContent = 'Estreia';

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
  arrowLink.innerHTML = '<i class="fas fa-arrow-up" aria-hidden="true"></i>';
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

  pressList.innerHTML = '<p class="press__loading">A carregar notícias...</p>';

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

  agendaList.innerHTML = '<p class="agenda-list__empty">A carregar agenda...</p>';

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
            label.textContent = 'Ordenar por';
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
// ==========================================
// ARQUIVO INTERACTION & COMBINED FILTERING LOGIC
// ==========================================

const arquivoList = document.querySelector('[data-arquivo-list]');

if (arquivoList) {
  // 1. Unified Event Delegation for Toggling Sections
  arquivoList.addEventListener('click', function (event) {
    const section = event.target.closest('.edition-section');
    if (!section) return;

    const clearBtn = event.target.closest('[data-archive-clear]');
    if (clearBtn) {
      const agendaContainer = section.querySelector('[data-archive-agenda]');
      const newsContainer = section.querySelector('[data-archive-news]');
      const containers = [agendaContainer, newsContainer].filter(Boolean);

      // Initiate fade out for smooth transition
      containers.forEach(c => {
        c.style.opacity = '0';
        c.style.transition = 'opacity 0.3s ease';
      });

      setTimeout(() => {
        const spinner = '<div style="display:flex;justify-content:center;padding:40px;width:100%;"><div style="width:24px;height:24px;border:2px solid rgba(255,255,255,0.2);border-top-color:currentColor;border-radius:50%;animation:archive-spin 0.8s linear infinite;"></div><style>@keyframes archive-spin{to{transform:rotate(360deg)}}</style></div>';
        const aList = agendaContainer?.querySelector('[data-agenda-events]');
        const nList = newsContainer?.querySelector('.press__list');
        if (aList) aList.innerHTML = spinner;
        if (nList) nList.innerHTML = '';
        containers.forEach(c => c.style.opacity = '1');

        setTimeout(() => {
          const inputs = section.querySelectorAll('[data-archive-filters] input');
          inputs.forEach(input => input.value = '');
          section._agendaVisibleCount = 4;
          section._newsVisibleCount = 3;
          updateArchiveDisplay(section);
          containers.forEach(c => c.style.opacity = '1');
        }, 300);
      }, 300);
      return;
    }

    const toggleBtn = event.target.closest('[data-edition-toggle]');
    const isContentClick = event.target.closest('.edition-section__content') || event.target === section;

    // FIX: If the section is already open, prevent clicks inside its content from collapsing it
    if (section.classList.contains('is-active') && event.target.closest('[data-archive-container]') && !toggleBtn) {
      return;
    }

    if (toggleBtn || isContentClick) {
      const isActive = section.classList.contains('is-active');
      const allSections = arquivoList.querySelectorAll('.edition-section');

      // Reset all states smoothly via class definitions
      allSections.forEach(s => {
        s.classList.remove('is-active');
        const btn = s.querySelector('.edition-section__button');
        if (btn) btn.classList.remove('edition-section__button--open');
      });
      arquivoList.classList.remove('edicoes-page--item-active');

      // If we are activating a section
      if (!isActive) {
        section.classList.add('is-active');
        arquivoList.classList.add('edicoes-page--item-active');
        const btn = section.querySelector('.edition-section__button');
        if (btn) btn.classList.add('edition-section__button--open');

        // Load and initialize archive content dynamically
        initializeArchiveContent(section);
      }

      // Trigger navbar update after the transition finishes
      setTimeout(updateNavbarTheme, 800);
    }
  });

  // 2. Event Listener for Combinable Client-Side Inputs
  const debouncedArchiveUpdate = debounce(updateArchiveDisplay, 300);

  arquivoList.addEventListener('input', function(e) {
    if (e.target.closest('[data-archive-filters]')) {
      const section = e.target.closest('.edition-section');
      
      // Reset visible counts to initial subsets when filters change
      section._agendaVisibleCount = 4;
      section._newsVisibleCount = 3;
      debouncedArchiveUpdate(section);
    }
  });
}

function initializeArchiveContent(section) {
  const year = section.dataset.editionYear;
  const theme = section.classList.contains('edition-section--navy') ? 'navy' : 'orange';
  const dynamicContainer = section.querySelector('[data-archive-container]');

  // Lazy-inject the internal structure (headers, hidden filter bars, and list containers)
  if (dynamicContainer && !dynamicContainer.innerHTML.trim()) {
    dynamicContainer.innerHTML = `
      <!-- Agenda Section -->
      <div class="agenda-list__month agenda-list__month--${theme === 'navy' ? 'blue' : 'light'}" style="margin-top: 80px; background: transparent; text-align: left;">
         <div class="agenda-list__month-header" style="border-bottom: none; padding-bottom: 20px;">
            <div class="press__heading-group">
                  <span class="press__label">Eventos</span>
                  <span class="press__heading">${year}</span>
               </div>
         </div>
         
         <div class="agenda-list__filters" style="display: none; padding: 0 var(--container-padding) 48px; border-bottom: 1px solid currentColor; margin-bottom: 40px;">
            <div class="agenda-filters" aria-label="Filtros da agenda" style="justify-content: flex-start; gap: 14px; flex-wrap: wrap;">
               <button type="button" class="agenda-filters__button" data-agenda-sort="title">
                  <span class="agenda-filters__label">Ordenar por</span>
                  <span class="agenda-filters__value">Título</span>
               </button>
               <button type="button" class="agenda-filters__button" data-agenda-sort="place">
                  <span class="agenda-filters__label">Ordenar por</span>
                  <span class="agenda-filters__value">Local</span>
               </button>
               <button type="button" class="agenda-filters__button is-active" data-agenda-sort="date">
                  <span class="agenda-filters__label">Ordenar por</span>
                  <span class="agenda-filters__value">Data</span>
               </button>
               
               <div style="display: contents;" data-archive-filters>
                  <input type="text" class="archive-filters__search" style="width: auto; min-width: 200px; max-width: 100%; height: 48px; flex: 1 1 auto;" placeholder="Procurar título..." data-filter-title>
                  <input type="text" class="archive-filters__search" style="width: auto; min-width: 150px; max-width: 100%; height: 48px; flex: 1 1 auto;" placeholder="Local..." data-filter-local>
                  <input type="text" class="archive-filters__search" style="width: auto; min-width: 150px; max-width: 100%; height: 48px; flex: 1 1 auto;" placeholder="Data..." data-filter-date>
                  <button type="button" class="agenda-filters__button" style="min-width: 120px; flex: 0 1 auto;" data-archive-clear>
                     <span class="agenda-filters__label">Limpar</span>
                     <span class="agenda-filters__value">Filtros</span>
                  </button>
               </div>
            </div>
         </div>
         <div class="edition-section__agenda" data-archive-agenda><div class="agenda-list__events" data-agenda-events></div></div>
      </div>

      <!-- Notícias Section -->
      <div class="press" style="background: transparent; text-align: left; padding: 0;">
         <div class="press__inner">
            <div class="press__header" style="margin-top: 80px; margin-bottom: 20px;">
               <div class="press__heading-group">
                  <span class="press__label">NOTÍCIAS</span>
                  <h2 class="press__heading">${year}</h2>
               </div>
            </div>
            <div class="press__filters" style="display: none; padding-bottom: 64px; border-bottom: 1px solid rgba(251, 251, 249, 0.15); margin-bottom: 40px;">
               <div class="agenda-filters" aria-label="Filtros de notícias" style="justify-content: flex-start; gap: 14px; flex-wrap: wrap;">
                  <div style="display: contents;" data-archive-filters>
                     <input type="text" class="archive-filters__search" style="width: auto; min-width: 240px; max-width: 100%; height: 48px; flex: 1 1 auto;" placeholder="Procurar nas notícias..." data-filter-title>
                     <button type="button" class="agenda-filters__button" style="min-width: 120px; flex: 0 1 auto;" data-archive-clear>
                        <span class="agenda-filters__label">Limpar</span>
                        <span class="agenda-filters__value">Filtros</span>
                     </button>
                  </div>
               </div>
            </div>
            <div class="edition-section__news" data-archive-news><ul class="press__list"></ul></div>
         </div>
      </div>
    `;
  }

  // If data is already cached, execute client-side filter update instantly
  if (section._archiveLoaded) {
    updateArchiveDisplay(section);
    return;
  }

  if (section._archiveLoading) return;
  section._archiveLoading = true;

  // Parallel asynchronous fetching
  Promise.all([
    loadArchiveAgenda(section, year),
    loadArchiveNews(section, year)
  ]).then(() => {
    section._archiveLoaded = true;
    section._archiveLoading = false;
  }).catch(() => {
    section._archiveLoading = false;
  });
}

function updateArchiveDisplay(section) {
  // Centralized pipeline to filter both datasets simultaneously
  renderArchiveAgenda(section);
  renderArchiveNews(section);
}

// ==========================================
// AGENDA ARCHITECTURE (REUSING COMPONENT PATTERNS)
// ==========================================

function loadArchiveAgenda(section, year) {
  const container = section.querySelector('[data-archive-agenda]');
  if (!container) return;

  const eventsList = container.querySelector('[data-agenda-events]');
  if (eventsList) {
    eventsList.innerHTML = '<p class="agenda-list__empty" style="margin-top: 60px;">A carregar eventos de ' + year + '...</p>';
  }

  return fetch('/api/events?year=' + year + '&limit=500')
    .then(function (res) { return res.json(); })
    .then(function (result) {
      let events = extractData(result) || [];

      // Ensure default chronological sorting for accurate "Date" filter and dataset.order
      events.sort(function (a, b) {
        const dateA = a.sessions && a.sessions[0] && a.sessions[0].date ? new Date(a.sessions[0].date).getTime() : 0;
        const dateB = b.sessions && b.sessions[0] && b.sessions[0].date ? new Date(b.sessions[0].date).getTime() : 0;
        return dateA - dateB;
      });

      // Cache data scoped to this year
      section._allEvents = events;

      section._agendaVisibleCount = 4;
      renderArchiveAgenda(section);
    })
    .catch(function () {
      const el = container.querySelector('[data-agenda-events]');
      if (el) el.innerHTML = '<p class="agenda-list__empty">Não foi possível carregar a agenda.</p>';
      throw new Error('Fetch failed for Archive Agenda');
    });
}

function renderArchiveAgenda(section) {
  const container = section.querySelector('[data-archive-agenda]');
  if (!container || !section._allEvents || container.dataset.initialized) {
    // If already has structure, just render items
  } else {
    // Setup sorting functionality once
    const sortButtons = section.querySelectorAll('[data-agenda-sort]');
    sortButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        sortButtons.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        
        const list = section.querySelector('[data-agenda-events]');
        if (!list) return;
        const cards = Array.from(list.querySelectorAll('.agenda-event-card'));
        const sortKey = btn.dataset.agendaSort;
        
        cards.sort((a, b) => {
          if (sortKey === 'date') return Number(a.dataset.order) - Number(b.dataset.order);
          const valA = (a.dataset[sortKey] || '').toLowerCase();
          const valB = (b.dataset[sortKey] || '').toLowerCase();
          return valA.localeCompare(valB, 'pt');
        });
        
        list.innerHTML = '';
        cards.forEach(c => list.appendChild(c));
      });
    });
    container.dataset.initialized = 'true';
  }

  const eventsList = section.querySelector('[data-agenda-events]');
  if (!eventsList) return;

  // Collect values scoped to the agenda container to avoid cross-filtering with news
  const agendaScope = section.querySelector('.agenda-list__month');
  const titleVal = (agendaScope?.querySelector('[data-filter-title]')?.value || '').toLowerCase();
  const localVal = (agendaScope?.querySelector('[data-filter-local]')?.value || '').toLowerCase();
  const dateVal = (agendaScope?.querySelector('[data-filter-date]')?.value || '').toLowerCase();

  // Evaluate combined constraints client-side
  const filteredEvents = section._allEvents.filter(function (event) {
    const matchTitle = !titleVal || (event.title || '').toLowerCase().includes(titleVal);
    
    const locationStr = ((event.locationSummary || '') + ' ' + (event.sessions || []).map(s => s.specificLocation || '').join(' ')).toLowerCase();
    const matchLocal = !localVal || locationStr.includes(localVal);

    const sessionDatesStr = (event.sessions || []).map(s => {
      if (!s.date) return '';
      const d = new Date(s.date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      return `${day}/${month}/${d.getFullYear()}`;
    }).join(' ');
    const matchDate = !dateVal || sessionDatesStr.includes(dateVal) || (event.sessions || []).some(s => (s.date || '').includes(dateVal));

    return matchTitle && matchLocal && matchDate;
  });

  // Reveal filters only after data exists
  const filtersContainer = section.querySelector('.agenda-list__filters');
  if (filtersContainer && section._allEvents.length > 0) {
    filtersContainer.style.display = 'block';
  }

  if (filteredEvents.length === 0) {
    const year = section.dataset.editionYear;
    const emptyMsg = (section._allEvents && section._allEvents.length > 0) 
      ? "Nenhum evento corresponde aos filtros." 
      : "Não existem eventos para esta edição.";

    eventsList.innerHTML = `
      <div style="text-align: center; padding: 100px 20px; opacity: 0; animation: archiveFadeIn 0.5s ease-out forwards;">
        <style>@keyframes archiveFadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 0.7; transform: translateY(0); } }</style>
        <i class="fas fa-magnifying-glass empty-state__icon" aria-hidden="true"></i>
        <p class="agenda-list__empty" style="margin: 0;">${emptyMsg}</p>
      </div>`;
    
    // Clean up any existing load more button outside eventsList
    const oldBtn = container.querySelector('.archive-load-more');
    if (oldBtn) oldBtn.remove();
    return;
  }

  eventsList.innerHTML = '';

  const limit = section._agendaVisibleCount || 4;

  // Reuse existing architected components
  filteredEvents.slice(0, limit).forEach(function (ev, idx) {
    if (typeof createAgendaCard === 'function') {
      eventsList.appendChild(createAgendaCard(ev, idx));
    } else if (typeof createProximoEventoCard === 'function') {
      eventsList.appendChild(createProximoEventoCard(ev));
    }
  });

  // Reusable load-more pattern
  const oldBtn = container.querySelector('.archive-load-more');
  if (oldBtn) oldBtn.remove();

  if (limit < filteredEvents.length) {
    const btnWrapper = document.createElement('div');
    btnWrapper.className = 'archive-load-more';
    btnWrapper.style.padding = '80px 0';
    btnWrapper.style.textAlign = 'center';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'agenda-event-card__button agenda-event-card__button--outline';
    btn.textContent = 'Carregar mais';
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      section._agendaVisibleCount += 4;
      renderArchiveAgenda(section);
    });
    btnWrapper.appendChild(btn);
    container.appendChild(btnWrapper);
  }
}

// ==========================================
// NOTÍCIAS ARCHITECTURE (REUSING HOMEPAGE PATTERNS)
// ==========================================

function loadArchiveNews(section, year) {
  const container = section.querySelector('[data-archive-news]');
  if (!container) return;

  const list = container.querySelector('.press__list');
  if (list) {
    list.innerHTML = '<p class="press__loading" style="margin-top: 60px;">A carregar notícias de ' + year + '...</p>';
  }

  return fetch('/api/news?year=' + year + '&limit=500')
    .then(function (res) { return res.json(); })
    .then(function (result) {
      const news = extractData(result) || [];

      // Cache data scoped to this year
      section._allNews = news;

      section._newsVisibleCount = 3;
      renderArchiveNews(section);
    })
    .catch(function () {
      const el = container.querySelector('.press__list');
      if (el) el.innerHTML = '<p class="press__loading">Não foi possível carregar as notícias.</p>';
      throw new Error('Fetch failed for Archive News');
    });
}

function renderArchiveNews(section) {
  const container = section.querySelector('[data-archive-news]');
  const list = section.querySelector('.press__list');
  if (!container || !section._allNews || !list) return;

  // Collect values scoped to the news container
  const newsScope = section.querySelector('.press');
  const titleVal = (newsScope?.querySelector('[data-filter-title]')?.value || '').toLowerCase();
  // News UI in archive only supports title search; default others to empty
  const localVal = '';
  const dateVal = '';

  const filteredNews = section._allNews.filter(function (item) {
    const matchTitle = !titleVal || (item.title || '').toLowerCase().includes(titleVal) || (item.body || '').toLowerCase().includes(titleVal);
    const matchLocal = !localVal || (item.body || '').toLowerCase().includes(localVal);
    
    let dateStr = '';
    if (item.publishDate) {
      const d = new Date(item.publishDate);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      dateStr = `${day}/${month}/${d.getFullYear()}`;
    }
    const matchDate = !dateVal || dateStr.includes(dateVal) || (item.publishDate || '').includes(dateVal);

    return matchTitle && matchLocal && matchDate;
  });

  // Reveal filters only after data exists
  const filtersContainer = section.querySelector('.press__filters');
  if (filtersContainer && section._allNews.length > 0) {
    filtersContainer.style.display = 'block';
  }

  if (filteredNews.length === 0) {
    const year = section.dataset.editionYear;
    const emptyMsg = (section._allNews && section._allNews.length > 0) 
      ? "Nenhuma notícia corresponde aos filtros." 
      : "Não existem notícias para esta edição.";

    list.innerHTML = `
      <div style="text-align: center; padding: 80px 20px; opacity: 0; animation: archiveFadeIn 0.5s ease-out forwards;">
        <style>@keyframes archiveFadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }</style>
        <p class="press__loading">${emptyMsg}</p>
      </div>`;
    
    const oldBtn = container.querySelector('.load-more-news-btn');
    if (oldBtn) oldBtn.remove();
    return;
  }

  list.innerHTML = '';

  const limit = section._newsVisibleCount || 3;

  filteredNews.slice(0, limit).forEach(function (item) {
    if (typeof createPressRow === 'function') {
      list.appendChild(createPressRow(item));
    }
  });

  // Reusable load-more pattern matching standard architecture
  const oldBtn = container.querySelector('.load-more-news-btn');
  if (oldBtn) oldBtn.remove();

  if (limit < filteredNews.length) {
    const btnWrapper = document.createElement('div');
    btnWrapper.className = 'load-more-news-btn';
    btnWrapper.style.padding = '40px 0';
    btnWrapper.style.textAlign = 'center';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'agenda-event-card__button agenda-event-card__button--outline';
    btn.textContent = 'Carregar mais notícias';
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      section._newsVisibleCount += 3;
      renderArchiveNews(section);
    });
    btnWrapper.appendChild(btn);
    container.appendChild(btnWrapper);
  }
}

function updateArchiveParallax() {
  const sections = document.querySelectorAll('.edition-section');
  sections.forEach(function(section) {
    // Only apply to sections that have a background image set
    if (!section.style.getPropertyValue('--archive-bg')) return;
    
    const rect = section.getBoundingClientRect();
    const winH = window.innerHeight;
    
    if (rect.top < winH && rect.bottom > 0) {
      const yPos = (rect.top * 0.15); // Adjust this factor for more/less intensity
      section.style.setProperty('--parallax-y', yPos + 'px');
    }
  });
}

// ==========================================
// DYNAMIC PAGE BOOTSTRAPPER (DOM INJECTION)
// ==========================================

function loadArquivoPage() {
  const container = document.querySelector('[data-arquivo-list]');
  if (!container) return;

  container.innerHTML = '<p class="agenda-list__empty">A carregar arquivo...</p>';

  fetch('/api/arquivos')
    .then(function (response) {
      if (!response.ok) throw new Error('Erro na rede');
      return response.json();
    })
    .then(function (result) {
      const archives = extractData(result);
      if (!archives || archives.length === 0) {
        container.innerHTML = `
          <div style="text-align: center; padding: 100px 20px; opacity: 0; animation: archiveFadeIn 0.5s ease-out forwards;">
            <style>@keyframes archiveFadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 0.7; transform: translateY(0); } }</style>
            <i class="fas fa-folder-open empty-state__icon empty-state__icon--large" aria-hidden="true"></i>
            <p class="agenda-list__empty" style="margin: 0;">Não existem edições no arquivo.</p>
          </div>`;
        return;
      }

      archives.sort((a, b) => b.year - a.year);
      container.innerHTML = `
        <style>
          .edition-section {
            opacity: 0;
            animation: sectionEntrance 0.7s cubic-bezier(0.2, 0, 0.2, 1) forwards;
            background-size: cover;
            background-position: center;
          }
          @keyframes sectionEntrance {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .edition-section__button { 
            transition: transform 0.3s cubic-bezier(0.2, 0, 0.2, 1), background-color 0.3s ease !important; 
          }
          .edition-section__button:hover { transform: translateY(-2px); background-color: rgba(255, 255, 255, 0.12); }
          .edition-section__button:active { transform: translateY(0) scale(0.95); }
          .edition-section__button--open { transform: rotate(180deg); }
          .edition-section__button--open:hover { transform: rotate(180deg) translateY(2px); }
          .edition-section__button--open:active { transform: rotate(180deg) scale(0.95); }
        </style>`;
      const fragment = document.createDocumentFragment();

      archives.forEach((archive, idx) => {
        const theme = idx % 2 === 0 ? 'navy' : 'orange';
        const section = document.createElement('section');
        section.className = `edition-section edition-section--${theme}`;
        section.dataset.navbarTheme = theme === 'navy' ? 'dark-blue' : theme;
        section.dataset.editionYear = archive.year;
        section.style.animationDelay = Math.min(idx * 0.1, 1.5) + 's';

        if (archive.imageUrl) {
          section.style.setProperty('--archive-bg', `url(${archive.imageUrl.replace(/'/g, '%27')})`);
        }

        // FIX: Replaced isolated sorting buttons with a true, flexible, combinable architectural layout
        section.innerHTML = `
          <button type="button" class="edition-section__button" aria-label="Ver arquivo ${archive.year}" data-edition-toggle="${archive.year}">
            ↓
          </button>
          <div class="edition-section__content">
            <h2 class="edition-section__year">${archive.year}</h2>
            <p class="edition-section__subtitle">${archive.description || ''}</p>
            <div data-archive-container></div>
          </div>
        `;
        fragment.appendChild(section);
      });

      container.appendChild(fragment);
      updateNavbarTheme();
      updateArchiveParallax();
    })
    .catch(function () {
      container.innerHTML = `
        <section class="edition-section edition-section--navy" data-navbar-theme="dark-blue" style="min-height: 80vh; display: flex; align-items: center; justify-content: center; opacity: 1;">
          <div style="text-align: center; color: var(--color-off-white); padding: 40px; animation: archiveFadeIn 0.5s ease-out forwards;">
            <style>@keyframes archiveFadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }</style>
            <i class="fas fa-triangle-exclamation empty-state__icon empty-state__icon--large" aria-hidden="true"></i>
            <h2 class="edition-section__year" style="font-size: 32px; margin-bottom: 16px;">Ops! Algo desafinou.</h2>
            <p class="edition-section__subtitle" style="max-width: 400px; margin: 0 auto 32px; opacity: 0.8;">
              Não foi possível carregar o arquivo de edições neste momento. Por favor, tente recarregar a página.
            </p>
            <button onclick="window.location.reload()" class="agenda-event-card__button agenda-event-card__button--outline" style="color: inherit; border-color: currentColor;">
              Recarregar Arquivo
            </button>
          </div>
        </section>`;
      updateNavbarTheme();
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

    if (session.availableTickets === 0 || session.status === 'sold_out' || session.status === 'soldout' || session.status === 'esgotado') {
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

  var isSoldOut = session.status === 'sold_out' || session.status === 'soldout' || session.status === 'esgotado' || session.availableTickets === 0;

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
    a.textContent = 'Reservar ';

    var arrow = document.createElement('span');
    arrow.className = 'evento-sessoes__button-arrow';
    arrow.innerHTML = '<i class="fas fa-arrow-right" aria-hidden="true"></i>';
    a.appendChild(arrow);

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
  icon.innerHTML = '<i class="fas fa-plus"></i>';
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
  grid.innerHTML = '<p class="schedule__loading">A carregar próximos eventos...</p>';

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

  var heroBg = document.querySelector('[data-evento-hero-bg] img');
  var heroTitle = document.querySelector('[data-evento-hero-title]');
  var heroTags = document.querySelector('[data-evento-hero-tags]');
  var heroBadgeText = document.querySelector('[data-evento-hero-badge-text]');
  var heroMarquee = document.querySelector('[data-evento-hero-marquee]');
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
        document.title = event.title + ' | FIATO';
      }

      if (heroTags && event.direction) {
        heroTags.innerHTML = '';
        var tag1 = document.createElement('span');
        tag1.textContent = 'Música Clássica';
        heroTags.appendChild(tag1);
        var tag2 = document.createElement('span');
        tag2.textContent = event.direction;
        heroTags.appendChild(tag2);
      }

      if (heroBg && event.imageUrl) {
        heroBg.src = event.imageUrl;
        heroBg.alt = event.title || '';
      }

      if (heroBadgeText && event.sessions && event.sessions.length > 0) {
        var firstDate = event.sessions[0].date;
        if (firstDate) {
          var now = new Date();
          var eventDate = new Date(firstDate);
          var diffMs = eventDate - now;
          var diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
          if (diffDays > 1) {
            heroBadgeText.textContent = diffDays + ' dias';
          } else if (diffDays === 1) {
            heroBadgeText.textContent = '1 dia';
          } else if (diffDays === 0) {
            heroBadgeText.textContent = 'Hoje';
          } else {
            heroBadgeText.textContent = 'A decorrer';
          }
        }
      }

      if (heroMarquee && event.title) {
        heroMarquee.innerHTML = '';
        for (var m = 0; m < 6; m++) {
          var mSpan = document.createElement('span');
          mSpan.textContent = event.title;
          heroMarquee.appendChild(mSpan);
        }
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
  icon.innerHTML = '<i class="fas fa-play"></i>';
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

function loadAboutPage() {
  var heroDesc = document.querySelector('[data-sobre-hero-description]');
  if (!heroDesc) return;

  fetch('/api/about-page')
    .then(function (r) { return r.json(); })
    .then(function (result) {
      if (!result.success || !result.data) return;
      var page = result.data;
      if (Object.keys(page).length === 0) return;

      // Hero
      if (page.heroDescription && heroDesc) heroDesc.textContent = page.heroDescription;

      if (page.heroCtaLinks && page.heroCtaLinks.length > 0) {
        var ctasContainer = document.querySelector('[data-sobre-hero-ctas]');
        if (ctasContainer) {
          ctasContainer.innerHTML = '';
          page.heroCtaLinks.forEach(function (cta) {
            var a = document.createElement('a');
            a.href = cta.url || '#';
            a.className = 'editorial-hero__action';
            a.textContent = cta.label || '';
            ctasContainer.appendChild(a);
          });
        }
      }

      // Manifesto
      setTextContent('[data-sobre-manifesto-eyebrow]', page.manifestoEyebrow);
      setTextContent('[data-sobre-manifesto-title]', page.manifestoTitle);
      setTextContent('[data-sobre-manifesto-left]', page.manifestoBodyLeft);
      setTextContent('[data-sobre-manifesto-right]', page.manifestoBodyRight);

      // Marquee
      if (page.marqueeItems && page.marqueeItems.length > 0) {
        var marqueeTrack = document.querySelector('[data-sobre-marquee-track]');
        if (marqueeTrack) {
          marqueeTrack.innerHTML = '';
          for (var m = 0; m < 6; m++) {
            page.marqueeItems.forEach(function (item) {
              var span = document.createElement('span');
              span.className = 'marquee__item';
              var textSpan = document.createElement('span');
              textSpan.className = 'marquee__text';
              textSpan.textContent = item.text || '';
              span.appendChild(textSpan);
              var dot = document.createElement('span');
              dot.className = 'marquee__dot';
              dot.setAttribute('aria-hidden', 'true');
              dot.textContent = '\u2022';
              span.appendChild(dot);
              marqueeTrack.appendChild(span);
            });
          }
        }
      }

      // Edition Feature
      if (page.editionImageUrl) {
        var editionPhoto = document.querySelector('[data-sobre-edition-photo]');
        if (editionPhoto) {
          editionPhoto.style.backgroundImage = 'url(' + page.editionImageUrl + ')';
        }
      }
      setTextContent('[data-sobre-edition-eyebrow]', page.editionEyebrow);
      setTextContent('[data-sobre-edition-year-top]', page.editionYearTop);
      setTextContent('[data-sobre-edition-year-bottom]', page.editionYearBottom);
      setTextContent('[data-sobre-edition-description]', page.editionDescription);

      if (page.editionCtaLabel) {
        var editionCta = document.querySelector('[data-sobre-edition-cta]');
        if (editionCta) {
          editionCta.textContent = page.editionCtaLabel;
          if (page.editionCtaUrl) editionCta.href = page.editionCtaUrl;
        }
      }

      // Team
      setTextContent('[data-sobre-team-eyebrow]', page.teamEyebrow);
      setTextContent('[data-sobre-team-heading]', page.teamHeading);

      if (page.teamMembers && page.teamMembers.length > 0) {
        var teamGrid = document.querySelector('[data-sobre-team-grid]');
        if (teamGrid) {
          teamGrid.innerHTML = '';
          page.teamMembers.sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
          page.teamMembers.forEach(function (member) {
            var memberDiv = document.createElement('div');
            memberDiv.className = 'team__member';
            var photoDiv = document.createElement('div');
            photoDiv.className = 'team__photo' + (member.photoUrl ? '' : ' ph');
            if (member.photoUrl) photoDiv.style.backgroundImage = 'url(' + member.photoUrl + ')';
            if (member.name) photoDiv.setAttribute('aria-label', member.name);
            else photoDiv.setAttribute('aria-label', 'Membro da equipa');
            memberDiv.appendChild(photoDiv);
            teamGrid.appendChild(memberDiv);
          });
        }
      }

      // FAQ
      setTextContent('[data-sobre-faq-eyebrow]', page.faqEyebrow);

      if (page.faqHeading) {
        var faqHeading = document.querySelector('[data-sobre-faq-heading]');
        if (faqHeading) {
          var brIndex = page.faqHeading.indexOf('\\n');
          if (brIndex !== -1) {
            faqHeading.innerHTML = page.faqHeading.substring(0, brIndex) + ' <br /> ' + page.faqHeading.substring(brIndex + 2);
          } else {
            faqHeading.textContent = page.faqHeading;
          }
        }
      }

      if (page.faqItems && page.faqItems.length > 0) {
        var faqList = document.querySelector('[data-sobre-faq-list]');
        if (faqList) {
          faqList.innerHTML = '';
          page.faqItems.forEach(function (faq, index) {
            var li = document.createElement('li');
            li.className = 'faq-list__item' + (index === 0 ? ' faq-list__item--open' : '');

            var trigger = document.createElement('button');
            trigger.type = 'button';
            trigger.className = 'faq-list__trigger';
            trigger.setAttribute('aria-expanded', index === 0 ? 'true' : 'false');
            trigger.setAttribute('data-faq-trigger', '');

            var qSpan = document.createElement('span');
            qSpan.className = 'faq-list__question';
            qSpan.textContent = faq.question || '';
            trigger.appendChild(qSpan);

            var iconSpan = document.createElement('span');
            iconSpan.className = 'faq-list__icon';
            iconSpan.setAttribute('aria-hidden', 'true');
            iconSpan.innerHTML = index === 0 ? '<i class="fas fa-minus"></i>' : '<i class="fas fa-plus"></i>';
            trigger.appendChild(iconSpan);

            li.appendChild(trigger);

            var answerWrap = document.createElement('div');
            answerWrap.className = 'faq-list__answer-wrap';
            if (index !== 0) answerWrap.setAttribute('hidden', '');
            answerWrap.setAttribute('role', 'region');

            var p = document.createElement('p');
            p.className = 'faq-list__answer';
            p.textContent = faq.answer || '';
            answerWrap.appendChild(p);

            li.appendChild(answerWrap);
            faqList.appendChild(li);
          });
        }
      }
    })
    .catch(function () {
      // Fallback: do nothing, keep static HTML
    });
}

function setTextContent(selector, value) {
  if (!value) return;
  var el = document.querySelector(selector);
  if (el) el.textContent = value;
}

// ==========================================
// LATEST ARQUIVO FEATURES (SOBRE NÓS PAGE)
// ==========================================
function loadLatestArquivoFeatures() {
  const container = document.querySelector('[data-latest-archives-container]');
  if (!container) return;

  fetch('/api/arquivo/latest')
    .then(response => {
      if (!response.ok) throw new Error('Falha ao carregar arquivos recentes.');
      return response.json();
    })
    .then(latestArchives => {
      if (!latestArchives || latestArchives.length === 0) return;

      // 1. Clear only inner static content
      container.innerHTML = '';
      const fragment = document.createDocumentFragment();

      latestArchives.forEach(item => {
        // 2. Year splitting logic (Defensive)
        const yearStr = item.year ? String(item.year) : '0000';
        const yearTop = yearStr.length >= 4 ? yearStr.slice(0, 2) : '20';
        const yearBottom = yearStr.length >= 4 ? yearStr.slice(2, 4) : '--';
        
        const safeImg = item.imageUrl ? item.imageUrl.replace(/'/g, '%27') : 'assets/img-contactos.png';

        const section = document.createElement('section');
        section.className = 'edition-feature';
        section.dataset.navbarTheme = 'light'; // Requirement: keep tracking intact

        // 3. Inject Template
        section.innerHTML = `
          <div class="edition-feature__photo ph" data-sobre-edition-photo aria-hidden="true" style="background-image: url('${safeImg}');"></div>
          <div class="edition-feature__content">
            <span class="edition-feature__eyebrow" data-sobre-edition-eyebrow>${item.title || 'Arquivo FIATO'}</span>
            <div class="edition-feature__year">
              <span class="edition-feature__year-top" data-sobre-edition-year-top>${yearTop}</span>
              <span class="edition-feature__year-bottom" data-sobre-edition-year-bottom>${yearBottom}</span>
            </div>
            <p class="edition-feature__description" data-sobre-edition-description>${item.description || ''}</p>
            <a href="arquivo.html?id=${item._id}" class="edition-feature__cta">Consultar Arquivo</a>
          </div>`;
        
        fragment.appendChild(section);
      });

      container.appendChild(fragment);
      // 4. Force navbar re-sync after DOM update
      updateNavbarTheme();
    })
    .catch(error => console.error('🔴 Erro ao carregar os últimos arquivos:', error));
}


window.addEventListener('scroll', function() {
  updateNavbarTheme();
  updateArchiveParallax();
});
window.addEventListener('resize', () => {
  updateNavbarTheme();
  updateArchiveParallax();

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


// Wrap page-specific loaders in DOMContentLoaded for robust execution
document.addEventListener('DOMContentLoaded', () => {
  // Loaders for index.html
  if (document.querySelector('.home')) {
    loadHomeEvents();
    loadHomeHeroEvent();
    loadHomePress();
    loadInstagramPosts();
  }

  // Loaders for agenda.html
  if (document.querySelector('.agenda-page')) {
    loadAgendaEvents();
  }

  // Loaders for arquivo.html
  if (document.querySelector('.edicoes-page')) { // .edicoes-page is the main class for arquivo.html
    loadArquivoPage();
  }

  // Loaders for evento.html
  if (document.querySelector('.evento-page')) {
    loadEventoPage();
  }

  // Loaders for bilhetes.html
  if (document.querySelector('.bilhetes-page')) {
    loadTicketEvents();
  }

  // Loaders for sobre-nos.html
  if (document.querySelector('.sobre-nos')) {
    loadAboutPage();
    loadLatestArquivoFeatures();
  }

  // Initial navbar theme update after all content might have loaded
  updateNavbarTheme();
});

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

// Footer animation
(function initFooterAnimation() {
  var footerEl = document.querySelector('.footer');
  if (!footerEl) return;

  // Generate decorative bars with h-start (blue state) and h-end (orange state)
  (function generateFooterBars() {
    var groups = document.querySelectorAll('.footer__bars-group');
    if (!groups.length) return;
    var barCount = window.innerWidth < 560 ? 16 : 36;
    groups.forEach(function (group, groupIndex) {
      var shape = group.getAttribute('data-shape') || 'center';
      for (var i = 0; i < barCount; i++) {
        var t = i / (barCount - 1);
        var hStart, hEnd;
        if (shape === 'left') {
          hStart = Math.cos(t * Math.PI * 0.5);
          if (hStart < 0.04) hStart = 0.04;
          hEnd = Math.sin(t * Math.PI);
        } else if (shape === 'right') {
          hStart = Math.sin(t * Math.PI * 0.5);
          if (hStart < 0.04) hStart = 0.04;
          hEnd = Math.sin(t * Math.PI);
        } else {
          hStart = 0.5 + 0.5 * Math.sin(t * Math.PI);
          if (hStart < 0.04) hStart = 0.04;
          hEnd = Math.sin(t * Math.PI);
        }
        if (hEnd < 0.04) hEnd = 0.04;
        var span = document.createElement('span');
        span.style.setProperty('--h-start', hStart);
        span.style.setProperty('--h-end', hEnd);
        span.style.setProperty('--delay', ((groupIndex * 0.12) + (i * 0.022)) + 's');
        group.appendChild(span);
      }
    });
  }());

  var footerIo = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        footerEl.classList.add('is-visible');
        footerIo.unobserve(footerEl);
      }
    });
  }, { threshold: 0.7 });
  footerIo.observe(footerEl);
}());

window.addEventListener('scroll', function() {
  updateNavbarTheme();
  updateArchiveParallax();
});
window.addEventListener('resize', () => {
  updateNavbarTheme();
  updateArchiveParallax();

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
loadArquivoPage();
loadEventoPage();
loadTicketEvents();
loadInstagramPosts();
loadAboutPage();
loadLatestArquivoFeatures();
