# Troubleshooting

## Error de conexión a base de datos

Verificar:

- `DATABASE_URL`.
- Acceso de red.
- Credenciales.
- Estado de PostgreSQL/Supabase.

## Error de autenticación

Verificar:

- `JWT_SECRET`.
- Expiración del token.
- Header `Authorization`.
- Formato `Bearer <token>`.

## Error de CORS

Verificar:

- `CORS_ORIGIN`.
- Dominio del frontend Angular.
- Configuración del ambiente.

## Error comunicando microservicios

Verificar:

- `PAYMENTS_SERVICE_URL`.
- `DOCUMENTS_SERVICE_URL`.
- `AI_SERVICE_URL`.
- Disponibilidad de cada servicio.
- Logs del Core.

## Error GraphQL

Verificar:

- Schema.
- Resolver.
- Guards.
- Permisos.
- Datos enviados en input.
