const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const header = document.querySelector('header');

hamburger.addEventListener('click', () => {
  // Toggle nav menu
  navLinks.classList.toggle('expanded');

  // Toggle "open" state on hamburger to animate lines
  hamburger.classList.toggle('open');

  // Toggle header state for full-width mobile divider line.
  header?.classList.toggle('mobile-menu-open');
});