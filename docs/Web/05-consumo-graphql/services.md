# Services Angular

## Services esperados

| Service | Responsabilidad |
|---|---|
| `AuthService` | Login, logout y usuario autenticado |
| `GraphqlService` | Cliente GraphQL base |
| `PatientsService` | Pacientes y detalle |
| `AppointmentsService` | Agenda y estados de cita |
| `BodyMeasurementsService` | Medidas y composición |
| `NutritionTrackingService` | Seguimiento clínico y diario |
| `DietsService` | Dietas, activación, PDF y dietocálculo |
| `NutritionCatalogService` | Alimentos y recetas |
| `DietTemplatesService` | Plantillas y creación desde plantilla |
| `AnthropometryService` | Antropometría, somatotipo y somatocarta |
| `ReportsService` | Reportes y documentos |
| `DashboardService` | Indicadores BI |
| `PaymentsService` | Estado de plan y suscripción vía Core |

## Reglas

- Cada service debe exponer métodos orientados a la vista.
- El manejo bajo nivel de GraphQL debe centralizarse.
- No duplicar queries en componentes.
- Los componentes no deben construir operaciones GraphQL manualmente.
