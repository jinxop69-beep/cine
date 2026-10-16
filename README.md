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

## Versión 1.0 (lanzamiento)

- Textos de producto final: sin restos de «demo» ni «prueba».
- Catálogo inicial con títulos en castellano; carteles en `posters/` y portada en `cover.jpg` (la página pesa ~4 veces menos).
- SEO y redes: descripción, Open Graph y tarjeta de Twitter con `og.jpg`, `robots.txt`.
- `privacidad.html`: política de privacidad y condiciones. **Pendiente**: rellenar responsable y correo de contacto.
- Perfil → ajustes: cerrar sesión y eliminar cuenta. La eliminación necesita la función de `supabase/migrations/20261016_delete_my_account.sql`.
- Botón atrás del móvil: cierra ventanas y vuelve a la pestaña anterior.

## App de Android

`android/` contiene la app de Android (Trusted Web Activity): abre https://plano-amber.vercel.app a pantalla completa, sin barra del navegador, y se actualiza sola con la web.

- Paquete: `app.plano.cine` · versión 1.0 (versionCode 1)
- La web publica la huella de la firma en `/.well-known/assetlinks.json`.
- Para compilar: crea `android/keystore.properties` con `storeFile`, `storePassword`, `keyAlias` y `keyPassword` (no se sube al repositorio) y ejecuta `gradle assembleRelease bundleRelease` dentro de `android/`.
- Para publicar una nueva versión en Google Play, sube `versionCode` y `versionName` en `android/app/build.gradle`.
