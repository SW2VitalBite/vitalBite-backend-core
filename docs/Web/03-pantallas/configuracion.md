# Pantalla de configuración

## Objetivo

Administrar preferencias visibles, perfil y datos generales del tenant según permisos.

## Funciones

- Consultar usuario autenticado.
- Consultar tenant actual.
- Ver rol y permisos.
- Configurar preferencias visuales o de operación.
- Administrar usuarios si el rol lo permite.

## GraphQL

- `me`.
- `currentTenant`.
- `users(filter)`.
- `roles`.
- `permissions`.
- `updateUser(id, input)`.
- `assignRole(userId, roleId)`.

## Reglas

- Administrador gestiona usuarios y roles.
- Nutricionista solo consulta información propia y permisos visibles.
- La configuración no modifica tecnologías ni comunicación principal.
