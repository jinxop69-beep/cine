# Ollada rollback estable

Pack reconstruido desde el último `index.html` que funcionaba en web.

- `index.html`: versión web funcional restaurada.
- `app.html`: misma base funcional que web, solo forzando modo app por ruta/clase.
- `service-worker.js`: limpia cachés antiguas para evitar archivos rotos.
- No se toca Supabase, tablas, claves ni lógica.

Sube todo a la raíz de Vercel y haz redeploy. Luego desinstala la PWA vieja y borra datos del sitio.
