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
  var mobileQuery = window.matchMedia('(max-width: 960px)');

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

  /* ----- Scroll-reveal animations -----
     Applied from JS so the site still renders fully with JS disabled. */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Skip animations when the page loads in a hidden tab / preview pane:
  // browsers suspend IntersectionObserver there, which would leave the
  // content invisible. Content-first, animation second.
  if (!reduceMotion && !document.hidden && 'IntersectionObserver' in window) {
    var revealTargets = document.querySelectorAll(
      '.card, .sector-card, .project-card, .section-head, .split > *, .cta-panel, .download-list li, .gallery-grid figure'
    );

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });

    revealTargets.forEach(function (el) {
      // Stagger siblings slightly so grids cascade in
      var siblings = el.parentElement ? el.parentElement.children : [el];
      var index = Array.prototype.indexOf.call(siblings, el);
      el.style.setProperty('--reveal-delay', (Math.min(index, 5) * 70) + 'ms');
      el.classList.add('reveal');
      observer.observe(el);
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

});
