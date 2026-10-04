/* ============================================================
   DH TECH AGENCY — Main JavaScript
   navigation, reveal-on-scroll, faq, counters
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Sticky header shadow ---------- */
  const header = document.querySelector('.site-header');
  function onScroll() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 20);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile navigation ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('visible'));
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach((item) => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    if (!q || !a) return;
    q.addEventListener('click', () => {
      const isOpen = item.classList.toggle('open');
      a.style.maxHeight = isOpen ? a.scrollHeight + 'px' : '0px';
      q.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-count'), 10);
          const suffix = el.getAttribute('data-suffix') || '';
          const duration = 1600;
          const start = performance.now();
          function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target) + suffix;
            if (progress < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
          cio.unobserve(el);
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((el) => cio.observe(el));
  }

  /* ---------- Active nav link highlight ---------- */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach((a) => {
    const href = a.getAttribute('href');
    if (href === path) a.classList.add('active');
  });

/* ---------- Footer year ---------- */
  const yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  document.addEventListener('DOMContentLoaded', function() {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu-mobile');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
      this.classList.toggle('open');
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      this.setAttribute('aria-expanded', isOpen);
    });
    
    // Fermer le menu quand on clique sur un lien
    document.querySelectorAll('.nav-links-mobile a').forEach(link => {
      link.addEventListener('click', function() {
        navToggle.classList.remove('open');
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
});

/* ---------- Hero slider synchronisé (image + texte + CTA) ---------- */
  const heroEl = document.querySelector('#hero');
  if (heroEl) {
    const slides = Array.from(heroEl.querySelectorAll('.hero-slide'));
    const titleEl = document.getElementById('hero-title');
    const descEl = document.getElementById('hero-desc');
    const actionsEl = document.getElementById('hero-actions');
    const dotsEl = heroEl.querySelector('.hero-dots');
    const prevBtn = heroEl.querySelector('.hero-arrow-prev');
    const nextBtn = heroEl.querySelector('.hero-arrow-next');

    // Données structurées des 6 slides (image + titre + description + CTA)
    const heroSlides = [
      {
        image: 'assets/hero/hero-marketing.svg',
        title: 'Nous transformons vos ambitions en <span class="highlight">solutions digitales performantes</span>.',
        description: 'Nous accompagnons les entreprises dans leur transformation digitale avec des stratégies, des outils et des solutions conçus pour accélérer leur croissance.',
primaryCTA: { label: 'Demander un devis', href: 'pages/devis.html', cls: 'btn btn-primary btn-lg' },
        secondaryCTA: { label: 'Parler à un expert', href: 'https://wa.me/22370191624', cls: 'btn btn-outline-light btn-lg' }
      },
      {
        image: 'assets/hero/hero-web.svg',
        title: 'Donnez à votre entreprise une <span class="highlight">présence digitale</span> à la hauteur de vos ambitions',
        description: 'Sites vitrines, plateformes web et solutions e-commerce : nous concevons des expériences digitales modernes, rapides, intuitives et pensées pour convertir vos visiteurs en clients.',
        primaryCTA: { label: 'Découvrir nos solutions', href: 'pages/services.html', cls: 'btn btn-primary btn-lg' },
        secondaryCTA: { label: 'Voir nos réalisations', href: 'pages/realisations.html', cls: 'btn btn-outline-light btn-lg' }
      },
      {
        image: 'assets/hero/hero-social.svg',
        title: 'Faites de votre visibilité digitale un <span class="highlight">véritable moteur de croissance</span>',
        description: 'Nous développons des stratégies de marketing digital adaptées à votre marché pour renforcer votre visibilité, attirer les bons prospects et développer durablement votre activité.',
        primaryCTA: { label: 'Développer ma visibilité', href: 'pages/services/marketing-digital.html', cls: 'btn btn-primary btn-lg' },
secondaryCTA: { label: 'Parler à un expert', href: 'https://wa.me/22370191624', cls: 'btn btn-outline-light btn-lg' }
      },
      {
        image: 'assets/hero/hero-ia.svg',
        title: 'L<span class="highlight">&#39;intelligence artificielle</span> au service de votre performance',
        description: 'Exploitez la puissance de l\u2019IA et de l\u2019automatisation pour gagner du temps, optimiser vos processus et créer de nouvelles opportunités de croissance.',
        primaryCTA: { label: 'Découvrir l\u2019IA', href: 'pages/services/automatisation-ia.html', cls: 'btn btn-primary btn-lg' },
secondaryCTA: { label: 'Échanger avec un expert', href: 'https://wa.me/22370191624', cls: 'btn btn-outline-light btn-lg' }
      },
      {
        image: 'assets/hero/hero-data.svg',
        title: 'Une <span class="highlight">stratégie digitale</span> pensée pour faire grandir votre entreprise',
        description: 'De l\u2019audit à la mise en œuvre, nous vous accompagnons avec une approche stratégique, concrète et orientée résultats pour transformer vos défis numériques en opportunités.',
        primaryCTA: { label: 'Faire un diagnostic', href: 'pages/devis.html', cls: 'btn btn-primary btn-lg' },
        secondaryCTA: { label: 'Découvrir notre accompagnement', href: 'pages/services.html', cls: 'btn btn-outline-light btn-lg' }
      },
      {
        image: 'assets/hero/hero-growth.svg',
        title: 'Construisons ensemble le digital qui <span class="highlight">fera avancer votre entreprise</span>',
        description: 'DH TECH AGENCY combine technologie, créativité, stratégie et intelligence artificielle pour créer des solutions digitales utiles, innovantes et adaptées aux réalités des entreprises.',
primaryCTA: { label: 'Démarrer un projet', href: 'pages/devis.html', cls: 'btn btn-primary btn-lg' },
        secondaryCTA: { label: 'Parler à un expert', href: 'https://wa.me/22370191624', cls: 'btn btn-outline-light btn-lg' }
      }
    ];

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const AUTOPLAY_MS = 5000; // 5s par slide
    let current = 0;
    let timer = null;
    let isPaused = false;
    let touchX = 0;
    let touchY = 0;

    function renderContent(index) {
      const slide = heroSlides[index];
      titleEl.innerHTML = slide.title;
      descEl.textContent = slide.description;
      actionsEl.innerHTML =
        '<a href="' + slide.primaryCTA.href + '" class="' + slide.primaryCTA.cls + '">' + slide.primaryCTA.label + '</a>' +
        '<a href="' + slide.secondaryCTA.href + '" class="' + slide.secondaryCTA.cls + '">' + slide.secondaryCTA.label + '</a>';
      // Relance l'animation d'entrée échelonnée
      titleEl.classList.remove('hero-anim');
      descEl.classList.remove('hero-anim');
      actionsEl.classList.remove('hero-anim');
      void titleEl.offsetWidth; // reflow pour relancer l'animation
      titleEl.classList.add('hero-anim');
      descEl.classList.add('hero-anim');
      actionsEl.classList.add('hero-anim');
    }

    function goTo(index) {
      const total = slides.length;
      const next = (index + total) % total;
      if (next === current) return;
      slides.forEach((s, i) => {
        s.classList.toggle('active', i === next);
        s.style.zIndex = i === next ? 2 : 1;
      });
      current = next;
      renderContent(current);
      updateDots();
      resetTimer();
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function buildDots() {
      if (!dotsEl) return;
      dotsEl.innerHTML = '';
      slides.forEach((s, i) => {
        const dot = document.createElement('button');
        dot.className = 'hero-dot';
        dot.setAttribute('type', 'button');
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', 'Aller à la slide ' + (i + 1));
        dot.addEventListener('click', () => goTo(i));
        dotsEl.appendChild(dot);
      });
      updateDots();
    }

    function updateDots() {
      if (!dotsEl) return;
      Array.from(dotsEl.children).forEach((d, i) => {
        d.classList.toggle('active', i === current);
        d.setAttribute('aria-selected', i === current ? 'true' : 'false');
      });
    }

    function startAutoplay() {
      if (reduceMotion) return; // pas d'autoplay si mouvement réduit
      stopAutoplay();
      timer = setInterval(next, AUTOPLAY_MS);
    }
    function stopAutoplay() {
      if (timer) { clearInterval(timer); timer = null; }
    }
    function resetTimer() {
      if (isPaused || reduceMotion) return;
      startAutoplay();
    }

    // Événements
    if (prevBtn) prevBtn.addEventListener('click', prev);
    if (nextBtn) nextBtn.addEventListener('click', next);
    if (heroEl) {
      heroEl.addEventListener('mouseenter', () => { isPaused = true; stopAutoplay(); });
      heroEl.addEventListener('mouseleave', () => { isPaused = false; startAutoplay(); });
      // Clavier
      heroEl.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
      });
      // Swipe tactile
      heroEl.addEventListener('touchstart', (e) => {
        touchX = e.changedTouches[0].clientX;
        touchY = e.changedTouches[0].clientY;
      }, { passive: true });
      heroEl.addEventListener('touchend', (e) => {
        const dx = e.changedTouches[0].clientX - touchX;
        const dy = e.changedTouches[0].clientY - touchY;
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
          if (dx < 0) next(); else prev();
        }
      }, { passive: true });
    }
    // Réduit l'autoplay quand le onglet estmasqué pour économiser les ressources
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopAutoplay(); else if (!isPaused && !reduceMotion) startAutoplay();
    });

    // Initialisation
    slides.forEach((s, i) => {
      s.classList.toggle('active', i === 0);
      s.style.zIndex = i === 0 ? 2 : 1;
    });
    buildDots();
    renderContent(0);
    startAutoplay();
  }
})();
