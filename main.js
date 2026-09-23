(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var header = document.querySelector('.site-header');
  var progress = document.querySelector('.progress');
  var reveals = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  var parallaxEls = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  var counters = Array.prototype.slice.call(document.querySelectorAll('[data-count]'));
  var pending = reveals.slice();

  /* ---------- Locale: Persian digits on the fa page ---------- */
  var isFa = document.documentElement.lang === 'fa';
  var faDigits = '۰۱۲۳۴۵۶۷۸۹';
  function num(n) {
    var str = String(n);
    return isFa ? str.replace(/[0-9]/g, function (d) { return faDigits.charAt(+d); }) : str;
  }

  /* ---------- Native scroll-driven animations where supported ---------- */
  var sda = !reduceMotion && window.CSS && CSS.supports && CSS.supports('animation-timeline: view()');
  if (sda) {
    document.documentElement.classList.add('sda');
    document.addEventListener('animationend', function (e) {
      var el = e.target;
      if (el.hasAttribute && el.hasAttribute('data-reveal')) el.classList.add('is-done');
    });
  }

  /* ---------- Theme toggle (View Transitions when available) ---------- */
  var toggle = document.querySelector('.theme-toggle');
  var systemDark = window.matchMedia('(prefers-color-scheme: dark)');
  function currentTheme() {
    var t = document.documentElement.getAttribute('data-theme');
    return t || (systemDark.matches ? 'dark' : 'light');
  }
  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    if (toggle) toggle.setAttribute('aria-pressed', t === 'dark' ? 'true' : 'false');
    try { localStorage.setItem('theme', t); } catch (err) {}
  }
  if (toggle) {
    toggle.setAttribute('aria-pressed', currentTheme() === 'dark' ? 'true' : 'false');
    toggle.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      if (document.startViewTransition && !reduceMotion) {
        document.startViewTransition(function () { applyTheme(next); });
      } else {
        applyTheme(next);
      }
    });
  }

  /* ---------- Sparkline hover ---------- */
  var mort = document.querySelector('.mort');
  if (mort) {
    var msvg = mort.querySelector('.mort-svg');
    var mtip = mort.querySelector('.mort-tip');
    var mcross = mort.querySelector('.mort-cross');
    var mp1 = mort.querySelector('.mort-pt1');
    var mp2 = mort.querySelector('.mort-pt2');
    var mxs = mort.getAttribute('data-xs').split(',').map(parseFloat);
    var my1 = mort.getAttribute('data-y1').split(',').map(parseFloat);
    var my2 = mort.getAttribute('data-y2').split(',').map(parseFloat);
    var mtips = JSON.parse(mort.getAttribute('data-tips'));
    function mortMove(e) {
      var r = msvg.getBoundingClientRect();
      var px = ((e.clientX - r.left) / r.width) * 400;
      var best = 0, dist = Infinity;
      for (var i = 0; i < mxs.length; i++) { var dd = Math.abs(mxs[i] - px); if (dd < dist) { dist = dd; best = i; } }
      mcross.setAttribute('x1', mxs[best]); mcross.setAttribute('x2', mxs[best]);
      mp1.setAttribute('cx', mxs[best]); mp1.setAttribute('cy', my1[best]);
      mp2.setAttribute('cx', mxs[best]); mp2.setAttribute('cy', my2[best]);
      mtip.textContent = mtips[best];
      var half = mtip.offsetWidth / 2;
      var left = mxs[best] / 400 * r.width;
      mtip.style.left = Math.max(half, Math.min(r.width - half, left)) + 'px';
      mtip.style.top = (Math.min(my1[best], my2[best]) / 178 * r.height - 10) + 'px';
      mort.classList.add('is-hover');
    }
    msvg.addEventListener('mousemove', mortMove);
    msvg.addEventListener('mouseleave', function () { mort.classList.remove('is-hover'); });
    msvg.addEventListener('touchstart', function (e) { if (e.touches[0]) mortMove(e.touches[0]); }, { passive: true });
    msvg.addEventListener('touchend', function () { mort.classList.remove('is-hover'); });
  }

  var bgLine = document.querySelector('.bg-line');
  if (bgLine && !reduceMotion && 'IntersectionObserver' in window) {
    var bio = new IntersectionObserver(function (entries) {
      if (entries.some(function (e) { return e.isIntersecting; })) {
        bgLine.classList.add('is-drawn');
        bio.disconnect();
      }
    }, { threshold: 0.25 });
    bio.observe(bgLine);
  }

  /* ---------- Stagger indices ---------- */
  document.querySelectorAll('[data-reveal-group]').forEach(function (group) {
    var kids = Array.prototype.slice.call(group.querySelectorAll(':scope > [data-reveal], :scope > * > [data-reveal]'));
    var n = kids.length;
    // Cap the whole group at ~400ms
    var scale = n > 6 ? 6 / n : 1;
    kids.forEach(function (el, i) {
      el.style.setProperty('--i', (i * scale).toFixed(2));
    });
  });

  /* ---------- Counters ---------- */
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function runCounter(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var dur = 1200;
    var start = null;
    function tick(ts) {
      if (start === null) start = ts;
      var p = Math.min(1, (ts - start) / dur);
      var val = Math.round(target * easeOut(p));
      el.textContent = prefix + num(val) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---------- Reveal ---------- */
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.classList.add('is-visible');
        var c = el.querySelector ? el.querySelectorAll('[data-count]') : [];
        Array.prototype.forEach.call(c, function (counter) {
          if (counter.dataset.done) return;
          counter.dataset.done = '1';
          runCounter(counter);
        });
        io.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

    reveals.forEach(function (el) { io.observe(el); });

    // Counters not inside a data-reveal element
    counters.forEach(function (counter) {
      if (!counter.closest('[data-reveal]')) {
        var cio = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (!e.isIntersecting || counter.dataset.done) return;
            counter.dataset.done = '1';
            runCounter(counter);
            cio.unobserve(counter);
          });
        }, { threshold: 0.5 });
        cio.observe(counter);
      }
    });
  }

  /* ---------- Scroll: header, progress, parallax ---------- */
  var ticking = false;
  var isDesktop = window.matchMedia('(min-width: 768px)');
  var docHeight = 0;

  function measure() {
    docHeight = document.documentElement.scrollHeight - window.innerHeight;
  }

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;

    if (header) header.classList.toggle('is-scrolled', y > 80);

    // A fast flick can outrun the observer; show anything already scrolled past.
    if (pending.length && docHeight > 0 && y >= docHeight - 2) {
      pending.forEach(function (el) { el.classList.add('is-visible'); el.classList.add('is-done'); });
      pending = [];
    }
    if (pending.length) {
      pending = pending.filter(function (el) {
        if (el.getBoundingClientRect().bottom < 0) {
          el.classList.add('is-visible');
          el.classList.add('is-done');
          return false;
        }
        return !el.classList.contains('is-visible');
      });
    }

    if (progress && docHeight > 0) {
      progress.style.transform = 'scaleX(' + Math.min(1, y / docHeight) + ')';
    }

    if (!reduceMotion && isDesktop.matches) {
      parallaxEls.forEach(function (el) {
        var f = parseFloat(el.getAttribute('data-parallax')) || 0;
        var offset = Math.max(-40, Math.min(40, -y * f));
        el.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0)';
      });
    } else {
      parallaxEls.forEach(function (el) { el.style.transform = ''; });
    }
    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(onScroll);
    }
  }

  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('resize', function () { measure(); requestTick(); });
  window.addEventListener('load', function () { measure(); requestTick(); });
  measure();
  onScroll();

  /* ---------- Anchor focus for keyboard users ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function () {
      var id = a.getAttribute('href').slice(1);
      var target = id && document.getElementById(id);
      if (!target) return;
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      setTimeout(function () { target.focus({ preventScroll: true }); }, 400);
    });
  });
})();
