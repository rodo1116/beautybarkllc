// Basic interactivity for menu, reviews, year, and booking modal
const navList = document.getElementById('navList');
const menuToggle = document.getElementById('menuToggle');
const yearEl = document.getElementById('year');
const openBooking = document.getElementById('openBooking');
const bookingModal = document.getElementById('bookingModal');
const progress = document.querySelectorAll('.progress li');
const steps = [...document.querySelectorAll('.booking-step')];
const proceedLink = document.getElementById('proceedLink');

// ---- Config: replace with your scheduler of choice ----
/**
 * If you use Square Appointments:
 *  1) Create your public booking link in Square.
 *  2) Replace BOOKING_URL with your link.
 *  3) (Optional) Add separate links per service/staff in MAPS below.
 *
 * If using a WP plugin (e.g., Amelia), set BOOKING_URL = '/book' and place the Amelia shortcode on that page.
 */
const BOOKING_URL = 'https://square.site/book/YOUR-SQUARE-BOOKING-LINK';
const SERVICE_LINKS = {
  'Bath & Brush': BOOKING_URL,
  'Full Groom': BOOKING_URL,
  'De-shedding': BOOKING_URL,
  'Puppy Intro': BOOKING_URL,
  'Nail Trim': BOOKING_URL
};
const STAFF_LINKS = {
  'Any': '',
  'Sarah De Leon': '',
  'Alex': '',
  'Mia': ''
};

// Mobile menu
if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    navList.classList.toggle('show');
  });
}

// Year
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Simple review rotator
const reviewEls = document.querySelectorAll('.review');
let reviewIndex = 0;
setInterval(() => {
  reviewEls[reviewIndex].classList.remove('active');
  reviewIndex = (reviewIndex + 1) % reviewEls.length;
  reviewEls[reviewIndex].classList.add('active');
}, 4500);

// Booking modal logic
function openModal() {
  if (typeof bookingModal.showModal === 'function') {
    bookingModal.showModal();
  } else {
    // Fallback for Safari iOS < 15
    bookingModal.setAttribute('open', '');
  }
  goToStep(1);
}
function closeModal() {
  if (typeof bookingModal.close === 'function') bookingModal.close();
  else bookingModal.removeAttribute('open');
}

function goToStep(stepNum) {
  steps.forEach((el) => el.hidden = true);
  const current = document.querySelector(`.booking-step[data-step="${stepNum}"]`);
  if (current) current.hidden = false;

  progress.forEach((li, i) => {
    li.classList.toggle('active', i === stepNum - 1);
  });

  if (stepNum === 3) {
    // Build proceed link using selected service & groomer (if you have staff-specific links, map them here)
    const form = bookingModal.querySelector('form');
    const service = form.querySelector('input[name="service"]:checked')?.value || '';
    const groomer = form.querySelector('input[name="groomer"]:checked')?.value || 'Any';

    // Prioritize staff-specific link if available, else use service link, else fall back to default BOOKING_URL
    let url = (STAFF_LINKS[groomer] || SERVICE_LINKS[service] || BOOKING_URL);

    proceedLink.href = url;
  }
}

// Next/back handlers
bookingModal?.addEventListener('click', (e) => {
  const t = e.target;
  if (!(t instanceof HTMLElement)) return;

  if (t.classList.contains('next-step')) {
    const current = steps.find((s) => !s.hidden);
    const stepNum = Number(current?.dataset.step || 1);
    if (stepNum === 1) {
      // Require a service selection
      const selected = bookingModal.querySelector('input[name="service"]:checked');
      if (!selected) return;
    }
    goToStep(Math.min(3, stepNum + 1));
  }
  if (t.classList.contains('prev-step')) {
    const current = steps.find((s) => !s.hidden);
    const stepNum = Number(current?.dataset.step || 1);
    goToStep(Math.max(1, stepNum - 1));
  }
  if (t.value === 'cancel') {
    closeModal();
  }
});

// Open modal via buttons
openBooking?.addEventListener('click', openModal);
document.querySelectorAll('.book-button').forEach(btn => {
  btn.addEventListener('click', () => {
    // Preselect service from card button
    const service = btn.getAttribute('data-service');
    const input = bookingModal.querySelector(`input[name="service"][value="${service}"]`);
    if (input) input.checked = true;
    openModal();
  });
});

// Close modal on Esc (for fallback open attribute)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && bookingModal?.hasAttribute('open')) {
    closeModal();
  }
});
