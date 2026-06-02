# Variables de entorno

Variables esperadas para el microservicio Core NestJS.

| Variable | Descripción |
|---|---|
| `NODE_ENV` | Entorno de ejecución: `development`, `test` o `production` |
| `PORT` | Puerto HTTP del servicio |
| `DATABASE_URL` | URL de conexión a PostgreSQL/Supabase |
| `JWT_SECRET` | Secreto para firmar tokens JWT |
| `JWT_EXPIRES_IN` | Tiempo de expiración del token |
| `PAYMENTS_SERVICE_URL` | URL del microservicio .NET de pagos |
| `DOCUMENTS_SERVICE_URL` | URL del microservicio Spring Boot documental |
| `AI_SERVICE_URL` | URL del microservicio FastAPI |
| `CORS_ORIGIN` | Origen permitido para clientes web/móvil |

## Reglas

- No guardar secretos reales en documentación.
- No versionar `.env` con credenciales.
- Usar valores separados por ambiente.
