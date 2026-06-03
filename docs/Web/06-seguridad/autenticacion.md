# Autenticación

## Método principal

La Web usa JWT obtenido mediante `login(input)` del Core GraphQL.

## Flujo

1. Usuario envía email y contraseña.
2. `AuthService` ejecuta mutation `login`.
3. El Core devuelve `accessToken` y datos del usuario.
4. La Web guarda token según estrategia configurada.
5. El interceptor agrega token a operaciones protegidas.

## Reglas

- No guardar contraseña.
- No mostrar token en pantalla.
- Cerrar sesión elimina token y estado local.
- Si el rol es paciente, bloquear acceso Web.
