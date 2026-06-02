# Docker

Docker permite empaquetar el microservicio NestJS para despliegue.

## Objetivo

- Ejecutar el Core en ambiente reproducible.
- Facilitar despliegue en nube.
- Separar configuración por variables de entorno.

## Elementos esperados

- `Dockerfile`.
- `.dockerignore`.
- Variables de entorno.
- Comando de inicio productivo.

## Consideraciones

- No copiar `.env` con secretos reales.
- Ejecutar build antes de iniciar producción.
- Configurar conexión segura a PostgreSQL/Supabase.
