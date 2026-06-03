# Rutas protegidas

## Guards esperados

- `AuthGuard`: requiere usuario autenticado.
- `RoleGuard`: valida rol administrador o nutricionista.
- `PermissionGuard`: valida permisos por módulo.

## Rutas públicas

- `/login`

## Rutas protegidas

- `/dashboard`
- `/patients`
- `/patients/:id`
- `/appointments`
- `/body-measurements`
- `/nutrition-tracking`
- `/diets`
- `/nutrition-catalog`
- `/diet-templates`
- `/anthropometry`
- `/documents-reports`
- `/payments-subscriptions`
- `/settings`

## Reglas

- Redirigir a `/login` si no hay sesión.
- Redirigir a `/dashboard` si el usuario autenticado entra a `/login`.
- Ocultar rutas y acciones sin permiso.
