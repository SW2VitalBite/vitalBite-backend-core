# Relaciones

Las relaciones del Core deben mantener aislamiento multi-tenant. Ningún registro operativo debe relacionarse con datos de otro tenant.

## Cardinalidades principales

| Relación | Cardinalidad | Regla |
|---|---|---|
| `Tenant` → `User` | 1:N | Todo usuario pertenece a un tenant |
| `Tenant` → `Patient` | 1:N | Todo paciente pertenece a un tenant |
| `Role` → `User` | 1:N | Un usuario tiene un rol principal |
| `Role` ↔ `Permission` | N:M | Relación mediante `role_permissions` |
| `User` nutricionista → `Patient` | 1:N | Un nutricionista puede tener varios pacientes |
| `Patient` → `Appointment` | 1:N | Un paciente puede tener muchas citas |
| `User` nutricionista → `Appointment` | 1:N | Un nutricionista atiende muchas citas |
| `Patient` → `BodyMeasurement` | 1:N | Un paciente puede tener muchas mediciones |
| `Patient` → `BodyComposition` | 1:N | Un paciente puede tener muchos registros de composición |
| `BodyMeasurement` → `BodyComposition` | 1:0..1 | Una composición puede asociarse a una medición |
| `Patient` → `NutritionTracking` | 1:N | Un paciente puede tener muchos seguimientos |
| `Patient` → `Diet` | 1:N | Un paciente puede tener varias dietas |
| `Diet` → `DietMeal` | 1:N | Una dieta tiene muchos tiempos de comida |
| `DietMeal` → `DietItem` | 1:N | Un tiempo de comida tiene muchos ítems |
| `Tenant` → `FoodCatalogItem` | 1:N | Un tenant puede tener alimentos propios |
| `Tenant` → `Recipe` | 1:N | Un tenant puede tener recetas propias |
| `Recipe` → `RecipeItem` | 1:N | Una receta se compone de alimentos |
| `FoodCatalogItem` → `RecipeItem` | 1:N | Un alimento puede reutilizarse en recetas |
| `FoodCatalogItem` → `DietItem` | 1:N | Un alimento puede usarse como fuente de ítems de dieta |
| `Recipe` → `DietItem` | 1:N | Una receta puede usarse como fuente de ítems de dieta |
| `User` nutricionista → `DietTemplate` | 1:N | Un nutricionista puede crear varias plantillas |
| `DietTemplate` → `DietTemplateMeal` | 1:N | Una plantilla tiene tiempos de comida |
| `DietTemplateMeal` → `DietTemplateItem` | 1:N | Un tiempo de plantilla tiene varios ítems |
| `FoodCatalogItem` → `DietTemplateItem` | 1:N | Un alimento puede usarse en plantillas |
| `Recipe` → `DietTemplateItem` | 1:N | Una receta puede usarse en plantillas |
| `Diet` → `NutritionCalculation` | 1:N | Una dieta puede tener cálculos nutricionales históricos |
| `Patient` → `DailyTrackingEntry` | 1:N | Un paciente puede registrar seguimiento diario |
| `DailyTrackingEntry` → `DailyTrackingFoodPhoto` | 1:N | Un seguimiento puede tener fotos de alimentos |
| `DailyTrackingEntry` → `PhysicalActivityEntry` | 1:N | Un seguimiento puede tener actividades físicas |
| `Patient` → `PatientGoal` | 1:N | Un paciente puede tener metas |
| `Patient` → `AnthropometryMeasurement` | 1:N | Un paciente puede tener mediciones antropométricas |
| `BodyMeasurement` → `AnthropometryMeasurement` | 1:0..1 | Una medición básica puede asociarse a antropometría avanzada |
| `AnthropometryMeasurement` → `SomatotypeResult` | 1:0..1 | Una antropometría puede generar somatotipo |
| `Patient` → `Report` | 1:N | Un paciente puede tener varios reportes |
| `Report` → `DocumentMetadata` | 1:0..1 | Un reporte puede tener un documento generado |
| `Patient` → `DocumentMetadata` | 1:N | Un paciente puede tener varios documentos |

## Ownership multi-tenant

Estas entidades deben tener `tenantId` obligatorio:

- `User`
- `Patient`
- `Appointment`
- `BodyMeasurement`
- `BodyComposition`
- `NutritionTracking`
- `Diet`
- `FoodCatalogItem`
- `Recipe`
- `DietTemplate`
- `NutritionCalculation`
- `DailyTrackingEntry`
- `PatientGoal`
- `AnthropometryMeasurement`
- `SomatotypeResult`
- `Report`
- `DocumentMetadata`

Los roles pueden ser:

- Globales, cuando `tenantId` es `null`.
- Específicos del tenant, cuando `tenantId` tiene valor.

## Reglas de integridad

- Un `Patient` no puede asignarse a un `nutritionistId` de otro tenant.
- Una `Appointment` debe relacionar `patientId` y `nutritionistId` del mismo tenant.
- Una `BodyMeasurement` solo puede pertenecer a un paciente del mismo tenant.
- Una `Diet` solo puede asignarse a un paciente del mismo tenant.
- Un `FoodCatalogItem`, `Recipe` o `DietTemplate` solo puede reutilizarse dentro del mismo tenant.
- Una `NutritionCalculation` asociada a una dieta debe pertenecer al mismo tenant de la dieta.
- Un `DailyTrackingEntry` solo puede pertenecer al paciente autenticado o a un paciente asignado al nutricionista.
- Una `DailyTrackingFoodPhoto` debe referenciar metadatos documentales del mismo tenant.
- Una `AnthropometryMeasurement` solo puede pertenecer a un paciente del mismo tenant.
- Un `SomatotypeResult` debe derivarse de una medición antropométrica del mismo tenant.
- Un `Report` solo puede generar documentos asociados al mismo tenant.
- Un `DocumentMetadata` no debe exponer archivos de otro tenant.

## Reglas de eliminación

- `Tenant`: no eliminar físicamente si tiene datos asociados.
- `User`: desactivar o eliminación lógica.
- `Patient`: archivar o eliminación lógica.
- `Appointment`: cancelar o eliminación lógica.
- `BodyMeasurement`: eliminación lógica.
- `BodyComposition`: eliminación lógica.
- `NutritionTracking`: eliminación lógica.
- `Diet`: cancelar, completar o eliminación lógica.
- `FoodCatalogItem`: eliminación lógica si fue usado en recetas, dietas o plantillas.
- `Recipe`: eliminación lógica si fue usada en dietas o plantillas.
- `DietTemplate`: archivar o eliminación lógica.
- `NutritionCalculation`: conservar para historial.
- `DailyTrackingEntry`: eliminación lógica.
- `PatientGoal`: completar, cancelar o eliminación lógica.
- `AnthropometryMeasurement`: eliminación lógica.
- `SomatotypeResult`: conservar para historial.
- `Report` y `DocumentMetadata`: conservar para auditoría.

## Reglas de consulta

Toda consulta debe aplicar:

1. `tenantId` del JWT.
2. Permisos del rol.
3. Propiedad del recurso si el usuario es paciente.
4. Relación con nutricionista si el usuario es nutricionista.

## Relación con servicios externos

- `.NET + DynamoDB`: pagos, planes, suscripciones, facturas y límites de tenant.
- `Spring Boot + S3`: generación de PDFs, almacenamiento documental y URLs prefirmadas.
- `FastAPI`: resultados de IA/ML/DL como riesgo nutricional o segmentación.

El Core puede guardar metadatos o referencias, pero no debe duplicar datos financieros ni archivos binarios.
