# Rutas protegidas

## Guards esperados

- `AuthGuard`: requiere usuario autenticado.
- `RoleGuard`: valida rol administrador o nutricionista.
- `PermissionGuard`: valida permisos por módulo.

## Rutas públicas

- `/`
- `/login`
- `/register`

## Rutas protegidas

- `/dashboard`
- `/patients`
- `/patients/:id`
- `/patients/:id/measurements`
- `/patients/:id/diets`
- `/patients/:id/diets/:dietId/edit`
- `/appointments`
- `/nutrition-tracking`
- `/nutrition-catalog`
- `/diet-templates`
- `/anthropometry`
- `/documents-reports`
- `/payments-subscriptions`
- `/settings`

## Reglas

- Redirigir a `/login` si no hay sesión.
- Redirigir a `/dashboard` si el usuario autenticado entra a `/login` o `/register`.
- Ocultar rutas y acciones sin permiso.

## Implementación actual

- `authGuard`: valida token y carga el contexto del usuario antes de entrar al layout interno.
- `roleGuard`: permite `ADMINISTRADOR`, `ADMIN` y `NUTRICIONISTA` en la Web.
- `permissionGuard`: valida permisos por módulo desde un mapa local temporal basado en `roleCode`.
- Cuando el Core exponga permisos explícitos por usuario, el mapa local debe reemplazarse por permisos servidos desde GraphQL.
- `/payments-subscriptions` requiere `payments:read`; en la implementacion V1 solo lo recibe el administrador.
