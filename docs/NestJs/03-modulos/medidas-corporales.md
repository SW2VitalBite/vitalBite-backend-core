# Módulo de medidas corporales

## Objetivo

Registrar y consultar la evolución corporal del paciente.

## Actor principal

- Nutricionista.

## Responsabilidades

- Registrar peso, talla e IMC.
- Registrar perímetros corporales.
- Registrar datos de composición corporal.
- Registrar pliegues, diámetros y datos de antropometría avanzada.
- Calcular o consultar somatotipo y somatocarta.
- Consultar evolución por paciente.
- Alimentar reportes, seguimiento y modelos de ML.

## Datos principales

- Peso.
- Talla.
- IMC.
- Cintura.
- Cadera.
- Porcentaje de grasa.
- Masa muscular.
- Agua corporal.
- Datos de bioimpedancia.
- Pliegues corporales.
- Diámetros corporales.
- Somatotipo.
- Somatocarta.

## Operaciones GraphQL esperadas

- `bodyMeasurementsByPatient`
- `bodyMeasurementById`
- `createBodyMeasurement`
- `updateBodyMeasurement`
- `deleteBodyMeasurement`
- `bodyCompositionByPatient`
- `latestBodyComposition`
- `createBodyComposition`
- `updateBodyComposition`
- `deleteBodyComposition`

## Submódulo relacionado

- `antropometria-avanzada`: amplía las medidas corporales con pliegues, diámetros, somatotipo y somatocarta.

## Estado implementado

El tercer slice funcional del Core ya implementa medidas corporales y
composición corporal con PostgreSQL, Prisma y GraphQL Code First.

Incluye:

- Modelo `BodyMeasurement` para peso, talla, IMC, cintura y cadera.
- Modelo `BodyComposition` para grasa corporal, masa muscular, agua, grasa visceral, masa ósea y edad metabólica.
- Cálculo automático de `bmi` cuando existe talla.
- Consultas por paciente, detalle de medición y última composición corporal.
- Mutaciones de creación, actualización y eliminación lógica.
- Seed demo con evolución histórica para los cinco pacientes de prueba.

No incluye todavía antropometría avanzada, pliegues, diámetros, somatotipo ni
somatocarta.
