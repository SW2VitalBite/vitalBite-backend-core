# Despliegue Web

## Objetivo

Publicar la aplicación Angular como frontend administrativo de VitalBite.

## Consideraciones

- La Web puede desplegarse como sitio estático.
- Debe apuntar al Core NestJS GraphQL.
- Debe usar HTTPS.
- Debe soportar rutas internas de Angular.
- Debe mantener separación con Mobile React Native.

## Validación

- `/login` carga correctamente.
- Login funciona contra el Core.
- Rutas protegidas bloquean usuarios sin sesión.
- Dashboard consulta datos mediante GraphQL.
- No existen llamadas REST como comunicación principal.
