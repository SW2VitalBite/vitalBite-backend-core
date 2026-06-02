# Despliegue en nube

El Core NestJS se desplegará en AWS según la arquitectura general de VitalBite.

## Objetivo

- Publicar el endpoint GraphQL principal.
- Conectar con PostgreSQL/Supabase.
- Comunicarse con microservicios externos.
- Operar de forma segura con variables de entorno.

## Pasos generales

1. Preparar build de producción.
2. Configurar variables de entorno.
3. Configurar conexión a PostgreSQL/Supabase.
4. Configurar URLs de .NET, Spring Boot y FastAPI.
5. Desplegar contenedor o servicio.
6. Verificar endpoint GraphQL.

## Validación

- El endpoint GraphQL responde.
- El login funciona.
- El Core accede a PostgreSQL/Supabase.
- El Core puede comunicarse con microservicios externos.
