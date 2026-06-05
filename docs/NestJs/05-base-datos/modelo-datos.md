# Modelo de datos

El Core NestJS usa PostgreSQL/Supabase para almacenar información transaccional del negocio. El modelo se documenta con enfoque Prisma para facilitar implementación, migraciones y relaciones.

## Alcance del modelo del Core

El modelo PostgreSQL del Core cubre:

- Tenants.
- Usuarios, roles y permisos.
- Pacientes.
- Citas.
- Medidas corporales.
- Composición corporal.
- Seguimiento nutricional.
- Dietas, comidas e ítems.
- Catálogo nutricional.
- Recetas.
- Plantillas de dietas.
- Dietocálculo.
- Seguimiento diario del paciente.
- Antropometría avanzada y somatocarta.
- Reportes y metadatos documentales.

## Fuera del modelo del Core

No se modelan como tablas PostgreSQL del Core:

- Planes SaaS.
- Suscripciones.
- Pagos.
- Facturas.
- Renovaciones.
- Límites de plan.

Estos datos pertenecen al microservicio `.NET + DynamoDB`. El Core solo consulta ese servicio para validar estado de suscripción, plan activo y límites del tenant.

## Principios de diseño

- Todas las entidades del negocio deben tener `tenant_id`.
- Las relaciones no deben cruzar tenants.
- Los registros clínicos e históricos deben usar eliminación lógica.
- Las dietas finales deben guardar snapshot nutricional para no depender dinámicamente del catálogo.
- Los ítems alimenticios deben tener una sola fuente: catálogo, receta o entrada manual.
- Las operaciones críticas deben dejar trazabilidad mediante eventos auditables.
- Los documentos solo se almacenan como metadatos; los archivos viven en S3 mediante Spring Boot.
- Prisma será la herramienta documentada para schema, migraciones y acceso a PostgreSQL/Supabase.

## Convenciones

| Concepto    | Convención                                           |
| ----------- | ---------------------------------------------------- |
| IDs         | `String` con UUID                                    |
| Fechas      | `DateTime`                                           |
| Tenant      | Campo `tenantId` en entidades del negocio            |
| Auditoría   | `createdAt`, `updatedAt`, `deletedAt` cuando aplique |
| Estados     | Enums Prisma y GraphQL equivalentes                  |
| Eliminación | Lógica en datos clínicos o auditables                |

## Módulos y tablas

| Módulo                  | Tablas principales                                                                                   |
| ----------------------- | ---------------------------------------------------------------------------------------------------- |
| Tenants                 | `tenants`                                                                                            |
| Usuarios y roles        | `users`, `roles`, `permissions`, `role_permissions`                                                  |
| Pacientes               | `patients`                                                                                           |
| Citas                   | `appointments`                                                                                       |
| Medidas corporales      | `body_measurements`                                                                                  |
| Composición corporal    | `body_compositions`                                                                                  |
| Seguimiento nutricional | `nutrition_tracking`                                                                                 |
| Dietas                  | `diet_plans`, `diet_plan_days`, `diet_meals`, `diet_meal_items`                                      |
| Catálogo nutricional    | `food_catalog_items`, `recipes`, `recipe_items`                                                      |
| Plantillas de dietas    | `diet_templates`, `diet_template_meals`, `diet_template_items`                                       |
| Dietocálculo            | `nutrition_calculations`                                                                             |
| Seguimiento diario      | `daily_tracking_entries`, `daily_tracking_food_photos`, `physical_activity_entries`, `patient_goals` |
| Antropometría avanzada  | `anthropometry_measurements`, `somatotype_results`                                                   |
| Reportes                | `reports`, `document_metadata`                                                                       |

## Índices generales recomendados

- `tenant_id`
- `tenant_id + status`
- `tenant_id + created_at`
- `patient_id`
- `nutritionist_id`
- `scheduled_at`
- `patient_id + measured_at`
- `patient_id + tracked_at`
- `patient_id + status`
- `diet_id`
- `food_group`
- `tracked_at`
- `measured_at`

## Regla multi-tenant

Cada consulta del Core debe incluir el `tenant_id` del usuario autenticado. Incluso si el cliente envía un `id`, el service debe validar que el recurso pertenezca al mismo tenant.

## Estado implementado

El primer slice funcional versionado en Prisma cubre:

| Modulo        | Tablas implementadas |
| ------------- | -------------------- |
| Tenants       | `tenants`            |
| Usuarios demo | `users`              |
| Pacientes     | `patients`           |
| Citas         | `appointments`       |
| Medidas       | `body_measurements`  |
| Composición   | `body_compositions`  |
| Dietas MVP    | `diet_plans`, `diet_plan_days`, `diet_meals`, `diet_meal_items` |

La migracion inicial esta en `prisma/migrations/20260604130000_init_patients_core/`.
El slice de citas esta en `prisma/migrations/20260604143000_add_appointments/`.
El slice de medidas y composición esta en `prisma/migrations/20260604153000_add_body_measurements_and_composition/`.
El slice de dietas MVP esta en `prisma/migrations/20260605183000_add_diet_plans/`.
Los datos de ejemplo se cargan con `pnpm run prisma:seed`.
