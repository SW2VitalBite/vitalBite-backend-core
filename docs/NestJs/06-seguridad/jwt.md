# JWT

El JWT contiene la información mínima para identificar al usuario y aplicar seguridad.

## Claims sugeridos

| Claim | Descripción |
|---|---|
| `sub` | ID del usuario |
| `email` | Correo del usuario |
| `role` | Rol principal |
| `tenant_id` | Tenant al que pertenece |
| `permissions` | Lista de permisos o alcance |

## Reglas

- El token debe expirar.
- El secreto no debe versionarse.
- El `tenant_id` debe usarse para filtrar datos.
- No incluir información sensible innecesaria.
