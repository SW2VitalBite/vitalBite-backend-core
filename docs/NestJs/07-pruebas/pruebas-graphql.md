# Pruebas GraphQL

Las pruebas GraphQL validan queries y mutations expuestas por el Core.

## Objetivo

- Verificar schema.
- Validar queries principales.
- Validar mutations principales.
- Confirmar errores de autorización.
- Confirmar estructura de respuesta.

## Casos sugeridos

- `login` devuelve token.
- `patients` requiere autenticación.
- `createPatient` requiere permiso.
- `appointments` filtra por tenant.
- `foodCatalog` lista alimentos del tenant.
- `createFoodCatalogItem` requiere rol administrador o nutricionista.
- `createRecipe` valida alimentos del mismo tenant.
- `dietTemplates` lista plantillas del nutricionista o tenant.
- `createDietFromTemplate` genera dieta para un paciente asignado.
- `createDiet` rechaza ítems con más de una fuente alimenticia.
- `createDiet` guarda snapshot nutricional del ítem.
- `calculateDietNutrition` devuelve calorías, macronutrientes y micronutrientes.
- `saveNutritionCalculation` rechaza cálculos sin `dietId`.
- `createDailyTrackingEntry` permite al paciente registrar su propio seguimiento.
- `requestDailyFoodPhotoUpload` devuelve metadato documental y URL prefirmada.
- `addDailyFoodPhoto` vincula `documentMetadataId` al seguimiento.
- `patientGoals` lista metas del paciente autenticado o asignado.
- `createPatientGoal` permite crear meta propia o de paciente asignado.
- `dailyTrackingByPatient` impide consultar seguimiento de otro paciente.
- `createAnthropometryMeasurement` requiere rol nutricionista.
- `calculateSomatotype` rechaza datos incompletos con error controlado.
- `latestSomatotype` devuelve el último resultado calculado.
- `requestDietPdf` devuelve información documental.

## Validaciones esperadas

- Código de error controlado.
- Respuesta GraphQL consistente.
- No exposición de datos sensibles.
