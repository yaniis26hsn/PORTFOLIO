const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

document.documentElement.classList.add('js');

/* ---------- Scroll: progress bar, nav state, timeline draw ---------- */

const nav = $('#nav');
const progressBar = $('#progress');
const timeline = $('.timeline');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

let ticking = false;

const onScroll = () => {
  const scrollTop = window.scrollY;
  const maxHeight = document.documentElement.scrollHeight - window.innerHeight;

  progressBar.style.transform = `scaleX(${maxHeight > 0 ? scrollTop / maxHeight : 0})`;
  nav.classList.toggle('is-scrolled', scrollTop > 24);

  if (timeline && !reducedMotion) {
    const rect = timeline.getBoundingClientRect();
    const progress = Math.min(1, Math.max(0, (window.innerHeight * 0.8 - rect.top) / rect.height));
    timeline.style.setProperty('--draw', progress);
  }

  ticking = false;
};

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(onScroll);
    ticking = true;
  }
}, { passive: true });

onScroll();

/* ---------- Animated hero name (letters) ---------- */

$$('.hero-name .line').forEach((line, lineIndex) => {
  const text = line.textContent;
  line.textContent = '';
  line.style.setProperty('--lb', `${lineIndex * 0.2}s`);

  [...text].forEach((char, i) => {
    const span = document.createElement('span');
    span.className = 'char';
    span.style.setProperty('--i', i);
    span.textContent = char;
    line.appendChild(span);
  });
});

/* ---------- Reveal on scroll ---------- */

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

$$('[data-reveal]').forEach((el) => revealObserver.observe(el));

/* ---------- Active nav link ---------- */

const activeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = `#${entry.target.id}`;
      $$('.nav-links a, .nav-mobile-links a').forEach((a) => {
        a.classList.toggle('is-active', a.getAttribute('href') === id);
      });
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);

$$('main section[id]').forEach((section) => activeObserver.observe(section));

/* ---------- Mobile menu ---------- */

const navToggle = $('#nav-toggle');

navToggle.addEventListener('click', () => {
  const open = document.body.classList.toggle('menu-open');
  navToggle.setAttribute('aria-expanded', String(open));
});

$$('.nav-mobile-links a, .logo').forEach((link) => {
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

/* ---------- Custom cursor ---------- */

if (finePointer && !reducedMotion) {
  document.body.classList.add('custom-cursor');

  const dot = $('.cursor-dot');
  const ring = $('.cursor-ring');
  let tx = window.innerWidth / 2;
  let ty = window.innerHeight / 2;
  let rx = tx;
  let ry = ty;

  document.addEventListener('mousemove', (e) => {
    tx = e.clientX;
    ty = e.clientY;
    dot.style.transform = `translate(${tx}px, ${ty}px)`;
  });

  document.addEventListener('mouseover', (e) => {
    ring.classList.toggle('is-hover', !!e.target.closest('a, button'));
  });

  const lerp = () => {
    rx += (tx - rx) * 0.16;
    ry += (ty - ry) * 0.16;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(lerp);
  };

  requestAnimationFrame(lerp);
}

/* ---------- Magnetic elements ---------- */

if (finePointer && !reducedMotion) {
  $$('.magnetic').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const mx = e.clientX - rect.left - rect.width / 2;
      const my = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${mx * 0.24}px, ${my * 0.24}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}

/* ---------- Pointer-tracked glow on skill cards ---------- */

$$('.skill-card').forEach((card) => {
  card.addEventListener('pointermove', (e) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--gx', `${e.clientX - rect.left}px`);
    card.style.setProperty('--gy', `${e.clientY - rect.top}px`);
  });
});
