# Módulo de seguimiento nutricional

## Objetivo

Controlar la evolución nutricional del paciente a lo largo del tiempo.

## Actores

- Nutricionista.
- Paciente.

## Responsabilidades

- Registrar observaciones del nutricionista.
- Controlar cumplimiento de dieta.
- Consultar seguimiento diario registrado por el paciente.
- Consolidar adherencia, fotos de alimentos, actividad física, estado de ánimo y metas.
- Generar alertas de bajo progreso.
- Mostrar gráficos de evolución.
- Alimentar dashboard BI.

## Datos principales

- Paciente.
- Fecha.
- Observaciones.
- Cumplimiento.
- Seguimiento diario.
- Fotos de alimentos.
- Actividad física.
- Estado de ánimo.
- Metas.
- Alertas.
- Indicadores de progreso.

## Operaciones GraphQL esperadas

- `trackingByPatient`
- `createTrackingEntry`
- `updateTrackingEntry`
- `trackingSummary`
- `dailyTrackingByPatient`
- `createDailyTrackingEntry`
- `addDailyFoodPhoto`
- `addPhysicalActivityEntry`

## Submódulo relacionado

- `seguimiento-diario`: registra desde React Native los datos diarios del paciente.

## Regla funcional

El seguimiento nutricional clínico corresponde principalmente al nutricionista. El seguimiento diario corresponde principalmente al paciente y alimenta el seguimiento clínico, reportes y dashboard BI.
