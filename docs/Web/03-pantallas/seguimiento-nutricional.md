# Pantalla de seguimiento nutricional

## Objetivo

Visualizar el progreso clínico y diario del paciente.

## Funciones

- Registrar observaciones del nutricionista.
- Consultar cumplimiento de dieta.
- Revisar alertas.
- Consultar seguimiento diario del paciente.
- Revisar fotos de alimentos, actividad física, ánimo y metas.
- Visualizar resumen de progreso.

## GraphQL

- `trackingByPatient(patientId)`.
- `trackingSummary(patientId)`.
- `dailyTrackingByPatient(patientId, filter)`.
- `patientGoals(patientId)`.
- `createTrackingEntry(input)`.
- `updateTrackingEntry(id, input)`.

## Reglas

- Nutricionista registra seguimiento clínico.
- Paciente registra seguimiento diario desde React Native.
- La Web muestra el seguimiento diario como consulta para nutricionista y administrador autorizado.
