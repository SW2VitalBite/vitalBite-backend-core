# Arquitectura general Web

La Web Angular se organiza como una aplicación modular orientada a panel administrativo.

## Capas principales

- **Pages:** pantallas asociadas a rutas.
- **Components UI:** elementos reutilizables como tablas, formularios, gráficos y modales.
- **Services:** consumo GraphQL y lógica de coordinación por dominio.
- **Models:** interfaces TypeScript para datos usados por vistas.
- **Guards:** protección de rutas por autenticación, rol y permisos.
- **Interceptors:** inyección de token y manejo transversal de errores.

## Integración principal

Angular consume el Core NestJS mediante GraphQL.

```text
Angular Web
  ↓ GraphQL
Core NestJS
  ↓ integraciones internas
Documental / FastAPI / .NET
```

## Regla central

La Web no llama directamente a microservicios secundarios como canal principal. El Core GraphQL conserva el contrato central del sistema.
