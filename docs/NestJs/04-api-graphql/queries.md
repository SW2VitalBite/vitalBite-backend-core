# Queries GraphQL

Las queries permiten consultar información del Core NestJS. Todas las queries protegidas deben filtrar por `tenant_id` y validar permisos según el rol del usuario.

## Health

| Query    | Descripción                      | Acceso  |
| -------- | -------------------------------- | ------- |
| `health` | Verifica que el Core esté activo | Público |

## Tenants

| Query            | Descripción                               | Acceso                       |
| ---------------- | ----------------------------------------- | ---------------------------- |
| `tenantById(id)` | Obtiene un tenant por ID                  | Administrador                |
| `currentTenant`  | Obtiene el tenant del usuario autenticado | Administrador, nutricionista |

Filtros sugeridos:

- `status`
- `slug`

## Usuarios y roles

| Query           | Descripción                     | Acceso              |
| --------------- | ------------------------------- | ------------------- |
| `me`            | Devuelve el usuario autenticado | Usuario autenticado |
| `users(filter)` | Lista usuarios del tenant       | Administrador       |
| `userById(id)`  | Obtiene un usuario por ID       | Administrador       |
| `roles`         | Lista roles disponibles         | Administrador       |
| `permissions`   | Lista permisos disponibles      | Administrador       |

Filtros sugeridos:

- `roleId`
- `status`
- `search`

## Pacientes

| Query                                    | Descripción                         | Acceso                                       |
| ---------------------------------------- | ----------------------------------- | -------------------------------------------- |
| `patients(filter)`                       | Lista pacientes del tenant          | Administrador, nutricionista                 |
| `patientById(id)`                        | Obtiene detalle de paciente         | Administrador, nutricionista, paciente dueño |
| `patientsByNutritionist(nutritionistId)` | Lista pacientes de un nutricionista | Administrador, nutricionista                 |

Filtros sugeridos:

- `nutritionistId`
- `status`
- `search`
- `createdFrom`
- `createdTo`

## Citas

| Query                              | Descripción                 | Acceso                                       |
| ---------------------------------- | --------------------------- | -------------------------------------------- |
| `appointments(filter)`             | Lista citas del tenant      | Administrador, nutricionista                 |
| `appointmentById(id)`              | Obtiene una cita            | Administrador, nutricionista, paciente dueño |
| `appointmentsByPatient(patientId)` | Lista citas de un paciente  | Administrador, nutricionista, paciente dueño |
| `appointmentsCalendar(filter)`     | Lista citas para calendario | Administrador, nutricionista                 |

Filtros sugeridos:

- `patientId`
- `nutritionistId`
- `status`
- `dateFrom`
- `dateTo`
- `search`

## Medidas corporales

| Query                                  | Descripción                  | Acceso                                       |
| -------------------------------------- | ---------------------------- | -------------------------------------------- |
| `bodyMeasurementsByPatient(patientId)` | Lista medidas de un paciente | Administrador, nutricionista, paciente dueño |
| `bodyMeasurementById(id)`              | Obtiene una medición         | Administrador, nutricionista                 |

Filtros sugeridos:

- `measuredFrom`
- `measuredTo`

## Composición corporal

| Query                                 | Descripción                             | Acceso                                       |
| ------------------------------------- | --------------------------------------- | -------------------------------------------- |
| `bodyCompositionByPatient(patientId)` | Lista composición corporal del paciente | Administrador, nutricionista, paciente dueño |
| `latestBodyComposition(patientId)`    | Obtiene la última composición corporal  | Administrador, nutricionista, paciente dueño |

## Seguimiento nutricional

| Query                          | Descripción                      | Acceso                                       |
| ------------------------------ | -------------------------------- | -------------------------------------------- |
| `trackingByPatient(patientId)` | Lista seguimiento de un paciente | Administrador, nutricionista, paciente dueño |
| `trackingSummary(patientId)`   | Devuelve resumen de progreso     | Administrador, nutricionista, paciente dueño |

Filtros sugeridos:

- `patientId`
- `progressStatus`
- `trackedFrom`
- `trackedTo`

## Dietas

| Query                            | Descripción                 | Acceso                                       |
| -------------------------------- | --------------------------- | -------------------------------------------- |
| `diets(filter)`                  | Lista dietas del tenant     | Administrador, nutricionista                 |
| `dietById(id)`                   | Obtiene una dieta completa  | Administrador, nutricionista, paciente dueño |
| `dietsByPatient(patientId)`      | Lista dietas de un paciente | Administrador, nutricionista, paciente dueño |
| `activeDietByPatient(patientId)` | Obtiene dieta activa        | Administrador, nutricionista, paciente dueño |

Filtros sugeridos:

- `patientId`
- `nutritionistId`
- `status`
- `startDate`
- `endDate`

## Catálogo nutricional

| Query                     | Descripción                      | Acceso                       |
| ------------------------- | -------------------------------- | ---------------------------- |
| `foodCatalog(filter)`     | Lista alimentos del catálogo     | Administrador, nutricionista |
| `foodCatalogItemById(id)` | Obtiene un alimento del catálogo | Administrador, nutricionista |
| `recipes(filter)`         | Lista recetas reutilizables      | Administrador, nutricionista |
| `recipeById(id)`          | Obtiene una receta               | Administrador, nutricionista |

Filtros sugeridos:

- `search`
- `foodGroup`
- `createdById`

## Plantillas de dietas

| Query                   | Descripción                    | Acceso                       |
| ----------------------- | ------------------------------ | ---------------------------- |
| `dietTemplates(filter)` | Lista plantillas de dietas     | Administrador, nutricionista |
| `dietTemplateById(id)`  | Obtiene una plantilla completa | Administrador, nutricionista |

Filtros sugeridos:

- `nutritionistId`
- `status`
- `objective`
- `search`

## Dietocálculo

| Query                                       | Descripción                                        | Acceso                                       |
| ------------------------------------------- | -------------------------------------------------- | -------------------------------------------- |
| `calculateDietNutrition(input)`             | Calcula nutrientes de una dieta o comidas enviadas | Administrador, nutricionista                 |
| `nutritionCalculationByDiet(dietId)`        | Obtiene último cálculo de una dieta                | Administrador, nutricionista, paciente dueño |
| `nutritionCalculationsByPatient(patientId)` | Lista cálculos asociados al paciente               | Administrador, nutricionista, paciente dueño |

Reglas:

- `calculateDietNutrition(input)` solo calcula y no persiste resultados.
- Los resultados persistidos se crean mediante `saveNutritionCalculation(input)`.
- Un cálculo persistido debe tener `dietId`; no se guardan cálculos huérfanos.

## Seguimiento diario

| Query                                       | Descripción                          | Acceso                                       |
| ------------------------------------------- | ------------------------------------ | -------------------------------------------- |
| `dailyTrackingByPatient(patientId, filter)` | Lista registros diarios del paciente | Administrador, nutricionista, paciente dueño |
| `patientGoals(patientId)`                   | Lista metas del paciente             | Administrador, nutricionista, paciente dueño |

Filtros sugeridos:

- `dateFrom`
- `dateTo`
- `dietId`

## Antropometría avanzada

| Query                               | Descripción                         | Acceso                                       |
| ----------------------------------- | ----------------------------------- | -------------------------------------------- |
| `anthropometryByPatient(patientId)` | Lista mediciones antropométricas    | Administrador, nutricionista, paciente dueño |
| `latestSomatotype(patientId)`       | Obtiene último somatotipo calculado | Administrador, nutricionista, paciente dueño |

## Reportes y documentos

| Query                           | Descripción                    | Acceso                                       |
| ------------------------------- | ------------------------------ | -------------------------------------------- |
| `reports(filter)`               | Lista reportes solicitados     | Administrador, nutricionista                 |
| `reportById(id)`                | Obtiene detalle de reporte     | Administrador, nutricionista                 |
| `documentsByPatient(patientId)` | Lista documentos del paciente  | Administrador, nutricionista, paciente dueño |
| `documentById(id)`              | Obtiene metadatos de documento | Administrador, nutricionista, paciente dueño |

## Dashboard

| Query                                 | Descripción                | Acceso                                       |
| ------------------------------------- | -------------------------- | -------------------------------------------- |
| `dashboardSummary(filter)`            | Resumen general del tenant | Administrador, nutricionista                 |
| `patientProgressDashboard(patientId)` | Indicadores del paciente   | Administrador, nutricionista, paciente dueño |

Indicadores esperados:

- Total de pacientes activos.
- Citas programadas, completadas y canceladas.
- Cumplimiento promedio de dietas.
- Evolución promedio de medidas.
- Riesgos nutricionales servidos desde FastAPI o métricas asociadas.
- Indicadores financieros obtenidos por integración con `.NET + DynamoDB`, no persistidos en PostgreSQL del Core.

## Reglas generales

- Toda query protegida debe validar `tenant_id`.
- El rol `PACIENTE` solo puede consultar sus propios recursos.
- El rol `NUTRICIONISTA` consulta recursos asociados a su tenant y pacientes asignados.
- El rol `ADMINISTRADOR` consulta recursos del tenant completo.
- No se exponen datos binarios de documentos; solo metadatos y URLs prefirmadas.
