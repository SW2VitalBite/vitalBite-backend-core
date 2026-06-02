# Objetivo del microservicio

El objetivo del Core NestJS es proveer una API GraphQL centralizada para gestionar las operaciones principales de la plataforma VitalBite.

## Objetivos funcionales

- Gestionar usuarios, roles y permisos.
- Registrar y administrar pacientes.
- Gestionar citas nutricionales.
- Registrar medidas corporales.
- Controlar seguimiento nutricional.
- Crear y asignar dietas o planes alimenticios.
- Consultar datos necesarios para dashboard y reportes.

## Objetivos técnicos

- Usar GraphQL como comunicación principal.
- Mantener una arquitectura modular por dominio.
- Persistir datos transaccionales en PostgreSQL/Supabase.
- Aplicar autenticación JWT y autorización por roles.
- Soportar separación multi-tenant mediante `tenant_id`.
- Orquestar servicios externos sin mezclar responsabilidades.
