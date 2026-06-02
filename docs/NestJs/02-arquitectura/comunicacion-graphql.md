# Comunicación GraphQL

GraphQL es el mecanismo principal de comunicación entre los clientes y el Core NestJS.

## Endpoint

```text
/graphql
```

## Tipos de operación

- **Queries:** lectura de datos.
- **Mutations:** creación, actualización o eliminación lógica.
- **Resolvers:** implementación de operaciones GraphQL.

## Reglas

- Los clientes no deben consumir directamente la base de datos.
- El Core debe aplicar validación de tenant en cada resolver protegido.
- Las respuestas deben evitar exponer datos de otros tenants.
- Las operaciones administrativas deben validar rol y permiso.

## Comunicación con otros servicios

Aunque el Core use GraphQL hacia clientes, puede invocar servicios especializados mediante APIs internas. Estas integraciones no reemplazan GraphQL como comunicación principal del sistema.
