// ─── NAV TOGGLE ───────────────────────────────────────────────────────────────
const hamburger = document.querySelector('.hamburger');
const navLinks  = document.querySelector('.nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}

// ─── ACTIVE NAV LINK ──────────────────────────────────────────────────────────
(function markActive() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

// ─── INTERSECTION OBSERVER FADE-IN ────────────────────────────────────────────
const fadeTargets = document.querySelectorAll('.service-card, .why-card, .service-full-card, .value-item, .info-card');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

fadeTargets.forEach(el => observer.observe(el));

// ─── CONTACT FORM VALIDATION ──────────────────────────────────────────────────
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const fields = [
      { id: 'name',    rules: ['required'] },
      { id: 'phone',   rules: ['required', 'phone'] },
      { id: 'email',   rules: ['required', 'email'] },
      { id: 'service', rules: ['required'] },
      { id: 'message', rules: ['required'] },
    ];

    fields.forEach(({ id, rules }) => {
      const input = document.getElementById(id);
      const err   = document.getElementById(id + 'Err');
      if (!input || !err) return;

      input.classList.remove('error');
      err.classList.remove('show');
      err.textContent = '';

      let msg = '';

      if (rules.includes('required') && !input.value.trim()) {
        msg = 'This field is required.';
      } else if (rules.includes('email') && input.value.trim()) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
          msg = 'Enter a valid email address.';
        }
      } else if (rules.includes('phone') && input.value.trim()) {
        if (!/^[+]?[\d\s\-()]{7,15}$/.test(input.value.trim())) {
          msg = 'Enter a valid phone number.';
        }
      }

      if (msg) {
        input.classList.add('error');
        err.textContent = msg;
        err.classList.add('show');
        valid = false;
      }
    });

    if (valid) {
      contactForm.reset();
      showToast("Message sent! We'll be in touch shortly.");
      const success = document.getElementById('formSuccess');
      if (success) success.classList.remove('show');
    }
  });

  // Clear error on input
  contactForm.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('input', () => {
      el.classList.remove('error');
      const err = document.getElementById(el.id + 'Err');
      if (err) err.classList.remove('show');
    });
  });
}

// ─── GALLERY FILTER ───────────────────────────────────────────────────────────
const filterBtns  = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const cat = btn.dataset.filter;

    galleryItems.forEach(item => {
      const match = cat === 'all' || item.dataset.category === cat;
      item.style.display = match ? '' : 'none';
    });
  });
});

// ─── LIGHTBOX ─────────────────────────────────────────────────────────────────
const lightbox      = document.getElementById('lightbox');
const lbIcon        = document.getElementById('lbIcon');
const lbTitle       = document.getElementById('lbTitle');
const lbCategory    = document.getElementById('lbCategory');
const lbClose       = document.getElementById('lbClose');

if (lightbox) {
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      lbIcon.textContent     = item.dataset.icon || '🏗️';
      lbTitle.textContent    = item.dataset.title || 'Project';
      lbCategory.textContent = item.dataset.category?.toUpperCase() || '';
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (lbClose) lbClose.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}

// ─── SCROLL PROGRESS BAR ──────────────────────────────────────────────────────
const scrollBar = document.getElementById('scrollProgress');
if (scrollBar) {
  window.addEventListener('scroll', () => {
    const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    scrollBar.style.width = pct + '%';
  }, { passive: true });
}

// ─── BACK TO TOP ──────────────────────────────────────────────────────────────
const btt = document.getElementById('backToTop');
if (btt) {
  window.addEventListener('scroll', () => {
    btt.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ─── ANIMATED STAT COUNTERS ───────────────────────────────────────────────────
document.querySelectorAll('.stat-number').forEach(el => {
  const target = parseInt(el.textContent);
  if (isNaN(target)) return;
  const suffix = el.textContent.replace(/[0-9]/g, '');
  let started = false;
  const cObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !started) {
      started = true;
      let count = 0;
      const step = Math.ceil(target / 60);
      const interval = setInterval(() => {
        count = Math.min(count + step, target);
        el.textContent = count + suffix;
        if (count >= target) clearInterval(interval);
      }, 16);
    }
  });
  cObs.observe(el);
});

// ─── FAQ ACCORDION ────────────────────────────────────────────────────────────
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ─── TOAST NOTIFICATION ───────────────────────────────────────────────────────
function showToast(msg, color = '#16a34a') {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.style.background = color;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3500);
}

// ─── TRANSPARENT NAVBAR (home page only) ──────────────────────────────────────
if (document.body.classList.contains('home-page')) {
  const nav = document.querySelector('.navbar');
  const onNavScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onNavScroll, { passive: true });
  onNavScroll();
}

// ─── STATS BAR SLIDE-UP ───────────────────────────────────────────────────────
const statsBar = document.querySelector('.stats-bar');
if (statsBar) {
  const sObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      statsBar.classList.add('in-view');
      sObs.disconnect();
    }
  }, { threshold: 0.1 });
  sObs.observe(statsBar);
}
