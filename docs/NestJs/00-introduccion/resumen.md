# Resumen del microservicio NestJS

El microservicio NestJS representa el Core empresarial de VitalBite. Es el backend principal consumido por la aplicación web Angular y la aplicación móvil React Native mediante GraphQL.

Su responsabilidad es centralizar los procesos transaccionales del negocio: usuarios, roles, pacientes, citas, medidas corporales, seguimiento nutricional y dietas.

## Rol dentro de VitalBite

- Expone la API GraphQL principal del sistema.
- Administra la información transaccional almacenada en PostgreSQL/Supabase.
- Aplica reglas de autenticación, autorización y multi-tenant.
- Orquesta comunicación con Documental, IA/ML/DL y Pagos.
- Entrega datos para dashboard, seguimiento y consultas móviles.

## Alcance

Este microservicio no procesa pagos directamente, no almacena archivos binarios y no ejecuta modelos de IA/ML. Para esas responsabilidades se comunica con los microservicios especializados.
