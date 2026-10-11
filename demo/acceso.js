// Urnalia · acceso a la prueba online. El programa va cifrado (AES-GCM) en d/<idioma>.bin;
// la contraseña genera la clave en el navegador y, si es la buena, el programa se descifra y arranca aquí mismo.
(function () {
  'use strict';
  var SALT = 'fP/yQu9AptPQbgvpKAgrxw==', ITER = 600000, KEY = 'urnalia.demo.k', LKEY = 'urnalia.demo.lang';
  var TX = {
    es: { kicker: 'Prueba online', h1: 'Urnalia, en tu navegador.', lead: 'El programa completo, con las elecciones generales de un ayuntamiento ficticio ya en marcha. Cambia lo que quieras: cada noche todo vuelve a empezar.', lang: 'Idioma', pw: 'Contraseña de acceso', go: 'Entrar en la prueba', nopw: '¿No tienes contraseña?', ask: 'Solicítala', f1: 'Sin instalar nada', f2: 'Los datos no salen de tu equipo', f3: 'Castellano, català, galego y euskara', bad: 'La contraseña no es correcta.', empty: 'Escribe la contraseña.', wait: 'Abriendo…', net: 'No se ha podido cargar la prueba. Revisa la conexión y vuelve a intentarlo.', old: 'Este navegador es demasiado antiguo. Usa Edge, Chrome o Firefox actualizados.', title: 'Prueba de Urnalia', subj: 'Acceso a la prueba de Urnalia' },
    ca: { kicker: 'Prova en línia', h1: 'Urnalia, al teu navegador.', lead: 'El programa complet, amb les eleccions generals d’un ajuntament fictici ja en marxa. Canvia el que vulguis: cada nit tot torna a començar.', lang: 'Idioma', pw: 'Contrasenya d’accés', go: 'Entra a la prova', nopw: 'No tens contrasenya?', ask: 'Demana-la', f1: 'Sense instal·lar res', f2: 'Les dades no surten del teu equip', f3: 'Castellano, català, galego i euskara', bad: 'La contrasenya no és correcta.', empty: 'Escriu la contrasenya.', wait: 'Obrint…', net: 'No s’ha pogut carregar la prova. Revisa la connexió i torna-ho a provar.', old: 'Aquest navegador és massa antic. Fes servir Edge, Chrome o Firefox actualitzats.', title: 'Prova d’Urnalia', subj: 'Accés a la prova d’Urnalia' },
    gl: { kicker: 'Proba en liña', h1: 'Urnalia, no seu navegador.', lead: 'O programa completo, coas eleccións xerais dun concello ficticio xa en marcha. Cambie o que queira: cada noite todo volve empezar.', lang: 'Idioma', pw: 'Contrasinal de acceso', go: 'Entrar na proba', nopw: 'Non ten contrasinal?', ask: 'Solicítea', f1: 'Sen instalar nada', f2: 'Os datos non saen do seu equipo', f3: 'Castellano, català, galego e euskara', bad: 'O contrasinal non é correcto.', empty: 'Escriba o contrasinal.', wait: 'Abrindo…', net: 'Non se puido cargar a proba. Revise a conexión e ténteo de novo.', old: 'Este navegador é demasiado antigo. Use Edge, Chrome ou Firefox actualizados.', title: 'Proba de Urnalia', subj: 'Acceso á proba de Urnalia' },
    eu: { kicker: 'Lineako proba', h1: 'Urnalia, zure nabigatzailean.', lead: 'Programa osoa, fikziozko udal bateko hauteskunde orokorrak martxan dituela. Aldatu nahi duzuna: gauero dena hasierara itzultzen da.', lang: 'Hizkuntza', pw: 'Sarbide-pasahitza', go: 'Sartu probara', nopw: 'Ez duzu pasahitzik?', ask: 'Eskatu', f1: 'Ezer instalatu gabe', f2: 'Datuak ez dira zure ordenagailutik ateratzen', f3: 'Castellano, català, galego eta euskara', bad: 'Pasahitza ez da zuzena.', empty: 'Idatzi pasahitza.', wait: 'Irekitzen…', net: 'Ezin izan da proba kargatu. Egiaztatu konexioa eta saiatu berriro.', old: 'Nabigatzaile hau zaharregia da. Erabili Edge, Chrome edo Firefox eguneratuak.', title: 'Urnaliaren proba', subj: 'Urnaliaren probarako sarbidea' }
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
    $('ask').href = 'mailto:info@urnalia.es?subject=' + encodeURIComponent(t.subj);
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
    ss.set(KEY, u8b64(raw)); ls.set(LKEY, lang);
    if (q !== lang) history.replaceState(null, '', '?l=' + lang);
    document.open(); document.write(html); document.close();
  }
  async function go(raw) {
    var b = $('go'); b.disabled = true; b.textContent = TX[lang].wait; err('');
    try { await open(raw); }
    catch (e) {
      b.disabled = false; b.textContent = TX[lang].go;
      if (e.bad) { ss.del(KEY); err(TX[lang].bad); $('pw').select(); } else err(TX[lang].net);
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
