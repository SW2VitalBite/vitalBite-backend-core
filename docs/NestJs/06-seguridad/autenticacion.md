# Autenticación

La autenticación valida la identidad del usuario que consume la API GraphQL.

## Método principal

- Inicio de sesión con email y contraseña.
- Generación de JWT.
- Uso del token en cada solicitud GraphQL protegida.

## Flujo

1. El usuario envía credenciales.
2. El Core valida las credenciales.
3. El Core genera un JWT.
4. El cliente usa el token en el header de autorización.
5. Los guards validan el token antes de ejecutar resolvers protegidos.

## Header esperado

```text
Authorization: Bearer <token>
```
