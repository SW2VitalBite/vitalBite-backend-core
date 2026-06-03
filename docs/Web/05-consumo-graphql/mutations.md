# Mutations GraphQL usadas por Web

## Autenticación

- `login(input)`.

## Gestión operativa

- `createPatient(input)`.
- `updatePatient(id, input)`.
- `createAppointment(input)`.
- `rescheduleAppointment(id, input)`.
- `cancelAppointment(id, input)`.
- `completeAppointment(id, input)`.
- `createBodyMeasurement(input)`.
- `createBodyComposition(input)`.
- `createTrackingEntry(input)`.
- `createDiet(input)`.
- `updateDiet(id, input)`.
- `createDietFromTemplate(templateId, patientId, input)`.
- `saveNutritionCalculation(input)`.
- `requestDietPdf(dietId)`.

## Nutrición avanzada

- `createFoodCatalogItem(input)`.
- `updateFoodCatalogItem(id, input)`.
- `createRecipe(input)`.
- `updateRecipe(id, input)`.
- `createDietTemplate(input)`.
- `updateDietTemplate(id, input)`.
- `createAnthropometryMeasurement(input)`.
- `calculateSomatotype(input)`.
- `createPatientGoal(input)`.
- `updatePatientGoal(id, input)`.
- `completePatientGoal(id)`.
- `cancelPatientGoal(id)`.

## Reglas

- Las mutations deben mostrar estado de carga.
- Los errores GraphQL se muestran con mensajes controlados.
- Operaciones críticas deben pedir confirmación visual.
