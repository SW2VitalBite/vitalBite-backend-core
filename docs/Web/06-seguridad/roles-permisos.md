# Roles y permisos

## Roles Web

- Administrador.
- Nutricionista.

El paciente no usa la Web.

## Permisos relevantes

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
- `patient-goals:read`
- `patient-goals:write`
- `advanced-anthropometry:read`
- `advanced-anthropometry:write`
- `dashboard:read`
- `payments:read`
- `documents:request`

## Reglas

- La Web oculta acciones sin permiso.
- El backend conserva la validación final.
- Nutricionista trabaja sobre pacientes asignados.
- Administrador trabaja sobre el tenant según permisos.
- Pagos y suscripciones usa `payments:read` y queda reservado al administrador.
