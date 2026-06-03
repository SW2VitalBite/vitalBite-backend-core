# Pantalla de medidas corporales

## Objetivo

Registrar y consultar evolución corporal del paciente.

## Funciones

- Registrar peso, talla e IMC.
- Registrar perímetros.
- Registrar composición corporal.
- Consultar historial de mediciones.
- Ver gráficos de evolución.

## GraphQL

- `bodyMeasurementsByPatient(patientId)`.
- `bodyMeasurementById(id)`.
- `bodyCompositionByPatient(patientId)`.
- `latestBodyComposition(patientId)`.
- `createBodyMeasurement(input)`.
- `updateBodyMeasurement(id, input)`.
- `createBodyComposition(input)`.
- `updateBodyComposition(id, input)`.

## Reglas

- El IMC puede calcularse en backend.
- Las mediciones son históricas.
- La eliminación debe ser lógica.
