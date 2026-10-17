const nav = document.getElementById('nav');
const navToggle = document.getElementById('nav-toggle');
const progressBar = document.getElementById('progress');

const onScroll = () => {
  const scrollTop = window.scrollY;
  const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.transform = `scaleX(${maxHeight > 0 ? scrollTop / maxHeight : 0})`;
  nav.classList.toggle('is-scrolled', scrollTop > 24);
};

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

navToggle.addEventListener('click', () => {
  const open = document.body.classList.toggle('menu-open');
  navToggle.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.nav-mobile-links a, .logo').forEach((link) => {
  link.addEventListener('click', () => {
    document.body.classList.remove('menu-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && document.body.classList.contains('menu-open')) {
    document.body.classList.remove('menu-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -48px 0px' }
);

document.querySelectorAll('[data-reveal]').forEach((el) => revealObserver.observe(el));

const sections = document.querySelectorAll('main section[id]');
const activeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = `#${entry.target.id}`;
      document
        .querySelectorAll('.nav-links a, .nav-mobile-links a')
        .forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === id));
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);

sections.forEach((section) => activeObserver.observe(section));
