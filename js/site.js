/* Urnalia · web comercial. Sin dependencias, sin cookies, sin llamadas a terceros. */
(function () {
  'use strict';
  var d = document, root = d.documentElement;
  root.classList.add('js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* cabecera: fondo al desplazarse y menú en el móvil */
  var nav = d.getElementById('nav'), toggle = d.getElementById('navToggle'), menu = d.getElementById('navMenu');
  function onScroll() { if (nav) nav.classList.toggle('scrolled', window.scrollY > 24); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open)); menu.classList.toggle('open', open);
    });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) { toggle.setAttribute('aria-expanded', 'false'); menu.classList.remove('open'); } });
  }

  /* aparición al entrar en pantalla */
  var items = d.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  } else items.forEach(function (el) { el.classList.add('in'); });

  /* contadores de la portada */
  var stats = d.getElementById('stats');
  if (stats && 'IntersectionObserver' in window && !reduce) {
    var nums = stats.querySelectorAll('[data-count]');
    nums.forEach(function (n) { n.textContent = '0'; });
    var so = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return; so.disconnect();
      nums.forEach(function (n) {
        var to = +n.getAttribute('data-count'), t0 = performance.now(), dur = 1400;
        (function step(t) {
          var p = Math.min(1, (t - t0) / dur), v = Math.round(to * (1 - Math.pow(1 - p, 3)));
          n.textContent = String(v); if (p < 1) requestAnimationFrame(step);
        })(t0);
      });
    }, { threshold: 0.4 });
    so.observe(stats);
  }

  /* inclinación suave de la captura de portada con el ratón */
  var tilt = d.getElementById('tilt');
  if (tilt && !reduce && window.matchMedia('(pointer: fine)').matches) {
    var hero = d.getElementById('inicio'), raf = 0;
    hero.addEventListener('mousemove', function (e) {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = 0;
        var r = hero.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        tilt.style.transform = 'rotateY(' + (-14 + x * 8).toFixed(2) + 'deg) rotateX(' + (6 - y * 6).toFixed(2) + 'deg) rotateZ(1deg)';
      });
    });
    hero.addEventListener('mouseleave', function () { tilt.style.transform = ''; });
  }

  /* galería con pestañas */
  var GAL = {
    gantt: ['Cronograma de los trámites electorales', 'Diagrama de Gantt de los 54 días, con la línea de hoy y la de la votación. Se ve de un vistazo qué trámites se solapan.'],
    calendario: ['Calendario mensual con los trámites', 'Calendario mensual con los trámites de cada día, coloreados por responsable: Ayuntamiento, Junta Electoral, partidos, Oficina del Censo.'],
    agenda: ['Agenda de los próximos días', 'Agenda día a día: qué empieza, qué es el último día y qué vence. Se marca como hecho desde la propia lista.'],
    ficha: ['Ficha de un trámite', 'La ficha de cada trámite: plazo legal y artículo, estado, responsable, fechas ajustables con motivo, documentos adjuntos y anotaciones.']
  };
  var tabs = d.querySelectorAll('.gal-tabs [role="tab"]'), gImg = d.getElementById('galImg'), gShot = d.getElementById('galShot'), gCap = d.getElementById('galCap');
  tabs.forEach(function (b) {
    b.addEventListener('click', function () {
      var k = b.getAttribute('data-g'); if (!GAL[k] || !gImg) return;
      tabs.forEach(function (t) { t.setAttribute('aria-selected', String(t === b)); });
      gImg.classList.add('fade');
      var pre = new Image(); pre.src = 'img/capturas/' + k + '-sm.webp';
      pre.onload = pre.onerror = function () {
        gImg.src = pre.src; gImg.alt = GAL[k][0]; gShot.setAttribute('data-full', 'img/capturas/' + k + '.webp');
        gCap.textContent = GAL[k][1]; gImg.classList.remove('fade');
      };
    });
  });

  /* ampliar capturas */
  var lb = d.getElementById('lightbox'), lbImg = d.getElementById('lbImg'), lbClose = d.getElementById('lbClose'), last = null;
  function openLb(btn) {
    var img = btn.querySelector('img'); last = btn;
    lbImg.src = btn.getAttribute('data-full'); lbImg.alt = img ? img.alt : '';
    lb.hidden = false; d.body.style.overflow = 'hidden'; lbClose.focus();
  }
  function closeLb() { lb.hidden = true; lbImg.removeAttribute('src'); d.body.style.overflow = ''; if (last) last.focus(); }
  d.addEventListener('click', function (e) { var b = e.target.closest('.shot[data-full]'); if (b) openLb(b); });
  if (lb) {
    lb.addEventListener('click', closeLb);
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !lb.hidden) closeLb(); });
  }

  /* calculadora: fechas clave a partir del día de la votación (D54) */
  var inp = d.getElementById('calcVot'), out = d.getElementById('calcOut'), warn = d.getElementById('calcWarn');
  var DAY = 864e5;
  var fmt = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  var fmtS = new Intl.DateTimeFormat('es-ES', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' });
  function calc() {
    if (!inp || !out) return;
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(inp.value); if (!m) return;
    var vot = Date.UTC(+m[1], +m[2] - 1, +m[3]), base = vot - 54 * DAY;
    warn.hidden = new Date(vot).getUTCDay() === 0;
    out.querySelectorAll('time').forEach(function (t) {
      var a = base + (+t.getAttribute('data-off')) * DAY, to = t.getAttribute('data-to');
      var txt = to ? 'del ' + fmtS.format(a) + ' al ' + fmtS.format(base + (+to) * DAY) : fmt.format(a);
      t.textContent = txt.charAt(0).toUpperCase() + txt.slice(1);
      t.setAttribute('datetime', new Date(a).toISOString().slice(0, 10));
      t.classList.remove('flash'); void t.offsetWidth; t.classList.add('flash');
    });
  }
  if (inp) { inp.addEventListener('input', calc); inp.addEventListener('change', calc); calc(); }
})();
