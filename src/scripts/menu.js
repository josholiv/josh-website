const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  // Toggle nav menu
  navLinks.classList.toggle('expanded');

  // Toggle "open" state on hamburger to animate lines
  hamburger.classList.toggle('open');
});