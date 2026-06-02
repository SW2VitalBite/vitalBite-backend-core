# Módulo de seguimiento nutricional

## Objetivo

Controlar la evolución nutricional del paciente a lo largo del tiempo.

## Actores

- Nutricionista.
- Paciente.

## Responsabilidades

- Registrar observaciones del nutricionista.
- Controlar cumplimiento de dieta.
- Generar alertas de bajo progreso.
- Mostrar gráficos de evolución.
- Alimentar dashboard BI.

## Datos principales

- Paciente.
- Fecha.
- Observaciones.
- Cumplimiento.
- Alertas.
- Indicadores de progreso.

## Operaciones GraphQL esperadas

- `trackingByPatient`
- `createTrackingEntry`
- `updateTrackingEntry`
- `trackingSummary`
