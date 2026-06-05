# Modulo de pagos y suscripciones

## Objetivo

Gestionar el catalogo comercial y el estado de suscripcion del tenant.

## Datos V1

- Plan `individual`: Nutricionista individual, 15 USD/mes.
- Plan `clinic`: Clinica completa, 30 USD/mes.
- Suscripcion demo activa para `clinica-central`.
- Solicitudes pendientes de cambio de plan por tenant.

## Persistencia

Se usa DynamoDB como base principal del dominio financiero. En V1 se trabaja con una tabla unica:

```text
VitalBitePayments
```

Claves principales:

- `PK = PLAN`, `SK = PLAN#{code}` para planes.
- `PK = TENANT#{tenantId}`, `SK = SUBSCRIPTION#CURRENT` para suscripcion actual.
- `PK = TENANT#{tenantId}`, `SK = PLAN_CHANGE_REQUEST#{timestamp}#{requestId}` para solicitudes de cambio.

## Endpoints V1

- `GET /plans`
- `GET /tenants/{tenantId}/subscription`
- `GET /tenants/{tenantId}/plan-change-requests`
- `POST /tenants/{tenantId}/plan-change-requests`
- `POST /tenants/{tenantId}/plan-change-requests/{requestId}/approve`
- `POST /tenants/{tenantId}/plan-change-requests/{requestId}/reject`

La solicitud de cambio registra `requestId`, plan actual, plan solicitado, estado `PENDING`, comentario opcional y fecha de solicitud.

Al aprobar una solicitud pendiente, el servicio actualiza la solicitud a `APPROVED` y cambia `SUBSCRIPTION#CURRENT` al plan solicitado. Al rechazar, actualiza la solicitud a `REJECTED` sin modificar el plan activo.

## Reglas

- El Core no persiste pagos en PostgreSQL.
- El servicio .NET es el dueno del catalogo de planes y suscripciones.
- En V1 el mismo administrador del tenant puede aprobar o rechazar solicitudes pendientes.
- Cobros reales, facturas, renovaciones y cambio de plan quedan para una fase posterior.

## Flujo futuro: Super Admin VitalBite

En una fase posterior, la aprobacion global de cambios de plan debe pasar a un rol `SUPER_ADMIN` de VitalBite. Ese rol revisaria solicitudes de todos los tenants, conciliaria cobros, aprobaria o rechazaria cambios comerciales y consultaria auditoria financiera global.

Este flujo requiere una pantalla global de tenants y no forma parte de la implementacion actual.
