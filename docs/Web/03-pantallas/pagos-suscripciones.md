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

## GraphQL

- La Web consulta información financiera mediante el Core.
- El Core integra internamente con `.NET + DynamoDB`.

## Reglas

- La Web no registra pagos directamente en PostgreSQL.
- Los datos financieros no pertenecen al modelo persistente del Core.
- Nutricionista solo ve alertas operativas si el plan limita funciones.
