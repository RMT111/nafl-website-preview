/* Northern Access Floors — site scripts */

document.addEventListener('DOMContentLoaded', function () {

  /* ----- Mobile navigation toggle ----- */
  var navToggle = document.querySelector('.nav-toggle');
  var mainNav = document.querySelector('.main-nav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      var open = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* ----- Mobile dropdown (Services) ----- */
  var mobileQuery = window.matchMedia('(max-width: 1160px)');

  document.querySelectorAll('.has-dropdown > a').forEach(function (link) {
    link.addEventListener('click', function (e) {
      // Only intercept on mobile, where the dropdown is toggled rather than hovered
      if (mobileQuery.matches) {
        e.preventDefault();
        link.parentElement.classList.toggle('open');
      }
    });
  });

  // If the window is resized across the breakpoint, clear any mobile-only
  // open states so the desktop nav starts clean (and vice versa).
  mobileQuery.addEventListener('change', function () {
    document.querySelectorAll('.has-dropdown.open').forEach(function (el) {
      el.classList.remove('open');
    });
    if (mainNav) { mainNav.classList.remove('open'); }
    if (navToggle) { navToggle.setAttribute('aria-expanded', 'false'); }
  });

  /* ----- Project sector filtering ----- */
  var filterButtons = document.querySelectorAll('.filter-btn');
  var projectCards = document.querySelectorAll('.project-card[data-sector]');

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterButtons.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      var sector = btn.getAttribute('data-filter');
      projectCards.forEach(function (card) {
        var match = sector === 'all' || card.getAttribute('data-sector') === sector;
        card.classList.toggle('hidden', !match);
        // Filtering reflows the grid, which can leave cards waiting on a
        // scroll-reveal that never fires — reveal them immediately instead.
        card.classList.add('visible');
        card.style.removeProperty('--reveal-delay');
      });
    });
  });

  /* ----- Entrances -----
     CSS pre-hides these (only under .js-ready); we add .is-in once they scroll in.
     Fires once per element, then unobserves. Never re-runs. */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealTargets = document.querySelectorAll(
    '.section-head, .card, .cta-band, .prose, .product-shot'
  );

  // Show everything immediately, unstyled by the entrance layer, when animating
  // would be wrong or unsafe: reduced motion, no IntersectionObserver, or a tab
  // that loads hidden (observers are suspended and CSS animations don't advance
  // there, which would strand the hero and cards invisible).
  function showEverything() {
    document.documentElement.classList.remove('js-ready');
    revealTargets.forEach(function (el) { el.classList.add('is-in'); });
  }

  if (reduceMotion || !('IntersectionObserver' in window) || document.hidden) {
    showEverything();
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealTargets.forEach(function (el) {
      // Stagger grouped items (grid cells / card rows) 70ms apart
      var siblings = el.parentElement ? el.parentElement.children : [el];
      var index = Array.prototype.indexOf.call(siblings, el);
      el.style.setProperty('--reveal-delay', (Math.min(index, 5) * 70) + 'ms');
      observer.observe(el);
    });

    // Safety net: if the tab is backgrounded mid-load, don't strand content hidden
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) {
        setTimeout(function () {
          revealTargets.forEach(function (el) {
            var r = el.getBoundingClientRect();
            if (r.top < window.innerHeight && r.bottom > 0) { el.classList.add('is-in'); }
          });
        }, 100);
      }
    });
  }

  /* ----- Hero video (once activated): respect reduced-motion ----- */
  var heroVideo = document.querySelector('.hero-video');
  if (heroVideo && reduceMotion) {
    heroVideo.removeAttribute('autoplay');
    heroVideo.pause();
  }

  /* ----- Footer year ----- */
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ----- Forms (placeholder handler until connected to a backend) ----- */
  document.querySelectorAll('form[data-placeholder]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      alert('Thank you — this form will be activated once the website goes live. In the meantime please email info@nafl.co.uk or call 01482 483950.');
    });
  });

  /* ----- Header: condense on scroll + back-to-top visibility -----
     One passive scroll listener, throttled with requestAnimationFrame. */
  var header = document.querySelector('.site-header');
  var toTop = document.querySelector('.to-top');
  var ticking = false;

  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    if (header) { header.classList.toggle('scrolled', y > 80); }
    if (toTop) { toTop.classList.toggle('show', y > 600); }
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ----- Instant navigation: prefetch same-site pages on hover/touch -----
     Makes clicking between pages feel immediate. Skips on data-saver / slow
     connections and ignores downloads, tel/mailto and in-page anchors. */
  (function () {
    var conn = navigator.connection;
    if (conn && (conn.saveData || /(^|-)2g$/.test(conn.effectiveType || ''))) return;

    var prefetched = {};
    function prefetch(href) {
      if (prefetched[href]) return;
      prefetched[href] = true;
      var l = document.createElement('link');
      l.rel = 'prefetch';
      l.href = href;
      document.head.appendChild(l);
    }
    function maybePrefetch(e) {
      var a = e.target.closest && e.target.closest('a[href]');
      if (!a || a.origin !== location.origin) return;
      if (a.hasAttribute('download')) return;
      var raw = a.getAttribute('href') || '';
      if (/^(tel:|mailto:|#)/.test(raw)) return;
      if (a.pathname === location.pathname) return; // same page (e.g. anchor)
      prefetch(a.href);
    }
    document.addEventListener('mouseover', maybePrefetch, { passive: true });
    document.addEventListener('touchstart', maybePrefetch, { passive: true });
  })();

});
