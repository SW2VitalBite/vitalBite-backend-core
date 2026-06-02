# Flujo general

## Flujo principal GraphQL

1. Angular o React Native envía una query o mutation GraphQL.
2. El resolver recibe la solicitud.
3. Los guards validan JWT, rol, permiso y `tenant_id`.
4. El service ejecuta reglas de negocio.
5. El repository/ORM consulta o modifica PostgreSQL/Supabase.
6. El resolver devuelve la respuesta GraphQL.

## Flujo con microservicios externos

1. El Core recibe una solicitud GraphQL.
2. El Core valida permisos y tenant.
3. El Core consulta un microservicio especializado si la operación lo requiere.
4. El Core consolida la respuesta.
5. El cliente recibe una respuesta GraphQL uniforme.

## Ejemplos

- Para descargar una dieta en PDF, el Core solicita generación al servicio Documental.
- Para validar una operación premium, el Core consulta estado de suscripción al servicio .NET.
- Para mostrar riesgo nutricional, el Core consulta resultados generados por FastAPI o métricas asociadas.
