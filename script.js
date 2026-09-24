/* ============================================================
   PIROUETTE — Animations & interactions
   1. Slideshow hero
   2. Claim mot par mot au chargement
   3. Logo pirouette à l'entrée
   4. Reveal au scroll (titres + sections)
   5. Parallaxe léger sur les patterns
   6. Hover cartes pizzas & producteurs
   7. Nav shadow au scroll
   8. Burger menu mobile
============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     0. BANQUE DE PATTERNS — pioché au hasard à chaque
        chargement, sans répétition tant qu'il reste des
        patterns disponibles (hero + transitions de section)
  ---------------------------------------------------------- */
  // Patterns AVEC logo — utilisés uniquement dans le hero
  const HERO_PATTERNS = [
    { src: 'assets/pattern-tomate-rouge-logo.webp',   color: '#CC1B25' },
    { src: 'assets/pattern-tomate-verte-logo.webp',   color: '#4A7A00' },
    { src: 'assets/pattern-brocolis-logo.webp',        color: '#2D7A1F' },
    { src: 'assets/pattern-potimarron-logo.webp',      color: '#C85A10' },
    { src: 'assets/pattern-coppa-logo.webp',           color: '#8B1A1A' },
    { src: 'assets/pattern-fromage-bleu-logo.webp',    color: '#3D6070' },
    { src: 'assets/pattern-fromage-tomme-logo.webp',   color: '#7A6800' },
  ];

  // Patterns SANS logo — utilisés pour les transitions de section
  const ALL_PATTERNS = [
    { src: 'assets/pattern-tomate.webp',          color: '#C41E1E' },
    { src: 'assets/pattern-tomate-rouge.webp',    color: '#CC1B25' },
    { src: 'assets/pattern-tomate-verte.webp',    color: '#4A7A00' },
    { src: 'assets/pattern-brocolis.webp',         color: '#2D7A1F' },
    { src: 'assets/pattern-potimarron.webp',       color: '#C85A10' },
    { src: 'assets/pattern-coppa.webp',            color: '#8B1A1A' },
    { src: 'assets/pattern-jambon.webp',           color: '#A83020' },
    { src: 'assets/pattern-fromage.webp',          color: '#5A4A38' },
    { src: 'assets/pattern-fromage-bleu.webp',     color: '#3D6070' },
    { src: 'assets/pattern-fromage-tomme.webp',    color: '#7A6800' },
  ];

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Pool hero (avec logo)
  const heroPool = shuffle(HERO_PATTERNS);
  function nextHeroPattern() {
    if (heroPool.length === 0) heroPool.push(...shuffle(HERO_PATTERNS));
    return heroPool.pop();
  }

  // Pool section (sans logo)
  const patternPool = shuffle(ALL_PATTERNS);
  function nextPattern() {
    if (patternPool.length === 0) patternPool.push(...shuffle(ALL_PATTERNS));
    return patternPool.pop();
  }

  /* ----------------------------------------------------------
     1. PATTERN VIVANT hero — tiré au hasard à chaque chargement,
        couleur d'accent appliquée aux boutons CTA du hero
  ---------------------------------------------------------- */
  const patternContainer = document.getElementById('livingPattern');

  if (patternContainer) {
    const chosen = nextPattern();
    const track = document.createElement('div');
    track.className = 'pattern-track';
    track.style.backgroundImage = `url('${chosen.src}')`;
    patternContainer.appendChild(track);

    // Adapter la couleur des boutons "Réserver" et "À emporter"
    const hero = patternContainer.closest('.hero');
    if (hero) hero.style.setProperty('--hero-accent', chosen.color);
  }

  /* ----------------------------------------------------------
     1bis. TRANSITIONS DE SECTION — patterns pleine
           saturation, tirés au hasard à chaque chargement
  ---------------------------------------------------------- */
  document.querySelectorAll('[data-pattern]').forEach(el => {
    el.style.backgroundImage = `url('${nextPattern().src}')`;
  });


  /* ----------------------------------------------------------
     2. CLAIM "La pizza qui remue les sens" — mot par mot
        Chaque mot du titre hero apparaît avec un décalage
  ---------------------------------------------------------- */
  const heroTitle = document.querySelector('.hero__claim');
  if (heroTitle) {
    const text  = heroTitle.textContent.trim();
    const words = text.split(' ');
    heroTitle.innerHTML = words
      .map((w, i) => `<span class="word" style="animation-delay:${0.1 + i * 0.12}s">${w}</span>`)
      .join(' ');
  }

  /* Logo hero — entrée en fondu + légère montée */
  const heroLogo = document.querySelector('.hero__logo');
  if (heroLogo) heroLogo.classList.add('hero__logo--animate');

  /* Sous-titre et CTA — entrée décalée */
  const heroSub  = document.querySelector('.hero__sub');
  const heroCtas = document.querySelector('.hero__ctas');
  if (heroSub)  setTimeout(() => heroSub.classList.add('fade-in-up'),  900);
  if (heroCtas) setTimeout(() => heroCtas.classList.add('fade-in-up'), 1100);


  /* ----------------------------------------------------------
     3. SCROLL REVEAL — apparition des éléments au scroll
        Intersection Observer sur tous les éléments .reveal
  ---------------------------------------------------------- */
  const revealEls = document.querySelectorAll(
    '.section-title, .section-sub, .concept__text, ' +
    '.pillar, .prod-card, .pizza-card, .formule-card, ' +
    '.infos__block, .affiche-item, .concept__pillars'
  );

  revealEls.forEach((el, i) => {
    el.classList.add('reveal');
    // Décalage en cascade pour les éléments groupés (grilles)
    if (el.closest('.concept__pillars') || el.closest('.producteurs__grid') ||
        el.closest('.carte__grid') || el.closest('.infos__grid')) {
      const siblings = Array.from(el.parentElement.children);
      const idx = siblings.indexOf(el);
      el.style.transitionDelay = `${idx * 0.1}s`;
    }
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));


  /* ----------------------------------------------------------
     4. PARALLAXE — les patterns bougent plus lentement que
        le contenu (effet de profondeur)
  ---------------------------------------------------------- */
  const parallaxEls = [
    { el: document.querySelector('.hero__bg'),         speed: 0.35 },
    { el: document.querySelector('.reserver__pattern'), speed: 0.25 },
  ];

  function onScroll() {
    const sy = window.scrollY;

    parallaxEls.forEach(({ el, speed }) => {
      if (!el) return;
      el.style.transform = `translateY(${sy * speed}px)`;
    });

    /* Bande d'affiches — effet légèrement inverse (monte plus vite) */
    const affiches = document.querySelector('.affiches__strip');
    if (affiches) {
      const rect   = affiches.getBoundingClientRect();
      const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * 0.06;
      affiches.querySelectorAll('.affiche-item img').forEach((img, i) => {
        img.style.transform = `scale(1.08) translateY(${offset * (i % 2 === 0 ? 1 : -1)}px)`;
      });
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // init


  /* ----------------------------------------------------------
     5. BANDE TICKER — patterns défilants entre sections
        (injecté dynamiquement avant la section carte)
  ---------------------------------------------------------- */
  const carteSection = document.getElementById('carte');
  if (carteSection) {
    const ticker = document.createElement('div');
    ticker.className = 'ticker';
    ticker.innerHTML = `
      <div class="ticker__track">
        ${Array(3).fill(`
          <span>🍅 Tomate</span>
          <span>🥦 Brocolis</span>
          <span>🎃 Potimarron</span>
          <span>🧀 Fromage</span>
          <span>🥩 Coppa</span>
          <span>🌿 Bio & local</span>
          <span>📍 100 km</span>
          <span>🍕 La pizza qui remue les sens</span>
        `).join('')}
      </div>`;
    carteSection.parentNode.insertBefore(ticker, carteSection);
  }


  /* ----------------------------------------------------------
     6. NAV — shadow progressif au scroll
  ---------------------------------------------------------- */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    if (!nav) return;
    nav.style.boxShadow = window.scrollY > 30
      ? '0 4px 28px rgba(0,0,0,0.13)'
      : '0 1px 12px rgba(0,0,0,0.06)';
  }, { passive: true });


  /* ----------------------------------------------------------
     7. BURGER MENU MOBILE
  ---------------------------------------------------------- */
  const burger = document.querySelector('.nav__burger');
  const links  = document.querySelector('.nav__links');
  if (burger && links) {
    burger.addEventListener('click', () => {
      const open = links.classList.toggle('nav__links--open');
      Object.assign(links.style, open ? {
        display: 'flex', flexDirection: 'column',
        position: 'absolute', top: '68px', left: '0', right: '0',
        background: '#F7F2E8', padding: '1.5rem 2rem 2rem',
        boxShadow: '0 8px 28px rgba(0,0,0,0.12)', gap: '1.25rem', zIndex: '99',
      } : { display: '' });
    });
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('nav__links--open');
        links.style.display = '';
      });
    });
  }


  /* ----------------------------------------------------------
     9. ONGLETS RÉSERVER / EMPORTER
  ---------------------------------------------------------- */
  const tabs = document.querySelectorAll('.reserver__tab');
  const panels = document.querySelectorAll('.reserver__iframe-wrap');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('reserver__tab--active'));
      tab.classList.add('reserver__tab--active');
      const target = tab.dataset.tab;
      panels.forEach(p => {
        p.hidden = p.dataset.panel !== target;
      });
    });
  });

});
