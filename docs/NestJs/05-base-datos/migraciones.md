# Migraciones

Las migraciones del Core se documentan con enfoque Prisma. Cada cambio estructural del modelo PostgreSQL/Supabase debe versionarse mediante migraciones.

## Herramienta esperada

- Prisma ORM.
- PostgreSQL/Supabase.
- Migraciones con `prisma migrate`.

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

### 9. Reportes y documentos

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
npx prisma migrate dev --name init_core_schema
npx prisma migrate dev --name add_appointments
npx prisma migrate deploy
```

Los nombres exactos de migración deben reflejar el cambio realizado.
