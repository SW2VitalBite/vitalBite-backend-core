# Pantalla de pagos y suscripciones

## Objetivo

Mostrar estado financiero y límites del tenant.

## Actor principal

- Administrador.

## Funciones

- Consultar plan activo.
- Consultar estado de suscripción.
- Revisar límites del tenant.
- Consultar historial de pagos o facturas si el Core lo expone.
- Mostrar alertas de vencimiento o suspensión.

## Implementacion V1

- Ruta Angular: `/payments-subscriptions`.
- Acceso: solo administrador.
- Consultas visibles:
  - Plan actual del tenant.
  - Estado de suscripcion demo.
  - Limites comerciales del plan.
  - Catalogo de planes disponibles.
  - Historial basico de solicitudes de cambio.
- El administrador puede solicitar cambio de plan desde un modal con comentario opcional.
- El administrador puede aprobar o rechazar solicitudes pendientes.
- Al aprobar, el plan activo se actualiza al plan solicitado.
- No se habilitan pagos reales ni facturacion en este corte.

## Planes iniciales

| Plan | Precio | Uso principal |
| --- | --- | --- |
| Nutricionista individual | 15 USD/mes | Consulta de una sola nutricionista |
| Clinica completa | 30 USD/mes | Equipo clinico con gestion compartida |

## GraphQL

- La Web consulta información financiera mediante el Core.
- El Core integra internamente con `.NET + DynamoDB`.
- Queries V1:
  - `subscriptionPlans`
  - `currentTenantSubscription`
  - `planChangeRequests`
- Mutations V1:
  - `requestPlanChange(input)`
  - `approvePlanChange(input)`
  - `rejectPlanChange(input)`

## Reglas

- La Web no registra pagos directamente en PostgreSQL.
- Los datos financieros no pertenecen al modelo persistente del Core.
- Nutricionista solo ve alertas operativas si el plan limita funciones.
- Las solicitudes pueden quedar `PENDING`, `APPROVED` o `REJECTED`.
- El flujo futuro de Super Admin VitalBite se documenta como gestion global de tenants, no implementada aun.
