# Módulo de medidas corporales

## Objetivo

Registrar y consultar la evolución corporal del paciente.

## Actor principal

- Nutricionista.

## Responsabilidades

- Registrar peso, talla e IMC.
- Registrar perímetros corporales.
- Registrar datos de composición corporal.
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

## Operaciones GraphQL esperadas

- `bodyMeasuresByPatient`
- `createBodyMeasure`
- `updateBodyMeasure`
- `deleteBodyMeasure`
