// Urnalia · acceso a la prueba online. El programa va cifrado (AES-GCM) en d/<idioma>.bin;
// la contraseña genera la clave en el navegador y, si es la buena, el programa se descifra y arranca aquí mismo.
(function () {
  'use strict';
  var SALT = 'WyfdMVgHO62VZY/W2w2LwQ==', ITER = 600000, KEY = 'urnalia.demo.k', LKEY = 'urnalia.demo.lang', OKKEY = 'urnalia.demo.condiciones.v1';
  var TX = {
    es: { kicker: 'Prueba online', h1: 'Urnalia, en tu navegador.', lead: 'El programa completo, con las elecciones generales de un ayuntamiento ficticio ya en marcha. Cambia lo que quieras: cada noche todo vuelve a empezar.', lang: 'Idioma', pw: 'Contraseña de acceso', go: 'Entrar en la prueba', nopw: '¿No tienes contraseña?', ask: 'Solicítala', f1: 'Sin instalar nada', f2: 'Los datos no salen de tu equipo', f3: 'En castellano y en català', bad: 'La contraseña no es correcta.', empty: 'Escribe la contraseña.', wait: 'Abriendo…', net: 'No se ha podido cargar la prueba. Revisa la conexión y vuelve a intentarlo.', old: 'Este navegador es demasiado antiguo. Usa Edge, Chrome o Firefox actualizados.', terms: { t: 'Condiciones de uso de la prueba', p: ['Urnalia es un programa de ordenador protegido por la Ley de Propiedad Intelectual (Real Decreto Legislativo 1/1996, artículos 95 a 104). © 2026 Urnalia. Todos los derechos reservados.', 'Se le da acceso solo para evaluar el programa, de forma personal, temporal y gratuita. El acceso no es una licencia de uso.', 'Queda prohibido copiar, descargar, descompilar, desensamblar, aplicar ingeniería inversa, modificar, redistribuir o usar el programa o cualquier parte de él (código, diseño, textos, plazos y contenidos) con cualquier fin distinto de la evaluación.', 'La contraseña es personal e intransferible. No la comparta.', 'El incumplimiento puede dar lugar a las acciones civiles y penales que correspondan, previstas en los artículos 138 y siguientes de la Ley de Propiedad Intelectual y en el artículo 270 del Código Penal.', 'Los datos de la prueba son ficticios. Lo que cambie se guarda solo en este navegador y se borra cada noche.'], chk: 'He leído y acepto las condiciones de uso.', ok: 'Acepto y entro', no: 'No acepto', need: 'Para entrar hay que aceptar las condiciones.' }, legal: '© 2026 Urnalia. Todos los derechos reservados. Prueba con fines de evaluación: queda prohibido copiar, descompilar o redistribuir el programa.', title: 'Prueba de Urnalia', subj: 'Acceso a la prueba de Urnalia', body: 'Hola:\n\nSoy [nombre y apellidos], [cargo] del Ayuntamiento de [municipio] ([provincia]).\n\nEstamos interesados en evaluar Urnalia y nos gustaría recibir la contraseña de acceso a la prueba online.\n\nTeléfono de contacto: [teléfono]\n\nGracias.' },
    ca: { kicker: 'Prova en línia', h1: 'Urnalia, al teu navegador.', lead: 'El programa complet, amb les eleccions generals d’un ajuntament fictici ja en marxa. Canvia el que vulguis: cada nit tot torna a començar.', lang: 'Idioma', pw: 'Contrasenya d’accés', go: 'Entra a la prova', nopw: 'No tens contrasenya?', ask: 'Demana-la', f1: 'Sense instal·lar res', f2: 'Les dades no surten del teu equip', f3: 'En castellano i en català', bad: 'La contrasenya no és correcta.', empty: 'Escriu la contrasenya.', wait: 'Obrint…', net: 'No s’ha pogut carregar la prova. Revisa la connexió i torna-ho a provar.', old: 'Aquest navegador és massa antic. Fes servir Edge, Chrome o Firefox actualitzats.', terms: { t: 'Condicions d’ús de la prova', p: ['Urnalia és un programa d’ordinador protegit per la Llei de propietat intel·lectual (Reial decret legislatiu 1/1996, articles 95 a 104). © 2026 Urnalia. Tots els drets reservats.', 'Se us dona accés només per avaluar el programa, de manera personal, temporal i gratuïta. L’accés no és una llicència d’ús.', 'Queda prohibit copiar, descarregar, descompilar, desassemblar, aplicar enginyeria inversa, modificar, redistribuir o fer servir el programa o qualsevol part (codi, disseny, textos, terminis i continguts) amb qualsevol finalitat diferent de l’avaluació.', 'La contrasenya és personal i intransferible. No la compartiu.', 'L’incompliment pot donar lloc a les accions civils i penals que corresponguin, previstes als articles 138 i següents de la Llei de propietat intel·lectual i a l’article 270 del Codi penal.', 'Les dades de la prova són fictícies. El que canvieu es desa només en aquest navegador i s’esborra cada nit.'], chk: 'He llegit i accepto les condicions d’ús.', ok: 'Accepto i entro', no: 'No accepto', need: 'Per entrar cal acceptar les condicions.' }, legal: '© 2026 Urnalia. Tots els drets reservats. Prova amb finalitat d’avaluació: queda prohibit copiar, descompilar o redistribuir el programa.', title: 'Prova d’Urnalia', subj: 'Accés a la prova d’Urnalia', body: 'Hola:\n\nSóc [nom i cognoms], [càrrec] de l’Ajuntament de [municipi] ([província]).\n\nEns interessa avaluar Urnalia i voldríem rebre la contrasenya d’accés a la prova en línia.\n\nTelèfon de contacte: [telèfon]\n\nGràcies.' },
  };
  var $ = function (id) { return document.getElementById(id); };
  var ss = { get: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }, set: function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* nada */ } }, del: function (k) { try { sessionStorage.removeItem(k); } catch (e) { /* nada */ } } };
  var ls = { get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* nada */ } } };
  var q = new URLSearchParams(location.search).get('l');
  var nav = (navigator.language || 'es').slice(0, 2);
  var lang = TX[q] ? q : TX[ls.get(LKEY)] ? ls.get(LKEY) : TX[nav] ? nav : 'es';
  function paint() {
    var t = TX[lang];
    document.documentElement.lang = lang; document.title = t.title;
    [].forEach.call(document.querySelectorAll('[data-t]'), function (el) { el.textContent = t[el.getAttribute('data-t')]; });
    $('lang').value = lang;
    $('ask').href = 'mailto:info@urnalia.es?subject=' + encodeURIComponent(t.subj) + '&body=' + encodeURIComponent(t.body);
  }
  function err(m) { var e = $('err'); e.textContent = m; e.hidden = !m; }
  var b64 = function (s) { return Uint8Array.from(atob(s), function (c) { return c.charCodeAt(0); }); };
  var u8b64 = function (u) { var s = ''; for (var i = 0; i < u.length; i++) s += String.fromCharCode(u[i]); return btoa(s); };
  async function derive(pw) {
    var base = await crypto.subtle.importKey('raw', new TextEncoder().encode(pw), 'PBKDF2', false, ['deriveBits']);
    return new Uint8Array(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: b64(SALT), iterations: ITER }, base, 256));
  }
  async function open(raw) {
    var r = await fetch('d/' + lang + '.bin', { cache: 'no-cache' });
    if (!r.ok) throw Object.assign(new Error('net'), { net: true });
    var buf = new Uint8Array(await r.arrayBuffer());
    var key = await crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['decrypt']);
    var plain;
    try { plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: buf.slice(0, 12) }, key, buf.slice(12)); }
    catch (e) { throw Object.assign(new Error('bad'), { bad: true }); }
    var html = await new Response(new Blob([plain]).stream().pipeThrough(new DecompressionStream('gzip'))).text();
    if (!ls.get(OKKEY)) await accept();
    ss.set(KEY, u8b64(raw)); ls.set(LKEY, lang);
    if (q !== lang) history.replaceState(null, '', '?l=' + lang);
    document.open(); document.write(html); document.close();
  }
  /* condiciones de uso: se aceptan una vez en cada navegador */
  function accept() {
    return new Promise(function (ok, ko) {
      var t = TX[lang].terms, d = document.createElement('div');
      d.className = 'terms'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-modal', 'true'); d.setAttribute('aria-labelledby', 'tmT');
      d.innerHTML = '<div class="terms-box"><h2 id="tmT"></h2><ol></ol><label class="terms-chk"><input type="checkbox" id="tmC"> <span></span></label><p class="err" id="tmE" hidden></p><div class="terms-acts"><button type="button" class="btn ghost" id="tmN"></button><button type="button" class="btn" id="tmY"></button></div></div>';
      d.querySelector('h2').textContent = t.t;
      t.p.forEach(function (x) { var li = document.createElement('li'); li.textContent = x; d.querySelector('ol').appendChild(li); });
      d.querySelector('.terms-chk span').textContent = t.chk; d.querySelector('#tmY').textContent = t.ok; d.querySelector('#tmN').textContent = t.no;
      document.body.appendChild(d); d.querySelector('#tmC').focus();
      d.querySelector('#tmY').addEventListener('click', function () {
        if (!d.querySelector('#tmC').checked) { var e = d.querySelector('#tmE'); e.textContent = t.need; e.hidden = false; return; }
        ls.set(OKKEY, new Date().toISOString()); d.remove(); ok();
      });
      d.querySelector('#tmN').addEventListener('click', function () { d.remove(); ss.del(KEY); ko(Object.assign(new Error('no'), { declined: true })); });
    });
  }
  async function go(raw) {
    var b = $('go'); b.disabled = true; b.textContent = TX[lang].wait; err('');
    try { await open(raw); }
    catch (e) {
      b.disabled = false; b.textContent = TX[lang].go;
      if (e.declined) { err(TX[lang].terms.need); } else if (e.bad) { ss.del(KEY); err(TX[lang].bad); $('pw').select(); } else err(TX[lang].net);
    }
  }
  paint();
  if (!window.crypto || !crypto.subtle || !window.DecompressionStream) { err(TX[lang].old); $('go').disabled = true; return; }
  $('lang').addEventListener('change', function () { lang = this.value; ls.set(LKEY, lang); paint(); });
  $('f').addEventListener('submit', async function (e) {
    e.preventDefault();
    var pw = $('pw').value;
    if (!pw) return err(TX[lang].empty);
    $('go').disabled = true; $('go').textContent = TX[lang].wait;
    go(await derive(pw));
  });
  var saved = ss.get(KEY);
  if (saved) go(b64(saved)); else $('pw').focus();
})();
