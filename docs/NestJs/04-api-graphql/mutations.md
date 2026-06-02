# Mutations GraphQL

Las mutations permiten crear, actualizar o cambiar estado de recursos del Core. Deben validar JWT, rol, permisos y `tenant_id`.

## Autenticación y usuarios

| Mutation | Descripción | Acceso |
|---|---|---|
| `login(input)` | Autentica usuario y devuelve JWT | Público |
| `createUser(input)` | Crea usuario en el tenant | Administrador |
| `updateUser(id, input)` | Actualiza datos del usuario | Administrador |
| `disableUser(id)` | Desactiva usuario | Administrador |
| `assignRole(userId, roleId)` | Asigna rol a usuario | Administrador |

Inputs mínimos:

- `LoginInput`: `email`, `password`
- `CreateUserInput`: `email`, `firstName`, `lastName`, `roleId`
- `UpdateUserInput`: `firstName`, `lastName`, `status`

## Tenants

| Mutation | Descripción | Acceso |
|---|---|---|
| `createTenant(input)` | Crea tenant | Administrador global o proceso interno |
| `updateTenant(id, input)` | Actualiza tenant | Administrador |
| `disableTenant(id)` | Desactiva tenant | Administrador global o proceso interno |

El estado real de plan y suscripción se valida contra el microservicio `.NET + DynamoDB`.

## Pacientes

| Mutation | Descripción | Acceso |
|---|---|---|
| `createPatient(input)` | Registra paciente | Administrador, nutricionista |
| `updatePatient(id, input)` | Actualiza paciente | Administrador, nutricionista |
| `archivePatient(id)` | Archiva paciente | Administrador, nutricionista |
| `assignPatientToNutritionist(patientId, nutritionistId)` | Asigna paciente | Administrador |

Inputs mínimos:

- `CreatePatientInput`: `firstName`, `lastName`, `email`, `phone`, `birthDate`, `gender`, `nutritionGoal`, `clinicalNotes`
- `UpdatePatientInput`: mismos campos opcionales y `status`

## Citas

| Mutation | Descripción | Acceso |
|---|---|---|
| `createAppointment(input)` | Agenda cita | Administrador, nutricionista, paciente |
| `confirmAppointment(id)` | Confirma cita | Nutricionista, paciente dueño |
| `rescheduleAppointment(id, input)` | Reprograma cita | Administrador, nutricionista, paciente dueño |
| `cancelAppointment(id, input)` | Cancela cita | Administrador, nutricionista, paciente dueño |
| `completeAppointment(id, input)` | Marca cita como completada | Nutricionista |
| `markAppointmentNoShow(id)` | Marca inasistencia | Nutricionista |

Inputs mínimos:

- `CreateAppointmentInput`: `patientId`, `nutritionistId`, `scheduledAt`, `durationMinutes`, `reason`
- `RescheduleAppointmentInput`: `scheduledAt`, `durationMinutes`, `reason`
- `CancelAppointmentInput`: `reason`

## Medidas corporales

| Mutation | Descripción | Acceso |
|---|---|---|
| `createBodyMeasurement(input)` | Registra medición corporal | Nutricionista |
| `updateBodyMeasurement(id, input)` | Actualiza medición | Nutricionista |
| `deleteBodyMeasurement(id)` | Elimina lógicamente medición | Nutricionista |

Input mínimo:

- `CreateBodyMeasurementInput`: `patientId`, `measuredAt`, `weightKg`, `heightCm`, `waistCm`, `hipCm`

El `bmi` puede calcularse en el service si existen `weightKg` y `heightCm`.

## Composición corporal

| Mutation | Descripción | Acceso |
|---|---|---|
| `createBodyComposition(input)` | Registra composición corporal | Nutricionista |
| `updateBodyComposition(id, input)` | Actualiza composición corporal | Nutricionista |
| `deleteBodyComposition(id)` | Elimina lógicamente composición | Nutricionista |

Input mínimo:

- `CreateBodyCompositionInput`: `patientId`, `bodyMeasurementId`, `measuredAt`, `bodyFatPercentage`, `muscleMassKg`, `waterPercentage`, `visceralFatLevel`

## Seguimiento nutricional

| Mutation | Descripción | Acceso |
|---|---|---|
| `createTrackingEntry(input)` | Registra seguimiento nutricional | Nutricionista |
| `updateTrackingEntry(id, input)` | Actualiza seguimiento | Nutricionista |
| `deleteTrackingEntry(id)` | Elimina lógicamente seguimiento | Nutricionista |

Input mínimo:

- `CreateTrackingEntryInput`: `patientId`, `trackedAt`, `dietCompliancePercentage`, `observations`, `alerts`, `progressStatus`

## Dietas

| Mutation | Descripción | Acceso |
|---|---|---|
| `createDiet(input)` | Crea dieta | Nutricionista |
| `updateDiet(id, input)` | Actualiza dieta | Nutricionista |
| `assignDietToPatient(dietId, patientId)` | Asigna dieta a paciente | Nutricionista |
| `activateDiet(id)` | Activa dieta | Nutricionista |
| `completeDiet(id)` | Finaliza dieta | Nutricionista |
| `cancelDiet(id)` | Cancela dieta | Nutricionista |
| `requestDietPdf(dietId)` | Solicita PDF al servicio Documental | Nutricionista |

Input mínimo:

- `CreateDietInput`: `patientId`, `name`, `objective`, `startDate`, `endDate`, `meals`
- `CreateDietMealInput`: `name`, `time`, `order`, `items`
- `CreateDietItemInput`: `foodName`, `portion`, `calories`, `proteins`, `carbs`, `fats`, `notes`

## Reportes y documentos

| Mutation | Descripción | Acceso |
|---|---|---|
| `requestPatientReport(input)` | Solicita reporte nutricional | Nutricionista |
| `refreshDocumentUrl(documentId)` | Solicita nueva URL prefirmada | Administrador, nutricionista, paciente dueño |
| `markReportAsViewed(reportId)` | Marca reporte como visto | Administrador, nutricionista |

El Core no genera PDFs ni escribe en S3. Solo solicita el proceso al microservicio Spring Boot y guarda metadatos.

## Reglas generales

- Las mutations de escritura deben generar eventos auditables cuando cambian información crítica.
- Las operaciones premium deben validar plan y límites con `.NET + DynamoDB`.
- Ninguna mutation debe crear registros de pagos o suscripciones en PostgreSQL del Core.
- Las eliminaciones deben ser lógicas cuando el dato sea clínico, histórico o auditable.
