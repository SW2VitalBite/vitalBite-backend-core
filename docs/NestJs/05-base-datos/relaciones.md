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
