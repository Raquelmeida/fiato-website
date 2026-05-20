const navbar = document.querySelector('.navbar');
const menuToggle = document.querySelector('.navbar__toggle');
const countdownDays = document.querySelector('[data-countdown-days]');
const countdownHours = document.querySelector('[data-countdown-hours]');
const countdownMinutes = document.querySelector('[data-countdown-minutes]');
const agendaFilterButtons = document.querySelectorAll('[data-agenda-sort]');

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

if (menuToggle && navbar) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navbar.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
  });
}

agendaFilterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    agendaFilterButtons.forEach((filterButton) => {
      filterButton.classList.remove('is-active');
    });

    button.classList.add('is-active');
    sortAgenda(button.dataset.agendaSort);
  });
});

window.addEventListener('scroll', updateNavbarTheme);
window.addEventListener('resize', updateNavbarTheme);

updateNavbarTheme();
updateCountdown();
setInterval(updateCountdown, 1000);
