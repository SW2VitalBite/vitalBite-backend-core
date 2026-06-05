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

## Pagos y suscripciones V1

En desarrollo local, el Core consulta el microservicio .NET mediante:

```env
PAYMENTS_SERVICE_URL=http://localhost:5100
```

## Variables agregadas para el slice de pacientes

| Variable | Descripcion |
|---|---|
| `DATABASE_URL` | Obligatoria para Prisma CLI, migraciones, seed y runtime local |
| `DEMO_USER_EMAIL` | Usuario demo que actua como contexto temporal sin JWT |
| `GRAPHQL_LOG_RESPONSES` | Activa logs de consultas, variables y respuestas GraphQL en terminal |

`DEMO_USER_EMAIL` se mantiene solo hasta implementar autenticacion real con JWT.
