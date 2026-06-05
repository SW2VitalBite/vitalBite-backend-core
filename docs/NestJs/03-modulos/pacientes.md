# Módulo de pacientes

## Objetivo

Gestionar la información clínica y administrativa de los pacientes.

## Actor principal

- Nutricionista.

## Responsabilidades

- Registrar pacientes.
- Actualizar datos personales.
- Consultar historial básico.
- Asociar paciente con nutricionista y tenant.
- Mantener estado del paciente.

## Datos principales

- Datos personales.
- Antecedentes.
- Objetivos nutricionales.
- Estado.
- Nutricionista asignado.

## Operaciones GraphQL esperadas

- `patients`
- `patientById`
- `createPatient`
- `updatePatient`
- `disablePatient`

## Estado implementado

El primer slice funcional del Core implementa este modulo con PostgreSQL local, Prisma y GraphQL Code First.

Operaciones disponibles:

- `patients(filter)`
- `patientById(id)`
- `patientsByNutritionist(nutritionistId)`
- `createPatient(input)`
- `updatePatient(id, input)`
- `archivePatient(id)`
- `assignPatientToNutritionist(patientId, nutritionistId)`

Reglas implementadas:

- Filtro por tenant desde contexto demo.
- Busqueda por nombre, apellido, email o telefono.
- Filtros por estado, nutricionista y fecha de registro.
- Archivado logico con `status = ARCHIVED` y `deletedAt`.
- Validacion de nombre, apellido, email, enums y fecha de nacimiento no futura.

El seed crea `Clinica Central`, nutricionistas demo y pacientes alineados a los prototipos exportados.
