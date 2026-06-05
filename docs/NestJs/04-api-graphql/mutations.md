# Mutations GraphQL

Las mutations permiten crear, actualizar o cambiar estado de recursos del Core. Deben validar JWT, rol, permisos y `tenant_id`.

## Autenticación y usuarios

| Mutation                     | Descripción                      | Acceso        |
| ---------------------------- | -------------------------------- | ------------- |
| `login(input)`               | Autentica usuario y devuelve JWT | Público       |
| `createUser(input)`          | Crea usuario en el tenant        | Administrador |
| `updateUser(id, input)`      | Actualiza datos del usuario      | Administrador |
| `disableUser(id)`            | Desactiva usuario                | Administrador |
| `assignRole(userId, roleId)` | Asigna rol a usuario             | Administrador |

Inputs mínimos:

- `LoginInput`: `email`, `password`
- `CreateUserInput`: `email`, `firstName`, `lastName`, `roleId`
- `UpdateUserInput`: `firstName`, `lastName`, `status`

## Tenants

| Mutation                  | Descripción      | Acceso                                 |
| ------------------------- | ---------------- | -------------------------------------- |
| `createTenant(input)`     | Crea tenant      | Administrador global o proceso interno |
| `updateTenant(id, input)` | Actualiza tenant | Administrador                          |
| `disableTenant(id)`       | Desactiva tenant | Administrador global o proceso interno |

El estado real de plan y suscripción se valida contra el microservicio `.NET + DynamoDB`.

## Pacientes

| Mutation                                                 | Descripción        | Acceso                       |
| -------------------------------------------------------- | ------------------ | ---------------------------- |
| `createPatient(input)`                                   | Registra paciente  | Administrador, nutricionista |
| `updatePatient(id, input)`                               | Actualiza paciente | Administrador, nutricionista |
| `archivePatient(id)`                                     | Archiva paciente   | Administrador, nutricionista |
| `assignPatientToNutritionist(patientId, nutritionistId)` | Asigna paciente    | Administrador                |

Inputs mínimos:

- `CreatePatientInput`: `firstName`, `lastName`, `email`, `phone`, `birthDate`, `gender`, `nutritionGoal`, `clinicalNotes`
- `UpdatePatientInput`: mismos campos opcionales y `status`

## Citas

| Mutation                           | Descripción                | Acceso                                       |
| ---------------------------------- | -------------------------- | -------------------------------------------- |
| `createAppointment(input)`         | Agenda cita                | Administrador, nutricionista, paciente       |
| `confirmAppointment(id)`           | Confirma cita              | Nutricionista, paciente dueño                |
| `rescheduleAppointment(id, input)` | Reprograma cita            | Administrador, nutricionista, paciente dueño |
| `cancelAppointment(id, input)`     | Cancela cita               | Administrador, nutricionista, paciente dueño |
| `completeAppointment(id, input)`   | Marca cita como completada | Nutricionista                                |
| `markAppointmentNoShow(id)`        | Marca inasistencia         | Nutricionista                                |

Inputs mínimos:

- `CreateAppointmentInput`: `patientId`, `nutritionistId`, `scheduledAt`, `durationMinutes`, `mode`, `reason`, `notes`, `status`
- `RescheduleAppointmentInput`: `scheduledAt`, `durationMinutes`, `reason`, `notes`
- `CancelAppointmentInput`: `reason`
- `CompleteAppointmentInput`: `notes`

Reglas implementadas en el slice demo:

- Todas las operaciones se filtran por tenant desde el contexto demo.
- La cita valida que paciente y nutricionista pertenezcan al tenant actual.
- `durationMinutes` debe ser mayor a cero.
- Cancelar cambia estado a `CANCELLED`, guarda motivo y marca `deletedAt`.
- El choque de horario se valida para el mismo nutricionista en citas activas.

## Medidas corporales

| Mutation                           | Descripción                  | Acceso        |
| ---------------------------------- | ---------------------------- | ------------- |
| `createBodyMeasurement(input)`     | Registra medición corporal   | Nutricionista |
| `updateBodyMeasurement(id, input)` | Actualiza medición           | Nutricionista |
| `deleteBodyMeasurement(id)`        | Elimina lógicamente medición | Nutricionista |

Input mínimo:

- `CreateBodyMeasurementInput`: `patientId`, `measuredAt`, `weightKg`, `heightCm`, `waistCm`, `hipCm`

El `bmi` se calcula en el service si existen `weightKg` y `heightCm`.

## Composición corporal

| Mutation                           | Descripción                     | Acceso        |
| ---------------------------------- | ------------------------------- | ------------- |
| `createBodyComposition(input)`     | Registra composición corporal   | Nutricionista |
| `updateBodyComposition(id, input)` | Actualiza composición corporal  | Nutricionista |
| `deleteBodyComposition(id)`        | Elimina lógicamente composición | Nutricionista |

Input mínimo:

- `CreateBodyCompositionInput`: `patientId`, `bodyMeasurementId`, `measuredAt`, `bodyFatPercentage`, `muscleMassKg`, `waterPercentage`, `visceralFatLevel`

Reglas implementadas en el slice demo:

- Todas las operaciones se filtran por tenant desde el contexto demo.
- `measuredAt` no puede ser una fecha futura.
- Los valores corporales deben ser positivos cuando aplican.
- Los porcentajes de composición deben estar entre `0` y `100`.
- Las eliminaciones son lógicas mediante `deletedAt`.

## Seguimiento nutricional

| Mutation                         | Descripción                      | Acceso        |
| -------------------------------- | -------------------------------- | ------------- |
| `createTrackingEntry(input)`     | Registra seguimiento nutricional | Nutricionista |
| `updateTrackingEntry(id, input)` | Actualiza seguimiento            | Nutricionista |
| `deleteTrackingEntry(id)`        | Elimina lógicamente seguimiento  | Nutricionista |

Input mínimo:

- `CreateTrackingEntryInput`: `patientId`, `trackedAt`, `dietCompliancePercentage`, `observations`, `alerts`, `progressStatus`

## Dietas

| Mutation                                 | Descripción                         | Acceso        |
| ---------------------------------------- | ----------------------------------- | ------------- |
| `createDiet(input)`                      | Crea dieta                          | Nutricionista |
| `updateDiet(id, input)`                  | Actualiza dieta                     | Nutricionista |
| `assignDietToPatient(dietId, patientId)` | Asigna dieta a paciente             | Nutricionista |
| `activateDiet(id)`                       | Activa dieta                        | Nutricionista |
| `completeDiet(id)`                       | Finaliza dieta                      | Nutricionista |
| `cancelDiet(id)`                         | Cancela dieta                       | Nutricionista |
| `requestDietPdf(dietId)`                 | Solicita PDF al servicio Documental | Nutricionista |

Input mínimo:

- `CreateDietInput`: `patientId`, `name`, `objective`, `startDate`, `endDate`, `meals`
- `CreateDietMealInput`: `name`, `time`, `order`, `items`
- `CreateDietItemInput`: `sourceType`, `foodCatalogItemId`, `recipeId`, `manualFoodName`, `portion`, `nutritionSnapshot`, `notes`

Reglas:

- Cada `DietItem` debe tener exactamente una fuente: `foodCatalogItemId`, `recipeId` o `manualFoodName`.
- La dieta final debe guardar una foto nutricional (`nutritionSnapshot`) para conservar historial.
- Cambios posteriores en catálogo o receta no deben modificar dietas ya creadas.

## Catálogo nutricional

| Mutation                           | Descripción                     | Acceso                       |
| ---------------------------------- | ------------------------------- | ---------------------------- |
| `createFoodCatalogItem(input)`     | Crea alimento del catálogo      | Administrador, nutricionista |
| `updateFoodCatalogItem(id, input)` | Actualiza alimento del catálogo | Administrador, nutricionista |
| `createRecipe(input)`              | Crea receta reutilizable        | Administrador, nutricionista |
| `updateRecipe(id, input)`          | Actualiza receta                | Administrador, nutricionista |

Inputs mínimos:

- `CreateFoodCatalogItemInput`: `name`, `foodGroup`, `basePortion`, `calories`, `proteins`, `carbs`, `fats`, `micronutrients`, `notes`
- `CreateRecipeInput`: `name`, `description`, `items`
- `CreateRecipeItemInput`: `foodCatalogItemId`, `quantity`, `unit`

## Plantillas de dietas

| Mutation                                               | Descripción                                | Acceso        |
| ------------------------------------------------------ | ------------------------------------------ | ------------- |
| `createDietTemplate(input)`                            | Crea plantilla de dieta                    | Nutricionista |
| `updateDietTemplate(id, input)`                        | Actualiza plantilla                        | Nutricionista |
| `createDietFromTemplate(templateId, patientId, input)` | Genera dieta para paciente desde plantilla | Nutricionista |

Inputs mínimos:

- `CreateDietTemplateInput`: `name`, `objective`, `status`, `meals`
- `CreateDietFromTemplateInput`: `startDate`, `endDate`, `adjustments`

Regla:

- Cada ítem de plantilla debe tener exactamente una fuente: `foodCatalogItemId`, `recipeId` o `manualFoodName`.

## Dietocálculo

| Mutation                          | Descripción                             | Acceso        |
| --------------------------------- | --------------------------------------- | ------------- |
| `saveNutritionCalculation(input)` | Guarda resultado de cálculo nutricional | Nutricionista |

Input mínimo:

- `SaveNutritionCalculationInput`: `dietId`, `totalCalories`, `totalProteins`, `totalCarbs`, `totalFats`, `micronutrients`

Reglas:

- `saveNutritionCalculation(input)` persiste historial.
- `dietId` es obligatorio.
- `patientId` se deriva desde la dieta asociada.
- No se permiten cálculos persistidos sin dieta.

## Seguimiento diario

| Mutation                             | Descripción                                   | Acceso                                 |
| ------------------------------------ | --------------------------------------------- | -------------------------------------- |
| `createDailyTrackingEntry(input)`    | Registra seguimiento diario                   | Paciente dueño                         |
| `requestDailyFoodPhotoUpload(input)` | Solicita URL prefirmada para foto de alimento | Paciente dueño                         |
| `addDailyFoodPhoto(input)`           | Agrega foto de alimento al seguimiento        | Paciente dueño                         |
| `addPhysicalActivityEntry(input)`    | Agrega actividad física al seguimiento        | Paciente dueño                         |
| `createPatientGoal(input)`           | Crea meta del paciente                        | Paciente dueño, nutricionista asignado |
| `updatePatientGoal(id, input)`       | Actualiza meta del paciente                   | Paciente dueño, nutricionista asignado |
| `completePatientGoal(id)`            | Marca meta como completada                    | Paciente dueño, nutricionista asignado |
| `cancelPatientGoal(id)`              | Cancela meta del paciente                     | Paciente dueño, nutricionista asignado |

Inputs mínimos:

- `CreateDailyTrackingEntryInput`: `patientId`, `dietId`, `trackedAt`, `adherencePercentage`, `mood`, `patientNotes`
- `RequestDailyFoodPhotoUploadInput`: `dailyTrackingEntryId`, `fileName`, `mimeType`, `mealName`
- `AddDailyFoodPhotoInput`: `dailyTrackingEntryId`, `documentMetadataId`, `mealName`, `description`, `capturedAt`
- `AddPhysicalActivityEntryInput`: `dailyTrackingEntryId`, `activityType`, `durationMinutes`, `intensity`, `caloriesBurned`
- `CreatePatientGoalInput`: `patientId`, `title`, `targetDate`
- `UpdatePatientGoalInput`: `title`, `targetDate`, `status`

Flujo documental de fotos:

1. `requestDailyFoodPhotoUpload(input)` solicita al servicio Documental una URL prefirmada y crea metadato.
2. La app móvil sube el binario a S3 usando la URL prefirmada.
3. `addDailyFoodPhoto(input)` vincula `documentMetadataId` al seguimiento diario.
4. El Core guarda solo metadatos y referencias; el binario vive en S3.

## Antropometría avanzada

| Mutation                                | Descripción                   | Acceso        |
| --------------------------------------- | ----------------------------- | ------------- |
| `createAnthropometryMeasurement(input)` | Registra pliegues y diámetros | Nutricionista |
| `calculateSomatotype(input)`            | Calcula o registra somatotipo | Nutricionista |

Inputs mínimos:

- `CreateAnthropometryMeasurementInput`: `patientId`, `bodyMeasurementId`, `measuredAt`, `tricepsSkinfoldMm`, `subscapularSkinfoldMm`, `suprailiacSkinfoldMm`, `calfSkinfoldMm`, `humerusDiameterCm`, `femurDiameterCm`, `contractedArmCircumferenceCm`, `calfCircumferenceCm`
- `CalculateSomatotypeInput`: `patientId`, `anthropometryMeasurementId`

## Reportes y documentos

| Mutation                         | Descripción                   | Acceso                                       |
| -------------------------------- | ----------------------------- | -------------------------------------------- |
| `requestPatientReport(input)`    | Solicita reporte nutricional  | Nutricionista                                |
| `refreshDocumentUrl(documentId)` | Solicita nueva URL prefirmada | Administrador, nutricionista, paciente dueño |
| `markReportAsViewed(reportId)`   | Marca reporte como visto      | Administrador, nutricionista                 |

El Core no genera PDFs ni escribe en S3. Solo solicita el proceso al microservicio Spring Boot y guarda metadatos.

## Pagos y suscripciones

| Mutation                   | Descripcion                            | Acceso        |
| -------------------------- | -------------------------------------- | ------------- |
| `requestPlanChange(input)` | Registra solicitud pendiente de cambio | Administrador |
| `approvePlanChange(input)` | Aprueba solicitud y aplica nuevo plan  | Administrador |
| `rejectPlanChange(input)`  | Rechaza solicitud pendiente            | Administrador |

Input minimo:

- `RequestPlanChangeInput`: `planCode`, `comment?`
- `ResolvePlanChangeInput`: `requestId`, `comment?`

Reglas:

- La solicitud nueva queda en estado `PENDING`.
- Al aprobar, cambia el plan activo del tenant en el microservicio de pagos.
- Al rechazar, no cambia el plan activo.
- No procesa pagos reales.
- No persiste datos financieros en PostgreSQL del Core.

## Reglas generales

- Las mutations de escritura deben generar eventos auditables cuando cambian información crítica.
- Las operaciones premium deben validar plan y límites con `.NET + DynamoDB`.
- Ninguna mutation debe crear registros de pagos o suscripciones en PostgreSQL del Core.
- Las eliminaciones deben ser lógicas cuando el dato sea clínico, histórico o auditable.
