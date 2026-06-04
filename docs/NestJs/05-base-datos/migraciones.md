# Migraciones

Las migraciones del Core se documentan con enfoque Prisma. Cada cambio estructural del modelo PostgreSQL/Supabase debe versionarse mediante migraciones.

## Herramienta esperada

- Prisma ORM.
- PostgreSQL/Supabase.
- Migraciones con `prisma migrate`.

## Preparación previa

Antes de ejecutar migraciones del Core, el proyecto debe tener:

- Dependencias `prisma` y `@prisma/client`.
- Carpeta `prisma/`.
- Archivo `prisma/schema.prisma`.
- Variable `DATABASE_URL` configurada.
- `PrismaService` creado en NestJS para acceso a PostgreSQL/Supabase.

## Orden implementable

### 1. Tenants

Crear:

- `tenants`
- Enum `TenantStatus`

Índices:

- `slug` único.
- `status`.

### 2. Seguridad y acceso

Crear:

- `roles`
- `permissions`
- `role_permissions`
- `users`
- Enums `UserStatus`

Índices:

- `users(tenant_id, email)` único.
- `users(tenant_id, role_id)`.
- `users(tenant_id, status)`.
- `role_permissions(role_id, permission_id)` único.

### 3. Pacientes

Crear:

- `patients`
- Enums `PatientStatus`, `Gender`

Índices:

- `patients(tenant_id, nutritionist_id)`.
- `patients(tenant_id, status)`.
- `patients(tenant_id, last_name)`.

### 4. Citas

Crear:

- `appointments`
- Enum `AppointmentStatus`
- Enum `AppointmentMode`

Índices:

- `appointments(tenant_id, scheduled_at)`.
- `appointments(tenant_id, nutritionist_id, scheduled_at)`.
- `appointments(tenant_id, patient_id, scheduled_at)`.
- `appointments(tenant_id, status)`.

### 5. Medidas corporales

Crear:

- `body_measurements`

Índices:

- `body_measurements(tenant_id, patient_id, measured_at)`.
- `body_measurements(tenant_id, registered_by_id)`.

### 6. Composición corporal

Crear:

- `body_compositions`

Índices:

- `body_compositions(tenant_id, patient_id, measured_at)`.
- `body_compositions(body_measurement_id)`.

### 7. Seguimiento nutricional

Crear:

- `nutrition_tracking`
- Enum `ProgressStatus`

Índices:

- `nutrition_tracking(tenant_id, patient_id, tracked_at)`.
- `nutrition_tracking(tenant_id, nutritionist_id, tracked_at)`.
- `nutrition_tracking(tenant_id, progress_status)`.

### 8. Dietas

Crear:

- `diets`
- `diet_meals`
- `diet_items`
- Enum `DietStatus`

Índices:

- `diets(tenant_id, patient_id, status)`.
- `diets(tenant_id, nutritionist_id)`.
- `diets(tenant_id, start_date)`.
- `diet_meals(diet_id, order)`.
- `diet_items(diet_meal_id)`.
- `diet_items(food_catalog_item_id)`.
- `diet_items(recipe_id)`.

Reglas de estructura:

- `diet_items` debe incluir `source_type`, `food_catalog_item_id`, `recipe_id`, `manual_food_name`, `micronutrients` y `nutrition_snapshot`.
- Cada ítem debe tener exactamente una fuente: catálogo, receta o entrada manual.
- El snapshot nutricional conserva el valor histórico aunque cambie el catálogo.

### 9. Catálogo nutricional

Crear:

- `food_catalog_items`
- `recipes`
- `recipe_items`

Índices:

- `food_catalog_items(tenant_id, name)`.
- `food_catalog_items(tenant_id, food_group)`.
- `food_catalog_items(tenant_id, created_by_id)`.
- `recipes(tenant_id, name)`.
- `recipes(tenant_id, created_by_id)`.
- `recipe_items(recipe_id)`.
- `recipe_items(food_catalog_item_id)`.

### 10. Plantillas de dietas

Crear:

- `diet_templates`
- `diet_template_meals`
- `diet_template_items`
- Enum `DietTemplateStatus`

Índices:

- `diet_templates(tenant_id, nutritionist_id)`.
- `diet_templates(tenant_id, status)`.
- `diet_templates(tenant_id, name)`.
- `diet_template_meals(diet_template_id, order)`.
- `diet_template_items(diet_template_meal_id)`.
- `diet_template_items(food_catalog_item_id)`.
- `diet_template_items(recipe_id)`.

Reglas de estructura:

- `diet_template_items` debe incluir `source_type`, `food_catalog_item_id`, `recipe_id`, `manual_food_name` y `nutrition_snapshot`.
- Cada ítem de plantilla debe tener exactamente una fuente: catálogo, receta o entrada manual.

### 11. Dietocálculo

Crear:

- `nutrition_calculations`

Índices:

- `nutrition_calculations(tenant_id, patient_id, calculated_at)`.
- `nutrition_calculations(diet_id)`.

Reglas de estructura:

- `diet_id` y `patient_id` son obligatorios para cálculos persistidos.
- No crear registros de dietocálculo huérfanos.

### 12. Seguimiento diario

Crear:

- `daily_tracking_entries`
- `daily_tracking_food_photos`
- `physical_activity_entries`
- `patient_goals`
- Enum `GoalStatus`

Índices:

- `daily_tracking_entries(tenant_id, patient_id, tracked_at)`.
- `daily_tracking_entries(diet_id)`.
- `daily_tracking_food_photos(daily_tracking_entry_id)`.
- `daily_tracking_food_photos(document_metadata_id)`.
- `physical_activity_entries(daily_tracking_entry_id)`.
- `patient_goals(tenant_id, patient_id, status)`.

### 13. Antropometría avanzada

Crear:

- `anthropometry_measurements`
- `somatotype_results`

Índices:

- `anthropometry_measurements(tenant_id, patient_id, measured_at)`.
- `anthropometry_measurements(body_measurement_id)`.
- `somatotype_results(tenant_id, patient_id, calculated_at)`.
- `somatotype_results(anthropometry_measurement_id)`.

### 14. Reportes y documentos

Crear:

- `reports`
- `document_metadata`
- Enums `ReportType`, `ReportStatus`, `DocumentType`

Índices:

- `reports(tenant_id, patient_id, created_at)`.
- `reports(tenant_id, status)`.
- `reports(requested_by_id)`.
- `document_metadata(tenant_id, patient_id)`.
- `document_metadata(report_id)`.
- `document_metadata(s3_key)`.

## Migraciones excluidas del Core

No crear migraciones Prisma para:

- `plans`
- `subscriptions`
- `payments`
- `invoices`
- `tenant_limits`

Estas estructuras pertenecen al microservicio `.NET + DynamoDB`.

## Reglas de migración

- Cada migración debe ser pequeña y trazable.
- No cambiar datos productivos manualmente.
- Mantener compatibilidad con GraphQL cuando se agregan campos.
- Agregar índices junto con las tablas o columnas que los requieren.
- No eliminar columnas críticas sin estrategia de migración y respaldo.

## Comandos esperados

```bash
pnpm exec prisma migrate dev --name init_core_schema
pnpm exec prisma migrate dev --name add_appointments
pnpm exec prisma migrate deploy
```

## Migraciones implementadas

| Migracion                                              | Alcance                                                |
| ------------------------------------------------------ | ------------------------------------------------------ |
| `20260604130000_init_patients_core`                    | Tenants, usuarios demo y pacientes                     |
| `20260604143000_add_appointments`                      | Citas, estados, modalidad e indices de agenda          |
| `20260604153000_add_body_measurements_and_composition` | Medidas corporales, composición corporal e indicadores |

Los nombres exactos de migración deben reflejar el cambio realizado.
