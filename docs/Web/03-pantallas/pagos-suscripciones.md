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
- Reintentar la generacion de factura cuando un cobro ya fue confirmado pero el PDF fallo.
- Mostrar alertas de vencimiento o suspensión.

## Implementacion V1

- Ruta Angular: `/payments-subscriptions`.
- Acceso: solo administrador.
- Si el tenant no tiene suscripcion activa, la app redirige a `/activate-plan`.
- La activacion inicial usa Stripe Checkout en modo test.
- La pantalla de compra inicial muestra los 2 planes disponibles y permite elegir cualquiera.
- Tras confirmar el pago, el sistema activa la suscripcion, genera factura PDF y habilita el panel normal.
- Si el PDF falla, la suscripcion sigue activa y la pantalla muestra el estado pendiente de factura hasta reintentarla.
- La vista actual de pagos y suscripciones queda para tenants ya activos.

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
  - `paymentHistory`
  - `planChangeRequests`
  - `checkoutSessionStatus`
- Mutations V1:
  - `createInitialCheckoutSession(input)`
  - `retryInvoiceGeneration(recordId)`
  - `requestPlanChange(input)`
  - `approvePlanChange(input)`
  - `rejectPlanChange(input)`
  - `paySubscription`

## Reglas

- La Web no registra pagos directamente en PostgreSQL.
- Los datos financieros no pertenecen al modelo persistente del Core.
- Si no existe suscripcion activa, el acceso operativo queda bloqueado hasta completar la compra.
- Las solicitudes pueden quedar `PENDING`, `APPROVED` o `REJECTED`.
- El flujo futuro de Super Admin VitalBite se documenta como gestion global de tenants, no implementada aun.
