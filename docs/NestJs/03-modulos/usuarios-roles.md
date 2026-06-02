# Módulo de usuarios y roles

## Objetivo

Administrar usuarios, roles, permisos y acceso multi-tenant.

## Actores

- Administrador.
- Nutricionista.
- Paciente.

## Responsabilidades

- Crear usuarios.
- Asignar roles.
- Activar o desactivar cuentas.
- Validar permisos por operación.
- Asociar usuarios a un `tenant_id`.

## Datos principales

- Usuario.
- Rol.
- Permiso.
- Tenant.
- Sesión o refresh token, si aplica.

## Operaciones GraphQL esperadas

- `users`
- `userById`
- `createUser`
- `updateUser`
- `assignRole`
- `disableUser`
