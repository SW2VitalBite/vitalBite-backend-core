# Variables de entorno

## Variables esperadas

| Variable | Uso |
|---|---|
| `NG_APP_GRAPHQL_URL` | Endpoint GraphQL del Core NestJS |
| `NG_APP_NAME` | Nombre visible de la aplicación |
| `NG_APP_ENV` | Entorno: local, staging o production |
| `NG_APP_TOKEN_STORAGE` | Estrategia de token: localStorage o sessionStorage |
| `NG_APP_ENABLE_GRAPHQL_LOGS` | Habilita logs técnicos en desarrollo |

## Reglas

- No guardar secretos backend en variables del frontend.
- No exponer claves privadas.
- El token JWT se obtiene desde login y se envía en operaciones protegidas.
- La URL GraphQL debe apuntar al Core, no a microservicios secundarios.
