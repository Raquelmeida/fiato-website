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

const countdownTarget = Date.now()
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
