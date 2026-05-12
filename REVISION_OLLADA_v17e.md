# Revisión rápida — Ollada v17e stubs

## Diagnóstico principal
El problema no es un detalle suelto: hay dos diseños enteros conviviendo.

- `index.html` conserva el diseño anterior en el HTML inicial y lo pinta al refrescar.
- `app.html` tiene el diseño nuevo v17, pero como parche encima del proyecto antiguo.
- El service worker cachea `/`, `/index.html` y `/app.html`, así que puedes ver una mezcla o una versión anterior si entras por la raíz o si el navegador conserva caché/PWA.

## Líneas críticas del ZIP original

### `index.html`
- Línea 2: empieza en `web-mode`, mientras `app.html` empieza en `app-mode`. Esto ya crea comportamientos distintos.
- Líneas 28-79: hay código JS metido dentro de `<script src="...">`. Ese código no se ejecuta. Está parcheado de forma incorrecta.
- Líneas 88-112: tercer bloque repetido de `aplicarModoOlladaFinal`. Este sí se ejecuta, pero luego hay más funciones de modo al final.
- Líneas 1061-1089: aquí está el HTML visible del diseño anterior en Inicio. Esta es la causa más clara del flash al refrescar.
- Líneas 1752-1762: `rinicio()` antiguo vuelve a rellenar el Inicio con el diseño viejo.
- Línea 2946: se llama a `rinicio()` antes del parche final. Esto provoca que se vea el diseño anterior primero.
- Líneas 3286-3589: parche visual final tipo `of-*`, otro diseño distinto al v17 de `app.html`. Útil si querías ese diseño, pero conflictivo si querías el mockup nuevo.

### `app.html`
- Línea 2: empieza en `app-mode`, correcto para la app.
- Líneas 28-79: mismo error: JS dentro de scripts externos, no se ejecuta.
- Líneas 113-996: CSS base antiguo + muchos parches acumulados. No todo sobra: muchas clases siguen siendo necesarias para Buscar, Listas, Amigos, Juntos, IA, modales, auth y tarjetas.
- Línea 1149: `v-inicio` está vacío. Esto está bien: evita que el diseño anterior aparezca antes del render v17.
- Líneas 1758-1761: `rinicio()` está convertido en stub. Correcto: ya no pinta el Inicio viejo.
- Líneas 2427-2430: `rperfil()` también está convertido en stub. Correcto para que Perfil lo pinte v17.
- Líneas 3250-3591: CSS v17 del mockup. Útil.
- Líneas 3593-3851: JS v17 que pinta Inicio y Perfil. Útil.

### `service-worker.js`
- Línea 1: cache `ollada-pwa-v17e-stubs`. Si ya instalaste una PWA anterior, puede seguir sirviendo restos.
- Línea 2: cachea `/`, `/index.html` y `/app.html`. Como `index.html` y `app.html` no son el mismo diseño, esto agrava la mezcla.

## Qué he cambiado en v18-clean
- `index.html` y `app.html` quedan unificados: la raíz ya no carga el diseño anterior.
- He eliminado el JS fantasma dentro de los `<script src="...">` externos.
- He subido la caché a `ollada-pwa-v18-clean-20260513`.
- El service worker ya no sirve HTML cacheado si puede pedirlo fresco a red.
- Se mantiene la base antigua solo como soporte funcional para las secciones que aún no están rediseñadas: Buscar, Descubrir, Listas, Amigos, Juntos, IA, Wrapped, Auth y modales.

## Importante al probar
Después de subirlo, abre DevTools > Application > Service Workers > Unregister y en Storage pulsa Clear site data, o entra una vez en incógnito. Si no limpias la PWA anterior, el navegador puede enseñar caché vieja una vez más.
