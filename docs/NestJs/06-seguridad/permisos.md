# Permisos

Los permisos controlan acciones específicas dentro del Core.

## Permisos sugeridos

- `users:read`
- `users:write`
- `patients:read`
- `patients:write`
- `appointments:read`
- `appointments:write`
- `measures:read`
- `measures:write`
- `tracking:read`
- `tracking:write`
- `diets:read`
- `diets:write`
- `dashboard:read`
- `documents:request`

## Reglas

- Los permisos se asignan por rol.
- Los permisos deben validarse en resolvers protegidos.
- Las operaciones críticas deben generar eventos de auditoría.
