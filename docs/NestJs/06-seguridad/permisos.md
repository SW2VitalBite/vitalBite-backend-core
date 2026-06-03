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
- `nutrition-catalog:read`
- `nutrition-catalog:write`
- `diet-templates:read`
- `diet-templates:write`
- `nutrition-calculation:read`
- `nutrition-calculation:write`
- `daily-tracking:read`
- `daily-tracking:write`
- `patient-goals:read`
- `patient-goals:write`
- `advanced-anthropometry:read`
- `advanced-anthropometry:write`
- `dashboard:read`
- `documents:request`

## Reglas

- Los permisos se asignan por rol.
- Los permisos deben validarse en resolvers protegidos.
- Las operaciones críticas deben generar eventos de auditoría.
- El paciente solo debe recibir permisos sobre recursos propios.
- El nutricionista solo debe gestionar recursos de pacientes asignados o del tenant.
