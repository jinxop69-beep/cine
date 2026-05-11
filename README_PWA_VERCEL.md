# CineCircle PWA lista para Vercel

Estructura que debes subir a la raíz del proyecto:

```
index.html
app.html
manifest.webmanifest
service-worker.js
icons/
  icon-192.png
  icon-512.png
  maskable-512.png
  apple-touch-icon.png
```

## Cómo subirlo a Vercel

### Opción A: GitHub
1. En tu repositorio, borra o sustituye el `index.html` anterior.
2. Sube todos los archivos y la carpeta `icons`.
3. Confirma que `index.html` está en la raíz del repo.
4. En Vercel: Deployments → Redeploy.

### Opción B: Deploy manual
1. Descomprime este ZIP.
2. Arrastra la carpeta completa a Vercel.
3. Asegúrate de que no queda una carpeta intermedia tipo `cinecircle_pwa_ready/index.html` si Vercel espera raíz.

## Cómo probar instalación

En Android, prueba primero con Chrome:
1. Abre `https://cine-two-theta.vercel.app/`
2. Espera 5-10 segundos.
3. Menú de tres puntos → debería salir `Instalar app`.
4. Si sale solo `Añadir a pantalla de inicio`, borra caché o espera a que Chrome detecte el manifest/service worker.

Ruta app directa:
`https://cine-two-theta.vercel.app/?modo=app`

## Importante
- No he cambiado Supabase.
- No he cambiado TMDb.
- El service worker no cachea llamadas externas/API para evitar datos antiguos.
