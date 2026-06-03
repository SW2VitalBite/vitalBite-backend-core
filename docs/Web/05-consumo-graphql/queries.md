# Queries GraphQL usadas por Web

## Autenticación y usuario

- `me`.
- `currentTenant`.

## Operación nutricional

- `patients(filter)`.
- `patientById(id)`.
- `appointments(filter)`.
- `appointmentsCalendar(filter)`.
- `bodyMeasurementsByPatient(patientId)`.
- `bodyCompositionByPatient(patientId)`.
- `trackingByPatient(patientId)`.
- `dailyTrackingByPatient(patientId, filter)`.
- `patientGoals(patientId)`.
- `diets(filter)`.
- `dietById(id)`.
- `foodCatalog(filter)`.
- `recipes(filter)`.
- `dietTemplates(filter)`.
- `calculateDietNutrition(input)`.
- `anthropometryByPatient(patientId)`.
- `latestSomatotype(patientId)`.

## Reportes y dashboard

- `dashboardSummary(filter)`.
- `patientProgressDashboard(patientId)`.
- `reports(filter)`.
- `documentsByPatient(patientId)`.

## Reglas

- Todas las queries protegidas usan JWT.
- El service debe transformar respuestas GraphQL a modelos de vista.
