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
- `foodName: String!`
- `portion: String!`
- `calories: Float`
- `proteins: Float`
- `carbs: Float`
- `fats: Float`
- `notes: String`

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
- `ProgressStatus`: `IMPROVING`, `STABLE`, `AT_RISK`, `CRITICAL`
- `ReportType`: `DIET_PDF`, `NUTRITION_PROGRESS`, `BODY_EVOLUTION`, `PATIENT_SUMMARY`
- `ReportStatus`: `REQUESTED`, `GENERATING`, `READY`, `FAILED`
- `DocumentType`: `DIET`, `REPORT`, `PATIENT_FILE`, `IMAGE`
- `Gender`: `MALE`, `FEMALE`, `OTHER`, `NOT_SPECIFIED`

## Reglas del schema

- Los tipos del Core deben incluir `tenantId` salvo catálogos globales explícitos.
- Las operaciones protegidas deben validar JWT, rol, permisos y tenant.
- Los datos de pagos, planes SaaS y suscripciones no forman parte del schema persistente del Core; se consultan al microservicio `.NET + DynamoDB`.
- Los documentos se representan como metadatos; el binario vive en S3 mediante Spring Boot.
