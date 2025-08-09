// Basic interactive behaviour: nav toggle, year, animations
document.addEventListener('DOMContentLoaded', function () {
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  const yearEl = document.getElementById('year');

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  navToggle && navToggle.addEventListener('click', function () {
    if (!mainNav) return;
    if (mainNav.style.display === 'block') {
      mainNav.style.display = '';
      navToggle.textContent = '☰';
    } else {
      mainNav.style.display = 'block';
      navToggle.textContent = '✕';
    }
  });

  // Reduce data mode video pause
  try {
    const bgVideo = document.getElementById('bgVideo');
    if (window.matchMedia && window.matchMedia('(prefers-reduced-data: reduce)').matches) {
      bgVideo && bgVideo.pause();
    }
  } catch (err) {}

  // Animate hero on load
  const heroInner = document.querySelector('.hero-inner');
  if (heroInner) {
    setTimeout(() => heroInner.classList.add('animated'), 200);
  }

  // Scroll reveal animations
  const revealElements = document.querySelectorAll('.section, .project, .card, .cap-list li, .contact-form, .contact-info');
  const revealOnScroll = () => {
    const triggerBottom = window.innerHeight * 0.85;
    revealElements.forEach(el => {
      const boxTop = el.getBoundingClientRect().top;
      if (boxTop < triggerBottom) {
        el.classList.add('visible');
      }
    });
  };
  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll();
});


