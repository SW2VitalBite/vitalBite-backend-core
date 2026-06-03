# Pantalla de pacientes

## Objetivo

Gestionar pacientes desde la Web.

## Vistas

- Lista de pacientes.
- Filtros por estado, nutricionista y búsqueda.
- Detalle del paciente.
- Formulario de creación y edición.

## Información visible

- Datos personales.
- Estado.
- Objetivo nutricional.
- Nutricionista asignado.
- Historial de citas.
- Medidas, seguimiento, dietas y documentos asociados.

## GraphQL

- `patients(filter)`.
- `patientById(id)`.
- `patientsByNutritionist(nutritionistId)`.
- `createPatient(input)`.
- `updatePatient(id, input)`.
- `archivePatient(id)`.

## Reglas

- Nutricionista solo gestiona pacientes asignados.
- Administrador puede consultar pacientes del tenant.
- Paciente no accede a esta pantalla.
