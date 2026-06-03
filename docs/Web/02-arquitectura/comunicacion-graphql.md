# Comunicación GraphQL

GraphQL es el mecanismo principal de comunicación entre la Web Angular y el Core NestJS.

## Endpoint

La Web usa la variable `NG_APP_GRAPHQL_URL`.

## Patrón de consumo

1. La pantalla invoca un service Angular.
2. El service ejecuta query o mutation GraphQL.
3. El interceptor agrega JWT si existe sesión.
4. El Core valida token, rol, permisos y tenant.
5. La respuesta se transforma en modelo de vista.

## Reglas

- No consumir REST como canal principal.
- No llamar directamente a Documental, FastAPI o .NET desde la Web salvo decisión técnica justificada.
- Centralizar errores GraphQL en un manejador común.
- Mantener queries y mutations agrupadas por dominio.
