const navLinks = [...document.querySelectorAll('.nav-link')];
const sections = [
  ...document.querySelectorAll('.section'),
  ...navLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean),
];

function setActiveNav(id) {
  navLinks.forEach((link) => {
    link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
  });
}

const navObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible?.target?.id) {
      setActiveNav(visible.target.id);
    }
  },
  { rootMargin: '-35% 0px -50% 0px', threshold: [0.12, 0.35, 0.6] }
);

navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean)
  .forEach((section) => navObserver.observe(section));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
);

document.querySelectorAll('.section').forEach((section) => {
  revealObserver.observe(section);
});

const themeToggle = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('about-theme');

function syncThemeLabel() {
  if (!themeToggle) return;
  themeToggle.textContent =
    document.body.dataset.theme === 'dark' ? '☀️ 浅色模式' : '🌙 深色模式';
}

if (savedTheme === 'dark') {
  document.body.dataset.theme = 'dark';
}
syncThemeLabel();

themeToggle?.addEventListener('click', () => {
  const isDark = document.body.dataset.theme === 'dark';
  if (isDark) {
    delete document.body.dataset.theme;
    localStorage.setItem('about-theme', 'light');
  } else {
    document.body.dataset.theme = 'dark';
    localStorage.setItem('about-theme', 'dark');
  }
  syncThemeLabel();
});

document.getElementById('print-btn')?.addEventListener('click', () => {
  window.print();
});

/* ── Skill bar animation ── */
const skillBarObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-bar').forEach((bar, i) => {
          setTimeout(() => bar.classList.add('is-animated'), i * 100);
        });
        skillBarObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll('.skill-group').forEach((group) => {
  skillBarObserver.observe(group);
});

/* ── Back-to-top button ── */
const backToTop = document.getElementById('back-to-top');
if (backToTop) {
  window.addEventListener(
    'scroll',
    () => {
      backToTop.classList.toggle('is-visible', window.scrollY > 400);
    },
    { passive: true }
  );
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
