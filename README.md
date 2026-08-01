# Orbit 360 Photobooth

MVP de Photobooth 360 para administrar eventos, capturar fotos y videos desde el navegador, personalizar la experiencia, proyectar una galería en otra pantalla, compartir mediante QR y respaldar cada evento en su propia carpeta de Google Drive.

## Inicio rápido con Docker

1. Copia `.env.example` a `.env` y ajusta las variables opcionales.
2. Ejecuta `docker compose up --build -d`.
3. Abre `https://localhost:8867` y acepta el certificado local generado por Caddy.

La cámara del navegador requiere un contexto seguro. Por eso la instalación local usa HTTPS. `SECURE_COOKIE=false` queda definido según el requisito del entorno local; el MVP aún no emite cookies de autenticación.

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
- almacenamiento persistente mediante volúmenes Docker;
- integración opcional con Google Drive mediante cuenta de servicio;
- HTTPS local en el puerto 8867.

## Alcance siguiente recomendado

La base está preparada para sumar autenticación y roles, plantillas animadas, procesamiento FFmpeg (boomerang, slow motion, reverse, intro/outro y música), cola offline, WhatsApp/email, métricas y control de GoPro/DSLR mediante gateway local.

## Desarrollo sin Docker

Usa Node.js 22, instala dependencias con `pnpm install`, ejecuta `pnpm dev` y abre `http://localhost:3000`. Para probar la cámara desde otro dispositivo, utiliza HTTPS.
