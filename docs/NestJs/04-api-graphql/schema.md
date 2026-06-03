# Schema GraphQL

El Core NestJS usa GraphQL Code First con NestJS/Apollo. El schema se genera desde clases TypeScript decoradas con `@ObjectType`, `@InputType`, `@Field`, `@Query` y `@Mutation`.

## Módulos cubiertos

El schema debe alinearse con los módulos reales del proyecto:

- `health`
- `tenants`
- `patients`
- `appointments`
- `body-measurements`
- `body-composition`
- `diets`
- `nutrition-catalog`
- `diet-templates`
- `nutrition-calculation`
- `daily-tracking`
- `advanced-anthropometry`
- `reports`

## Tipos base

### `Tenant`

Representa un consultorio, clínica o cuenta SaaS.

Campos:

- `id: ID!`
- `name: String!`
- `slug: String!`
- `status: TenantStatus!`
- `createdAt: DateTime!`
- `updatedAt: DateTime!`

### `User`

Representa un usuario del sistema.

Campos:

- `id: ID!`
- `tenantId: ID!`
- `roleId: ID!`
- `email: String!`
- `firstName: String!`
- `lastName: String!`
- `status: UserStatus!`
- `role: Role`
- `createdAt: DateTime!`
- `updatedAt: DateTime!`

### `Role`

Representa un rol asignable.

Campos:

- `id: ID!`
- `tenantId: ID`
- `name: String!`
- `code: String!`
- `permissions: [Permission!]!`

### `Permission`

Representa una acción autorizable.

Campos:

- `id: ID!`
- `code: String!`
- `description: String`

### `Patient`

Representa un paciente registrado por un nutricionista.

Campos:

- `id: ID!`
- `tenantId: ID!`
- `nutritionistId: ID!`
- `firstName: String!`
- `lastName: String!`
- `email: String`
- `phone: String`
- `birthDate: DateTime`
- `gender: Gender`
- `status: PatientStatus!`
- `clinicalNotes: String`
- `nutritionGoal: String`
- `createdAt: DateTime!`
- `updatedAt: DateTime!`

### `Appointment`

Representa una cita nutricional.

Campos:

- `id: ID!`
- `tenantId: ID!`
- `patientId: ID!`
- `nutritionistId: ID!`
- `scheduledAt: DateTime!`
- `durationMinutes: Int!`
- `status: AppointmentStatus!`
- `reason: String`
- `notes: String`
- `createdAt: DateTime!`
- `updatedAt: DateTime!`

### `BodyMeasurement`

Representa una medición corporal básica.

Campos:

- `id: ID!`
- `tenantId: ID!`
- `patientId: ID!`
- `registeredById: ID!`
- `measuredAt: DateTime!`
- `weightKg: Float!`
- `heightCm: Float`
- `bmi: Float`
- `waistCm: Float`
- `hipCm: Float`
- `createdAt: DateTime!`

### `BodyComposition`

Representa datos de composición corporal o bioimpedancia.

Campos:

- `id: ID!`
- `tenantId: ID!`
- `patientId: ID!`
- `bodyMeasurementId: ID`
- `bodyFatPercentage: Float`
- `muscleMassKg: Float`
- `waterPercentage: Float`
- `visceralFatLevel: Float`
- `boneMassKg: Float`
- `metabolicAge: Int`
- `measuredAt: DateTime!`

### `NutritionTracking`

Representa el seguimiento nutricional del paciente.

Campos:

- `id: ID!`
- `tenantId: ID!`
- `patientId: ID!`
- `nutritionistId: ID!`
- `trackedAt: DateTime!`
- `dietCompliancePercentage: Float`
- `observations: String`
- `alerts: [String!]!`
- `progressStatus: ProgressStatus!`
- `createdAt: DateTime!`

### `Diet`

Representa un plan alimenticio.

Campos:

- `id: ID!`
- `tenantId: ID!`
- `patientId: ID!`
- `nutritionistId: ID!`
- `name: String!`
- `objective: String!`
- `status: DietStatus!`
- `startDate: DateTime!`
- `endDate: DateTime`
- `meals: [DietMeal!]!`
- `createdAt: DateTime!`
- `updatedAt: DateTime!`

### `DietMeal`

Representa un tiempo de comida dentro de una dieta.

Campos:

- `id: ID!`
- `dietId: ID!`
- `name: String!`
- `time: String`
- `order: Int!`
- `items: [DietItem!]!`

### `DietItem`

Representa un alimento, porción o instrucción dentro de un tiempo de comida.

Campos:

- `id: ID!`
- `dietMealId: ID!`
- `sourceType: DietItemSourceType!`
- `foodCatalogItemId: ID`
- `recipeId: ID`
- `manualFoodName: String`
- `foodName: String!`
- `portion: String!`
- `calories: Float`
- `proteins: Float`
- `carbs: Float`
- `fats: Float`
- `micronutrients: [NutrientValue!]!`
- `nutritionSnapshot: NutritionSnapshot`
- `notes: String`

### `FoodCatalogItem`

Representa un alimento reutilizable del catálogo nutricional.

Campos:

- `id: ID!`
- `tenantId: ID!`
- `name: String!`
- `foodGroup: String`
- `basePortion: String`
- `calories: Float`
- `proteins: Float`
- `carbs: Float`
- `fats: Float`
- `micronutrients: [NutrientValue!]!`
- `notes: String`
- `createdAt: DateTime!`
- `updatedAt: DateTime!`

### `Recipe`

Representa una receta o preparación reutilizable.

Campos:

- `id: ID!`
- `tenantId: ID!`
- `name: String!`
- `description: String`
- `items: [RecipeItem!]!`
- `totalCalories: Float`
- `totalProteins: Float`
- `totalCarbs: Float`
- `totalFats: Float`
- `createdAt: DateTime!`
- `updatedAt: DateTime!`

### `RecipeItem`

Representa un alimento dentro de una receta.

Campos:

- `id: ID!`
- `recipeId: ID!`
- `foodCatalogItemId: ID!`
- `quantity: Float`
- `unit: String`

### `DietTemplate`

Representa una plantilla reutilizable para crear dietas.

Campos:

- `id: ID!`
- `tenantId: ID!`
- `nutritionistId: ID!`
- `name: String!`
- `objective: String!`
- `status: DietTemplateStatus!`
- `meals: [DietTemplateMeal!]!`
- `createdAt: DateTime!`
- `updatedAt: DateTime!`

### `DietTemplateMeal`

Representa un tiempo de comida dentro de una plantilla.

Campos:

- `id: ID!`
- `dietTemplateId: ID!`
- `name: String!`
- `time: String`
- `order: Int!`
- `items: [DietTemplateItem!]!`

### `DietTemplateItem`

Representa un alimento, receta o instrucción de una plantilla.

Campos:

- `id: ID!`
- `dietTemplateMealId: ID!`
- `sourceType: DietItemSourceType!`
- `foodCatalogItemId: ID`
- `recipeId: ID`
- `manualFoodName: String`
- `portion: String!`
- `nutritionSnapshot: NutritionSnapshot`
- `notes: String`

### `NutritionCalculation`

Representa el resultado del dietocálculo.

Campos:

- `id: ID!`
- `tenantId: ID!`
- `patientId: ID!`
- `dietId: ID!`
- `totalCalories: Float`
- `totalProteins: Float`
- `totalCarbs: Float`
- `totalFats: Float`
- `micronutrients: [NutrientValue!]!`
- `calculatedAt: DateTime!`

### `NutrientValue`

Representa un nutriente calculado o registrado.

Campos:

- `name: String!`
- `amount: Float!`
- `unit: String!`

### `NutritionSnapshot`

Representa la foto nutricional de un ítem al momento de crear o actualizar una dieta.

Campos:

- `foodName: String!`
- `portion: String!`
- `calories: Float`
- `proteins: Float`
- `carbs: Float`
- `fats: Float`
- `micronutrients: [NutrientValue!]!`

Reglas:

- La dieta final debe guardar esta foto nutricional aunque el ítem venga de catálogo o receta.
- Cambios posteriores en catálogo o receta no deben modificar dietas históricas.
- Cada ítem debe tener exactamente una fuente: `foodCatalogItemId`, `recipeId` o `manualFoodName`.

### `DailyTrackingEntry`

Representa un registro diario del paciente.

Campos:

- `id: ID!`
- `tenantId: ID!`
- `patientId: ID!`
- `dietId: ID`
- `trackedAt: DateTime!`
- `adherencePercentage: Float`
- `mood: String`
- `patientNotes: String`
- `foodPhotos: [DailyTrackingFoodPhoto!]!`
- `physicalActivities: [PhysicalActivityEntry!]!`
- `createdAt: DateTime!`

### `DailyTrackingFoodPhoto`

Representa la referencia documental de una foto de alimento.

Campos:

- `id: ID!`
- `dailyTrackingEntryId: ID!`
- `documentMetadataId: ID`
- `mealName: String`
- `description: String`
- `capturedAt: DateTime!`

Regla:

- `documentMetadataId` debe generarse previamente mediante `requestDailyFoodPhotoUpload(input)`.
- El archivo binario vive en S3 mediante el servicio Documental.

### `DailyFoodPhotoUploadRequest`

Representa la respuesta para subir una foto de alimento desde la app móvil.

Campos:

- `documentMetadataId: ID!`
- `uploadUrl: String!`
- `expiresAt: DateTime!`

Regla:

- El Core solicita esta URL al servicio Documental y no almacena el archivo binario.

### `PhysicalActivityEntry`

Representa actividad física registrada por el paciente.

Campos:

- `id: ID!`
- `dailyTrackingEntryId: ID!`
- `activityType: String!`
- `durationMinutes: Int`
- `intensity: String`
- `caloriesBurned: Float`

### `PatientGoal`

Representa una meta declarada por el paciente o nutricionista.

Campos:

- `id: ID!`
- `tenantId: ID!`
- `patientId: ID!`
- `title: String!`
- `status: GoalStatus!`
- `targetDate: DateTime`
- `createdAt: DateTime!`

### `AnthropometryMeasurement`

Representa una medición de antropometría avanzada.

Campos:

- `id: ID!`
- `tenantId: ID!`
- `patientId: ID!`
- `bodyMeasurementId: ID`
- `measuredAt: DateTime!`
- `tricepsSkinfoldMm: Float`
- `subscapularSkinfoldMm: Float`
- `suprailiacSkinfoldMm: Float`
- `calfSkinfoldMm: Float`
- `humerusDiameterCm: Float`
- `femurDiameterCm: Float`
- `contractedArmCircumferenceCm: Float`
- `calfCircumferenceCm: Float`
- `createdAt: DateTime!`

### `SomatotypeResult`

Representa el resultado de somatotipo y somatocarta.

Campos:

- `id: ID!`
- `tenantId: ID!`
- `patientId: ID!`
- `anthropometryMeasurementId: ID!`
- `endomorphy: Float`
- `mesomorphy: Float`
- `ectomorphy: Float`
- `somatochartX: Float`
- `somatochartY: Float`
- `calculatedAt: DateTime!`

Reglas:

- La fórmula de referencia será Heath-Carter.
- Pliegues se expresan en mm.
- Perímetros y diámetros se expresan en cm.
- Peso se expresa en kg y talla en cm desde la medición corporal asociada.
- Si faltan datos mínimos, `calculateSomatotype` debe devolver error controlado y no crear resultado.

### `Report`

Representa una solicitud o resultado de reporte nutricional.

Campos:

- `id: ID!`
- `tenantId: ID!`
- `patientId: ID!`
- `requestedById: ID!`
- `type: ReportType!`
- `status: ReportStatus!`
- `documentMetadataId: ID`
- `createdAt: DateTime!`

### `DocumentMetadata`

Representa la referencia a un documento generado por Spring Boot y almacenado en S3.

Campos:

- `id: ID!`
- `tenantId: ID!`
- `patientId: ID`
- `reportId: ID`
- `documentType: DocumentType!`
- `fileName: String!`
- `s3Key: String!`
- `downloadUrl: String`
- `expiresAt: DateTime`
- `createdAt: DateTime!`

## Enums principales

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

## Reglas del schema

- Los tipos del Core deben incluir `tenantId` salvo catálogos globales explícitos.
- Las operaciones protegidas deben validar JWT, rol, permisos y tenant.
- Los datos de pagos, planes SaaS y suscripciones no forman parte del schema persistente del Core; se consultan al microservicio `.NET + DynamoDB`.
- Los documentos se representan como metadatos; el binario vive en S3 mediante Spring Boot.
