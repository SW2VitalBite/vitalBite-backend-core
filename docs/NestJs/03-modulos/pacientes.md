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
