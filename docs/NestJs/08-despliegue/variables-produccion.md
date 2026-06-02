# Variables de producción

Las variables de producción deben configurarse en el proveedor cloud, no en archivos versionados.

## Variables críticas

- `NODE_ENV=production`
- `PORT`
- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `PAYMENTS_SERVICE_URL`
- `DOCUMENTS_SERVICE_URL`
- `AI_SERVICE_URL`
- `CORS_ORIGIN`

## Reglas

- Usar secretos seguros.
- Separar ambientes.
- Rotar credenciales si se exponen.
- Validar URLs de microservicios antes del despliegue.
