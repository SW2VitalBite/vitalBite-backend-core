# Resolvers GraphQL

Los resolvers conectan el schema GraphQL con los servicios del Core. En NestJS Code First, cada resolver define queries, mutations y tipos retornados mediante decoradores.

## Resolvers alineados al proyecto

| Resolver | Módulo `src/modules` | Responsabilidad |
|---|---|---|
| `HealthResolver` | `health` | Verificar estado del Core |
| `TenantsResolver` | `tenants` | Consultar y administrar tenants |
| `PatientsResolver` | `patients` | Gestionar pacientes |
| `AppointmentsResolver` | `appointments` | Gestionar agenda y citas |
| `BodyMeasurementsResolver` | `body-measurements` | Gestionar medidas corporales |
| `BodyCompositionResolver` | `body-composition` | Gestionar composición corporal |
| `DietsResolver` | `diets` | Gestionar dietas y planes alimenticios |
| `ReportsResolver` | `reports` | Solicitar reportes y consultar documentos |

## Patrón por resolver

Cada resolver debe seguir este patrón:

1. Recibir input GraphQL.
2. Ejecutar guards de autenticación/autorización.
3. Extraer `userId`, `role`, `permissions` y `tenant_id` desde el contexto.
4. Delegar lógica al service del módulo.
5. Retornar DTO/ObjectType GraphQL.

## Guards y decoradores esperados

- `GqlAuthGuard`: valida JWT.
- `RolesGuard`: valida rol.
- `PermissionsGuard`: valida permiso específico.
- `CurrentUser`: obtiene usuario del contexto GraphQL.
- `TenantContext`: obtiene `tenant_id` del JWT.

## Services asociados

| Service | Responsabilidad |
|---|---|
| `TenantsService` | Reglas de tenant y estado |
| `PatientsService` | CRUD y validaciones de pacientes |
| `AppointmentsService` | Reglas de agenda y estados |
| `BodyMeasurementsService` | Mediciones e IMC |
| `BodyCompositionService` | Bioimpedancia y composición |
| `DietsService` | Dietas, comidas e ítems |
| `ReportsService` | Solicitud documental y metadatos |
| `PaymentsIntegrationService` | Consulta de plan/suscripción a `.NET + DynamoDB` |

## Reglas por resolver

- No mezclar lógica de negocio compleja en resolvers.
- No acceder directamente a Prisma desde resolvers.
- No omitir validación de tenant en queries protegidas.
- No devolver datos de otros tenants.
- No exponer URLs S3 permanentes; usar URLs prefirmadas del servicio Documental.

## Ejemplo conceptual

```ts
@Resolver(() => Patient)
export class PatientsResolver {
  @Query(() => [Patient])
  patients(@CurrentUser() user: AuthUser, @Args('filter') filter: PatientFilterInput) {
    return this.patientsService.findAll(user.tenantId, user, filter);
  }
}
```
