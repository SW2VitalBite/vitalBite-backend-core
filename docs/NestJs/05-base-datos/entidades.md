# Entidades

Las entidades se documentan como guía para un futuro `schema.prisma`. Los nombres de tablas usan `snake_case`; los modelos Prisma pueden usar `PascalCase`.

## `Tenant`

Tabla: `tenants`

Campos:

- `id: String @id @default(uuid())`
- `name: String`
- `slug: String @unique`
- `status: TenantStatus`
- `createdAt: DateTime`
- `updatedAt: DateTime`
- `deletedAt: DateTime?`

Relaciones:

- Tiene muchos `User`.
- Tiene muchos `Patient`.
- Tiene muchos registros del Core.

## `User`

Tabla: `users`

Campos:

- `id: String @id @default(uuid())`
- `tenantId: String`
- `roleId: String`
- `email: String`
- `passwordHash: String`
- `firstName: String`
- `lastName: String`
- `status: UserStatus`
- `createdAt: DateTime`
- `updatedAt: DateTime`
- `deletedAt: DateTime?`

Índices:

- `tenantId`
- `tenantId + email` único
- `tenantId + roleId`
- `tenantId + status`

## `Role`

Tabla: `roles`

Campos:

- `id: String @id @default(uuid())`
- `tenantId: String?`
- `name: String`
- `code: String`
- `description: String?`
- `createdAt: DateTime`
- `updatedAt: DateTime`

Notas:

- `tenantId` puede ser `null` para roles globales del sistema.
- Los roles mínimos son `ADMINISTRADOR`, `NUTRICIONISTA` y `PACIENTE`.

## `Permission`

Tabla: `permissions`

Campos:

- `id: String @id @default(uuid())`
- `code: String @unique`
- `description: String?`
- `createdAt: DateTime`

## `RolePermission`

Tabla: `role_permissions`

Campos:

- `id: String @id @default(uuid())`
- `roleId: String`
- `permissionId: String`
- `createdAt: DateTime`

Índices:

- `roleId + permissionId` único

## `Patient`

Tabla: `patients`

Campos:

- `id: String @id @default(uuid())`
- `tenantId: String`
- `nutritionistId: String`
- `firstName: String`
- `lastName: String`
- `email: String?`
- `phone: String?`
- `birthDate: DateTime?`
- `gender: Gender?`
- `status: PatientStatus`
- `clinicalNotes: String?`
- `nutritionGoal: String?`
- `createdAt: DateTime`
- `updatedAt: DateTime`
- `deletedAt: DateTime?`

Índices:

- `tenantId`
- `tenantId + nutritionistId`
- `tenantId + status`
- `tenantId + lastName`

## `Appointment`

Tabla: `appointments`

Campos:

- `id: String @id @default(uuid())`
- `tenantId: String`
- `patientId: String`
- `nutritionistId: String`
- `scheduledAt: DateTime`
- `durationMinutes: Int`
- `status: AppointmentStatus`
- `mode: AppointmentMode`
- `reason: String?`
- `notes: String?`
- `cancelReason: String?`
- `createdAt: DateTime`
- `updatedAt: DateTime`
- `deletedAt: DateTime?`

Índices:

- `tenantId + scheduledAt`
- `tenantId + nutritionistId + scheduledAt`
- `tenantId + patientId + scheduledAt`
- `tenantId + status`

## `BodyMeasurement`

Tabla: `body_measurements`

Campos:

- `id: String @id @default(uuid())`
- `tenantId: String`
- `patientId: String`
- `registeredById: String`
- `measuredAt: DateTime`
- `weightKg: Float`
- `heightCm: Float?`
- `bmi: Float?`
- `waistCm: Float?`
- `hipCm: Float?`
- `createdAt: DateTime`
- `updatedAt: DateTime`
- `deletedAt: DateTime?`

Índices:

- `tenantId + patientId + measuredAt`
- `tenantId + registeredById`

## `BodyComposition`

Tabla: `body_compositions`

Campos:

- `id: String @id @default(uuid())`
- `tenantId: String`
- `patientId: String`
- `bodyMeasurementId: String?`
- `measuredAt: DateTime`
- `bodyFatPercentage: Float?`
- `muscleMassKg: Float?`
- `waterPercentage: Float?`
- `visceralFatLevel: Float?`
- `boneMassKg: Float?`
- `metabolicAge: Int?`
- `createdAt: DateTime`
- `updatedAt: DateTime`
- `deletedAt: DateTime?`

Índices:

- `tenantId + patientId + measuredAt`
- `bodyMeasurementId`

## `NutritionTracking`

Tabla: `nutrition_tracking`

Campos:

- `id: String @id @default(uuid())`
- `tenantId: String`
- `patientId: String`
- `nutritionistId: String`
- `trackedAt: DateTime`
- `dietCompliancePercentage: Float?`
- `observations: String?`
- `alerts: String[]`
- `progressStatus: ProgressStatus`
- `createdAt: DateTime`
- `updatedAt: DateTime`
- `deletedAt: DateTime?`

Índices:

- `tenantId + patientId + trackedAt`
- `tenantId + nutritionistId + trackedAt`
- `tenantId + progressStatus`

## `Diet`

Tabla: `diets`

Campos:

- `id: String @id @default(uuid())`
- `tenantId: String`
- `patientId: String`
- `nutritionistId: String`
- `name: String`
- `objective: String`
- `status: DietStatus`
- `startDate: DateTime`
- `endDate: DateTime?`
- `createdAt: DateTime`
- `updatedAt: DateTime`
- `deletedAt: DateTime?`

Índices:

- `tenantId + patientId + status`
- `tenantId + nutritionistId`
- `tenantId + startDate`

## `DietMeal`

Tabla: `diet_meals`

Campos:

- `id: String @id @default(uuid())`
- `dietId: String`
- `name: String`
- `time: String?`
- `order: Int`
- `createdAt: DateTime`
- `updatedAt: DateTime`

Índices:

- `dietId + order`

## `DietItem`

Tabla: `diet_items`

Campos:

- `id: String @id @default(uuid())`
- `dietMealId: String`
- `sourceType: DietItemSourceType`
- `foodCatalogItemId: String?`
- `recipeId: String?`
- `manualFoodName: String?`
- `foodName: String`
- `portion: String`
- `calories: Float?`
- `proteins: Float?`
- `carbs: Float?`
- `fats: Float?`
- `micronutrients: Json?`
- `nutritionSnapshot: Json?`
- `notes: String?`
- `createdAt: DateTime`
- `updatedAt: DateTime`

Índices:

- `dietMealId`
- `foodCatalogItemId`
- `recipeId`

Reglas:

- Exactamente una fuente debe estar definida por ítem: `foodCatalogItemId`, `recipeId` o `manualFoodName`.
- `nutritionSnapshot` conserva nombre, porción, calorías, macronutrientes y micronutrientes del momento de creación.
- La dieta histórica no debe recalcularse automáticamente si cambia el catálogo o la receta.

## `FoodCatalogItem`

Tabla: `food_catalog_items`

Campos:

- `id: String @id @default(uuid())`
- `tenantId: String`
- `name: String`
- `foodGroup: String?`
- `basePortion: String?`
- `calories: Float?`
- `proteins: Float?`
- `carbs: Float?`
- `fats: Float?`
- `micronutrients: Json?`
- `notes: String?`
- `createdById: String`
- `createdAt: DateTime`
- `updatedAt: DateTime`
- `deletedAt: DateTime?`

Índices:

- `tenantId + name`
- `tenantId + foodGroup`
- `tenantId + createdById`

## `Recipe`

Tabla: `recipes`

Campos:

- `id: String @id @default(uuid())`
- `tenantId: String`
- `createdById: String`
- `name: String`
- `description: String?`
- `totalCalories: Float?`
- `totalProteins: Float?`
- `totalCarbs: Float?`
- `totalFats: Float?`
- `createdAt: DateTime`
- `updatedAt: DateTime`
- `deletedAt: DateTime?`

Índices:

- `tenantId + name`
- `tenantId + createdById`

## `RecipeItem`

Tabla: `recipe_items`

Campos:

- `id: String @id @default(uuid())`
- `recipeId: String`
- `foodCatalogItemId: String`
- `quantity: Float?`
- `unit: String?`
- `createdAt: DateTime`
- `updatedAt: DateTime`

Índices:

- `recipeId`
- `foodCatalogItemId`

## `DietTemplate`

Tabla: `diet_templates`

Campos:

- `id: String @id @default(uuid())`
- `tenantId: String`
- `nutritionistId: String`
- `name: String`
- `objective: String`
- `status: DietTemplateStatus`
- `createdAt: DateTime`
- `updatedAt: DateTime`
- `deletedAt: DateTime?`

Índices:

- `tenantId + nutritionistId`
- `tenantId + status`
- `tenantId + name`

## `DietTemplateMeal`

Tabla: `diet_template_meals`

Campos:

- `id: String @id @default(uuid())`
- `dietTemplateId: String`
- `name: String`
- `time: String?`
- `order: Int`
- `createdAt: DateTime`
- `updatedAt: DateTime`

Índices:

- `dietTemplateId + order`

## `DietTemplateItem`

Tabla: `diet_template_items`

Campos:

- `id: String @id @default(uuid())`
- `dietTemplateMealId: String`
- `sourceType: DietItemSourceType`
- `foodCatalogItemId: String?`
- `recipeId: String?`
- `manualFoodName: String?`
- `portion: String`
- `nutritionSnapshot: Json?`
- `notes: String?`
- `createdAt: DateTime`
- `updatedAt: DateTime`

Índices:

- `dietTemplateMealId`
- `foodCatalogItemId`
- `recipeId`

Regla:

- Exactamente una fuente debe estar definida por ítem de plantilla: `foodCatalogItemId`, `recipeId` o `manualFoodName`.

## `NutritionCalculation`

Tabla: `nutrition_calculations`

Campos:

- `id: String @id @default(uuid())`
- `tenantId: String`
- `patientId: String`
- `dietId: String`
- `totalCalories: Float?`
- `totalProteins: Float?`
- `totalCarbs: Float?`
- `totalFats: Float?`
- `micronutrients: Json?`
- `calculatedAt: DateTime`
- `createdAt: DateTime`

Índices:

- `tenantId + patientId + calculatedAt`
- `dietId`

Reglas:

- `dietId` es obligatorio para cálculos persistidos.
- `patientId` se deriva desde la dieta asociada.
- No se guardan cálculos nutricionales huérfanos.

## `DailyTrackingEntry`

Tabla: `daily_tracking_entries`

Campos:

- `id: String @id @default(uuid())`
- `tenantId: String`
- `patientId: String`
- `dietId: String?`
- `trackedAt: DateTime`
- `adherencePercentage: Float?`
- `mood: String?`
- `patientNotes: String?`
- `createdAt: DateTime`
- `updatedAt: DateTime`
- `deletedAt: DateTime?`

Índices:

- `tenantId + patientId + trackedAt`
- `dietId`

## `DailyTrackingFoodPhoto`

Tabla: `daily_tracking_food_photos`

Campos:

- `id: String @id @default(uuid())`
- `dailyTrackingEntryId: String`
- `documentMetadataId: String?`
- `mealName: String?`
- `description: String?`
- `capturedAt: DateTime`
- `createdAt: DateTime`

Índices:

- `dailyTrackingEntryId`
- `documentMetadataId`

## `PhysicalActivityEntry`

Tabla: `physical_activity_entries`

Campos:

- `id: String @id @default(uuid())`
- `dailyTrackingEntryId: String`
- `activityType: String`
- `durationMinutes: Int?`
- `intensity: String?`
- `caloriesBurned: Float?`
- `createdAt: DateTime`
- `updatedAt: DateTime`

Índices:

- `dailyTrackingEntryId`

## `PatientGoal`

Tabla: `patient_goals`

Campos:

- `id: String @id @default(uuid())`
- `tenantId: String`
- `patientId: String`
- `title: String`
- `status: GoalStatus`
- `targetDate: DateTime?`
- `createdAt: DateTime`
- `updatedAt: DateTime`
- `deletedAt: DateTime?`

Índices:

- `tenantId + patientId + status`

## `AnthropometryMeasurement`

Tabla: `anthropometry_measurements`

Campos:

- `id: String @id @default(uuid())`
- `tenantId: String`
- `patientId: String`
- `bodyMeasurementId: String?`
- `measuredAt: DateTime`
- `tricepsSkinfoldMm: Float?`
- `subscapularSkinfoldMm: Float?`
- `suprailiacSkinfoldMm: Float?`
- `calfSkinfoldMm: Float?`
- `humerusDiameterCm: Float?`
- `femurDiameterCm: Float?`
- `contractedArmCircumferenceCm: Float?`
- `calfCircumferenceCm: Float?`
- `createdAt: DateTime`
- `updatedAt: DateTime`
- `deletedAt: DateTime?`

Índices:

- `tenantId + patientId + measuredAt`
- `bodyMeasurementId`

## `SomatotypeResult`

Tabla: `somatotype_results`

Campos:

- `id: String @id @default(uuid())`
- `tenantId: String`
- `patientId: String`
- `anthropometryMeasurementId: String`
- `endomorphy: Float?`
- `mesomorphy: Float?`
- `ectomorphy: Float?`
- `somatochartX: Float?`
- `somatochartY: Float?`
- `calculatedAt: DateTime`
- `createdAt: DateTime`

Índices:

- `tenantId + patientId + calculatedAt`
- `anthropometryMeasurementId`

## `Report`

Tabla: `reports`

Campos:

- `id: String @id @default(uuid())`
- `tenantId: String`
- `patientId: String`
- `requestedById: String`
- `type: ReportType`
- `status: ReportStatus`
- `documentMetadataId: String?`
- `createdAt: DateTime`
- `updatedAt: DateTime`

Índices:

- `tenantId + patientId + createdAt`
- `tenantId + status`
- `requestedById`

## `DocumentMetadata`

Tabla: `document_metadata`

Campos:

- `id: String @id @default(uuid())`
- `tenantId: String`
- `patientId: String?`
- `reportId: String?`
- `documentType: DocumentType`
- `fileName: String`
- `s3Key: String`
- `mimeType: String?`
- `sizeBytes: Int?`
- `downloadUrl: String?`
- `expiresAt: DateTime?`
- `createdAt: DateTime`
- `updatedAt: DateTime`

Índices:

- `tenantId + patientId`
- `reportId`
- `s3Key`

## Enums Prisma sugeridos

- `TenantStatus`: `ACTIVE`, `SUSPENDED`, `DISABLED`
- `UserStatus`: `ACTIVE`, `INVITED`, `DISABLED`
- `PatientStatus`: `ACTIVE`, `INACTIVE`, `ARCHIVED`
- `AppointmentStatus`: `SCHEDULED`, `CONFIRMED`, `COMPLETED`, `CANCELLED`, `RESCHEDULED`, `NO_SHOW`
- `DietStatus`: `DRAFT`, `ACTIVE`, `COMPLETED`, `CANCELLED`
- `DietTemplateStatus`: `DRAFT`, `ACTIVE`, `ARCHIVED`
- `DietItemSourceType`: `CATALOG_ITEM`, `RECIPE`, `MANUAL`
- `ProgressStatus`: `IMPROVING`, `STABLE`, `AT_RISK`, `CRITICAL`
- `GoalStatus`: `ACTIVE`, `COMPLETED`, `CANCELLED`
- `ReportType`: `DIET_PDF`, `NUTRITION_PROGRESS`, `BODY_EVOLUTION`, `PATIENT_SUMMARY`
- `ReportStatus`: `REQUESTED`, `GENERATING`, `READY`, `FAILED`
- `DocumentType`: `DIET`, `REPORT`, `PATIENT_FILE`, `IMAGE`
- `Gender`: `MALE`, `FEMALE`, `OTHER`, `NOT_SPECIFIED`
