// Mobile menu, cookie banner, and year
const navList = document.getElementById('navList');
const menuToggle = document.getElementById('menuToggle');
const yearEl = document.getElementById('year');
const cookieBanner = document.getElementById('cookieBanner');
const acceptCookies = document.getElementById('acceptCookies');

// Ensure fallback style is removed after CSS loads
window.addEventListener('load', () => {
  const fb = document.getElementById('fallback-colors');
  if (fb) fb.remove();
});

// Mobile menu
menuToggle?.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!expanded));
  navList?.classList.toggle('show');
});

// Year
yearEl && (yearEl.textContent = new Date().getFullYear());

// Cookie banner
try {
  const accepted = localStorage.getItem('beautybark_cookies');
  if (!accepted) cookieBanner?.removeAttribute('hidden');
  acceptCookies?.addEventListener('click', () => {
    localStorage.setItem('beautybark_cookies', 'yes');
    cookieBanner?.setAttribute('hidden', '');
  });
} catch(e){ /* storage may be blocked */ }
