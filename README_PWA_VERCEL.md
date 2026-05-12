# Ollada PWA — versión app corregida

Sube todos estos archivos a la raíz de Vercel/GitHub.

Estructura:

```
index.html
app.html
manifest.webmanifest
service-worker.js
icons/
```

Pruebas:

- Web normal: `/`
- Modo app directo: `/app.html`
- Compatibilidad antigua: `/?modo=app`

Importante: si ya tenías instalada la PWA anterior, desinstálala del móvil y vuelve a instalarla desde Chrome para que coja el nuevo `manifest` y el nuevo `service-worker`.
