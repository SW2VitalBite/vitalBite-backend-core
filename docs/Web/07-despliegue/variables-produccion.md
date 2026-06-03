# Variables de producción

## Variables críticas

| Variable | Uso |
|---|---|
| `NG_APP_GRAPHQL_URL` | Endpoint público del Core GraphQL |
| `NG_APP_ENV` | Valor `production` |
| `NG_APP_TOKEN_STORAGE` | Estrategia de sesión permitida |
| `NG_APP_ENABLE_GRAPHQL_LOGS` | Debe estar deshabilitada en producción |

## Reglas

- Usar HTTPS.
- No exponer secretos.
- Configurar CORS en Core para el dominio de la Web.
- Verificar que GraphQL siga siendo el canal principal.
