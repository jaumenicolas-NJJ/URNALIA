# Urnalia · web comercial

Web estática de [urnalia.es](https://urnalia.es), publicada con GitHub Pages desde la rama `main`.

- Sin servidor, sin formularios, sin cookies ni analítica, sin recursos de terceros: tipografía, imágenes y código se sirven desde el propio dominio.
- Política de seguridad de contenidos estricta en cada página (`script-src 'self'`, sin código en línea).
- `index.html` (portada), `aviso-legal.html`, `privacidad.html`, `accesibilidad.html`, `404.html`.
- `css/site.css`, `js/site.js` (menú, animaciones, galería, ampliación de capturas y calculadora de fechas).
- `img/capturas/`: pantallas reales del programa con datos de demostración inventados (Ayuntamiento de Villaurna). Cada una en 2400 px y en 1200 px (`-sm`).
- `fonts/`: Inter (SIL Open Font License 1.1).
- `.well-known/security.txt`: contacto para avisos de seguridad.

Para verla en local: `python3 -m http.server` en esta carpeta y abrir http://localhost:8000.
