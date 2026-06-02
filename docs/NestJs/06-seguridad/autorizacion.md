# Autorización

La autorización define qué acciones puede ejecutar cada usuario autenticado.

## Niveles

- Autenticación obligatoria.
- Validación de rol.
- Validación de permiso.
- Validación de tenant.
- Validación de propiedad del recurso.

## Reglas

- El administrador gestiona usuarios, roles y dashboard.
- El nutricionista gestiona pacientes, citas, medidas, dietas y seguimiento.
- El paciente solo consulta y actualiza información permitida de su propio perfil.

## Aplicación

La autorización debe aplicarse mediante guards y decoradores en resolvers GraphQL.
