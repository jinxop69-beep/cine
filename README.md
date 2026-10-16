# Plano

Página de películas y series. Conserva la versión de producción e incorpora animaciones breves con soporte para movimiento reducido.

Sitio estático: index.html y app.js. No requiere compilación.

Producción: https://plano-amber.vercel.app
Proyecto Vercel: plano

La versión anterior de Ollada permanece en el historial anterior a este cambio.

## Novedades v4

- Transiciones de cine: el cartel se transforma en la ficha y vuelve a su sitio (View Transitions).
- Cada ficha se tiñe con el color dominante de su cartel.
- Al guardar un recuerdo aparece una entrada de cine con fecha, nota, emoción y compañía; se puede compartir como imagen.
- "Tu año en historias": resumen a pantalla completa (emoción del año, compañía favorita, historia del año, mes más cinéfilo y perfil cinéfilo) con imagen para compartir.
- Diario en vista calendario, con el cartel de cada película en el día que la viste.
- "¿Qué vemos hoy?": eliges emoción y compañía y la app propone algo de tu lista.
- Esqueletos de carga en la ficha.
- PWA: `manifest.webmanifest`, iconos en `icons/` y `sw.js` (red primero para la app, caché de carteles; abre sin conexión). `service-worker.js` es una copia para actualizar instalaciones antiguas.

Todas las animaciones respetan la preferencia de movimiento reducido.
