# Orbit 360 Photobooth

MVP de Photobooth 360 para administrar eventos, capturar fotos y videos desde el navegador, personalizar la experiencia, proyectar una galería en otra pantalla, compartir mediante QR y respaldar cada evento en su propia carpeta de Google Drive.

## Inicio rápido con Docker

1. Copia `.env.example` a `.env` y ajusta las variables opcionales.
2. Ejecuta `docker compose up --build -d`.
3. Abre `http://localhost:8867`.

Si los invitados escanearán el QR desde otros equipos, define en `.env` una URL accesible en la red, por ejemplo `APP_URL=http://192.168.1.50:8867`. No uses `localhost` para ese caso, porque en el teléfono apuntaría al propio teléfono.

Si actualizas desde la versión HTTPS anterior, recrea los servicios para eliminar el proxy antiguo:

```bash
git pull
docker compose down --remove-orphans
docker compose up --build -d
```

El despliegue local funciona por HTTP y `SECURE_COOKIE=false`, pensado para Ubuntu dentro de una red controlada. El MVP aún no emite cookies de autenticación. Para acceder a la cámara desde otro equipo o publicar la aplicación en internet, se recomienda añadir HTTPS en el proxy frontal, porque los navegadores solo permiten cámara sin TLS cuando el sitio se abre como `localhost`.

## Google Drive

1. Crea una cuenta de servicio en Google Cloud y habilita Google Drive API.
2. Crea una carpeta raíz en Drive y compártela con el correo de la cuenta de servicio como editor.
3. Define `GOOGLE_DRIVE_ENABLED=true`, `GOOGLE_DRIVE_ROOT_FOLDER_ID` y el JSON completo de la cuenta de servicio en `GOOGLE_SERVICE_ACCOUNT_JSON`.

Al crear un evento, la app crea una subcarpeta exclusiva. Cada nueva captura se guarda localmente y también se sube a esa carpeta. Si Drive está desactivado, la aplicación sigue funcionando con almacenamiento local.

## Funciones incluidas

- configuración independiente de nombre, cliente, fecha, lugar, colores, formato, duración y marco PNG por evento;
- captura de video o foto, cuenta regresiva, vista previa y repetición;
- código QR único que dirige a la galería compartible;
- galería responsive con descarga de archivos;
- modo proyección fullscreen con actualización y rotación automáticas;
- modo de proyección en vivo desde la cámara de la cabina y selector para alternar con fotos/videos guardados;
- carga fragmentada de videos para funcionar detrás de proxies con límites de tamaño estrictos;
- conversión automática mediante FFmpeg a MP4/H.264 compatible con móviles, galería y proyección;
- almacenamiento persistente mediante volúmenes Docker;
- integración opcional con Google Drive mediante cuenta de servicio;
- HTTP local en el puerto 8867.

## Marcos y logos

Los marcos incluidos están en `public/frames/`: Gala, Matrimonio, Bautizo, San Valentín, Cumpleaños y Otros eventos. Para sumar una plantilla, agrega un PNG, WebP o SVG transparente en esa carpeta y registra su ruta en `components/EventForm.tsx`.

Medidas recomendadas:

- vertical: 1080 × 1920 px;
- cuadrado: 1080 × 1080 px;
- horizontal: 1920 × 1080 px;
- PNG, WebP o SVG transparente, máximo sugerido 5 MB;
- dejar transparente el área central y un margen seguro mínimo de 80 px.

Para logos se recomienda PNG, WebP o SVG transparente, de 400 a 1000 px de ancho y máximo 2 MB. Se pueden cargar como archivo o URL y ubicar en cualquiera de las cuatro esquinas.

## Alcance siguiente recomendado

La base está preparada para sumar autenticación y roles, plantillas animadas, procesamiento FFmpeg (boomerang, slow motion, reverse, intro/outro y música), cola offline, WhatsApp/email, métricas y control de GoPro/DSLR mediante gateway local.

## Desarrollo sin Docker

Usa Node.js 22, instala dependencias con `pnpm install`, ejecuta `pnpm dev` y abre `http://localhost:3000`. Para probar la cámara desde otro dispositivo, utiliza HTTPS.
