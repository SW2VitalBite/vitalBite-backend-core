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
- El nutricionista gestiona pacientes asignados, citas, medidas, dietas, seguimiento, catálogo nutricional, plantillas, dietocálculo y antropometría avanzada.
- El paciente solo consulta y actualiza información permitida de su propio perfil.
- El paciente puede registrar seguimiento diario propio.
- El paciente puede crear, actualizar, completar o cancelar metas propias.
- El paciente no administra catálogo nutricional, plantillas ni antropometría avanzada.
- El nutricionista puede consultar y gestionar metas de pacientes asignados.
- El nutricionista puede registrar antropometría avanzada solo para pacientes asignados.

## Aplicación

La autorización debe aplicarse mediante guards y decoradores en resolvers GraphQL.
